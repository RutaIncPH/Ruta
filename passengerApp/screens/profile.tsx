import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const user = FIREBASE_AUTH;

const Profile: React.FC<RouterProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming you have a method to get the user UID (replace 'getUserUid' with your actual method)
        const userUid = user.currentUser.uid; // Replace with your actual method to get the user UID
        if (!userUid) {
          console.error('User UID not available');
          return;
        }

        const response = await fetch(`http://192.168.88.243:3000/api/user/${userUid}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); 



  return (
    <ImageBackground source={require('./bg.jpg')} resizeMode='cover' style={styles.image}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,0.8)'}}>
      {userData ? (
        <View>
            <TextInput
                editable={false}
                maxLength={40}
                value={'Full Name: ' + userData.name}
                style={styles.form}
            />
            <TextInput
                editable={false}
                maxLength={40}
                value={'Email: ' + userData.email}
                style={styles.form}
            />
                        <TextInput
                editable={false}
                maxLength={40}
                value={'Contact Number: ' + userData.contact}
                style={styles.form}
            />
          <Button
            style={styles.logout}
            icon="logout"
            mode="contained"
            onPress={() => FIREBASE_AUTH.signOut()}
          >
            Logout
          </Button>
        </View>
      ) : (
        <Button
          style={styles.logout}
          icon="logout"
          mode="contained"
          onPress={() => FIREBASE_AUTH.signOut()}
        >
          Logout
        </Button>
      )}
    </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  logout: {
    marginTop: 45,
    backgroundColor: '#aaaaaa',
  },
  form: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
  }
});
