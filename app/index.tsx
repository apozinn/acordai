import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';

const GEOFENCE_TASK = 'geofence-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

TaskManager.defineTask(GEOFENCE_TASK, async ({ data: { eventType, region }, error }) => {
  if (error) return;

  if (eventType === Location.GeofencingEventType.Enter) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 Approaching destination!',
        body: 'You have reached the selected location!',
        sound: 'alarm.mp3',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  }
});

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [geofencingActive, setGeofencingActive] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Permission denied');

        if (Platform.OS === 'android') {
          const bgStatus = await Location.requestBackgroundPermissionsAsync();
          if (bgStatus.status !== 'granted')
            console.warn('Background location permission not granted');
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        console.warn('Failed to get location, using São Paulo as default');
        setLocation({ latitude: -23.55052, longitude: -46.633308 });
      }
    })();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelected({ latitude, longitude });
  };

  const startGeofencing = async () => {
    if (!selected) return Alert.alert('Please select a destination first');

    try {
      await Location.startGeofencingAsync(GEOFENCE_TASK, [
        {
          identifier: 'destination',
          latitude: selected.latitude,
          longitude: selected.longitude,
          radius: 100,
          notifyOnEnter: true,
          notifyOnExit: false,
        },
      ]);

      setGeofencingActive(true);
      Alert.alert('✅ Arrival alert activated');
    } catch (err) {
      console.error('Error starting geofencing:', err);
    }
  };

  const stopGeofencing = async () => {
    try {
      await Location.stopGeofencingAsync(GEOFENCE_TASK);
      setGeofencingActive(false);
      Alert.alert('⏹️ Alert stopped');
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Simulation function (triggers the same effect as the real alarm)
  const simulateArrival = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 SIMULATION: You arrived at your destination!',
        body: 'This is a test of the arrival alarm.',
        sound: 'alarm.mp3',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });

    Alert.alert('🔔 Simulation executed', 'The arrival alarm has been triggered.');
  };

  if (!location)
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading map...</Text>;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        onPress={handleMapPress}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {selected && (
          <Marker
            coordinate={selected}
            title="Destination"
            description="Selected location"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.infoBox}>
        {selected ? (
          <>
            <Text>📍 Latitude: {selected.latitude.toFixed(6)}</Text>
            <Text>📍 Longitude: {selected.longitude.toFixed(6)}</Text>

            {!geofencingActive ? (
              <Button title="Start Arrival Alert" onPress={startGeofencing} />
            ) : (
              <Button title="Stop Alert" color="red" onPress={stopGeofencing} />
            )}

            <Button title="Simulate Arrival" color="orange" onPress={simulateArrival} />
          </>
        ) : (
          <Text>Tap on the map to select a destination</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoBox: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
});
