import { Redirect, Stack } from "expo-router";
import { useSession } from "../../contexts/authContext";
import Loading from "../../components/loading";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Loading />;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Liberação", headerShown: false }}
      />
    </Stack>
  );
}
