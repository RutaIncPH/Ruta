import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from './passengerApp/screens/welcome'; 
import Login from './passengerApp/screens/login';
import Profile from './passengerApp/screens/profile';
import Booking from './passengerApp/screens/booking';
import Signup from './passengerApp/screens/signup';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import { BottomNavigation, Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function BottomNavigationStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Booking"
        component={Booking}
        options={{
          tabBarLabel: 'Booking',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="motorbike"
            size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account"
            size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
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
        <Stack.Navigator initialRouteName="Welcome">
          {user ? (
            <Stack.Screen name="Inside" component={BottomNavigationStack} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
    </NavigationContainer>
  );
}