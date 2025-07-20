import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import NoThemeScreen from './screens/NoThemeScreen';
import BeachScreen from './screens/BeachScreen';
import MountainScreen from './screens/MountainScreen';
import RiverScreen from './screens/RiverScreen';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

// Function to register FCM token with backend
const registerFCMToken = async () => {
  try {
    // Request notification permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission not granted');
      return;
    }

    // Get FCM token
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);

    // Send token to backend
    const response = await fetch('http://192.168.101.142:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: fcmToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token registered successfully:', data);
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error registering FCM token:', error);
    Alert.alert(
      'Backend Connection Error',
      'Unable to connect to notification service. The app will continue to work normally.',
      [{ text: 'OK' }],
    );
  }
};

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    // Register FCM token when app launches
    registerFCMToken();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="NoTheme">
        <Stack.Screen name="NoTheme" component={NoThemeScreen} />
        <Stack.Screen name="Beach" component={BeachScreen} />
        <Stack.Screen name="Mountain" component={MountainScreen} />
        <Stack.Screen name="River" component={RiverScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
