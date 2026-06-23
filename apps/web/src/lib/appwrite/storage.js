import { storage } from "./client";

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "videos";

export const storageService = {
  async uploadVideo(file, onProgress) {
    return await storage.createFile(BUCKET_ID, "unique()", file, onProgress);
  },

  async getVideoPreview(fileId) {
    return storage.getFilePreview(BUCKET_ID, fileId);
  },

  async getVideoDownload(fileId) {
    return storage.getFileDownload(BUCKET_ID, fileId);
  },

  async deleteVideo(fileId) {
    return await storage.deleteFile(BUCKET_ID, fileId);
  },

  getFileUrl(fileId) {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  },
};
