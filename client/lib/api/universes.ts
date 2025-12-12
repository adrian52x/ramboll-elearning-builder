import { Universe } from "@/types";
import { handleAPIResponse } from "./error-handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class UniverseAPI {
    static async fetchUniverses(): Promise<Universe[]> {
        const response = await fetch(`${API_BASE_URL}/api/universes`);
        
        return handleAPIResponse<Universe[]>(response);
    }
}