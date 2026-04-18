import { useState, useRef, ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useCreatePrediction } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Image as ImageIcon, X, Loader2, Sprout } from "lucide-react";

const CROP_TYPES = ["maize", "cassava", "rice", "tomato", "potato"];

export default function Scan() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createPrediction = useCreatePrediction();
  
  const [cropType, setCropType] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc).",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // remove data:image/jpeg;base64, prefix if needed by API, but keeping it full here unless specified
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!cropType) {
      toast({
        title: "Crop type required",
        description: "Please select the type of crop you are analyzing.",
        variant: "destructive",
      });
      return;
    }
    if (!imageBase64) {
      toast({
        title: "Image required",
        description: "Please upload an image of the plant leaf.",
        variant: "destructive",
      });
      return;
    }

    createPrediction.mutate(
      { data: { cropType, imageBase64 } },
      {
        onSuccess: (data) => {
          toast({
            title: "Analysis complete",
            description: "View the results below.",
          });
          setLocation(`/results/${data.id}`);
        },
        onError: (err) => {
          toast({
            title: "Analysis failed",
            description: "There was an error processing the image. Please try again.",
            variant: "destructive",
          });
          console.error(err);
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">New Scan</h1>
        <p className="text-muted-foreground mt-1">Upload a leaf image for disease analysis.</p>
      </div>

      <Card className="shadow-md border-primary/20">
        <CardHeader>
          <CardTitle>Analysis Details</CardTitle>
          <CardDescription>Provide information about the plant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cropType">Crop Type</Label>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger id="cropType">
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Leaf Image</Label>
            
            {!imagePreview ? (
              <div 
                className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <UploadCloud className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">Click or drag image to upload</h3>
                <p className="text-sm text-muted-foreground">Ensure the leaf is clearly visible and in focus</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border bg-black/5 aspect-video flex items-center justify-center">
                <img 
                  src={imagePreview} 
                  alt="Leaf preview" 
                  className="max-h-full max-w-full object-contain"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t px-6 py-4">
          <Button 
            className="w-full text-lg h-12" 
            onClick={handleSubmit}
            disabled={createPrediction.isPending || !imageFile || !cropType}
          >
            {createPrediction.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Sprout className="mr-2 h-5 w-5" />
                Analyze Crop Health
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
