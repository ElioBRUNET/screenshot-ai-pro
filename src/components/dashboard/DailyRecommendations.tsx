import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, Zap, Target, RefreshCw, Clock, Download, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

interface DailyTip {
  task: string;
  recommendation: string;
  how_to_apply: string[];
}

interface DailyRecommendation {
  id: string;
  user_id: string;
  work_date: string;
  recommendations: {
    suggestions: DailyTip[];
  };
  created_at: string;
}

export function DailyRecommendations() {
  const [loading, setLoading] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [lastReportDate, setLastReportDate] = useState<string>("");
  const [fetchingRecommendations, setFetchingRecommendations] = useState(false);
  const { session } = useUser();
  const { toast } = useToast();

  const WEBHOOK_URL = 'https://hook.eu2.make.com/chfv1ioms0x5r1jpk88fer19i25uu85v';

  // Fetch daily recommendations from Supabase
  const fetchDailyRecommendations = async () => {
    if (!session?.user?.id) return;

    setFetchingRecommendations(true);
    try {
      // Use raw query since daily_recommendations table may not be in types yet
      const { data, error } = await supabase
        .from('daily_recommendations' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .order('work_date', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching recommendations:', error);
        return;
      }

      if (data && data.length > 0) {
        const latestRecommendation = data[0] as any;
        console.log('Raw recommendations data:', latestRecommendation.recommendations);
        
        // Parse the JSON recommendations
        let parsedRecommendations;
        if (typeof latestRecommendation.recommendations === 'string') {
          // Handle multiple levels of JSON encoding
          let jsonString = latestRecommendation.recommendations;
          try {
            // Keep parsing until we get an object
            while (typeof jsonString === 'string') {
              jsonString = JSON.parse(jsonString);
            }
            parsedRecommendations = jsonString;
          } catch (e) {
            console.error('Failed to parse recommendations JSON:', e);
            return;
          }
        } else {
          parsedRecommendations = latestRecommendation.recommendations;
        }

        console.log('Parsed recommendations:', parsedRecommendations);

        if (parsedRecommendations?.suggestions && Array.isArray(parsedRecommendations.suggestions)) {
          setDailyTips(parsedRecommendations.suggestions);
          setLastReportDate(latestRecommendation.work_date);
        }
      }
    } catch (error) {
      console.error('Error in fetchDailyRecommendations:', error);
    } finally {
      setFetchingRecommendations(false);
    }
  };

  // Fetch recommendations on component mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchDailyRecommendations();
    }
  }, [session?.user?.id]);

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
        uid: session.user.id,
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
          : "Your report is being generated. Check back in a few moments...",
      });

      if (isScheduled) {
        setIsScheduled(true);
      }

      // Auto-refresh recommendations after a short delay for new reports
      if (!isScheduled) {
        setTimeout(() => {
          fetchDailyRecommendations();
        }, 5000);
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

      {/* Daily Tips Display */}
      <Card className="glass-subtle border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading glass-text-high-contrast">
              Your Latest Report
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastReportDate && (
                <span className="text-xs glass-text-muted">
                  {new Date(lastReportDate).toLocaleDateString()}
                </span>
              )}
              <Button
                onClick={fetchDailyRecommendations}
                disabled={fetchingRecommendations}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${fetchingRecommendations ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fetchingRecommendations ? (
            <div className="text-center py-8">
              <RefreshCw className="mx-auto h-8 w-8 text-primary mb-2 animate-spin" />
              <p className="text-sm glass-text-muted">Loading your latest recommendations...</p>
            </div>
          ) : dailyTips.length > 0 ? (
            <div className="space-y-4">
              {dailyTips.map((tip, index) => (
                <Card key={index} className="glass-subtle border-0 p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold glass-text-high-contrast text-sm">
                          {tip.task}
                        </h3>
                        <p className="text-sm glass-text-muted leading-relaxed">
                          {tip.recommendation}
                        </p>
                        
                        {tip.how_to_apply && tip.how_to_apply.length > 0 && (
                          <div className="space-y-2 mt-3">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium glass-text">How to Apply:</span>
                            </div>
                            <div className="space-y-2 ml-6">
                              {tip.how_to_apply.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                                  <p className="text-xs glass-text-muted leading-relaxed">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="mx-auto h-12 w-12 text-primary/50 mb-3" />
              <p className="text-sm glass-text-muted">
                Your personalized AI report will appear here once generated.
              </p>
              <p className="text-xs glass-text-muted mt-2">
                Reports include activity analysis, productivity insights, and actionable recommendations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}