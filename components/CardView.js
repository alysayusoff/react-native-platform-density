import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardView(props) {
  const navigation = useNavigation();
  var data = props.data;
  var elements = props.elements;
  var dark = props.dark;

  const [favorites, setFavorites] = useState([]);
  const [favElements, setFavElements] = useState({});
  const [retrieved, setRetrieved] = useState(false);

  useEffect(() => {
    (async () => {
      if (retrieved === false) {
        await run();
        setRetrieved(true);
      }
    })();
  }, []);

  async function run() {
    var result = await AsyncStorage.getItem('@favorites');
    if (result !== null) {
      result = JSON.parse(result);
      setFavorites(result);
      var faves = getFavElements(result, data);
      setFavElements(faves);
    }
  }

  function getFavorites() {
    return favorites;
  }

  function getFavElements(arr, data) {
    var result = {};
    for (var lineCode in data) {
      var output = {};
      for (var stationCode in data[lineCode].stations) {
        let name = data[lineCode].stations[stationCode].name;
        if (arr.includes(name)) {
          output[stationCode] = data[lineCode].stations[stationCode];
          result[lineCode] = {
            name: data[lineCode].name,
            colorCode: data[lineCode].colorCode,
            stations: output,
          };
        }
      }
    }
    return result;
  }

  async function favoriteButton(value) {
    var arr = await AsyncStorage.getItem('@favorites');
    if (arr !== null) {
      arr = JSON.parse(arr);
    } else {
      arr = [];
    }
    // var arr = getFavorites();
    if (arr.includes(value)) {
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
    } else {
      arr.push(value);
    }
    try {
      await AsyncStorage.setItem('@favorites', JSON.stringify(arr));
      await run();
    } catch (e) {
      console.log('Error with storing data:', e);
    }
  }

  if (props.onlyFav) {
    if (Object.keys(favElements).length !== 0) {
      return (
        <View>
          {Object.entries(favElements).map(([lineCode, lineInfo]) => (
            <View key={lineCode}>
              <View
                style={[styles.line, { backgroundColor: lineInfo.colorCode }]}>
                <Text style={[styles.lineCode, { color: 'white' }]}>
                  {lineCode}
                </Text>
                <Text style={{ color: 'white' }}>{lineInfo.name}</Text>
              </View>
              <View
                style={[
                  styles.container,
                  dark
                    ? { backgroundColor: '#2A2A2A' }
                    : { backgroundColor: '#F0F0F0' },
                ]}>
                {Object.entries(lineInfo.stations) != 0 ? (
                  Object.entries(lineInfo.stations).map(
                    ([stationCode, stationInfo]) => (
                      <View
                        key={stationCode}
                        style={[
                          styles.station,
                          dark
                            ? { backgroundColor: 'black' }
                            : { backgroundColor: 'white' },
                        ]}>
                        <Text
                          style={[
                            styles.stationCode,
                            dark ? { color: 'white' } : { color: 'black' },
                          ]}>
                          {stationCode}
                        </Text>
                        <Text
                          style={[
                            styles.stationName,
                            dark ? { color: 'white' } : { color: 'black' },
                          ]}>
                          {stationInfo.name}
                        </Text>
                        <View
                          style={[
                            styles.crowdLevel,
                            { backgroundColor: stationInfo.colorCode },
                          ]}>
                          <Text style={{ color: 'white' }}>
                            {stationInfo.crowdLevel}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => favoriteButton(stationInfo.name)}>
                          {favorites.includes(stationInfo.name) ? (
                            <Image
                              style={styles.img}
                              source={
                                dark
                                  ? require('../assets/heart-active-white.png')
                                  : require('../assets/heart-active.png')
                              }
                            />
                          ) : (
                            <Image
                              style={styles.img}
                              source={
                                dark
                                  ? require('../assets/heart-white.png')
                                  : require('../assets/heart.png')
                              }
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )
                  )
                ) : (
                  <View>
                    <Text style={styles.errormsg}>
                      Data could not be retrieved at this time. Try again later.
                    </Text>
                  </View>
                )}
                {Object.entries(lineInfo.stations) != 0 ? (
                  props.expandable ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('MRTLine', {
                          data: data,
                          lineCode: lineCode,
                          lineName: lineInfo.name,
                          bgColor: lineInfo.colorCode,
                          dark: dark,
                        })
                      }>
                      <Text
                        style={[
                          styles.viewAll,
                          dark ? { color: 'white' } : { color: 'black' },
                        ]}>
                        View all platforms on {lineInfo.name} ➔
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View></View>
                  )
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <Text
          style={[
            { textAlign: 'center' },
            dark ? { color: 'white' } : { color: 'black' },
          ]}>
          No favorites to show! Tap a heart to favorite a station.
        </Text>
      );
    }
  } else {
    if (elements) {
      return (
        <View>
          {Object.entries(elements).map(([lineCode, lineInfo]) => (
            <View key={lineCode}>
              <View
                style={[styles.line, { backgroundColor: lineInfo.colorCode }]}>
                <Text style={[styles.lineCode, { color: 'white' }]}>
                  {lineCode}
                </Text>
                <Text style={{ color: 'white' }}>{lineInfo.name}</Text>
              </View>
              <View
                style={[
                  styles.container,
                  dark
                    ? { backgroundColor: '#2A2A2A' }
                    : { backgroundColor: '#F0F0F0' },
                ]}>
                {Object.entries(lineInfo.stations) != 0 ? (
                  Object.entries(lineInfo.stations).map(
                    ([stationCode, stationInfo]) => (
                      <View
                        key={stationCode}
                        style={[
                          styles.station,
                          dark
                            ? { backgroundColor: 'black' }
                            : { backgroundColor: 'white' },
                        ]}>
                        <Text
                          style={[
                            styles.stationCode,
                            dark ? { color: 'white' } : { color: 'black' },
                          ]}>
                          {stationCode}
                        </Text>
                        <Text
                          style={[
                            styles.stationName,
                            dark ? { color: 'white' } : { color: 'black' },
                          ]}>
                          {stationInfo.name}
                        </Text>
                        <View
                          style={[
                            styles.crowdLevel,
                            { backgroundColor: stationInfo.colorCode },
                          ]}>
                          <Text style={{ color: 'white' }}>
                            {stationInfo.crowdLevel}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => favoriteButton(stationInfo.name)}>
                          {favorites.includes(stationInfo.name) ? (
                            <Image
                              style={styles.img}
                              source={
                                dark
                                  ? require('../assets/heart-active-white.png')
                                  : require('../assets/heart-active.png')
                              }
                            />
                          ) : (
                            <Image
                              style={styles.img}
                              source={
                                dark
                                  ? require('../assets/heart-white.png')
                                  : require('../assets/heart.png')
                              }
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )
                  )
                ) : (
                  <View>
                    <Text
                      style={[
                        styles.errormsg,
                        dark ? { color: 'white' } : { color: 'black' },
                      ]}>
                      Data could not be retrieved at this time. Try again later.
                    </Text>
                  </View>
                )}
                {Object.entries(lineInfo.stations) != 0 ? (
                  props.expandable ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('MRTLine', {
                          data: data,
                          lineCode: lineCode,
                          lineName: lineInfo.name,
                          bgColor: lineInfo.colorCode,
                          dark: dark,
                        })
                      }>
                      <Text
                        style={[
                          styles.viewAll,
                          dark ? { color: 'white' } : { color: 'black' },
                        ]}>
                        View all platforms on {lineInfo.name} ➔
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View></View>
                  )
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <Text
          style={[
            { textAlign: 'center' },
            dark ? { color: 'white' } : { color: 'black' },
          ]}>
          Data could not be retrieved at this time. Try again later.
        </Text>
      );
    }
    // return (
    //   <View>
    //     { Object.entries(elements).map(([lineCode, lineInfo]) =>
    //       <View key={lineCode}>
    //         <View style={[styles.line, { backgroundColor: lineInfo.colorCode }]}>
    //           <Text style={[styles.lineCode, { color: 'white' }]}>{lineCode}</Text>
    //           <Text style={{ color: 'white' }}>{lineInfo.name}</Text>
    //         </View>
    //         <View style={[styles.container, dark ? {backgroundColor: '#2A2A2A'} : {backgroundColor: '#F0F0F0'}]}>
    //           { Object.entries(lineInfo.stations) != 0 ?
    //             Object.entries(lineInfo.stations).map(([stationCode, stationInfo]) =>
    //               <View key={stationCode} style={[styles.station, dark ? {backgroundColor:'black'} : {backgroundColor:'white'}]}>
    //                 <Text style={[styles.stationCode, dark ? {color: 'white'} : {color: 'black'}]}>{stationCode}</Text>
    //                 <Text style={[styles.stationName, dark ? {color: 'white'} : {color: 'black'}]}>{stationInfo.name}</Text>
    //                 <View style={[styles.crowdLevel, { backgroundColor: stationInfo.colorCode }]}>
    //                   <Text style={{ color: 'white'}}>{stationInfo.crowdLevel}</Text>
    //                 </View>
    //                 <TouchableOpacity onPress={() => favoriteButton(stationInfo.name)}>
    //                 { favorites.includes(stationInfo.name) ?
    //                   <Image style={styles.img} source={dark ? require('../assets/heart-active-white.png') : require('../assets/heart-active.png')} />
    //                   :
    //                   <Image style={styles.img} source={dark ? require('../assets/heart-white.png') : require('../assets/heart.png')} />
    //                 }
    //                 </TouchableOpacity>
    //               </View>
    //             )
    //             :
    //             <View>
    //               <Text style={[styles.errormsg, dark ? {color: 'white'} : {color: 'black'}]}>Data could not be retrieved at this time. Try again later.</Text>
    //             </View>
    //           }
    //           { Object.entries(lineInfo.stations) != 0 ?
    //           props.expandable ?
    //             <TouchableOpacity onPress={() => navigation.navigate("MRTLine", {
    //               data: data,
    //               lineCode: lineCode,
    //               lineName: lineInfo.name,
    //               bgColor: lineInfo.colorCode,
    //               dark: dark
    //             })}>
    //               <Text style={[styles.viewAll, dark ? {color: 'white'} : {color: 'black'}]}>View all platforms on {lineInfo.name} ➔</Text>
    //             </TouchableOpacity>
    //             :
    //             <View></View>
    //           :
    //           <View></View>
    //           }
    //         </View>
    //       </View>
    //     )}
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingLeft: 5,
    paddingRight: 10,
    position: 'absolute',
    zIndex: 1,
    left: 15,
  },
  lineCode: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 5,
  },
  container: {
    marginTop: 18,
    paddingTop: 25,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 10,
  },
  station: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  stationCode: {
    fontWeight: 'bold',
    fontSize: 22,
    width: 75,
  },
  stationName: {
    flex: 1,
    fontWeight: '500',
  },
  crowdLevel: {
    paddingTop: 2,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    marginRight: 8,
  },
  img: {
    height: 18,
    aspectRatio: 1,
  },
  viewAll: {
    textAlign: 'right',
    paddingBottom: 10,
  },
  errormsg: {
    marginBottom: 12,
  },
});
