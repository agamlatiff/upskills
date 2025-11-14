export const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    const regexes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/];
    let passedTests = 0;
    regexes.forEach(regex => {
        if (regex.test(password)) {
            passedTests++;
        }
    });

    if (password.length < 8) {
        return password.length > 0 ? 1 : 0;
    }

    switch (passedTests) {
        case 1: return 1;
        case 2: return 2;
        case 3: return 3;
        case 4: return 4;
        default: return 0;
    }
};
