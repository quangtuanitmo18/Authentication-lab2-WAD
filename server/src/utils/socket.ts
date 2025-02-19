import { Server as ServerHttp } from 'http'
import { DefaultEventsMap, Server } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import { verifyAccessToken } from '~/utils/commons'

let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export const initSocket = (httpServer: ServerHttp) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  // middleware
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }
    console.log(users)
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth

      console.log(access_token)
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user ${socket.id} disconnected`)
    })
  })
  return io
}
export const getIO = (): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Make sure to call initSocket() first.')
  }
  return io
}
