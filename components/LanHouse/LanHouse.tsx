import { Text, View, StyleSheet } from "react-native";

export type LanHouseProps = {
  nomeRepositorio: string;
  language: string;
  full_name: string;
  dono: string;
  idDono: string;
  type_dono: string;
};

export default function lanHouse({
  nomeRepositorio,
  language,
  full_name,
  dono,
  idDono,
  type_dono,
}: LanHouseProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.nome}>{nomeRepositorio}</Text>
      <Text style={styles.nome}>{language}</Text>
      <Text style={styles.nome}>{full_name}</Text>
      <Text style={styles.nome}>{dono}</Text>
      <Text style={styles.nome}>{idDono}</Text>
      <Text style={styles.nome}>{type_dono}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 20,
    margin: 20,
    borderRadius: 5,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    fontSize: 10,
  },
});
