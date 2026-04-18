import { useLocation } from "wouter";
import { useListDiseases } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function DiseaseLibrary() {
  const [, setLocation] = useLocation();
  const { data: diseases, isLoading } = useListDiseases();
  const [search, setSearch] = useState("");

  const filteredDiseases = diseases?.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.cropType.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Disease Library</h1>
          <p className="text-muted-foreground mt-1">Educational reference for common crop diseases in the region.</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search library..." 
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredDiseases.length > 0 ? (
          filteredDiseases.map((disease) => (
            <Card key={disease.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow h-full border-primary/10">
              <div className="h-40 bg-muted/30 relative border-b">
                {disease.imageUrl ? (
                  <img src={disease.imageUrl} alt={disease.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 opacity-20" />
                  </div>
                )}
                <Badge className="absolute top-3 left-3 capitalize shadow-sm">
                  {disease.cropType}
                </Badge>
                <Badge variant={
                  disease.severity === 'high' ? 'destructive' : 
                  disease.severity === 'medium' ? 'default' : 'secondary'
                } className="absolute top-3 right-3 capitalize shadow-sm">
                  {disease.severity} severity
                </Badge>
              </div>
              <CardContent className="p-5 flex-1">
                <h3 className="font-bold text-xl font-serif mb-2 line-clamp-1">{disease.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {disease.description}
                </p>
              </CardContent>
              <CardFooter className="p-5 pt-0 mt-auto border-t bg-muted/10">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between hover:bg-primary/10 hover:text-primary"
                  onClick={() => setLocation(`/diseases/${disease.id}`)}
                >
                  Read Field Manual
                  <BookOpen className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold">No entries found</h3>
            <p className="text-muted-foreground">
              {search ? "Try adjusting your search terms." : "The library is currently empty."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
