import type {Filter} from './filterData';

export interface GridData {
  folderId?: string;
  id: string;
  business_id?: string;
  order_id?: string;
  group_id?: string;
  venue_id?: string;
  groupName?: string;
  registration_id?: string;
  name?: string;
  description?: string;
  type?: string;
  url?: string;
  thumb?: string;
  text?: string;
  rss?: string;
  size?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  created_at?: string;
  updated_at?: string;
  orgHierarchy?: string[];
  onSearch?: (searchText: string, filt: Filter[]) => Promise<GridData[]>;
}
