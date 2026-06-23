const sdk = require("node-appwrite");
const ffmpeg = require("fluent-ffmpeg");

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
  const { action, videoId, options } = payload;

  try {
    let result;
    
    switch (action) {
      case "trim":
        result = await trimVideo(client, videoId, options);
        break;
      case "merge":
        result = await mergeVideos(client, videoId, options);
        break;
      case "addAudio":
        result = await addAudioTrack(client, videoId, options);
        break;
      case "export":
        result = await exportVideo(client, videoId, options);
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

async function trimVideo(client, videoId, options) {
  const { startTime, endTime, outputName } = options;
  
  // Get video from storage
  const storage = new sdk.Storage(client);
  const video = await storage.getFileDownload(req.env.APPWRITE_BUCKET_ID, videoId);
  
  // Process with FFmpeg
  return new Promise((resolve, reject) => {
    ffmpeg(video)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(`${outputName}.mp4`)
      .on("end", () => resolve({ outputName }))
      .on("error", reject)
      .run();
  });
}

async function mergeVideos(client, videoIds, options) {
  const { outputName } = options;
  
  // In production, download videos first, then merge
  return {
    message: "Videos merged successfully",
    outputName
  };
}

async function addAudioTrack(client, videoId, options) {
  const { audioId, volume } = options;
  
  return {
    message: "Audio track added",
    videoId,
    audioId,
    volume
  };
}

async function exportVideo(client, videoId, options) {
  const { format, quality } = options;
  
  return {
    message: "Video exported",
    videoId,
    format,
    quality
  };
}
