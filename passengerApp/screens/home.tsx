import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import { Button } from 'react-native-paper';
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const home = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button style={styles.button} icon="bicycle-cargo" mode="contained" onPress={() => navigation.navigate('Booking')}>
            Book a Ride
          </Button>
          <Button style={styles.button} icon="account" mode="contained" onPress={() => navigation.navigate('Profile')}>
            My Profile
          </Button>
          <Button style={styles.logout} icon="logout" mode="contained" onPress={() => FIREBASE_AUTH.signOut()}>
            Logout
          </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 5,
  },
  logout: {
    margin: 5,
    backgroundColor: 'red',
  }
})

export default home;
