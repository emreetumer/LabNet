import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
} from 'firebase/firestore';
import { app } from '../firebaseConfig';

// Android için LayoutAnimation
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

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  
  // Hangi kullanıcının test tarihlerini gösteriyoruz?
  const [expandedUser, setExpandedUser] = useState(null);
  
  // Hangi test ID'si (2. seviye) açık?
  // (testItem.testId değerini tutacak)
  const [expandedTestId, setExpandedTestId] = useState(null);

  // Her bir kullanıcı(TC) için testlerini cache'liyoruz
  const [userTests, setUserTests] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(app);
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  // 1. Seviye Aç/Kapa (Kullanıcı)
  const handleUserPress = async (tcKimlikNo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Aynı kullanıcıya basılırsa kapat
    if (expandedUser === tcKimlikNo) {
      setExpandedUser(null);
      setExpandedTestId(null); // İkinci seviye de kapansın
      return;
    }

    setExpandedUser(tcKimlikNo);
    setExpandedTestId(null); // Yeni kullanıcıya geçince test açılmasın

    // Daha önce çektiysek tekrar çekmeye gerek yok
    if (userTests[tcKimlikNo]) {
      return;
    }

    try {
      const db = getFirestore(app);
      const patientDocRef = doc(db, 'patients', tcKimlikNo);
      const testsCollection = collection(patientDocRef, 'tests');
      const testsSnapshot = await getDocs(testsCollection);

      const fetchedTests = testsSnapshot.docs.map((testDoc) => ({
        testId: testDoc.id,
        ...testDoc.data(),
      }));

      // testleri tarihe göre sıralayalım (en yeni üste)
      fetchedTests.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || 0;
        const dateB = b.createdAt?.toDate() || 0;
        return dateB - dateA; // büyük olan (yeni) öne
      });

      setUserTests((prev) => ({
        ...prev,
        [tcKimlikNo]: fetchedTests,
      }));
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  // 2. Seviye Aç/Kapa (Test)
  const handleTestPress = (testId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Aynı test ID'ye tıklarsak kapat
    if (expandedTestId === testId) {
      setExpandedTestId(null);
    } else {
      setExpandedTestId(testId);
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedUser === item.tcKimlikNo;

    return (
      <View style={styles.userCard}>
        {/* Kullanıcı Başlık */}
        <TouchableOpacity onPress={() => handleUserPress(item.tcKimlikNo)}>
          <Text style={styles.userName}>
            {item.name} {item.surname}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>TC Kimlik No:</Text>
            <Text style={styles.value}>{item.tcKimlikNo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Doğum Tarihi:</Text>
            <Text style={styles.value}>{item.dob}</Text>
          </View>
        </TouchableOpacity>

        {/* Kullanıcının test tarihleri listesi */}
        {isExpanded && (
          <View style={styles.testsContainer}>
            {userTests[item.tcKimlikNo] && userTests[item.tcKimlikNo].length > 0 ? (
              userTests[item.tcKimlikNo].map((testItem) => {
                const testDate = testItem.createdAt
                  ? testItem.createdAt.toDate().toLocaleDateString()
                  : 'Tarih Yok';

                const testExpanded = expandedTestId === testItem.testId;

                return (
                  <View key={testItem.testId} style={styles.testCard}>
                    {/* Test Tarihi Başlığı */}
                    <TouchableOpacity
                      style={styles.testHeader}
                      onPress={() => handleTestPress(testItem.testId)}
                    >
                      <Text style={styles.testDateText}>Tahlil Tarihi: {testDate}</Text>
                    </TouchableOpacity>

                    {/* İkinci seviye açıldığında sonuçları göster */}
                    {testExpanded && (
                      <View style={styles.testDetailsContainer}>
                        {Object.keys(testItem.groupedResults).map((guideName) => (
                          <View key={guideName} style={styles.guideSection}>
                            <Text style={styles.guideTitle}>{guideName}</Text>
                            {testItem.groupedResults[guideName].map((res, idx) => (
                              <Text
                                key={idx}
                                style={[
                                  styles.resultText,
                                  { color: getResultColor(res.result) },
                                ]}
                              >
                                {res.testName}: {res.value} ({res.result})
                              </Text>
                            ))}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.noTestsLabel}>
                Kullanıcının test kaydı bulunamadı.
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Kullanıcılar</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5FF',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
    color: '#2C3E50',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#3498DB',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    width: 120,
  },
  value: {
    fontSize: 14,
    color: '#2C3E50',
  },
  testsContainer: {
    marginTop: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 10,
  },
  testCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    // Gölge efekti
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  testHeader: {
    backgroundColor: '#007BFF',
    padding: 10,
  },
  testDateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  testDetailsContainer: {
    padding: 10,
    backgroundColor: '#FAFAFA',
  },
  guideSection: {
    marginBottom: 8,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 13,
    marginLeft: 10,
  },
  noTestsLabel: {
    fontStyle: 'italic',
    color: '#777',
  },
});
