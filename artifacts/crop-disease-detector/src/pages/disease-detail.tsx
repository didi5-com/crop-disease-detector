import { useRoute, useLocation } from "wouter";
import { useGetDisease, getGetDiseaseQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertTriangle, ShieldAlert, Thermometer, Info } from "lucide-react";

export default function DiseaseDetail() {
  const [, params] = useRoute("/diseases/:id");
  const [, setLocation] = useLocation();
  const id = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: disease, isLoading, isError } = useGetDisease(id, {
    query: { enabled: !!id, queryKey: getGetDiseaseQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !disease) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Disease Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the requested disease information.</p>
        <Button onClick={() => setLocation("/diseases")}>Return to Library</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Button variant="ghost" className="-ml-4" onClick={() => setLocation("/diseases")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>

      {/* Header section with background image if available */}
      <div className="relative rounded-2xl overflow-hidden bg-sidebar text-sidebar-foreground border shadow-md">
        {disease.imageUrl && (
          <div className="absolute inset-0 opacity-30">
            <img src={disease.imageUrl} alt={disease.name} className="w-full h-full object-cover mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-sidebar to-transparent" />
          </div>
        )}
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className="bg-background/10 text-sidebar-foreground border-sidebar-foreground/20 capitalize px-3 py-1">
              Crop: {disease.cropType}
            </Badge>
            <Badge variant="secondary" className={`capitalize px-3 py-1 border-none
              ${disease.severity === 'high' ? 'bg-destructive text-destructive-foreground' : 
                disease.severity === 'medium' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
              {disease.severity} Severity
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{disease.name}</h1>
          <p className="text-lg md:text-xl text-sidebar-foreground/80 max-w-2xl leading-relaxed">
            {disease.description}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-sm border-primary/20">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              Visual Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-foreground/80">
              {disease.symptoms.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0 flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{paragraph}</span>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-accent/20">
          <CardHeader className="bg-accent/5 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
              Treatment & Prevention
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-foreground/80">
              {disease.treatment.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center pt-8 border-t">
        <Button size="lg" onClick={() => setLocation("/scan")} className="gap-2">
          Scan a Crop Now
        </Button>
      </div>
    </div>
  );
}
