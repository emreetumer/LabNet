// screens/CreateGuideScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  TextInput, 
  ScrollView 
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const CreateGuideScreen = ({ navigation }) => {
  const [guideName, setGuideName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [testTypes, setTestTypes] = useState([]);

  // Fonksiyonlar
  const addTestType = () => {
    setTestTypes([...testTypes, { name: '', ageGroups: [] }]);
  };

  const removeTestType = (index) => {
    const updatedTestTypes = testTypes.filter((_, i) => i !== index);
    setTestTypes(updatedTestTypes);
  };

  const updateTestTypeName = (index, name) => {
    const updatedTestTypes = [...testTypes];
    updatedTestTypes[index].name = name;
    setTestTypes(updatedTestTypes);
  };

  const addAgeGroup = (testIndex) => {
    const updatedTestTypes = [...testTypes];
    updatedTestTypes[testIndex].ageGroups.push({ ageRange: '', minValue: '', maxValue: '' });
    setTestTypes(updatedTestTypes);
  };

  const removeAgeGroup = (testIndex, ageIndex) => {
    const updatedTestTypes = [...testTypes];
    updatedTestTypes[testIndex].ageGroups = updatedTestTypes[testIndex].ageGroups.filter((_, i) => i !== ageIndex);
    setTestTypes(updatedTestTypes);
  };

  const updateAgeGroup = (testIndex, ageIndex, field, value) => {
    const updatedTestTypes = [...testTypes];
    updatedTestTypes[testIndex].ageGroups[ageIndex][field] = value;
    setTestTypes(updatedTestTypes);
  };

  const handleSubmit = async () => {
    if (!guideName || !description || !unit) {
      Alert.alert('Hata', 'Lütfen tüm kılavuz bilgilerini doldurun.');
      return;
    }

    if (testTypes.length === 0) {
      Alert.alert('Hata', 'En az bir test türü ekleyin.');
      return;
    }

    for (let i = 0; i < testTypes.length; i++) {
      if (!testTypes[i].name) {
        Alert.alert('Hata', `Test türü ${i + 1} için isim girin.`);
        return;
      }
      if (testTypes[i].ageGroups.length === 0) {
        Alert.alert('Hata', `Test türü ${i + 1} için en az bir yaş grubu ekleyin.`);
        return;
      }
      for (let j = 0; j < testTypes[i].ageGroups.length; j++) {
        const ageGroup = testTypes[i].ageGroups[j];
        if (!ageGroup.ageRange || !ageGroup.minValue || !ageGroup.maxValue) {
          Alert.alert('Hata', `Test türü ${i + 1}, Yaş grubu ${j + 1} için tüm alanları doldurun.`);
          return;
        }
      }
    }

    try {
      // Kılavuzu Firestore'a ekle
      const guideRef = await addDoc(collection(db, 'guides'), {
        name: guideName,
        description,
        unit,
      });

      // Test türlerini ekle
      for (const test of testTypes) {
        const testRef = await addDoc(collection(guideRef, 'tests'), {
          name: test.name,
        });

        // Yaş gruplarını ekle
        for (const ageGroup of test.ageGroups) {
          await addDoc(collection(testRef, 'ageGroups'), {
            ageRange: ageGroup.ageRange,
            minValue: parseFloat(ageGroup.minValue),
            maxValue: parseFloat(ageGroup.maxValue),
          });
        }
      }

      Alert.alert('Başarılı', 'Kılavuz başarıyla oluşturuldu!');
      navigation.goBack();
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Kılavuz oluşturulurken bir sorun oluştu.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Yeni Kılavuz Oluştur</Text>

      {/* Kılavuz Adı */}
      <TextInput
        style={styles.input}
        placeholder="Kılavuz Adı"
        value={guideName}
        onChangeText={setGuideName}
      />

      {/* Kılavuz Açıklaması */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Açıklama"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Birim */}
      <TextInput
        style={styles.input}
        placeholder="Birim (Örneğin: g/L)"
        value={unit}
        onChangeText={setUnit}
      />

      {/* Test Türleri */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Test Türleri</Text>
        <TouchableOpacity onPress={addTestType}>
          <MaterialIcons name="add" size={24} color="#1ABC9C" />
        </TouchableOpacity>
      </View>

      {testTypes.map((test, testIndex) => (
        <View key={testIndex} style={styles.testTypeContainer}>
          <View style={styles.testTypeHeader}>
            <Text style={styles.testTypeTitle}>Test Türü {testIndex + 1}</Text>
            <TouchableOpacity onPress={() => removeTestType(testIndex)}>
              <MaterialIcons name="delete" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>

          {/* Test Türü Adı */}
          <TextInput
            style={styles.input}
            placeholder="Test Türü Adı"
            value={test.name}
            onChangeText={(text) => updateTestTypeName(testIndex, text)}
          />

          {/* Yaş Grupları */}
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Yaş Grupları</Text>
            <TouchableOpacity onPress={() => addAgeGroup(testIndex)}>
              <MaterialIcons name="add" size={24} color="#1ABC9C" />
            </TouchableOpacity>
          </View>

          {test.ageGroups.map((ageGroup, ageIndex) => (
            <View key={ageIndex} style={styles.ageGroupContainer}>
              <Text style={styles.ageGroupTitle}>Yaş Grubu {ageIndex + 1}</Text>
              <View style={styles.ageGroupInputs}>
                <TextInput
                  style={[styles.input, styles.verticalInput]}
                  placeholder="Yaş Aralığı (Örneğin: 0-1)"
                  value={ageGroup.ageRange}
                  onChangeText={(text) => updateAgeGroup(testIndex, ageIndex, 'ageRange', text)}
                />
                <TextInput
                  style={[styles.input, styles.verticalInput]}
                  placeholder="Min Değer"
                  keyboardType="numeric"
                  value={ageGroup.minValue}
                  onChangeText={(text) => updateAgeGroup(testIndex, ageIndex, 'minValue', text)}
                />
                <TextInput
                  style={[styles.input, styles.verticalInput]}
                  placeholder="Max Değer"
                  keyboardType="numeric"
                  value={ageGroup.maxValue}
                  onChangeText={(text) => updateAgeGroup(testIndex, ageIndex, 'maxValue', text)}
                />
              </View>
              <TouchableOpacity onPress={() => removeAgeGroup(testIndex, ageIndex)}>
                <MaterialIcons name="delete" size={20} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}

      {/* Gönder Butonu */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <MaterialIcons name="save" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F0F4F7',
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2C3E50',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  testTypeContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  testTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  testTypeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
  },
  subSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495E',
  },
  ageGroupContainer: {
    width: '100%',
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'column', // Değiştirildi
    alignItems: 'flex-start', // Değiştirildi
    justifyContent: 'flex-start', // Değiştirildi
  },
  ageGroupTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 5, // Boşluk eklendi
  },
  ageGroupInputs: {
    flexDirection: 'column', // Yan yana yerine alt alta
    alignItems: 'flex-start',
    width: '100%', // Tam genişlik
  },
  verticalInput: {
    width: '100%', // Tam genişlik
    marginBottom: 10, // Aralarına boşluk
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#1ABC9C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
    justifyContent: 'center',
    elevation: 3, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    // İkon ve metin arasına boşluk bırakmak için
  },
});

export default CreateGuideScreen;
