import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function NavBar(props) {
  const navigation = useNavigation();
  var data = props.data;
  var dark = props.dark;

  return (
    <View style={[styles.row, dark ? {borderTopColor: 'gray', backgroundColor: 'black'} : {borderTopColor: '#E9E9E9', backgroundColor: 'white'}]}>
      <TouchableOpacity onPress={() => navigation.navigate("Home", { data: data, dark: dark })} style={styles.icon}>
        <Image style={styles.img} source={dark ? require('../assets/home-white.png') : require('../assets/home.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Location", { data: data, dark: dark })} style={styles.icon}>
        <Image style={styles.img} source={dark ? require('../assets/location-white.png') : require('../assets/location.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Favorites", { data: data, dark: dark })} style={styles.icon}>
        <Image style={styles.img} source={dark ? require('../assets/heart-white.png') : require('../assets/heart.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Map", { data: data, dark: dark })} style={styles.icon}>
        <Image style={styles.img} source={dark ? require('../assets/map-white.png') : require('../assets/map.png')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  img: {
    height: 25,
    aspectRatio: 1,
  }
});
