import { apiClient } from ".";

export interface UploadResponse {
    success: boolean;
    data: {
        url: string;
        publicId: string;
    };
}

export interface DeleteImageResponse {
    message: string;
    success: boolean;
}

export const imageUploadApi = {
    uploadImage: async (formData: FormData): Promise<UploadResponse> => {
        // console.log("FORM-DATA: ", formData)

        const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    },

    // Delete image
    deleteImage: async (publicId: string): Promise<DeleteImageResponse> => {
        const response = await apiClient.delete<DeleteImageResponse>(`/upload/image/${publicId}`);
        return response;
    }
}