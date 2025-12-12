import { Block } from "@/types/api-responses";
import { handleAPIResponse } from "./error-handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export class BlockAPI {

    static async getAllBlocks(): Promise<Block[]> {
        const response = await fetch(`${API_BASE_URL}/api/blocks`);
        
        return handleAPIResponse<Block[]>(response);
    }
}