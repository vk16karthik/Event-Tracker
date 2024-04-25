/*import React, { useEffect, useState, useRef } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,Alert,ImageBackground,Pressable} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import firebase from 'firebase/compat/app';
import { AntDesign } from '@expo/vector-icons';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/db';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import backgroundImage from './5.png';

import 'firebase/compat/firestore';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get a Firestore reference
const db = firebase.firestore();
const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log('An error occurred in background location task:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;

    try {
      const email = await AsyncStorage.getItem('email');

      // Store the location in the 'user_positions' collection
      await db.collection('user_positions').doc(email).set({
        email,
        latitude,
        longitude,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }
});

const Card = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const eventsCollection = db.collection("events");
      const querySnapshot = await eventsCollection.get();

      const enrollmentsData = querySnapshot.docs.map((doc) => {
        const enrollment = doc.data();

        return {
          id: doc.id,
          ...enrollment,
        };
      });

      setEnrollments(enrollmentsData);
    } catch (error) {
      console.log(error);
    }
  };

  /*const fetchEnrollments = async () => {
    try {
      // Fetch user details from AsyncStorage

      const eventsCollection = db.collection('events');
      const querySnapshot = await eventsCollection.get();

      const enrollmentsData = querySnapshot.docs.map((doc) => {
        const enrollment = doc.data();

        return {
          ...enrollment,
        };
      });

      setEnrollments(enrollmentsData);
    } catch (error) {
      console.log(error);
    }
  };
  const  registerForPushNotificationsAsync= async(eventId) => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const email = await AsyncStorage.getItem('email');
    console.log(email);
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    storeToken(token,email,eventId);
  }

  const storeToken = async(token,email,eventId) => {
    console.log(token);
    await db.collection('tokens').add({token:token,email:email,eventId: eventId,});
  }


  const logout = async () => {
    try {
      // Clear AsyncStorage values
      await AsyncStorage.removeItem('user');
      navigation.navigate('UserLogin');
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRegister = (Eventname) => {
    navigation.navigate('Register', { Eventname });
  };
  const handleMyEvents = () => {
    navigation.navigate("MyEvents")
  }

  const startBackgroundLocationTask = async () => {
    // Check if background location permission is granted
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Background Location Permission Required',
        'Please enable background location permissions to track your location in the background.'
      );
      return;
    }

    // Start the background location task
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      deferredUpdatesInterval: 1000,
    });

    console.log('Background location task started.');
  };

  const stopBackgroundLocationTask = async () => {
    // Stop the background location task
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

    console.log('Background location task stopped.');
  };

  const carouselRef = useRef(null);

  const renderCarouselItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{index + 1}</Text>
      </View>
      <Text style={styles.name}>Event: {item.Eventname}</Text>
      <Text style={styles.email}>Location: {item.Address}</Text>
      <Text style={styles.event}>Description: {item.EventDescription}</Text>
      <Text style={styles.event}>Event Start Time: {item.EventStartTime}</Text>
      <Text style={styles.event}>Event End Time: {item.EventEndTime}</Text>
  
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleRegister(item.Eventname);
        }}
      >
        <Text style={styles.buttont}>Register</Text>
      </TouchableOpacity>
      <Pressable>
      <View style={styles.button}>
      <Text style={styles.button}  onPress={() => {
        registerForPushNotificationsAsync(item.id); // Pass the eventid to the function
      }}>Get Notifications!</Text>
      </View>
      </Pressable>
      </View>
  );

  const handleSnapToItem = (index) => {
    setActiveSlide(index);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      
      <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
          <AntDesign name="bars" size={35} color="white" />
        </TouchableOpacity>
        {menuOpen && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={handleMyEvents}  style={styles.menuButton}>
              <AntDesign name="user" size={30} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}> - My Events</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Button 3 pressed')} style={styles.menuButton}>
              <AntDesign name="edit" size={30} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}> - Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
        <View style={styles.carouselContainer}>
          <Pagination
            dotsLength={enrollments.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.paginationInactiveDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <Carousel
            ref={carouselRef}
            data={enrollments}
            renderItem={renderCarouselItem}
            sliderWidth={400}
            itemWidth={300}
            onSnapToItem={handleSnapToItem}
            useScrollView
            containerCustomStyle={styles.carouselContainer}
            contentContainerCustomStyle={styles.carouselContentContainer}
            scrollEnabled
            decelerationRate="fast"
            snapToInterval={310}
            snapToAlignment="center"
            scrollEventThrottle={16}
          />
        </View>


        <View style={styles.bottomBar}>
          <View style={styles.bottomBarButton}>
            <TouchableOpacity
              onPress={() => {
                startBackgroundLocationTask();
              }}
            >
              <Text style={styles.buttonText}>Share Live Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBarButton}>
            <TouchableOpacity
              onPress={() => {
                stopBackgroundLocationTask();
              }}
            >
              <Text style={styles.buttonText}>Stop sharing Live Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBarButton}>
            <TouchableOpacity
              onPress={() => {
                logout();
              }}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  carouselContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  carouselContentContainer: {
    paddingHorizontal: 10,
  },
  paginationContainer: {
    paddingTop: 8,
    paddingBottom:120,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#894DF8',
  },
  paginationInactiveDot: {
    backgroundColor: 'gray',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFF',
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFF',
  },
  event: {
    fontSize: 16,
    marginBottom: 4,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#894DF8',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  buttont: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  numberContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity and color as desired
    borderRadius: 100,
    width: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  number: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '33.33%',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#894DF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#894DF8',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
});*/
/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/db';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log('An error occurred in background location task:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;
    
    try {
      const email = await AsyncStorage.getItem('email');
      // Store the location in the 'user_positions' collection
      await db.collection('user_positions').doc().set({
        email,
        latitude,
        longitude,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.log(error);
    }
  }
});



