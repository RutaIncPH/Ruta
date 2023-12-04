import { View, TextInput, StyleSheet, KeyboardAvoidingView, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { io } from 'socket.io-client'; // Import the io function
import { ActivityIndicator, MD2Colors, Button } from 'react-native-paper';


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
    const image = {uri: 'https://images.unsplash.com/photo-1596789592210-e2e93ff08bc4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'};

    return (
    <ImageBackground source={image} resizeMode='cover' style={styles.image}>
        <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding' style={styles.form}>
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
            <Button mode="contained" icon="login" onPress= {signIn}>
                Login
            </Button>
            <Button onPress={() => navigation.navigate('Signup')}>
                Don't have an account?
            </Button>
        </>
        )}
        </KeyboardAvoidingView>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.8)',
    },
    form: {
        marginHorizontal: 40,
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 35,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        tintColor: '#fff',
    },
    button: {
        fontSize: 12,
    }
})

export default login;
