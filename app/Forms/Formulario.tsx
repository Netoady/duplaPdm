import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Formulario() {
  const [ownerid, setOwnerid] = useState('');
  const [repoid, setRepoid] = useState('');
  const [loading, setLoading] = useState(false);

  // Buscar dados com Axios e salvar localmente
  const buscarEAdicionarRepo = async () => {
    if (!ownerid.trim() || !repoid.trim()) {
      Alert.alert('Campos vazios', 'Por favor, preencha o ownerid e o repoid.');
      return;
    }

    setLoading(true);

    try {
      // Fazendo a chamada HTTP utilizando Axios e Template Literals conforme o link da atividade
      const url = `https://api.github.com/repos/${ownerid.trim()}/${repoid.trim()}`;
      const response = await axios.get(url);
      
      const repoData = response.data;

      // Mapeando os dados da API para bater certinho com a sua interface ILanHouse
      const novaLanHouse = {
        id: repoData.id.toString(),
        nomeRepositorio: repoData.name,                // Nome do repositório (Obrigatório)
        language: repoData.language || 'Não informada', // Dado extra do repo 1
        full_name: repoData.full_name,                  // Dado extra do repo 2
        dono: repoData.owner.login,                     // Nome do dono (Obrigatório)
        idDono: repoData.owner.id.toString(),           // Dado extra do Dono 1
        type_dono: repoData.owner.type                  // Dado extra do Dono 2
      };

      // Buscar a lista atual, acrescentar a nova e salvar para persistir
      const dadosAtuais = await AsyncStorage.getItem('@LanHouses:lanhouses');
      const listaLanHouses = dadosAtuais ? JSON.parse(dadosAtuais) : [];

      // Evita duplicados
      if (listaLanHouses.some((item: any) => item.id === novaLanHouse.id)) {
        Alert.alert('Aviso', 'Esta LanHouse/Repositório já está na lista!');
        setLoading(false);
        return;
      }

      const novaLista = [...listaLanHouses, novaLanHouse];
      await AsyncStorage.setItem('@LanHouses:lanhouses', JSON.stringify(novaLista));

      Alert.alert('Sucesso', 'Dados importados do GitHub para a LanHouse!');
      router.back(); // Volta para a tela de listagem
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível encontrar o repositório. Verifique os IDs digitados.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar LanHouse via GitHub</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o ownerid (Ex: facebook)"
        placeholderTextColor="#888"
        value={ownerid}
        onChangeText={setOwnerid}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite o repoid (Ex: react-native)"
        placeholderTextColor="#888"
        value={repoid}
        onChangeText={setRepoid}
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        {/* Botão Cancelar */}
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Botão Adicionar */}
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={buscarEAdicionarRepo} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Adicionar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 25, textAlign: 'center' },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  button: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#cf6679' },
  addButton: { backgroundColor: '#03dac6' },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});