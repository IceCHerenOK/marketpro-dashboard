const fs = require('fs');
const path = require('path');

// Создаем директорию dist/backend если её нет
const distDir = path.join(__dirname, 'dist', 'backend');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Копируем все JS файлы из src/backend в dist/backend
function copyFiles(srcDir, destDir) {
  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Пропускаем директорию scripts
      if (item === 'scripts') continue;

      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFiles(srcPath, destPath);
    } else if (item.endsWith('.ts')) {
      // Копируем TypeScript файлы как JS (простая замена расширения)
      const jsContent = fs.readFileSync(srcPath, 'utf8');
      const jsPath = destPath.replace('.ts', '.js');
      fs.writeFileSync(jsPath, jsContent);
      console.log(`Copied: ${srcPath} -> ${jsPath}`);
    } else {
      // Копируем остальные файлы как есть
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

console.log('Building backend...');
copyFiles(path.join(__dirname, 'src', 'backend'), distDir);
console.log('Backend build completed!');