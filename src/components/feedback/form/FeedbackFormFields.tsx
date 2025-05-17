
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import ImageUploader from "./ImageUploader";

export interface FeedbackFormData {
  rating: number;
  comment: string;
  name: string;
  email: string;
}

interface FeedbackFormFieldsProps {
  initialValues: {
    name: string;
    email: string;
  };
  onSubmit: (data: FeedbackFormData, images: string[]) => void;
  serviceDate?: string;
}

const FeedbackFormFields = ({ initialValues, onSubmit, serviceDate }: FeedbackFormFieldsProps) => {
  const [rating, setRating] = React.useState<number>(0);
  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);
  
  const form = useForm<FeedbackFormData>({
    defaultValues: {
      rating: 0,
      comment: "",
      name: initialValues.name || "",
      email: initialValues.email || "",
    },
  });

  const handleSubmit = (data: FeedbackFormData) => {
    onSubmit({
      ...data,
      rating,
    }, uploadedImages);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            How was your experience?
          </h2>
          {serviceDate && (
            <p className="text-gray-400 mb-2">
              Service Date: {serviceDate}
            </p>
          )}
          
          <StarRating 
            rating={rating} 
            setRating={setRating} 
            setFormValue={(value) => form.setValue("rating", value)}
          />
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

          <ImageUploader 
            uploadedImages={uploadedImages} 
            setUploadedImages={setUploadedImages}
          />
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
  );
};

export default FeedbackFormFields;
