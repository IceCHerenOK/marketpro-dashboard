import bcrypt from 'bcryptjs';
import initDatabase, { db } from '../database/init';

async function createAdminUser() {
  const email = 'chubarov.a@azotstore.ru';
  const password = 'icekenrok446';
  const username = 'admin';

  try {
    await initDatabase();

    db.get('SELECT id FROM users WHERE email = ?', [email], async function (err: any, row: any) {
      if (err) {
        console.error('Database error:', err);
        process.exit(1);
      }

      if (row) {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          'UPDATE users SET password_hash = ? WHERE email = ?',
          [hashedPassword, email],
          function (updateErr: any) {
            if (updateErr) {
              console.error('Failed to update password:', updateErr);
              process.exit(1);
            }
            console.log('Admin password updated.');
            process.exit(0);
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function (insertErr: any) {
            if (insertErr) {
              console.error('Failed to create admin user:', insertErr);
              process.exit(1);
            }
            console.log(`Admin created: ${email}`);
            process.exit(0);
          }
        );
      }
    });
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
