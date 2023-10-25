import React from 'react';
import ModalSelector from 'react-native-modal-selector';
import { View, Text, StyleSheet } from 'react-native';
import enLocalization from '../localization/en.json';
import svLocalization from '../localization/sv.json';

type LanguageOption = {
  key: string;
  label: string;
};

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  const languageOptions: LanguageOption[] = [
    { key: 'en', label: 'English' },
    { key: 'sv', label: 'Svenska' },
  ];
  const localization = selectedLanguage === 'en' ? enLocalization : svLocalization;

  return (
    <View style={styles.container}>
      <Text>{localization.chooseLanguage}</Text>
      <ModalSelector
        data={languageOptions}
        initValue={selectedLanguage}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        onChange={(option) => onLanguageChange(option.key)}
      >
        <View style={styles.selectedLanguageContainer}>
          <Text style={styles.selectedLanguageText}>
            {selectedLanguage === 'en' ? localization.english : localization.swedish}
          </Text>
        </View>
      </ModalSelector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  selectedLanguageContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  selectedLanguageText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LanguageSelector;
