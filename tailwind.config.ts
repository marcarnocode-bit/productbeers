import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores mejorados para WCAG 2.1 AA
        brand: {
          primary: "#E6A91A", // Más oscuro para mejor contraste
          secondary: "#B8821A", // Más oscuro para botones
          light: "#F5E6C8", // Fondo claro
          dark: "#A67C15", // Estados activos
        },
        background: {
          light: "#FAFAFA",
          dark: "#1A1A1A",
        },
        text: {
          primary: "#1F2937", // Gris muy oscuro para máximo contraste
          secondary: "#4B5563", // Gris medio con buen contraste
          light: "#6B7280",
          inverse: "#FFFFFF",
        },
        // Colores semánticos mejorados
        success: {
          DEFAULT: "#059669", // Verde más oscuro
          light: "#D1FAE5",
          dark: "#047857",
        },
        warning: {
          DEFAULT: "#D97706", // Naranja más oscuro
          light: "#FEF3C7",
          dark: "#B45309",
        },
        error: {
          DEFAULT: "#DC2626", // Rojo más oscuro
          light: "#FEE2E2",
          dark: "#B91C1C",
        },
        info: {
          DEFAULT: "#1D4ED8", // Azul más oscuro
          light: "#DBEAFE",
          dark: "#1E40AF",
        },
        // Colores estándar de shadcn mejorados
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
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
