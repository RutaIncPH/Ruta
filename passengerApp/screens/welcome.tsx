import React from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const welcome = ({ navigation }: RouterProps) => {

  return (
    <ImageBackground source={require('./bg.jpg')} resizeMode='cover' style={styles.image}>
        <View style={styles.safeView}>
            <View style={styles.chest}>
                <Text style={styles.largeText}>Welcome to Ruta!</Text>
                <Text style={styles.mediumText}>Your Direct to Terminal Tricycle Booking App</Text>
                <View style={styles.container}>
                    <Button onPress={() => navigation.navigate('Signup')} style={styles.button} mode="contained" buttonColor='#ff7b00'>Create an Account</Button>
                    <Button onPress={() => navigation.navigate('Login')} style={styles.button} textColor='#fff'>Already have an account?</Button>
                </View>
                
            </View>
        </View>
    </ImageBackground>
  )
};

export default welcome;

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    safeView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor:'rgba(0,0,0,0.8)',
        padding: '4%',
    },
    chest: {
        marginBottom: 100,
    },
    largeText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    mediumText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
        color: '#fff',
    },
    button: {
        borderRadius: 4,
    },
    container: {
        flexDirection: 'row',
    }
})