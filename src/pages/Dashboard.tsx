import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { DailyRecommendations } from "@/components/dashboard/DailyRecommendations";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-heading text-foreground font-medium mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your productivity and get AI-powered insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted border-0">
            <TabsTrigger value="activity" className="text-foreground">
              Activity Summary
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-foreground">
              Daily AI Tips
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-foreground">
              Weekly Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <ActivitySummary />
          </TabsContent>

          <TabsContent value="daily" className="mt-6">
            <DailyRecommendations />
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <WeeklySummary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}