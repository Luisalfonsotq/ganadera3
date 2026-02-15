
export const useFormValidation = () => {
    // Regex para validación de email estándar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex para contraseña fuerte: Mínimo 8 caracteres, 1 mayúscula, 1 número
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    const validateEmail = (email: string): string | null => {
        if (!email) return 'El correo electrónico es obligatorio';
        if (!emailRegex.test(email)) return 'Ingresa un correo electrónico válido';
        return null;
    };

    const validatePassword = (password: string): string | null => {
        if (!password) return 'La contraseña es obligatoria';
        if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!passwordRegex.test(password)) return 'La contraseña debe incluir al menos una mayúscula y un número';
        return null;
    };

    const validateRequired = (value: string, fieldName: string): string | null => {
        if (!value || value.trim() === '') return `El campo ${fieldName} es obligatorio`;
        return null;
    };

    const validateMatch = (value1: string, value2: string, fieldName: string): string | null => {
        if (value1 !== value2) return `Los campos de ${fieldName} no coinciden`;
        return null;
    };

    return {
        validateEmail,
        validatePassword,
        validateRequired,
        validateMatch
    };
};
