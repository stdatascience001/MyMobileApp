import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { tripService } from '../../services/trip';
import { Trip } from '../../types';

export default function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTrips = async () => {
        try {
          const data = await tripService.getTrips();
          setTrips(data);
        } catch (error) {
          console.error("Error fetching trips:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTrips();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.title}>Traveler</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>AI Travel Companion</Text>
          <Text style={styles.heroSubtitle}>Let AI plan your next unforgettable adventure in seconds.</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/trips/create')}
          >
            <Text style={styles.primaryButtonText}>Plan a New Trip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Itineraries</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4f46e5" />
          ) : trips.length === 0 ? (
            <Text style={styles.noTripsText}>You have no trips planned yet. Click "Plan a New Trip" to get started!</Text>
          ) : (
            trips.map(trip => (
              <TouchableOpacity
                key={trip.uuid}
                style={styles.itineraryCard}
                onPress={() => router.push(`/trips/${trip.uuid}` as any)}
              >
                <Text style={styles.destinationTitle}>{trip.title}</Text>
                <Text style={styles.itineraryDetails}>{trip.destination} • {trip.start_date} to {trip.end_date}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Planned</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={[styles.destinationCard, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.destinationCardTitle}>Bali</Text>
            </View>
            <View style={[styles.destinationCard, { backgroundColor: '#FF7F50' }]}>
              <Text style={styles.destinationCardTitle}>Rome</Text>
            </View>
            <View style={[styles.destinationCard, { backgroundColor: '#87CEEB' }]}>
              <Text style={styles.destinationCardTitle}>Maldives</Text>
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#e0e7ff',
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#4f46e5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  noTripsText: {
    color: '#6b7280',
    fontSize: 15,
    fontStyle: 'italic',
  },
  seeAllText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 14,
  },
  itineraryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  itineraryDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 12,
  },
  horizontalScroll: {
    paddingRight: 24,
  },
  destinationCard: {
    width: 140,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    padding: 16,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  destinationCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
