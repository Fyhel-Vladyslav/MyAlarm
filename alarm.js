/* eslint-disable prettier/prettier */
import AlarmService from './services/AlarmService';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const _AlarmService = new AlarmService()

export async function scheduleAlarm(alarm) {
  if (!(alarm instanceof Alarm)) {
    alarm = new Alarm(alarm);
  }
  try {
    await _AlarmService.set(alarm.toAndroid());
  } catch (e) {
    console.log(e);
  }
}

export async function enableAlarm(uid) {
  try {
    await _AlarmService.enable(uid);
  } catch (e) {
    console.log(e);
  }
}

export async function disableAlarm(uid) {
  try {
    await _AlarmService.disable(uid);
  } catch (e) {
    console.log(e);
  }
}

export async function stopAlarm() {
  try {
    await _AlarmService.stop();
  } catch (e) {
    console.log(e);
  }
}

export async function snoozeAlarm() {
  try {
    await _AlarmService.snooze();
  } catch (e) {
    console.log(e);
  }
}

export async function removeAlarm(uid) {
  try {
    await _AlarmService.remove(uid);
  } catch (e) {
    console.log(e);
  }
}

export async function updateAlarm(alarm) {
  if (!(alarm instanceof Alarm)) {
    alarm = new Alarm(alarm);
  }
  try {
    await _AlarmService.update(alarm.toAndroid());
  } catch (e) {
    console.log(e);
  }
}

export async function removeAllAlarms() {
  try {
    await _AlarmService.removeAll();
  } catch (e) {
    console.log(e);
  }
}

export async function getAllAlarms() {
  try {
    const alarms = await _AlarmService.getAll();
    return alarms.map(a => Alarm.fromAndroid(a));
  } catch (e) {
    console.log(e);
  }
}

export async function getAlarm(uid) {
  try {
    const alarm = await _AlarmService.get(uid);
    return Alarm.fromAndroid(alarm);
  } catch (e) {
    console.log(e);
  }
}

export async function getAlarmState() {
  try {
    return _AlarmService.getState();
  } catch (e) {
    console.log(e);
  }
}

export default class Alarm {
  constructor(params = null) {
    this.uid = getParam(params, 'uid', uuidv4());
    this.enabled = getParam(params, 'enabled', true);
    this.title = getParam(params, 'title', 'Alarm');
    this.description = getParam(params, 'description', 'Wake up');
    this.hour = getParam(params, 'hour', new Date().getMinutes()==59?new Date().getHours()+1:new Date().getHours());
    this.minutes = getParam(params, 'minutes', new Date().getMinutes()==59?0:new Date().getMinutes()+1);
    this.snoozeInterval = getParam(params, 'snoozeInterval', 1);
    this.repeating = getParam(params, 'repeating', false);
    this.active = getParam(params, 'active', false);
    this.days = this.repeating?getParam(params, 'days', []):[];
  }

  static getEmpty() {
    return new Alarm({
      title: '',
      description: '',
      hour: 0,
      minutes: 0,
      repeating: false,
      days: [],
    });
  }

  toAndroid() {
    return {
      ...this,
      days: toAndroidDays(this.days),
    };
  }

  static fromAndroid(alarm) {
    if (typeof alarm !== 'undefined' && alarm !== null) {
    alarm.days = fromAndroidDays(alarm.days);
    return new Alarm(alarm);
    }
    return new Alarm();
  }

  getTimeString() {
    const hour = this.hour < 10 ? '0' + this.hour : this.hour;
    const minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
    return {hour, minutes};
  }

  getTime() {
    const timeDate = new Date();
    timeDate.setMinutes(this.minutes);
    timeDate.setHours(this.hour);
    return timeDate;
  }
}

function getParam(param, key, defaultValue) {
  try {
    if (param && (param[key] !== null || param[key] !== undefined)) {
      return param[key];
    } else {
      return defaultValue;
    }
  } catch (e) {
    return defaultValue;
  }
}

export function toAndroidDays(daysArray) {
  return daysArray.map(day => (day + 1) % 7);
}

export function fromAndroidDays(daysArray) {
  return daysArray.map(d => (d === 0 ? 6 : d - 1));
}
