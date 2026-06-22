/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // NeuroVoz Brand Colors
        neurovoz: {
          white: "#FFFFFF",
          "blue-light": "#BEE8FF",
          turquoise: "#3AB7D6",
          green: "#84D7C8",
          gray: "#F5F7F8",
          dark: "#1A2332",
          "dark-2": "#243040",
          "dark-3": "#2E3D52",
          "text-muted": "#6B8099",
          "text-light": "#9BBDD4",
          "accent-purple": "#8B6FE8",
          "accent-pink": "#F472B6",
          "accent-orange": "#FB923C",
          "accent-yellow": "#FBBF24",
          "accent-red": "#F87171",
          "accent-green": "#4ADE80",
        },
        // Shadcn/UI compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "Nunito", "system-ui", "sans-serif"],
        display: ["Nunito", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(58, 183, 214, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(58, 183, 214, 0.6)" },
        },
        "breathe-in": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.4)", opacity: "1" },
        },
        "breathe-out": {
          "0%": { transform: "scale(1.4)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "breathe-in": "breathe-in 4s ease-in-out",
        "breathe-out": "breathe-out 4s ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      backgroundImage: {
        "gradient-neurovoz": "linear-gradient(135deg, #3AB7D6 0%, #84D7C8 50%, #BEE8FF 100%)",
        "gradient-dark": "linear-gradient(135deg, #1A2332 0%, #243040 50%, #2E3D52 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(58,183,214,0.1) 0%, rgba(132,215,200,0.1) 100%)",
      },
      boxShadow: {
        neurovoz: "0 8px 32px rgba(58, 183, 214, 0.2)",
        "neurovoz-lg": "0 16px 48px rgba(58, 183, 214, 0.3)",
        card: "0 4px 24px rgba(26, 35, 50, 0.08)",
        "card-hover": "0 8px 40px rgba(26, 35, 50, 0.15)",
        glass: "0 8px 32px rgba(58, 183, 214, 0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
}
