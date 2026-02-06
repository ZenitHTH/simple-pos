import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CURRENCY_COOKIE_KEY = 'app_currency';
const DEFAULT_CURRENCY = '$';

export function useCurrency() {
    const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);

    useEffect(() => {
        // Initialize from cookie on mount
        const savedCurrency = Cookies.get(CURRENCY_COOKIE_KEY);
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
    }, []);

    const updateCurrency = (newCurrency: string) => {
        setCurrency(newCurrency);
        if (newCurrency) {
            Cookies.set(CURRENCY_COOKIE_KEY, newCurrency, { expires: 365, SameSite: 'Strict' });
        } else {
            // If empty string is passed, maybe switch back to default or just keep it empty?
            // For now, let's allow it but maybe the UI should prevent empty.
            // Let's stick to the behavior of just setting it.
            Cookies.set(CURRENCY_COOKIE_KEY, newCurrency, { expires: 365, SameSite: 'Strict' });
        }
    };

    const clearCurrency = () => {
        Cookies.remove(CURRENCY_COOKIE_KEY);
        setCurrency(DEFAULT_CURRENCY);
    };

    // Helper to clear ALL app cookies (for the delete button requirement)
    // Note: Cookies.remove only removes cookies on the current path/domain.
    // We might need to be specific if cookies are set on different paths.
    // For now, assuming default path '/'.
    const clearAllCookies = () => {
        // List all keys and remove them
        const allCookies = Cookies.get();
        Object.keys(allCookies).forEach(key => {
            Cookies.remove(key);
        });
        setCurrency(DEFAULT_CURRENCY);
    };

    return {
        currency,
        updateCurrency,
        clearCurrency,
        clearAllCookies
    };
}
