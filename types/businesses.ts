export interface BusinessUpdateData {
  business_id: string;
  business_name: string;
  phone_number: string;
  address_1: string;
  address_2: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  latitude: number;
  longitude: number;
  business_type_id: string;
}

export interface BusinessData extends Omit<BusinessUpdateData, 'business_id'> {
  id: string;
  created_at: string;
  updated_at: string;
}
