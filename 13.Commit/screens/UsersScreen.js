import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(app);
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        surname: doc.data().surname,
        tcKimlikNo: doc.data().tcKimlikNo,
        dob: doc.data().dob,
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5FF',
    paddingVertical: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#3498DB',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
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
});

export default UsersScreen;
