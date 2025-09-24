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
  Calendar
} from "lucide-react";

export default function Reports() {
  const recommendations = [
    {
      id: 1,
      title: "Optimize Communication Workflow",
      description: "You spend 40% of your time switching between Slack and email. Consider batching communication tasks into specific time blocks.",
      impact: "High",
      timeToImplement: "15 minutes",
      category: "Productivity",
      status: "New",
    },
    {
      id: 2,
      title: "Reduce Context Switching",
      description: "AI detected frequent app switching during coding sessions. Using focus mode or time-blocking could improve deep work periods.",
      impact: "Medium",
      timeToImplement: "30 minutes",
      category: "Focus",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Automate Repetitive Tasks",
      description: "Screenshots show repeated manual data entry patterns. Consider creating templates or scripts to automate these workflows.",
      impact: "High",
      timeToImplement: "2 hours",
      category: "Automation",
      status: "New",
    },
    {
      id: 4,
      title: "Schedule Regular Breaks",
      description: "Analysis shows 3-hour continuous work sessions without breaks. Implementing the Pomodoro technique could boost long-term productivity.",
      impact: "Medium",
      timeToImplement: "5 minutes",
      category: "Wellness",
      status: "Completed",
    },
  ];

  const weeklyMetrics = [
    { label: "Productivity Score", value: 84, change: 7, trend: "up" },
    { label: "Focus Time", value: 68, change: -3, trend: "down" },
    { label: "Task Completion", value: 92, change: 12, trend: "up" },
    { label: "Workflow Efficiency", value: 76, change: 5, trend: "up" },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-destructive text-destructive-foreground";
      case "Medium": return "bg-secondary text-secondary-foreground";
      case "Low": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-primary text-primary-foreground";
      case "In Progress": return "bg-secondary text-secondary-foreground";
      case "Completed": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="clean-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold clean-text mb-2">AI Insights & Reports</h1>
            <p className="clean-text-muted">
              Personalized recommendations based on your workflow analysis
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              This Week
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weeklyMetrics.map((metric) => (
          <Card key={metric.label} className="clean-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm clean-text-muted">{metric.label}</p>
                <div className={`flex items-center text-xs ${metric.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold clean-text">{metric.value}%</div>
                <Progress value={metric.value} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 clean-text">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="clean-card rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold clean-text mb-1">{rec.title}</h3>
                  <p className="text-sm clean-text-muted mb-2">{rec.description}</p>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge className={`${getImpactColor(rec.impact)} text-white`}>
                      {rec.impact} Impact
                    </Badge>
                    <Badge className={`${getStatusColor(rec.status)} text-white`}>
                      {rec.status}
                    </Badge>
                    <span className="clean-text-muted flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {rec.timeToImplement}
                    </span>
                    <span className="clean-text-muted flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      {rec.category}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="ml-4"
                >
                  Implement
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Implementation Progress */}
      <Card className="clean-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 clean-text">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Implementation Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold clean-text mb-1">12</div>
              <div className="text-sm clean-text-muted">Total Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">8</div>
              <div className="text-sm clean-text-muted">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">23%</div>
              <div className="text-sm clean-text-muted">Avg. Productivity Gain</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}