
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
      id: item.id, // Note: may need to generate UUID if id isn't valid
      name: item.name,
      category: item.category,
      stock_in: item.stockIn,
      stock_out: item.stockOut,
      supplier: item.supplier,
      reorder_point: item.reorderPoint,
      allocated_stock: item.allocatedStock || {},
      location: "Warehouse", // Default location
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
    
    toast.success("Warehouse inventory migrated to database");
  } catch (error) {
    console.error("Error migrating warehouse inventory:", error);
    toast.error("Failed to migrate warehouse inventory");
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
    
    // Get testimonials from localStorage or use defaults
    const savedTestimonials = localStorage.getItem('testimonials');
    const testimonials = savedTestimonials ? JSON.parse(savedTestimonials) : getTestimonials();
    
    // Combine items and testimonials
    const allItems = [
      ...galleryItems.map(item => ({
        category: item.category,
        images: Array.isArray(item.images) ? item.images : [item.images],
        title: item.title || null,
        description: item.description || null
      })),
      ...testimonials.map(item => ({
        category: "testimonial",
        images: [item.image],
        title: item.name,
        description: `${item.vehicle} - ${item.text}`
      }))
    ];
    
    if (allItems.length === 0) {
      return; // No items to migrate
    }
    
    // Insert data into Supabase
    const { error } = await supabase
      .from("gallery_items")
      .insert(allItems);
      
    if (error) {
      throw error;
    }
    
    toast.success("Gallery items migrated to database");
  } catch (error) {
    console.error("Error migrating gallery items:", error);
    toast.error("Failed to migrate gallery items");
  }
};

// Migrate appointment tasks
export const migrateAppointmentTasks = async (): Promise<void> => {
  try {
    // First check if we already have appointment tasks in the database
    const { data: existingTasks } = await supabase
      .from("appointment_tasks")
      .select("id")
      .limit(1);
    
    if (existingTasks && existingTasks.length > 0) {
      console.log("Appointment tasks already migrated, skipping");
      return;
    }
    
    // Get appointment tasks from localStorage
    const savedTasks = localStorage.getItem('appointmentTasks');
    if (!savedTasks) {
      return; // No tasks to migrate
    }
    
    const appointmentTasks = JSON.parse(savedTasks);
    
    // Process each appointment and its service tasks
    for (const appointment of appointmentTasks) {
      // Insert the appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from("appointment_tasks")
        .insert({
          appointment_name: appointment.appointmentName,
          customer: appointment.customer,
          vehicle: appointment.vehicle,
          date_scheduled: appointment.dateScheduled,
          time_slot: appointment.timeSlot,
          completed: appointment.completed || false
        })
        .select();
        
      if (appointmentError || !appointmentData) {
        console.error("Error migrating appointment:", appointmentError);
        continue;
      }
      
      const appointmentId = appointmentData[0].id;
      
      // Insert all service tasks for this appointment
      if (appointment.services && appointment.services.length > 0) {
        const serviceTasks = appointment.services.map(service => ({
          appointment_id: appointmentId,
          name: service.name,
          allocated_time: service.allocatedTime,
          time_spent: service.timeSpent,
          completed: service.completed
        }));
        
        const { error: serviceError } = await supabase
          .from("service_tasks")
          .insert(serviceTasks);
          
        if (serviceError) {
          console.error("Error migrating service tasks:", serviceError);
        }
      }
    }
    
    toast.success("Appointment tasks migrated to database");
  } catch (error) {
    console.error("Error migrating appointment tasks:", error);
    toast.error("Failed to migrate appointment tasks");
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
  
  // Migrate data in sequence
  await migrateWarehouseInventory();
  await migrateGalleryItems();
  await migrateAppointmentTasks();
  
  // Mark migration as complete
  localStorage.setItem('dataMigrationComplete', 'true');
  
  toast.success("Data migration complete!");
};
