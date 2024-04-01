import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { shoesData } from './shoesdata';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('profile');
    console.log('Profile Pressed');
  };


  const handleCartPress = () => {
    navigation.navigate('cartlist');
    console.log('Cart Pressed');
  };

  const handleShoePress = (shoe) => {
    navigation.navigate('ItemPage', { shoe });
    console.log('Shoe Pressed:', shoe);

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>ThriftStore</Text>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <AntDesign name="shoppingcart" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {shoesData.map((shoe, index) => (
          <TouchableOpacity
            key={index}
            style={styles.shoeContainer}
            onPress={() => handleShoePress(shoe)}
          >
            <Image source={{ uri: shoe.image }} style={styles.image} />
            <Text style={styles.name}>{shoe.name}</Text>
            <Text style={styles.price}>Price: ${shoe.price}</Text>
            <Text style={styles.description}>{shoe.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  profileButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  cartButton: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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
});

export default HomeScreen;