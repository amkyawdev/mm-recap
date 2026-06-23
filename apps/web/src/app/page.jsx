import Link from "next/link";
import { ArrowRight, Film, Sparkles, Upload, Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Video Editing
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            Edit, Recap, and Publish
            <span className="gradient-text block">All in One.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Transform your raw footage into polished content with AI-powered editing, 
            automatic subtitles, and one-click publishing to YouTube and TikTok.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border hover:bg-secondary transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need to Create
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Film className="w-6 h-6" />}
              title="Video Editor"
              description="Full-featured timeline with multi-track support, trimming, and effects."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Auto-Edit"
              description="Smart cutting and transitions powered by GPT-4 and Gemini."
            />
            <FeatureCard
              icon={<Upload className="w-6 h-6" />}
              title="One-Click Publish"
              description="Direct upload to YouTube and TikTok with auto-generated thumbnails."
            />
            <FeatureCard
              icon={<Settings className="w-6 h-6" />}
              title="Auto Subtitles"
              description="Whisper-powered transcription with SRT/VTT export."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-card border border-border">
            <h2 className="text-3xl font-bold mb-4">Ready to Create?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators who use AmkyawDev Recap daily.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Start Free Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 AmkyawDev Recap. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
