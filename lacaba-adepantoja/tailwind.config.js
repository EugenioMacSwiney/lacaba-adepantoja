module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#FF4500", // orange-red for restaurant theme
        secondary: "#6B7280", // gray-500
        accent: "#FF6A33", // lighter orange for accents
        background: "#FFFFFF", // pure white background
        surface: "#FFF5F0", // light orange tint
        text: {
          primary: "#1F2937", // gray-800
          secondary: "#6B7280", // gray-500
        },
        success: "#059669", // emerald-600
        warning: "#D97706", // amber-600
        error: "#DC2626", // red-600
        border: "#FFE4E1", // light orange border
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#FF4500", // main orange
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        script: ['Dancing Script', 'cursive'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'gallery': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'restaurant': '0 4px 6px -1px rgba(255, 69, 0, 0.1)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'gallery': 'ease-out',
      },
      borderWidth: {
        'hairline': '1px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}