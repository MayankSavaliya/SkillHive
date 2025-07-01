import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Bell, Database, Mail, Globe } from "lucide-react";
import { showToast } from "@/lib/toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "SkillHive",
    siteDescription: "Learn and grow with expert instructors",
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    maxFileSize: 50,
    allowedFileTypes: "pdf,doc,docx,txt",
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Implement save functionality
            showToast.success("Settings saved successfully!", { showCancel: true });
  };

  const handleTestEmail = () => {
    // Implement test email functionality
            showToast.success("Test email sent successfully!", { showCancel: true });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange("siteName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => handleSettingChange("allowRegistration", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify email before login</p>
              </div>
              <Switch
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange("maxFileSize", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => handleSettingChange("allowedFileTypes", e.target.value)}
                placeholder="pdf,doc,docx,txt"
              />
              <p className="text-sm text-muted-foreground">Comma-separated list of allowed file extensions</p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Send system notifications to users</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleSettingChange("enableNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={settings.smtpHost}
                onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => handleSettingChange("smtpPort", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                value={settings.smtpUsername}
                onChange={(e) => handleSettingChange("smtpUsername", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => handleSettingChange("smtpPassword", e.target.value)}
              />
            </div>
            
            <Button onClick={handleTestEmail} variant="outline" className="w-full">
              Test Email Configuration
            </Button>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Platform Version</span>
              <span className="text-sm text-muted-foreground">v1.0.0</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database Status</span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Storage Used</span>
              <span className="text-sm text-muted-foreground">2.5 GB / 10 GB</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Backup</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            
            <Separator />
            
            <Button variant="outline" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button onClick={handleSaveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
