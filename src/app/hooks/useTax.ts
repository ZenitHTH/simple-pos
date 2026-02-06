import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const TAX_COOKIE_KEY = 'tax_enabled';
const TAX_RATE_COOKIE_KEY = 'tax_rate';

export function useTax() {
    const [isTaxEnabled, setIsTaxEnabled] = useState(true);
    const [taxPercentage, setTaxPercentage] = useState(7);

    useEffect(() => {
        const savedEnabled = Cookies.get(TAX_COOKIE_KEY);
        const savedRate = Cookies.get(TAX_RATE_COOKIE_KEY);

        if (savedEnabled !== undefined) {
            setIsTaxEnabled(savedEnabled === 'true');
        }
        if (savedRate !== undefined) {
            setTaxPercentage(parseFloat(savedRate));
        }
    }, []);

    const toggleTax = () => {
        setIsTaxEnabled(prev => {
            const newValue = !prev;
            Cookies.set(TAX_COOKIE_KEY, String(newValue), { expires: 365 });
            return newValue;
        });
    };

    const updateTaxRate = (rate: number) => {
        setTaxPercentage(rate);
        Cookies.set(TAX_RATE_COOKIE_KEY, String(rate), { expires: 365 });
    };

    return {
        isTaxEnabled,
        toggleTax,
        taxPercentage,
        setTaxPercentage: updateTaxRate,
        taxRate: isTaxEnabled ? (taxPercentage / 100) : 0
    };
}
