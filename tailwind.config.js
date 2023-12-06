/** @type {import('tailwindcss').Config} */
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import plugin from 'tailwindcss/plugin';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

module.exports = {
    content: ['./src/client/pages/**/*.{js,ts,jsx,tsx}', './src/client/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            serif: ["'CircularXX', sans-serif"],
        },
        extend: {
            fontFamily: {
                'brand-sans-serif': "'CircularXX', sans-serif",
                'brand-serif': "'nib-regular', serif",
            },
            colors: {
                black: '#101010',
                'black-light': '#505050',
                'black-transparent': 'rgba(16, 16, 16, 0.08)',
                'black-overlay': 'rgba(16, 16, 16, 0.04)',
                'system-secondary': '#505050',
                white: '#FFFFFF',
                'white-half': 'rgba(255, 255, 255, 0.56)',
                'dark-gray': '#9C9C9C',
                gray: '#EAEAEC',
                'medium-gray': '#ECECEC',
                'gray-medium': '#E6E6E6',
                'light-gray': '#F4F4F5',
                green: '#81C784',
                red: '#E57373',
                orange: 'rgba(255, 184, 76, 0.72)',
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities, theme }) {
            const themeOpacities = theme('opacity');
            const themeColors = flattenColorPalette(theme('colors'));
            const bedrockColors = mapValues(
                pickBy(
                    themeColors,
                    // (colorValue, colorToken) => colorToken.startsWith('brand') || colorToken.startsWith('neue')
                    (_, colorToken) => colorToken.startsWith('brand')
                ),
                (colorValue) => colorValue.replace(/^rgb\((.*)\)$/i, `$1`)
            );

            addUtilities(
                Object.keys(themeOpacities).reduce(
                    (obj, opacityKey) => ({
                        ...obj,
                        ...{
                            ...Object.keys(bedrockColors).reduce(
                                (acc, colorKey) => ({
                                    ...acc,
                                    [`.bg-${colorKey}\\/${opacityKey}`]: {
                                        '--tw-bg-opacity': `${themeOpacities[opacityKey]}`,
                                        'background-color': `rgba(${bedrockColors[colorKey]}, var(--tw-bg-opacity))`,
                                    },
                                    [`.text-${colorKey}\\/${opacityKey}`]: {
                                        '--tw-text-opacity': `${themeOpacities[opacityKey]}`,
                                        color: `rgba(${bedrockColors[colorKey]}, var(--tw-text-opacity))`,
                                    },
                                    [`.border-${colorKey}\\/${opacityKey}`]: {
                                        '--tw-border-opacity': `${themeOpacities[opacityKey]}`,
                                        'border-color': `rgba(${bedrockColors[colorKey]}, var(--tw-border-opacity))`,
                                    },
                                    [`.ring-${colorKey}\\/${opacityKey}`]: {
                                        '--tw-ring-opacity': `${themeOpacities[opacityKey]}`,
                                        '--tw-ring-color': `rgba(${bedrockColors[colorKey]}, var(--tw-ring-opacity))`,
                                    },
                                }),
                                {}
                            ),
                        },
                    }),
                    {}
                )
            );
        }),
        require('@tailwindcss/forms'),
        require('autoprefixer'),
    ],
};
