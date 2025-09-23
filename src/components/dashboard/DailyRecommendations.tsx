import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, Zap, Target, RefreshCw, Clock, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export function DailyRecommendations() {
  const [loading, setLoading] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const { session } = useUser();
  const { toast } = useToast();

  const WEBHOOK_URL = 'https://hook.eu2.make.com/chfv1ioms0x5r1jpk88fer19i25uu85v';

  const triggerWebhook = async (isScheduled = false) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Please log in to generate a report",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: session.user.id,
        date: new Date().toISOString().split('T')[0],
        scheduled: isScheduled,
        scheduled_time: isScheduled ? scheduledTime : null,
        timestamp: new Date().toISOString()
      };

      console.log('Triggering webhook with payload:', payload);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      toast({
        title: isScheduled ? "Schedule Set" : "Report Requested",
        description: isScheduled 
          ? `Daily report will be generated at ${scheduledTime}` 
          : "Your report is being generated. Please wait a moment...",
      });

      if (isScheduled) {
        setIsScheduled(true);
      }

    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetReportNow = () => {
    triggerWebhook(false);
  };

  const handleScheduleReport = () => {
    triggerWebhook(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading glass-text-high-contrast">
            Daily AI Report
          </h2>
          <p className="text-sm glass-text-muted">
            Schedule your daily productivity report or get it instantly
          </p>
        </div>
      </div>

      {/* Report Control Panel */}
      <Card className="glass-subtle border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-heading glass-text-high-contrast">
            <Clock className="h-5 w-5 text-primary" />
            Report Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schedule Section */}
            <div className="space-y-3">
              <Label htmlFor="schedule-time" className="text-sm font-medium glass-text">
                Schedule Daily Report
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleScheduleReport}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                  className="glass-subtle border-0"
                >
                  {isScheduled ? 'Update' : 'Schedule'}
                </Button>
              </div>
              {isScheduled && (
                <p className="text-xs glass-text-muted">
                  ✓ Report scheduled for {scheduledTime} daily
                </p>
              )}
            </div>

            {/* Instant Report Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium glass-text">
                Get Report Now
              </Label>
              <Button
                onClick={handleGetReportNow}
                disabled={loading}
                className="w-full glass-subtle border-0"
                variant="outline"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="glass-subtle border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-primary mb-2 animate-spin" />
              <p className="text-sm glass-text-muted">
                Processing your activity data and generating insights...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Future Report Display Space */}
      <Card className="glass-subtle border-0">
        <CardHeader>
          <CardTitle className="text-base font-heading glass-text-high-contrast">
            Your Latest Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="mx-auto h-12 w-12 text-primary/50 mb-3" />
            <p className="text-sm glass-text-muted">
              Your personalized AI report will appear here once generated.
            </p>
            <p className="text-xs glass-text-muted mt-2">
              Reports include activity analysis, productivity insights, and actionable recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}