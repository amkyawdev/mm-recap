"use client";

import { useState } from "react";
import { User, Key, CreditCard, Save, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "api-keys", name: "API Keys", icon: Key },
  { id: "subscription", name: "Subscription", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState({ openai: false, gemini: false, elevenlabs: false });
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [apiKeys, setApiKeys] = useState({
    openai: "sk-••••••••••••••••••••••••••••••",
    gemini: "••••••••••••••••••••••••••••••",
    elevenlabs: "••••••••••••••••••••••••••••••",
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Keys Tab */}
        {activeTab === "api-keys" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your API keys are encrypted and stored securely. They are never shared with third parties.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* OpenAI */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  <p className="text-xs text-muted-foreground">
                    Used for GPT-4 powered auto-editing and content generation
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey.openai ? "text" : "password"}
                        value={apiKeys.openai}
                        onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                        className="pr-10 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey({ ...showApiKey, openai: !showApiKey.openai })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button variant="outline" size="sm">Save</Button>
                  </div>
                </div>

                {/* Gemini */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gemini API Key</label>
                  <p className="text-xs text-muted-foreground">
                    Alternative AI model for content analysis and suggestions
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey.gemini ? "text" : "password"}
                        value={apiKeys.gemini}
                        onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                        className="pr-10 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey({ ...showApiKey, gemini: !showApiKey.gemini })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button variant="outline" size="sm">Save</Button>
                  </div>
                </div>

                {/* ElevenLabs */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">ElevenLabs API Key</label>
                  <p className="text-xs text-muted-foreground">
                    Text-to-speech for voiceovers and narration
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey.elevenlabs ? "text" : "password"}
                        value={apiKeys.elevenlabs}
                        onChange={(e) => setApiKeys({ ...apiKeys, elevenlabs: e.target.value })}
                        className="pr-10 font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey({ ...showApiKey, elevenlabs: !showApiKey.elevenlabs })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showApiKey.elevenlabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button variant="outline" size="sm">Save</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Key Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>OpenAI</span>
                    </div>
                    <span className="text-sm text-green-500 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span>Gemini</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Not configured</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-500" />
                      <span>ElevenLabs</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Not configured</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                  <div>
                    <h3 className="text-2xl font-bold">Pro Plan</h3>
                    <p className="text-muted-foreground">Unlimited projects and exports</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">$19</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-secondary text-center">
                    <p className="text-2xl font-bold">45.2 GB</p>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary text-center">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Projects</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary text-center">
                    <p className="text-2xl font-bold">∞</p>
                    <p className="text-sm text-muted-foreground">Exports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited video projects",
                    "All AI editing features",
                    "Priority processing",
                    "Custom branding",
                    "Team collaboration (coming soon)",
                    "API access (coming soon)",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">Manage Billing</Button>
              <Button variant="outline" className="flex-1">Upgrade Plan</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
