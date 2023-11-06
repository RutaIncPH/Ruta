import React, { useState, useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions, Button } from 'react-native';
import * as Location from 'expo-location';


export default function App() {
    const [mapRegion, setMapRegion] = useState({
        latitude: 14.686361484784461,
        longitute: 121.06421657817447,
        latitudeDelta: 0.0422,
        longituteDelta: 0.0421,
    })

    const userLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        setMapRegion({
            latitude: location.coords.latitude,
            longitute: location.coords.longitude,
            latitudeDelta: 0.9422,
            longituteDelta: 0.0421,
        });
        console.log(location.coords.latitude, location.coords.longitude);
    }

useEffect(() => {
    userLocation();
}, []);
  return (
    <View style={styles.container}>
        <MapView style={styles.map}
            region={mapRegion}
        >
            <Marker coordinate={mapRegion} title='Marker' />
        </MapView>
        <Button title="Get Location" onPress={userLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
});
function setErrorMsg(arg0: string) {
    throw new Error('Function not implemented.');
}

