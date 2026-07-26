# urfa-web-app

## Overview
The **urfa-web-app** is a scalable web application designed to showcase and sell 3D products. Built with a modern tech stack, it allows for easy updates and feature additions while ensuring fast performance.

## Tech Stack
- **Frontend**: React with TypeScript
- **State Management**: Redux
- **Routing**: React Router
- **3D Rendering**: Three.js
- **Build Tool**: Vite

## Features
- Responsive layout with a header and footer
- Product listing with individual product cards
- 3D product visualization
- Shopping cart functionality
- API integration for product data

## Project Structure
```
urfa-web-app
├── public
│   └── favicon.svg
├── src
│   ├── components
│   │   ├── layout
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── product
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductList.tsx
│   │   └── three
│   │       ├── ProductScene.tsx
│   │       └── ModelViewer.tsx
│   ├── features
│   │   ├── cart
│   │   │   ├── cartSlice.ts
│   │   │   └── CartView.tsx
│   │   └── products
│   │       ├── productApi.ts
│   │       └── productsSlice.ts
│   ├── hooks
│   │   └── useProductLoader.ts
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── ProductPage.tsx
│   │   └── NotFound.tsx
│   ├── styles
│   │   └── globals.css
│   ├── utils
│   │   └── formatPrice.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started
1. Clone the repository:
   ```
   git clone https://github.com/manueldinisjunior/urfa.git
   ```
2. Navigate to the project directory:
   ```
   cd urfa-web-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.