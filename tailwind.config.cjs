/** @type {import('tailwindcss').Config} */
module.exports = {
    daisyui: {
        styled: true,
        base: true,
        utils: true,
        logs: false,
        themes: true,
        // This prevents DaisyUI from applying font sizes
        prefix: "",
    },
    content: [],
    theme: {
        extend: {
            fontFamily: {
                bekidos: ["UT Bekidos", "sans-serif"],
                "bekidos-soft": ["UT Bekidos Soft", "sans-serif"],
                boldonse: ["Boldonse", "sans-serif"],
            },
        },
    },
    plugins: [],
};
