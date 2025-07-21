const fs = require('fs');
const { createCanvas } = require('canvas');

// Создаем canvas 256x256
const canvas = createCanvas(256, 256);
const ctx = canvas.getContext('2d');

// Фон
ctx.fillStyle = '#1e40af';
ctx.fillRect(0, 0, 256, 256);

// Белый круг в центре
ctx.fillStyle = '#ffffff';
ctx.beginPath();
ctx.arc(128, 128, 80, 0, 2 * Math.PI);
ctx.fill();

// Текст "MP"
ctx.fillStyle = '#1e40af';
ctx.font = 'bold 60px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('MP', 128, 128);

// Сохраняем как PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('assets/icon.png', buffer);

console.log('✅ PNG иконка 256x256 создана: assets/icon.png');