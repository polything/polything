/**
 * Test script to check if themerain_* meta fields are exposed via REST API
 */

const testThemerainFields = async (siteUrl) => {
  console.log(`Testing themerain_* fields for: ${siteUrl}`);
  
  try {
    // Test project endpoint
    const projectResponse = await fetch(`${siteUrl}/wp-json/wp/v2/project?per_page=1`);
    if (!projectResponse.ok) {
      console.error('Failed to fetch projects:', projectResponse.status);
      return;
    }
    
    const projects = await projectResponse.json();
    if (projects.length === 0) {
      console.log('No projects found');
      return;
    }
    
    const project = projects[0];
    console.log(`\nTesting project: ${project.title.rendered} (ID: ${project.id})`);
    
    // Get full project details
    const projectDetailResponse = await fetch(`${siteUrl}/wp-json/wp/v2/project/${project.id}`);
    if (!projectDetailResponse.ok) {
      console.error('Failed to fetch project details:', projectDetailResponse.status);
      return;
    }
    
    const projectDetail = await projectDetailResponse.json();
    console.log('\n=== PROJECT DETAILS ===');
    console.log('Available keys:', Object.keys(projectDetail));
    
    // Check for meta object
    if (projectDetail.meta) {
      console.log('\n=== META FIELDS ===');
      console.log('Meta keys:', Object.keys(projectDetail.meta));
      
      // Look for themerain fields
      const themerainFields = Object.keys(projectDetail.meta).filter(key => key.startsWith('themerain_'));
      if (themerainFields.length > 0) {
        console.log('✅ Found themerain fields:', themerainFields);
        themerainFields.forEach(field => {
          console.log(`  ${field}: ${projectDetail.meta[field]}`);
        });
      } else {
        console.log('❌ No themerain_* fields found in meta');
      }
    } else {
      console.log('❌ No meta object found');
    }
    
    // Check if themerain fields are at the root level
    const rootThemerainFields = Object.keys(projectDetail).filter(key => key.startsWith('themerain_'));
    if (rootThemerainFields.length > 0) {
      console.log('\n✅ Found themerain fields at root level:', rootThemerainFields);
      rootThemerainFields.forEach(field => {
        console.log(`  ${field}: ${projectDetail[field]}`);
      });
    }
    
    // Test a few specific themerain fields
    const expectedFields = [
      'themerain_hero_title',
      'themerain_hero_subtitle', 
      'themerain_hero_image',
      'themerain_project_link_url'
    ];
    
    console.log('\n=== FIELD TESTING ===');
    expectedFields.forEach(field => {
      const value = projectDetail.meta?.[field] || projectDetail[field];
      console.log(`${field}: ${value !== undefined ? `✅ ${value}` : '❌ Not found'}`);
    });
    
  } catch (error) {
    console.error('Error testing themerain fields:', error.message);
  }
};

// Run the test
const siteUrl = process.argv[2] || 'https://polything.co.uk';
testThemerainFields(siteUrl);
