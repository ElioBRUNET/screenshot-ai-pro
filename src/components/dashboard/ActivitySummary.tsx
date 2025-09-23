import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, MousePointer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface ActivityData {
  id: string;
  app: string;
  captured_at: string;
  primary_activity: string | null;
  tasks: string[] | null;
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
        .from('activities')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('captured_at', `${today}T00:00:00`)
        .lt('captured_at', `${today}T23:59:59`)
        .order('captured_at', { ascending: false })
        .limit(10);

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

  const getUniqueApps = () => {
    const apps = activities.map(a => a.app);
    return [...new Set(apps)];
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-accent" />
              Screenshots Today
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
              <Activity className="h-4 w-4 text-accent" />
              Apps Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading text-foreground">
              {getUniqueApps().length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Last Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading text-foreground">
              {activities.length > 0 ? formatTime(activities[0].captured_at) : '--'}
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
        <CardContent className="space-y-3">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs text-accent border-accent bg-accent/10">
                    {activity.app}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(activity.captured_at)}
                  </span>
                </div>
                {activity.primary_activity && (
                  <p className="text-sm text-foreground">{activity.primary_activity}</p>
                )}
                {activity.tasks && activity.tasks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activity.tasks.slice(0, 3).map((task, index) => (
                      <span key={index} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {task}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}