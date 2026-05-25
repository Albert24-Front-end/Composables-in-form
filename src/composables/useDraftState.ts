import { useLocalStorage } from "@vueuse/core";

export function useDraftState<T extends Record<string, unknown>>(key: string, initialState: T) {
    const state = useLocalStorage(key, initialState, {
        serializer: {
            read: (value: string) => {
                try {
                    return JSON.parse(value)
                } catch {
                    return initialState
                }
            },
            write: (value: T) => JSON.stringify(value),
        }
    })

    const reset = () => {
      // Используем structuredClone, чтобы сделать глубокую копию initialState и не мутировать исходный объект.
      state.value = structuredClone(initialState);
    }

    return { state, reset}
}