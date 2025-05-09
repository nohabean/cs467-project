import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { users } from '../shared/mockSellers';
import { products } from '../shared/mockProducts';
import { mockMessages } from '../shared/mockMessages';
import { useRouter } from 'expo-router';

const CURRENT_USER = 'ikeafan';

export default function SellerProfile() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const sellerId = parseInt(id as string, 10);
    const seller = users.find((s) => s.id === sellerId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }} accessibilityRole="button" accessibilityLabel="Go back">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    if (!seller) {
        return (
            <View style={styles.center}>
                <Text>Seller not found.</Text>
            </View>
        );
    }

    const sellerProducts = products.filter((product) => product.seller === seller.username);

    const handleMessagePress = () => {
        const hasMessages = mockMessages.some(
            (m) =>
                (m.sender === CURRENT_USER && m.recipient === seller.username) ||
                (m.sender === seller.username && m.recipient === CURRENT_USER)
        );

        router.push(`/messages/${seller.username}`);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: seller.image }}
                    style={styles.image}
                    accessibilityLabel={`Image of ${seller.name}`}
                    accessibilityRole="image"
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.name} accessibilityRole="text" accessibilityLabel={`Name: ${seller.name}`}>
                        {seller.name}
                    </Text>
                    <Text style={styles.text} accessibilityRole="text" accessibilityLabel={`Location: ${seller.location}`}>
                        {seller.location}
                    </Text>
                    <Text style={styles.rating} accessibilityRole="text" accessibilityLabel={`Rating: ${seller.rating?.toFixed(1) || 'N/A'}`}>
                        Rating: {seller.rating?.toFixed(1) || 'N/A'}
                    </Text>
                    <Text style={styles.joinedDate} accessibilityRole="text" accessibilityLabel={`Joined date: ${new Date(seller.createdDatetime).toLocaleString('default', { month: 'short', year: 'numeric' })}`}>
                        Joined:{' '}
                        {new Date(seller.createdDatetime).toLocaleString('default', {
                            month: 'short',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.messageButton} 
                onPress={handleMessagePress} 
                accessibilityRole="button" 
                accessibilityLabel="Send Message"
            >
                <Text style={styles.messageButtonText}>Send Message</Text>
            </TouchableOpacity>

            <Text style={styles.label} accessibilityRole="text" accessibilityLabel={`${seller.name}'s Listings`}>
                {seller.name}'s Listings
            </Text>

            <FlatList
                contentContainerStyle={styles.productsList}
                data={sellerProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.productCard}
                        onPress={() => router.push(`/product/${item.id}`)}
                        accessibilityRole="button"
                        accessibilityLabel={`Product: ${item.title}, Price: $${item.price}`}
                    >
                        <Image 
                            source={{ uri: item.image }} 
                            style={styles.productImage} 
                            accessibilityLabel={`Image of ${item.title}`}
                            accessibilityRole="image"
                        />
                        <Text style={styles.productTitle} accessibilityRole="text" accessibilityLabel={`Title: ${item.title}`}>
                            {item.title}
                        </Text>
                        <Text style={styles.productPrice} accessibilityRole="text" accessibilityLabel={`Price: $${item.price}`}>
                            ${item.price}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
    },
    rating: {
        fontSize: 16,
        color: '#888',
        marginBottom: 4,
    },
    joinedDate: {
        fontSize: 14,
        color: '#888',
    },
    messageButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ad5ff5',
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        marginBottom: 12,
    },
    messageButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    productsList: {
        marginTop: 20,
        paddingBottom: 20,
    },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    productImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#ccc',
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
        margin: 8,
    },
    productPrice: {
        fontSize: 14,
        color: '#1e88e5',
        marginBottom: 8,
        marginLeft: 8,
    },
});
