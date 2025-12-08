import {
    Controller,
    Post,
    Delete,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('api/uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('Upload request received');
        console.log('File:', file);
        
        if (!file) {
            console.error('No file in request');
            throw new BadRequestException('No file provided');
        }

        try {
            const url = await this.uploadsService.uploadFile(file);
            console.log('File uploaded successfully:', url);
            return {
                success: true,
                url,
                message: 'File uploaded successfully',
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw new BadRequestException(error.message || 'Failed to upload file');
        }
    }

    @Delete()
    async deleteFile(@Body('url') url: string) {
        if (!url) {
            throw new BadRequestException('No URL provided');
        }

        try {
            await this.uploadsService.deleteFile(url);
            return {
                success: true,
                message: 'File deleted successfully',
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to delete file');
        }
    }
}
