import { useState } from "react";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, TrendingUp, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  const handleToggleTracking = (checked: boolean) => {
    setIsTracking(checked);
    toast({
      title: checked ? "Screenshot Tracking Enabled" : "Screenshot Tracking Disabled",
      description: checked 
        ? "AI will now analyze your workflow patterns to provide insights."
        : "Screenshot analysis has been paused.",
    });
  };

  const stats = [
    {
      title: "Screenshots Today",
      value: "127",
      change: "+12%",
      icon: Camera,
      color: "text-blue-400",
    },
    {
      title: "Active Time",
      value: "6.2h",
      change: "+5%",
      icon: Clock,
      color: "text-green-400",
    },
    {
      title: "Productivity Score",
      value: "8.4/10",
      change: "+0.3",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    {
      title: "AI Insights",
      value: "23",
      change: "+7",
      icon: Zap,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Main Toggle Section */}
      <div className="glass rounded-2xl p-12 text-center transition-smooth">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Shield className="mx-auto h-12 w-12 text-white mb-4 drop-shadow-lg" />
            <h2 className="text-3xl font-heading text-white glass-text mb-2">
              Screenshot Analysis
            </h2>
            <p className="text-lg text-white/80 glass-text">
              Enable AI-powered workflow tracking to get personalized insights and recommendations
            </p>
          </div>

          <div className="mb-6">
            <ToggleSwitch
              checked={isTracking}
              onCheckedChange={handleToggleTracking}
              size="xl"
              className="mx-auto"
            />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Badge 
              variant={isTracking ? "default" : "secondary"}
              className={`${isTracking ? 'bg-green-600/80 text-white backdrop-blur-sm' : 'bg-white/20 text-white backdrop-blur-sm'} transition-smooth border-0`}
            >
              {isTracking ? "Active" : "Inactive"}
            </Badge>
            <span className="text-sm text-white/70 glass-text">
              {isTracking ? "Monitoring your workflow" : "Click to start tracking"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-subtle border-0 transition-smooth hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-body text-white/80 glass-text">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} drop-shadow-sm`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading text-white glass-text">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-green-400 drop-shadow-sm">{stat.change}</span>
                <span className="text-white/60 glass-text">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="glass-subtle border-0 transition-smooth">
        <CardHeader>
          <CardTitle className="text-white font-heading glass-text">Recent AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              time: "2 minutes ago",
              insight: "Detected increased focus on design tools - consider batching similar tasks",
              type: "Productivity",
            },
            {
              time: "15 minutes ago", 
              insight: "Communication apps usage up 30% - might benefit from scheduled check-ins",
              type: "Communication",
            },
            {
              time: "1 hour ago",
              insight: "Long coding session detected - remember to take breaks every 25 minutes",
              type: "Wellness",
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg glass-subtle">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-white/60 mt-2 shadow-sm"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white glass-text">{item.insight}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-white/10 text-white/80 border-white/20 backdrop-blur-sm">
                    {item.type}
                  </Badge>
                  <span className="text-xs text-white/60 glass-text">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}