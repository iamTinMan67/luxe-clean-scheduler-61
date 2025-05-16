
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackFormProps {
  bookingId?: string; // Make bookingId optional
  customerName?: string;
  serviceDate?: string;
}

interface FeedbackFormValues {
  rating: number;
  comment: string;
  name: string;
  email: string;
}

const FeedbackForm = ({ bookingId, customerName, serviceDate }: FeedbackFormProps) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      rating: 0,
      comment: "",
      name: customerName || "",
      email: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // In a real implementation, you'd upload these to storage
    // For this demo, we'll use URL.createObjectURL to preview them
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  const onSubmit = (data: FeedbackFormValues) => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        description: "Please select a rating"
      });
      return;
    }

    // Generate a unique ID if bookingId is not provided
    const feedbackBookingId = bookingId || `manual-${Date.now()}`;

    // Combine form data with rating and images
    const feedbackData = {
      ...data,
      rating,
      images: uploadedImages,
      bookingId: feedbackBookingId,
      date: new Date().toISOString(),
    };

    // Store feedback in localStorage for now
    const storedFeedback = localStorage.getItem("customerFeedback");
    const feedbackArray = storedFeedback ? JSON.parse(storedFeedback) : [];
    feedbackArray.push(feedbackData);
    localStorage.setItem("customerFeedback", JSON.stringify(feedbackArray));

    // Update gallery items to include this feedback if relevant
    const galleryItemsStr = localStorage.getItem('galleryItems');
    if (galleryItemsStr) {
      try {
        const galleryItems = JSON.parse(galleryItemsStr);
        
        // Find if there's already a gallery item for this booking
        const existingItemIndex = galleryItems.findIndex((item: any) => 
          item.bookingId === feedbackBookingId
        );
        
        if (existingItemIndex >= 0) {
          // Update existing gallery item with feedback and images
          galleryItems[existingItemIndex] = {
            ...galleryItems[existingItemIndex],
            customerReview: {
              rating,
              comment: data.comment,
              date: new Date(),
              customerName: data.name,
              images: uploadedImages
            }
          };
        } else if (uploadedImages.length > 0) {
          // Create a new gallery item for this booking with the review and images
          const newItem = {
            id: Date.now(),
            category: "customer-feedback",
            bookingId: feedbackBookingId,
            title: `${data.name}'s Review`,
            images: uploadedImages,
            description: data.comment,
            customerReview: {
              rating,
              comment: data.comment,
              date: new Date(),
              customerName: data.name
            }
          };
          
          galleryItems.push(newItem);
        }
        
        // Save updated gallery items
        localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
      } catch (error) {
        console.error('Error updating gallery items:', error);
      }
    }

    toast({
      description: "Your feedback has been submitted successfully."
    });
    
    // Redirect to home after successful submission
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {bookingId ? "How was your experience?" : "Share Your Feedback"}
            </h2>
            {serviceDate && (
              <p className="text-gray-400 mb-2">
                Service Date: {serviceDate}
              </p>
            )}
            <div className="mt-6 flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    form.setValue("rating", star);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition duration-150"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      (hoveredRating ? star <= hoveredRating : star <= rating)
                        ? "fill-gold text-gold"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 text-gold">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
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
                  <FormLabel className="text-white">Email (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="bg-gray-800 border-gray-700 text-white"
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
                  <FormLabel className="text-white">Your Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share your experience with our service..."
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-white block mb-2">Upload Photos (optional)</FormLabel>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-bold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or WEBP (MAX. 5MB each)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {uploading && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full rounded-md" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white text-sm mb-2">Uploaded Images:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((src, index) => (
                      <div key={index} className="relative group h-24">
                        <img
                          src={src}
                          alt={`Uploaded ${index + 1}`}
                          className="h-full w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-gold hover:bg-gold/80 text-black font-bold transition-colors px-8 py-3"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default FeedbackForm;
