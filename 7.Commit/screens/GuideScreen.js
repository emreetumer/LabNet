import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuideScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kılavuz Sayfası</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FBFC',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495E',
  },
});

export default GuideScreen;
