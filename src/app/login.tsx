import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSession } from "../contexts/authContext";
import Loading from "../components/loading";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useSession();

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!validatePassword(password)) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres.");
      isValid = false;
    }

    if (isValid) {
      try {
        setIsLoading(true);
        await signIn(username, password);

        setErrorMessage("");
        router.replace("/");
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Acessar</Text>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.errorMessage}>{passwordError}</Text>
              ) : null}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    paddingHorizontal: 10,
  },
  loginContainer: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: "100%",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
    fontSize: 24,
  },
  inputGroup: {
    position: "relative",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 14,
    // transition: 'border-color 0.3s ease',
  },
  errorMessage: {
    color: "#ff0000",
    fontSize: 12,
    position: "absolute",
    bottom: -18,
    left: 0,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    color: "white",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  error: {
    color: "#ff0000",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});
