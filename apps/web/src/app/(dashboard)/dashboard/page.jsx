"use client";

import Link from "next/link";
import { 
  Plus, 
  Upload, 
  Sparkles, 
  Film, 
  Clock, 
  HardDrive,
  TrendingUp,
  Play,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock data
const recentProjects = [
  { id: 1, title: "Recap #5", thumbnail: null, status: "completed", date: "2 hours ago" },
  { id: 2, title: "Vlog Edit", thumbnail: null, status: "processing", date: "5 hours ago" },
  { id: 3, title: "Tech Review", thumbnail: null, status: "draft", date: "1 day ago" },
  { id: 4, title: "Cooking Tutorial", thumbnail: null, status: "failed", date: "2 days ago" },
];

const activities = [
  { icon: CheckCircle, text: "Video 'Recap #5' published to YouTube", time: "2 hours ago" },
  { icon: Loader2, text: "Processing 'Vlog Edit' - 45% complete", time: "5 hours ago" },
  { icon: Sparkles, text: "AI auto-edit completed for 'Tech Review'", time: "1 day ago" },
  { icon: Upload, text: "Uploaded new video 'Cooking Tutorial'", time: "2 days ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Welcome back, John</h1>
          <p className="text-muted-foreground">Here&apos;s what you&apos;ve been working on</p>
        </div>
        <Link href="/editor">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/editor" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Video Editor</h3>
                <p className="text-sm text-muted-foreground">Edit your footage</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ai-studio" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">AI Auto-Edit</h3>
                <p className="text-sm text-muted-foreground">Let AI do the work</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/subtitle" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Subtitle Editor</h3>
                <p className="text-sm text-muted-foreground">Add auto captions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Projects & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/editor?project=${project.id}`}
                    className="group block"
                  >
                    <div className="aspect-video rounded-lg bg-secondary mb-3 overflow-hidden relative">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <StatusBadge status={project.status} />
                      </div>
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{project.date}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-secondary"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * 0.45}`}
                    strokeLinecap="round"
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">45%</span>
                  <span className="text-xs text-muted-foreground">used</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                45.2 GB / 100 GB
              </p>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    completed: { icon: CheckCircle, bg: "bg-green-500/20 text-green-500", label: "Completed" },
    processing: { icon: Loader2, bg: "bg-blue-500/20 text-blue-500 animate-spin", label: "Processing" },
    draft: { icon: Clock, bg: "bg-gray-500/20 text-gray-500", label: "Draft" },
    failed: { icon: AlertCircle, bg: "bg-red-500/20 text-red-500", label: "Failed" },
  };
  
  const { icon: Icon, bg, label } = config[status] || config.draft;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
