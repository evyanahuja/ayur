import {spawn} from 'node:child_process';import {resolve} from 'node:path';import {writeFile} from 'node:fs/promises';import {chromium} from 'playwright';
const dir=resolve(process.env.AYURDOC_DIR || '/tmp/ayur-clean/ayurdoc');const base='http://localhost:4174';
const server=spawn(process.execPath,[resolve(dir,'node_modules/next/dist/bin/next'),'start','--port','4174'],{cwd:dir,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},stdio:'ignore'});
let browser;const out=[];
const checks=[
 ['/treatments/suvarnaprashan-safety-quality',['गुणवत्ता की 6-सूत्री जाँच सूची','चेतावनी संकेत','गुप्त फ़ॉर्मूले'],['The 6-point quality checklist','Red flags','Secret formulas']],
 ['/conditions/adhd-symptoms-by-age',['उम्र के अनुसार ADHD लक्षण'],['ADHD Symptoms by Age: Toddler to Teen','The same condition looks very different']],
 ['/conditions/bedwetting-children',['बिस्तर गीला करना','रात में पेशाब का उपाय'],['Bedwetting in Children (Nocturnal Enuresis)','Why bedwetting happens']],
 ['/ayurvedic-doctor-indore',['इंदौर में आयुर्वेदिक डॉक्टर','पालासिया'],['Indore mein Ayurvedic doctor kaise chunein','Palasia']],
 ['/articles/screen-time-children-ayurveda',['स्क्रीन टाइम कैसे कम करें','आयुर्वेदिक दृष्टि'],['screen time kaise kam kare','Ayurvedic lens']],
];
try{
 let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base)).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,250))}if(!ready)throw Error('server not ready');
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'load'});await page.evaluate(()=>localStorage.setItem('balchikitsa-lang','hi'));await page.reload();
 await page.waitForFunction(()=>document.documentElement.lang==='hi');
 for(const [path,expected,forbidden] of checks){
  await page.goto(base+path,{waitUntil:'load'});await page.waitForFunction(()=>document.documentElement.lang==='hi');await page.locator('main h1').waitFor();
  const text=await page.locator('main').innerText();
  const missing=expected.filter(s=>!text.includes(s));const found=forbidden.filter(s=>text.includes(s));
  out.push({path,ok:missing.length===0&&found.length===0,missing,found});
 }
 await page.goto(base+'/treatments/suvarnaprashan-safety-quality',{waitUntil:'load'});await page.waitForFunction(()=>document.documentElement.lang==='hi');await page.screenshot({path:'/home/user/sandbox/reports/live-seo/fixed-hindi-production.png',fullPage:false});
 console.log(JSON.stringify({out,errors},null,2));
 await writeFile('/home/user/sandbox/reports/live-seo/hindi-production.json',JSON.stringify({checkedAt:new Date().toISOString(),out,errors},null,2));
}finally{await browser?.close();server.kill('SIGTERM')}
