import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  signOut 
} from 'firebase/auth';

const UserSettingsScreen = ({ navigation }) => { // navigation prop eklenmiş
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Şifre güncelleme için state değişkenleri
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            Alert.alert('Hata', 'Kullanıcı verisi bulunamadı.');
          }
        }
      } catch (error) {
        Alert.alert('Hata', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Hata', 'Tüm şifre alanlarını doldurun.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Hata', 'Yeni şifreler uyuşmuyor.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    setPasswordUpdating(true);

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        // Kullanıcının mevcut şifresi ile kimlik doğrulaması yapma
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Şifreyi güncelleme
        await updatePassword(user, newPassword);

        Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.');

        // Şifre alanlarını temizleme
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        Alert.alert('Hata', 'Kullanıcı bilgisi alınamadı.');
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setPasswordUpdating(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ABC9C" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData ? (
        <>
          <Text style={styles.header}>Kullanıcı Bilgileri</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Ad:</Text>
            <Text style={styles.value}>{userData.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Soyad:</Text>
            <Text style={styles.value}>{userData.surname}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>TC Kimlik No:</Text>
            <Text style={styles.value}>{userData.tcKimlikNo}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Doğum Tarihi:</Text>
            <Text style={styles.value}>{userData.dob}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>

          <Text style={styles.header}>Şifre Güncelle</Text>
          <TextInput
            style={styles.input}
            placeholder="Mevcut Şifre"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Yeni Şifre"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Yeni Şifre (Tekrar)"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handlePasswordUpdate} 
            disabled={passwordUpdating}
          >
            {passwordUpdating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
            )}
          </TouchableOpacity>

          {/* Çıkış Yap Butonu */}
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Kullanıcı bilgileri yüklenemedi.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#E8F5FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495E',
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    width: 150,
    color: '#2C3E50',
  },
  value: {
    color: '#2C3E50',
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#1ABC9C',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#E74C3C', // Kırmızı renk
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserSettingsScreen;
