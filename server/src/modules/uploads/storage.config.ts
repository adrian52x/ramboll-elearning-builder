import { 
    S3Client, 
    HeadBucketCommand, 
    CreateBucketCommand,
    PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export class StorageConfig {
    private s3Client: S3Client;
    private bucketName: string;
    private endpoint: string;

    constructor(private configService: ConfigService) {
        this.endpoint = this.configService.get('MINIO_ENDPOINT', 'http://localhost:9000');
        this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'elearning-resources');

        // S3-compatible client for MinIO
        this.s3Client = new S3Client({
            region: this.configService.get('MINIO_REGION', 'us-east-1'),
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
                secretAccessKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    getS3Client(): S3Client {
        return this.s3Client;
    }

    getBucketName(): string {
        return this.bucketName;
    }

    getEndpoint(): string {
        return this.endpoint;
    }

    async ensureBucketExists(): Promise<void> {
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
            console.log(`Bucket ${this.bucketName} already exists.`);
            // Set public read policy
            await this.setPublicReadPolicy();
        } catch (error) {
            // Bucket doesn't exist, create it
            try {
                await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
                console.log(`Bucket ${this.bucketName} created.`);
                // Set public read policy
                await this.setPublicReadPolicy();
            } catch (createError) {
                console.error('Failed to create bucket:', createError);
            }
        }
    }

    private async setPublicReadPolicy(): Promise<void> {
        const policy = {
        Version: '2012-10-17',
        Statement: [
            {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
        ],
        };

        try {
            await this.s3Client.send(
                new PutBucketPolicyCommand({
                Bucket: this.bucketName,
                Policy: JSON.stringify(policy),
                }),
            );
            console.log(`Public read policy set for bucket ${this.bucketName}`);
        } catch (error) {
            console.error('Failed to set bucket policy:', error);
        }
    }
}
