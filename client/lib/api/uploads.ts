const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for FormData
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        try {
            const error = JSON.parse(errorText);
            throw new Error(error.message || 'Failed to upload file');
        } catch (e) {
            throw new Error(errorText || 'Failed to upload file');
        }
    }

    const data = await response.json();
    return data.url;
}

export async function deleteFile(url: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete file');
    }
}
