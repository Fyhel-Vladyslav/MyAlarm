import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions   } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');

export default function ({activeDates = {}, onChange = () => null}) {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState(activeDates);
  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  const handleDayPress = (day) => {
    const selected = { ...selectedDates };
    if (selected[day.dateString]) {
      delete selected[day.dateString];
    } else {
      selected[day.dateString] = { selected: true};
    }
    setSelectedDates(selected);
  };

  const handleSubmit = () => {
    onChange(selectedDates);
    setDatePickerVisible(false);
  };

  const handleDismiss = () => {
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDatePicker} style={styles.iconContainer}>
        <Ionicons name="calendar" size={24} color="black" />
      </TouchableOpacity>
      {isDatePickerVisible && (
          <View style={styles.window}>
            <Calendar
              markedDates={selectedDates}
              onDayPress={handleDayPress}
              enableSwipeMonths={true}
              style={styles.calendar}
            />
            <View style={styles.buttonContainer}> 
              <Button onPress={handleDismiss} title={'Dismiss'} />
              <Button fill={true} onPress={handleSubmit} title={'Submit'} />

            </View>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginBottom:60,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
  window: {
    zIndex: 3,
    width: width * 0.8,
    height: height * 0.6,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: width * 0.05,
    borderColor:"lightgray",
    borderWidth:1,
    paddingTop:10
  },
  calendar: {
    flex: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});