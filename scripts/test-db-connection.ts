#!/usr/bin/env tsx

/**
 * Test database connection and user table
 * Run with: npx tsx scripts/test-db-connection.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') })

import { db } from '@/lib/db'
import { users } from '@/drizzle/schemas'
import { logger } from '@/lib/logger'

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...\n')

    // Test 1: Basic connection
    console.log('Test 1: Basic database connection')
    await db.execute('SELECT 1')
    console.log('✅ Database connection successful\n')

    // Test 2: Check if users table exists
    console.log('Test 2: Check users table')
    const result = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `)
    console.log('✅ Users table exists:', (result as any).rows[0]?.exists || false, '\n')

    // Test 3: Count users
    console.log('Test 3: Count users in database')
    const userCount = await db.select().from(users)
    console.log(`✅ Total users in database: ${userCount.length}\n`)

    // Test 4: Show sample users (if any)
    if (userCount.length > 0) {
      console.log('Sample users:')
      userCount.slice(0, 3).forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (${user.id})`)
      })
      console.log()
    } else {
      console.log('⚠️  No users found in database\n')
    }

    // Test 5: Check table structure
    console.log('Test 4: Users table structure')
    const tableInfo = await db.execute(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `)
    console.log('✅ Table columns:')
    ;(tableInfo as any).rows.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })

    console.log('\n✅ All database tests passed!')
  } catch (error) {
    console.error('❌ Database test failed:', error)
    logger.error('Database test failed:', error as Error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

testDatabaseConnection()

