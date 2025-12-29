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
          email: string
          stripe_customer_id: string | null
          is_vara_pass_holder: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          stripe_customer_id?: string | null
          is_vara_pass_holder?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          stripe_customer_id?: string | null
          is_vara_pass_holder?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          url: string
          title: string | null
          image_url: string | null
          price_number: number | null
          currency: string | null
          designer: string | null
          source_domain: string
          created_at: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          collection_id: string
          notes: string | null
          created_at: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
        }
      }
    }
  }
}
