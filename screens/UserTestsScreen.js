import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Renk fonksiyonu (Normal= Mavi, Düşük= Kırmızı, Yüksek= Yeşil)
const getResultColor = (result) => {
  switch (result) {
    case 'Normal':
      return '#007BFF';
    case 'Düşük':
      return '#DC2626';
    case 'Yüksek':
      return '#16A34A';
    default:
      return '#374151';
  }
};

const UserTestsScreen = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Açılan test ID
  const [expandedTestId, setExpandedTestId] = useState(null);

  const toggleAccordion = (testId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTestId((prev) => (prev === testId ? null : testId));
  };

  const fetchUserTests = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Hata', 'Kullanıcı giriş yapmamış.');
        setLoading(false);
        return;
      }

      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('email', '==', currentUser.email));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        Alert.alert('Hata', 'Kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }

      const userData = userSnapshot.docs[0].data();
      const tcKimlikNo = userData.tcKimlikNo;

      const patientDocRef = doc(db, 'patients', tcKimlikNo);
      const testsCollection = collection(patientDocRef, 'tests');
      const testsSnapshot = await getDocs(testsCollection);

      const fetchedTests = testsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTests(fetchedTests);
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Tahliller alınırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTests();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tahlillerim</Text>
      {tests.length === 0 ? (
        <Text style={styles.noTestsText}>Henüz bir tahlil kaydı bulunmamaktadır.</Text>
      ) : (
        <FlatList
          data={tests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const testDate = item.createdAt.toDate().toLocaleDateString();
            const isExpanded = expandedTestId === item.id;

            return (
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleAccordion(item.id)}
                >
                  <Text style={styles.dateText}>Tarih: {testDate}</Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.accordionContent}>
                    {Object.keys(item.groupedResults).map((guideName) => (
                      <View key={guideName} style={styles.guideSection}>
                        <Text style={styles.guideName}>{guideName}</Text>
                        {item.groupedResults[guideName].map((result, index) => (
                          <Text
                            key={index}
                            style={[
                              styles.resultText,
                              { color: getResultColor(result.result) },
                            ]}
                          >
                            {result.testName}: {result.value} ({result.result})
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default UserTestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E8F5FF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTestsText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: 'gray',
  },
  accordionItem: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#007bff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  guideSection: {
    marginBottom: 8,
  },
  guideName: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  resultText: {
    marginLeft: 8,
  },
});
