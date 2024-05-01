// /* eslint-disable prettier/prettier */
// import React from 'react';
// import {StyleSheet, Text, TouchableOpacity} from 'react-native';
// import 'react-native-gesture-handler';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';

// import Home from './screens/Alarms';
// import Settings from './screens/Edit';
// import Ring from './screens/Ring';

// const Stack = createStackNavigator();

// export default function () {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Alarms"
//           component={Home}
//           options={params => ({
//             ...headerStyles,
//             title: 'Alarms',
//             headerRight: () => (
//               <AddButton
//                 title={'+ '}
//                 onPress={() => params.navigation.navigate('Edit')}
//               />
//             ),
//           })}
//         />
//         <Stack.Screen
//           name="Edit"
//           component={Settings}
//           options={{...headerStyles, title: 'Alarm'}}
//         />
//         <Stack.Screen
//           name="Ring"
//           component={Ring}
//           options={{headerShown: false}}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// function AddButton({title, onPress}) {
//   return (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={onPress}
//       underlayColor="#fff">
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// export const headerStyles = {
//   headerStyle: {
//     elevation: 0,
//   },
//   headerTintColor: '#000',
//   headerTitleStyle: {
//     fontWeight: 'bold',
//   },
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: 'transparent',
//     padding: 10,
//   },
//   buttonText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: 25,
//   },
// });
import React, { useState, useRef ,useCallback,useEffect} from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-record';
import { Audio } from 'expo-av';
import MicRecorder from "mic-recorder-to-mp3"
import Button from "./components/Button";
import RNFS from 'react-native-fs';

  const apiKey = "f17d209777f7463d92f4b113328e21cf";

  const headers = {
    'Authorization': 'f17d209777f7463d92f4b113328e21cf',
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked'
};
const uri = 'test.wav';
const App = () => {
  const recorder = useRef(null) //Recorder
  const audioPlayer = useRef(null) //Ref for the HTML Audio Tag
  const [blobURL, setBlobUrl] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recording = useRef(null);
  const sound = useRef(null);


  const [uploadURL, setUploadURL] = useState("")
  const [transcriptID, setTranscriptID] = useState("")
  const [transcriptData, setTranscriptData] = useState("")
  const [transcript, setTranscript] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("da");
      console.log(transcriptData);
      if (transcriptData.status !== "completed" && isLoading) {
        checkStatusHandler();
        console.log("1");
      } else {
        console.log("2");
        setIsLoading(false)
        setTranscript(transcriptData.text)
        console.log(transcriptData.text);
        clearInterval(interval)
      }
    }, 10000)
    return () => clearInterval(interval)
  },)
  const handleClick = useCallback(() => {
    submitTranscriptionHandler();
}, []); // Dependencies should be added if any variable inside the function is used

  useEffect(() => {
    //Declares the recorder object and stores it inside of ref
    recorder.current = new MicRecorder({ bitRate: 128 })
  }, [])

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      recording.current = new Audio.Recording();
      await recording.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.current.startAsync();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.current.stopAndUnloadAsync();
      setIsRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const startPlaying = async () => {
    try {
      const { sound: audioSound } = await recording.current.createNewLoadedSoundAsync(
        { isLooping: false },
        status => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      );
      sound.current = audioSound;
      await sound.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopPlaying = async () => {
    try {
      if (sound.current) {
        await sound.current.stopAsync();
      }
      setIsPlaying(false);
    } catch (error) {
      console.error(error);
    }
  };
  


  useEffect(() => {
    if (audioFile) {
      
      fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: headers,
        body: audioFile
    })
    .then(response => response.json())
    .then(data => {
      console.log("Dasasdas")
        setUploadURL(data.upload_url);
        setTranscriptID(data.id);
    })
    .catch(error => console.error(error));
    }
  }, [audioFile])

  // Submit the Upload URL to AssemblyAI and retrieve the Transcript ID
  const submitTranscriptionHandler = async () => {

    console.log("sumbm");    

    const wavData = RNFS.readFile(uri, 'base64');

    console.log("wavData");
    console.log(wavData);
    fetch('https://api.assemblyai.com/v2/transcript', {
      method: "POST",
      headers: {
        authorization: apiKey,
        "content-type": "application/json",
        "transfer-encoding": "chunked",
      },
      body: JSON.stringify({
        audio_data: wavData
      })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(data.id);
    console.log("data.id");

      setTranscriptID(data.id);
  })
  .catch(error => console.error(error));
  }

  // Check the status of the Transcript
  const checkStatusHandler = async () => {
    setIsLoading(true)
    try {
      await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptID}`, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)

      console.log("transcriptID")
      console.log(transcriptID)

        setTranscriptData(data);
    })
    .catch(error => console.error(error));

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <View>
      <Text>React Speech Recognition App</Text>
      
      <TouchableOpacity onPress={handleClick}>
            <Text>Press Me</Text>
        </TouchableOpacity>
          
      {transcriptData.status === "completed" ? (
        <Text>{transcript}</Text>
      ) : (
        <Text>{transcriptData.status}</Text>
      )}
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
        <Text style={styles.button}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={isPlaying ? stopPlaying : startPlaying}>
        <Text>{isPlaying ? 'Stop Playing' : 'Start Playing'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
const styles = StyleSheet.create({

  button: {
    display: 'flex',
    margin:100,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});