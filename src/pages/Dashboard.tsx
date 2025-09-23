import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { DailyRecommendations } from "@/components/dashboard/DailyRecommendations";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-smooth">
        <div className="mb-6">
          <h1 className="text-2xl font-heading glass-text-high-contrast mb-2">
            Dashboard
          </h1>
          <p className="glass-text-muted">
            Track your productivity and get AI-powered insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-subtle border-0">
            <TabsTrigger value="activity" className="glass-text">
              Activity Summary
            </TabsTrigger>
            <TabsTrigger value="daily" className="glass-text">
              Daily AI Tips
            </TabsTrigger>
            <TabsTrigger value="weekly" className="glass-text">
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