import { Modal } from "react-native";
import { BlurView } from 'expo-blur';
import React from 'react';
import { Text, View } from 'react-native';

interface AlertWithBlurProps {
    isAlertVisible: boolean;
    hideAlert: () => void;
}

function AlertWithBlur({ isAlertVisible, hideAlert }: AlertWithBlurProps) {
    return (
        <Modal transparent visible={isAlertVisible}>
            <BlurView
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                tint="light"
                intensity={30}
            >
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Error:</Text>
                    <Text>Please enter a number between 1 and 24.</Text>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text
                            onPress={() => {
                                hideAlert();
                            }}
                            style={{ fontSize: 16, fontWeight: 'bold', color: 'blue' }}
                        >
                            Cancel
                        </Text>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

export default AlertWithBlur;
