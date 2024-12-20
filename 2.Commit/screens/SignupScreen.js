import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Boş alan kontrolü
    if (!tcKimlikNo || !dob || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun!');
      return;
    }

    // TC Kimlik No kontrolü
    if (tcKimlikNo.length !== 11 || isNaN(tcKimlikNo)) {
      Alert.alert('Hata', 'TC Kimlik No 11 rakamdan oluşmalıdır!');
      return;
    }

    // Doğum tarihi formatı kontrolü
    const dobRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dobRegex.test(dob)) {
      Alert.alert('Hata', 'Doğum tarihi GG.AA.YYYY formatında olmalıdır!');
      return;
    }

    // Şifre uyuşmazlığı kontrolü
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor. Lütfen tekrar deneyin.');
      return;
    }

    Alert.alert('Başarılı', 'Kayıt başarılı!');
  };

  const handleDobChange = (text) => {
    // Doğum tarihi formatlama: GG.AA.YYYY
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
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    backgroundColor: '#1ABC9C',
    width: '90%',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
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
