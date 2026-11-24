require('dotenv').config();
const express=require('express'),mongoose=require('mongoose'),bcrypt=require('bcryptjs'),jwt=require('jsonwebtoken'),cookies=require('cookie-parser'),multer=require('multer'),path=require('path'),fs=require('fs');
const SECRET=process.env.JWT_SECRET||'dev-secret-change-me',API='https://www.themealdb.com/api/json/v1/1';
const Fav=new mongoose.Schema({id:String,name:String,thumb:String,area:String},{_id:false});
const User=mongoose.model('User',new mongoose.Schema({name:String,email:{type:String,unique:true,lowercase:true},password:String,favorites:[Fav]}));
const Recipe=mongoose.model('Recipe',new mongoose.Schema({name:String,area:String,category:String,thumb:String,instructions:String,youtube:String,seed:Boolean,source:String,status:String,author:String,owner:String,ingredients:[{_id:false,item:String,measure:String}]},{timestamps:true}));
fs.mkdirSync('public/uploads',{recursive:true});
const upload=multer({storage:multer.diskStorage({destination:'public/uploads',filename:(q,f,cb)=>cb(null,Date.now()+path.extname(f.originalname).toLowerCase().slice(0,5))}),limits:{fileSize:5e6},fileFilter:(q,f,cb)=>cb(null,/^image\/(jpeg|png|webp|gif)$/.test(f.mimetype))});
const card=r=>({id:String(r._id),name:r.name,area:r.area,category:r.category,thumb:r.thumb,status:r.status||'approved'});
const ok={status:{$ne:'pending'}};
const isAdmin=u=>!!u&&!!process.env.ADMIN_EMAIL&&u.email===process.env.ADMIN_EMAIL.trim().toLowerCase();
const adminOnly=(q,s,n)=>isAdmin(q.user)?n():s.status(403).json({error:'Admins only'});
const mcard=m=>({id:'m-'+m.idMeal,name:m.strMeal,area:m.strArea||'',category:m.strCategory||'',thumb:m.strMealThumb});
const get=async u=>{try{const r=await fetch(u);return r.ok?await r.json():{}}catch{return{}}};
const full=m=>({...mcard(m),instructions:m.strInstructions,youtube:m.strYoutube,ingredients:Array.from({length:20},(_,i)=>({item:(m['strIngredient'+(i+1)]||'').trim(),measure:(m['strMeasure'+(i+1)]||'').trim()})).filter(x=>x.item)});
const wrap=f=>(q,s,n)=>f(q,s,n).catch(e=>s.status(400).json({error:e.code===11000?'That email is already registered':e.message}));
const need=(q,s,n)=>q.user?n():s.status(401).json({error:'Please log in first'});
const sign=(s,u)=>s.cookie('token',jwt.sign({id:u._id},SECRET,{expiresIn:'30d'}),{httpOnly:true,sameSite:'lax',maxAge:2592e6});
const dns=require('dns').promises;
const priv=ip=>/^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd|fe80)/i.test(ip);
async function safeFetch(u,hops=0){const url=new URL(u);if(!/^https?:$/.test(url.protocol))throw Error('Please paste a normal web link (https://...)');const{address}=await dns.lookup(url.hostname);if(priv(address))throw Error('That link is not allowed');
const r=await fetch(url,{redirect:'manual',headers:{'User-Agent':'Mozilla/5.0 TheRecipeBot','Accept':'text/html'},signal:AbortSignal.timeout(10000)});
if(r.status>=300&&r.status<400&&r.headers.get('location')){if(hops>3)throw Error('Too many redirects');return safeFetch(new URL(r.headers.get('location'),url).href,hops+1)}
if(!r.ok)throw Error('That website did not let me read the page ('+r.status+')');return{html:(await r.text()).slice(0,2e6),url:url.href}}
const txt=h=>String(h||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&#0?39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const steps=i=>[].concat(i||[]).flatMap(x=>typeof x==='string'?x.split(/\r?\n/):x&&x['@type']==='HowToSection'?steps(x.itemListElement):[x&&(x.text||x.name)]).map(txt).filter(Boolean);
const one=v=>txt([].concat(v||[])[0]);
const img=i=>{i=[].concat(i||[])[0];return typeof i==='string'?i:(i&&i.url)||''};
function recipeFrom(html){const out=[];const walk=n=>{if(Array.isArray(n))return n.forEach(walk);if(n&&typeof n==='object'){if([].concat(n['@type']||[]).includes('Recipe'))out.push(n);else walk(n['@graph']||Object.values(n))}};
for(const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)){try{walk(JSON.parse(m[1]))}catch{}}return out[0]}
const app=express();app.use(express.json(),cookies(),express.static('public'));
app.use(async(q,s,n)=>{try{q.user=await User.findById(jwt.verify(q.cookies.token,SECRET).id)}catch{}n()});

