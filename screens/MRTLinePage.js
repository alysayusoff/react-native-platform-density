import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';
import CardView from '../components/CardView';

export default function MRTLinePage({ route, navigation }) {
  navigation.setOptions({ title: route.params.lineName, headerStyle: { backgroundColor: route.params.bgColor } });

  var data = route.params.data;
  var lineCode = route.params.lineCode;
  var dark = route.params.dark;

  var elements = {};
  elements[lineCode] = getStationsbyLine(lineCode, data);

  function getStationsbyLine(input, dict) {
    return dict[input];
  }

  if (elements[lineCode] !== undefined) {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <CardView data={data} elements={elements} dark={dark} />
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.errormsg}>Data could not be retrieved at this time. Try again later.</Text>
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  // return (
  //   <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
  //     <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
  //       <CardView data={data} elements={elements} dark={dark} />
  //     </ScrollView>
  //     <NavBar data={data} dark={dark} />
  //     <StatusBar style="auto" />
  //   </SafeAreaView>
  // );
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
