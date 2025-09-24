import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Shield, Clock, Bell, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [screenshotInterval, setScreenshotInterval] = useState([30]);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  const [dataRetention, setDataRetention] = useState("30");
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export will be ready shortly.",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Data cleared",
      description: "All local data has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="clean-card rounded-2xl p-6">
        <h1 className="text-2xl font-bold clean-text mb-2">Settings</h1>
        <p className="clean-text-muted">
          Configure your AI Implementation Coach preferences and privacy settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Screenshot Settings */}
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 clean-text">
              <Camera className="h-5 w-5 text-primary" />
              <span>Screenshot Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="clean-text">Screenshot Interval</Label>
              <div className="px-3">
                <Slider
                  value={screenshotInterval}
                  onValueChange={setScreenshotInterval}
                  max={300}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm clean-text-muted">
                <span>5 seconds</span>
                <span className="font-medium text-primary">
                  {screenshotInterval[0]} seconds
                </span>
                <span>5 minutes</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="clean-text">Auto-start tracking</Label>
                <p className="text-sm clean-text-muted">
                  Start screenshot analysis when app launches
                </p>
              </div>
              <Switch
                checked={autoStart}
                onCheckedChange={setAutoStart}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 clean-text">
              <Shield className="h-5 w-5 text-primary" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="clean-text">Privacy mode</Label>
                <p className="text-sm clean-text-muted">
                  Blur sensitive information in screenshots
                </p>
              </div>
              <Switch
                checked={privacyMode}
                onCheckedChange={setPrivacyMode}
              />
            </div>

            <div className="space-y-3">
              <Label className="clean-text">Data retention period</Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 clean-text">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="clean-text">AI insights notifications</Label>
                <p className="text-sm clean-text-muted">
                  Get notified about productivity insights
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 clean-text">
              <Clock className="h-5 w-5 text-primary" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            <Button
              onClick={handleClearData}
              variant="outline"
              className="w-full text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          className="px-8"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}