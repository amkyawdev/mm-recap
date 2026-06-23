"use client";

import { useState } from "react";
import { Upload, Youtube, Music, ArrowRight, Check, ExternalLink, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const platforms = [
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "tiktok", name: "TikTok", icon: Music, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const steps = [
  { id: 1, name: "Select Video" },
  { id: 2, name: "Platforms" },
  { id: 3, name: "Meta-Data" },
  { id: 4, name: "Publish" },
];

export default function PublishPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState({ youtube: true, tiktok: false });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    schedule: false,
    scheduleDate: "",
    scheduleTime: "",
  });

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = () => {
    // Implement publish logic
    console.log("Publishing to:", selectedPlatforms);
    console.log("Form data:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          Publish to Social
        </h1>
        <p className="text-muted-foreground mt-2">
          Share your video with the world
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={`flex-1 h-2 rounded-full transition-all ${
                currentStep > step.id
                  ? "bg-primary"
                  : currentStep === step.id
                  ? "bg-primary/50"
                  : "bg-secondary"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-muted-foreground mb-8">
        {steps.map((step) => (
          <span
            key={step.id}
            className={currentStep === step.id ? "text-primary font-medium" : ""}
          >
            {step.name}
          </span>
        ))}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Select Video */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Video to Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 1, title: "Recap #5", thumbnail: null, duration: "5:30" },
                  { id: 2, title: "Vlog Edit", thumbnail: null, duration: "10:15" },
                  { id: 3, title: "Tech Review", thumbnail: null, duration: "8:45" },
                ].map((video) => (
                  <div
                    key={video.id}
                    className={`rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                      selectedVideo === video.id
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <div className="aspect-video bg-secondary flex items-center justify-center">
                      {selectedVideo === video.id ? (
                        <Check className="w-8 h-8 text-primary" />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium truncate">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Platforms */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${platform.bg} flex items-center justify-center`}>
                        <platform.icon className={`w-6 h-6 ${platform.color}`} />
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{platform.name}</h3>
                    
                    {connectedAccounts[platform.id] ? (
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <Check className="w-4 h-4" />
                        Connected
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="mt-2 gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Connect Account
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {selectedPlatforms.length === 0 && (
                <p className="text-center text-muted-foreground">
                  Select at least one platform to continue
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Meta-Data */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full h-32 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter video description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  placeholder="gaming, tutorial, review"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm">Upload thumbnail or generate with AI</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="schedule"
                  checked={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="schedule" className="text-sm font-medium">
                  Schedule for later
                </label>
              </div>

              {formData.schedule && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Publish */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Ready to Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId);
                  return (
                    <div key={platformId} className="p-4 rounded-lg bg-secondary flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${platform.bg} flex items-center justify-center`}>
                        <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      </div>
                      <span className="font-medium">{platform.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-lg bg-secondary space-y-2">
                <h4 className="font-medium">{formData.title || "Untitled Video"}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.description || "No description"}
                </p>
              </div>

              {formData.schedule && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Scheduled for {formData.scheduleDate} at {formData.scheduleTime}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        
        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handlePublish}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {formData.schedule ? "Schedule" : "Publish Now"}
          </Button>
        )}
      </div>
    </div>
  );
}
