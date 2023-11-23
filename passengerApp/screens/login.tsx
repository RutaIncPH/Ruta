import { View, TextInput, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { io } from 'socket.io-client'; // Import the io function

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const auth = getAuth();
const socket = io('http://172.20.10.2:3000');
const login = ({ navigation }: RouterProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
    
            // After successful login, get the ID token
            const user = response.user;
            const idToken = await user.getIdToken();
    
            // Emit the user_login event with the Firebase ID token
            socket.emit('user_login', { idToken });
            console.log(idToken);
    
            alert('Check your emails!');
        } catch (error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <View style={styles.container}>
    <KeyboardAvoidingView behavior='padding'>
        <TextInput style={styles.input}
            value={email} 
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
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
        <>
            <Button title="Login" onPress= {signIn} />
            <Button onPress={() => navigation.navigate('Signup')} title="Don't have an account?" />
        </>
        )}
    </KeyboardAvoidingView>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
})