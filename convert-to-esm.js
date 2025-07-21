const fs = require('fs');
const path = require('path');

// Директория с исходным кодом
const srcDir = path.join(__dirname, 'src', 'backend');

// Функция для преобразования файла
function convertFileToESM(filePath) {
  console.log(`Converting ${filePath} to ESM...`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Заменяем require на import
  content = content.replace(/const\s+([\w\s{},]+)\s*=\s*require\(['"]([^'"]+)['"]\)/g, (match, importName, modulePath) => {
    if (importName.includes('{')) {
      // Деструктуризация: const { a, b } = require('module')
      const destructured = importName.trim().replace(/[{}]/g, '');
      return `import { ${destructured} } from '${modulePath}';`;
    } else {
      // Обычный импорт: const module = require('module')
      return `import ${importName.trim()} from '${modulePath}';`;
    }
  });
  
  // Заменяем module.exports на export
  content = content.replace(/module\.exports\s*=\s*([\w{}]+)/g, 'export default $1');
  content = content.replace(/module\.exports\s*=\s*{([^}]+)}/g, (match, exports) => {
    const exportItems = exports.split(',').map(item => {
      const trimmed = item.trim();
      if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':').map(part => part.trim());
        return `export const ${key} = ${value};`;
      }
      return `export const ${trimmed} = ${trimmed};`;
    });
    return exportItems.join('\n');
  });
  
  // Записываем обновленный файл
  fs.writeFileSync(filePath, content, 'utf8');
}

// Рекурсивно обрабатываем все файлы
function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      processDirectory(itemPath);
    } else if (item.endsWith('.ts')) {
      convertFileToESM(itemPath);
    }
  }
}

console.log('Converting backend files to ES modules...');
processDirectory(srcDir);
console.log('Conversion completed!');