import { initDatabase, seedDatabase, getDatabaseStats, DB_PATH } from './db.js';

const shouldReset = process.argv.includes('--reset');

initDatabase();
seedDatabase({ reset: shouldReset });

const stats = getDatabaseStats();
console.log('=========================================');
console.log('SQLite Sample Database Ready!');
console.log(`Location: ${DB_PATH}`);
console.log('Table Row Counts:', JSON.stringify(stats, null, 2));
console.log('=========================================');
