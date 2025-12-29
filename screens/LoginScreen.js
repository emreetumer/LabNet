import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig'; // Firebase modüllerini import et
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      console.log('❌ Boş alan var');
      return;
    }

    console.log('🔄 Giriş deneniyor:', email);

    try {
      // Firebase Authentication ile giriş
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Auth başarılı! User ID:', user.uid);

      // Kullanıcının rolünü almak için Firestore sorgusu
      const userDocRef = doc(db, 'users', user.uid);
      console.log('🔍 Firestore sorgusu yapılıyor...');

      const userDoc = await getDoc(userDocRef);
      console.log('📄 Firestore dökümanı:', userDoc.exists() ? 'BULUNDU' : 'BULUNAMADI');

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('👤 Kullanıcı verisi:', userData);
        console.log('🎭 Rol:', userData.role);

        // Kullanıcı rolüne göre yönlendirme
        if (userData.role === 'admin') {
          console.log('➡️ Admin sayfasına yönlendiriliyor...');
          navigation.navigate('Admin'); // Admin navigasyonu
        } else if (userData.role === 'user') {
          console.log('➡️ User sayfasına yönlendiriliyor...');
          navigation.navigate('User'); // User navigasyonu
        } else {
          console.log('❌ Rol tanımlı değil:', userData.role);
          Alert.alert('Hata', 'Rol bilgisi tanımlı değil.');
        }
      } else {
        console.log('❌ Firestore dökümanı bulunamadı!');
        Alert.alert('Hata', 'Kullanıcı bilgileri bulunamadı.');
      }
    } catch (error) {
      console.log('❌ HATA:', error.code, error.message);
      Alert.alert('Giriş Hatası', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="science" size={120} color="#1ABC9C" />
      </View>
      <Text style={styles.title}>LabNet</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Adresi"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry={true}
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Kayıt olmak ister misiniz?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FBFC',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#1ABC9C',
    width: '50%',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#3498DB',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
