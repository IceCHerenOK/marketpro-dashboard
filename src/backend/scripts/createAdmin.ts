import bcrypt from 'bcryptjs';;
import {  db  } from '../database/init';;

async function createAdminUser() {
  const email = 'chubarov.a@azotstore.ru';
  const password = 'icekenrok446';
  const username = 'admin';

  try {
    // Проверяем, существует ли пользователь
    db.get('SELECT id FROM users WHERE email = ?', [email], async function(err: any, row: any) {
      if (err) {
        console.error('Ошибка базы данных:', err);
        process.exit(1);
      }

      if (row) {
        console.log('Пользователь уже существует. Обновляем пароль...');
        
        // Хешируем пароль
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Обновляем пароль
        db.run(
          'UPDATE users SET password_hash = ? WHERE email = ?',
          [hashedPassword, email],
          function(err: any) {
            if (err) {
              console.error('Ошибка обновления пароля:', err);
              process.exit(1);
            }
            
            console.log('Пароль успешно обновлен!');
            process.exit(0);
          }
        );
      } else {
        console.log('Создаем нового администратора...');
        
        // Хешируем пароль
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Создаем пользователя
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function(err: any) {
            if (err) {
              console.error('Ошибка создания пользователя:', err);
              process.exit(1);
            }
            
            console.log('Администратор успешно создан!');
            console.log(`ID: ${(this as any).lastID}`);
            console.log(`Email: ${email}`);
            console.log(`Пароль: ${password}`);
            process.exit(0);
          }
        );
      }
    });
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

// Запускаем функцию создания администратора
createAdminUser();