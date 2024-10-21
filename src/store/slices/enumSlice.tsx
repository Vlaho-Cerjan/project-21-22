import type {AsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const defaultEnum = null;
export const defaultVenueTypes = null;

export interface EnumState {
  registration_status: {
    NEW: number;
    PENDING: number;
    APPROVED: number;
    DECLINED: number;
  };
  venue_status: {
    PENDING: number;
    APPROVED: number;
    DECLINED: number;
  };
  screen_status: {
    FREE: number;
    SVOD: number;
    TEST: number;
  };
  order_status: {
    PENDING: number;
    APPROVED: number;
    DECLINED: number;
    PROCESSED: number;
    SHIPPED: number;
  };
  shipping_status: {
    PRE_TRANSIT: number;
  };
  exceptions: {
    UNIQUE_PARAMETER: string;
    REQUIRED_PARAMETER: string;
    CHARACTERS_QUOTA_EXCEEDED: string;
    CHARACTERS_QUOTA_NOT_EXCEEDED: string;
    PARAMETER_IS_NOT_ARRAY: string;
    ITEM_NOT_IN_LIST: string;
    INVALID_FORMAT: string;
    FIELD_MUST_BE_STRING: string;
    FIELD_MUST_BE_INTEGER: string;
    INVALID_IMAGE_DIMENSIONS: string;
    INVALID_CHARACTER_QUOTA: string;
    FIELD_MUST_BE_BOOLEAN: string;
    INVALID_RESET_PASSWORD_TOKEN: string;
    RESET_PASSWORD_TOKEN_EXPIRED: string;
    INVALID_PASSWORD: string;
    INVALID_EMAIL: string;
    PERMISSION_DENIED: string;
    UNAUTHORIZED: string;
    ENTITY_LOCKED: string;
    INVALID_REQUEST_CONTENT: string;
    INVALID_STATUS: string;
    INTERNAL_SERVER_ERROR: string;
    DB_ERROR: string;
    INVALID_REQUEST_PAYLOAD: string;
    INVALID_REQUEST_PARAMETERS: string;
    METHOD_NOT_ALLOWED: string;
    RESOURCE_NOT_FOUND: string;
    TOO_MANY_REQUESTS: string;
    AUTHENTICATION_FAILED: string;
    NOT_FOUND: string;
    INVALID_CREDENTIALS: string;
    STATUS_ALREADY_CHANGED: string;
    EMAIL_ALREADY_IN_USE: string;
    EMAIL_ALREADY_VERIFIED: string;
    NOT_EMPTY: string;
  };
  device_type: {
    Project_PLAYER: number;
    AMAZON_FIRESTICK: number;
  };
  playlist_status: {
    PUBLIC: number;
    SHARED: number;
    PRIVATE: number;
  };
  playlist_type: {
    PLAYLIST: number;
    MIX: number;
  };
  playlist_category: {
    MUSIC: number;
    CULTURE: number;
    FAMILY: number;
    HEALTH: number;
    GAMES: number;
    LAUGHS: number;
    NATURE: number;
    NEWS: number;
    SPORTS: number;
  };
}

export interface BusinessTypeState {
  id: string;
  parent_name: string;
  name: string;
  category: number;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  name: string;
  type: string;
  unit_cost: number;
  unit_price: number;
  stock_level: number;
  created_at: string;
  updated_at: string;
}

export const initialState: {
  enumData: EnumState | null;
  venueType: BusinessTypeState[] | null;
  inventory: Inventory[] | null;
  status: string;
} = {
  enumData: defaultEnum,
  venueType: defaultVenueTypes,
  inventory: null,
  status: 'pending',
};

export const fetchEnum: AsyncThunk<
  {
    enumData: EnumState;
    venueType: BusinessTypeState[] | null;
    inventory: Inventory[] | null;
  },
  void,
  object
> = createAsyncThunk('fetchEnum', async () => {
  const response = await fetch('/api/enum').then((res) => res.json());
  const venueRes = await fetch('/api/business-types').then((res) => res.json());
  const inventoryRes = await fetch('/api/inventory').then((res) => res.json());
  if (response.success) {
    if (venueRes.success) {
      if (inventoryRes.success) {
        return {
          enumData: response.data,
          venueType: venueRes.data,
          inventory: inventoryRes.data,
        };
      }

      return {
        enumData: response.data,
        venueType: venueRes.data,
        inventory: null,
      };
    }
    return {
      enumData: response.data,
      venueType: null,
      inventory: null,
    };
  }
  return {
    enumData: defaultEnum,
    venueType: defaultVenueTypes,
    inventory: null,
  };
});

export const enumSlice = createSlice({
  name: 'enum',
  initialState,
  reducers: {
    setEnum: (state, action: PayloadAction<EnumState>) => {
      state.enumData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnum.pending, (state) => {
        return {
          ...state,
          status: 'pending',
        };
      })
      .addCase(fetchEnum.fulfilled, (state, action) => {
        return {
          ...state,
          enumData: action.payload.enumData,
          venueType: action.payload.venueType,
          inventory: action.payload.inventory,
          status: 'fulfilled',
        };
      })
      .addCase(fetchEnum.rejected, (state) => {
        return {
          ...state,
          status: 'rejected',
        };
      });
  },
});

export const {setEnum} = enumSlice.actions;

export const enumReducer = enumSlice.reducer;
