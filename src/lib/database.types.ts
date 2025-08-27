// Generated TypeScript interfaces for Supabase tables
// These match the schema.sql file

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          timezone: string
          created_at: string
          updated_at: string
          google_id: string | null
          avatar: string | null
          bio: string | null
          address: string | null
          country: string | null
          language: string | null
          latitude: number | null
          longitude: number | null
          birthday: string | null
          is_address_public: boolean
          wake_up_time: string | null
          bed_time: string | null
          work_start_time: string | null
          work_end_time: string | null
          gym_time: string | null
          school_time: string | null
          google_calendar_id: string | null
          outlook_calendar_id: string | null
          apple_calendar_id: string | null
          calendar_sync_enabled: boolean
          measurement_system: string
          temperature_unit: string
          distance_unit: string
          email_verified: boolean
          email_verification_token: string | null
          email_verification_expires: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          timezone?: string
          created_at?: string
          updated_at?: string
          google_id?: string | null
          avatar?: string | null
          bio?: string | null
          address?: string | null
          country?: string | null
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          birthday?: string | null
          is_address_public?: boolean
          wake_up_time?: string | null
          bed_time?: string | null
          work_start_time?: string | null
          work_end_time?: string | null
          gym_time?: string | null
          school_time?: string | null
          google_calendar_id?: string | null
          outlook_calendar_id?: string | null
          apple_calendar_id?: string | null
          calendar_sync_enabled?: boolean
          measurement_system?: string
          temperature_unit?: string
          distance_unit?: string
          email_verified?: boolean
          email_verification_token?: string | null
          email_verification_expires?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          timezone?: string
          created_at?: string
          updated_at?: string
          google_id?: string | null
          avatar?: string | null
          bio?: string | null
          address?: string | null
          country?: string | null
          language?: string | null
          latitude?: number | null
          longitude?: number | null
          birthday?: string | null
          is_address_public?: boolean
          wake_up_time?: string | null
          bed_time?: string | null
          work_start_time?: string | null
          work_end_time?: string | null
          gym_time?: string | null
          school_time?: string | null
          google_calendar_id?: string | null
          outlook_calendar_id?: string | null
          apple_calendar_id?: string | null
          calendar_sync_enabled?: boolean
          measurement_system?: string
          temperature_unit?: string
          distance_unit?: string
          email_verified?: boolean
          email_verification_token?: string | null
          email_verification_expires?: string | null
        }
      }
      relationships: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
          created_at: string
          updated_at: string
          relationship_type: string | null
          how_long_together: string | null
          communication_style: string | null
          love_languages: string | null
          future_plans: string | null
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          status?: 'PENDING' | 'ACTIVE' | 'INACTIVE'
          created_at?: string
          updated_at?: string
          relationship_type?: string | null
          how_long_together?: string | null
          communication_style?: string | null
          love_languages?: string | null
          future_plans?: string | null
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          status?: 'PENDING' | 'ACTIVE' | 'INACTIVE'
          created_at?: string
          updated_at?: string
          relationship_type?: string | null
          how_long_together?: string | null
          communication_style?: string | null
          love_languages?: string | null
          future_plans?: string | null
        }
      }
      invitations: {
        Row: {
          id: string
          sender_id: string
          receiver_email: string
          token: string
          status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_email: string
          token: string
          status?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_email?: string
          token?: string
          status?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      meetups: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          location: string | null
          status: 'PLANNED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
          created_at: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_date: string
          end_date?: string | null
          location?: string | null
          status?: 'PLANNED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
          created_at?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          location?: string | null
          status?: 'PLANNED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
          created_at?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          all_day: boolean
          location: string | null
          created_at: string
          updated_at: string
          calendar_source: string | null
          external_event_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          all_day?: boolean
          location?: string | null
          created_at?: string
          updated_at?: string
          calendar_source?: string | null
          external_event_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          all_day?: boolean
          location?: string | null
          created_at?: string
          updated_at?: string
          calendar_source?: string | null
          external_event_id?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      relationship_status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
      meetup_status: 'PLANNED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
      invitation_status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'
    }
  }
}

// Helper types for common operations
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Relationship = Database['public']['Tables']['relationships']['Row']
export type RelationshipInsert = Database['public']['Tables']['relationships']['Insert']
export type RelationshipUpdate = Database['public']['Tables']['relationships']['Update']

export type Invitation = Database['public']['Tables']['invitations']['Row']
export type InvitationInsert = Database['public']['Tables']['invitations']['Insert']
export type InvitationUpdate = Database['public']['Tables']['invitations']['Update']

export type Meetup = Database['public']['Tables']['meetups']['Row']
export type MeetupInsert = Database['public']['Tables']['meetups']['Insert']
export type MeetupUpdate = Database['public']['Tables']['meetups']['Update']

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']
