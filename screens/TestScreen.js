import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
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
      return '#007BFF';
    case 'Düşük':
      return '#DC2626';
    case 'Yüksek':
      return '#16A34A';
    default:
      return '#374151';
  }
};

// Karşılaştırma (Same) için gri örnek
const getComparisonColor = (comparison) => {
  switch (comparison) {
    case 'Yüksek':
      return '#16A34A'; // Yeşil
    case 'Düşük':
      return '#DC2626'; // Kırmızı
    case 'Same':
      return '#6B7280'; // Gri
    default:
      return '#374151';
  }
};

const TestScreen = () => {
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [ayBilgisi, setAyBilgisi] = useState(null);
  const [testValues, setTestValues] = useState({
    IgA: '',
    IgM: '',
    IgG: '',
    IgG1: '',
    IgG2: '',
    IgG3: '',
    IgG4: '',
  });
  const [groupedResults, setGroupedResults] = useState({});
  const [existingTests, setExistingTests] = useState([]);
  const [expandedTests, setExpandedTests] = useState({});
  const [comparisonResults, setComparisonResults] = useState({});
  const [comparisonExpanded, setComparisonExpanded] = useState(false);
  const [allGuides, setAllGuides] = useState([]);

  // Yaş aralığı parse helper
  const parseAgeRange = (ageRange) => {
    if (!ageRange) return { min: 0, max: 0 };

    if (ageRange.includes('+')) {
      const min = parseInt(ageRange.split('+')[0], 10);
      return { min, max: Infinity };
    }

    const parts = ageRange.split('-').map((part) => part.trim());
    if (parts.length !== 2) {
      return { min: null, max: null };
    }

    const min = parseInt(parts[0], 10);
    const max = parseInt(parts[1], 10);
    return { min: isNaN(min) ? null : min, max: isNaN(max) ? null : max };
  };

  // Tüm kılavuzları çek
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
          testTypes.push({ name: testData.name, ageGroups });
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
      Alert.alert('Hata', 'Kılavuzlar alınırken bir sorun oluştu.');
    }
  };

  useEffect(() => {
    fetchAllGuides();
  }, []);

  // Hasta doc oluştur/çek
  const getOrCreatePatientDoc = async (tc) => {
    const patientRef = doc(db, 'patients', tc);
    const patientSnap = await getDoc(patientRef);

    if (!patientSnap.exists()) {
      // kullanıcı verisi
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('tcKimlikNo', '==', tc));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        throw new Error('Kullanıcı bulunamadı.');
      }

      await setDoc(patientRef, {
        tcKimlikNo: tc,
        createdAt: new Date(),
      });
    }

    return patientRef;
  };

  // Mevcut testleri çek
  const fetchExistingTests = async (patientRef) => {
    const testsCollection = collection(patientRef, 'tests');
    const testsSnapshot = await getDocs(query(testsCollection, orderBy('createdAt', 'desc')));
    const tests = [];
    testsSnapshot.forEach((doc) => {
      tests.push({ id: doc.id, ...doc.data() });
    });
    setExistingTests(tests);
  };

  // Önceki test ile karşılaştırma
  const compareWithPreviousTest = (newTest, previousTest) => {
    const comparison = {};
    if (!previousTest) return comparison;

    Object.keys(newTest.groupedResults).forEach((guideName) => {
      if (!previousTest.groupedResults[guideName]) return;

      comparison[guideName] = {};

      newTest.groupedResults[guideName].forEach((newItem) => {
        const prevItem = previousTest.groupedResults[guideName].find(
          (item) => item.testName === newItem.testName
        );
        if (prevItem) {
          let comparisonResult = 'Same';
          if (newItem.value > prevItem.value) {
            comparisonResult = 'Yüksek';
          } else if (newItem.value < prevItem.value) {
            comparisonResult = 'Düşük';
          }
          comparison[guideName][newItem.testName] = comparisonResult;
        }
      });
    });
    return comparison;
  };

  const handleTcKimlikKontrol = async () => {
    if (!tcKimlikNo) {
      Alert.alert('Hata', 'Lütfen bir TC Kimlik No giriniz.');
      return;
    }

    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('tcKimlikNo', '==', tcKimlikNo));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert('Hata', 'Bu TC Kimlik Numarasına sahip kullanıcı bulunamadı.');
        setAyBilgisi(null);
        setExistingTests([]);
        return;
      }

      const user = snapshot.docs[0].data();
      const dobParts = user.dob.split('.');
      const dob = new Date(dobParts[2], dobParts[1] - 1, dobParts[0]);
      const now = new Date();
      const yearDiff = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      const totalMonths = yearDiff * 12 + monthDiff;

      setAyBilgisi(totalMonths);
      Alert.alert('Başarılı', `Kullanıcı bulundu! Ay Bilgisi: ${totalMonths} ay.`);

      // patient doc ve testler
      const patientRef = await getOrCreatePatientDoc(tcKimlikNo);
      await fetchExistingTests(patientRef);
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'TC Kimlik kontrolü sırasında bir sorun oluştu.');
    }
  };

  const handleTestValueChange = (name, value) => {
    setTestValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTahlilKaydet = async () => {
    if (!ayBilgisi) {
      Alert.alert('Hata', 'Lütfen önce TC Kimlik No kontrolü yapınız.');
      return;
    }

    const groupedResultsTemp = {};

    // Her test için kılavuz kontrolleri
    Object.keys(testValues).forEach((testName) => {
      const rawTestValue = testValues[testName];
      const testValue = parseFloat(rawTestValue);
      if (rawTestValue === '' || isNaN(testValue)) return;

      allGuides.forEach((guide) => {
        const testType = guide.testTypes.find((type) => type.name === testName);
        if (testType) {
          let testValueInMgL = testValue;
          if (guide.unit === 'g/L') {
            testValueInMgL = testValue * 1000;
          }
          testType.ageGroups.forEach((ageGroup) => {
            const { ageRange, minValue, maxValue } = ageGroup;
            const { min, max } = parseAgeRange(ageRange);
            if (min === null || max === null) return;

            if (ayBilgisi >= min && (max ? ayBilgisi <= max : true)) {
              let convertedMin = minValue;
              let convertedMax = maxValue;
              if (guide.unit === 'g/L') {
                convertedMin = minValue * 1000;
                convertedMax = maxValue * 1000;
              }

              let result = 'Normal';
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

    try {
      const patientRef = doc(db, 'patients', tcKimlikNo);
      const testsCollection = collection(patientRef, 'tests');

      const newTestData = {
        ayBilgisi,
        testValues,
        groupedResults: groupedResultsTemp,
        createdAt: new Date(),
      };

      await addDoc(testsCollection, newTestData);
      Alert.alert('Başarılı', 'Tahlil kaydedildi ve sonuçlar oluşturuldu.');

      // Mevcut testleri güncelle
      await fetchExistingTests(patientRef);

      // Karşılaştırma
      if (existingTests.length > 0) {
        const previousTest = existingTests[0]; 
        const comparison = compareWithPreviousTest(newTestData, previousTest);
        setComparisonResults(comparison);
      } else {
        setComparisonResults({});
      }

      // Form temizle
      setTestValues({
        IgA: '',
        IgM: '',
        IgG: '',
        IgG1: '',
        IgG2: '',
        IgG3: '',
        IgG4: '',
      });
      setComparisonExpanded(false);
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Tahlil kaydedilirken bir sorun oluştu.');
    }
  };

  // Mevcut test aç/kapa
  const toggleTestExpansion = (testId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  // Karşılaştırma aç/kapa
  const toggleComparisonExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setComparisonExpanded((prev) => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Tahlil Ekle</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={fetchAllGuides}>
          <MaterialIcons name="refresh" size={24} color="#1ABC9C" />
          <Text style={styles.refreshText}>Yenile</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="TC Kimlik No Giriniz"
          value={tcKimlikNo}
          onChangeText={setTcKimlikNo}
          keyboardType="numeric"
        />
        <Button title="Kontrol Et" onPress={handleTcKimlikKontrol} />

        {ayBilgisi !== null && (
          <>
            <Text style={styles.infoLabel}>Kaç Aylık: {ayBilgisi} ay</Text>

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

            <Button title="Tahlili Kaydet" onPress={handleTahlilKaydet} />
          </>
        )}

        {/* Karşılaştırma Sonuçları */}
        {Object.keys(comparisonResults).length > 0 && (
          <View style={styles.comparisonSection}>
            <TouchableOpacity onPress={toggleComparisonExpansion} style={styles.comparisonHeader}>
              <Text style={styles.comparisonTitle}>Son Test ile Karşılaştırma</Text>
              <Text style={styles.expandIcon}>{comparisonExpanded ? '-' : '+'}</Text>
            </TouchableOpacity>

            {comparisonExpanded && (
              <View style={styles.comparisonContainer}>
                {Object.keys(comparisonResults).map((guideName) => (
                  <View key={guideName} style={styles.guideContainer}>
                    <Text style={styles.guideTitle}>{guideName} için sonuçlar</Text>
                    {Object.keys(comparisonResults[guideName]).map((testName, index) => {
                      const comparison = comparisonResults[guideName][testName];
                      const currentItem = groupedResults[guideName].find(
                        (item) => item.testName === testName
                      );
                      const currentResult = currentItem?.result || 'Normal';
                      const currentValue = currentItem?.value || 0;

                      return (
                        <View key={index} style={styles.comparisonItem}>
                          <Text
                            style={[
                              styles.resultText,
                              { color: getResultColor(currentResult) },
                            ]}
                          >
                            {testName}: {currentResult} ({currentValue} mg/L)
                          </Text>

                          {comparison === 'Same' ? (
                            <View style={styles.sameLine} />
                          ) : (
                            <Text
                              style={[
                                styles.comparisonIndicator,
                                { color: getComparisonColor(comparison) },
                              ]}
                            >
                              {comparison}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Mevcut Testler */}
        {existingTests.length > 0 && (
          <View style={styles.existingTestsContainer}>
            <Text style={styles.existingTestsTitle}>Mevcut Testler</Text>
            {existingTests
              .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()) 
              .map((test) => (
                <TouchableOpacity
                  key={test.id}
                  onPress={() => toggleTestExpansion(test.id)}
                  style={styles.testItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.testHeader}>
                    <Text style={styles.testDate}>
                      Test Tarihi: {test.createdAt.toDate().toLocaleDateString()}
                    </Text>
                    <Text style={styles.expandIcon}>
                      {expandedTests[test.id] ? '-' : '+'}
                    </Text>
                  </View>
                  {expandedTests[test.id] && (
                    <View style={styles.testDetails}>
                      {Object.keys(test.groupedResults).map((guideName) => (
                        <View key={guideName} style={styles.guideContainer}>
                          <Text style={styles.guideTitle}>{guideName} için sonuçlar</Text>
                          {test.groupedResults[guideName].map((item, index) => (
                            <Text
                              key={index}
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
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TestScreen;

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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    color: '#1F2937',
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  refreshText: {
    color: '#1ABC9C',
    fontSize: 16,
    marginLeft: 5,
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
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
    color: '#4B5563',
  },
  existingTestsContainer: {
    marginTop: 30,
  },
  existingTestsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1F2937',
    textAlign: 'center',
  },
  testItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  expandIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563EB',
  },
  testDetails: {
    marginTop: 15,
  },
  guideContainer: {
    marginTop: 10,
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
  comparisonSection: {
    marginTop: 30,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
  },
  expandIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#92400E',
  },
  comparisonContainer: {
    marginTop: 15,
  },
  comparisonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 10,
  },
  comparisonIndicator: {
    fontSize: 20,
    fontWeight: '700',
  },
  sameLine: {
    width: 30,
    height: 2,
    backgroundColor: '#6B7280', // Gri
    borderRadius: 1,
  },
});
