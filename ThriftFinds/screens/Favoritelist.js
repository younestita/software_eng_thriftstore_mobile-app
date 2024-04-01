import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { shoesData } from './shoesdata';

const FavoritePage = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      const favorites = favoritesString ? JSON.parse(favoritesString) : [];
      const favoriteShoes = shoesData.filter((shoe) => favorites.includes(shoe.id));
      setFavorites(favoriteShoes);
    } catch (error) {
      console.log('Error fetching favorites:', error);
    }
  };

  const handleShoePress = (shoe) => {
    navigation.navigate('ItemPage', { shoe });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.shoeContainer} onPress={() => handleShoePress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.title}>Favorite Shoes</Text>
      </View>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No favorite shoes yet</Text>
      )}
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
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  shoeContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
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
  description: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default FavoritePage;
