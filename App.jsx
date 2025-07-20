import React, { useEffect, useState, useRef } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { themeMap } from './utils/themeMap';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['notifly://'],
  config: {
    screens: {
      NoTheme: 'theme/none',
      Mountain: 'theme/mountain',
      River: 'theme/river',
      Beach: 'theme/beach',
    },
  },
};

function App() {
  const [fcmToken, setFcmToken] = useState('');
  const navigationRef = useRef();

  // Function to send token to backend
  const sendTokenToBackend = async token => {
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        console.error('Failed to register token:', response.status);
      } else {
        const data = await response.json();
        console.log('Token registered:', data);
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  useEffect(() => {
    const setupFCM = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled = true;
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }

      // 🔥 Get FCM token
      const token = await messaging().getToken();
      setFcmToken(token);
      console.log('FCM Token:', token);
      Alert.alert('Token copied to log', token);

      // Send token to backend
      if (token) {
        sendTokenToBackend(token);
      }
    };

    setupFCM();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { theme, message } = remoteMessage.data || {};
      if (theme && message && navigationRef.current) {
        navigationRef.current.navigate(
          theme.charAt(0).toUpperCase() + theme.slice(1),
          { message },
        );
      }
      Alert.alert(
        'Foreground Notification',
        JSON.stringify(remoteMessage.notification),
      );
    });

    // Background / quit state notification handler
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const { theme, message } = remoteMessage.data || {};
          if (theme && message && navigationRef.current) {
            navigationRef.current.navigate(
              theme.charAt(0).toUpperCase() + theme.slice(1),
              { message },
            );
          }
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>App Loaded ✅</Text>
      </View>
      <Stack.Navigator initialRouteName="NoTheme">
        {Object.entries(themeMap).map(([key, Component]) => (
          <Stack.Screen
            key={key}
            name={key.charAt(0).toUpperCase() + key.slice(1)}
            component={Component}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
