import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const {width:SCREEN_WIDTH}=Dimensions.get("window");
//console.log(SCREEN_WIDTH);
const API_KEY="bbf90ef1e48924ff941d54d45592d747";

const icons={
  Clouds:"cloudy",
  Clear:"day-sunny",
  Snow:"snow",
  Rain:"rains",
  Drizzle:"rain",
  Atmosphere:"cloudy-gusts",
  Thunderstorm:"lightning",
}

export default function App() {
  const [district, setDistrict]=useState("Loading");
  //const [location, setLocation]=useState();
  const [days, setDays]=useState([]);
  const [ok, setOk]=useState(true);
  const getWeather=async()=>{
    const {granted}=await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}}=await Location.getCurrentPositionAsync({accuracy:5}); 
    const location= await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setDistrict(location[0].district);
    const response= await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json=await response.json();
    setDays(json.daily);
  };
  useEffect(()=>{
    getWeather();
  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{district}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}>
        {days.length===0? (
          <View style={styles.day}>
            <ActivityIndicator
              style={{ marginTop: 10 }}
              color="black"
              size="large" />
          </View>
        ) : (
          days.map((day, index)=>
          <View key={index} style={styles.day}>
            <View style={{
              flexDirection:"row", 
              alignItems:"center", 
              width:"90%",
              justifyContent:"space-between",
              }}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={68} color="black" />
            </View>
            
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
  ); 
}

const styles=StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor: "orange",
  },
  city:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName:{
    fontSize:48,
    fontWeight:"500",
  },
  weather:{},
  day:{
    width:SCREEN_WIDTH,
    alignItems:"center",
  },
  temp:{
    marginTop:50,
    fontSize:108,
  },
  description:{
    marginTop:-20,
    fontSize:40,
  },
  tinyText:{
    fontSize:18,
  },
})