app.get('/api/me',(q,s)=>s.json(q.user?{name:q.user.name,email:q.user.email,admin:isAdmin(q.user)}:null));
app.post('/api/signup',wrap(async(q,s)=>{const{name,email,password}=q.body;if(!name||!email||!(password||'').length>=1||password.length<6)throw Error('Please fill everything in (password: 6+ characters)');const u=await User.create({name,email,password:await bcrypt.hash(password,10)});sign(s,u);s.json({name:u.name})}));
app.post('/api/login',wrap(async(q,s)=>{const u=await User.findOne({email:String(q.body.email||'').toLowerCase()});if(!u||!(await bcrypt.compare(q.body.password||'',u.password)))throw Error('Wrong email or password');sign(s,u);s.json({name:u.name})}));
app.post('/api/logout',(q,s)=>{s.clearCookie('token');s.json({ok:true})});

const S=JSON.parse(fs.readFileSync('starters.json'));
app.get('/api/home',wrap(async(q,s)=>{const all=await Recipe.find(ok).sort('createdAt');s.json({african:[...all.filter(r=>r.seed).map(card),...S.african],basics:S.basics,community:all.filter(r=>!r.seed).reverse().map(card)})}));
app.get('/api/recipes',wrap(async(q,s)=>s.json((await Recipe.find(ok).sort('-createdAt').limit(24)).map(card))));
app.get('/api/search',wrap(async(q,s)=>{const t=String(q.query.q||'').trim();if(!t)return s.json([]);const rx=new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');const[l,d]=await Promise.all([Recipe.find({name:rx,...ok}),get(`${API}/search.php?s=${encodeURIComponent(t)}`)]);s.json([...l.map(card),...(d.meals||[]).map(mcard)])}));
app.get('/api/areas',wrap(async(q,s)=>{const d=await get(`${API}/list.php?a=list`);const l=await Recipe.distinct('area',ok);s.json([...new Set([...l,...(d.meals||[]).map(m=>m.strArea)])].filter(a=>a&&a!=='Unknown').sort())}));
app.get('/api/area/:a',wrap(async(q,s)=>{const a=q.params.a;const[l,d]=await Promise.all([Recipe.find({area:a,...ok}),get(`${API}/filter.php?a=${encodeURIComponent(a)}`)]);s.json([...l.map(card),...(Array.isArray(d.meals)?d.meals:[]).map(m=>({...mcard(m),area:a}))])}));
app.get('/api/recipes/:id',wrap(async(q,s)=>{const id=q.params.id;if(id.startsWith('m-')){const d=await get(`${API}/lookup.php?i=${id.slice(2)}`);return d.meals?s.json(full(d.meals[0])):s.status(404).json({error:'Recipe not found'})}const r=await Recipe.findById(id);if(!r||(r.status==='pending'&&!(q.user&&(r.owner===String(q.user._id)||isAdmin(q.user)))))return s.status(404).json({error:'Recipe not found'});s.json({...card(r),instructions:r.instructions,youtube:r.youtube,ingredients:r.ingredients,author:r.author,source:r.source,mine:!!q.user&&(r.owner===String(q.user._id)||isAdmin(q.user))})}));
app.post('/api/recipes',need,upload.single('photo'),wrap(async(q,s)=>{const b=q.body;if(!b.name||!b.area||!b.instructions)throw Error('Name, cuisine and instructions are required');const r=await Recipe.create({name:b.name.trim(),area:b.area.trim(),category:(b.category||'').trim(),instructions:b.instructions,youtube:b.youtube,thumb:q.file?'/uploads/'+q.file.filename:(/^https?:\/\//i.test(b.photoUrl||'')?b.photoUrl.trim():'/images/placeholder.svg'),ingredients:JSON.parse(b.ingredients||'[]'),author:q.user.name,owner:String(q.user._id),status:isAdmin(q.user)?'approved':'pending',source:/^https?:\/\//i.test(b.source||'')?b.source:''});s.json(card(r))}));
app.delete('/api/recipes/:id',need,wrap(async(q,s)=>{const r=await Recipe.findById(q.params.id);if(!r||(r.owner!==String(q.user._id)&&!isAdmin(q.user)))throw Error('You can only delete your own recipes');await r.deleteOne();s.json({ok:true})}));

app.post('/api/import',need,wrap(async(q,s)=>{const u=String(q.body.url||'').trim();const id=(u.match(/themealdb\.com\/(?:meal\/|.*[?&]i=)(\d+)/i)||[])[1];
if(id){const d=await get(`${API}/lookup.php?i=${id}`);if(!d.meals)throw Error('Recipe not found on TheMealDB');const m=full(d.meals[0]);return s.json({name:m.name,area:m.area||'',category:m.category||'',photoUrl:m.thumb,youtube:m.youtube||'',source:u,ingredients:m.ingredients.map(i=>i.measure?`${i.item} - ${i.measure}`:i.item),instructions:m.instructions||''})}
const{html,url}=await safeFetch(u);const r=recipeFrom(html);if(!r)throw Error("I couldn't find a recipe on that page. Use a link straight to one recipe page, or type it in below.");
s.json({name:txt(r.name),area:one(r.recipeCuisine),category:one(r.recipeCategory),photoUrl:img(r.image),youtube:'',source:url,ingredients:[].concat(r.recipeIngredient||[]).map(txt),instructions:steps(r.recipeInstructions).join('\n')})}));
app.get('/api/pending',need,adminOnly,wrap(async(q,s)=>s.json((await Recipe.find({status:'pending'}).sort('createdAt')).map(card))));
app.post('/api/recipes/:id/approve',need,adminOnly,wrap(async(q,s)=>{await Recipe.findByIdAndUpdate(q.params.id,{status:'approved'});s.json({ok:true})}));
app.get('/api/mine',need,wrap(async(q,s)=>s.json((await Recipe.find({owner:String(q.user._id)}).sort('-createdAt')).map(card))));
app.get('/api/favorites',need,(q,s)=>s.json(q.user.favorites));
app.post('/api/favorites',need,wrap(async(q,s)=>{const{id,name,thumb,area}=q.body;if(!q.user.favorites.some(f=>f.id===id)){q.user.favorites.push({id,name,thumb,area});await q.user.save()}s.json(q.user.favorites)}));
app.delete('/api/favorites/:id',need,wrap(async(q,s)=>{q.user.favorites=q.user.favorites.filter(f=>f.id!==q.params.id);await q.user.save();s.json(q.user.favorites)}));

(async()=>{try{await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/the-recipe',{serverSelectionTimeoutMS:5000})}catch(e){console.error('\nCould not connect to MongoDB. Is it running, or is MONGODB_URI in .env correct?\n',e.message);process.exit(1)}
if(!(await Recipe.countDocuments({seed:true}))){await Recipe.insertMany(JSON.parse(fs.readFileSync('seed-recipes.json')).map(r=>({...r,seed:true,author:'The Recipe kitchen'})));console.log('Added the starter recipes')}
const port=process.env.PORT||3000;app.listen(port,'0.0.0.0',()=>console.log(`The Recipe is running: http://localhost:${port}`))})();
