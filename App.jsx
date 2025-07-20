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

  // Function to handle notification navigation
  const handleNotificationNavigation = remoteMessage => {
    if (remoteMessage?.data) {
      const { theme, title, message } = remoteMessage.data;

      // Map theme to screen name (capitalize first letter)
      const screenName = theme.charAt(0).toUpperCase() + theme.slice(1);

      // Navigate to the appropriate screen with title and message
      if (
        navigationRef.current &&
        ['Beach', 'Mountain', 'River'].includes(screenName)
      ) {
        navigationRef.current.navigate(screenName, {
          title: title,
          message: message,
        });
      }
    }
  };

  useEffect(() => {
    // Register FCM token when app launches
    registerFCMToken();

    // Handle notification when app is opened from background/killed state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          handleNotificationNavigation(remoteMessage);
        }
      });

    // Handle notification when app is in foreground
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in foreground:', remoteMessage);
      handleNotificationNavigation(remoteMessage);
    });

    // Handle notification when app is in background but not killed
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        handleNotificationNavigation(remoteMessage);
      },
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
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
