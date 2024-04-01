import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemPage = ({ route, navigation }) => {
  const { shoe } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [shoes, setShoes] = useState([]);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState('');

  useEffect(() => {
    checkIfFavorite();
    fetchShoes();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      const favorites = favoritesString ? JSON.parse(favoritesString) : [];
      setIsFavorite(favorites.includes(shoe.id));
    } catch (error) {
      console.log('Error checking favorite:', error);
    }
  };

  const fetchShoes = async () => {
    try {
      const shoesString = await AsyncStorage.getItem('Items');
      const shoesData = shoesString ? JSON.parse(shoesString) : [];
      setShoes(shoesData);
    } catch (error) {
      console.log('Error fetching shoes:', error);
    }
  };

  const handleOrderPress = () => {
    setQuantityModalVisible(true);
  };

  const handleOrderConfirm = async () => {
    const quantity = parseInt(orderQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      console.log('Invalid quantity');
      return;
    }

    if (quantity > shoe.quantity) {
      Alert.alert('Error', 'Quantity exceeds available stock.');
      return;
    }

    try {
      const cartItemsString = await AsyncStorage.getItem('cartItems');
      const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];
      const updatedCartItems = [...cartItems];
      const existingItem = updatedCartItems.find(item => item.id === shoe.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        updatedCartItems.push({ ...shoe, quantity });
      }

      const updatedShoe = { ...shoe, quantity: shoe.quantity - quantity };
      const updatedShoes = shoes.map(item => (item.id === shoe.id ? updatedShoe : item));

      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      await AsyncStorage.setItem('shoes', JSON.stringify(updatedShoes));
      setQuantityModalVisible(false);

      Alert.alert('Order Placed', 'Your order has been placed successfully.');

      setShoes(updatedShoes); // Update the state to reflect the new quantity on hand
    } catch (error) {
      console.log('Error updating cart:', error);
    }
  };

  const handleFavoritePress = () => {
    toggleFavorite(shoe.id);
  };

  const toggleFavorite = async (shoeId) => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      const favorites = favoritesString ? JSON.parse(favoritesString) : [];

      if (favorites.includes(shoeId)) {
        favorites.splice(favorites.indexOf(shoeId), 1);
      } else {
        favorites.push(shoeId);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log('Error toggling favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Item Details</Text>
      </View>
      <View style={styles.content}>
        <Image source={{ uri: shoe.image }} style={styles.image} />
        <Text style={styles.name}>{shoe.name}</Text>
        <Text style={styles.price}>Price: ${shoe.price}</Text>
        <Text style={styles.quantity}>Quantity on Hand: {shoe.quantity}</Text>
        <Text style={styles.description}>{shoe.description}</Text>
        <TouchableOpacity style={styles.button} onPress={handleOrderPress} disabled={shoe.quantity === 0}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFavoritePress}>
          <Text style={styles.buttonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={quantityModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Quantity</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Quantity"
              keyboardType="numeric"
              value={orderQuantity}
              onChangeText={text => setOrderQuantity(text)}
            />
            <Button title="Confirm" onPress={handleOrderConfirm} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#32db54',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    width: '70%',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default ItemPage;
