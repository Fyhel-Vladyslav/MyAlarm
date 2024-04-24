/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import {getAlarm, snoozeAlarm, stopAlarm, continueAlarm} from '../alarm';
import Button from '../components/Button';
import {colors, globalStyles} from '../global';
import { Audio } from 'expo-av';
import { soundURIs } from '../raw/soundURIs' 
export default function ({route, navigation}) {
  const [alarm, setAlarm] = useState(null);
  const [soundObject, setSoundObject] = useState(null);
   
  useEffect(() => {
    const alarmUid = route.params.alarmUid;
    async function fetchAlarm() {
      const myAlarm = await getAlarm(alarmUid);
      //myAlarm.minutes = myAlarm.minutes==0?59:myAlarm.minutes-1;
      setAlarm(myAlarm);
      playSound(myAlarm);
    }
    fetchAlarm();
  }, []);

  async function playSound(myAlarm) {
    let soundName = Object.keys(soundURIs)[0];
    if (myAlarm !== null && myAlarm.soundName) {
      soundName = myAlarm.soundName;
    }
    const { sound } = await Audio.Sound.createAsync(soundURIs[soundName]);
    setSoundObject(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [soundObject]);
  if (!alarm) {
    return <View />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.innerContainer, styles.container]}>
        <View style={styles.textContainer}>
          <Text style={styles.clockText}>
            {alarm.getTimeString().hour} : {alarm.getTimeString().minutes}
          </Text>
          <Text style={styles.title}>{alarm.title}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={'Snooze'}
            onPress={async () => {
              await snoozeAlarm();
              navigation.goBack();
            }}
          />
          <Button
            title={'Stop'}
            onPress={async () => {
              await stopAlarm();
              navigation.goBack();
            }}
          />
       {Object.keys(alarm.dates).length !== 0 || alarm.repeating ? (
    <Button
      title={'Continue'}
      onPress={async () => {
        await continueAlarm();
        navigation.goBack();
      }}
    />
  ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  clockText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
  },
  textContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.GREY,
  },
});
