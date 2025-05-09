import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../shared/mockProducts';
import { users } from '../shared/mockSellers';
import fallbackImage from '../../assets/images/fallback.png';

export default function ProductDetail() {
    const navigation = useNavigation();
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const productId = parseInt(id as string, 10);
    const product = products.find((p) => p.id === productId);

    const handleShare = () => {
        console.log('handleShare() called');
    };

    const handleFavorite = () => {
        console.log('handleFavorite() called');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
             headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleShare} accessibilityLabel="Share product listing" accessibilityRole="button">
                        <Ionicons name="share-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite} accessibilityLabel="Favorite product listing" accessibilityRole="button">
                        <Ionicons name="heart-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Product not found.</Text>
            </View>
        );
    }

    const seller = users.find((s) => s.username === product.seller);

    const handleSellerInfo = () => {
        if (seller) {
            router.push(`/user/${seller.id}`);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} defaultSource={fallbackImage} accessibilityLabel={`Image of ${product.title}`} />
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{product.description}</Text>

            <Text style={styles.label}>Details</Text>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailText}>{product.category}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Condition:</Text>
                <Text style={styles.detailText}>{product.condition}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailText}>{product.location}</Text>
            </View>

            <Text style={styles.label}>Seller Info</Text>
            {seller ? (
                <TouchableOpacity onPress={handleSellerInfo} accessibilityLabel="View seller info" accessibilityRole="button">
                    <View style={styles.sellerInfoRow}>
                        <Image source={{ uri: seller.image }} style={styles.sellerImage} defaultSource={fallbackImage} accessibilityLabel={`Image of ${seller.name}`} />
                        <View style={styles.sellerDetailsContainer}>
                            <Text style={styles.sellerName}>{seller.name}</Text>
                            <Text style={styles.sellerMeta}>
                                Joined: {new Date(seller.createdDatetime).toLocaleString('default', { month: 'short', year: 'numeric' })} | Rating: {seller.rating?.toFixed(1) || 'N/A'}
                            </Text>
                            <Text style={styles.sellerMeta}>{seller.location}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push(`/messages/new?sellerId=${seller.id}`)}
                            accessibilityLabel="Message seller"
                            accessibilityRole="button"
                            style={styles.chatButton}
                        >
                            <Ionicons name="chatbox-ellipses" size={28} color="#ad5ff5" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ) : (
                <Text style={styles.text}>Seller not found.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        gap: 16,
        marginRight: 12
    },
    container: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 280,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 6,
    },
    price: {
        fontSize: 22,
        fontWeight: '500',
        color: '#1e88e5',
        marginBottom: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6,
    },
    text: {
        fontSize: 16,
        color: '#444',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        fontWeight: '500',
        width: 100,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
    },
    sellerInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    sellerImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ccc',
    },
    sellerDetailsContainer: {
        flex: 1,
        marginLeft: 12,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    sellerMeta: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    chatButton: {
        padding: 10,
        borderRadius: 10,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
