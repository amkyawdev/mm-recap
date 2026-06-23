"use client";

import { useState } from "react";
import { 
  Film, 
  Music, 
  Type, 
  Upload, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Scissors,
  Trash2,
  Plus,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function EditorPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(150); // 2:30
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [selectedClip, setSelectedClip] = useState(null);
  const [zoom, setZoom] = useState(1);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mock timeline tracks
  const tracks = [
    { id: "video", label: "Video", clips: [
      { id: 1, start: 0, end: 45, color: "bg-primary" },
      { id: 2, start: 50, end: 90, color: "bg-purple-500" },
      { id: 3, start: 95, end: 150, color: "bg-blue-500" },
    ]},
    { id: "audio", label: "Audio", clips: [
      { id: 4, start: 0, end: 45, color: "bg-green-500" },
      { id: 5, start: 50, end: 150, color: "bg-emerald-500" },
    ]},
    { id: "text", label: "Text", clips: [
      { id: 6, start: 10, end: 20, color: "bg-orange-500" },
      { id: 7, start: 60, end: 75, color: "bg-amber-500" },
    ]},
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Toolbar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLibraryOpen(!libraryOpen)}>
            <ChevronLeft className={cn("w-4 h-4 transition-transform", libraryOpen && "rotate-180")} />
          </Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button variant="ghost" size="icon"><Upload className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon"><Scissors className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><ZoomOut className="w-4 h-4" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} /></Button>
          <span className="text-sm text-muted-foreground w-12 text-center">{zoom}x</span>
          <Button variant="ghost" size="icon"><ZoomIn className="w-4 h-4" onClick={() => setZoom(Math.min(2, zoom + 0.25))} /></Button>
          <div className="h-6 w-px bg-border mx-2" />
          <Button variant="ghost" size="icon" onClick={() => setPropertiesOpen(!propertiesOpen)}>
            <ChevronRight className={cn("w-4 h-4 transition-transform", propertiesOpen && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Library Panel */}
        {libraryOpen && (
          <div className="w-60 bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Media Library</h3>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Videos Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Film className="w-4 h-4" /> Videos
                  </h4>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <MediaItem name="intro.mp4" duration="0:15" type="video" />
                  <MediaItem name="main-footage.mp4" duration="5:30" type="video" />
                  <MediaItem name="outro.mp4" duration="0:30" type="video" />
                </div>
              </div>

              {/* Audio Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Music className="w-4 h-4" /> Audio
                  </h4>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <MediaItem name="background-music.mp3" duration="3:00" type="audio" />
                  <MediaItem name="sfx-package" duration="-" type="audio" />
                </div>
              </div>

              {/* Text Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Type className="w-4 h-4" /> Text
                  </h4>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextPreset name="Title" />
                  <TextPreset name="Subtitle" />
                  <TextPreset name="Lower Third" />
                  <TextPreset name="Caption" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview & Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="aspect-video w-full max-w-4xl bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center gap-2">
                <Film className="w-16 h-16 opacity-50" />
                <p>Preview Area</p>
              </div>
            </div>
            
            {/* Playback Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-card/90 backdrop-blur-sm rounded-full px-6 py-3">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                className="w-12 h-12 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <SkipForward className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 bg-card border-t border-border flex flex-col">
            {/* Timeline Ruler */}
            <div className="h-8 border-b border-border flex items-end px-4">
              <div 
                className="h-full flex items-end border-l border-muted-foreground/30"
                style={{ width: `${duration * 8 * zoom}px` }}
              >
                {Array.from({ length: Math.ceil(duration / 10) + 1 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="relative"
                    style={{ width: `${10 * 8 * zoom}px` }}
                  >
                    <span className="absolute -top-6 left-0 text-xs text-muted-foreground">
                      {formatTime(i * 10)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks */}
            <div className="flex-1 overflow-auto">
              <div className="min-w-max">
                {tracks.map((track) => (
                  <div key={track.id} className="h-12 border-b border-border flex items-center">
                    {/* Track Label */}
                    <div className="w-24 px-4 flex-shrink-0 border-r border-border">
                      <span className="text-sm font-medium">{track.label}</span>
                    </div>
                    {/* Track Content */}
                    <div 
                      className="relative h-full"
                      style={{ width: `${duration * 8 * zoom}px` }}
                    >
                      {track.clips.map((clip) => (
                        <div
                          key={clip.id}
                          className={cn(
                            "absolute top-1 bottom-1 rounded cursor-pointer hover:ring-2 hover:ring-white/50 transition-all",
                            clip.color,
                            selectedClip === clip.id && "ring-2 ring-white"
                          )}
                          style={{
                            left: `${clip.start * 8 * zoom}px`,
                            width: `${(clip.end - clip.start) * 8 * zoom}px`,
                          }}
                          onClick={() => setSelectedClip(clip.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {propertiesOpen && (
          <div className="w-80 bg-card border-l border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Properties</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selectedClip ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Transform</h4>
                    <PropertySlider label="Duration" value="2:30" />
                    <PropertySlider label="Start" value="0:00" />
                    <PropertySlider label="End" value="2:30" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Audio</h4>
                    <PropertySlider label="Volume" value="100%" />
                    <PropertySlider label="Speed" value="1.0x" />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Select a clip to edit properties
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MediaItem({ name, duration, type }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
      <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center flex-shrink-0">
        {type === "video" ? <Film className="w-4 h-4 text-muted-foreground" /> : <Music className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{duration}</p>
      </div>
    </div>
  );
}

function TextPreset({ name }) {
  return (
    <div className="p-3 rounded-lg bg-secondary text-center text-sm cursor-pointer hover:bg-secondary/80 transition-colors">
      {name}
    </div>
  );
}

function PropertySlider({ label, value }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full w-3/4 bg-primary rounded-full" />
      </div>
    </div>
  );
}
