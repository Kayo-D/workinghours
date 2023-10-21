import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button} from 'react-native';
import { Calendar } from 'react-native-calendars';

// Function to generate marked dates for every Saturday and Sunday
const generateMarkedDates = () => {
  const markedDates: { [date: string]: { selected: true; selectedColor: string } } = {};
  const startDate = new Date(2023, 0, 1); // January 1, 2023
  const endDate = new Date(2030, 11, 31); // December 31, 2030

  // Loop through dates and mark Saturdays and Sundays
  while (startDate <= endDate) {
    const dateString = startDate.toISOString().split('T')[0];
    const dayOfWeek = startDate.getDay(); // 0 for Sunday, 6 for Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      markedDates[dateString] = { selected: true, selectedColor: 'red' };
    }

    startDate.setDate(startDate.getDate() + 1); // Move to the next day
  }

  return markedDates;
};

// Generate the marked dates
const markedDates = generateMarkedDates();

// Function to handle the button press
const handleButtonPress = () => {
  // Add your button click logic here
  console.log('Button pressed');
};

export default function App() {
  return (
    <View style={styles.container}>
      <Calendar
        style={{
          height: 500,
          width: 400,
        }}
        markedDates={markedDates}
        firstDay={1}
      />
      <StatusBar style="auto" />

      <Button
        title="Create PDF"
        onPress={handleButtonPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
