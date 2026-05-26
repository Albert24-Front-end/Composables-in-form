import { ref, computed, watch } from 'vue'

export type ValidationRule<T = unknown> = {
    validator: (value: T) => boolean | Promise<boolean>
    message: string
}
export type ValidationRules<T extends Record<string, unknown>> = {
    [K in keyof T]?: ValidationRule<T[K]>[]
}

export type ValidationErrors<T extends Record<string, unknown>> = {
    [K in keyof T]?: string | null
}

export function useValidations<T extends Record<string, unknown>>(data: T, rules: ValidationRules<T>) {
    const errors = ref<ValidationErrors<T>>(
        Object.keys(data).reduce((acc, key) => {
            acc[key as keyof T] = null;
            return acc;
        }, {} as ValidationErrors<T>)
    )

    const isChecking = ref(false)
    // Validate a single field
    async function validateField(field: keyof T) {
        const fieldRules = rules[field];

        if (!fieldRules) {
            errors.value[field] = null;
            return true;
        }

        for (const rule of fieldRules) {
            if (!await rule.validator(data[field])) {
                errors.value[field] = rule.message;
                return false;
            }
        }

        errors.value[field] = null;
        return true;
    }

    // Validate all fields
    async function validateAll() {
        isChecking.value = true
        let valid = true;
        for (const field in data) {
            if (!await validateField(field)) {
                valid = false;
            }
        }
        isChecking.value = false
        return valid;
    }

    // Check if form is valid
    const isValid = computed(() => {
        return Object.values(errors.value).every((error) => error === null)
    })

    // Check if there are any errors
    const hasErrors = computed(() => {
        return Object.values(errors.value).some((error) => error !== null)
    })

    // Auto-validate on data changes
    let timeout: ReturnType<typeof setTimeout>
    watch(
      () => data, // Следим за объектом данных
      () => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          await validateAll()
        }, 300) // 300 мс — оптимальная задержка для форм (1000 мс ощущается как сильный лаг)
      },
      { deep: true, immediate: true }, // deep: true отслеживает каждое поле внутри объекта
    )

    return { errors, validateField, validateAll, isValid, hasErrors, isChecking }
}


// Common validation rules
export const validationRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validator: (value: T) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (typeof value === 'boolean') return value === true
      if (Array.isArray(value)) return value.length > 0
      return value != null && value !== undefined
    },
    message,
  }),

  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validator: (value: string) => /.+@.+\..+/.test(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validator: (value: string) => value.length >= min,
    message: message || `Minimum length is ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validator: (value: string) => value.length <= max,
    message: message || `Maximum length is ${max} characters`,
  }),

  checkEmailTaken: (max: number, message?: string): ValidationRule<string> => ({
    validator: async (value: string) => {
        await new Promise (resolve => setTimeout(resolve, 1000))
        return value.length <= max
    },
    message: message || `Your email has less than ${max} characters and is unique`,
  }),

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => ({
    validator: (value: string) => regex.test(value),
    message,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validator: (value: number) => value >= min,
    message: message || `Minimum value is ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validator: (value: number) => value <= max,
    message: message || `Maximum value is ${max}`,
  }),

  custom: <T>(validator: (value: T) => boolean, message: string): ValidationRule<T> => ({
    validator,
    message,
  }),
}

// task 1 - try to add async validation with setTimeout (checking by symbols amount if passed email is already occupied)