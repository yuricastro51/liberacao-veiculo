import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import Loading from "../../components/loading";
import { useVehicleReleasedRepository } from "../../repositories/useVehicleReleasedRepository";
import { useSession } from "../../contexts/authContext";
import { VehicleReleased } from "../../entities/vehicleReleased";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [plate, setPlate] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ccc");
  const [lastVehicleReleased, setLastVehicleReleased] = useState<VehicleReleased>();
  const [toggle, setToggle] = useState(false);

  const { createVehicleReleasedAsync, vehicleAlreadyReleasedAsync, getLastVehicleReleasedAsync } =
    useVehicleReleasedRepository();
  const { session } = useSession();

  async function handleReleaseVehicle(): Promise<void> {
    if (plate.length < 7) {
      Alert.alert("Placa inválida", "A placa deve conter 7 caracteres");
      return;
    }
    setLoading(true);

    try {
      const userId = session?.user?.id;

      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      const vehicleReleased = await vehicleAlreadyReleasedAsync(plate);
      if (vehicleReleased) {
        setBackgroundColor("#dc3545");
        const date = new Date(vehicleReleased.created_at);
        const localDate = date.toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        });

        Alert.alert(
          "Veículo já liberado",
          `Este veículo já foi liberado\n\nLiberado por: ${vehicleReleased.user.username}\nData/hora: ${localDate}`,
          [{ text: "OK", onPress: () => setBackgroundColor("#ccc") }]
        );
        return;
      }

      await createVehicleReleasedAsync(plate, userId);
      setBackgroundColor("#28a745");
      Alert.alert("Veículo liberado", "Veículo liberado com sucesso", [
        { text: "OK", onPress: () => setBackgroundColor("#ccc") },
      ]);
      setToggle(!toggle);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao liberar veículo", "Tente novamente");
    } finally {
      setLoading(false);
      setVisible(false);
      setPlate("");
    }
  }

  function handleOnChangeText(text: string): void {
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(text)) {
      setPlate(text);
    }
  }

  useEffect(() => {
    async function getLastVehicleReleased() {
      setLoading(true);
      try {
        const userId = session?.user?.id;

        if (!userId) {
          throw new Error("Usuário não autenticado");
        }

        const lastVehicle = await getLastVehicleReleasedAsync(userId);
        setLastVehicleReleased(lastVehicle);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro ao carregar último veículo liberado", "Tente novamente");
      } finally {
        setLoading(false);
      }
    }

    getLastVehicleReleased();
  }, [toggle]);

  return (
    <>
      {loading && <Loading text="Carregando..." />}
      {!loading && <View style={[styles.container, { backgroundColor: backgroundColor }]}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Digite a placa para liberá-la
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Placa do veículo"
                value={plate}
                maxLength={7}
                autoCapitalize="characters" 
                onChangeText={(text) => handleOnChangeText(text)}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={styles.syncBtn}
                  onPress={() => handleReleaseVehicle()}
                >
                  <Text style={styles.syncBtnText}>Liberar</Text>
                </TouchableOpacity>
              </View>
              <Text>Último veículo liberado: {lastVehicleReleased?.plate}</Text>
            </View>
          </View>
      </View>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    textTransform: "uppercase",
  },
  syncBtn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#ffdc61",
    borderRadius: 8,
    marginBottom: 20,
    elevation: 5,
  },
  syncBtnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0058aa",
  },
});
