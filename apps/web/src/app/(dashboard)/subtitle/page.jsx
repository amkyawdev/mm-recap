"use client";

import { useState } from "react";
import { Play, Pause, Plus, Wand2, Download, Trash2, Edit2, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock subtitle data
const initialSubtitles = [
  { id: 1, start: 0, end: 3, text: "Welcome to today's video!" },
  { id: 2, start: 4, end: 8, text: "Today we're going to talk about something amazing" },
  { id: 3, start: 9, end: 14, text: "Let's get started with the first topic" },
  { id: 4, start: 15, end: 20, text: "This is going to be really interesting" },
  { id: 5, start: 21, end: 26, text: "Make sure to like and subscribe" },
];

export default function SubtitlePage() {
  const [subtitles, setSubtitles] = useState(initialSubtitles);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30);
  const [editingId, setEditingId] = useState(null);
  const [generating, setGenerating] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const handleAutoGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      // Add generated subtitles logic here
    }, 3000);
  };

  const handleExport = () => {
    const srtContent = subtitles
      .sort((a, b) => a.start - b.start)
      .map((sub, index) => {
        const startTime = formatSRTTime(sub.start);
        const endTime = formatSRTTime(sub.end);
        return `${index + 1}\n${startTime} --> ${endTime}\n${sub.text}`;
      })
      .join("\n\n");

    const blob = new Blob([srtContent], { type: "text/srt" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSRTTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
  };

  const updateSubtitle = (id, newText) => {
    setSubtitles(subtitles.map(sub => 
      sub.id === id ? { ...sub, text: newText } : sub
    ));
    setEditingId(null);
  };

  const deleteSubtitle = (id) => {
    setSubtitles(subtitles.filter(sub => sub.id !== id));
  };

  const jumpToTime = (time) => {
    setCurrentTime(time);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex gap-6">
      {/* Video Preview Panel */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Video Area */}
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative mb-4">
              <div className="text-muted-foreground">Video Preview</div>
              
              {/* Subtitle Overlay */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 rounded text-white text-lg">
                {subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end)?.text || ""}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-secondary rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percent = x / rect.width;
                    setCurrentTime(percent * duration);
                  }}
                >
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-mono text-muted-foreground w-20 text-right">
                {formatTime(currentTime)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subtitle Track Panel */}
      <div className="w-[450px] flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Subtitle Track</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleAutoGenerate}
                disabled={generating}
              >
                <Wand2 className="w-4 h-4" />
                {generating ? "Generating..." : "Auto-Generate"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export SRT
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {subtitles.map((subtitle) => (
                <div
                  key={subtitle.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    currentTime >= subtitle.start && currentTime <= subtitle.end
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => jumpToTime(subtitle.start)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{formatTime(subtitle.start)}</span>
                      <span>→</span>
                      <span className="font-mono">{formatTime(subtitle.end)}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(subtitle.id);
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-6 h-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSubtitle(subtitle.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingId === subtitle.id ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        defaultValue={subtitle.text}
                        className="w-full bg-secondary rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateSubtitle(subtitle.id, e.target.value);
                          }
                        }}
                        onBlur={(e) => updateSubtitle(subtitle.id, e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="text-sm">{subtitle.text}</p>
                  )}
                </div>
              ))}

              {/* Add New Subtitle */}
              <Button 
                variant="outline" 
                className="w-full border-dashed gap-2"
                onClick={() => {
                  const newId = Math.max(...subtitles.map(s => s.id)) + 1;
                  setSubtitles([...subtitles, { 
                    id: newId, 
                    start: currentTime, 
                    end: currentTime + 3, 
                    text: "New subtitle" 
                  }]);
                  setEditingId(newId);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Subtitle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1 p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground">Total Subtitle</p>
            <p className="text-2xl font-bold">{subtitles.length}</p>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-2xl font-bold">{formatTime(subtitles[subtitles.length - 1]?.end || 0)}</p>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground">Words</p>
            <p className="text-2xl font-bold">
              {subtitles.reduce((acc, sub) => acc + sub.text.split(" ").length, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
