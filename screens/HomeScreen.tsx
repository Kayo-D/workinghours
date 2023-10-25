import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';
import LanguageSelector from '../components/LocalizationButton';
import enLocalization from '../localization/en.json';
import svLocalization from '../localization/sv.json';
import { Image } from 'expo-image'
import AlertWithBlur from '../components/AlertWithBlur'
import * as Localization from 'expo-localization';

type RootStackParamList = {
    Home: undefined,
    Details: { markedDates: { [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string } } };
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: ProfileScreenNavigationProp;
};


function HomeScreen({ navigation }: Props) {
    const deviceLanguage = Localization.locale;
    const isSwedish = deviceLanguage.startsWith('sv');
    const [selectedLanguage, setSelectedLanguage] = useState(isSwedish ? 'sv' : 'en');
    const localization = selectedLanguage === 'en' ? enLocalization : svLocalization;
    const [calendarKey, setCalendarKey] = useState(0);
    const [errorFlag, setErrorFlag] = useState(false);
    const [numberInput, setNumberInput] = useState<string>('');
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState<{
        [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string };
    }>({});
    LocaleConfig.defaultLocale = selectedLanguage;

    const initializeMarkedDates = () => {
        const markedDatesData: {
            [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string };
        } = {};
        const startDate = new Date(2023, 0, 1);
        const endDate = new Date(2030, 11, 31);

        while (startDate <= endDate) {
            const dateString = startDate.toISOString().split('T')[0];
            const dayOfWeek = startDate.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                markedDatesData[dateString] = { marked: true, selected: false, selectedColor: 'lightblue', dotColor: 'red' };
            } else {
                markedDatesData[dateString] = { marked: true, selected: false, selectedColor: 'lightblue', dotColor: 'yellow' };
            }

            startDate.setDate(startDate.getDate() + 1);
        }

        return markedDatesData;
    };

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
            showAlert();
            setErrorFlag(true);
        }
    };

    const getCalendarBackgroundColor = (dateInfo: { marked: boolean; selected: boolean; hoursWorked?: number; dotColor?: string }) => {
        if (dateInfo.selected) {
            return 'lightblue';
        } else if (dateInfo.hoursWorked) {
            return 'green';
        }
        return 'yellow';
    };

    const showAlert = () => {
        setAlertVisible(true);
    }

    const hideAlert = () => {
        setAlertVisible(false);
    }

    useEffect(() => {
        const initialMarkedDates = initializeMarkedDates();
        LocaleConfig.defaultLocale = selectedLanguage;
        setCalendarKey((prevKey) => prevKey + 1);
        setMarkedDates(initialMarkedDates);
        if (errorFlag) {
            setErrorFlag(false);
        }
    }, [selectedLanguage, errorFlag]);

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

    return (
        <View style={styles.container}>
            <AlertWithBlur isAlertVisible={isAlertVisible} hideAlert={hideAlert} />
            <View>
                <Image source={require('../images/torestorpmaleri.png')} style={{ width: 400, height: 100 }}/>
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
            <Button title={localization.addHours} onPress={handleButtonPress} />
            <Button title={localization.seeHoursWorked} onPress={() => navigation.navigate('Details', { markedDates })} />
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hourInputContainer: {
        borderWidth: 1,
        width: 100,
        height: 40,
    },
});

export default HomeScreen;