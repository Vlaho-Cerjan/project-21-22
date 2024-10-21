export interface RegistrationList {
  id: string;
  business_name: string;
  email: string;
  phone_number: string;
  mobile_number: string;
  first_name: string;
  last_name: string;
  job_title: string;
  address_1: string;
  address_2: string;
  city: string;
  zip: string;
  state_code: string;
  country_code: string;
  latitude: number;
  longitude: number;
  status: number;
  business_type_id: string;
  created_at: string;
  updated_at: string;
  notes: RegistrationNotes;
}

export interface RegistrationData {
  business_name: string;
  email: string;
  phone_number: string;
  mobile_number: string;
  first_name: string;
  last_name: string;
  job_title: string;
  address_1: string;
  address_2: string;
  city: string;
  zip: string;
  state_code: string;
  country_code: string;
  latitude: number;
  longitude: number;
  status: number;
  website?: string;
  business_type_id: string;
}

export interface RegistrationNotes {
  dma_top_20?: number | string;
  skip_email?: boolean;
  business_id?: string;
  approved_by?: string;
  declined_by?: string;
  do_not_ship_player?: boolean;
  registration_notes?: string;
  decline_reason?: string;
}

export interface RegistrationUpdateData extends RegistrationData {
  registration_id: string;
  registration_notes: RegistrationNotes;
}

export interface RegistrationDenyApproveData {
  registration_id: string;
  notes: RegistrationNotes;
}
