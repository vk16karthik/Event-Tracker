import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LogBox } from 'react-native';


const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        buttonTextStyle={styles.menuText}
        icon={<Icon name="menu" style={styles.menuIcon} />}
        onPress={() => setMenuOpen(!menuOpen)}
        bgColor="rgba(0,0,0,0.7)"
        radius={100}
        offsetY={-60}
        offsetX={-30}
        spacing={25}
        active={menuOpen}
        useNativeDriver={true} 
      >
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Add"
          onPress={() => console.log('Add button pressed')}
        >
          <Icon name="add" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Edit"
          onPress={() => console.log('Edit button pressed')}
        >
          <Icon name="edit" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="Delete"
          onPress={() => console.log('Delete button pressed')}
        >
          <Icon name="delete" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 48,
    color: '#fff',
  },
  menuText: {
    color: '#fff',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default App;
