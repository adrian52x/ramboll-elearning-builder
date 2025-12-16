// Custom error class for API errors
export class APIError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: any
    ) {
        super(message);
        this.name = "APIError";
        
        // Set the prototype explicitly for instanceof to work correctly
        // This is needed for proper prototype chain in TypeScript when extending Error
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

/**
 * Centralized handler for API responses. Uses generics <T> to provide type safety since response.json()
 * returns 'any'. Automatically parses errors and throws APIError with status codes for TanStack Query.
 */
export async function handleAPIResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        let errorDetails;
        
        try {
            const errorData = await response.json();
            console.log(errorData);
            
            errorMessage = errorData.message || errorData.error || errorMessage;
            errorDetails = errorData;
        } catch {
            // If parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
        }

        throw new APIError(errorMessage, response.status, errorDetails);
    }

    try {
        return await response.json();
    } catch (error) {
        throw new APIError("Failed to parse response", response.status);
    }
}

// Get user-friendly error message
export function getErrorMessage(error: unknown): string {
    if (error instanceof APIError) {
        return `${error.message} - (Status: ${error.statusCode})`;
    }
    
    if (error instanceof Error) {
        return error.message;
    }
    
    if (typeof error === "string") {
        return error;
    }
    
    return "An unexpected error occurred";
}
