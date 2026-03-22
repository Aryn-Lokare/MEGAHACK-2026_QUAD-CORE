import db from './packages/database/src/lib/prisma.js';

console.log("Available models on prisma object:");
const keys = Object.keys(db).filter(k => !k.startsWith('_') && typeof db[k] === 'object');
console.log(keys.join(', '));
process.exit(0);
