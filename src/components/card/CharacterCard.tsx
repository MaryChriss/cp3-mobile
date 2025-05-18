import React, { useCallback, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
};

type Props = {
  item: Character;
  isFavorite: (item: Character) => boolean;
  toggleFavorite: (item: Character) => void;
};

export const CharacterCard = ({ item, isFavorite, toggleFavorite }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [favorites, setFavorites] = useState<any[]>([]);

  const handleToggleFavorite = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavorite(item);
  };

  useFocusEffect(
  useCallback(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
    };

    loadFavorites();
  }, [])
);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Status: <Text style={{ color: item.status === "Alive" ? "green" : "red" }}>{item.status}</Text></Text>
        <Text>Espécie: {item.species}</Text>
      </View>

      <TouchableOpacity onPress={handleToggleFavorite}>
        <Animated.View style={[styles.heartButton, { transform: [{ scale: scaleAnim }] }]}>
          <FontAwesome
            name="heart"
            size={24}
            color={isFavorite(item) ? "#e53935" : "#ccc"}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 3,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  heartButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
