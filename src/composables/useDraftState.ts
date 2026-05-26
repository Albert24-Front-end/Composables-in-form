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
      // Используем structuredClone в рамках Object.assign, чтобы сделать глубокую копию initialState, не мутировать исходный объект и не разрывать реактивную ссылку.
      Object.assign(state.value, structuredClone(initialState))
    }

    return { state, reset}
}