import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const favoritos = "favorites";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);

useFocusEffect(
  useCallback(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem(favoritos);
      setFavorites(favs ? JSON.parse(favs) : []);
    };

    loadFavorites();
  }, [])
);

  const removeFavorite = async (id: number) => {
    const updated = favorites.filter((char) => char.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem(favoritos, JSON.stringify(updated));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Text style={{ color: "red", marginTop: 8 }}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

return (
  <View style={{ flex: 1, padding: 10 }}>
    <Text style={styles.title}>Favoritos</Text>

    {favorites.length === 0 ? (
      <Text style={styles.emptyText}>Nenhum personagem salvo.</Text>
    ) : (
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    )}
  </View>
);
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
  },
  avatar: {
    width: 100,
    height: 100,
  },
  info: {
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 360,
  },
});
