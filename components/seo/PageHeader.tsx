/**
 * SEO-Optimized Page Header Component
 * Renders page title, description, and key stats
 */

import { Badge } from "@/components/ui/badge";
import type { DifficultyBreakdown } from "@/lib/seo";

interface PageHeaderProps {
  title: string;
  description: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  difficultyBreakdown?: DifficultyBreakdown;
  badges?: string[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  stats,
  difficultyBreakdown,
  badges,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h1>

      <p className="text-lg text-muted-foreground max-w-3xl mb-4">{description}</p>

      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {(stats || difficultyBreakdown) && (
        <div className="flex flex-wrap gap-4 md:gap-6">
          {stats?.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}

          {difficultyBreakdown && (
            <>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{difficultyBreakdown.easy}</div>
                <div className="text-sm text-muted-foreground">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {difficultyBreakdown.medium}
                </div>
                <div className="text-sm text-muted-foreground">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{difficultyBreakdown.hard}</div>
                <div className="text-sm text-muted-foreground">Hard</div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

/**
 * Compact stat card for grid layouts
 */
interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  className?: string;
}

export function StatCard({ label, value, sublabel, className = "" }: StatCardProps) {
  return (
    <div className={`p-4 rounded-lg border bg-card ${className}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium">{label}</div>
      {sublabel && <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>}
    </div>
  );
}

/**
 * Difficulty breakdown bar visualization
 */
interface DifficultyBarProps {
  breakdown: DifficultyBreakdown;
  className?: string;
}

export function DifficultyBar({ breakdown, className = "" }: DifficultyBarProps) {
  const total = breakdown.easy + breakdown.medium + breakdown.hard;
  if (total === 0) return null;

  const easyPercent = (breakdown.easy / total) * 100;
  const mediumPercent = (breakdown.medium / total) * 100;
  const hardPercent = (breakdown.hard / total) * 100;

  return (
    <div className={`${className}`}>
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        <div
          className="bg-green-500 transition-all"
          style={{ width: `${easyPercent}%` }}
          title={`Easy: ${breakdown.easy}`}
        />
        <div
          className="bg-yellow-500 transition-all"
          style={{ width: `${mediumPercent}%` }}
          title={`Medium: ${breakdown.medium}`}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${hardPercent}%` }}
          title={`Hard: ${breakdown.hard}`}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span className="text-green-500">{breakdown.easy} Easy</span>
        <span className="text-yellow-500">{breakdown.medium} Medium</span>
        <span className="text-red-500">{breakdown.hard} Hard</span>
      </div>
    </div>
  );
}
