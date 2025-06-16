
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import ImageUploader from "./ImageUploader";
import { PhotoManagementService } from "@/services/photoManagementService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Please provide at least 10 characters of feedback"),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormFieldsProps {
  onSubmit: (data: FeedbackFormData) => void;
  initialValues?: Partial<FeedbackFormData>;
  serviceDate?: string;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  bookingId?: string;
}

const FeedbackFormFields = ({ 
  onSubmit, 
  initialValues = {}, 
  serviceDate, 
  uploadedImages,
  setUploadedImages,
  bookingId
}: FeedbackFormFieldsProps) => {
  const [selectedJobPhotos, setSelectedJobPhotos] = useState<string[]>([]);
  
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: initialValues.name || "",
      email: initialValues.email || "",
      rating: 0,
      comment: "",
      ...initialValues,
    },
  });

  // Get job photos if bookingId is available
  const jobPhotos = bookingId ? PhotoManagementService.getPhotosByBooking(bookingId) : null;

  const handleSubmit = (data: FeedbackFormData) => {
    // Combine uploaded images with selected job photos
    const allImages = [...uploadedImages, ...selectedJobPhotos];
    
    // Update the uploaded images state to include selected job photos
    setUploadedImages(allImages);
    
    onSubmit(data);
  };

  const toggleJobPhoto = (photoUrl: string) => {
    setSelectedJobPhotos(prev => 
      prev.includes(photoUrl) 
        ? prev.filter(url => url !== photoUrl)
        : [...prev, photoUrl]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Share Your Experience</h2>
          {serviceDate && (
            <p className="text-gray-400">Service completed on: {serviceDate}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Your Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-gray-800 border-gray-600 text-white"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Overall Rating</FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  onRatingChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Your Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience..."
                  className="bg-gray-800 border-gray-600 text-white min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Photos Selection */}
        {jobPhotos && (jobPhotos.beforePhotos.length > 0 || jobPhotos.afterPhotos.length > 0) && (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Select Photos from Your Service</h3>
            
            {jobPhotos.beforePhotos.length > 0 && (
              <Card className="bg-gray-800/50 p-4">
                <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">Before</Badge>
                  Photos ({jobPhotos.beforePhotos.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {jobPhotos.beforePhotos.map((photo) => (
                    <div 
                      key={photo.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedJobPhotos.includes(photo.imageUrl) 
                          ? 'border-blue-500 ring-2 ring-blue-500/50' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => toggleJobPhoto(photo.imageUrl)}
                    >
                      <img src={photo.imageUrl} alt="Before service" className="w-full h-20 object-cover" />
                      {selectedJobPhotos.includes(photo.imageUrl) && (
                        <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {jobPhotos.afterPhotos.length > 0 && (
              <Card className="bg-gray-800/50 p-4">
                <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400">After</Badge>
                  Photos ({jobPhotos.afterPhotos.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {jobPhotos.afterPhotos.map((photo) => (
                    <div 
                      key={photo.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedJobPhotos.includes(photo.imageUrl) 
                          ? 'border-green-500 ring-2 ring-green-500/50' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      onClick={() => toggleJobPhoto(photo.imageUrl)}
                    >
                      <img src={photo.imageUrl} alt="After service" className="w-full h-20 object-cover" />
                      {selectedJobPhotos.includes(photo.imageUrl) && (
                        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {selectedJobPhotos.length > 0 && (
              <p className="text-sm text-gray-400">
                {selectedJobPhotos.length} job photo{selectedJobPhotos.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        <ImageUploader
          images={uploadedImages}
          onImagesChange={setUploadedImages}
        />

        <Button 
          type="submit" 
          className="w-full gold-gradient text-black font-semibold hover:shadow-gold/20 hover:shadow-lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackFormFields;
