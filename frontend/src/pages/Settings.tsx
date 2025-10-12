// src/pages/Settings.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Shield,
  Key,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/firebase"; // helper to fetch firebase user

const Settings = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) setUser(currentUser);
    };
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background text-primary-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardNav />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-1">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account and preferences
              </p>
            </motion.div>

            {/* Profile Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.displayName || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" placeholder="Optional" defaultValue={user?.organization || ""} />
                  </div>
                  <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" /> User Stats
                  </CardTitle>
                  <CardDescription>Insights from your verification activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>✅ Verified Claims: {user?.verifiedClaims || 0}</p>
                  <p>🕒 Weekly Claims: {user?.weeklyClaims || 0}</p>
                  <p>🔑 API Calls Left: {user?.apiQuota || 0}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" /> Notifications
                  </CardTitle>
                  <CardDescription>Configure how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email updates about verifications</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Crisis Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified during high-impact events</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">Weekly digest of verification activity</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 rounded" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Language & Region */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" /> Language & Region
                  </CardTitle>
                  <CardDescription>Customize language preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Preferred Language</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="kn">Kannada</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div>
                      <Label>Time Zone</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="utc">UTC</option>
                        <option value="ist">IST (India)</option>
                        <option value="est">EST (US)</option>
                        <option value="gmt">GMT (UK)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Security
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Change Password</Label>
                    <div className="flex gap-2">
                      <Input type="password" placeholder="New password" />
                      <Button>Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* API Access */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" /> API Access
                  </CardTitle>
                  <CardDescription>Manage API keys for browser extension</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={user?.apiKey ? `veri_${user.apiKey.slice(0, 8)}••••••` : "veri_••••••••••"}
                        readOnly
                      />
                      <Button variant="outline">Copy</Button>
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this key to connect the VeriSense browser extension
                  </p>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
