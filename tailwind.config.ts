
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Updated dark theme colors for code snippets
				snippet: {
					bg: '#121212',
					code: '#0A0A0A',
					border: '#2A2A2A',
				},
				lang: {
					js: '#F7DF1E',
					py: '#3776AB',
					ts: '#3178C6',
					html: '#E34F26',
					css: '#1572B6',
					ruby: '#CC342D',
					go: '#00ADD8',
					java: '#007396',
					csharp: '#239120',
					php: '#777BB4',
					swift: '#FA7343',
					rust: '#DEA584',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'copy-success': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.2)' },
					'100%': { transform: 'scale(1)' }
				},
				'tag-pulse': {
					'0%': { boxShadow: '0 0 0 0 rgba(124, 77, 255, 0.4)' },
					'70%': { boxShadow: '0 0 0 6px rgba(124, 77, 255, 0)' },
					'100%': { boxShadow: '0 0 0 0 rgba(124, 77, 255, 0)' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'typing': {
					'0%': { width: '0' },
					'50%': { width: '100%' },
					'100%': { width: '0' }
				},
				'blink-caret': {
					'from, to': { borderColor: 'transparent' },
					'50%': { borderColor: '#7C4DFF' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'from': { transform: 'scale(1)', opacity: '1' },
					'to': { transform: 'scale(0.95)', opacity: '0' }
				},
				'pattern-highlight': {
					'0%': { backgroundColor: 'rgba(124, 77, 255, 0.2)' },
					'50%': { backgroundColor: 'rgba(124, 77, 255, 0.1)' },
					'100%': { backgroundColor: 'rgba(124, 77, 255, 0)' }
				},
				'tag-connect': {
					'0%': { opacity: '0', height: '0' },
					'50%': { opacity: '1', height: '20px' },
					'100%': { opacity: '0', height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'copy-success': 'copy-success 0.3s ease-in-out',
				'tag-pulse': 'tag-pulse 1.5s infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'typing': 'typing 3s steps(40) infinite',
				'blink-caret': 'blink-caret 0.75s step-end infinite',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'pattern-highlight': 'pattern-highlight 1.5s ease-out forwards',
				'tag-connect': 'tag-connect 1s ease-out forwards',
			},
			fontFamily: {
				'jetbrains': ['"JetBrains Mono"', 'monospace'],
				'inter': ['"Inter"', 'sans-serif'],
				'fira-code': ['"Fira Code"', 'monospace'],
			},
			backgroundImage: {
				'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
			},
			boxShadow: {
				'neon-purple': '0 0 5px rgba(124, 77, 255, 0.5), 0 0 20px rgba(124, 77, 255, 0.3)',
				'neon-teal': '0 0 5px rgba(0, 191, 165, 0.5), 0 0 20px rgba(0, 191, 165, 0.3)',
				'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'tag-glow': '0 0 3px rgba(124, 77, 255, 0.7)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
