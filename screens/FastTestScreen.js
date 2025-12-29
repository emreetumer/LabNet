import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

// Android için LayoutAnimation'ı etkinleştir
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Renk fonksiyonu (Normal= Mavi, Düşük= Kırmızı, Yüksek= Yeşil)
const getResultColor = (result) => {
  switch (result) {
    case 'Normal':
      return '#007BFF'; // Mavi
    case 'Düşük':
      return '#DC2626'; // Kırmızı
    case 'Yüksek':
      return '#16A34A'; // Yeşil
    default:
      return '#374151'; // Varsayılan gri
  }
};

// Yaş aralığı parse helper
const parseAgeRange = (ageRange) => {
  if (!ageRange) return { min: 0, max: 0 };

  if (ageRange.includes('+')) {
    const min = parseInt(ageRange.split('+')[0], 10);
    return { min, max: Infinity };
  }

  const parts = ageRange.split('-').map((part) => part.trim());
  if (parts.length !== 2) {
    // "Cord" vb. durumlar
    return { min: null, max: null };
  }

  const min = parseInt(parts[0], 10);
  const max = parseInt(parts[1], 10);

  return {
    min: isNaN(min) ? null : min,
    max: isNaN(max) ? null : max,
  };
};

const FastTestScreen = () => {
  const [birthDate, setBirthDate] = useState('');
  const [monthsOld, setMonthsOld] = useState(null);
  const [testValues, setTestValues] = useState({
    IgA: '',
    IgM: '',
    IgG: '',
    IgG1: '',
    IgG2: '',
    IgG3: '',
    IgG4: '',
  });
  const [allGuides, setAllGuides] = useState([]); 
  const [groupedResults, setGroupedResults] = useState({}); 

  // Firestore'dan guides koleksiyonunu çek
  const fetchAllGuides = async () => {
    try {
      const guidesSnapshot = await getDocs(collection(db, 'guides'));
      const guides = [];

      for (const guideDoc of guidesSnapshot.docs) {
        const guideData = guideDoc.data();
        const testsSnapshot = await getDocs(collection(guideDoc.ref, 'tests'));
        const testTypes = [];

        for (const testDoc of testsSnapshot.docs) {
          const testData = testDoc.data();
          const ageGroupsSnapshot = await getDocs(collection(testDoc.ref, 'ageGroups'));
          const ageGroups = ageGroupsSnapshot.docs.map((ageDoc) => ageDoc.data());

          testTypes.push({
            name: testData.name,
            ageGroups,
          });
        }

        guides.push({
          name: guideData.name,
          description: guideData.description,
          unit: guideData.unit,
          testTypes,
        });
      }

      setAllGuides(guides);
      console.log('Tüm Kılavuzlar:', guides);
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Kılavuzlar çekilirken bir sorun oluştu.');
    }
  };

  useEffect(() => {
    fetchAllGuides();
  }, []);

  // Girilen doğum tarihine göre kaç aylık
  const calculateMonths = () => {
    if (!birthDate) {
      Alert.alert('Uyarı', 'Lütfen doğum tarihi giriniz (GG.AA.YYYY).');
      return;
    }
    try {
      const [day, month, year] = birthDate.split('.');
      const dob = new Date(+year, +month - 1, +day);
      const now = new Date();

      const yearDiff = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;

      setMonthsOld(totalMonths);
    } catch (error) {
      Alert.alert('Hata', 'Doğum tarihi formatı yanlış olabilir. (GG.AA.YYYY)');
    }
  };

  // Test value change
  const handleTestValueChange = (testName, value) => {
    setTestValues((prev) => ({
      ...prev,
      [testName]: value,
    }));
  };

  // Hesapla butonu
  const handleCalculate = () => {
    if (monthsOld === null) {
      Alert.alert('Uyarı', 'Lütfen önce doğum tarihini girip kaç aylık olduğunu hesaplayınız.');
      return;
    }

    const groupedResultsTemp = {};

    Object.keys(testValues).forEach((testName) => {
      const rawValue = testValues[testName];
      const numericValue = parseFloat(rawValue);
      if (rawValue === '' || isNaN(numericValue)) return;

      allGuides.forEach((guide) => {
        const testType = guide.testTypes.find((t) => t.name === testName);
        if (testType) {
          let testValueInMgL = numericValue;
          if (guide.unit === 'g/L') {
            testValueInMgL = numericValue * 1000; // g/L -> mg/L
          }

          testType.ageGroups.forEach((ageGroup) => {
            const { ageRange, minValue, maxValue } = ageGroup;
            const { min, max } = parseAgeRange(ageRange);

            if (min === null || max === null) return;
            if (monthsOld >= min && (max ? monthsOld <= max : true)) {
              let convertedMin = minValue;
              let convertedMax = maxValue;
              if (guide.unit === 'g/L') {
                convertedMin = minValue * 1000;
                convertedMax = maxValue * 1000;
              }

              let result = 'Normal'; // Varsayılan
              if (testValueInMgL < convertedMin) result = 'Düşük'; 
              else if (testValueInMgL > convertedMax) result = 'Yüksek';

              if (!groupedResultsTemp[guide.name]) {
                groupedResultsTemp[guide.name] = [];
              }
              groupedResultsTemp[guide.name].push({
                testName,
                result,
                value: testValueInMgL,
                minValue: convertedMin,
                maxValue: convertedMax,
              });
            }
          });
        }
      });
    });

    setGroupedResults(groupedResultsTemp);
  };

  const [expanded, setExpanded] = useState(false);
  const toggleExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Hızlı Test Ekranı</Text>

        <TextInput
          style={styles.input}
          placeholder="Doğum Tarihi (GG.AA.YYYY)"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <Button title="Kaç Aylık Gör" onPress={calculateMonths} />

        {monthsOld !== null && (
          <Text style={styles.infoLabel}>Kaç Aylık: {monthsOld} ay</Text>
        )}

        {Object.keys(testValues).map((testName) => (
          <TextInput
            key={testName}
            style={styles.input}
            placeholder={`${testName} Değerini Giriniz`}
            value={testValues[testName]}
            onChangeText={(value) => handleTestValueChange(testName, value)}
            keyboardType="numeric"
          />
        ))}

        <Button title="Sonuçları Gör" onPress={handleCalculate} />

        {Object.keys(groupedResults).length > 0 && (
          <View style={styles.resultsContainer}>
            <TouchableOpacity onPress={toggleExpansion} style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Sonuçlar</Text>
              <Text style={styles.expandIcon}>{expanded ? '-' : '+'}</Text>
            </TouchableOpacity>
            {expanded && (
              <View style={styles.resultsContent}>
                {Object.keys(groupedResults).map((guideName) => (
                  <View key={guideName} style={styles.guideContainer}>
                    <Text style={styles.guideTitle}>{guideName}</Text>
                    {groupedResults[guideName].map((item, idx) => (
                      <Text
                        key={idx}
                        style={[
                          styles.resultText,
                          { color: getResultColor(item.result) },
                        ]}
                      >
                        {item.testName}: {item.result} ({item.value} mg/L, 
                        min: {item.minValue}, max: {item.maxValue})
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default FastTestScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: '#E8F5FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#1F2937',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#374151',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
    color: '#4B5563',
  },
  resultsContainer: {
    marginTop: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
  },
  expandIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#92400E',
  },
  resultsContent: {
    marginTop: 15,
  },
  guideContainer: {
    marginVertical: 10,
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1F2937',
  },
  resultText: {
    fontSize: 14,
    marginVertical: 2,
  },
});
