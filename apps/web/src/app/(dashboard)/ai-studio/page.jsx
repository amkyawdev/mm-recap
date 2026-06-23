"use client";

import { useState } from "react";
import { Sparkles, Upload, Link as LinkIcon, ArrowRight, ArrowLeft, Check, Loader2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const templates = [
  { id: "vlog", name: "Vlog", icon: "📹", description: "Dynamic cuts with music sync" },
  { id: "cinematic", name: "Cinematic", icon: "🎬", description: "Film-like transitions" },
  { id: "cooking", name: "Cooking", icon: "🍳", description: "Perfect for recipe videos" },
  { id: "tech", name: "Tech Review", icon: "💻", description: "Gadget showcase style" },
  { id: "gaming", name: "Gaming", icon: "🎮", description: "Fast-paced highlights" },
  { id: "tutorial", name: "Tutorial", icon: "📚", description: "Educational content" },
];

const steps = [
  { id: 1, name: "Select Source", icon: Upload },
  { id: 2, name: "Choose Template", icon: Sparkles },
  { id: 3, name: "Customize", icon: Film },
  { id: 4, name: "Generate", icon: Loader2 },
];

export default function AIStudioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [videoSource, setVideoSource] = useState("upload"); // "upload" or "youtube"
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setCurrentStep(4);
    
    // Simulate generation progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setIsGenerating(false), 500);
      }
      setProgress(p);
    }, 500);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return videoSource === "upload" || youtubeUrl.length > 0;
      case 2:
        return selectedTemplate !== null;
      case 3:
        return prompt.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          AI Auto-Edit Studio
        </h1>
        <p className="text-muted-foreground mt-2">
          Let AI transform your raw footage into polished content
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-sm mt-2 ${
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="min-h-[400px]">
        <CardContent className="p-8">
          {/* Step 1: Select Source */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Select Your Video Source</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    videoSource === "upload"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setVideoSource("upload")}
                >
                  <Upload className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Upload Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a video file from your device
                  </p>
                </div>
                
                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    videoSource === "youtube"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setVideoSource("youtube")}
                >
                  <LinkIcon className="w-8 h-8 mb-4 text-red-500" />
                  <h3 className="font-semibold mb-2">YouTube Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste a YouTube video URL
                  </p>
                </div>
              </div>

              {videoSource === "upload" ? (
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    MP4, MOV, or WEBM (max 2GB)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube URL</label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Choose Template */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Choose a Template</h2>
              <p className="text-muted-foreground">
                Select a style that best matches your content
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <span className="text-4xl mb-4 block">{template.icon}</span>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Customize */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Customize Your Edit</h2>
              <p className="text-muted-foreground">
                Tell us about your video and how you want it edited
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">What is this video about?</label>
                  <textarea
                    className="w-full h-32 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Describe your video content, the key moments, and any specific editing style you prefer..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary">
                    <p className="text-sm font-medium mb-2">Estimated Duration</p>
                    <p className="text-2xl font-bold">2-5 minutes</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary">
                    <p className="text-sm font-medium mb-2">Template</p>
                    <p className="text-2xl font-bold">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Generate */}
          {currentStep === 4 && (
            <div className="space-y-8 text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                {isGenerating ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <Check className="w-10 h-10 text-primary" />
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {isGenerating ? "Generating Your Video..." : "Video Generated!"}
                </h2>
                <p className="text-muted-foreground">
                  {isGenerating
                    ? "AI is analyzing your footage and creating the perfect edit"
                    : "Your video is ready for preview"
                  }
                </p>
              </div>

              {isGenerating && (
                <div className="max-w-md mx-auto space-y-2">
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                </div>
              )}

              {!isGenerating && (
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Start Over
                  </Button>
                  <Button className="gap-2">
                    Preview Video
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
