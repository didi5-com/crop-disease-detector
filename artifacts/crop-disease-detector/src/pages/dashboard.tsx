import { useLocation } from "wouter";
import { useGetStatsSummary, useGetRecentActivity, useGetDiseaseDistribution } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScanLine, CheckCircle2, AlertTriangle, Activity, Sprout } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: isStatsLoading } = useGetStatsSummary();
  const { data: activity, isLoading: isActivityLoading } = useGetRecentActivity();
  const { data: distribution, isLoading: isDistributionLoading } = useGetDiseaseDistribution();

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Field Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of recent scans and crop health.</p>
        </div>
        <Button onClick={() => setLocation("/scan")} size="lg" className="gap-2 shadow-sm">
          <ScanLine className="h-5 w-5" />
          New Scan
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold font-serif">{stats?.totalScans || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-xs border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Healthy Plants</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold font-serif text-primary">{stats?.healthyPlants || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xs border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Diseases Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold font-serif text-destructive">{stats?.diseasesDetected || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xs border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <ScanLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold font-serif">
                {stats?.averageConfidence ? `${(stats.averageConfidence * 100).toFixed(1)}%` : "0%"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest crop scans from the field</CardDescription>
          </CardHeader>
          <CardContent>
            {isActivityLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activity && activity.length > 0 ? (
              <div className="space-y-4">
                {activity.map((pred) => (
                  <div
                    key={pred.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setLocation(`/results/${pred.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${pred.isHealthy ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                        {pred.isHealthy ? <Sprout className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{pred.cropType} - {pred.diseaseName}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(pred.createdAt), "PPp")}</p>
                      </div>
                    </div>
                    <Badge variant={pred.isHealthy ? "default" : "destructive"}>
                      {(pred.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Sprout className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No recent scans found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disease Distribution Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Disease Distribution</CardTitle>
            <CardDescription>Breakdown of detected issues</CardDescription>
          </CardHeader>
          <CardContent>
            {isDistributionLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
            ) : distribution && distribution.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="diseaseName"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value} scans (${props.payload.percentage.toFixed(1)}%)`,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground h-[300px] flex flex-col items-center justify-center">
                <PieChart className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>Not enough data to display chart.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
