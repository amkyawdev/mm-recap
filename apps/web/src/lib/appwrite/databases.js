import { databases } from "./client";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "recap";
const PROJECTS_COLLECTION_ID = "projects";
const VIDEOS_COLLECTION_ID = "videos";
const SETTINGS_COLLECTION_ID = "settings";

export const dbService = {
  // Projects
  async listProjects(userId) {
    return await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ]);
  },

  async createProject(data) {
    return await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, "unique()", {
      ...data,
      status: "draft",
    });
  },

  async getProject(projectId) {
    return await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
  },

  async updateProject(projectId, data) {
    return await databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId, data);
  },

  async deleteProject(projectId) {
    return await databases.deleteDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
  },

  // Videos
  async listVideos(projectId) {
    return await databases.listDocuments(DATABASE_ID, VIDEOS_COLLECTION_ID, [
      Query.equal("projectId", projectId),
      Query.orderAsc("$createdAt"),
    ]);
  },

  async uploadVideoMetadata(data) {
    return await databases.createDocument(DATABASE_ID, VIDEOS_COLLECTION_ID, "unique()", data);
  },

  // Settings
  async getSettings(userId) {
    const response = await databases.listDocuments(DATABASE_ID, SETTINGS_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.limit(1),
    ]);
    return response.documents[0] || null;
  },

  async saveSettings(userId, data) {
    const existing = await this.getSettings(userId);
    if (existing) {
      return await databases.updateDocument(DATABASE_ID, SETTINGS_COLLECTION_ID, existing.$id, data);
    }
    return await databases.createDocument(DATABASE_ID, SETTINGS_COLLECTION_ID, "unique()", {
      userId,
      ...data,
    });
  },
};
