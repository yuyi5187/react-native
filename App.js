import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, View, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  TouchableHighlightComponent,
} from 'react-native';
import { theme } from './colors';
import { Fontisto } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsnyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY="@toDos";

export default function App() {
  const [working, setWorking]=useState(true);
  const [text, setText]=useState("");
  const [toDos, setToDos]=useState({});
  const travel=()=> setWorking(false);
  const work=()=>setWorking(true);
  const onChangeText=(payload)=>setText(payload);
  const saveToDos=async(toSave)=>{
    await AsnyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
  }
  const loadToDos=async()=>{
    const s= await AsnyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  useEffect(()=>{
    loadToDos();
  },[]);
  const addToDo=async()=>{
    if(text===""){
      return;
    }
    ///save to do
    /*const newToDos=Object.assign({}, toDos, {
      [Date.now()]:{text, work:working},
    });*/
    const newToDos = {
      ...toDos, //old
      [Date.now()]: { text, working }, //new
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo=(key)=>{
    Alert.alert(
      "Delete ToDo?", "Are you sure?", [
      {text:"Cancel"},
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos }; //object만들기
            delete newToDos[key]; //key삭제
            setToDos(newToDos); //todos를 다시 설정
            saveToDos(newToDos);
          }
        },
    ]);  
  }; 

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working? "white": theme.grey}}>
            Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working? "white": theme.grey}}>
            Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"r
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.input}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map(key =>
          toDos[key].working ===working ? (<View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <TouchableOpacity onPress={()=> deleteToDo(key)}>
            <Fontisto name="trash" size={18} color={theme.toDoBg} />
            </TouchableOpacity>
          </View>)
          :
          null)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    fontSize:44,
    fontWeight:"600",
  },
  input:{
    backgroundColor:"white",
    paddingVertical: 15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:20,
    fontSize:18,
  },
  toDo:{
    backgroundColor:theme.grey,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius: 15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  toDoText:{
    color:"white",
    fontSize: 16,
    fontWeight:"500",
  },
});
