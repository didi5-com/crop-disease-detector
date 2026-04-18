import { useLocation } from "wouter";
import { useListPredictions } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search, Sprout, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function History() {
  const [, setLocation] = useLocation();
  const { data: predictions, isLoading } = useListPredictions();
  const [search, setSearch] = useState("");

  const filteredPredictions = predictions?.filter(p => 
    p.cropType.toLowerCase().includes(search.toLowerCase()) || 
    p.diseaseName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Scan History</h1>
          <p className="text-muted-foreground mt-1">Review past diagnoses and track field health.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by crop or disease..." 
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : filteredPredictions.length > 0 ? (
          filteredPredictions.map((prediction) => (
            <Card 
              key={prediction.id} 
              className="overflow-hidden hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setLocation(`/results/${prediction.id}`)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                  {/* Status Indicator Bar */}
                  <div className={`h-2 sm:h-auto sm:w-2 sm:self-stretch ${prediction.isHealthy ? 'bg-primary' : 'bg-destructive'}`} />
                  
                  <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="secondary" className="capitalize">
                          {prediction.cropType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(prediction.createdAt), "MMM d, yyyy • h:mm a")}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {prediction.isHealthy ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        )}
                        {prediction.diseaseName}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                        <div className="font-bold">{(prediction.confidence * 100).toFixed(0)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Severity</div>
                        {!prediction.isHealthy ? (
                          <Badge variant={
                            prediction.severity === 'high' ? 'destructive' : 
                            prediction.severity === 'medium' ? 'default' : 'secondary'
                          } className="capitalize">
                            {prediction.severity}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-primary border-primary/20">None</Badge>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold">No scans found</h3>
            <p className="text-muted-foreground">
              {search ? "No results match your search." : "You haven't analyzed any crops yet."}
            </p>
            {!search && (
              <Button className="mt-4" onClick={() => setLocation("/scan")}>
                Start First Scan
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
