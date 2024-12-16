import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return React.useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  // Public
  const [state, setState] = useAsyncState<T>();

  // Get
  React.useEffect(() => {
    SecureStore.getItemAsync(key).then(value => {
      const obj = JSON.parse(value!);
      setState(obj);
    });
  }, [key]);

  // Set
  const setValue = React.useCallback(
    (value: T | null) => {
      setState(value);
      var json = JSON.stringify(value);
      setStorageItemAsync(key, json);
    },
    [key]
  );

  return [state, setValue];
}
