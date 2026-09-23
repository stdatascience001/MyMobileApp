import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { tripService } from '../../services/trip';
import { Trip } from '../../types';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTrip = async () => {
        try {
          if (id) {
            const data = await tripService.getTrip(id as string);
            setTrip(data);
          }
        } catch (error) {
          console.error("Error fetching trip:", error);
          Alert.alert("Error", "Could not load trip details.");
        } finally {
          setLoading(false);
        }
      };
      fetchTrip();
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Trip",
      "Are you sure you want to delete this trip?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (id) {
                await tripService.deleteTrip(id as string);
                router.replace('/home');
              }
            } catch (err) {
              Alert.alert("Error", "Could not delete trip");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Trip not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/home')} style={styles.headerBtn}>
            <Text style={styles.backText}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
          <TouchableOpacity onPress={() => router.push(`/trips/edit/${id}` as any)} style={styles.headerBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <Text style={styles.destinationTitle}>{trip.destination}</Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{trip.start_date} to {trip.end_date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.prefRow}>
              <Text style={styles.prefLabel}>Budget Style</Text>
              <Text style={styles.prefValue}>{trip.preferences?.budget || 'Not specified'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Trip</Text>
        </TouchableOpacity>

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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerBtn: {
    padding: 8,
  },
  backText: {
    color: '#6b7280',
    fontSize: 16,
  },
  editText: {
    color: '#4f46e5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    alignItems: 'center',
  },
  tripTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  destinationTitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
  dateBadge: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dateText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prefLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  prefValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  }
});
