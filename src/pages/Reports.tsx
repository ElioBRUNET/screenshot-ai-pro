import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Lightbulb, 
  ArrowUp, 
  ArrowDown,
  Download,
  Calendar,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

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

export default function Reports() {
  const [recommendations, setRecommendations] = useState<ParsedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useUser();
  const { toast } = useToast();

  const fetchDailyRecommendations = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_recommendations' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch recommendations",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const dailyRec = data[0] as unknown as DailyRecommendation;
        const parsedRecommendations = parseRecommendations(dailyRec.recommendations);
        setRecommendations(parsedRecommendations);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
        title: rec.title || rec.tip || rec.recommendation || 'Productivity Tip',
        description: rec.description || rec.details || rec.content || 'No description available',
        impact: rec.impact || rec.priority || 'Medium',
        timeToImplement: rec.timeToImplement || rec.time_required || rec.duration || '15 minutes',
        category: rec.category || rec.topic || rec.area || 'General',
        status: rec.status || rec.implementation_status || 'New',
        priority: rec.priority || rec.importance,
        actionSteps: rec.actionSteps || rec.action_steps || rec.steps
      }));
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchDailyRecommendations();
  }, [session]);

  const renderValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value || '');
  };

  const weeklyMetrics = [
    { 
      label: "Total Recommendations", 
      value: recommendations.length, 
      change: recommendations.length > 0 ? 12 : 0, 
      trend: "up" as const 
    },
    { 
      label: "High Impact Tips", 
      value: Math.round((recommendations.filter(r => r.impact === 'High').length / Math.max(recommendations.length, 1)) * 100), 
      change: 5, 
      trend: "up" as const 
    },
    { 
      label: "Implementation Ready", 
      value: Math.round((recommendations.filter(r => r.status === 'New').length / Math.max(recommendations.length, 1)) * 100), 
      change: 8, 
      trend: "up" as const 
    },
    { 
      label: "Completed Tips", 
      value: Math.round((recommendations.filter(r => r.status === 'Completed').length / Math.max(recommendations.length, 1)) * 100), 
      change: 15, 
      trend: "up" as const 
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold glass-text-high-contrast mb-2">AI Insights & Reports</h1>
            <p className="glass-text-muted">
              Personalized recommendations based on your workflow analysis
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="glass-text-container glass-text border-0">
              <Calendar className="h-4 w-4 mr-2" />
              This Week
            </Button>
            <Button variant="outline" className="glass-text-container glass-text border-0">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeklyMetrics.map((metric) => (
          <Card key={metric.label} className="glass-subtle border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm glass-text-muted">{metric.label}</p>
                <div className={`flex items-center text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold glass-text-high-contrast">{metric.value}%</div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="glass-subtle border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 glass-text-high-contrast">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Daily AI Recommendations</span>
            <Button
              onClick={fetchDailyRecommendations}
              disabled={loading}
              size="sm"
              variant="ghost"
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="mx-auto h-8 w-8 text-primary mb-2 animate-spin" />
              <p className="text-sm glass-text-muted">Loading your daily recommendations...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="mx-auto h-12 w-12 text-primary/50 mb-3" />
              <p className="text-sm glass-text-muted">
                No recommendations available yet.
              </p>
              <p className="text-xs glass-text-muted mt-2">
                Generate your daily report to get personalized AI recommendations.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
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

      {/* Implementation Progress */}
      <Card className="glass-subtle border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 glass-text-high-contrast">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Implementation Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold glass-text-high-contrast mb-1">
                {recommendations.length}
              </div>
              <div className="text-sm glass-text-muted">Total Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {recommendations.filter(r => r.status === 'Completed').length}
              </div>
              <div className="text-sm glass-text-muted">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-1">
                {recommendations.filter(r => r.impact === 'High').length}
              </div>
              <div className="text-sm glass-text-muted">High Impact Tips</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}