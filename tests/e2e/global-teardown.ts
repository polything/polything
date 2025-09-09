import { FullConfig } from '@playwright/test'

/**
 * Global Teardown for Playwright E2E Tests
 * 
 * This file runs after all tests and cleans up the testing environment.
 * It includes MCP server shutdown and cleanup operations.
 */

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...')
  
  // Stop MCP server
  await stopMCPServer()
  
  // Clean up test artifacts
  await cleanupTestArtifacts()
  
  // Generate test report
  await generateTestReport()
  
  console.log('✅ Global teardown completed successfully')
}

async function stopMCPServer() {
  console.log('🛑 Stopping MCP server...')
  
  try {
    // Try to gracefully shutdown MCP server
    const response = await fetch('http://localhost:8080/shutdown', {
      method: 'POST'
    })
    
    if (response.ok) {
      console.log('✅ MCP server stopped gracefully')
    }
  } catch (error) {
    console.log('⚠️ MCP server shutdown endpoint not available, using process cleanup...')
    
    // Kill any remaining MCP processes
    const { exec } = require('child_process')
    exec('pkill -f "@playwright/mcp"', (error) => {
      if (error) {
        console.log('⚠️ No MCP processes found to kill')
      } else {
        console.log('✅ MCP processes terminated')
      }
    })
  }
}

async function cleanupTestArtifacts() {
  console.log('🗑️ Cleaning up test artifacts...')
  
  const fs = require('fs')
  const path = require('path')
  
  try {
    // Clean up old test results
    const testResultsDir = path.join(process.cwd(), 'test-results')
    if (fs.existsSync(testResultsDir)) {
      const files = fs.readdirSync(testResultsDir)
      const oldFiles = files.filter(file => {
        const filePath = path.join(testResultsDir, file)
        const stats = fs.statSync(filePath)
        const dayInMs = 24 * 60 * 60 * 1000
        return Date.now() - stats.mtime.getTime() > dayInMs
      })
      
      oldFiles.forEach(file => {
        const filePath = path.join(testResultsDir, file)
        fs.unlinkSync(filePath)
        console.log(`🗑️ Removed old test artifact: ${file}`)
      })
    }
    
    console.log('✅ Test artifacts cleaned up')
  } catch (error) {
    console.log('⚠️ Error cleaning up test artifacts:', error.message)
  }
}

async function generateTestReport() {
  console.log('📊 Generating test report...')
  
  try {
    const fs = require('fs')
    const path = require('path')
    
    // Read test results
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json')
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
      
      // Generate summary report
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        suites: results.suites?.length || 0
      }
      
      // Write summary report
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json')
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
      
      console.log('📊 Test Summary:')
      console.log(`   Total Tests: ${summary.totalTests}`)
      console.log(`   Passed: ${summary.passed}`)
      console.log(`   Failed: ${summary.failed}`)
      console.log(`   Skipped: ${summary.skipped}`)
      console.log(`   Duration: ${summary.duration}ms`)
      console.log(`   Suites: ${summary.suites}`)
    }
    
    console.log('✅ Test report generated')
  } catch (error) {
    console.log('⚠️ Error generating test report:', error.message)
  }
}

export default globalTeardown
