import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/login';
import List from './screens/list';
import Details from './screens/details'
import Booking from './screens/booking';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="My List" component={List} />
      <InsideStack.Screen name="My Details" component={Details} />
      <InsideStack.Screen name="Booking" component={Booking} />
    </InsideStack.Navigator>
  )
}


export default function App() { 
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  })
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>

        {user ?
        (
        <Stack.Screen
          name = "Inside"
          component={InsideLayout}
          options={{ headerShown: false }}
        />) 

        : 

        (
        <Stack.Screen
          name = "Login"
          component={Login}
          options={{ headerShown: false }}
        />)}

      </Stack.Navigator>
    </NavigationContainer>
  );
}