import { chromium, FullConfig } from '@playwright/test'

/**
 * Global Setup for Playwright E2E Tests
 * 
 * This file runs before all tests and sets up the testing environment.
 * It includes MCP server initialization and environment validation.
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...')
  
  // Start MCP server if not already running
  await startMCPServer()
  
  // Validate environment
  await validateEnvironment()
  
  // Pre-warm the application
  await preWarmApplication()
  
  console.log('✅ Global setup completed successfully')
}

async function startMCPServer() {
  console.log('🔧 Starting MCP server...')
  
  try {
    // Check if MCP server is already running
    const response = await fetch('http://localhost:8080/health')
    if (response.ok) {
      console.log('✅ MCP server is already running')
      return
    }
  } catch (error) {
    console.log('⚠️ MCP server not running, starting new instance...')
  }
  
  // Start MCP server
  const { spawn } = require('child_process')
  const mcpProcess = spawn('npx', ['@playwright/mcp', '--config=mcp-config.json'], {
    stdio: 'pipe',
    detached: true
  })
  
  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 5000))
  
  console.log('✅ MCP server started successfully')
}

async function validateEnvironment() {
  console.log('🔍 Validating testing environment...')
  
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Test basic connectivity
    await page.goto('http://localhost:3000', { timeout: 30000 })
    
    // Check if the application is running
    const title = await page.title()
    if (!title) {
      throw new Error('Application not responding')
    }
    
    console.log(`✅ Application is running with title: ${title}`)
    
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

async function preWarmApplication() {
  console.log('🔥 Pre-warming application...')
  
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Pre-warm critical pages
    const criticalPages = [
      '/',
      '/work',
      '/blog',
      '/services/marketing-strategy'
    ]
    
    for (const path of criticalPages) {
      try {
        await page.goto(`http://localhost:3000${path}`, { timeout: 15000 })
        console.log(`✅ Pre-warmed: ${path}`)
      } catch (error) {
        console.log(`⚠️ Failed to pre-warm: ${path}`, error.message)
      }
    }
    
  } finally {
    await browser.close()
  }
}

export default globalSetup