const Card = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      // Fetch user details from AsyncStorage
  
      const eventsCollection = db.collection('events');
      const querySnapshot = await eventsCollection.get();
  
      const enrollmentsData = querySnapshot.docs.map((doc) => {
        const enrollment = doc.data();
  
        return {
          id: doc.id, // Add the document ID to the returned data
          ...enrollment,
        };
      });
  
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.log(error);
    }
  };
  

  const  registerForPushNotificationsAsync= async(eventId) => {
    console.log(eventId);
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const email = await AsyncStorage.getItem('email');
    console.log(email);
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    storeToken(token,email,eventId);
  }

  const storeToken = async(token,email,eventId) => {
    console.log(token);
    await db.collection('tokens').add({token:token,email:email,eventId: eventId,});
  }

  const logout = async () => {
    try {
      // Clear AsyncStorage values
      await AsyncStorage.removeItem('user');
      navigation.navigate('UserLogin');
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = (Eventname) => {
    console.log(Eventname);
    navigation.navigate('Register', { Eventname });
  };

  const startBackgroundLocationTask = async (eventId) => {
    // Check if background location permission is granted
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Background Location Permission Required',
        'Please enable background location permissions to track your location in the background.'
      );
      return;
    }

    
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      deferredUpdatesInterval: 1000,
      data: { eventId },
    });

    console.log('Background location task started.');
  };

  const stopBackgroundLocationTask = async () => {
    // Stop the background location task
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);

    console.log('Background location task stopped.');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        {enrollments.map((enrollment) => (
          <View key={enrollment.id} style={styles.card}>
            <Text style={styles.name}>Event: {enrollment.Eventname}</Text>
            <Text style={styles.email}>Location: {enrollment.Address}</Text>
            <Text style={styles.event}>Description: {enrollment.EventDescription}</Text>
            <Text style={styles.event}>Event Start Time: {enrollment.EventStartTime}</Text>
            <Text style={styles.event}>Event End Time: {enrollment.EventEndTime}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                startBackgroundLocationTask();
              }}
            >
              <Text style={styles.buttonText}>Track Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
  style={styles.button}
  onPress={() => {
    startBackgroundLocationTask(enrollment.id); // Pass the eventId to the function
  }}
>
  <Text style={styles.buttonText}>Track Location</Text>
</TouchableOpacity>
<TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleRegister(enrollment.Eventname);
        }}
      >
        <Text style={styles.button}>Register</Text>
      </TouchableOpacity>
