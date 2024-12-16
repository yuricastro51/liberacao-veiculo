import { Stack } from "expo-router";
import { Button } from "react-native";
import { SessionProvider, useSession } from "../contexts/authContext";

function InitialLayout() {
  // useDrizzleStudio(expoDb);
  const { signOut } = useSession();

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="(app)"
        options={{
          title: "Liberação de Veículos",
          headerRight: () => {
            return <Button title="Sair" onPress={() => signOut()}></Button>;
          },
        }}
      />
    </Stack>
  );
}

export default function Root() {
  return (
    <SessionProvider>
      <InitialLayout />
    </SessionProvider>
  );
}
