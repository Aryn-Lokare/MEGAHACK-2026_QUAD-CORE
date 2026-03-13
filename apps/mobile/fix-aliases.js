const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function relativeAlias(filePath) {
  const relativeDir = path.dirname(path.relative(rootDir, filePath));
  if (relativeDir === '.') return './';
  const depth = relativeDir.split(path.sep).length;
  let relPath = '';
  for(let i=0; i<depth; i++) {
    relPath += '../';
  }
  return relPath;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.expo' && file !== 'assets') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const relAlias = relativeAlias(fullPath);
      
      let modified = false;
      
      // Specifically target from './ and require('./ and import './
      const regex1 = /from\s+'@\//g;
      if (regex1.test(content)) {
        content = content.replace(regex1, `from '${relAlias}`);
        modified = true;
      }
      
      const regex2 = /require\('@\//g;
      if (regex2.test(content)) {
        content = content.replace(regex2, `require('${relAlias}`);
        modified = true;
      }

      const regex3 = /import\s+'@\//g;
      if (regex3.test(content)) {
        content = content.replace(regex3, `import '${relAlias}`);
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

processDirectory(rootDir);
