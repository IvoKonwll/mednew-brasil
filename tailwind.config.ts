import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fundo off-white levemente quente
        paper: {
          DEFAULT: "#faf8f4",
          card: "#ffffff",
          soft: "#f3f0ea",
        },
        // Azul marinho / grafite — cor principal editorial
        ink: {
          DEFAULT: "#1a2438",
          soft: "#3a465e",
          muted: "#6b7488",
          line: "#e3ddd2",
        },
        navy: {
          DEFAULT: "#16233f",
          600: "#1f3357",
          500: "#2a4370",
        },
        // Semânticas de impacto
        impact: {
          muda: "#1f7a4d",       // verde — muda conduta
          acompanhar: "#c07d12", // âmbar — merece acompanhar
          alerta: "#b4232a",     // vermelho — alerta de segurança
          neutro: "#6b7280",     // cinza — não muda conduta ainda
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "68ch",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
