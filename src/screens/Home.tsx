import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from 'react-native';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CharacterCard } from "../components/card/CharacterCard";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function App() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const [info, setInfo] = useState<{ pages?: number }>({});
  const [loading, setLoading] = useState(false);
  const favoritos = "favorites";
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchCharacters = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${pageNumber}`
      );
      setCharacters(response.data.results);
      setInfo(response.data.info);
      setPage(pageNumber);
    } catch (error) {
      console.error("Erro ao buscar personagens:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    const load = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
    };
    load();
  }, [])
);

  useEffect(() => {
  fetchCharacters();
  loadFavorites();
}, []);

const loadFavorites = async () => {
  const favs = await getFavorites();
  setFavorites(favs);
};

  const getFavorites = async () => {
  const jsonValue = await AsyncStorage.getItem(favoritos);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

const saveFavorites = async (favorites: any[]) => {
  await AsyncStorage.setItem(favoritos, JSON.stringify(favorites));
};

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      info.pages !== undefined &&
      pageNumber <= info.pages
    ) {
      fetchCharacters(pageNumber);
      Keyboard.dismiss();
    } else {
      alert("Página inválida");
    }
  };

  type Character = {
    id: number;
    name: string;
    status: string;
    species: string;
    image: string;
  };

  const isFavorite = (character: Character) =>
  favorites.some((fav) => fav.id === character.id);

const toggleFavorite = async (character: Character) => {
  const updatedFavorites = isFavorite(character)
    ? favorites.filter((fav) => fav.id !== character.id)
    : [...favorites, character];

  setFavorites(updatedFavorites);
  await saveFavorites(updatedFavorites);
};

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <Text style={styles.title}>Personagens de Rick and Morty</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("../../assets/morty-loader.json")}
            autoPlay
            loop
            style={styles.loader}
          />
          <Text style={styles.loadingText}>Carregando personagens...</Text>
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={{ paddingBottom: 0 }}
            data={characters}
            renderItem={({ item }) => (
              <CharacterCard
                item={item}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.pagination}>
            <TextInput
              style={styles.input}
              placeholder="Nº da página"
              keyboardType="number-pad"
              value={inputPage}
              onChangeText={setInputPage}
            />
            <TouchableOpacity style={styles.goButton} onPress={handleGoToPage}>
              <Text style={styles.buttonText}>Ir</Text>
            </TouchableOpacity>
            <Text style={styles.pageText}>
              Página atual: {page} de {info.pages || "..."}
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 25,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
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
  pagination: {
    backgroundColor: "#ffffff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: 100,
    borderRadius: 5,
    textAlign: "center",
  },
  goButton: {
    backgroundColor: "#00aa00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageText: {
    fontSize: 14,
  },
  loaderContainer: {
    height: height - 200,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  favoriteButton: {
  alignSelf: 'flex-start',
},
});