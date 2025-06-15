export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointment_tasks: {
        Row: {
          appointment_name: string
          completed: boolean | null
          created_at: string | null
          customer: string
          date_scheduled: string
          id: string
          time_slot: string
          updated_at: string | null
          vehicle: string
        }
        Insert: {
          appointment_name: string
          completed?: boolean | null
          created_at?: string | null
          customer: string
          date_scheduled: string
          id?: string
          time_slot: string
          updated_at?: string | null
          vehicle: string
        }
        Update: {
          appointment_name?: string
          completed?: boolean | null
          created_at?: string | null
          customer?: string
          date_scheduled?: string
          id?: string
          time_slot?: string
          updated_at?: string | null
          vehicle?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          staff_id: string
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          staff_id: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_additional_services: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          service_name: string
          service_price: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          service_name: string
          service_price: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          service_name?: string
          service_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_additional_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_staff_assignments: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          staff_name: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          staff_name: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          staff_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_staff_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_steps: {
        Row: {
          booking_id: string
          completed: boolean | null
          completion_time: string | null
          created_at: string | null
          estimated_time: string | null
          id: string
          name: string
          step_number: number
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          completed?: boolean | null
          completion_time?: string | null
          created_at?: string | null
          estimated_time?: string | null
          id?: string
          name: string
          step_number: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          completed?: boolean | null
          completion_time?: string | null
          created_at?: string | null
          estimated_time?: string | null
          id?: string
          name?: string
          step_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_steps_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_tracking: {
        Row: {
          booking_id: string
          created_at: string
          current_step: string | null
          estimated_completion: string | null
          id: string
          last_updated: string
          progress_percentage: number | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          current_step?: string | null
          estimated_completion?: string | null
          id?: string
          last_updated?: string
          progress_percentage?: number | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          current_step?: string | null
          estimated_completion?: string | null
          id?: string
          last_updated?: string
          progress_percentage?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          condition: number | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          date: string
          end_time: string | null
          id: string
          location: string
          notes: string | null
          package_type: string
          progress_percentage: number | null
          staff: Json | null
          start_time: string | null
          status: string
          time: string
          total_price: number
          updated_at: string | null
          vehicle_type: string
        }
        Insert: {
          condition?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          date: string
          end_time?: string | null
          id?: string
          location: string
          notes?: string | null
          package_type: string
          progress_percentage?: number | null
          staff?: Json | null
          start_time?: string | null
          status: string
          time: string
          total_price: number
          updated_at?: string | null
          vehicle_type: string
        }
        Update: {
          condition?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          date?: string
          end_time?: string | null
          id?: string
          location?: string
          notes?: string | null
          package_type?: string
          progress_percentage?: number | null
          staff?: Json | null
          start_time?: string | null
          status?: string
          time?: string
          total_price?: number
          updated_at?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          customer_name: string
          date: string
          email: string | null
          id: string
          images: string[] | null
          rating: number
          responded: boolean | null
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          customer_name: string
          date?: string
          email?: string | null
          id?: string
          images?: string[] | null
          rating: number
          responded?: boolean | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          customer_name?: string
          date?: string
          email?: string | null
          id?: string
          images?: string[] | null
          rating?: number
          responded?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          images: string[]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          images: string[]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inspection_custom_items: {
        Row: {
          completed: boolean | null
          id: string
          label: string
          report_id: string | null
        }
        Insert: {
          completed?: boolean | null
          id?: string
          label: string
          report_id?: string | null
        }
        Update: {
          completed?: boolean | null
          id?: string
          label?: string
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_custom_items_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "inspection_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_reports: {
        Row: {
          booking_id: string
          created_at: string | null
          date: string | null
          exterior_notes: string | null
          id: string
          images: string[] | null
          interior_notes: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          date?: string | null
          exterior_notes?: string | null
          id?: string
          images?: string[] | null
          interior_notes?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          date?: string | null
          exterior_notes?: string | null
          id?: string
          images?: string[] | null
          interior_notes?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          allocated_stock: Json | null
          category: string
          created_at: string | null
          id: string
          location: string
          name: string
          reorder_point: number
          stock_in: number
          stock_out: number
          supplier: string | null
          updated_at: string | null
        }
        Insert: {
          allocated_stock?: Json | null
          category: string
          created_at?: string | null
          id?: string
          location: string
          name: string
          reorder_point?: number
          stock_in?: number
          stock_out?: number
          supplier?: string | null
          updated_at?: string | null
        }
        Update: {
          allocated_stock?: Json | null
          category?: string
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          reorder_point?: number
          stock_in?: number
          stock_out?: number
          supplier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          quantity: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          booking_id: string
          created_at: string | null
          id: string
          paid: boolean | null
          payment_date: string | null
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          id?: string
          paid?: boolean | null
          payment_date?: string | null
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          id?: string
          paid?: boolean | null
          payment_date?: string | null
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_progress: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          last_updated: string
          tasks: Json
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          last_updated?: string
          tasks?: Json
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          last_updated?: string
          tasks?: Json
        }
        Relationships: []
      }
      service_tasks: {
        Row: {
          allocated_time: number
          appointment_id: string | null
          completed: boolean | null
          created_at: string | null
          id: string
          name: string
          time_spent: number | null
          updated_at: string | null
        }
        Insert: {
          allocated_time: number
          appointment_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          time_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          allocated_time?: number
          appointment_id?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          time_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_tasks_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string | null
          id: string
          name: string
          position: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          position?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          position?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          image: string | null
          name: string
          rating: number | null
          text: string
          vehicle: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          name: string
          rating?: number | null
          text: string
          vehicle: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          rating?: number | null
          text?: string
          vehicle?: string
        }
        Relationships: []
      }
      van_inventory_items: {
        Row: {
          category: string
          created_at: string
          id: string
          last_restocked: string | null
          name: string
          quantity: number
          threshold: number | null
          unit: string | null
          updated_at: string
          van_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          name: string
          quantity?: number
          threshold?: number | null
          unit?: string | null
          updated_at?: string
          van_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          name?: string
          quantity?: number
          threshold?: number | null
          unit?: string | null
          updated_at?: string
          van_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "van_inventory_items_van_id_fkey"
            columns: ["van_id"]
            isOneToOne: false
            referencedRelation: "vans"
            referencedColumns: ["id"]
          },
        ]
      }
      vans: {
        Row: {
          created_at: string | null
          id: string
          mot_date: string | null
          registration: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mot_date?: string | null
          registration: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mot_date?: string | null
          registration?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      z_staff_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          staff_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          staff_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          staff_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_availability_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
