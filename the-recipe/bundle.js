// Packs everything in /public into static-bundle.json so the site also works on Vercel,
// where the server (not the folder) has to hand out the page, CSS, JS and images.
const fs=require('fs'),path=require('path'),out={};
(function walk(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory()){if(f!=='uploads')walk(p)}else out['/'+path.relative('public',p).split(path.sep).join('/')]=fs.readFileSync(p).toString('base64')}})('public');
fs.writeFileSync('static-bundle.json',JSON.stringify(out));console.log('Bundled',Object.keys(out).length,'files from public/');
