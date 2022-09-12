import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';
import CardView from '../components/CardView';

export default function FavoritesPage({ route, navigation }) {
  var data = route.params.data;
  var dark = route.params.dark;

  if (dark) { navigation.setOptions({ headerTintColor: 'white', headerStyle: { backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: 'white' }}); }
  else { navigation.setOptions({ headerTintColor: 'black', headerStyle: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'black' }}); }

  return (
    <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
      <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <CardView data={data} onlyFav={true} expandable={true} dark={dark} />
      </ScrollView>
      <NavBar data={data} dark={dark} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {},
  contentContainer: {
    paddingTop: 10,
  },
});
