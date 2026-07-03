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
        // Azul editorial — diretrizes e aprovação regulatória
        signal: {
          DEFAULT: "#1d5a94",
          soft: "#2e6ba8",
        },
        // Semânticas de impacto
        impact: {
          muda: "#1f7a4d",       // verde — muda conduta
          acompanhar: "#b8770f", // âmbar — merece acompanhar
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
      boxShadow: {
        card: "0 1px 2px 0 rgba(22, 35, 63, 0.04), 0 1px 3px 0 rgba(22, 35, 63, 0.06)",
        "card-hover":
          "0 4px 6px -1px rgba(22, 35, 63, 0.08), 0 2px 4px -2px rgba(22, 35, 63, 0.06)",
      },
      letterSpacing: {
        masthead: "-0.02em",
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
