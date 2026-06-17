import fs from 'fs';
import path from 'path';
import * as babel from '@babel/core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../frontend/src');
const destDir = path.resolve(__dirname, 'src');

// Limpiar la carpeta src actual de cliente y crearla de nuevo
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

function processDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    
    // Ignorar la carpeta types
    if (entry.isDirectory() && entry.name === 'types') {
      continue;
    }

    if (entry.isDirectory()) {
      const destPath = path.join(dest, entry.name);
      fs.mkdirSync(destPath, { recursive: true });
      processDirectory(srcPath, destPath);
    } else {
      let destPath = path.join(dest, entry.name);
      
      if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        // Transpilar usando Babel para remover tipos de TypeScript
        const code = fs.readFileSync(srcPath, 'utf8');
        
        try {
          const result = babel.transformSync(code, {
            filename: srcPath,
            presets: [
              ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
            ],
          // Retener el JSX, solo remover los tipos de TS
          plugins: ['@babel/plugin-syntax-jsx'],
          retainLines: true,
          compact: false,
        });

        // Reemplazar las extensiones en los imports
        let finalCode = result.code.replace(/\.tsx(['"])/g, '.js$1').replace(/\.ts(['"])/g, '.js$1');

        // Cambiar extensión a .js
        destPath = destPath.replace(/\.tsx?$/, '.js').replace(/\.ts$/, '.js');
        fs.writeFileSync(destPath, finalCode, 'utf8');
        console.log(`Transpiled: ${entry.name} -> ${path.basename(destPath)}`);
        } catch (error) {
          console.error(`Error transpiling ${srcPath}:`, error.message);
        }
      } else {
        // Copiar el archivo original (css, png, svg)
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${entry.name}`);
      }
    }
  }
}

processDirectory(sourceDir, destDir);
console.log('Migración completada!');
