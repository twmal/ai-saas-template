// Quick script to check users in the database
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { users } = require('./src/drizzle/schemas/users');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function checkUsers() {
  try {
    console.log('🔍 Checking users table...\n');
    
    const allUsers = await db.select().from(users).limit(10);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in the database.');
      console.log('\n📝 This means the Clerk webhook is not syncing users to the database.');
      console.log('   The webhook secret might be incorrect.\n');
    } else {
      console.log(`✅ Found ${allUsers.length} user(s) in the database:\n`);
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.fullName || 'Not set'}`);
        console.log(`   Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
    await pool.end();
    process.exit(1);
  }
}

checkUsers();

