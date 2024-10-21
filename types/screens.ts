export interface ScreenSettings {
  genre_edm: number;
  genre_pop: number;
  genre_rnb: number;
  rating_14: number;
  rating_ma: number;
  genre_folk: number;
  genre_rock: number;
  genre_indie: number;
  genre_latin: number;
  genre_family: number;
  genre_hiphop: number;
  genre_reggae: number;
  genre_country: number;
  genre_acoustic: number;
  genre_americana: number;
  genre_christian: number;
  content_explicit: number;
  content_interactive: number;
}

export const screenSettingsKeys = ['content', 'genre', 'rating'];

export interface GetUserScreen {
  id: string;
  venue_id: string;
  name: string;
  dooh_enabled: number;
  status: number;
  user_count: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
  data: object;
  settings: ScreenSettings;
  notes: {
    screen_notes: string;
  };
}

export interface UpdateUserScreen {
  screen_id: string;
  name: string;
  settings: ScreenSettings;
}

export interface UpdateUserScreenReturn {
  screen_id: string;
  venue_id: string;
  name: string;
  dooh_enabled: number;
  status: number;
  //shipping_city: string;
  settings: ScreenSettings;
}

export interface ListScreen {
  id: string;
  venue_id: string;
  name: string;
  dooh_enabled: number;
  status: number;
  user_count: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminScreen {
  venue_id: string;
  type: number;
  unique_identifier: string;
  name: string;
  notes: {
    screen_notes: string;
  };
}

export interface GetAdminScreen extends GetUserScreen {
  device_id: string;
  device_type: string;
  notes: {
    screen_notes: string;
  };
}

export interface UpdateAdminScreen {
  screen_id: string;
  venue_id: string;
  name: string;
  dooh_enabled: number;
  status: number;
  shipping_city: string;
  settings: ScreenSettings;
  notes: {
    screen_notes: string;
  };
}
