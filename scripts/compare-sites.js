/**
 * Compare themerain field exposure between polything.co.uk and mightybooth.com
 */

const compareSites = async () => {
  const sites = [
    { name: 'Polything', url: 'https://polything.co.uk' },
    { name: 'Mightybooth', url: 'https://mightybooth.com' }
  ];

  for (const site of sites) {
    console.log(`\n=== ${site.name.toUpperCase()} ===`);
    
    try {
      // Get a project
      const projectResponse = await fetch(`${site.url}/wp-json/wp/v2/project?per_page=1`);
      if (!projectResponse.ok) {
        console.error(`Failed to fetch projects from ${site.name}:`, projectResponse.status);
        continue;
      }
      
      const projects = await projectResponse.json();
      if (projects.length === 0) {
        console.log(`No projects found on ${site.name}`);
        continue;
      }
      
      const project = projects[0];
      console.log(`Project: ${project.title.rendered} (ID: ${project.id})`);
      
      // Get full project details
      const projectDetailResponse = await fetch(`${site.url}/wp-json/wp/v2/project/${project.id}`);
      if (!projectDetailResponse.ok) {
        console.error(`Failed to fetch project details from ${site.name}:`, projectDetailResponse.status);
        continue;
      }
      
      const projectDetail = await projectDetailResponse.json();
      
      // Check for ACF object
      if (projectDetail.acf) {
        console.log('✅ ACF object found');
        console.log('ACF keys:', Object.keys(projectDetail.acf));
        
        // Look for themerain fields in ACF
        const themerainFields = Object.keys(projectDetail.acf).filter(key => key.startsWith('themerain_'));
        if (themerainFields.length > 0) {
          console.log('✅ Themerain fields in ACF:', themerainFields);
          themerainFields.forEach(field => {
            console.log(`  ${field}: ${projectDetail.acf[field]}`);
          });
        } else {
          console.log('❌ No themerain_* fields in ACF');
        }
      } else {
        console.log('❌ No ACF object found');
      }
      
      // Check meta object
      if (projectDetail.meta) {
        console.log('Meta keys:', Object.keys(projectDetail.meta));
        
        const themerainFields = Object.keys(projectDetail.meta).filter(key => key.startsWith('themerain_'));
        if (themerainFields.length > 0) {
          console.log('✅ Themerain fields in meta:', themerainFields);
        } else {
          console.log('❌ No themerain_* fields in meta');
        }
      }
      
      // Check root level
      const rootThemerainFields = Object.keys(projectDetail).filter(key => key.startsWith('themerain_'));
      if (rootThemerainFields.length > 0) {
        console.log('✅ Themerain fields at root level:', rootThemerainFields);
      }
      
    } catch (error) {
      console.error(`Error testing ${site.name}:`, error.message);
    }
  }
};

compareSites();
