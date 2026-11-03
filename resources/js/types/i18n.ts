export type LocaleCode = 'en' | 'km' | string;

export interface LocaleOption {
    code: string;
    label: string;
    shortLabel: string;
    nativeName: string;
}

export type Replacements = Record<string, string | number>;

export type TranslateFunction = (
    key: string,
    replacements?: Replacements,
) => string;

export interface I18nPageProps {
    locale?: string;
    locales?: Record<string, string>;
    translations?: Record<string, string>;
    [key: string]: unknown;
}

export interface SharedData extends I18nPageProps {
    name: string;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
        } | null;
    };
    cartCount?: number;
    today?: string;
    sidebarOpen: boolean;
}
