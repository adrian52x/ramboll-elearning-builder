# File Upload Setup Guide

## Overview

The file upload system uses MinIO with S3-compatible API for object storage.

## Local Development with MinIO

### 1. Start MinIO with Docker Compose

MinIO is already configured in `docker-compose.yml`. Start it with:

```bash
docker-compose up -d minio
```

### 2. Access MinIO Console

Open http://localhost:9002 in your browser

- **Username**: minioadmin
- **Password**: minioadmin

### 3. Environment Variables

Add to your `.env` file:

```env
# Storage Configuration (MinIO - S3 Compatible)
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET_NAME=elearning-resources
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_REGION=us-east-1
```

The bucket will be created automatically on application startup.

## API Endpoints

### Upload File

**POST** `/api/uploads`

- **Body**: `multipart/form-data` with `file` field
- **Returns**: `{ success: true, url: string, message: string }`
- **Max Size**: 50MB
- **Allowed Types**: 
  - Images: jpeg, png, gif, webp
  - Videos: mp4, webm, mov

**Example using fetch:**

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('http://localhost:3000/api/uploads', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.url); // Use this URL in your e-learning blocks
```

### Delete File

**DELETE** `/api/uploads`

- **Body**: `{ "url": "file-url-to-delete" }`
- **Returns**: `{ success: true, message: string }`

## Frontend Usage

The `ImageBlockForm` component now supports both file uploads and URL input:

```tsx
<ImageBlockForm
  imageUrls={imageUrls}
  onImageUrlsChange={setImageUrls}
/>
```

Features:
- File upload with preview
- URL input fallback
- Multiple images support
- Upload progress indicator
- File validation (type and size)
- Error handling

## File Storage Structure

Files are stored with unique UUIDs:

```
bucket-name/
  └── uploads/
      ├── uuid-1.jpg
      ├── uuid-2.png
      └── uuid-3.mp4
```

## Troubleshooting

### MinIO Connection Issues

1. Ensure MinIO container is running: `docker ps`
2. Check MinIO logs: `docker logs ramboll-elearning-minio`
3. Verify credentials in `.env` match docker-compose settings

### File Upload Fails

1. Check file size (max 50MB)
2. Verify file type is allowed
3. Check backend logs for detailed errors
4. Ensure bucket has correct permissions

### Files Not Accessible

1. Verify bucket policy allows public read access
2. Check that MinIO is accessible at the configured endpoint
3. Ensure files are uploaded with `ACL: 'public-read'`

## Security Considerations

- File types are validated on backend
- File sizes are limited to prevent abuse
- Filenames are sanitized using UUIDs
- Consider adding authentication to upload endpoint for production
- Implement rate limiting for upload endpoint
- Change default MinIO credentials in production
