import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { DailyRecommendations } from "@/components/dashboard/DailyRecommendations";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="space-y-6">
      <div className="clean-card rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-heading text-foreground font-medium mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your productivity and get AI-powered insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-primary/5 to-accent/5 border border-border/50 p-1 rounded-xl">
            <TabsTrigger 
              value="activity" 
              className="text-foreground data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <span className="font-semibold">Activity Summary</span>
            </TabsTrigger>
            <TabsTrigger 
              value="daily" 
              className="text-foreground data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <span className="font-semibold">Daily AI Tips</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <ActivitySummary />
          </TabsContent>

          <TabsContent value="daily" className="mt-6">
            <DailyRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}