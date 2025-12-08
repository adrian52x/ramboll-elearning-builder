import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from './storage.config';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
    private storageConfig: StorageConfig;

    constructor(private configService: ConfigService) {
        this.storageConfig = new StorageConfig(configService);
        this.init();
    }

    private async init() {
        try {
            await this.storageConfig.ensureBucketExists();
        } catch (error) {
            console.error('Failed to initialize storage:', error);
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        // Validate file type
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'video/quicktime',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only images (jpeg, png, gif, webp) and videos (mp4, webm, mov) are allowed.',
            );
        }

        // Validate file size (500MB max)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size exceeds 50MB limit');
        }

        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `uploads/${fileName}`;
        const bucketName = this.storageConfig.getBucketName();
        const s3Client = this.storageConfig.getS3Client();

        // Upload to S3-compatible storage (MinIO)
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        const endpoint = this.storageConfig.getEndpoint();
        return `${endpoint}/${bucketName}/${filePath}`;
    }

  async deleteFile(fileUrl: string): Promise<void> {
        try {
            const bucketName = this.storageConfig.getBucketName();
            const s3Client = this.storageConfig.getS3Client();
            
            // Extract file path from URL
            // URL format: http://localhost:9000/bucket-name/uploads/file.jpg
            const urlParts = fileUrl.split(`/${bucketName}/`);
            const filePath = urlParts[1];

            if (!filePath) {
                throw new BadRequestException('Invalid file URL');
            }

            await s3Client.send(
                new DeleteObjectCommand({
                Bucket: bucketName,
                Key: filePath,
                }),
            );
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw new BadRequestException('Failed to delete file');
        }
    }
}
