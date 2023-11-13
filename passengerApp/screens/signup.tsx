import { View, TextInput, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState} from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/native';
import Axios from 'axios';

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
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const db = FIREBASE_DB;
            console.log(response);
            await addDoc(collection(db, 'users'), {
                email: email,
                name: name,
                contact: contact,
                password: password,
            });
            alert('Check DB!');
            navigation.navigate('Login');
        } catch (error: any) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
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
        <><Button title="Create Account" onPress={signUp} /><Button onPress={() => navigation.navigate('Login')} title="Go Back" /></>
        )}
    </KeyboardAvoidingView>
    </View>
  )
}

export default signup;

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