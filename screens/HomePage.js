import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import CardView from '../components/CardView';
import { apiKeyLTA } from '../keys/apiKey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default function HomePage({ navigation }) {
  const [internetConnected, setInternetConnected] = useState(true);

  const unsubscribe = NetInfo.addEventListener(state => {
    if (internetConnected != state.isConnected) {
      setInternetConnected(state.isConnected);
    }
  });

  let trainLines = ['BPL', 'CCL', 'CEL', 'CGL', 'DTL', 'EWL', 'NEL', 'NSL', 'PLRT', 'SLRT'];
  let lineColor = { BPL: '#738472', CCL: '#f99e19', CEL: '#f99e19', CGL: '#029636', DTL: '#0651c6', EWL: '#029636', NEL: '#9c25b3', NSL: '#da1d1b', PLRT: '#738472', SLRT: '#738472' };
  let lineName = { BPL: 'Bukit Panjang LRT', CCL: 'Circle Line', CEL: 'Circle Line Extension', CGL: 'Changi Extension', DTL: 'Downtown Line', EWL: 'East West Line', NEL: 'North East Line', NSL: 'North South Line', PLRT: 'Punggol LRT', SLRT: 'Sengkang LRT' };

  const [retrieved, setRetrieved] = useState(false); // to delete
  const [data, setData] = useState(null);
  const [topElements, setTopElements] = useState(null);
  const [timeRequested, setTimeRequested] = useState("");
  const [nextRequest, setNextRequest] = useState("");
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(false);

  if (dark) { navigation.setOptions({ headerTintColor: 'white', headerStyle: { backgroundColor: 'black', borderBottomWidth: 1, borderBottomColor: 'white' }}); }
  else { navigation.setOptions({ headerTintColor: 'black', headerStyle: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: 'black' }}); }

  useEffect(() => {
    (async() => {
      if (retrieved === false) { // to delete
        await run();
        await getTheme();
        setRetrieved(true); // to delete
      } // to delete
    })();
  }, []);

  async function run() {
    setData(null);
    setTopElements(null);
    getTimes();
    var returnedJson = await getData();
    var processedJson = process(returnedJson[0], returnedJson[1]);
    setData(processedJson);
    // console.log(processedJson);
    var result = getTopElements(processedJson);
    setTopElements(result);
  }

  async function getTheme() {
    var result = await AsyncStorage.getItem('@theme');
    if (result !== null) {
      if (result === 'true') { setDark(true); }
      else { setDark(false); }
    }
  }

  function getTimes() {
    let curr = new Date();
    let next = new Date(curr);
    next.setMinutes(next.getMinutes() + 10);
    setTimeRequested(curr.toString());
    setNextRequest(next.toString());
  }

  async function getData() {
    var platformData = {};
    var locationData = require('../data/locationData.json');
    for (var i = 0; i < trainLines.length; i++) {
      let platformRes = await fetch(`http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime?TrainLine=${trainLines[i]}`, {
        method: 'GET',
        headers: {
          AccountKey: apiKeyLTA,
          accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      platformRes = await platformRes.json();
      platformData[trainLines[i]] = platformRes;
      // for (var platform in platformRes.value) {
      //   let station = platformRes.value[platform].Station;
      //   let locationRes = await fetch(`https://developers.onemap.sg/commonapi/search?searchVal=${station}&returnGeom=Y&getAddrDetails=N&pageNum=1`, {
      //     method: 'GET', headers: { accept: 'application/json' }
      //   });
      //   locationRes = await locationRes.json();
      //   locationData[station] = locationRes;
      // }
    }
    return [platformData, locationData];
  }

  function process(platformData, locationData) {
    var processedData = {};
    for (var lineCode in platformData) {
      let platform = platformData[lineCode].value;
      var stations = {};
      for (var info in platform) {
        let stationCode = platform[info].Station;

        var crowdLevel, crowdColor;
        if (platform[info].CrowdLevel === 'l') { crowdLevel = 'low'; crowdColor = 'green'; }
        else if (platform[info].CrowdLevel === 'm') { crowdLevel = 'moderate'; crowdColor = 'orange'; }
        else if (platform[info].CrowdLevel === 'h') { crowdLevel = 'high'; crowdColor = 'red'; }
        else { crowdLevel = 'n/a'; crowdColor = 'lightgray'; }

        let locResults = locationData[stationCode].results;
        for (var i = 0; i < locResults.length; i++) {
          let searchVal = locResults[i].SEARCHVAL;
          if (searchVal.includes("RT STATION ")) {
            const nameArray = searchVal.split("RT STATION ");
            stations[stationCode] = {
              name: nameArray[0].slice(0, -2),
              lat: locResults[i].LATITUDE,
              lon: locResults[i].LONGITUDE,
              crowdLevel: crowdLevel,
              colorCode: crowdColor
            };
          }
        }
      }
      processedData[lineCode] = { name: lineName[lineCode], colorCode: lineColor[lineCode], stations: stations };
    }

    for (var i in processedData) {
      arr = [];
      sorted = {};
      for (var j in processedData[i].stations) { arr.push(j); }
      arr.sort(function(a, b) {
        a = a.match(/\d+/g);
        b = b.match(/\d+/g);
        a = Number(a);
        b = Number(b);
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
      });
      for (var j in arr) {
        sorted[arr[j]] = processedData[i].stations[arr[j]];
      }
      processedData[i].stations = sorted;
    }

    return processedData;
  }

  function getTopElements(dict) {
    var result = {};
    for (var lineCode in dict) {
      var i = 0;
      var output = {};
      for (var stationCode in dict[lineCode].stations) {
        if (i < 3) {
          output[stationCode] = dict[lineCode].stations[stationCode];
          i++;
        }
      }
      result[lineCode] = {
        name: dict[lineCode].name,
        colorCode: dict[lineCode].colorCode,
        stations: output
      };
    }
    return result;
  }

  async function refresh() {
    if (Date() < nextRequest) {
      Alert.alert("RESTRICTED", `Limit of one call every ten minutes.\nNext request available at ${new Date(nextRequest).toLocaleTimeString()}`);
    } else {
      await run();
    }
  }

  function search(input, data) {
    if (input === '') { Alert.alert('Empty Search', 'Please provide an input.'); }
    else {
      setInput("");
      navigation.navigate("SearchResults", {input: input, data: data, dark: dark});
    }
  }

  async function switchMode() {
    var value;
    if (dark === false) { value = 'true'; }
    else { value = 'false'; }

    try {
      await AsyncStorage.setItem('@theme', value);
      await getTheme();
    } catch (e) {
      console.log("Error with storing data:", e);
    }
  }

  if (internetConnected) {
    return (
      <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <View style={[{ borderTopWidth: 1 }, dark ? { borderTopColor: 'gray' } : { borderTopColor: '#E9E9E9' }]}></View>
        <View style={[styles.row, { padding: 10 }]}>
          <TextInput style={dark ? [styles.searchDark, { color: 'white' }] : styles.search} placeholder='Search for MRT platforms...' placeholderTextColor={dark ? 'white' : 'black'} value={input} onChangeText={setInput} />
          <TouchableOpacity onPress={() => search(input, data, dark)}>
            <Image style={styles.img} source={ dark ? require('../assets/search-white.png') : require('../assets/search.png')} />
          </TouchableOpacity>
        </View>
        <View style={[styles.row, { paddingLeft: 10, paddingRight: 10, marginBottom: 10 }]}>
          <View>
            <View style={styles.row}>
              <Text style={[styles.title, dark ? { color: 'white' } : { color: 'black' }]}>Platform Density</Text>
              <TouchableOpacity onPress={refresh}>
                <Image style={styles.img} source={dark ? require('../assets/refresh-white.png') : require('../assets/refresh.png')} />
              </TouchableOpacity>
            </View>
            <Text style={[{ fontSize: 14 }, dark ? { color: 'white' } : { color: 'black' }]}>Last updated at {new Date(timeRequested).toLocaleTimeString()}</Text>
          </View>
          <View style={styles.switch}>
            <Switch value={dark} onChange={switchMode} />
            <Text style={[styles.switchTxt, dark ? { color: 'white' } : { color: 'black' }]}>Dark Mode</Text>
          </View>
        </View>
        { topElements !== null ?
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
            <CardView data={data} elements={topElements} expandable={true} dark={dark} />
          </ScrollView>
          :
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        }
        <NavBar data={data} dark={dark} />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
  else {
    return (
      <View style={[styles.container, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
        <Text style={dark ? { color: 'white' } : { color: 'black' }}>No internet connection</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#F2F2F2',
    fontSize: 16,
  },
  img: {
    height: 25,
    aspectRatio: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  switch: {
    flex: 1,
    alignItems: 'flex-end',
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  switchTxt: {
    marginTop: 5,
    fontWeight: '500',
  },
  scrollView: {},
  contentContainer: {
    paddingBottom: 10,
  },
  // dark styling
  searchDark: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: 'white',
    fontSize: 16,
  },
});
