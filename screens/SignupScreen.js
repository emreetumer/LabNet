import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !surname || !tcKimlikNo || !dob || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun!');
      return;
    }

    if (tcKimlikNo.length !== 11 || isNaN(tcKimlikNo)) {
      Alert.alert('Hata', 'TC Kimlik No 11 rakamdan oluşmalıdır!');
      return;
    }

    const dobRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dobRegex.test(dob)) {
      Alert.alert('Hata', 'Doğum tarihi GG.AA.YYYY formatında olmalıdır!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor. Lütfen tekrar deneyin.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı Firestore'da kaydedilirken rol atanır
      await setDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        tcKimlikNo,
        dob,
        email,
        role: 'user', // Varsayılan olarak user rolü atanıyor
        createdAt: new Date(),
      });

      Alert.alert('Başarılı', 'Kayıt başarılı!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleDobChange = (text) => {
    if (text.length === 2 || text.length === 5) {
      text += '.';
    }
    setDob(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="science" size={120} color="#1ABC9C" />
      </View>
      <Text style={styles.title}>LabNet</Text>
      <TextInput
        style={styles.input}
        placeholder="Ad"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        placeholderTextColor="#aaa"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="TC Kimlik No"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={11}
        value={tcKimlikNo}
        onChangeText={setTcKimlikNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Doğum Tarihi (GG.AA.YYYY)"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        maxLength={10}
        value={dob}
        onChangeText={handleDobChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Adresi"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
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
      <TextInput
        style={styles.input}
        placeholder="Şifre (Yeniden)"
        secureTextEntry={true}
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Hesabınız var mı? Giriş yapın</Text>
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
    borderRadius: 8,
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

export default SignupScreen;
