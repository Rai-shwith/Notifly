import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function BeachScreen({ route }) {
  const message = route.params?.message || '';
  return (
    <ImageBackground source={require('../assets/beach.jpg')} style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#fff' },
});
