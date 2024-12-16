import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingProps = {
  text?: string;
};

export default function Loading({ text = 'Carregando...' }: LoadingProps) {
  return (
    <View style={styles.loadingSpinner}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.spinnerText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingSpinner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  spinnerText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 32,
  },
});
