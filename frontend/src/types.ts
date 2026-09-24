export type Language = 'en' | 'hi';
export type UserRole = 'farmer' | 'operator' | 'admin';

export interface User {
  id: number;
  phone: string;
  full_name: string;
  role: UserRole;
  preferred_lang: Language;
  aadhaar_masked: string;
}

export interface FamilyMember {
  id: number;
  family_id: number;
  sub_user_code: string;
  name: string;
  relationship_to_head: string;
  phone: string;
  device_type: 'smartphone' | 'keypad';
  is_authorized: boolean;
  aadhaar_masked: string;
}

export interface Family {
  id: number;
  family_code: string;
  primary_user_id: number;
  members: FamilyMember[];
}

export interface Slot {
  id: number;
  centre_id: number;
  date: string;
  time_slot: string;
  capacity_tokens: number;
  booked_tokens: number;
  is_active: boolean;
}

export interface Centre {
  id: number;
  code: string;
  name: string;
  location: string;
  district: string;
  state: string;
  distance_km: number;
  daily_capacity_quintals: number;
  active_counters: number;
  avg_processing_time_mins: number;
  crowd_threshold: number;
  opening_hours: string;
  current_status: string;
  current_queue: number;
  estimated_wait_mins: number;
  supported_crops: string[];
  slots: Slot[];
}

export interface CentreRecommendation {
  centre: Centre;
  score: number;
  is_recommended: boolean;
  reason: string;
  is_overcrowded: boolean;
  alternative_centre?: string | null;
}

export interface Booking {
  id: number;
  booking_code: string;
  farmer_id: number;
  farmer_name: string;
  farmer_phone: string;
  family_code: string;
  visiting_member_name: string;
  visiting_member_relationship: string;
  is_representative_authorized: boolean;
  centre_id: number;
  centre_name: string;
  slot_id: number;
  time_slot: string;
  crop_name: string;
  quantity_quintals: number;
  booking_date: string;
  booking_time: string;
  status: string;
  token_number: string;
  current_token: string;
  people_ahead: number;
  estimated_wait_mins: number;
  payment_status: string;
  total_amount_inr: number;
}

export interface QueueStatus {
  booking_id: number;
  booking_code: string;
  token_number: string;
  token_seq: number;
  current_token: string;
  current_serving_seq: number;
  people_ahead: number;
  estimated_wait_mins: number;
  active_counters: number;
  average_processing_time: number;
  centre_name: string;
  centre_code: string;
  status: string;
  is_overcrowded: boolean;
  last_updated: string;
}

export interface NotificationItem {
  id: number;
  notif_type: string;
  channel: 'app' | 'sms' | 'voice';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  intent?: string;
  action_taken?: string | null;
  action_result?: any;
  sources?: string[];
  timestamp: string;
}
