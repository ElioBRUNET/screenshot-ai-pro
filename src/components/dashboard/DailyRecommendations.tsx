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

interface RequiredTool {
  name: string;
  logo_url: string;
  action_url: string;
}

interface DailyTip {
  library_title: string;
  tailored_title: string;
  why_it_fits: string;
  required_tool: RequiredTool;
  do_this_now_steps: string[];
  copy_paste_prompt: string;
  expected_time_saved_minutes: number;
}

interface DailyRecommendation {
  id: string;
  user_id: string;
  work_date: string;
  recommendations: {
    date: string;
    user_skill: "beginner" | "intermediate";
    apps_today: string[];
    recommendations: DailyTip[];
  };
  created_at: string;
}

export function DailyRecommendations() {
  const [loading, setLoading] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [reportData, setReportData] = useState<{
    date: string;
    user_skill: "beginner" | "intermediate";
    apps_today: string[];
  } | null>(null);
  const [lastReportDate, setLastReportDate] = useState<string>("");
  const [fetchingRecommendations, setFetchingRecommendations] = useState(false);
  const { session } = useUser();
  const { toast } = useToast();

  const WEBHOOK_URL = 'https://hook.eu2.make.com/chfv1ioms0x5r1jpk88fer19i25uu85v';

  // Robust deep JSON parser to handle multiple encodings and markdown fences
  const safeDeepParse = (input: any) => {
    try {
      let v: any = input;

      const sanitize = (s: string) => {
        let out = s.trim();
        // Strip surrounding triple quotes
        if (out.startsWith('"""') && out.endsWith('"""')) {
          out = out.slice(3, -3).trim();
        }
        // Strip markdown code fences
        if (out.startsWith('```')) {
          const nl = out.indexOf('\n');
          if (nl !== -1) {
            // remove ``` or ```json first line
            out = out.slice(nl + 1);
          } else {
            out = out.replace(/^```(json)?/, '');
          }
        }
        if (out.endsWith('```')) {
          // remove trailing fence (optionally preceded by newline)
          out = out.replace(/\n?```\s*$/, '');
        }
        // Strip one layer of wrapping quotes
        if ((out.startsWith('"') && out.endsWith('"')) || (out.startsWith("'") && out.endsWith("'"))) {
          out = out.slice(1, -1);
        }
        // Unescape common sequences
        out = out.replace(/\\\"/g, '"').replace(/\\n/g, '\n');
        return out.trim();
      };

      let guard = 0;
      while (typeof v === 'string' && guard < 10) {
        const attempt = sanitize(v);
        try {
          v = JSON.parse(attempt);
        } catch {
          // If it looks like JSON after sanitizing, try one more naive slice between braces
          if (/^[\[{]/.test(attempt)) {
            try {
              const start = Math.min(
                ...['{', '[']
                  .map((ch) => attempt.indexOf(ch))
                  .filter((i) => i >= 0)
              );
              const endCurl = attempt.lastIndexOf('}');
              const endSq = attempt.lastIndexOf(']');
              const end = Math.max(endCurl, endSq);
              if (start >= 0 && end > start) {
                v = JSON.parse(attempt.slice(start, end + 1));
                break;
              }
            } catch {
              // fallthrough
            }
          }
          // Could not parse further
          break;
        }
        guard++;
      }
      return v;
    } catch (e) {
      console.error('safeDeepParse failed:', e);
      return null;
    }
  };
  // Fetch daily recommendations from Supabase
  const fetchDailyRecommendations = async () => {
    if (!session?.user?.id) return;

    setFetchingRecommendations(true);
    try {
      // Use raw query since daily_recommendations table may not be in types yet
      const { data, error } = await supabase
        .from('daily_recommendations' as any)
        .select('id, user_id, work_date, created_at, recommendations')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching recommendations:', error);
        return;
      }

      if (data && data.length > 0) {
        const latestRecommendation = data[0] as any;
        console.log('Raw recommendations data:', latestRecommendation.recommendations);
        
        // Parse the JSON recommendations
        let parsedRecommendations: any = safeDeepParse(latestRecommendation.recommendations);
        if (!parsedRecommendations && typeof latestRecommendation.recommendations !== 'object') {
          console.warn('Falling back to raw recommendations string');
          parsedRecommendations = latestRecommendation.recommendations;
        }

        console.log('Parsed recommendations:', parsedRecommendations);

        // Handle both old and new formats
        let recommendations = [];
        let reportData = null;
        
        if (parsedRecommendations?.recommendations && Array.isArray(parsedRecommendations.recommendations)) {
          // New format
          recommendations = parsedRecommendations.recommendations;
          reportData = {
            date: parsedRecommendations.date,
            user_skill: parsedRecommendations.user_skill,
            apps_today: parsedRecommendations.apps_today || []
          };
        } else if (parsedRecommendations?.suggestions && Array.isArray(parsedRecommendations.suggestions)) {
          // Old format - convert to new format for display
          recommendations = parsedRecommendations.suggestions.map((suggestion: any) => ({
            library_title: "Legacy Recommendation",
            tailored_title: suggestion.task || "Task Recommendation", 
            why_it_fits: suggestion.recommendation || "",
            required_tool: {
              name: "Manual Action",
              logo_url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI2Y1ZjVmNSIvPgo8cGF0aCBkPSJNMTIgOGMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgNmMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6IiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=",
              action_url: "#"
            },
            do_this_now_steps: suggestion.how_to_apply || [],
            copy_paste_prompt: "",
            expected_time_saved_minutes: 15
          }));
          reportData = {
            date: latestRecommendation.work_date,
            user_skill: "intermediate",
            apps_today: []
          };
        }

        if (recommendations.length > 0) {
          setDailyTips(recommendations);
          setReportData(reportData);
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
          <h2 className="text-lg font-heading clean-text">
            Daily AI Report
          </h2>
          <p className="text-sm clean-text-muted">
            Schedule your daily productivity report or get it instantly
          </p>
        </div>
      </div>

      {/* Report Control Panel */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-heading clean-text">
            <Clock className="h-5 w-5 text-primary" />
            Report Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schedule Section */}
            <div className="space-y-3">
              <Label htmlFor="schedule-time" className="text-sm font-medium clean-text">
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
                  className="clean-card"
                >
                  {isScheduled ? 'Update' : 'Schedule'}
                </Button>
              </div>
              {isScheduled && (
                <p className="text-xs clean-text-muted">
                  ✓ Report scheduled for {scheduledTime} daily
                </p>
              )}
            </div>

            {/* Instant Report Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium clean-text">
                Get Report Now
              </Label>
              <Button
                onClick={handleGetReportNow}
                disabled={loading}
                className="w-full clean-card"
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
        <Card className="clean-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-primary mb-2 animate-spin" />
              <p className="text-sm clean-text-muted">
                Processing your activity data and generating insights...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Tips Display */}
      <Card className="clean-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading clean-text">
              Your Latest Report
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastReportDate && (
                <span className="text-xs clean-text-muted">
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
              <p className="text-sm clean-text-muted">Loading your latest recommendations...</p>
            </div>
          ) : dailyTips.length > 0 ? (
            <div className="space-y-6">
              {/* Report Header */}
              {reportData && (
                <div className="border border-border/40 rounded-xl p-4 bg-muted/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {reportData.user_skill} level
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {reportData.apps_today.length} apps used
                      </Badge>
                    </div>
                    <span className="text-xs clean-text-muted">
                      {new Date(reportData.date).toLocaleDateString()}
                    </span>
                  </div>
                  {reportData.apps_today.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium clean-text mb-2">Apps used today:</h4>
                      <div className="flex flex-wrap gap-1">
                        {reportData.apps_today.map((app, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Recommendations */}
              {dailyTips.map((tip, index) => (
                <div key={index} className="border border-border/40 rounded-xl p-6 bg-background/80">
                  <div className="space-y-5">
                    {/* Header with tool info */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-shrink-0">
                            <img 
                              src={tip.required_tool.logo_url} 
                              alt={tip.required_tool.name}
                              className="w-8 h-8 rounded-md object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI2Y1ZjVmNSIvPgo8cGF0aCBkPSJNMTIgOGMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgNmMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6IiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold clean-text text-base">
                              {tip.tailored_title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              with {tip.required_tool.name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Save {tip.expected_time_saved_minutes} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            {tip.library_title}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        asChild
                        size="sm"
                        className="shrink-0"
                      >
                        <a 
                          href={tip.required_tool.action_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          Open Tool
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>

                    {/* Why it fits */}
                    <div className="border border-border/30 rounded-lg p-4 bg-primary/5">
                      <h4 className="font-medium clean-text text-sm mb-2 text-primary">
                        Why This Fits Today
                      </h4>
                      <p className="text-sm clean-text-muted leading-relaxed">
                        {tip.why_it_fits}
                      </p>
                    </div>
                    
                    {/* Action Steps */}
                    {tip.do_this_now_steps && tip.do_this_now_steps.length > 0 && (
                      <div className="border border-border/30 rounded-lg p-4 bg-background/60">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/20">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium clean-text">Do This Now</span>
                        </div>
                        <div className="space-y-2">
                          {tip.do_this_now_steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start gap-3 p-3 border border-border/20 rounded-md bg-background/40">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-primary font-medium">{stepIndex + 1}</span>
                              </div>
                              <p className="text-sm clean-text leading-relaxed">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copy-Paste Prompt */}
                    {tip.copy_paste_prompt && (
                      <div className="border border-border/30 rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium clean-text">Ready-to-Use Prompt</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(tip.copy_paste_prompt);
                              toast({
                                title: "Copied!",
                                description: "Prompt copied to clipboard",
                              });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="bg-background/80 rounded-md p-3 border border-border/20">
                          <code className="text-xs clean-text-muted break-words">
                            {tip.copy_paste_prompt}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="mx-auto h-12 w-12 text-primary/50 mb-3" />
              <p className="text-sm clean-text-muted">
                Your personalized AI report will appear here once generated.
              </p>
              <p className="text-xs clean-text-muted mt-2">
                Reports include activity analysis, productivity insights, and actionable recommendations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}