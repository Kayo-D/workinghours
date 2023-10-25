import { View, Text} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type RootStackParamList = {
    Home: undefined,
    Details: { markedDates: { [date: string]: { marked: boolean; selected: boolean; selectedColor: string; hoursWorked?: number; dotColor?: string } } };
};

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

export default DetailsScreen;