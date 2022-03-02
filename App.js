import { StyleSheet, View, Button, TextInput, Alert } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function App() {

  const [address, setAddress] = useState('')
  const [cordinates, setCordinates] = useState({
    latitude: 60.240332499999994,
    longitude: 25.07525595193482,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
});
  // key: GBaecdACCbG95K2GDMfzOYkfrB3uyGbz


  const search = () => {
    let input = address.replace(' ', ','); // Ratapihantie 13 Helsinki toimii, mutta jos jättää Helsingin pois, niin näyttää Canadaan
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=GBaecdACCbG95K2GDMfzOYkfrB3uyGbz&location=` + input)
    .then(response => response.json())
    .then(data => {
      console.log (data.results[0].locations[0].displayLatLng)
      setCordinates({lat: data.results[0].locations[0].displayLatLng.lat, lng: data.results[0].locations[0].displayLatLng.lng})
    })
    .catch((error) => {
      Alert.alert('Error');
    });
  } 

  useEffect(() => {
    const fetchLocation = async () => { // useEffect ei vaan toimi!
    let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('No permission to get location')
  } else {
    try {  
let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High}); 
console.log(location);
setCordinates({ ...cordinates, latitude: location.coords.lat, longitude: location.coords.lng });  
  } catch (error) {
    console.log(error.message);
  }
}
    }
  fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={{flex: 1}}
        region={{
          latitude: cordinates.lat,
          longitude: cordinates.lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
      >
      <Marker 
        coordinate={{
        latitude:cordinates.lat, 
        longitude:cordinates.lng}}
       // title='Haaga-Helia' 
      />
      </MapView>
      <TextInput onChangeText = {(address)=>setAddress(address)} value = {address} >
      </TextInput>
      <Button title='Etsi' onPress={search}>      
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});