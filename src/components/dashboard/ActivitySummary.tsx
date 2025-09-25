import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  MousePointer, 
  Monitor, 
  CheckCircle2, 
  FileText, 
  Repeat, 
  Focus, 
  Zap,
  Users,
  Target,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface App {
  name: string;
  context: "primary" | "secondary";
  evidence: string;
}

interface TaskObserved {
  task_label: string;
  stage: "planning" | "execution" | "review" | "communication";
  evidence: string;
}

interface Artifact {
  type: "doc" | "sheet" | "slide" | "image" | "pdf" | "email" | "chat" | "calendar" | "code" | "other";
  title_or_filename: string;
  location: "tab" | "sidebar" | "main" | "dialog";
  evidence: string;
}

interface RepetitiveAction {
  pattern: "copy_paste" | "manual_entry" | "lookup" | "template_use" | "file_attachment" | "formatting";
  where: string;
  evidence: string;
}

interface TimeAndFocus {
  visible_timestamps: string[];
  multitasking_signs: string[];
  focus_mode: "single-task" | "multitasking";
}

interface ToolsDetected {
  already_in_use: string[];
  possible_integrations: string[];
}

interface ActivityAnalysis {
  apps: App[];
  tasks_observed: TaskObserved[];
  artifacts: Artifact[];
  repetitive_actions: RepetitiveAction[];
  time_and_focus: TimeAndFocus;
  tools_detected: ToolsDetected;
}

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

  const parseAnalysisData = (analysis: string): ActivityAnalysis | null => {
    try {
      return JSON.parse(analysis);
    } catch (error) {
      return null;
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'planning': return <Target className="h-4 w-4 text-blue-500" />;
      case 'execution': return <Zap className="h-4 w-4 text-green-500" />;
      case 'review': return <CheckCircle2 className="h-4 w-4 text-yellow-500" />;
      case 'communication': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'doc': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'sheet': return <Settings className="h-4 w-4 text-green-500" />;
      case 'slide': return <Monitor className="h-4 w-4 text-orange-500" />;
      case 'image': return <Activity className="h-4 w-4 text-pink-500" />;
      case 'email': return <Users className="h-4 w-4 text-red-500" />;
      case 'chat': return <Users className="h-4 w-4 text-indigo-500" />;
      case 'calendar': return <Clock className="h-4 w-4 text-purple-500" />;
      case 'code': return <Settings className="h-4 w-4 text-cyan-500" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'copy_paste': return <Repeat className="h-4 w-4 text-orange-500" />;
      case 'manual_entry': return <MousePointer className="h-4 w-4 text-blue-500" />;
      case 'lookup': return <Target className="h-4 w-4 text-green-500" />;
      case 'template_use': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'file_attachment': return <Activity className="h-4 w-4 text-red-500" />;
      case 'formatting': return <Settings className="h-4 w-4 text-yellow-500" />;
      default: return <Repeat className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderAnalysisSection = (data: ActivityAnalysis) => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Apps Section */}
        {data.apps && data.apps.length > 0 && (
          <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
            <div className="border-b border-border/30 pb-3 mb-4">
              <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                <Monitor className="h-4 w-4 text-primary" />
                Apps Detected
              </h4>
            </div>
            <div className="space-y-3">
              {data.apps.map((app, index) => (
                <div key={index} className="border border-border/30 rounded-lg p-3 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{app.name}</span>
                    <Badge variant={app.context === 'primary' ? 'default' : 'secondary'} className="text-xs">
                      {app.context}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Observed Section */}
        {data.tasks_observed && data.tasks_observed.length > 0 && (
          <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
            <div className="border-b border-border/30 pb-3 mb-4">
              <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Tasks Observed
              </h4>
            </div>
            <div className="space-y-3">
              {data.tasks_observed.map((task, index) => (
                <div key={index} className="border border-border/30 rounded-lg p-3 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{task.task_label}</span>
                    <div className="flex items-center gap-1">
                      {getStageIcon(task.stage)}
                      <span className="text-xs text-muted-foreground capitalize">{task.stage}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artifacts Section */}
        {data.artifacts && data.artifacts.length > 0 && (
          <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
            <div className="border-b border-border/30 pb-3 mb-4">
              <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Artifacts Created
              </h4>
            </div>
            <div className="space-y-3">
              {data.artifacts.map((artifact, index) => (
                <div key={index} className="border border-border/30 rounded-lg p-3 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getArtifactIcon(artifact.type)}
                      <span className="font-medium text-foreground">{artifact.title_or_filename}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {artifact.location}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{artifact.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repetitive Actions Section */}
        {data.repetitive_actions && data.repetitive_actions.length > 0 && (
          <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
            <div className="border-b border-border/30 pb-3 mb-4">
              <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary" />
                Repetitive Actions
              </h4>
            </div>
            <div className="space-y-3">
              {data.repetitive_actions.map((action, index) => (
                <div key={index} className="border border-border/30 rounded-lg p-3 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPatternIcon(action.pattern)}
                      <span className="font-medium text-foreground capitalize">
                        {action.pattern.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{action.where}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time and Focus Section */}
        {data.time_and_focus && (
          <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
            <div className="border-b border-border/30 pb-3 mb-4">
              <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                <Focus className="h-4 w-4 text-primary" />
                Time and Focus Analysis
              </h4>
            </div>
            <div className="space-y-4">
              <div className="border border-border/30 rounded-lg p-3 bg-background/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">Focus Mode</span>
                  <Badge variant={data.time_and_focus.focus_mode === 'single-task' ? 'default' : 'secondary'}>
                    {data.time_and_focus.focus_mode}
                  </Badge>
                </div>
                {data.time_and_focus.visible_timestamps.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-muted-foreground font-medium">Visible timestamps:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.time_and_focus.visible_timestamps.map((time, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{time}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {data.time_and_focus.multitasking_signs.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-muted-foreground font-medium">Multitasking signs:</span>
                    <ul className="mt-1 space-y-1">
                      {data.time_and_focus.multitasking_signs.map((sign, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tools Detected Section */}
        {data.tools_detected && (
          <div className="border border-border/50 rounded-xl p-4 bg-muted/20">
            <div className="border-b border-border/30 pb-3 mb-4">
              <h4 className="text-base font-heading text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Tools Analysis
              </h4>
            </div>
            <div className="space-y-4">
              {data.tools_detected.already_in_use.length > 0 && (
                <div className="border border-border/30 rounded-lg p-3 bg-background/50">
                  <span className="font-medium text-foreground text-sm mb-2 block">Already in use:</span>
                  <div className="flex flex-wrap gap-1">
                    {data.tools_detected.already_in_use.map((tool, index) => (
                      <Badge key={index} variant="default" className="text-xs">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {data.tools_detected.possible_integrations.length > 0 && (
                <div className="border border-border/30 rounded-lg p-3 bg-background/50">
                  <span className="font-medium text-foreground text-sm mb-2 block">Possible integrations:</span>
                  <div className="flex flex-wrap gap-1">
                    {data.tools_detected.possible_integrations.map((tool, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}
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