import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function NoThemeScreen({ route, navigation }) {
  const message = route?.params?.message || 'Choose a theme to continue';

  return (
    <View style={[styles.container, { backgroundColor: '#333' }]}>
      <Text style={styles.text}>{message}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Go to Mountain Theme"
          onPress={() => navigation.navigate('Mountain')}
          color="#8B4513"
        />
        <Button
          title="Go to River Theme"
          onPress={() => navigation.navigate('River')}
          color="#4682B4"
        />
        <Button
          title="Go to Beach Theme"
          onPress={() => navigation.navigate('Beach')}
          color="#F4A460"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
});
