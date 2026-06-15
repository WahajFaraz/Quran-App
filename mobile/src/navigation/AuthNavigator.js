import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { AalimLoginScreen, AalimRegisterScreen } from '../screens/auth/AalimAuthScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="AalimLogin" component={AalimLoginScreen} />
    <Stack.Screen name="AalimRegister" component={AalimRegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
