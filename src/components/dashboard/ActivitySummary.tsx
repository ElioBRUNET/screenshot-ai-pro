import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, MousePointer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface ActivityData {
  id: string;
  user_id: string;
  ai_analysis: string;
  created_at: string;
}

export function ActivitySummary() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useUser();

  useEffect(() => {
    if (session?.user?.id) {
      fetchTodayActivities();
    }
  }, [session]);

  const fetchTodayActivities = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('ai_analyses' as any)
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false })
        .limit(10) as any;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseAnalysisData = (analysis: string) => {
    try {
      return JSON.parse(analysis);
    } catch (error) {
      return null;
    }
  };

  const renderAnalysisSection = (data: any) => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        {data.CONTEXT_ANALYSIS && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Context Analysis
            </h4>
            
            {data.CONTEXT_ANALYSIS.applications_visible && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-2">Applications Detected:</h5>
                {data.CONTEXT_ANALYSIS.applications_visible.map((app: any, index: number) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-blue-500">{app.name}</span> - {app.platform}
                  </div>
                ))}
              </div>
            )}

            {data.CONTEXT_ANALYSIS.exact_task_being_performed && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-2">Primary Task:</h5>
                <p className="text-sm text-gray-600 mb-2">{data.CONTEXT_ANALYSIS.exact_task_being_performed.primary}</p>
                {data.CONTEXT_ANALYSIS.exact_task_being_performed.specific_actions_observed && (
                  <div className="ml-3">
                    <h6 className="text-xs font-medium text-black mb-1">Specific Actions:</h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {data.CONTEXT_ANALYSIS.exact_task_being_performed.specific_actions_observed.slice(0, 3).map((action: string, index: number) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {data.PRODUCTIVITY_INDICATORS && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-blue-500" />
              Productivity Insights
            </h4>
            
            {data.PRODUCTIVITY_INDICATORS.focus_level && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-1">Focus Level:</h5>
                <p className="text-sm text-gray-600">{data.PRODUCTIVITY_INDICATORS.focus_level.assessment}</p>
              </div>
            )}

            {data.PRODUCTIVITY_INDICATORS.complexity_of_work && (
              <div className="mb-3">
                <h5 className="text-sm font-medium text-black mb-1">Work Complexity:</h5>
                <p className="text-sm text-gray-600">{data.PRODUCTIVITY_INDICATORS.complexity_of_work.assessment}</p>
              </div>
            )}
          </div>
        )}

        {data.AI_OPPORTUNITIES && data.AI_OPPORTUNITIES.opportunities && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              AI Improvement Opportunities
            </h4>
            
            <div className="space-y-3">
              {data.AI_OPPORTUNITIES.opportunities.slice(0, 3).map((opportunity: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-500 pl-3">
                  <h5 className="text-sm font-medium text-black mb-1">{opportunity.name}</h5>
                  <p className="text-xs text-gray-600 mb-2">{opportunity.description}</p>
                  <div className="flex gap-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {opportunity.feasibility} Feasibility
                    </span>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {opportunity.impact} Impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.PRIORITIZED_RECOMMENDATIONS && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Priority Recommendations
            </h4>
            
            <div className="space-y-2">
              {data.PRIORITIZED_RECOMMENDATIONS.slice(0, 3).map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded font-medium">
                    {rec.priority}
                  </span>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-black">{rec.feature}</h5>
                    <p className="text-xs text-gray-600">{rec.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-20 bg-muted/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <Card className="bg-background border border-border">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-heading text-foreground mb-2">
              No Activity Data Yet
            </h3>
            <p className="text-muted-foreground">
              Start your productivity tracking app to see your daily activity summary here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-background border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              AI Analyses Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading text-foreground">
              {activities.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Last Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading text-foreground">
              {activities.length > 0 ? formatTime(activities[0].created_at) : '--'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-background border border-border">
        <CardHeader>
          <CardTitle className="font-heading text-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.slice(0, 5).map((activity) => {
            const parsedData = parseAnalysisData(activity.ai_analysis);
            
            return (
              <div key={activity.id} className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Analysis from {formatTime(activity.created_at)}
                  </span>
                </div>
                
                {parsedData ? (
                  renderAnalysisSection(parsedData)
                ) : (
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {activity.ai_analysis}
                    </p>
                  </div>
                )}
                
                {activities.indexOf(activity) < activities.length - 1 && (
                  <div className="border-b border-gray-200 my-4"></div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}