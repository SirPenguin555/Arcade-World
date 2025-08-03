export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          username: string
          photo_url: string | null
          is_guest: boolean
          points: number
          tickets: number
          level: number
          experience: number
          unlocked_arcades: string[]
          unlocked_modes: string[]
          preferences: Json
          created_at: string
          updated_at: string
          last_login_at: string
          account_linked_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          username: string
          photo_url?: string | null
          is_guest?: boolean
          points?: number
          tickets?: number
          level?: number
          experience?: number
          unlocked_arcades?: string[]
          unlocked_modes?: string[]
          preferences?: Json
          created_at?: string
          updated_at?: string
          last_login_at?: string
          account_linked_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          username?: string
          photo_url?: string | null
          is_guest?: boolean
          points?: number
          tickets?: number
          level?: number
          experience?: number
          unlocked_arcades?: string[]
          unlocked_modes?: string[]
          preferences?: Json
          created_at?: string
          updated_at?: string
          last_login_at?: string
          account_linked_at?: string | null
        }
        Relationships: []
      }
      usernames: {
        Row: {
          username: string
          original_username: string
          user_id: string
          created_at: string
        }
        Insert: {
          username: string
          original_username: string
          user_id: string
          created_at?: string
        }
        Update: {
          username?: string
          original_username?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usernames_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          games_played: number
          total_play_time: number
          highest_streak: number
          total_points_earned: number
          total_tickets_earned: number
          total_prizes_won: number
          game_stats: Json
          achievements: Json
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          games_played?: number
          total_play_time?: number
          highest_streak?: number
          total_points_earned?: number
          total_tickets_earned?: number
          total_prizes_won?: number
          game_stats?: Json
          achievements?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          games_played?: number
          total_play_time?: number
          highest_streak?: number
          total_points_earned?: number
          total_tickets_earned?: number
          total_prizes_won?: number
          game_stats?: Json
          achievements?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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