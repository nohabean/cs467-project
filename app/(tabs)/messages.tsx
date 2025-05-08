import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import NotFoundScreen from '../+not-found';

const placeholderThreads = [
  { id: '1', name: 'Alice Johnson', message: 'Is the laptop still available?', date: '2025-04-23T18:00:00Z', pinned: false },
  { id: '2', name: 'Bob Smith', message: 'I’ll take the sofa, how much for shipping?', date: '2025-04-22T14:30:00Z', pinned: false },
  { id: '3', name: 'Charlie Nguyen', message: 'Do you accept PayPal for the camera?', date: '2025-04-20T09:15:00Z', pinned: false },
  { id: '4', name: 'Dana Lopez', message: 'Is the bike in good condition? Can I pick it up today?', date: '2025-04-21T10:00:00Z', pinned: false },
  { id: '5', name: 'Evan Walker', message: 'Will you sell the table for $50?', date: '2025-04-19T17:45:00Z', pinned: false },
];

// all warnings to be corrected when linking to actual DB
export default function MessagesScreen() {
  const [threads, setThreads] = useState(placeholderThreads);
  const [messageSearch, setMessageSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [renameInput, setRenameInput] = useState('');
  const router = useRouter();

  const filteredThreads = threads
    .filter(t => t.name.toLowerCase().includes(messageSearch.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? new Date(b.date) - new Date(a.date) : a.pinned ? -1 : 1)); 

  const openModal = (thread) => {
    setSelectedThread(thread);
    setRenameInput(thread.name);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedThread(null);
    setRenameInput('');
  };

  const handleRename = () => {
    if (selectedThread) {
      setThreads(prev =>
        prev.map(t => (t.id === selectedThread.id ? { ...t, name: renameInput } : t))
      );
      closeModal();
    }
  };

  const handleTogglePin = () => {
    if (selectedThread) {
      setThreads(prev =>
        prev.map(t => (t.id === selectedThread.id ? { ...t, pinned: !t.pinned } : t))
      );
      closeModal();
    }
  };

  const handleDelete = () => {
    if (selectedThread) {
      setThreads(prev => prev.filter(t => t.id !== selectedThread.id));
      closeModal();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/messages/${item.id}?name=${item.name}`)}>
      <View style={[styles.item, item.pinned && styles.pinned]}>
        <View style={styles.messageAvatar}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(w => w[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity onPress={() => openModal(item)}>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor="#aaa"
            style={styles.messageSearch}
            value={messageSearch}
            onChangeText={setMessageSearch}
          />
          <FlatList
            data={filteredThreads}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
  
          {modalVisible && (
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modal}>
                    <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                      <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Manage Thread</Text>
                    {selectedThread && (
                      <>
                        <Text style={styles.modalThreadName}>{selectedThread.name}</Text>
                        <TextInput
                          style={styles.modalInput}
                          value={renameInput}
                          onChangeText={setRenameInput}
                          placeholder="New name"
                        />
                        <View style={styles.modalActions}>
                          <TouchableOpacity onPress={handleRename}>
                            <Text style={[styles.modalButton, styles.bold]}>Save</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.modalActions}>
                          <TouchableOpacity onPress={handleTogglePin}>
                            <Text style={styles.modalButton}>
                              {selectedThread.pinned ? 'Unpin' : 'Pin'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleDelete}>
                            <Text style={[styles.modalButton, { color: 'red' }]}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// to be moved to styles later
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 10,
  },
  messageSearch: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3a3f47',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 0
  },
  pinned: {
    backgroundColor: '#ad5ff5',
  },
  messageAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5c5f66',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
  },
  message: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalThreadName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginTop: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    fontSize: 16,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  }
});
