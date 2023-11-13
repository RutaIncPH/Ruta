import { View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_DB } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const profile = ({ navigation }: RouterProps) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const db = FIREBASE_DB;
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    // Assuming you have a userId to identify the specific user
                    if (doc.data().email === userData.email) {
                        setUserData(doc.data());
                    }
                } else {
                    console.log('No such document!');
                }
            });
        };
        fetchUserData();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {userData ? (
                <View>
                    <Text>Email: {userData.email}</Text>
                    <Text>Full Name: {userData.password}</Text>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
            <Button onPress={() => navigation.goBack()} title="Go Back" />
        </View>
    );
};

export default profile;
