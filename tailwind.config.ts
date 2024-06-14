import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require('flowbite/plugin')
  ],
} satisfies Config

