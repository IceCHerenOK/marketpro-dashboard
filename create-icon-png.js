const fs = require('fs');
const path = require('path');

// Создаем простой ICO файл (заголовок + 32x32 пиксельное изображение)
// Это упрощенная версия для демонстрации
function createSimpleICO() {
  // ICO заголовок (6 байт)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // Reserved (должно быть 0)
  header.writeUInt16LE(1, 2);     // Type (1 для ICO)
  header.writeUInt16LE(1, 4);     // Count (количество изображений)

  // Директория записи (16 байт)
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0);     // Width (32 пикселя)
  dirEntry.writeUInt8(32, 1);     // Height (32 пикселя)
  dirEntry.writeUInt8(0, 2);      // Color count (0 для true color)
  dirEntry.writeUInt8(0, 3);      // Reserved
  dirEntry.writeUInt16LE(1, 4);   // Color planes
  dirEntry.writeUInt16LE(32, 6);  // Bits per pixel
  dirEntry.writeUInt32LE(4096, 8); // Size of image data
  dirEntry.writeUInt32LE(22, 12); // Offset to image data

  // Создаем простое 32x32 изображение (BMP формат)
  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0);    // Header size
  bmpHeader.writeInt32LE(32, 4);     // Width
  bmpHeader.writeInt32LE(64, 8);     // Height (32*2 для маски)
  bmpHeader.writeUInt16LE(1, 12);    // Planes
  bmpHeader.writeUInt16LE(32, 14);   // Bits per pixel
  bmpHeader.writeUInt32LE(0, 16);    // Compression
  bmpHeader.writeUInt32LE(4096, 20); // Image size

  // Создаем простое изображение (градиент от синего к фиолетовому)
  const imageData = Buffer.alloc(4096); // 32x32x4 байта (BGRA)
  
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const offset = (y * 32 + x) * 4;
      
      // Создаем градиент
      const ratio = x / 31;
      const blue = Math.floor(229 * (1 - ratio) + 125 * ratio);   // От 229 до 125
      const green = Math.floor(70 * (1 - ratio) + 60 * ratio);    // От 70 до 60
      const red = Math.floor(79 * (1 - ratio) + 237 * ratio);     // От 79 до 237
      
      // Создаем круглую форму
      const centerX = 16, centerY = 16;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const alpha = distance <= 15 ? 255 : 0;
      
      imageData[offset] = blue;      // B
      imageData[offset + 1] = green; // G
      imageData[offset + 2] = red;   // R
      imageData[offset + 3] = alpha; // A
    }
  }

  // AND маска (все нули для прозрачности)
  const andMask = Buffer.alloc(128); // 32x32/8 = 128 байт

  // Объединяем все части
  const icoFile = Buffer.concat([header, dirEntry, bmpHeader, imageData, andMask]);
  
  return icoFile;
}

// Создаем и сохраняем ICO файл
const icoData = createSimpleICO();
fs.writeFileSync(path.join(__dirname, 'assets', 'icon.ico'), icoData);

console.log('✅ ICO файл создан: assets/icon.ico');
console.log('📦 Готово для сборки Electron приложения!');