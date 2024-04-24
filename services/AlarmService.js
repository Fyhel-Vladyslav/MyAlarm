import AsyncStorage from "@react-native-async-storage/async-storage";
import { todayString } from "react-native-calendars/src/expandableCalendar/commons";

export default class AlarmService {
  constructor() {
    // You can initialize any properties or do setup here
  }

  async set(alarm) {
    try {
      const existingAlarmsString = await AsyncStorage.getItem('alarms');
      let existingAlarms = existingAlarmsString ? JSON.parse(existingAlarmsString) : [];

      existingAlarms.push(alarm);

      await AsyncStorage.setItem('alarms', JSON.stringify(existingAlarms));
    } catch (error) {
      console.error('Error saving alarms: ', error);
    }
  }

  async getAll() {
    try {
      const existingAlarmsString = await AsyncStorage.getItem('alarms');
      const existingAlarms = existingAlarmsString ? JSON.parse(existingAlarmsString) : {};
      alarmsArray = Object.values(existingAlarms);
      // Return the array of alarms
      return alarmsArray;
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return [];
    }
  }

  async getState(){
    try {
      await this.fetchAlarms();
      const jsonAlarms = await this.getAll();
      if (jsonAlarms !== null) {
        const activeAlarm = jsonAlarms.find(element => element.active === true);
        if (activeAlarm) {
          return activeAlarm.uid
        }
      };
    } catch (error) {
      console.error('Error loading alarms: ', error);
    }
  }

  // async getState(){
  //   try {
  //     const jsonAlarms = getAll();

  //     jsonAlarms.forEach(element => {
  //       if(element.active == true)
  //         return element;
  //     });
  //   } catch (error) {
  //     console.error('Error loading alarms: ', error);
  //   }
  // }

  async fetchAlarms(){
    try {
      existingAlarms = await this.getAll();
      const hour = new Date().getHours();
      const minutes = new Date().getMinutes();
      let isChanged = false;
      existingAlarms.forEach(element => {
        if(element.enabled === true)
        if(element.hour == hour && element.minutes == minutes)
        {
          if(element.dates!={} || element.repeating)
          {
          if(element.repeating)
          {
            today = new Date().getDay();
            today = today===6?0:today+1;
            if(element.days.includes(today ))
            {
              element.active = true;
              isChanged = true;
            }
          }
          if(element.dates!={})
          {
            const date = new Date();
            const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; 
            
            if ( Object.keys(element.dates).some(date => date.includes(today)))  
            {
              element.active = true;
              isChanged = true;
            }
          }
        }
          else
          {
            element.active = true;
            isChanged = true;
          }
       }
      })
      if(isChanged)
            await AsyncStorage.setItem('alarms', JSON.stringify(existingAlarms));
          
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return null; 
    }
  }

  async get(uid){
    try {
      const existingAlarmsString = await AsyncStorage.getItem('alarms');
      const existingAlarms = existingAlarmsString ? JSON.parse(existingAlarmsString) : {};
      if (existingAlarms !== null) {
        return existingAlarms.find(p=>p.uid==uid);
        }
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return null; 
    }
  }

  async remove(uid){
    try {
      const existingAlarmsString = await AsyncStorage.getItem('alarms');
      existingAlarms = existingAlarmsString ? JSON.parse(existingAlarmsString) : {};
      
      if (existingAlarms !== null) {
        existingAlarms = existingAlarms.filter(element => element.uid !== uid);
        await AsyncStorage.setItem('alarms', JSON.stringify(existingAlarms));
      }
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return null; 
    }
  }

  async update(alarm){
    try {
      const existingAlarmsString = await AsyncStorage.getItem('alarms');
      const existingAlarms = existingAlarmsString ? JSON.parse(existingAlarmsString) : {};
      
      const alarmsArray = Object.values(existingAlarms);
      const index = alarmsArray.findIndex(p => p.uid === alarm.uid);
    if (index !== -1) {
      alarmsArray[index] = alarm;
      await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
    } else {
      console.error('Alarm not found for update.');
    }
      return alarmsArray;
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return [];
    }
  }

  async enable(uid) {
    try {
      let alarmsArray = await this.getAll();
      const index = alarmsArray.findIndex(p => p.uid === uid);
      if (index !== -1) {
        // Update the local state of enabled immediately
        alarmsArray[index].enabled = true;
        await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
        return true; // Return true indicating success
      } else {
        console.error('Alarm not found for update.');
        return false; // Return false indicating failure
      }
    } catch (error) {
      console.error('Error enabling alarm: ', error);
      return false; // Return false indicating failure
    }
  }
  
  async disable(uid) {
    try {
      let alarmsArray = await this.getAll();
      const index = alarmsArray.findIndex(p => p.uid === uid);
      if (index !== -1) {
        // Update the local state of enabled immediately
        alarmsArray[index].enabled = false;
        await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
        return true; // Return true indicating success
      } else {
        console.error('Alarm not found for update.');
        return false; // Return false indicating failure
      }
    } catch (error) {
      console.error('Error disabling alarm: ', error);
      return false; // Return false indicating failure
    }
  }
  // disableAll() {
  //   return {
  //     ...this,
  //     days: toAndroidDays(this.days),
  //   };
  // }
  async continueA() {
    try {
      alarmsArray = await this.getAll();
      const index = alarmsArray.findIndex(p => p.active === true);
      if (index !== -1) {
        alarmsArray[index].active = false;
        await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
      } else {
        console.error('Alarm not found for update.');
      }
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return null; 
    }
  }
  async stop() {
    try {
      alarmsArray = await this.getAll();
      const index = alarmsArray.findIndex(p => p.active === true);
      if (index !== -1) {
        alarmsArray[index].active = false;
        alarmsArray[index].enabled = false;
        await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
      } else {
        console.error('Alarm not found for update.');
      }
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return null; 
    }
  }

  async snooze() {
    try {
      alarmsArray = await this.getAll();
      const index = alarmsArray.findIndex(p => p.active === true);

      if (index !== -1) {
        alarmsArray[index].active = false;
        if(alarmsArray[index].minutes >54)
        {
        alarmsArray[index].hours = alarmsArray[index].hours==23?0:alarmsArray[index].hours;
        alarmsArray[index].minutes =(alarmsArray[index].minutes -55);
        }
        else
        alarmsArray[index].minutes =  alarmsArray[index].minutes+5;
        await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
      } else {
        console.error('Alarm not found for update.');
      }
    } catch (error) {
      console.error('Error loading alarms: ', error);
      return null; 
    }
  }

}
