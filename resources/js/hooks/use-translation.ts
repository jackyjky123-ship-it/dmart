import { useCallback, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type {
    I18nPageProps,
    Replacements,
    TranslateFunction,
} from '@/types/i18n';

/**
 * Interpolates placeholder parameters in a string.
 * Supports both :param and {param} placeholder styles.
 */
export function interpolate(text: string, replacements?: Replacements): string {
    if (!replacements || typeof text !== 'string') {
        return text;
    }

    let result = text;
    const entries = Object.entries(replacements).sort(
        (a, b) => b[0].length - a[0].length,
    );

    for (const [rawKey, value] of entries) {
        const val = String(value ?? '');
        const key = rawKey.startsWith(':')
            ? rawKey.slice(1)
            : rawKey.startsWith('{') && rawKey.endsWith('}')
              ? rawKey.slice(1, -1)
              : rawKey;

        // Replace both :key and {key} tokens
        result = result.split(`:${key}`).join(val).split(`{${key}}`).join(val);
    }

    return result;
}

/**
 * Standalone translation function that checks a translations dictionary
 * and interpolates placeholders.
 */
export function translate(
    key: string,
    replacements?: Replacements,
    translations?: Record<string, string>,
): string {
    if (!key) {
        return '';
    }

    const raw =
        translations && typeof translations[key] === 'string'
            ? translations[key]
            : key;

    return interpolate(raw, replacements);
}

/**
 * Non-hook alias for translate.
 */
export const t = translate;

export interface UseTranslationReturn {
    t: TranslateFunction;
    locale: string;
    locales: Record<string, string>;
    isKhmer: boolean;
    isEnglish: boolean;
    interpolate: typeof interpolate;
}

/**
 * React hook to access translations and current locale from Inertia shared props.
 */
export function useTranslation(): UseTranslationReturn {
    const { props } = usePage<I18nPageProps>();

    const locale =
        typeof props.locale === 'string' && props.locale ? props.locale : 'en';
    const locales = (
        props.locales && typeof props.locales === 'object'
            ? props.locales
            : { en: 'English', km: 'ភាសាខ្មែរ' }
    ) as Record<string, string>;
    const translations = (
        props.translations && typeof props.translations === 'object'
            ? props.translations
            : {}
    ) as Record<string, string>;

    // Keep <html lang="..."> in sync with the current locale
    useEffect(() => {
        if (
            typeof document !== 'undefined' &&
            document.documentElement.lang !== locale
        ) {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const tHook = useCallback<TranslateFunction>(
        (key: string, replacements?: Replacements): string => {
            return translate(key, replacements, translations);
        },
        [translations],
    );

    return {
        t: tHook,
        locale,
        locales,
        isKhmer: locale === 'km',
        isEnglish: locale === 'en',
        interpolate,
    };
}

export default useTranslation;
