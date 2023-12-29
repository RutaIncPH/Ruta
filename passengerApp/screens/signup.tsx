import { View, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, ImageBackground } from 'react-native'
import React, { useState} from 'react'
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { Button } from 'react-native-paper';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const signup = ({ navigation }: RouterProps) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            console.log(userCredential);
            const response = await axios.post('http://192.168.88.243:3000/api/users', {
                uid,
                email,
                name,
                contact,
              });
            console.log(response.data);
            alert('Registered Successfully!');
            navigation.navigate('Login');
        } catch (error: any) {
            console.error('Sign up failed:', error.message);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <ImageBackground source={require('./bg.jpg')} resizeMode='cover' style={styles.image}>
    <View style={styles.container}>
    <KeyboardAvoidingView behavior='padding'>
        <TextInput style={styles.input}
            value={email} 
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
        />

        <TextInput style={styles.input}
            value={name} 
            placeholder="Full Name"
            autoCapitalize="none"
            onChangeText={(text) => setName(text)}
        />

        <TextInput style={styles.input}
            value={contact} 
            placeholder="Contact Number"
            autoCapitalize="none"
            onChangeText={(text) => setContact(text)}
        />

        <TextInput style={styles.input}
            value={password}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
        />

        { loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
        <><Button onPress={signUp} style={styles.button} mode="contained" buttonColor='#ff7b00'>Create Account</Button>
        <Button onPress={() => navigation.navigate('Welcome')} style={styles.button} textColor='#fff'>Back</Button></>
        )}
    </KeyboardAvoidingView>
    </View>
    </ImageBackground>
  )
}

export default signup;

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 45,
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.8)',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
        borderRadius: 4,
    },
})