/**
 * Test script for the Polything Meta Diagnostic endpoint
 */

const testDiagnosticEndpoint = async (siteUrl, projectId) => {
  console.log(`Testing diagnostic endpoint for: ${siteUrl}`);
  console.log(`Project ID: ${projectId}`);
  
  const endpoint = `${siteUrl}/wp-json/polything/v1/themerain-meta/${projectId}`;
  console.log(`Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS! Diagnostic endpoint is working');
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.found_keys && data.found_keys.length > 0) {
        console.log(`\n🎉 Found ${data.found_keys.length} themerain_* fields:`);
        data.found_keys.forEach(key => {
          console.log(`  - ${key}: ${data.meta[key]}`);
        });
      } else {
        console.log('\n❌ No themerain_* fields found in database');
      }
      
      return data;
    } else {
      const errorData = await response.json();
      console.log(`\n❌ Endpoint returned error: ${response.status}`);
      console.log('Error:', JSON.stringify(errorData, null, 2));
      
      if (errorData.code === 'rest_no_route') {
        console.log('\n💡 The diagnostic plugin may not be activated yet.');
        console.log('   Please check:');
        console.log('   1. Plugin is activated in WordPress Admin → Plugins');
        console.log('   2. Plugin code is saved/updated');
        console.log('   3. Wait 1-2 minutes for changes to take effect');
      }
      
      return null;
    }
  } catch (error) {
    console.error('Network error:', error.message);
    return null;
  }
};

const testBothSites = async () => {
  const sites = [
    { name: 'Polything', url: 'https://polything.co.uk', projectId: 10680 },
    { name: 'Mightybooth', url: 'https://mightybooth.com', projectId: 1615 }
  ];
  
  for (const site of sites) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Testing ${site.name.toUpperCase()}`);
    console.log(`${'='.repeat(50)}`);
    
    await testDiagnosticEndpoint(site.url, site.projectId);
    
    // Wait a moment between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Run the test
testBothSites();
