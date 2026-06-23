export type VideoStatus = "draft" | "processing" | "completed" | "failed";

export interface Video {
  id: string;
  projectId: string;
  storageId: string;
  name: string;
  duration: number;
  type: "video" | "audio" | "image";
  thumbnail?: string;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  thumbnail?: string;
  status: VideoStatus;
  videos: Video[];
  createdAt: string;
  updatedAt: string;
}

export interface SubtitleSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface Subtitle {
  id: string;
  videoId: string;
  language: string;
  segments: SubtitleSegment[];
  createdAt: string;
}

export interface EditDecision {
  timestamp: number;
  action: "keep" | "cut" | "transition";
  duration?: number;
  transition?: string;
}

export interface EditPlan {
  template: string;
  decisions: EditDecision[];
  music?: string;
  textOverlays?: Array<{
    text: string;
    timestamp: number;
    duration: number;
  }>;
}
