import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Calendar, Award, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface WeeklyStats {
  totalScreenshots: number;
  uniqueApps: number;
  mostUsedApp: string;
  productivityTrend: 'up' | 'down' | 'stable';
}

interface WeeklyInsight {
  id: string;
  title: string;
  description: string;
  type: 'achievement' | 'improvement' | 'trend';
}

export function WeeklySummary() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [insights, setInsights] = useState<WeeklyInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useUser();

  useEffect(() => {
    generateWeeklySummary();
  }, []);

  const generateWeeklySummary = async () => {
    setLoading(true);
    try {
      // Fetch this week's activities
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', session?.user?.id)
        .gte('captured_at', startOfWeek.toISOString())
        .order('captured_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const apps = activities?.map(a => a.app) || [];
      const uniqueApps = [...new Set(apps)];
      const appCounts = apps.reduce((acc, app) => {
        acc[app] = (acc[app] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const mostUsedApp = Object.entries(appCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

      setStats({
        totalScreenshots: activities?.length || 0,
        uniqueApps: uniqueApps.length,
        mostUsedApp,
        productivityTrend: 'stable' // This would be calculated based on historical data
      });

      // Generate AI insights (mock for MVP)
      const mockInsights: WeeklyInsight[] = [
        {
          id: '1',
          title: 'Consistent Work Pattern',
          description: 'You maintained steady productivity throughout the week with consistent daily activity.',
          type: 'achievement'
        },
        {
          id: '2',
          title: 'Focus Improvement Opportunity',
          description: 'Consider reducing context switching between applications to improve deep work sessions.',
          type: 'improvement'
        },
        {
          id: '3',
          title: 'Peak Performance Hours',
          description: 'Your most productive hours appear to be between 10 AM and 2 PM.',
          type: 'trend'
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error generating weekly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Award;
      case 'improvement': return TrendingUp;
      case 'trend': return BarChart3;
      default: return BarChart3;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-primary/20 text-primary';
      case 'improvement': return 'bg-secondary text-secondary-foreground';
      case 'trend': return 'bg-accent/20 text-accent-foreground';
      default: return 'bg-muted text-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading clean-text flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Summary
          </h2>
          <p className="text-sm clean-text-muted">
            Your productivity insights for this week
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateWeeklySummary}
          disabled={loading}
          className="clean-card"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Weekly Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="clean-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm clean-text-muted">
                Total Screenshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading clean-text">
                {stats.totalScreenshots}
              </div>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm clean-text-muted">
                Apps Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading clean-text">
                {stats.uniqueApps}
              </div>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm clean-text-muted">
                Most Used App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-heading clean-text truncate">
                {stats.mostUsedApp}
              </div>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm clean-text-muted">
                Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-lg font-heading clean-text capitalize">
                  {stats.productivityTrend}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekly Insights */}
      <div className="space-y-4">
        <h3 className="text-base font-heading clean-text">
          AI Insights & Recommendations
        </h3>
        
        {insights.map((insight) => {
          const IconComponent = getInsightIcon(insight.type);
          return (
            <Card key={insight.id} className="clean-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-heading clean-text">
                      {insight.title}
                    </CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getInsightColor(insight.type)}`}
                  >
                    {insight.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="clean-text">{insight.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!stats?.totalScreenshots && (
        <Card className="clean-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 clean-text-muted mb-4" />
              <h3 className="text-lg font-heading clean-text mb-2">
                Not Enough Data Yet
              </h3>
              <p className="clean-text-muted">
                Use the app throughout the week to generate meaningful insights and trends.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}