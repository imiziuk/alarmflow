// libraries
import React from 'react';

import {
    useState,
    useEffect
} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';


// local
import SOUND from "./Sound.tsx"
import {
  SECOND
} from "./Time.tsx"


// FUNCTIONS
function check_time(current_time: Date, alarm_time: Date): boolean {
  let CT: Date = current_time;    // current time
  let AT: Date = alarm_time;      // alarm time

  // alarm should go off when both times match
  if(CT.getHours() === AT.getHours()){
      if(CT.getMinutes() === AT.getMinutes()){
          return true;
      }
  }

  // the alarm should NOT go off when they are different
  return false;
}



// MAIN APP
export default function App() {
  const [alarmTime, setAlarmTime]   = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [alarmSet, setAlarmSet]     = useState(false);


  // setup alarm sound
  let alarm_sound = new SOUND("mgs_codec.mp3");


  // main loop, check every second
  useEffect(() => {
  const interval = setInterval(() => {
    if (!alarmTime || !alarmSet) return;

    const now = new Date();
    if (check_time(now, alarmTime) == true) {
      // play alarm
      alarm_sound.play();

      Alert.alert(
        // messages
        "Wake up!!!",
        "",
        // buttons
        [
          {
            text: "OK",
            onPress: () => {
              // stop alarm
              console.log("DEBUG] Alert - 'OK' pressed");
              alarm_sound.stop();
            }
          },
          {
            text: "SNOOZE",
            onPress: () => {
              // stop alarm
              console.log("DEBUG] Alert - 'SNOOZE' pressed");
              alarm_sound.stop();
            }
          }
        ],
        // options
        { cancelable: false }
      );
      setAlarmSet(false);
    }
  }, SECOND);

    return () => clearInterval(interval);
  }, [alarmTime, alarmSet]);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setAlarmTime(selectedDate);
      setAlarmSet(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Alarm App
      </Text>

      <Button title="Set Alarm" onPress={() => setShowPicker(true)}/>

      {alarmTime && (
        <Text style={styles.time}>
          Alarm set for:
          {alarmTime.toLocaleTimeString()}
        </Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    marginBottom: 20,
  },

  time: {
    fontSize: 20,
    marginTop: 20,
  },
});