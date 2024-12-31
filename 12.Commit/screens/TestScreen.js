import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import klavuzVerileri from '../klavuzVerileri.json';

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

    Object.keys(testValues).forEach((testName) => {
      const testValue = parseFloat(testValues[testName]);

      if (!testValue) return;

      klavuzVerileri.guides.forEach((guide) => {
        const testType = guide.testTypes.find((type) => type.name === testName);
        if (testType) {
          const ageGroup = testType.ageGroups.find((group) => {
            const [min, max] = group.ageRange.split('-').map(Number);
            return ayBilgisi >= min && (max ? ayBilgisi <= max : true);
          });

          if (ageGroup) {
            const { minValue, maxValue } = ageGroup;
            let result = 'Normal';

            if (testValue < minValue) result = 'Altında';
            else if (testValue > maxValue) result = 'Yüksek';

            if (!groupedResultsTemp[guide.name]) {
              groupedResultsTemp[guide.name] = [];
            }

            groupedResultsTemp[guide.name].push({
              testName,
              result,
              value: testValue,
              minValue,
              maxValue,
            });
          }
        }
      });
    });

    setGroupedResults(groupedResultsTemp);

    try {
      await addDoc(collection(db, 'patients'), {
        tcKimlikNo,
        ayBilgisi,
        testValues,
        groupedResults: groupedResultsTemp,
        createdAt: new Date(),
      });
      Alert.alert('Başarılı', 'Tahlil kaydedildi ve sonuçlar oluşturuldu.');
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Tahlil kaydedilirken bir sorun oluştu.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Tahlil Ekle</Text>

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

        {Object.keys(groupedResults).map((guideName) => (
          <View key={guideName} style={styles.guideContainer}>
            <Text style={styles.guideTitle}>{guideName} için sonuçlar</Text>
            {groupedResults[guideName].map((item, index) => (
              <Text key={index} style={styles.resultText}>
                {item.testName}: {item.result} ({item.value} girdi, {item.minValue} - {item.maxValue})
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#E8F5FF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495E',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#3498DB',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  guideContainer: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#34495E',
  },
  resultText: {
    fontSize: 14,
    color: '#2C3E50',
    marginVertical: 2,
  },
});

export default TestScreen;
