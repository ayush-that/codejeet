"use client";

import { useSyncExternalStore } from "react";
import LeetCodeDashboard from "@/components/LeetCodeDashboard";
import {
  subscribeToDashboard,
  getDashboardSnapshot,
  getDashboardServerSnapshot,
} from "@/lib/dashboard-store";

export default function DashboardClient() {
  const { data, loading } = useSyncExternalStore(
    subscribeToDashboard,
    getDashboardSnapshot,
    getDashboardServerSnapshot
  );

  return (
    <div className="container mx-auto py-8">
      <LeetCodeDashboard
        questions={data?.questions ?? []}
        companies={data?.companies ?? []}
        loading={loading}
      />
    </div>
  );
}
