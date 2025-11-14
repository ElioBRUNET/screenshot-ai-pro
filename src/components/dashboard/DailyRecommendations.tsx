import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap, Target, RefreshCw, CheckCircle, ArrowRight } from "lucide-react";
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

  const triggerWebhook = async () => {
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
        scheduled: false,
        scheduled_time: null,
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
        title: "Report Requested",
        description: "Your AI report is being generated. Check back in a few moments...",
      });

      // Auto-refresh recommendations after a short delay
      setTimeout(() => {
        fetchDailyRecommendations();
      }, 5000);

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
    triggerWebhook();
  };

  return (
    <div className="space-y-6">
      {/* Generate Report Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGetReportNow}
          disabled={loading}
          size="lg"
          className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-semibold group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
              Generating Your AI Report...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-3" />
              Generate AI Report Now
            </>
          )}
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="clean-card border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <RefreshCw className="mx-auto h-10 w-10 text-primary mb-3 animate-spin" />
              <p className="text-base font-medium clean-text">
                Analyzing your productivity patterns...
              </p>
              <p className="text-sm clean-text-muted">
                This usually takes just a few seconds
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
                <div key={index} className="relative group">
                  {/* Decorative gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
                  
                  <div className="relative border-2 border-border rounded-2xl p-8 bg-background shadow-lg hover:shadow-xl transition-all">
                    <div className="space-y-6">
                      {/* Header with tool info */}
                      <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-border/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-xl border border-primary/20">
                              <img 
                                src={tip.required_tool.logo_url} 
                                alt={tip.required_tool.name}
                                className="w-10 h-10 rounded-md object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI2Y1ZjVmNSIvPgo8cGF0aCBkPSJNMTIgOGMtMi4yMSAwLTQgMS43OS00IDRzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgNmMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6IiBmaWxsPSIjOTk5Ii8+Cjwvc3ZnPgo=';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-foreground text-xl mb-1">
                                {tip.tailored_title}
                              </h3>
                              <p className="text-base text-muted-foreground font-medium">
                                using {tip.required_tool.name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold text-primary">
                                Save {tip.expected_time_saved_minutes} min
                              </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                              <Lightbulb className="h-4 w-4 text-foreground" />
                              <span className="text-sm font-medium text-foreground">
                                {tip.library_title}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          asChild
                          size="lg"
                          className="shrink-0 font-semibold"
                        >
                          <a 
                            href={tip.required_tool.action_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            Open Tool
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>

                      {/* 2-Column Layout: Why it fits + Action Steps */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Why it fits - Left Column */}
                        <div className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 h-fit">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <h4 className="font-bold text-foreground text-base">
                                Why This Fits
                              </h4>
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                              {tip.why_it_fits}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Steps - Right Column */}
                        {tip.do_this_now_steps && tip.do_this_now_steps.length > 0 && (
                          <div className="border-2 border-border rounded-xl p-5 bg-muted/30 h-fit">
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-border">
                              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Target className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <div>
                                <span className="text-base font-bold text-foreground block">Action Steps</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {tip.do_this_now_steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-3 p-3 border-2 border-border rounded-lg bg-background hover:border-primary/50 transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs text-primary-foreground font-bold">{stepIndex + 1}</span>
                                  </div>
                                  <p className="text-sm text-foreground leading-relaxed font-medium flex-1">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Copy-Paste Prompt */}
                      {tip.copy_paste_prompt && (
                        <div className="border-2 border-primary/30 rounded-xl p-6 bg-gradient-to-br from-muted/50 to-muted/30">
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <Zap className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <div>
                                <span className="text-lg font-bold text-foreground block">Ready-to-Use Prompt</span>
                                <span className="text-sm text-muted-foreground">Copy and paste into the tool</span>
                              </div>
                            </div>
                            <Button
                              size="lg"
                              variant="default"
                              onClick={() => {
                                navigator.clipboard.writeText(tip.copy_paste_prompt);
                                toast({
                                  title: "Copied!",
                                  description: "Prompt copied to clipboard",
                                });
                              }}
                              className="font-semibold"
                            >
                              Copy Prompt
                            </Button>
                          </div>
                          <div className="bg-background rounded-lg p-4 border-2 border-border">
                            <code className="text-sm text-foreground break-words font-medium leading-relaxed block">
                              {tip.copy_paste_prompt}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
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