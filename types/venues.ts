export interface VenueNotes {
  venue_notes: string;
  decline_reason: string;
  declined_by: string;
  approved_by: string;
}

export interface VenueUserCreateData {
  name: string;
  description: string;
  address_1: string;
  address_2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  latitude: number;
  longitude: number;
  venue_type_id: string;
  venue_id?: string;
}

export interface VenueUserData extends VenueUserCreateData {
  id: string;
  status: number;
  group_id?: string;
  created_at?: string;
  updated_at?: string;
  total_screens?: number;
}

export interface VenueUserGroupData {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  total_venues: number;
  venues: VenueUserData[];
}

export interface VenueUserGroupToggleData {
  venue_ids: string[];
  group_id: string;
}

export interface VenueAdminCreateData extends VenueUserCreateData {
  business_id: string;
  notes: {
    venue_notes: string;
  };
}

export interface VenueAdminData extends VenueUserData {
  business_id: string;
  notes: VenueNotes;
}

export interface VenueAdminGroupData {
  id: string;
  business_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  total_venues: number;
  venues?: VenueAdminData[];
}

export interface VenueAdminGroupToggleData {
  business_id: string;
  venue_ids: string[];
  group_id: string;
}

export interface VenueDenyApproveData {
  venue_id: string;
  business_id: string;
  decline_reason?: string;
}
