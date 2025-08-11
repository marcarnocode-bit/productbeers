export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "participant" | "organizer" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "participant" | "organizer" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "participant" | "organizer" | "admin"
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string | null
          is_virtual: boolean
          max_participants: number | null
          organizer_id: string
          status: "draft" | "published" | "cancelled" | "completed"
          image_url: string | null
          terms_and_conditions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date: string
          location?: string | null
          is_virtual?: boolean
          max_participants?: number | null
          organizer_id: string
          status?: "draft" | "published" | "cancelled" | "completed"
          image_url?: string | null
          terms_and_conditions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string
          location?: string | null
          is_virtual?: boolean
          max_participants?: number | null
          status?: "draft" | "published" | "cancelled" | "completed"
          image_url?: string | null
          terms_and_conditions?: string | null
          updated_at?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: "registered" | "attended" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: "registered" | "attended" | "cancelled"
          created_at?: string
        }
        Update: {
          status?: "registered" | "attended" | "cancelled"
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          email: string
          full_name: string
          phone: string | null
          company: string | null
          position: string | null
          terms_accepted: boolean
          privacy_accepted: boolean
          marketing_accepted: boolean
          status: "registered" | "attended" | "cancelled"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          company?: string | null
          position?: string | null
          terms_accepted?: boolean
          privacy_accepted?: boolean
          marketing_accepted?: boolean
          status?: "registered" | "attended" | "cancelled"
          created_at?: string
          updated_at?: string
        }
        Update: {
          phone?: string | null
          company?: string | null
          position?: string | null
          status?: "registered" | "attended" | "cancelled"
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          event_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
        }
      }
      canvas_data: {
        Row: {
          id: string
          event_id: string
          data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          data?: any
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string | null
          file_path: string | null
          resource_type: "document" | "video" | "link" | "template" | "article"
          event_id: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url?: string | null
          file_path?: string | null
          resource_type?: "document" | "video" | "link" | "template" | "article"
          event_id?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          url?: string | null
          file_path?: string | null
          resource_type?: "document" | "video" | "link" | "template" | "article"
          event_id?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          company: string | null
          position: string | null
          skills: string[] | null
          interests: string[] | null
          linkedin_url: string | null
          twitter_url: string | null
          website_url: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          company?: string | null
          position?: string | null
          skills?: string[] | null
          interests?: string[] | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company?: string | null
          position?: string | null
          skills?: string[] | null
          interests?: string[] | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          is_public?: boolean
          updated_at?: string
        }
      }
      sponsors: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          contact_email: string | null
          tier: "bronze" | "silver" | "gold" | "platinum"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          contact_email?: string | null
          tier?: "bronze" | "silver" | "gold" | "platinum"
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          contact_email?: string | null
          tier?: "bronze" | "silver" | "gold" | "platinum"
        }
      }
      event_sponsors: {
        Row: {
          id: string
          event_id: string
          sponsor_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          sponsor_id: string
          created_at?: string
        }
        Update: {
          event_id?: string
          sponsor_id?: string
        }
      }
    }
  }
}

export type Event = Database["public"]["Tables"]["events"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type EventParticipant = Database["public"]["Tables"]["event_participants"]["Row"]
export type EventRegistration = Database["public"]["Tables"]["event_registrations"]["Row"]
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
