import { Collection, Db, MongoClient } from 'mongodb'
import { envConfig } from '~/constants/config'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'

const uri = `mongodb://${envConfig.dbUsername}:${envConfig.dbPassword}@${envConfig.dbHost}:${envConfig.dbPort}`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }

  async connect() {
    try {
      await this.client.connect()

      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')

      await this.createCollectionsIfNotExist()

      await this.indexUsers()
      await this.indexRefreshTokens()
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  async createCollectionsIfNotExist() {
    const collections = await this.db.listCollections({}, { nameOnly: true }).toArray()
    const collectionNames = collections.map((coll) => coll.name)

    if (!collectionNames.includes('users')) {
      await this.db.createCollection('users')
      console.log('Created collection "users"')
    }

    if (!collectionNames.includes('refresh_tokens')) {
      await this.db.createCollection('refresh_tokens')
      console.log('Created collection "refresh_tokens"')
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1'])

    if (!exists) {
      await this.users.createIndex({ email: 1, password: 1 })
      await this.users.createIndex({ email: 1 }, { unique: true })

      console.log('Created indexes on "users" collection')
    }
  }

  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!exists) {
      await this.refreshTokens.createIndex({ token: 1 })
      await this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
      console.log('Created indexes on "refresh_tokens" collection')
    }
  }

  get users(): Collection<User> {
    return this.db.collection('users')
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refresh_tokens')
  }
}

const databaseService = new DatabaseService()
export default databaseService
