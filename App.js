import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './screens/HomePage';
import LocationPage from './screens/LocationPage';
import FavoritesPage from './screens/FavoritesPage';
import MapPage from './screens/MapPage';
import MRTLinePage from './screens/MRTLinePage';
import SearchResultsPage from './screens/SearchResultsPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomePage} options={{
          headerShadowVisible: false
        }} />
        <Stack.Screen name="Location" component={LocationPage} options={{
          headerBackTitleVisible: false,
          headerShadowVisible: false
        }} />
        <Stack.Screen name="Favorites" component={FavoritesPage} options={{
          headerBackTitleVisible: false,
          headerShadowVisible: false
        }} />
        <Stack.Screen name="SearchResults" component={SearchResultsPage} options={{
          headerBackTitleVisible: false, 
          headerShadowVisible: false 
        }} />
        <Stack.Screen name="Map" component={MapPage} options={{
          title: 'SMRT Map',
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#00484f' },
          headerShadowVisible: false,
          headerBackTitleVisible: false,

        }} />
        <Stack.Screen name="MRTLine" component={MRTLinePage} options={{
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
