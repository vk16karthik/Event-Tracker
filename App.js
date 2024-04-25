import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserSignup from './screens/UserSignup';
import UserLogin from './screens/Userlogin';
import Welcomepage from './screens/Welcomepage';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Home from './screens/Home';
import Events from './screens/Events';
import Enrollment from './screens/Enrollments';
import Map from './screens/Map';
import Card from './screens/Card';
import Register from './screens/Register';
import QrCodeDisplay from './screens/qr';
import Position from './screens/Position';
import Scanner from './screens/Scanner';
import MyEvents from './screens/MyEvents';
import Edit from './screens/Edit';
import Modify from './screens/Modify';
import SendNotifications from './screens/SendNotifications';

const Stack = createStackNavigator();

 export default function App(){
  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Welcomepage" component={Welcomepage}/>
    <Stack.Screen name="UserLogin" component={UserLogin}/>
    <Stack.Screen name="UserSignup" component={UserSignup}/>
    <Stack.Screen name="Home" component={Home}/>
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="Signup" component={Signup}/>
    <Stack.Screen name="Events" component={Events}/>
    <Stack.Screen name="Enrollment" component={Enrollment}/>
    <Stack.Screen name="Map" component={Map}/>
    <Stack.Screen name="Card" component={Card}/>
    <Stack.Screen name="Register" component={Register}/>
    <Stack.Screen name="QrCodeDisplay" component={QrCodeDisplay}/>
    <Stack.Screen name="Position" component={Position}/>
    <Stack.Screen name="Scanner" component={Scanner}/>
    <Stack.Screen name="MyEvents" component={MyEvents}/>
    <Stack.Screen name="Edit" component={Edit}/>
    <Stack.Screen name="Modify" component={Modify}/>
    <Stack.Screen name="SendNotifications" component={SendNotifications}/>
    </Stack.Navigator>
    </NavigationContainer>
    //<Scanner/>
      );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});