import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firebase yapılandırman
import kılavuzVerileri from '../klavuzVerileri.json'; // JSON dosyan

const GuideScreen = () => {
  const uploadGuidesToFirestore = async () => {
    try {
      const guides = kılavuzVerileri.guides;

      for (const guide of guides) {
        // 1. Kılavuzu rastgele ID ile ekle
        const guideRef = await addDoc(collection(db, 'guides'), {
          description: guide.description,
          unit: guide.unit,
          name: guide.name, // Kılavuz adı, rastgele ID'li belge içinde alan olarak saklanır
        });

        // 2. Tests alt koleksiyonunu oluştur ve rastgele ID ile ekle
        for (const test of guide.testTypes) {
          const testRef = await addDoc(collection(guideRef, 'tests'), {
            name: test.name, // Test adı, rastgele ID'li belge içinde alan olarak saklanır
          });

          // 3. AgeGroups alt koleksiyonunu oluştur ve rastgele ID ile ekle
          for (const ageGroup of test.ageGroups) {
            await addDoc(collection(testRef, 'ageGroups'), {
              ageRange: ageGroup.ageRange,
              minValue: ageGroup.minValue,
              maxValue: ageGroup.maxValue,
            });
          }
        }
      }

      Alert.alert('Başarılı', 'Kılavuzlar başarıyla Firestore’a yüklendi!');
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Kılavuzlar yüklenirken bir sorun oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz</Text>

      {/* Kılavuzları Yükle Butonu */}
      <TouchableOpacity style={styles.loadButton} onPress={uploadGuidesToFirestore}>
        <Text style={styles.buttonText}>Kılavuzları Yükle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#34495E',
  },
  loadButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuideScreen;
