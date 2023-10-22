import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, TextInput, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function App() {
  const [numberInput, setNumberInput] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{
    [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string };
  }>({});

  // Initialize marked dates with default colors
  const initializeMarkedDates = () => {
    const markedDatesData: {
      [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string };
    } = {};
    const startDate = new Date(2023, 0, 1); // January 1, 2023
    const endDate = new Date(2030, 11, 31); // December 31, 2030

    while (startDate <= endDate) {
      const dateString = startDate.toISOString().split('T')[0];
      const dayOfWeek = startDate.getDay(); // 0 for Sunday, 6 for Saturday

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        markedDatesData[dateString] = { marked: true, selected: false, selectedColor: 'lightblue', dotColor: 'red' };
      } else {
        markedDatesData[dateString] = { marked: true, selected: false, selectedColor: 'lightblue', dotColor: 'yellow' };
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    return markedDatesData;
  };

  useEffect(() => {
    const initialMarkedDates = initializeMarkedDates();
    setMarkedDates(initialMarkedDates);
  }, []); // Run this effect only once when the component mounts

  const handleButtonPress = () => {
    const hoursWorked = parseInt(numberInput, 10);
    if (!isNaN(hoursWorked) && hoursWorked >= 1 && hoursWorked <= 24) {
      for (const date in markedDates) {
        if (markedDates[date].selected) {
          markedDates[date].hoursWorked = hoursWorked;
          markedDates[date].marked = true;
          markedDates[date].dotColor = 'green';
        }
      }
      setNumberInput('');
      setMarkedDates({ ...markedDates });
    } else {
      alert('Please enter a number between 1 and 24.');
    }
  };

  // Function to determine the background color of a date on the calendar
  const getCalendarBackgroundColor = (dateInfo: { marked: boolean; selected: boolean; hoursWorked?: number; dotColor?: string }) => {
    if (dateInfo.selected) {
      return 'lightblue';
    } else if (dateInfo.hoursWorked) {
      return 'green';
    }
    return 'yellow';
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Calendar
        style={{
          height: 400,
          width: 400,
        }}
        theme={{
          selectedDayTextColor: 'black',
          todayTextColor: 'black',
        }}
        markedDates={markedDates}
        firstDay={1}
        hideExtraDays={true}
        onDayPress={(day) => {
          const dateStr = day.dateString;
          if (markedDates[dateStr]) {
            markedDates[dateStr].selected = !markedDates[dateStr].selected;
          } else {
            markedDates[dateStr] = {
              marked: false,
              selected: true,
              selectedColor: 'lightblue',
            };
          }
          setMarkedDates({ ...markedDates });
        }}
        // Custom rendering of calendar dates
        renderDay={(day: { year: number; month: number; day: number }, dateInfo: { marked: boolean; selected: boolean; hoursWorked?: number; dotColor?: string }) => (
          <View style={{ backgroundColor: getCalendarBackgroundColor(dateInfo), padding: 5 }}>
            <Text style={{ textAlign: 'center', color: 'black' }}>{day.day}</Text>
            {dateInfo.dotColor && <Text style={{ color: dateInfo.dotColor }}>•</Text>}
          </View>
        )}
      />
      <StatusBar style="auto" />
      <TextInput
        placeholder='Hours'
        style={styles.hourInputContainer}
        keyboardType="numeric"
        onChangeText={(text) => setNumberInput(text)}
        value={numberInput}
      />
      <Button
        title="Add Hours"
        onPress={handleButtonPress}
      />
      <Button
        title="See hours worked for this month"
        onPress={handleButtonPress}
      />
      {Object.keys(markedDates).map((date) => {
        const dateInfo = markedDates[date];
        const currentDate = new Date(date);

        // Check if the current date is in the same month as the current date displayed on the calendar
        if (currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()) {
          return (
            <View key={date}>
              <Text>
                Date: {date}, Hours Worked: {dateInfo.hoursWorked || '0'}
              </Text>
            </View>
          );
        }

        // Return null for dates that are not in the current month
        return null;
      })}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourInputContainer: {
    borderWidth: 1,
    width: 100,
    height: 40,
  }
});
