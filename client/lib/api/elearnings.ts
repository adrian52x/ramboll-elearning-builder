import { CreateELearningDto, ELearning, ELearningById } from "@/types";
import { handleAPIResponse } from "./error-handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class ELearningAPI {

    static async fetchELearnings(): Promise<ELearning[]> {
        const response = await fetch(`${API_BASE_URL}/e-learnings`);

        return handleAPIResponse<ELearning[]>(response);
    }

    static async fetchELearningById(id: number): Promise<ELearningById> {
        const response = await fetch(`${API_BASE_URL}/e-learnings/${id}`);

        return handleAPIResponse<ELearningById>(response);
    }

    static async createELearning(data: CreateELearningDto): Promise<{id: number; message: string}> {
        const response = await fetch(`${API_BASE_URL}/e-learnings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return handleAPIResponse<{id: number; message: string}>(response);
    }
    
    static async updateELearning(id: number, data: CreateELearningDto): Promise<ELearning> {
        const response = await fetch(`${API_BASE_URL}/e-learnings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return handleAPIResponse<ELearning>(response);
    }

    static async deleteELearning(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/e-learnings/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            await handleAPIResponse(response);
        }
    }
}