import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View, Dimensions, Image, Text, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import ImageZoom from 'react-native-image-pan-zoom';

export default function MapPage({ route }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  var data = route.params.data;
  var dark = route.params.dark;

  return (
    <SafeAreaView style={[{ flex: 1 }, dark ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}>
      <View style={styles.view}>
      <ImageZoom cropWidth={Dimensions.get('window').width} cropHeight={Dimensions.get('window').height} imageWidth={375} imageHeight={295}>
        { imgLoaded ? null :
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[{ marginRight: 5 }, dark ? { color: 'white' } : { color: 'black' }]}>Loading image...</Text>
            <ActivityIndicator />
          </View>
        }
        <Image style={{ width: 375, height: 295 }} source={require('../assets/map.jpg')} onLoad={() => setImgLoaded(true)} />
      </ImageZoom>
      </View>
      <NavBar data={data} dark={dark} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  view: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  img: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
  },
});
