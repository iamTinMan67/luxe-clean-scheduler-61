
import { supabase } from "@/integrations/supabase/client";
import { WarehouseItem } from "@/types/warehouseInventory";
import { toast } from "sonner";
import { getDefaultInventory } from "@/utils/warehouseInventoryUtils";
import { getDefaultItems, getTestimonials } from "@/utils/galleryData";

// Check if data migration has already been performed
export const checkMigrationStatus = async (): Promise<boolean> => {
  const { data: migrationStatus } = await supabase
    .from("inventory_items")
    .select("id")
    .limit(1);
  
  // If we have data in the database, assume migration was done
  return migrationStatus && migrationStatus.length > 0;
};

// Migrate warehouse inventory
export const migrateWarehouseInventory = async (): Promise<void> => {
  try {
    // First check if we already have inventory items in the database
    const { data: existingItems } = await supabase
      .from("inventory_items")
      .select("id")
      .limit(1);
    
    if (existingItems && existingItems.length > 0) {
      console.log("Inventory items already migrated, skipping");
      return;
    }
    
    // Get inventory from localStorage
    const savedInventory = localStorage.getItem('warehouseInventory');
    let inventoryItems: WarehouseItem[] = [];
    
    if (savedInventory) {
      try {
        inventoryItems = JSON.parse(savedInventory);
      } catch (error) {
        console.error('Error parsing warehouse inventory:', error);
        inventoryItems = getDefaultInventory();
      }
    } else {
      inventoryItems = getDefaultInventory();
    }
    
    // Transform data for Supabase
    const transformedItems = inventoryItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      stock_in: item.stockIn,
      stock_out: item.stockOut,
      supplier: item.supplier,
      reorder_point: item.reorderPoint,
      allocated_stock: item.allocatedStock || {},
      location: "Warehouse",
      created_at: new Date(item.dateAdded).toISOString(),
      updated_at: new Date(item.lastUpdated).toISOString()
    }));
    
    // Insert data into Supabase
    const { error } = await supabase
      .from("inventory_items")
      .insert(transformedItems);
      
    if (error) {
      throw error;
    }
    
    console.log("Warehouse inventory migrated to database");
  } catch (error) {
    console.error("Error migrating warehouse inventory:", error);
    throw error;
  }
};

// Migrate gallery items
export const migrateGalleryItems = async (): Promise<void> => {
  try {
    // First check if we already have gallery items in the database
    const { data: existingItems } = await supabase
      .from("gallery_items")
      .select("id")
      .limit(1);
    
    if (existingItems && existingItems.length > 0) {
      console.log("Gallery items already migrated, skipping");
      return;
    }
    
    // Get gallery items from localStorage
    const savedGallery = localStorage.getItem('galleryItems');
    let galleryItems = savedGallery ? JSON.parse(savedGallery) : getDefaultItems();
    
    // Transform gallery items for Supabase
    const transformedGalleryItems = galleryItems.map(item => ({
      category: item.category,
      images: Array.isArray(item.images) ? item.images : [item.images],
      title: item.title || null,
      description: item.description || null
    }));
    
    if (transformedGalleryItems.length > 0) {
      // Insert data into Supabase
      const { error } = await supabase
        .from("gallery_items")
        .insert(transformedGalleryItems);
        
      if (error) {
        throw error;
      }
    }
    
    console.log("Gallery items migrated to database");
  } catch (error) {
    console.error("Error migrating gallery items:", error);
    throw error;
  }
};

// Migrate testimonials
export const migrateTestimonials = async (): Promise<void> => {
  try {
    // First check if we already have testimonials in the database
    const { data: existingTestimonials } = await supabase
      .from("testimonials")
      .select("id")
      .limit(1);
    
    if (existingTestimonials && existingTestimonials.length > 0) {
      console.log("Testimonials already migrated, skipping");
      return;
    }
    
    // Get testimonials from localStorage or use defaults
    const savedTestimonials = localStorage.getItem('testimonials');
    const testimonials = savedTestimonials ? JSON.parse(savedTestimonials) : getTestimonials();
    
    if (testimonials.length > 0) {
      // Insert testimonials into Supabase
      const { error } = await supabase
        .from("testimonials")
        .insert(testimonials);
        
      if (error) {
        throw error;
      }
    }
    
    console.log("Testimonials migrated to database");
  } catch (error) {
    console.error("Error migrating testimonials:", error);
    throw error;
  }
};

// Migrate bookings
export const migrateBookings = async (): Promise<void> => {
  try {
    // First check if we already have bookings in the database
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("id")
      .limit(1);
    
    if (existingBookings && existingBookings.length > 0) {
      console.log("Bookings already migrated, skipping");
      return;
    }
    
    // Get bookings from localStorage
    const confirmedBookings = localStorage.getItem('confirmedBookings');
    const pendingBookings = localStorage.getItem('pendingBookings');
    
    let allBookings = [];
    
    if (confirmedBookings) {
      try {
        const confirmed = JSON.parse(confirmedBookings);
        allBookings = [...allBookings, ...confirmed];
      } catch (error) {
        console.error('Error parsing confirmed bookings:', error);
      }
    }
    
    if (pendingBookings) {
      try {
        const pending = JSON.parse(pendingBookings);
        allBookings = [...allBookings, ...pending];
      } catch (error) {
        console.error('Error parsing pending bookings:', error);
      }
    }
    
    if (allBookings.length === 0) {
      return; // No bookings to migrate
    }
    
    // Transform bookings for Supabase
    const transformedBookings = allBookings.map(booking => ({
      id: booking.id,
      customer_name: booking.yourName || booking.customerName,
      customer_email: booking.email || booking.customerEmail,
      customer_phone: booking.phone || booking.customerPhone,
      location: booking.postcode || booking.location,
      vehicle_type: booking.vehicleType,
      package_type: booking.packageType,
      date: new Date(booking.date).toISOString().split('T')[0],
      time: booking.timeSlot || booking.time,
      start_time: booking.startTime,
      end_time: booking.endTime,
      status: booking.status,
      progress_percentage: booking.progressPercentage || 0,
      total_price: booking.totalPrice || 0,
      notes: booking.notes || booking.jobDetails,
      staff: booking.staff || [],
      condition: booking.condition || 5
    }));
    
    // Insert bookings into Supabase
    const { error } = await supabase
      .from("bookings")
      .insert(transformedBookings);
      
    if (error) {
      throw error;
    }
    
    console.log("Bookings migrated to database");
  } catch (error) {
    console.error("Error migrating bookings:", error);
    throw error;
  }
};

