import { useRoute, useLocation } from "wouter";
import { useGetPrediction, getGetPredictionQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, AlertTriangle, Info, ShieldAlert, Sprout, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function ResultDetail() {
  const [, params] = useRoute("/results/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: prediction, isLoading, isError } = useGetPrediction(id, {
    query: { enabled: !!id, queryKey: getGetPredictionQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !prediction) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Result Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the requested analysis result.</p>
        <Button onClick={() => setLocation("/dashboard")}>Return to Dashboard</Button>
      </div>
    );
  }

  const confidencePercentage = (prediction.confidence * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-2 -ml-4" onClick={() => setLocation("/history")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to History
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="capitalize px-3 py-1 bg-background text-sm">
              <Sprout className="mr-1.5 h-3.5 w-3.5" />
              {prediction.cropType}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {format(new Date(prediction.createdAt), "PPp")}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
            {prediction.isHealthy ? (
              <CheckCircle2 className="h-8 w-8 text-primary" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            )}
            {prediction.diseaseName}
          </h1>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-sm text-muted-foreground mb-1">Confidence Score</div>
          <div className="text-2xl font-bold font-serif">{confidencePercentage}%</div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6 mt-8">
        <div className="md:col-span-2 space-y-4">
          <div className="aspect-square md:aspect-auto md:h-full max-h-[400px] relative rounded-xl overflow-hidden border shadow-sm bg-muted/20">
            {prediction.imageUrl ? (
              <img 
                src={prediction.imageUrl} 
                alt={`Analyzed ${prediction.cropType} leaf`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                <Sprout className="h-16 w-16 mb-4 opacity-20" />
                <p>No image available for this analysis.</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className={`border-l-4 shadow-sm ${prediction.isHealthy ? 'border-l-primary' : 'border-l-destructive'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                Diagnosis
                {!prediction.isHealthy && (
                  <Badge variant={
                    prediction.severity === 'high' ? 'destructive' : 
                    prediction.severity === 'medium' ? 'default' : 'secondary'
                  } className="ml-auto capitalize">
                    {prediction.severity} Severity
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 text-lg leading-relaxed">
                {prediction.isHealthy 
                  ? `Great news! This ${prediction.cropType} plant appears to be completely healthy. Continue with your current farming practices.`
                  : `We detected ${prediction.diseaseName} on your ${prediction.cropType} crop. Immediate attention is recommended to prevent spread.`
                }
              </p>
            </CardContent>
          </Card>

          {!prediction.isHealthy && prediction.treatment && (
            <Card className="shadow-sm border-accent/20 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground/90">
                  <ShieldAlert className="h-5 w-5 text-accent" />
                  Recommended Treatment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-foreground/80">
                  {prediction.treatment.split('\n').map((paragraph, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 pt-4">
            <Button className="flex-1" variant="outline" onClick={() => setLocation("/scan")}>
              Scan Another Plant
            </Button>
            {!prediction.isHealthy && (
              <Button className="flex-1" onClick={() => setLocation("/diseases")}>
                View Disease Library
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
