"use client";
import React from 'react';
import { OverviewHeader } from "@/components/dashboard/overview/overview-header";
import { QuickActions } from "@/components/dashboard/overview/quick-actions";
import { ActivityFeed } from "@/components/dashboard/overview/activity-feed";
import { StatsTracker } from "@/components/dashboard/overview/stats-tracker";
import { useAppSelector } from "@/store/hooks";

import { ProfileCompletionBanner } from "@/components/dashboard/overview/profile-completion-banner";

export default function DashboardOverviewPage() {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <div className="max-w-6xl mx-auto animation-fade-in pb-12">
      <ProfileCompletionBanner />
      <OverviewHeader name={user?.firstName || "there"} />
      <QuickActions />

      <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Recent Activity & Stats</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <ActivityFeed />
         <StatsTracker />
      </div>
    </div>
  );
}
