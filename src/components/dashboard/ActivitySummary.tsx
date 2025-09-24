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

  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul className="space-y-1 ml-4">
          {value.map((item: any, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span className="text-sm text-muted-foreground">
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="ml-4 space-y-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <span className="text-sm font-medium text-foreground capitalize">
                {key.replace(/_/g, ' ')}: 
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    return <span className="text-sm text-muted-foreground">{String(value)}</span>;
  };

  const renderAnalysisSection = (data: any) => {
    if (!data) return null;

    const sections = [
      { key: 'CONTEXT_ANALYSIS', title: 'Context Analysis' },
      { key: 'WORKFLOW_PATTERNS', title: 'Workflow Patterns' },
      { key: 'PRODUCTIVITY_INDICATORS', title: 'Productivity Indicators' }
    ];

    return (
      <div className="space-y-4">
        {sections.map(({ key, title }) => {
          const sectionData = data[key];
          if (!sectionData) return null;

          return (
            <Card key={key} className="bg-background border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-heading text-foreground">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey} className="space-y-1">
                    <div className="font-medium text-foreground capitalize">
                      {fieldKey.replace(/_/g, ' ')}:
                    </div>
                    {renderValue(fieldValue)}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
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
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm glass-text-muted">
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