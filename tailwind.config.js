import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                guinda: {
                    DEFAULT: '#8B1A2E',
                    50:  '#FDF2F3',
                    100: '#FAE4E7',
                    200: '#F5C8CF',
                    300: '#ECA1AD',
                    400: '#DE6D82',
                    500: '#CC4260',
                    600: '#B12847',
                    700: '#971E38',
                    800: '#8B1A2E',
                    900: '#6E1525',
                    950: '#430D16',
                },
                sidebar: {
                    DEFAULT: '#1A2E25',
                    hover:  '#243D30',
                    active: '#2D4E3A',
                    text:   'rgba(255,255,255,0.85)',
                    muted:  'rgba(255,255,255,0.45)',
                },
                cream: {
                    DEFAULT: '#F5F0E8',
                    50:  '#FDFCF9',
                    100: '#FAF7F2',
                    200: '#F5F0E8',
                    300: '#EDE5D8',
                    400: '#DDD6CA',
                    500: '#C8BEB0',
                },
            },
            boxShadow: {
                card:      '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                'card-md': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
                sidebar:   '2px 0 12px rgba(0,0,0,0.18)',
            },
        },
    },

    plugins: [forms],
};
