import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request } from 'express'
import fsPromise from 'fs/promises'
import mime from 'mime'
import path from 'path'
import sharp from 'sharp'
import { isProduction } from '~/constants/config'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Others'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { getUrlPresigned, uploadFileToS3, uploadFileToS3Presigned } from '~/utils/s3'

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newPath)

        // const s3Result = await uploadFileToS3({
        //   filename: 'images/' + newFullFilename,
        //   filepath: newPath,
        //   contentType: mime.getType(newPath) as string
        // })
        await Promise.all([fsPromise.unlink(file.filepath)])
        // return {
        //   url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
        //   type: MediaType.Image
        // }
        return {
          url: isProduction
            ? `/static/image/${newFullFilename}`
            : `http://localhost:${process.env.PORT}/static/image/${newFullFilename}`,
          name: newFullFilename,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async SignUrlAccess(key: string) {
    const PresignedUrl = await getUrlPresigned(key)
    console.log(key)
    return PresignedUrl
    // await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
    // return {
    //   url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
    //   type: MediaType.Image
    // }
    // return {
    //   url: isProduction
    //     ? `${process.env.HOST}/static/image/${newFullFilename}`
    //     : `http://localhost:${process.env.PORT}/static/image/${newFullFilename}`,
    //   type: MediaType.Image
    // }
  }

  async uploadImagePresigned(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        console.log(newName)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const PresignedUrl = await uploadFileToS3Presigned({
          filename: newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        console.log(PresignedUrl)
        return PresignedUrl
        // await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        // return {
        //   url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
        //   type: MediaType.Image
        // }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/image/${newFullFilename}`
        //     : `http://localhost:${process.env.PORT}/static/image/${newFullFilename}`,
        //   type: MediaType.Image
        // }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + file.newFilename,
          contentType: mime.getType(file.filepath) as string,
          filepath: file.filepath
        })
        fsPromise.unlink(file.filepath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/video/${file.newFilename}`
        //     : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        //   type: MediaType.Video
        // }
      })
    )
    return result
  }
}

const mediasService = new MediasService()

export default mediasService
