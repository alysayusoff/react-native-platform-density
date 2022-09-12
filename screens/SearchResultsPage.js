import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';
import CardView from '../components/CardView';

export default function SearchResultsPage({ route, navigation }) {
  var input = route.params.input;
  var data = route.params.data;
  var dark = route.params.dark;
  const searchMsg = `Showing results for "${input}"`;

  navigation.setOptions({ title: searchMsg });
  if (dark) { navigation.setOptions({ headerTintColor: 'white', headerStyle: { backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: 'white' }}); }
  else { navigation.setOptions({ headerTintColor: 'black', headerStyle: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'black' }}); }

  var elements = getStationByInput(input, data);

  function getStationByInput(input, data) {
    var result = {};
    input = input.toUpperCase();
    for (var lineCode in data) {
      var output = {};
      for (var stationCode in data[lineCode].stations) {
        if (data[lineCode].stations[stationCode].name.includes(input) || stationCode.includes(input)) {
          output[stationCode] = data[lineCode].stations[stationCode];
          result[lineCode] = {
            name: data[lineCode].name,
            colorCode: data[lineCode].colorCode,
            stations: output
          };
        }
      }
    }
    return result;
  }

  if (Object.keys(elements).length !== 0) {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <CardView data={data} elements={elements} expandable={true} dark={dark} />
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={dark ? { color: 'white' } : { color: 'black' }}>No stations with name "{input}."</Text>
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  scrollView: {},
  contentContainer: {
    paddingTop: 10,
  },
});
