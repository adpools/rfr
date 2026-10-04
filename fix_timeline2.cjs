const fs = require('fs');
const file = 'src/data/timelineData.ts';
let data = fs.readFileSync(file, 'utf8');

// Replace all /images/thumbnails/... with Google Drive Thumbnail API
data = data.replace(/['"]\/images\/thumbnails\/([a-zA-Z0-9_-]+)\.jpg['"]/g, "'https://drive.google.com/thumbnail?id=$1&sz=w1200'");

fs.writeFileSync(file, data);
console.log('Fixed thumbnails');
