import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function MountainScreen({ route }) {
  const message = route.params?.message || '';
  return (
    <ImageBackground source={require('../assets/mountain.png')} style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#fff' },
});
