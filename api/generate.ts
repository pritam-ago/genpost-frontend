import axios from 'axios';

const API_BASE_URL = 'https://gp-backend-iota.vercel.app';

interface GeneratedContent {
    content: string;
    hashtags: string[];
}

interface GeneratePostResponse {
    platforms: Record<string, GeneratedContent>;
}

export const generatePost = async (prompt: string, platforms: string[]): Promise<GeneratePostResponse> => {
    try {
        const response = await axios.post<GeneratePostResponse>(`${API_BASE_URL}/api/generate`, { prompt, platforms });
        return response.data;
    } catch (error: any) {
        console.error("Error generating post:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Failed to generate post");
    }
};
