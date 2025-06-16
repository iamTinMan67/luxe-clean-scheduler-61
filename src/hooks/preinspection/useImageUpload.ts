
export const useImageUpload = () => {
  const handleImageUpload = (images: string[], setImages: (images: string[]) => void) => {
    // In a real app, this would upload to a server
    // For now, we'll just add a placeholder image
    setImages([...images, "https://placeholder.pics/svg/300x200/DEDEDE/555555/Vehicle%20Image"]);
  };

  return { handleImageUpload };
};
