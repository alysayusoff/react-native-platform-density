import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, ScrollView, ActivityIndicator, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import CardView from '../components/CardView';
import { apiKeyOpenWeather } from '../keys/apiKey';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';

export default function LocationPage({ route, navigation }) {
  navigation.setOptions({ title: 'MRT Platforms near you' });
  var data = route.params.data;
  var dark = route.params.dark;

  if (dark) { navigation.setOptions({ headerTintColor: 'white', headerStyle: { backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: 'white' }}); }
  else { navigation.setOptions({ headerTintColor: 'black', headerStyle: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'black' }}); }

  const [position, setPosition] = useState("SIM Global Education");
  const [coords, setCoords] = useState([1.3294015060646116, 103.77617376565941]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearestMrt, setNearestMrt] = useState(null);
  const [sliderVal, setSliderVal] = useState(2);
  const [retrieved, setRetrieved] = useState(false); // to delete

  useEffect(() => {
    (async() => {
      if (retrieved === false) { // to delete
        await run();
        setRetrieved(true); // to delete
      } // to delete
    })();
  }, []);

  async function run() {
    var result = await getLocation();
    if (result !== undefined) {
      getNearestMrt(data, result);
    }
  }

  async function getLocation() {
    setNearestMrt(null);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg("Permission to use your location has been denied.");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});

    let openWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${apiKeyOpenWeather}&units=metric`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    openWeather = await openWeather.json();

    if (openWeather.sys.country === 'SG') {
      setPosition(openWeather.name);
      setCoords([loc.coords.latitude, loc.coords.longitude]);
    }

    return [loc.coords.latitude, loc.coords.longitude];
  }

  // https://stackoverflow.com/questions/51819224/how-to-find-nearest-location-using-latitude-and-longitude-from-a-json-data
  function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta/180;

    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) { dist = 1; }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return dist;
  }

  function getNearestMrt(dict, arr) {
    var result = {};
    for (var lineCode in dict) {
      var output = {};
      for (var stationCode in dict[lineCode].stations) {
        let mrtCoords = [dict[lineCode].stations[stationCode].lat, dict[lineCode].stations[stationCode].lon]
        if (distance(arr[0], arr[1], mrtCoords[0], mrtCoords[1]) <= sliderVal) {
          output[stationCode] = dict[lineCode].stations[stationCode];
          result[lineCode] = {
            name: dict[lineCode].name,
            colorCode: dict[lineCode].colorCode,
            stations: output
          };
        }
      }
    }
    setNearestMrt(result);
  }

  async function refreshLocation() {
    await run();
  }

  function onSliderValChange() {
    getNearestMrt(data, coords);
  }

  if (errorMsg !== null) {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={dark ? { color: 'white' } : { color: 'black' }}>{errorMsg}</Text>
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  else if (nearestMrt !== null) {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.row}>
            <View style={{flex: 1}}>
              <Text style={[{ fontSize: 16 }, dark ? { color: 'white' } : { color: 'black' }]}>Your Location</Text>
              <Text style={[styles.locationTxt, dark ? { color: 'white' } : { color: 'black' }]}>{position}</Text>
            </View>
            <TouchableOpacity onPress={refreshLocation}>
            { dark ?
              <Image style={styles.img} source={require('../assets/refresh-white.png')} />
              :
              <Image style={styles.img} source={require('../assets/refresh.png')} />
            }
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={[styles.radius, dark ? { color: 'white' } : { color: 'black' }]}>Radius (Kilometres): {sliderVal}</Text>
            <Slider
              style={{ flex: 1, }}
              minimumValue={1}
              maximumValue={5}
              value={sliderVal}
              onValueChange={setSliderVal}
              onSlidingComplete={onSliderValChange}
              step={0.5}
            />
          </View>
          {Object.keys(nearestMrt).length !== 0 ?
            <CardView data={data} elements={nearestMrt} expandable={true} dark={dark} />
          :
            <Text style={styles.errorMsg}>No stations near you within {sliderVal} kilometre(s).</Text>
          }
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  else {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={dark ? { color: 'white' } : { color: 'black' }}>Getting your location...{"\n"}</Text>
          <ActivityIndicator />
        </ScrollView>
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  scrollView: {},
  contentContainer: {
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  locationTxt: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  img: {
    height: 25,
    aspectRatio: 1
  },
  radius: {
    fontSize: 16,
    width: 160,
  },
  errorMsg: {
    textAlign: 'center',
    marginTop: 20,
  },
});
