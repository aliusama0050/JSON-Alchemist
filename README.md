# 🧪 JSON Alchemist

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Powered_by-Gemini_3_Pro-4285F4?logo=google)](https://ai.google.dev/)

**Transform, translate, and restructure any JSON using the power of Gemini AI**

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage) • [Configuration](#-configuration)

</div>

---

## ✨ Features

- **🔄 Intelligent Data Transformation** — Convert any JSON structure to your desired schema format using AI
- **🌍 Automatic Translation** — Translates non-English JSON data to English while preserving semantic meaning
- **📁 File Upload Support** — Drag & drop or select JSON files for instant processing
- **🎨 Modern Dark UI** — Clean, responsive interface built with Tailwind CSS
- **⚙️ Configurable AI Models** — Choose between Gemini 3 Pro, Gemini 3 Flash, or Gemini 2.5 Flash
- **📊 Token Limit Control** — Adjustable output token limits for handling large datasets
- **💾 Export Results** — Download transformed JSON with one click
- **📋 Clipboard Integration** — Copy results directly to clipboard

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Gemini API key](https://ai.google.dev/gemini-api/docs/api-key) from Google AI Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/json-alchemist.git
cd json-alchemist

# Install dependencies
npm install

# Set up your environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Usage

### Basic Workflow

1. **Source Data** — Paste your JSON directly into the left panel or upload a `.json` file
2. **Target Structure** — Define your desired output schema using JSON Schema format or provide an example object
3. **Configure Settings** — Select your preferred AI model and set the token limit
4. **Transform** — Click the **Convert & Translate** button to process your data
5. **Export** — Download the transformed JSON or copy it to your clipboard

### Example: Academic Data Conversion

**Input (Spanish):**
```json
[
  {
    "id": 101,
    "nombre": "Licenciatura en Ciencias de la Computación",
    "requisitos": { "promedio_minimo": 3.5, "examen": "SAT > 1200" },
    "cursos": [{ "titulo": "Algoritmos", "desc": "Intro a algoritmos" }]
  }
]
```

**Target Schema (English structure with specific fields):**
The AI will transform this into a comprehensive academic data format with undergraduate/graduate programs, admission requirements, fee structures, core courses, and scholarships.

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `API_KEY` | Alternative key variable (used in build) | Optional |

### Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `gemini-3-pro-preview` | Most capable model | Complex transformations, large datasets |
| `gemini-3-flash-preview` | Fast and efficient | Quick conversions, smaller data |
| `gemini-2.5-flash-latest` | Latest flash model | Balanced speed and quality |

### Token Limits

Adjust the token limit based on your data size:
- **Small datasets (< 1MB)**: 8,192 tokens
- **Medium datasets (1-5MB)**: 32,768 tokens  
- **Large datasets (> 5MB)**: 131,072+ tokens

> ⚠️ If you encounter token limit errors, try increasing the limit or splitting your data into smaller chunks.

---

## 🏗️ Architecture

```
json-alchemist/
├── components/           # React UI components
│   ├── Header.tsx       # App header with branding
│   ├── JsonEditor.tsx   # JSON input/output editor
│   └── Button.tsx       # Reusable button component
├── services/
│   └── geminiService.ts # Google Gemini API integration
├── App.tsx              # Main application logic
├── types.ts             # TypeScript type definitions
├── index.html           # Entry HTML with Tailwind CDN
└── vite.config.ts       # Vite build configuration
```

### Tech Stack

- **Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google GenAI SDK
- **Icons**: Lucide React
- **Fonts**: Inter + JetBrains Mono

---

## 🔒 Data Processing Guarantees

The AI transformation engine ensures:

1. **Zero Data Loss** — Every item from the source is converted
2. **No Summarization** — Full dataset processing without truncation
3. **Intelligent Translation** — Context-aware translation preserving nuance
4. **Valid JSON Output** — Always returns properly formatted JSON
5. **Minified Format** — Optimized output for maximum data throughput

---

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Building for Production

```bash
npm run build
```

The production files will be generated in the `dist/` directory.

---

## 📝 License

This project is open source. See the repository for license details.

---

## 🙏 Acknowledgments

- Built with [Google Gemini AI](https://ai.google.dev/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">

**[⬆ Back to Top](#-json-alchemist)**

Made with 💜 and AI magic

</div>
