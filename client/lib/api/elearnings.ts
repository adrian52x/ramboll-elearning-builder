import { CreateELearningDto, ELearning, ELearningById } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function fetchELearnings(): Promise<ELearning[]> {
    const response = await fetch(`${API_BASE_URL}/e-learnings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch e-learnings: ${response.statusText}`);
    }

    return response.json();
}

export async function fetchELearningById(id: number): Promise<ELearningById> {
    const response = await fetch(`${API_BASE_URL}/e-learnings/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch e-learning: ${response.statusText}`);
    }

    return response.json();
}

export async function createELearning(data: CreateELearningDto): Promise<ELearning> {
    const response = await fetch(`${API_BASE_URL}/e-learnings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Failed to create e-learning: ${error.message || response.statusText}`);
    }

    return response.json();
}

export async function updateELearning(id: number, data: CreateELearningDto): Promise<ELearning> {
    const response = await fetch(`${API_BASE_URL}/e-learnings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Failed to update e-learning: ${error.message || response.statusText}`);
    }

    return response.json();
}

export async function deleteELearning(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/e-learnings/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete e-learning: ${response.statusText}`);
    }
}
