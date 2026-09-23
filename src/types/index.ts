export interface User {
  id: string;
  email: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ErrorResponse {
  detail: string;
}

export interface TripPreferences {
  budget?: string;
  travelStyle?: string;
  activities?: string[];
  [key: string]: any;
}

export interface Trip {
  uuid: string;
  user_uuid: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  preferences?: TripPreferences;
}

export interface TripCreate {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  preferences?: TripPreferences;
}

export interface TripUpdate {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  preferences?: TripPreferences;
}
