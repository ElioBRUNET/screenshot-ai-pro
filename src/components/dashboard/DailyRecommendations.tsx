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

interface DailyRecommendation {
  id: string;
  user_id: string;
  work_date: string;
  recommendations: any;
  created_at: string;
}

interface ParsedRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  timeToImplement: string;
  category: string;
  status: string;
  priority?: string;
  actionSteps?: string[];
}

export function DailyRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [isScheduled, setIsScheduled] = useState(false);
  const [recommendations, setRecommendations] = useState<ParsedRecommendation[]>([]);
  const { session } = useUser();
  const { toast } = useToast();

  const WEBHOOK_URL = 'https://hook.eu2.make.com/chfv1ioms0x5r1jpk88fer19i25uu85v';

  const fetchDailyRecommendations = async () => {
    if (!session?.user?.id) {
      console.log('No user session available');
      return;
    }

    try {
      setRecommendationsLoading(true);
      console.log('Fetching daily recommendations for user:', session.user.id);
      
      const { data, error } = await supabase
        .from('daily_recommendations' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Error fetching recommendations:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('Found recommendations data:', data[0]);
        const dailyRec = data[0] as unknown as DailyRecommendation;
        console.log('Raw recommendations field:', dailyRec.recommendations);
        const parsedRecommendations = parseRecommendations(dailyRec.recommendations);
        console.log('Parsed recommendations:', parsedRecommendations);
        setRecommendations(parsedRecommendations);
        if (parsedRecommendations.length > 0) {
          toast({
            title: "Success",
            description: `Loaded ${parsedRecommendations.length} recommendations`,
          });
        }
      } else {
        console.log('No recommendations found for user');
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const parseRecommendations = (recommendationsData: any): ParsedRecommendation[] => {
    try {
      // Handle different possible JSON structures
      let parsedData = recommendationsData;
      
      if (typeof recommendationsData === 'string') {
        parsedData = JSON.parse(recommendationsData);
      }

      // Extract recommendations array from various possible structures
      let recommendationsArray = [];
      
      if (Array.isArray(parsedData)) {
        recommendationsArray = parsedData;
      } else if (parsedData.suggestions && Array.isArray(parsedData.suggestions)) {
        // Handle the specific structure in your data
        recommendationsArray = parsedData.suggestions;
      } else if (parsedData.recommendations && Array.isArray(parsedData.recommendations)) {
        recommendationsArray = parsedData.recommendations;
      } else if (parsedData.daily_tips && Array.isArray(parsedData.daily_tips)) {
        recommendationsArray = parsedData.daily_tips;
      } else if (typeof parsedData === 'object') {
        // If it's an object with recommendation-like properties, treat it as a single recommendation
        recommendationsArray = [parsedData];
      }

      return recommendationsArray.map((rec: any, index: number) => ({
        id: rec.id || `rec-${index}`,
        title: rec.task || rec.title || rec.tip || rec.recommendation || 'Productivity Tip',
        description: rec.recommendation || rec.description || rec.details || rec.content || 'No description available',
        impact: rec.impact || rec.priority || rec.difficulty || 'Medium',
        timeToImplement: rec.timeToImplement || rec.time_required || rec.duration || rec.setup_time || '15 minutes',
        category: rec.category || rec.topic || rec.area || rec.tool || 'General',
        status: rec.status || rec.implementation_status || 'New',
        priority: rec.priority || rec.importance || rec.difficulty || 'Medium',
        actionSteps: rec.how_to_apply || rec.actionSteps || rec.action_steps || rec.steps || []
      }));
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return [];
    }
  };

  const renderValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value || '');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500";
      case "In Progress": return "bg-orange-500";
      case "Completed": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  useEffect(() => {
    fetchDailyRecommendations();
    
    // Set up periodic refresh to check for new recommendations
    const intervalId = setInterval(() => {
      fetchDailyRecommendations();
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [session]);

  useEffect(() => {
    // Listen for storage events to detect when a report was requested
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reportRequested' && e.newValue === 'true') {
        // Wait a bit then refresh
        setTimeout(() => {
          fetchDailyRecommendations();
        }, 2000);
        localStorage.removeItem('reportRequested');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

      if (isScheduled) {
        toast({
          title: "Schedule Set",
          description: `Daily report will be generated at ${scheduledTime}`,
        });
        setIsScheduled(true);
      } else {
        toast({
          title: "Report Requested",
          description: "Your report is being generated. Check the 'Your Latest Report' section below in 1-2 minutes.",
          duration: 6000,
        });
        
        // Signal that a report was requested for automatic refresh
        localStorage.setItem('reportRequested', 'true');
        
        // Set up a delayed notification to remind user to check reports
        setTimeout(() => {
          toast({
            title: "Report Ready",
            description: "Your daily AI recommendations should be ready now in the section below!",
            duration: 8000,
          });
        }, 90000); // 1.5 minutes delay
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

      {/* Your Latest Report */}
      <Card className="glass-subtle border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base font-heading glass-text-high-contrast">
            <span>Your Latest Report</span>
            <Button
              onClick={fetchDailyRecommendations}
              disabled={recommendationsLoading}
              size="sm"
              variant="ghost"
              className="glass-subtle border-0"
            >
              <RefreshCw className={`h-4 w-4 ${recommendationsLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendationsLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="mx-auto h-8 w-8 text-primary mb-2 animate-spin" />
              <p className="text-sm glass-text-muted">Loading your recommendations...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="mx-auto h-12 w-12 text-primary/50 mb-3" />
              <p className="text-sm glass-text-muted">
                Your personalized AI report will appear here once generated.
              </p>
              <p className="text-xs glass-text-muted mt-2">
                Click "Generate Report Now" to create your daily recommendations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="glass-subtle border-0">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold glass-text-high-contrast mb-2">{rec.title}</h3>
                        <p className="text-sm glass-text-muted mb-3 leading-relaxed">{rec.description}</p>
                        
                        {rec.actionSteps && rec.actionSteps.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-medium glass-text mb-1">Action Steps:</h4>
                            <ul className="text-xs glass-text-muted space-y-1">
                              {rec.actionSteps.map((step, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{renderValue(step)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-xs flex-wrap gap-2">
                          <Badge className={`${getImpactColor(rec.impact)} text-white`}>
                            {rec.impact} Impact
                          </Badge>
                          <Badge className={`${getStatusColor(rec.status)} text-white`}>
                            {rec.status}
                          </Badge>
                          <span className="glass-text-muted flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {rec.timeToImplement}
                          </span>
                          <span className="glass-text-muted flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            {rec.category}
                          </span>
                          {rec.priority && (
                            <Badge variant="outline" className="glass-text-muted border-current">
                              Priority: {rec.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="ml-4 glass-text-container glass-text-high-contrast border-0 shrink-0"
                      >
                        Implement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}