
import { useState, useCallback } from 'react';
import { PhotoManagementService, JobPhoto, PhotoFolder } from '@/services/photoManagementService';
import { toast } from 'sonner';

export const useJobPhotos = (bookingId: string) => {
  const [photoFolder, setPhotoFolder] = useState<PhotoFolder>(() => 
    PhotoManagementService.getPhotosByBooking(bookingId)
  );

  const addBeforePhoto = useCallback((imageUrl: string, notes?: string) => {
    const newPhoto: JobPhoto = {
      id: `before-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      bookingId,
      type: 'before',
      imageUrl,
      timestamp: new Date().toISOString(),
      metadata: { notes }
    };

    PhotoManagementService.savePhoto(newPhoto);
    setPhotoFolder(PhotoManagementService.getPhotosByBooking(bookingId));
    toast.success('Before photo saved');
  }, [bookingId]);

  const addAfterPhoto = useCallback((imageUrl: string, notes?: string) => {
    const newPhoto: JobPhoto = {
      id: `after-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      bookingId,
      type: 'after',
      imageUrl,
      timestamp: new Date().toISOString(),
      metadata: { notes }
    };

    PhotoManagementService.savePhoto(newPhoto);
    setPhotoFolder(PhotoManagementService.getPhotosByBooking(bookingId));
    toast.success('After photo saved');
  }, [bookingId]);

  const deletePhoto = useCallback((photoId: string) => {
    PhotoManagementService.deletePhoto(photoId);
    setPhotoFolder(PhotoManagementService.getPhotosByBooking(bookingId));
    toast.success('Photo deleted');
  }, [bookingId]);

  const getAllPhotosForGallery = useCallback(() => {
    return PhotoManagementService.getPhotosForFeedback(bookingId);
  }, [bookingId]);

  return {
    photoFolder,
    addBeforePhoto,
    addAfterPhoto,
    deletePhoto,
    getAllPhotosForGallery
  };
};
