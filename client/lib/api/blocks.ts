const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getAllBlocks() {
    const response = await fetch(`${API_BASE_URL}/api/blocks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch blocks');
    }

    return response.json();
}

export class BlockAPI {

    static async getAllBlocks() {
        const response = await fetch(`${API_BASE_URL}/api/blocks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch blocks');
        }
        return response.json();
    }
}