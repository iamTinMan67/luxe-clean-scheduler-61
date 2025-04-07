
export interface GalleryItem {
  id: number;
  category: string;
  images: string[];
  title?: string;
  description?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  vehicle: string;
  image: string;
  text: string;
}

export const getDefaultItems = (): GalleryItem[] => {
  return [
    {
      id: 1,
      category: "exterior",
      images: ["https://images.unsplash.com/photo-1635774855317-edf3ee4463db?q=80&w=1932&auto=format&fit=crop"],
      title: "Outside1",
      description: "Complete exterior detail with ceramic coating"
    },
    {
      id: 2,
      category: "interior",
      images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1887&auto=format&fit=crop"],
      title: "Inside1",
      description: "Full interior detailing with leather conditioning"
    },
    {
      id: 3,
      category: "exterior",
      images: ["https://images.unsplash.com/photo-1605515298946-d0573c9b2fdc?q=80&w=1915&auto=format&fit=crop"],
      title: "Outside2",
      description: "Full paint correction and ceramic coating"
    },
    {
      id: 4,
      category: "wheels",
      images: ["https://images.unsplash.com/photo-1626063438347-5a9878b3e58b?q=80&w=1965&auto=format&fit=crop"],
      title: "Wheel Detail1",
      description: "Complete wheel cleaning and ceramic protection"
    },
    {
      id: 5,
      category: "commercial",
      images: ["https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1170&auto=format&fit=crop"],
      title: "Commercial Fleet Detailing",
      description: "Regular maintenance cleaning for a delivery fleet"
    },
    {
      id: 6,
      category: "interior",
      images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop"],
      title: "Inside2",
      description: "Premium interior detailing with leather treatment"
    },
    {
      id: 7,
      category: "exterior",
      images: ["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1974&auto=format&fit=crop"],
      title: "Outside3",
      description: "Complete exterior detailing with paint correction"
    },
    {
      id: 8,
      category: "commercial",
      images: ["https://images.unsplash.com/photo-1583267746897-2cf415887172?q=80&w=1780&auto=format&fit=crop"],
      title: "Pickup Truck Detailing",
      description: "Full detail for a commercial pickup truck"
    },
    {
      id: 9,
      category: "wheels",
      images: ["https://images.unsplash.com/photo-1595171412833-4b6427b31c3f?q=80&w=1074&auto=format&fit=crop"],
      title: "Wheel Detail2",
      description: "Deep cleaning and protection for luxury wheels"
    }
  ];
};

export const getTestimonials = (): Testimonial[] => {
  return [
    {
      id: 1,
      name: "James Wilson",
      vehicle: "Bentley Continental GT",
      image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=1171&auto=format&fit=crop",
      text: "Absolutely outstanding service. My car looks awesome. The attention to detail is remarkable, and the ceramic coating has kept it looking pristine for months."
    },
    {
      id: 2,
      name: "Sarah Mitchell",
      vehicle: "Range Rover Autobiography",
      image: "https://images.unsplash.com/photo-1619468129361-605ebea04b44?q=80&w=1171&auto=format&fit=crop",
      text: "I've tried many valeting services but Mid-Cheshire is by far the best. They take such care with every aspect of the cleaning process with an outstanding finish. My Range Rover has never looked better."
    },
    {
      id: 3,
      name: "Emma Thompson",
      vehicle: "Audi RS6 Avant",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop",
      text: "The Elite package was worth every penny. My Audi hasn't looked this good since I drove it off the showroom floor. The paint correction work was flawless."
    }
  ];
};
