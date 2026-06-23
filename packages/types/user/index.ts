export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: "free" | "pro";
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  openaiKey?: string;
  geminiKey?: string;
  elevenlabsKey?: string;
  theme: "light" | "dark" | "system";
}

export interface PlatformCredentials {
  platform: "youtube" | "tiktok";
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface PublishMetadata {
  title: string;
  description: string;
  tags?: string[];
  thumbnail?: string;
  privacy?: "public" | "private" | "unlisted";
  scheduledAt?: string;
}
