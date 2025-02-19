import { io } from 'socket.io-client'
import config from 'src/constants/config'
import { getAccessTokenFromLS } from './app'
const socket = io(config.baseUrl, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLS()}`
  }
})

export default socket
