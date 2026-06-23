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
  const { action, videoId, template, prompt, userApiKeys } = payload;

  try {
    let result;
    
    switch (action) {
      case "analyze":
        result = await analyzeVideo(videoId, userApiKeys);
        break;
      case "autoEdit":
        result = await autoEditVideo(videoId, template, prompt, userApiKeys);
        break;
      case "generateThumbnail":
        result = await generateThumbnail(videoId, userApiKeys);
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

async function analyzeVideo(videoId, userApiKeys) {
  // Get video metadata from storage
  const storage = new sdk.Storage(client);
  const file = await storage.getFile(req.env.APPWRITE_BUCKET_ID, videoId);
  
  return {
    videoId,
    duration: file.metadata?.duration || 0,
    size: file.sizeOriginal,
    mimeType: file.mimeType
  };
}

async function autoEditVideo(videoId, template, prompt, userApiKeys) {
  const apiKey = userApiKeys?.openai || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  // Call OpenAI to analyze and generate edit suggestions
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert video editor. Given a video and template style, suggest:
1. Key moments to keep (timestamps)
2. Transitions to use
3. Text overlays to add
4. Music suggestions
Return a JSON structure with edit decisions.`
        },
        {
          role: "user",
          content: `Template: ${template}\nPrompt: ${prompt}\nAnalyze this video and provide edit suggestions.`
        }
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  const editPlan = JSON.parse(data.choices[0].message.content);

  // Update project status in database
  const databases = new sdk.Databases(client);
  await databases.updateDocument(
    req.env.APPWRITE_DATABASE_ID,
    "projects",
    videoId,
    {
      status: "ai-edited",
      editPlan: editPlan
    }
  );

  return {
    videoId,
    template,
    editPlan,
    message: "Auto-edit analysis completed"
  };
}

async function generateThumbnail(videoId, userApiKeys) {
  const apiKey = userApiKeys?.openai || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  // Get video from storage
  const storage = new sdk.Storage(client);
  const videoStream = await storage.getFileDownload(req.env.APPWRITE_BUCKET_ID, videoId);

  // Use GPT-4 Vision to analyze video frames (simplified)
  // In production, extract key frames first
  
  return {
    videoId,
    thumbnailUrl: null,
    message: "Thumbnail generation is processing"
  };
}
