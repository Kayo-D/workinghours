import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, TextInput, Text, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LanguageSelector from './components/LocalizationButton';
import enLocalization from './localization/en.json';
import svLocalization from './localization/sv.json';
import { Image } from 'expo-image'

type RootStackParamList = {
  Home: undefined,
  Details: { markedDates: { [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string } } };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

function HomeScreen({ navigation }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const localization = selectedLanguage === 'en' ? enLocalization : svLocalization;
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    LocaleConfig.defaultLocale = selectedLanguage;
    setCalendarKey((prevKey) => prevKey + 1);
  }, [selectedLanguage]);

  LocaleConfig.defaultLocale = selectedLanguage;

  LocaleConfig.locales['en'] = {
    monthNames: [
      'January',
      'February',
      'Mars',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul.', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: "Today"
  };

  LocaleConfig.locales['sv'] = {
    monthNames: [
      'Januari',
      'Februari',
      'Mars',
      'April',
      'Maj',
      'Juni',
      'Juli',
      'Augusti',
      'September',
      'Oktober',
      'November',
      'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul.', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    dayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
    dayNamesShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
    today: "Idag"
  };

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
      <View>
        <Image
          source={require('./images/torestorpmaleri.png')}
          style={{ width: 400, height: 100 }}
        />
      </View>
      <Calendar
        style={{
          height: 400,
          width: 400,
        }}
        theme={{
          selectedDayTextColor: 'black',
          todayTextColor: 'black',
        }}
        key={calendarKey}
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
      <StatusBar style="auto" backgroundColor='white' />
      <TextInput
        placeholder={localization.hours}
        style={styles.hourInputContainer}
        keyboardType="numeric"
        onChangeText={(text) => setNumberInput(text)}
        value={numberInput}
      />
      <Button
        title={localization.addHours}
        onPress={handleButtonPress}
      />
      <Button
        title={localization.seeHoursWorked}
        onPress={() => navigation.navigate('Details', { markedDates })}
      />
      <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const markedDates = route.params.markedDates;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {Object.keys(markedDates).map((date) => {
        const dateInfo = markedDates[date];
        const currentDate = new Date(date);

        if (currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()) {
          return (
            <View key={date}>
              <Text>Date: {date}, Hours Worked: {dateInfo.hoursWorked || '0'}</Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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

export default App;
