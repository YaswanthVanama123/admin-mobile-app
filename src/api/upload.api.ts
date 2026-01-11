import { apiClient } from './client';
import { ApiResponse } from './types';

export interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export const uploadApi = {
  /**
   * Upload a single file
   */
  uploadFile: async (file: File | any, folder?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.post<ApiResponse<UploadResponse>>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Upload multiple files
   */
  uploadFiles: async (files: File[] | any[], folder?: string): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.post<ApiResponse<UploadResponse[]>>(
      '/upload/multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Upload image (optimized for images)
   */
  uploadImage: async (file: File | any, options?: {
    folder?: string;
    resize?: boolean;
    width?: number;
    height?: number;
  }): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.resize) {
      formData.append('resize', 'true');
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());
    }

    const response = await apiClient.post<ApiResponse<UploadResponse>>(
      '/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Delete uploaded file
   */
  deleteFile: async (filename: string): Promise<void> => {
    await apiClient.delete(`/upload/${filename}`);
  },

  /**
   * Get upload URL (for direct uploads)
   */
  getUploadUrl: async (filename: string, mimetype: string): Promise<{ uploadUrl: string; fileUrl: string }> => {
    const response = await apiClient.post<ApiResponse<{ uploadUrl: string; fileUrl: string }>>(
      '/upload/url',
      { filename, mimetype }
    );
    return response.data.data;
  },
};
