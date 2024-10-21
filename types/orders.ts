export interface OrdersCreateData {
  product_id: string;
  venue_id: string;
  quantity: number;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_state_code: string;
  shipping_country_code: string;
  shipping_zip: string;
  notes?: {
    order_notes: string;
  };
}

export interface OrdersAdminCreateData extends OrdersCreateData {
  business_id: string;
}

export interface OrdersData extends OrdersCreateData {
  id: string;
  shipping_id: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface OrdersUpdateData extends OrdersCreateData {
  order_id: string;
  status: number;
  quantity: number;
}

export interface OrdersAdminUpdateData extends OrdersUpdateData {
  business_id: string;
}

export interface OrdersData extends OrdersCreateData {
  id: string;
  shipping_id: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface OrdersAdminData extends OrdersData {
  business_id: string;
}

export interface OrdersListData {
  id: string;
  product_id: string;
  venue_id: string;
  shipping_id: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface OrdersAdminListData extends OrdersListData {
  business_id: string;
}

export interface OrdersProcessData {
  order_id: string;
  screens: {
    unique_identifier: string;
    name: string;
  }[];
}

export interface OrdersApproveData {
  order_id: string;
  notes: {
    order_notes: string;
  };
}

export interface OrdersDeclineData {
  order_id: string;
  notes: {
    decline_reason: string;
  };
}
