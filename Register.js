import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity,Image,ScrollView } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import pattern from './5.png';
import { button1 } from '../src/common/button';


import firebaseConfig from '../config/db';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const Register = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [mobile, setMobile] = useState('');

  const { Eventname } = route.params;
  console.log(Eventname);
  const handleRegistration = async () => {
    const registrationData = {
      name,
      email,
      mobile,
      college,
      Eventname,
      qrStatus: 'notScanned', // Set default qrStatus to 'notScanned'
    };

    try {
      const registrationRef = await db.collection('registrations').add(registrationData);

      // Generate QR code data
      const qrData = {
        email,
        createdDateTime: new Date().toISOString(),
      };

      // Convert qrData to JSON string
      const qrDataString = JSON.stringify(qrData);

      // Save QR code data as a string in Firebase
      await registrationRef.update({
        qrData: qrDataString,
      });

      // Redirect to QR code display page
      navigation.navigate('QrCodeDisplay', { qrData });
    } catch (error) {
      console.error('Error registering and saving QR code:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.patternbg} source={pattern} />
      <View style={styles.container1}>
      <View style={styles.s1}></View>
      <ScrollView style={styles.s2}>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>College</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your college"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={college}
          onChangeText={(text) => setCollege(text)}
        />
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
        />
      </View>
     <TouchableOpacity 
     onPress={handleRegistration}
     >
      <Text style={button1}>Register</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
    </View>   
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  patternbg: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
    },
    container1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    s1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '25%',
    },
    small1: {
      color: '#fff',
      fontSize: 17,
    },
    h1: {
      fontSize: 30,
      color: '#fff',
    },
    s2: {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      width: '100%',
      height: '75%',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
    },
    formgroup: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginVertical: 10,
    },
    label: {
      fontSize: 15,
      color: 'white',
      marginLeft: 10,
      marginBottom: 5,
    },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change the background color for all fields
      borderRadius: 20,
      padding: 10,
      color: '#FFF', // Change the text color for all fields
    },
    fp: {
      display: 'flex',
      alignItems: 'flex-end',
      marginHorizontal: 10,
      marginVertical: 5,
    },
});

export default Register;