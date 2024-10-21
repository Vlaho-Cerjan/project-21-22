import type {GridData} from './gridData';

export interface DeviceData {
  id: string;
  name: string;
  area: string;
  venue: string;
  nowPlaying: string;
  status: string;
  lastActive: string;
  macAddress: string;
  activationCode: string;
  logo: string;
  rewards: {
    month: string;
    progress: string;
  }[];
  deviceType: string;
  mode: string;
  build: string;
  cachedVideos: string;
  freeSpace: string;
  speed: string;
  temperature: string;
  networkSignage: string;
  venueSignage: string;
  areaSignage: string;
  networkSchedule: string;
  venueSchedule: string;
  areaSchedule: string;
  deviceSchedule: string;
  networkPolicy: string;
  venuePolicy: string;
  areaPolicy: string;
  devicePolicy: string;
}

export interface Slide {
  id: string;
  order: number;
  data: GridData;
}

export interface TextSlide {
  id: string;
  order: number;
  data: GridData;
  textColor: string;
  backgroundColor: string;
}

export interface SliderData {
  id: string;
  timing: string;
  slides: Slide[];
}

export interface TextSliderData {
  id: string;
  timing: string;
  slides: TextSlide[];
}
