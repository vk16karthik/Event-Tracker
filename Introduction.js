import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ImageBackground } from 'react-native';
import image from './4.png';

const App = () => {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText((prevShowText) => !prevShowText);
    }, 1000); // 1000 = 1s

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ImageBackground source={image} style={styles.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.titleText}>
            WE BELIEVE IN CELEBRATION
          </Text>
          {showText && (
            <Text style={styles.textStyle}>
              --------------------------------------------Do you....?
            </Text>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    fontFamily: 'sans-serif',
  },
  textStyle: {
    textAlign: 'left',
    marginTop: 10,
    fontSize: 20, // Adjust the font size as desired
    color: '#ffd2d2',
    fontFamily: 'sans-serif',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default App;
