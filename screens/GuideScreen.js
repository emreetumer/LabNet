// screens/GuideScreen.js

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; // Firebase yapılandırmasını ve auth'u import et
import kılavuzVerileri from '../klavuzVerileri.json'; // JSON dosyanızı import et
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons'; // İkonlar için

const GuideScreen = ({ navigation }) => { // navigation prop eklenmiş
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Başarılı', 'Başarıyla çıkış yaptınız.');
      navigation.replace('Login'); // LoginScreen'e yönlendirme ve navigasyon yığınını temizleme
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>Kılavuz Ve Ayarlar</Text>

      {/* Kılavuzları Yükle Butonu */}
      <TouchableOpacity style={styles.loadButton} onPress={uploadGuidesToFirestore}>
        <MaterialIcons name="cloud-upload" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Kılavuzları Yükle</Text>
      </TouchableOpacity>

      {/* Kılavuz Oluştur Butonu */}
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateGuide')}>
        <MaterialIcons name="create" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Kılavuz Oluştur</Text>
      </TouchableOpacity>

      {/* Çıkış Yap Butonu */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#E8F5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 40,
    color: '#2C3E50',
  },
  loadButton: {
    flexDirection: 'row',
    backgroundColor: '#1ABC9C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    elevation: 3, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#3498DB',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    elevation: 3, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    elevation: 3, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoutButton: {
    backgroundColor: '#E74C3C', // Çıkış butonu için kırmızı renk
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

export default GuideScreen;
