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
            <div key={key} className="border border-border/50 rounded-xl p-4 bg-muted/20">
              <div className="border-b border-border/30 pb-3 mb-4">
                <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  {title}
                </h4>
              </div>
              <div className="space-y-4">
                {Object.entries(sectionData).map(([fieldKey, fieldValue]) => (
                  <div key={fieldKey} className="border border-border/30 rounded-lg p-3 bg-background/50">
                    <div className="font-medium text-foreground capitalize text-sm mb-2 pb-1 border-b border-border/20">
                      {fieldKey.replace(/_/g, ' ')}
                    </div>
                    <div className="mt-2">
                      {renderValue(fieldValue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
      <Card className="clean-card">
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
      <div className="border border-border/40 rounded-xl p-4 bg-muted/10">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          Activity Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border/30 rounded-lg p-4 bg-background/60">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">AI Analyses Today</span>
            </div>
            <div className="text-2xl font-heading text-foreground">
              {activities.length}
            </div>
          </div>

          <div className="border border-border/30 rounded-lg p-4 bg-background/60">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Last Analysis</span>
            </div>
            <div className="text-2xl font-heading text-foreground">
              {activities.length > 0 ? formatTime(activities[0].created_at) : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="border border-border/40 rounded-xl bg-muted/10">
        <div className="border-b border-border/30 p-4">
          <h3 className="font-heading text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Recent Activity
          </h3>
        </div>
        <div className="p-4 space-y-6">
          {activities.slice(0, 5).map((activity) => {
            const parsedData = parseAnalysisData(activity.ai_analysis);
            
            return (
              <div key={activity.id} className="border border-border/30 rounded-lg p-4 bg-background/40">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/20">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm clean-text-muted font-medium">
                    Analysis from {formatTime(activity.created_at)}
                  </span>
                </div>
                
                {parsedData ? (
                  renderAnalysisSection(parsedData)
                ) : (
                  <div className="border border-border/30 p-4 rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activity.ai_analysis}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}