// Migrate customer feedback
export const migrateFeedback = async (): Promise<void> => {
  try {
    // First check if we already have feedback in the database
    const { data: existingFeedback } = await supabase
      .from("customer_feedback")
      .select("id")
      .limit(1);
    
    if (existingFeedback && existingFeedback.length > 0) {
      console.log("Customer feedback already migrated, skipping");
      return;
    }
    
    // Get feedback from localStorage
    const savedFeedback = localStorage.getItem('customerFeedback');
    
    if (!savedFeedback) {
      return; // No feedback to migrate
    }
    
    const feedback = JSON.parse(savedFeedback);
    
    if (feedback.length === 0) {
      return;
    }
    
    // Transform feedback for Supabase
    const transformedFeedback = feedback.map(item => ({
      booking_id: item.bookingId || '',
      customer_name: item.name || item.customerName,
      email: item.email || '',
      rating: item.rating,
      comment: item.comment,
      images: item.images || [],
      responded: item.responded || false,
      date: item.date ? new Date(item.date).toISOString() : new Date().toISOString()
    }));
    
    // Insert feedback into Supabase
    const { error } = await supabase
      .from("customer_feedback")
      .insert(transformedFeedback);
      
    if (error) {
      throw error;
    }
    
    console.log("Customer feedback migrated to database");
  } catch (error) {
    console.error("Error migrating customer feedback:", error);
    throw error;
  }
};

// Migrate service progress
export const migrateServiceProgress = async (): Promise<void> => {
  try {
    // Get service progress from localStorage
    const savedProgress = localStorage.getItem('serviceProgress');
    
    if (!savedProgress) {
      return; // No service progress to migrate
    }
    
    const progressData = JSON.parse(savedProgress);
    
    if (progressData.length === 0) {
      return;
    }
    
    // Insert service progress into Supabase
    const { error } = await supabase
      .from("service_progress")
      .insert(progressData.map(item => ({
        booking_id: item.bookingId,
        tasks: item.tasks,
        last_updated: item.lastUpdated || new Date().toISOString()
      })));
      
    if (error) {
      throw error;
    }
    
    console.log("Service progress migrated to database");
  } catch (error) {
    console.error("Error migrating service progress:", error);
    throw error;
  }
};

// Migrate van inventory
export const migrateVanInventory = async (): Promise<void> => {
  try {
    // Get van inventory from localStorage
    const savedVanInventory = localStorage.getItem('vanInventory');
    
    if (!savedVanInventory) {
      return; // No van inventory to migrate
    }
    
    const vanInventory = JSON.parse(savedVanInventory);
    
    // First ensure vans exist
    for (const vanData of Object.keys(vanInventory)) {
      const { data: existingVan } = await supabase
        .from("vans")
        .select("id")
        .eq("registration", vanData)
        .maybeSingle();
      
      if (!existingVan) {
        // Create van entry
        const { data: newVan, error } = await supabase
          .from("vans")
          .insert({ registration: vanData })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating van:", error);
          continue;
        }
        
        // Migrate inventory items for this van
        const items = vanInventory[vanData];
        if (items && items.length > 0) {
          const transformedItems = items.map(item => ({
            van_id: newVan.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit || 'units',
            threshold: item.threshold || 5,
            last_restocked: item.lastRestocked ? new Date(item.lastRestocked).toISOString().split('T')[0] : null
          }));
          
          const { error: itemsError } = await supabase
            .from("van_inventory_items")
            .insert(transformedItems);
          
          if (itemsError) {
            console.error("Error migrating van inventory items:", itemsError);
          }
        }
      }
    }
    
    console.log("Van inventory migrated to database");
  } catch (error) {
    console.error("Error migrating van inventory:", error);
    throw error;
  }
};

// Migrate all data from localStorage to Supabase
export const migrateAllData = async (): Promise<void> => {
  const alreadyMigrated = await checkMigrationStatus();
  if (alreadyMigrated) {
    toast.info("Data already migrated to database");
    return;
  }
  
  toast.info("Starting data migration to database...");
  
  try {
    // Migrate data in sequence
    await migrateWarehouseInventory();
    await migrateGalleryItems();
    await migrateTestimonials();
    await migrateBookings();
    await migrateFeedback();
    await migrateServiceProgress();
    await migrateVanInventory();
    
    // Mark migration as complete
    localStorage.setItem('dataMigrationComplete', 'true');
    
    toast.success("Data migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    toast.error("Migration failed. Please try again.");
    throw error;
  }
};
