import MyScrollView from "@/components/MyScrollView";
import { ThemedView } from "@/components/themed-view";
import { ILanHouse } from "@/interfaces/ILanHouse";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import LanHouse from "@/components/LanHouse/LanHouse";

export default function PlanetasListScreen() {
  const [lanhouses, setLanHouses] = useState<ILanHouse[]>([]);

  const carregarDados = async () => {
    try {
      const data = await AsyncStorage.getItem("@LanHouses:lanhouses");
      const lanHouseData = data != null ? JSON.parse(data) : [];
      setLanHouses(lanHouseData);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, []),
  );

  const navigateToForm = () => {
    router.push({ pathname: "/Forms/Formulario" });
  };

  // Ao lado do +, coloque um - para limpar os dados salvos totalmente
  const limparTodosOsDados = async () => {
    Alert.alert(
      "Limpar LanHouses",
      "Tem certeza que deseja apagar todos os repositórios salvos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@LanHouses:lanhouses");
              setLanHouses([]);
              Alert.alert("Sucesso", "Todos os dados foram apagados!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar os dados.");
            }
          }
        }
      ]
    );
  };

  return (
    <MyScrollView headerBackgroundColor={{
      dark: "",
      light: ""
    }}>
      {/* HEADER CUSTOMIZADO COM + E - LADO A LADO */}
      <ThemedView style={styles.headerContainer}>
        <Text style={styles.headerTitle}>LanHouse Git</Text>
        <View style={styles.buttonsGroup}>
          {/* Botão de Menos (-) para Limpar */}
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={limparTodosOsDados}>
            <Text style={styles.actionButtonText}>-</Text>
          </TouchableOpacity>
          {/* Botão de Mais (+) para Navegar */}
          <TouchableOpacity style={[styles.actionButton, styles.addButton]} onPress={navigateToForm}>
            <Text style={styles.actionButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* LISTAGEM DE REPOSITÓRIOS */}
      <ThemedView style={styles.container}>
        {lanhouses.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum registro encontrado. Toque no + para buscar!</Text>
        ) : (
          lanhouses.map((lanhouse) => (
            <TouchableOpacity key={lanhouse.id}>
              {/* Componente exibindo Nome do repo, nome do dono e dados extras */}
              <LanHouse
                nomeRepositorio={lanhouse.nomeRepositorio}
                language={lanhouse.language}          // Dado extra do Repo 1
                full_name={lanhouse.full_name}        // Dado extra do Repo 2
                dono={lanhouse.dono}                  // Nome do Dono
                idDono={lanhouse.idDono}              // Dado extra do Dono 1
                type_dono={lanhouse.type_dono}        // Dado extra do Dono 2
              />
            </TouchableOpacity>
          ))
        )}
      </ThemedView>
    </MyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  headerContainer: {
    backgroundColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonsGroup: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#03dac6",
  },
  deleteButton: {
    backgroundColor: "#cf6679",
  },
  actionButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  }
});