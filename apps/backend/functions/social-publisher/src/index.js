const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();
  
  if (!req.env.APPWRITE_FUNCTION_API_KEY || !req.env.APPWRITE_ENDPOINT) {
    throw new Error("Missing required environment variables");
  }
  
  client
    .setEndpoint(req.env.APPWRITE_ENDPOINT)
    .setProject(req.env.APPWRITE_PROJECT_ID)
    .setKey(req.env.APPWRITE_FUNCTION_API_KEY);

  const payload = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload;
  const { action, platform, videoId, metadata, credentials } = payload;

  try {
    let result;
    
    switch (action) {
      case "publish":
        if (platform === "youtube") {
          result = await publishToYouTube(videoId, metadata, credentials);
        } else if (platform === "tiktok") {
          result = await publishToTikTok(videoId, metadata, credentials);
        }
        break;
      case "auth":
        result = await generateAuthUrl(platform);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
};

async function publishToYouTube(videoId, metadata, credentials) {
  const { google } = require("googleapis");
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: credentials.accessToken,
    refresh_token: credentials.refreshToken
  });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  // Get video from Appwrite storage
  const storage = new sdk.Storage(client);
  const videoStream = await storage.getFileDownload(req.env.APPWRITE_BUCKET_ID, videoId);

  // Upload to YouTube
  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title: metadata.title || "Untitled Video",
        description: metadata.description || "",
        tags: metadata.tags || [],
        categoryId: "22" // People & Blogs
      },
      status: {
        privacyStatus: metadata.privacy || "public",
        publishAt: metadata.scheduledAt
      }
    },
    media: {
      body: videoStream
    }
  });

  // Store result in database
  const databases = new sdk.Databases(client);
  await databases.createDocument(
    req.env.APPWRITE_DATABASE_ID,
    "publish_history",
    "unique()",
    {
      platform: "youtube",
      videoId,
      youtubeVideoId: response.data.id,
      youtubeUrl: `https://youtube.com/watch?v=${response.data.id}`,
      publishedAt: new Date().toISOString()
    }
  );

  return {
    platform: "youtube",
    videoId: response.data.id,
    url: `https://youtube.com/watch?v=${response.data.id}`
  };
}

async function publishToTikTok(videoId, metadata, credentials) {
  const axios = require("axios");
  
  // TikTok API integration (simplified)
  // Note: TikTok API access requires special approval
  
  const accessToken = credentials.accessToken;

  // Get video from storage
  const storage = new sdk.Storage(client);
  const videoFile = await storage.getFile(req.env.APPWRITE_BUCKET_ID, videoId);
  
  // Note: TikTok API requires direct video upload
  // This is a simplified example
  const tiktokResponse = await axios.post(
    "https://open.tiktokapis.com/v2/video/upload/",
    {
      title: metadata.title,
      description: metadata.description,
      // Video upload would go here
    },
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );

  return {
    platform: "tiktok",
    videoId: tiktokResponse.data.video_id,
    url: `https://tiktok.com/@user/video/${tiktokResponse.data.video_id}`
  };
}

async function generateAuthUrl(platform) {
  const { google } = require("googleapis");
  
  if (platform === "youtube") {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube"
      ]
    });

    return {
      platform: "youtube",
      authUrl
    };
  }

  throw new Error("Unsupported platform for OAuth");
}
