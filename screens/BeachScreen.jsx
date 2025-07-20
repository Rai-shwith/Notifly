import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function BeachScreen({ route }) {
  const title = route.params?.title || 'Beach Theme';
  const message = route.params?.message || 'Welcome to the Beach theme!';

  return (
    <ImageBackground
      source={require('../assets/beach.png')}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
