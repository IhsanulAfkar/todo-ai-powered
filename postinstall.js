// postinstall.js
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicTinymcePath = path.join(__dirname, 'public', 'tinymce');
const nodeModulesTinymcePath = path.join(__dirname, 'node_modules', 'tinymce');

fse.emptyDirSync(publicTinymcePath);

fse.copySync(nodeModulesTinymcePath, publicTinymcePath, {
  overwrite: true,
  dereference: true,
});

console.log('✅ Copied tinymce to public/tinymce');
