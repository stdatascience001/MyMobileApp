import api from './api';
import { Trip, TripCreate, TripUpdate } from '../types';

export const tripService = {
  getTrips: async (): Promise<Trip[]> => {
    const response = await api.get<Trip[]>('/trips');
    return response.data;
  },

  getTrip: async (tripId: string): Promise<Trip> => {
    const response = await api.get<Trip>(`/trips/${tripId}`);
    return response.data;
  },

  createTrip: async (tripData: TripCreate): Promise<Trip> => {
    const response = await api.post<Trip>('/trips', tripData);
    return response.data;
  },

  updateTrip: async (tripId: string, tripData: TripUpdate): Promise<Trip> => {
    const response = await api.put<Trip>(`/trips/${tripId}`, tripData);
    return response.data;
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    await api.delete(`/trips/${tripId}`);
  }
};
