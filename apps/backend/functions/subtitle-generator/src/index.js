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
  const { action, videoId, language } = payload;

  try {
    let result;
    
    switch (action) {
      case "transcribe":
        result = await transcribeVideo(videoId, language);
        break;
      case "generateSRT":
        result = await generateSRT(videoId);
        break;
      case "generateVTT":
        result = await generateVTT(videoId);
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

async function transcribeVideo(videoId, language = "en") {
  const openAIKey = req.env.OPENAI_API_KEY;
  
  if (!openAIKey) {
    throw new Error("OpenAI API key not configured");
  }

  // Get video from storage
  const storage = new sdk.Storage(client);
  const videoStream = await storage.getFileDownload(req.env.APPWRITE_BUCKET_ID, videoId);

  // Convert to form data for OpenAI
  const FormData = require("form-data");
  const form = new FormData();
  form.append("file", videoStream, "video.mp4");
  form.append("model", "whisper-1");
  form.append("language", language);
  form.append("response_format", "verbose_json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openAIKey}`,
      ...form.getHeaders()
    },
    body: form
  });

  const transcription = await response.json();

  return {
    videoId,
    segments: transcription.segments,
    text: transcription.text,
    language: transcription.language
  };
}

async function generateSRT(videoId) {
  // Get transcription from database
  const databases = new sdk.Databases(client);
  const transcript = await databases.getDocument(
    req.env.APPWRITE_DATABASE_ID,
    "transcripts",
    videoId
  );

  // Convert to SRT format
  const srt = transcript.segments
    .map((seg, i) => {
      const startTime = formatSRTTime(seg.start);
      const endTime = formatSRTTime(seg.end);
      return `${i + 1}\n${startTime} --> ${endTime}\n${seg.text}`;
    })
    .join("\n\n");

  return {
    videoId,
    format: "srt",
    content: srt
  };
}

async function generateVTT(videoId) {
  // Get transcription from database
  const databases = new sdk.Databases(client);
  const transcript = await databases.getDocument(
    req.env.APPWRITE_DATABASE_ID,
    "transcripts",
    videoId
  );

  // Convert to VTT format
  const vtt = "WEBVTT\n\n" + transcript.segments
    .map(seg => {
      const startTime = formatVTTTime(seg.start);
      const endTime = formatVTTTime(seg.end);
      return `${startTime} --> ${endTime}\n${seg.text}`;
    })
    .join("\n\n");

  return {
    videoId,
    format: "vtt",
    content: vtt
  };
}

function formatSRTTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
}

function formatVTTTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}
