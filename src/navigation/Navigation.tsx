import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../shared/theme';
import {RootStackParamList, ScreenNames} from './typings';
import HomeScreen from '../home/HomeScreen';

const HomeStack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer theme={Colors.singlularTheme}>
      <HomeStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={ScreenNames.Home}>
        <HomeStack.Screen name={ScreenNames.Home} component={HomeScreen} />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}
