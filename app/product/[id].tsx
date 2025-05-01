import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../shared/mockProducts';
import { sellers } from '../shared/mockSellers';

export default function ProductDetail() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const productId = parseInt(id as string, 10);
    const product = products.find((p) => p.id === productId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 16, marginRight: 12 }}>
                    <TouchableOpacity onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite}>
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
    const seller = sellers.find((s) => s.username === product.seller);


    const handleShare = () => {
        console.log('handleShare() called');
    };

    const handleFavorite = () => {
        console.log('handleFavorite() called');
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
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
                <View style={styles.sellerInfoRow}>
                    <Image source={{ uri: seller.image }} style={styles.sellerImage} />
                    <View style={styles.sellerDetailsContainer}>
                        <Text style={styles.sellerName}>{seller.name}</Text>
                        <Text style={styles.sellerMeta}>
                            Joined: {new Date(seller.createdDatetime).toLocaleString('default', { month: 'short', year: 'numeric' })} | Rating: {seller.rating?.toFixed(1) || 'N/A'}
                        </Text>
                        <Text style={styles.sellerMeta}>{seller.location}</Text>
                    </View>
                    <TouchableOpacity onPress={() => console.log('handleSellerInfo() called')}>
                        <Ionicons name="information-circle-outline" size={24} color="#555" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>

            ) : (
                <Text style={styles.text}>Seller not found.</Text>
            )}
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
    sellerCard: {
        padding: 12,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        marginTop: 8,
    },
    sellerDetails: {
        fontSize: 15,
        color: '#555',
    },
    sellerInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
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

});
