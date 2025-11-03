import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect, useState } from 'react';
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
        title: '🚨 Chegando ao destino!',
        body: 'Você chegou ao ponto selecionado!',
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
        if (status !== 'granted') throw new Error('Permissão negada');

        if (Platform.OS === 'android') {
          const bgStatus = await Location.requestBackgroundPermissionsAsync();
          if (bgStatus.status !== 'granted') console.warn('Sem permissão em segundo plano');
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        console.warn('Erro ao obter localização, usando padrão São Paulo');
        setLocation({ latitude: -23.55052, longitude: -46.633308 });
      }
    })();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelected({ latitude, longitude });
  };

  const startGeofencing = async () => {
    if (!selected) return Alert.alert('Selecione um ponto primeiro');

    try {
      await Location.startGeofencingAsync(GEOFENCE_TASK, [
        {
          identifier: 'destino',
          latitude: selected.latitude,
          longitude: selected.longitude,
          radius: 100,
          notifyOnEnter: true,
          notifyOnExit: false,
        },
      ]);

      setGeofencingActive(true);
      Alert.alert('✅ Alerta de chegada ativado');
    } catch (err) {
      console.error('Erro ao iniciar geofencing:', err);
    }
  };

  const stopGeofencing = async () => {
    try {
      await Location.stopGeofencingAsync(GEOFENCE_TASK);
      setGeofencingActive(false);
      Alert.alert('⏹️ Alerta parado');
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Função de simulação (gera o mesmo efeito do alarme real)
  const simulateArrival = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 SIMULAÇÃO: Você chegou ao destino!',
        body: 'Este é um teste do alarme de chegada.',
        sound: 'alarm.mp3',
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });

    Alert.alert('🔔 Simulação executada', 'O alarme de chegada foi disparado.');
  };

  if (!location)
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Carregando mapa...</Text>;

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
          <Marker coordinate={selected} title="Destino" description="Ponto selecionado" pinColor="red" />
        )}
      </MapView>

      <View style={styles.infoBox}>
        {selected ? (
          <>
            <Text>📍 Latitude: {selected.latitude.toFixed(6)}</Text>
            <Text>📍 Longitude: {selected.longitude.toFixed(6)}</Text>
            {!geofencingActive ? (
              <Button title="Iniciar Alerta de Chegada" onPress={startGeofencing} />
            ) : (
              <Button title="Parar Alerta" color="red" onPress={stopGeofencing} />
            )}
            <Button title="Simular Chegada" color="orange" onPress={simulateArrival} />
          </>
        ) : (
          <Text>Toque no mapa para escolher um ponto</Text>
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
