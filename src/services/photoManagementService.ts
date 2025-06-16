
export interface JobPhoto {
  id: string;
  bookingId: string;
  type: 'before' | 'after';
  imageUrl: string;
  timestamp: string;
  metadata?: {
    notes?: string;
    location?: string;
  };
}

export interface PhotoFolder {
  bookingId: string;
  beforePhotos: JobPhoto[];
  afterPhotos: JobPhoto[];
}

export class PhotoManagementService {
  private static STORAGE_KEY = 'jobPhotos';

  static savePhoto(photo: JobPhoto): void {
    const existingPhotos = this.getAllPhotos();
    const updatedPhotos = [...existingPhotos, photo];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPhotos));
  }

  static getPhotosByBooking(bookingId: string): PhotoFolder {
    const allPhotos = this.getAllPhotos();
    const bookingPhotos = allPhotos.filter(photo => photo.bookingId === bookingId);
    
    return {
      bookingId,
      beforePhotos: bookingPhotos.filter(photo => photo.type === 'before'),
      afterPhotos: bookingPhotos.filter(photo => photo.type === 'after')
    };
  }

  static getAllPhotos(): JobPhoto[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static deletePhoto(photoId: string): void {
    const existingPhotos = this.getAllPhotos();
    const updatedPhotos = existingPhotos.filter(photo => photo.id !== photoId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPhotos));
  }

  static getPhotosForFeedback(bookingId: string): string[] {
    const folder = this.getPhotosByBooking(bookingId);
    return [...folder.beforePhotos, ...folder.afterPhotos].map(photo => photo.imageUrl);
  }
}
