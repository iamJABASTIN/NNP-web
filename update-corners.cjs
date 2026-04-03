const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;
            
            // Replace various rounded utility classes with rounded-none
            content = content.replace(/rounded-(xl|2xl|3xl|md|sm|lg|full)/g, 'rounded-none');
            // Remove bare 'rounded ' which might be leftover
            content = content.replace(/\brounded\b/g, 'rounded-none');
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Finished updating rounded corners.');
