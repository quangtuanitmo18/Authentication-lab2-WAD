import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV
const envFilename = `.env.${env}`
if (!env) {
  console.log(`You did not provide the NODE_ENV environment variable (e.g., development, production)`)
  console.log(`Detected NODE_ENV = ${env}`)
  process.exit(1)
}
console.log(`Detected NODE_ENV = ${env}, so the app will use the environment file ${envFilename}`)
if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Environment file ${envFilename} not found`)
  console.log(
    `Note: The app does not use the .env file. For example, if the environment is development, the app will use the .env.development file`
  )
  console.log(`Please create the file ${envFilename} and refer to .env.example for the content`)
  process.exit(1)
}
config({
  path: envFilename
})

export const isProduction = env === 'production'
export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  host: process.env.HOST as string,
  dbName: process.env.DB_NAME as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbHost: process.env.DB_HOST as string,
  dbPort: (process.env.DB_PORT as string) || 27017,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string,
  clientUrl: process.env.CLIENT_URL as string,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  s3Region: process.env.S3_REGION as string,
  sesRegion: process.env.SES_REGION as string,
  sesFromAddress: process.env.SES_FROM_ADDRESS as string,
  s3BucketName: process.env.S3_BUCKET as string,
  mailerHost: process.env.MAILER_HOST as string,
  mailerPort: process.env.MAILER_PORT as string,
  mailerUserEmail: process.env.MAILER_EMAIL_USER as string,
  mailerUserPass: process.env.MAILER_EMAIL_PASS as string
}