<Pressable>
      <View style={styles.bluebutton}>
 <Text style={styles.button}  onPress={() => {
        registerForPushNotificationsAsync(enrollment.id); 
      }}>Get Notifications!</Text>
</View>
 </Pressable>
          </View>
          
        ))}
      </ScrollView>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  event: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FFB0CC',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});*/
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Pressable, Platform,ImageBackground } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseConfig from '../config/db';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { AntDesign } from '@expo/vector-icons';
import backgroundImage from './5.png';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.log('An error occurred in the background location task:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;

    try {
      const email = await AsyncStorage.getItem('email');
      // Store the location in the 'user_positions' collection
      await db.collection('user_positions').doc().set({
        email,
        latitude,
        longitude,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  }
});

const Card = ({ navigation }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const eventsCollection = db.collection('events');
      const querySnapshot = await eventsCollection.get();

      const enrollmentsData = querySnapshot.docs.map((doc) => {
        const enrollment = doc.data();

        return {
          id: doc.id,
          ...enrollment,
        };
      });

      setEnrollments(enrollmentsData);
    } catch (error) {
      console.log(error);
    }
  };

  const registerForPushNotificationsAsync = async (eventId) => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    const email = await AsyncStorage.getItem('email');
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    storeToken(token, email, eventId);
  };

  const storeToken = async (token, email, eventId) => {
    console.log(token);
    await db.collection('tokens').add({ token: token, email: email, eventId: eventId });
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('UserLogin');
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = (Eventname) => {
    navigation.navigate('Register', { Eventname });
  };

  const startBackgroundLocationTask = async (eventId) => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Background Location Permission Required',
        'Please enable background location permissions to track your location in the background.'
      );
      return;
    }

    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      showsBackgroundLocationIndicator: true,
      deferredUpdatesInterval: 1000,
      data: { eventId },
    });

    console.log('Background location task started.');
  };

  const MyEvents=()=>{
    navigation.navigate("MyEvents");
  }
  const stopBackgroundLocationTask = async () => {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    console.log('Background location task stopped.');
  };

  const carouselRef = React.useRef(null);

  const renderCarouselItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{index + 1}</Text>
      </View>
      <Text style={styles.name}>Event: {item.Eventname}</Text>
      <Text style={styles.email}>Location: {item.Address}</Text>
      <Text style={styles.event}>Description: {item.EventDescription}</Text>
      <Text style={styles.event}>Event Start Time: {item.EventStartTime}</Text>
      <Text style={styles.event}>Event End Time: {item.EventEndTime}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleRegister(item.Eventname);
        }}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Pressable onPress={() => registerForPushNotificationsAsync(item.id)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Get Notifications!</Text>
        </View>
      </Pressable>
    </View>
  );

  const handleSnapToItem = (index) => {
    setActiveSlide(index);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={MyEvents}>
          <Text style={styles.buttonText}>MyEvents</Text>
        </TouchableOpacity>
        <View style={styles.carouselContainer}>
          <Pagination
            dotsLength={enrollments.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.paginationInactiveDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          <Carousel
            ref={carouselRef}
            data={enrollments}
            renderItem={renderCarouselItem}
            sliderWidth={400}
            itemWidth={300}
            onSnapToItem={handleSnapToItem}
          />
          
        </View>
        
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarButton}>
          <TouchableOpacity
            onPress={() => {
              startBackgroundLocationTask();
            }}
          >
            <Text style={styles.buttonText}>Share Live Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBarButton}>
          <TouchableOpacity
            onPress={() => {
              stopBackgroundLocationTask();
            }}
          >
            <Text style={styles.buttonText}>Stop Sharing Live Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </ImageBackground>
);
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  carouselContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  paginationContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#894DF8',
  },
  paginationInactiveDot: {
    backgroundColor: 'gray',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFF',
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFF',
  },
  event: {
    fontSize: 16,
    marginBottom: 4,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#894DF8',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  numberContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 100,
    width: 50,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  number: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
