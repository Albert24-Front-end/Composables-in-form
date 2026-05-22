import { ref, computed } from 'vue'

export type FormFieldState = {
    touched: boolean,
    blurred: boolean,
    dirty?: boolean,
}

export type FormState<T extends Record<string, unknown>> = {
  [K in keyof T]: FormFieldState
}

export function useFormState<T extends Record<string, unknown>>(fields: T) {
    const state = ref<FormState<T>>(
        Object.keys(fields).reduce((acc, key) => {
            acc[key as keyof T] = {
                touched: false,
                blurred: false,
                dirty: false
            };
            return acc;
        }, {} as FormState<T>)
    )

    function markTouched(field: keyof T) {
        state.value[field].touched = true
    }

    function markBlurred(field: keyof T) {
        state.value[field].blurred = true
        state.value[field].touched = true
    }

    function markDirty(field: keyof T) {
        state.value[field].dirty = true
        state.value[field].touched = true
        state.value[field].blurred = true
    }

    function resetField(field: keyof T) {
        state.value[field].touched = false
        state.value[field].blurred = false
    }

    function resetAll() {
        Object.keys(state.value).forEach((key) => {
        const field = key as keyof T
        state.value[field].touched = false
        state.value[field].blurred = false
        })
    }

    function isTouched(field: keyof T) {
        return state.value[field].touched
    }

    function isBlurred(field: keyof T) {
        return state.value[field].blurred
    }

    function isDirty(field: keyof T) {
        return state.value[field].dirty
    }

    function hasAnyTouched() {
        return Object.values(state.value).some(
        (fieldState) => (fieldState as FormState<T>[keyof T]).touched,
        )
    }

    function areAllTouched() {
        return Object.values(state.value).every(
        (fieldState) => (fieldState as FormState<T>[keyof T]).touched,
        )
    }

    function markAllBlurred() {
        Object.keys(state.value).forEach((key) => {
            const field = key as keyof T
            state.value[field].blurred = true
            state.value[field].touched = true
            state.value[field].dirty = true
        })
    }

    const handlers = computed(() => {
        return Object.keys(fields).reduce(
        (acc, key) => {
            const field = key as keyof T
            acc[field] = {
                focus: () => markTouched(field),
                blur: () => markBlurred(field),
                dirty: () => markBlurred(field),
            }
            return acc
        },
        {} as Record<keyof T, { focus: () => void; blur: () => void, dirty: () => void }>,
        )
    })

    return {
        state,
        handlers,
        markTouched,
        markBlurred,
        markAllBlurred,
        markDirty,
        resetField,
        resetAll,
        isTouched,
        isBlurred,
        isDirty,
        hasAnyTouched,
        areAllTouched,
    }
}
// task 2 - create seperate widely customized component Field.vue for inputs label + span. so that it could contain not only input