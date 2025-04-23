import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState} from 'react';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1714070700737-24acfe6b957c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'White T-shirt',
    price: 20,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1704919266475-aa6302e25209?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Nike Air Jordans',
    price: 120,
  },
  {
    id: 3,
    image: 'https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFjJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D',
    title: '2018 Macbook Pro',
    price: 1000,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1714070700737-24acfe6b957c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'White T-shirt',
    price: 20,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1704919266475-aa6302e25209?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Nike Air Jordans',
    price: 120,
  },
  {
    id: 6,
    image: 'https://plus.unsplash.com/premium_photo-1681160405609-389cd83998d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFjJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D',
    title: '2018 Macbook Pro',
    price: 1000,
  },
];

export default function Index() {
  const [inputTerm, setInputTerm] = useState('');

  const handleSearch = () => {
    // Testing search functionality
    console.log('Search term:', inputTerm);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <TouchableOpacity>
              <Ionicons name="search" size={24} color="black" style={{ marginRight: 8 }}/>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Search for sale"
              placeholderTextColor="#888"
              value={inputTerm}
              onChangeText={setInputTerm}
              onSubmitEditing={handleSearch}
            />

            <TouchableOpacity>
              <Ionicons name="filter" size={24} color="black" style={{ marginLeft: 8 }}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => {
              // placeholder functionality
            }}>
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Image
                  alt="Product picture on white background."
                  resizeMode="cover"
                  style={styles.cardImage}
                  source={{ uri: item.image}}
                />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardPrice}>${item.price}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginVertical: 6,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 6,
    marginHorizontal: 8,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardBody: {
    padding: 12,
  },
  cardHeader: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  }
})
