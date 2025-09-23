import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap, Target, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export function DailyRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useUser();

  useEffect(() => {
    generateDailyRecommendations();
  }, []);

  const generateDailyRecommendations = async () => {
    setLoading(true);
    try {
      // For MVP, we'll show static recommendations
      // In production, this would call an AI service based on user's daily activity
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Focus Time Block',
          description: 'Schedule a 2-hour deep work session for your most important task today.',
          category: 'Productivity',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Break Reminder',
          description: 'Take a 5-minute break every 25 minutes to maintain focus and avoid burnout.',
          category: 'Wellness',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Communication Batch',
          description: 'Check and respond to messages in dedicated time slots instead of constantly.',
          category: 'Communication',
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Task Prioritization',
          description: 'Use the Eisenhower Matrix to prioritize your tasks by urgency and importance.',
          category: 'Organization',
          priority: 'low'
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-white/20 glass-text';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Productivity': return Target;
      case 'Wellness': return Lightbulb;
      case 'Communication': return Zap;
      default: return Lightbulb;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/5 rounded"></div>
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
          <h2 className="text-lg font-heading glass-text-high-contrast">
            Today's AI Recommendations
          </h2>
          <p className="text-sm glass-text-muted">
            Personalized tips to boost your productivity
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateDailyRecommendations}
          disabled={loading}
          className="glass-subtle border-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const IconComponent = getCategoryIcon(rec.category);
          return (
            <Card key={rec.id} className="glass-subtle border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-heading glass-text-high-contrast">
                      {rec.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs border-0 ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs glass-text-container border-0">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="glass-text">{rec.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-subtle border-0">
        <CardContent className="pt-6">
          <div className="text-center">
            <Zap className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="text-sm glass-text-muted">
              More personalized recommendations will appear as you use the app more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}