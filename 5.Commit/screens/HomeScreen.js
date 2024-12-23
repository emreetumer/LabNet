import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // Firebase yapılandırma dosyasını import ediyoruz
import { signOut } from 'firebase/auth'; // Kullanıcı çıkışı yapma fonksiyonu

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kullanıcının oturum açıp açmadığını kontrol etme
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Kullanıcı giriş yapmışsa kullanıcıyı state'e atıyoruz
      } else {
        setUser(null); // Kullanıcı çıkmışsa null yapıyoruz
        navigation.navigate('Login'); // Kullanıcı çıkış yaparsa login sayfasına yönlendiriyoruz
      }
    });

    return () => unsubscribe(); // Component unmount olduğunda dinleyiciyi temizliyoruz
  }, [navigation]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Çıkış Yapıldı', 'Başarıyla çıkış yaptınız.');
      })
      .catch((error) => {
        Alert.alert('Hata', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Hoşgeldiniz, {user.email}</Text>
          <Button title="Çıkış Yap" onPress={handleSignOut} />
        </>
      ) : (
        <Text style={styles.title}>Yükleniyor...</Text>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 20,
  },
});

export default HomeScreen;
