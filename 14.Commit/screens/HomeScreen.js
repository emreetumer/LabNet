import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>LabNet</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoSection}>
          <Icon name="shield-check" size={40} color="#2E86C1" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.infoTitle}>IgA (İmmünoglobulin A)</Text>
            <Text style={styles.infoText}>
              Solunum yolları ve sindirim sistemini korur.
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Icon name="bacteria-outline" size={40} color="#28B463" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.infoTitle}>IgM (İmmünoglobulin M)</Text>
            <Text style={styles.infoText}>
              Enfeksiyonlara karşı vücudun ilk yanıtıdır.
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Icon name="dna" size={40} color="#AF7AC5" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.infoTitle}>IgG (İmmünoglobulin G)</Text>
            <Text style={styles.infoText}>
              Uzun süreli bağışıklık sağlar. IgG'nin alt grupları şunlardır:
            </Text>
          </View>
        </View>

        <View style={styles.subInfo}>
          <Text style={styles.subInfoTitle}>- IgG1:</Text>
          <Text style={styles.infoText}>Bakterilere ve virüslere karşı koruma sağlar.</Text>
        </View>
        <View style={styles.subInfo}>
          <Text style={styles.subInfoTitle}>- IgG2:</Text>
          <Text style={styles.infoText}>Kapsüllü bakterilere karşı etkilidir.</Text>
        </View>
        <View style={styles.subInfo}>
          <Text style={styles.subInfoTitle}>- IgG3:</Text>
          <Text style={styles.infoText}>Virüslere karşı güçlü bir bağışıklık tepkisi oluşturur.</Text>
        </View>
        <View style={styles.subInfo}>
          <Text style={styles.subInfoTitle}>- IgG4:</Text>
          <Text style={styles.infoText}>Alerjenlere karşı tolerans geliştirir.</Text>
        </View>

        <Text style={styles.note}>
          Bu sonuçlar yalnızca bilgi amaçlıdır. Tahlillerinizle ilgili yorumlar için doktorunuza danışın.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // İçeriği dikey eksende ortalamak
    alignItems: 'center', // Yatayda ortalamak
    backgroundColor: '#E8F5FF', // Sade bir arka plan rengi
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 24, // Başlık ile içerik arasında boşluk bırakıldı
  },
  content: {
    width: '100%',
    paddingBottom: 16,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  icon: {
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  infoText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
  },
  subInfo: {
    paddingLeft: 16,
    marginVertical: 4,
  },
  subInfoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  note: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
