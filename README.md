# AI-Customer-Service-agent

### Install the gemini API
```
pip install google-generativeai
```

Go to the google gemini website to get a free API key and paste them in docbot.py and doc_opinion.py

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Tailwind
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

npx tailwindcss init -p

Create the ./src/index.css file and use the @tailwind directive to include Tailwind’s base, components, and utilities styles, replacing the original file contents:
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

ensure your CSS file is being imported in your ./src/main.js file:
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')


