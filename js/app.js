/* ───────── language ───────── */
const KEY='iadb-stage-checklist-v1';
let S={lang:'ar',project:'',checks:{},status:{},notes:{},q:{},hideDone:false,view:'home',stage:'1',vars:{},brief:{},bprep:{},bflags:{},pf:{stage:'all',type:'all',q:''},mf:{cat:'all',space:-1,q:'',sort:'def'},cmp:[],calc:null,pcheck:{}};
try{const raw=localStorage.getItem(KEY); if(raw) S=Object.assign(S,JSON.parse(raw));}catch(e){}
const isEn=()=>S.lang==='en';
const L=(a,e)=>isEn()?e:a;

/* ───────── constants ───────── */
const GATES = [
  {k:'Understand',ar:'يعتمد فهم المشروع',en:'Approves project understanding'},{k:'Plan',ar:'يعتمد التوزيع',en:'Approves the layout'},{k:'Imagine',ar:'يعتمد الاتجاه',en:'Approves the direction'},
  {k:'Design',ar:'يعتمد التفاصيل والاختيارات',en:'Approves details and selections'},{k:'Visualize',ar:'يراجع تطابق العرض',en:'Reviews presentation accuracy'},{k:'Document',ar:'يعتمد الوثائق',en:'Approves documents'},{k:'Build',ar:'التنفيذ والتسليم والتعلم',en:'Execution, handover and learning'}
];
const QUALITY = [
  ['الأبعاد تعتمد على رفع موثق أو رسم مقاس. الصور المولدة لا تصلح كمرجع قياس.','Dimensions come from a documented survey or a measured drawing. Generated images are never a measurement reference.'],
  ['الخامات والمنتجات تعتمد على داتا شيت وعينة ومورد؛ وصف AI للعنصر المرئي قائمة أولية.','Materials and products are confirmed by datasheet, sample and supplier; an AI description of what it sees is only a preliminary list.'],
  ['المتطلبات الإنشائية وMEP والسلامة والوصول يراجعها المختص وفق المتطلبات السارية للمشروع. اطلب المرجع ولا تقبل رقم كود غير موثق.','Structural, MEP, safety and accessibility requirements are reviewed by the specialist under the project’s applicable requirements. Ask for the reference and never accept an undocumented code number.'],
  ['أسعار الموردين ومدد التوريد تتأكد بعروض مؤرخة. لا يُسمى رقم تقديري ميزانية شراء معتمدة.','Supplier prices and lead times are confirmed by dated quotations. An estimate is never called an approved purchase budget.'],
  ['نسب الإنجاز تحتاج كميات أو سجلات معتمدة. الصور وحدها توضح ملاحظة بصرية لا مستخلصًا.','Progress percentages need approved quantities or records. Photos alone show a visual observation, not a progress claim.'],
  ['أي تغيير معتمد يحدث الرسومات والنموذج وFF&E وBOQ والجدول المتأثر قبل إصداره للتنفيذ.','Any approved change updates the drawings, model, FF&E, BOQ and affected schedule before it is issued for execution.'],
  ['أزل البيانات الشخصية غير اللازمة قبل رفع الملفات، وراجع إعدادات مشاركة المشروع وفق اتفاق العميل وسياسة المكتب.','Remove unnecessary personal data before uploading files, and review project sharing settings according to the client agreement and studio policy.']
];
const GENERAL_PROMPT = {
 ar:'أنت مساعد لمصمم داخلي في مشروع [اسم أو كود المشروع] من نوع [النوع] في [الموقع]. المستخدمون [الوصف]، النطاق [الخدمة]، الميزانية [قيمة وعملة وما تشمله]، والجدول [المواعيد]. استخدم المرفقات [قائمة وإصدارات]. قبل الإجابة، حدد البيانات الضرورية الناقصة واسأل عنها؛ وإذا أمكن العمل جزئيًا فقدم مسودة مع بيان حدودها. افصل حقائق المصدر عن المقترحات والافتراضات. لا تخترع أبعادًا أو أسعارًا أو مواصفات أو روابط أو متطلبات كود. اذكر المصدر والصفحة أو كود الرسم عند الاستشهاد. اكتب بالعربية مع إبقاء أسماء الأدوات والمصطلحات المهنية بالإنجليزية. اجعل المخرجات قابلة للمراجعة وحدد ما يحتاج اعتماد المصمم أو العميل أو المختص.',
 en:'You are an assistant to an interior designer on project [project name or code], a [project type] in [location]. The users are [description], the scope is [service], the budget is [amount, currency and what it covers], and the schedule is [dates]. Use the attachments [list and versions]. Before answering, identify the essential missing information and ask for it; if partial work is possible, provide a draft and state its limits. Separate source facts from proposals and assumptions. Do not invent dimensions, prices, specifications, links or code requirements. Cite the source and page or drawing code when referencing. Write in English, keeping tool names and professional terms as they are. Make the outputs reviewable and flag what needs approval from the designer, the client or a specialist.'};
const RULE = {ar:'التزم بالمصادر المرفقة. افصل المؤكد عن المقترح والناقص، ولا تخترع أبعادًا أو أسعارًا أو مواصفات. اذكر ما يحتاج مراجعة المصمم قبل الاعتماد.',
 en:'Stick to the attached sources. Separate what is confirmed from what is proposed or missing, and do not invent dimensions, prices or specifications. State what needs the designer’s review before approval.'};
const STATUS = [['draft','مسودة','Draft'],['review','قيد مراجعة','In review'],['approved','معتمد','Approved']];
const stLabel=k=>{const s=STATUS.find(x=>x[0]===k)||STATUS[0];return L(s[1],s[2]);};
const TOTAL = STAGES.reduce((a,s)=>a+s.checklist.length,0);
const DECISION_LOG=[['الهوية','Identity','كود المشروع والمرحلة ورقم القرار وتاريخه','Project code, stage, decision number and date'],['المصدر','Source','اسم الملف وإصداره والصفحة أو الرسم أو عرض السعر','File name and version, page, drawing or quotation'],['القرار','Decision','الخيار المعتمد وسبب الاختيار والبدائل المرفوضة','Approved option, reason for the choice and rejected alternatives'],['الأثر','Impact','رسومات أو بنود أو تكلفة أو مدة تحتاج تحديثًا','Drawings, items, cost or duration that need updating'],['الاعتماد','Approval','اسم صاحب الصلاحية وحالة الاعتماد وتاريخه','Name of the authority, approval status and date'],['المتابعة','Follow-up','مسؤول الإجراء وموعده ودليل الإغلاق','Action owner, due date and proof of closure']];
const CURS={EGP:['ج.م','EGP'],SAR:['ر.س','SAR'],AED:['د.إ','AED'],KWD:['د.ك','KWD'],USD:['$','USD']};
const curL=c=>(CURS[c]||CURS.EGP)[isEn()?1:0];

const I = {
  home:'<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  prompts:'<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M7 8V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V8"/><path d="M8 12.5h8M8 16h5"/>',
  brief:'<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/><path d="M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
  stages:'<path d="M4 6.5l1.5 1.5L8 5.5M4 12.5l1.5 1.5L8 11.5M4 18.5l1.5 1.5L8 17.5"/><path d="M11 7h9M11 13h9M11 19h9"/>',
  materials:'<rect x="3.5" y="3" width="7.5" height="18" rx="1.5"/><path d="M11 7.4l5-2.1a1 1 0 0 1 1.3.55l3.1 7.4a1 1 0 0 1-.55 1.3L11 18.2"/><circle cx="7.25" cy="17" r="1.2"/>',
  pricing:'<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7z"/><circle cx="8" cy="8" r="1.6"/>',
  check:'<path d="M5 12.5l4.2 4.2L19 7"/>',
  x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  trend:'<path d="M4 16.5l5.5-5.5 4 4L20 8.5"/><path d="M15 8.5h5v5"/>'
};
const ico=(k,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;
const CHEV='<svg class="chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 8l5 5 5-5"/></svg>';
const CHECK_SVG='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>';

const BONUSES = [
 {k:'prompts',no:'01',nm:'Prompt Library',stages:'all',
  ar:{t:'مكتبة الأوامر الجاهزة',t2:'مرتبة على مراحل المشروع',tab:'الأوامر الجاهزة',
   one:'أوامر مكتوبة ومجرّبة لكل مرحلة: بناء الـConcept، اختيار الخامات، إخراج العرض النهائي.',
   change:'تخيّل أنك أمام مشروع جديد الآن. بدل أن تجلس أمام صفحة فارغة تحاول صياغة وصف يفهمه الذكاء الاصطناعي، تفتح المرحلة التي تقف عندها وتجد الأمر جاهزًا. تعدّل مساحة العميل ونمطه وتنفّذ.',
   result:'ما كان يأخذ منك ساعة تجريب في كل صورة يصبح خمس دقائق. وفي مشروع فيه ست مساحات، هذا فرق يوم كامل. الأهم أن جودة المخرَج تصبح ثابتة، لأنك لا تعتمد على صياغة ارتجالية تختلف كل مرة.'},
  en:{t:'Ready-Made Prompt Library',t2:'organized by project stage',tab:'Prompts',
   one:'Written, tested prompts for every stage: building the Concept, selecting materials, producing the final presentation.',
   change:'Imagine you’re facing a new project right now. Instead of sitting in front of a blank page trying to write a description the AI will understand, you open the stage you’re at and find the prompt ready. Adjust the client’s space and style, and run it.',
   result:'What used to take you an hour of trial and error per image becomes five minutes. On a project with six spaces, that’s a full day saved. More importantly, output quality becomes consistent, because you no longer rely on improvised wording that changes every time.'}},
 {k:'brief',no:'02',nm:'Client Brief',stages:[1,2,4],
  ar:{t:'نموذج بريف العميل',tab:'بريف العميل',
   one:'أسئلة اللقاء الأول جاهزة، مرتبة بتسلسل يجعل العميل يتحدث دون أن يشعر أنه يخضع لاستجواب.',
   change:'تدخل اللقاء ومعك ورقة منظمة بدل أن تعتمد على ذاكرتك. تسأل بترتيب، فيفتح العميل ويحكي، وتخرج بصورة كاملة عمّا يريده وميزانيته وذوقه ومن يشاركه القرار.',
   result:'أغلب التعديلات المكلفة سببها معلومة لم تُسأل في اللقاء الأول، وتظهر بعد أن تكون قد أنجزت نصف العمل. هذا النموذج يمنعها من الأساس. وله أثر ثانٍ فوري: العميل الذي يراك تعمل بمنهج منظم من أول خمس دقائق يقيّمك بشكل مختلف تمامًا، وهذا وحده يفرق في قرار توقيعه ومقدار ما يقبل دفعه.'},
  en:{t:'Client Brief Template',tab:'Client Brief',
   one:'First-meeting questions ready to go, sequenced so the client opens up without feeling interrogated.',
   change:'You walk into the meeting with an organized sheet instead of relying on memory. You ask in order, the client opens up and talks, and you leave with a complete picture of what they want, their budget, their taste, and who shares the decision.',
   result:'Most costly revisions come from a question that wasn’t asked in the first meeting and surfaces after you’ve done half the work. This template prevents that from the start. It has a second, immediate effect: a client who sees you working with a clear method from the first five minutes values you completely differently, and that alone changes their decision to sign and how much they’re willing to pay.'}},
 {k:'stages',no:'03',nm:'Project Stages Checklist',stages:'all',
  ar:{t:'مراحل المشروع Checklist',tab:'مراحل المشروع',
   one:'مرجع واحد لكل مراحل المشروع من تأهيل العميل حتى التسليم، مع بنود المراجعة والمخرجات وبوابة الاعتماد لكل مرحلة.',
   change:'بدل أن تنتقل بين المراحل حسب ما تتذكره، تعرف أين تقف بالضبط، وما الذي يجب أن يكتمل ويُعتمد قبل أن تبدأ المرحلة التالية.',
   result:'تتوقف عن القفز على مراحل لم تُعتمد، فتقل التعديلات التي تعيدك للخلف. وتستطيع أن تعطي العميل تحديثًا دقيقًا عن موقع مشروعه في أي لحظة، وهذا وحده يرفع ثقته فيك.'},
  en:{t:'Project Stages Checklist',tab:'Project Stages',
   one:'One reference for every project stage, from lead qualification to handover, with review items, deliverables and an approval gate for each stage.',
   change:'Instead of moving between stages based on what you remember, you know exactly where you stand and what must be completed and approved before the next stage begins.',
   result:'You stop jumping ahead of stages that haven’t been approved, so fewer revisions send you backwards. And you can give the client a precise update on where their project stands at any moment, which alone raises their trust in you.'}},
 {k:'materials',no:'04',nm:'Materials Reference Guide',stages:[7,8,10,11,12,14],
  ar:{t:'دليل الخامات المرجعي',tab:'دليل الخامات',
   one:'جدول مرجعي يجمع الخامات الشائعة: خصائصها، معدل تحمّلها، وأين تصلح وأين تفشل.',
   change:'حين تختار خامة لمطبخ أو حمام أو ممر كثير الحركة، تفتح الجدول وتعرف حدودها قبل أن تضعها في التصميم.',
   result:'أسوأ موقف مهني أن يقول لك المنفّذ أمام العميل إن هذا الجزء لا يُنفَّذ. اللحظة هذه لا تكلّفك تعديلًا فقط، بل تكلّفك ثقة العميل في كل ما قدّمته له. الدليل يمنعها. ويوفر عليك سنوات تجربة وخطأ، لأن حدود كل خامة فيه مأخوذة من مشاريع نُفّذت فعلًا لا من كتالوجات الموردين.'},
  en:{t:'Materials Reference Guide',tab:'Materials',
   one:'A reference table of common materials: their properties, durability, and where they work and where they fail.',
   change:'When you choose a material for a kitchen, bathroom or high-traffic corridor, you open the table and know its limits before you put it in the design.',
   result:'The worst professional moment is when the contractor tells you, in front of the client, that this part can’t be built. That moment doesn’t just cost you a revision; it costs you the client’s trust in everything you’ve presented. The guide prevents it, and saves you years of trial and error, because each material’s limits come from projects that were actually built, not from supplier catalogues.'}},
 {k:'pricing',no:'05',nm:'Pricing Guide',stages:[1,12,13],
  ar:{t:'دليل تسعير مشروع التصميم الداخلي',tab:'دليل التسعير',
   one:'كيف تحسب سعرك، وكيف ترد حين يقول العميل «غالي»، وكيف تسعّر حين ينهي الذكاء الاصطناعي عملك في نصف الوقت.',
   change:'يصبح لديك طريقة حساب واضحة تقول بها رقمك بثقة، وردّ جاهز حين يُطلب منك التخفيض، ومنطق تشرح به لماذا سعرك مبني على النتيجة لا على عدد الساعات.',
   result:'هناك مصممون أعمالهم ممتازة ويأخذون نصف ما يستحقون، لأن أحدًا لم يعلّمهم التسعير فيقولون رقمًا مترددًا ثم يخفضونه عند أول اعتراض. وهناك سؤال يقلق كثيرين اليوم: إن أنهيت أسرع بالذكاء الاصطناعي، فهل آخذ أقل؟ الإجابة لا، وهنا تجد السبب وطريقة شرحه للعميل. مشروع واحد تسعّره صح يعيد لك سعر الإيفنت أضعافًا مضاعفة.'},
  en:{t:'Interior Design Project Pricing Guide',tab:'Pricing',
   one:'How to calculate your price, how to respond when the client says “too expensive”, and how to price when AI finishes your work in half the time.',
   change:'You get a clear calculation method so you can state your number with confidence, a ready answer when you’re asked for a discount, and the logic to explain why your price is based on results, not hours.',
   result:'There are designers with excellent work who earn half of what they deserve, because no one taught them pricing, so they say a hesitant number and then drop it at the first objection. And there’s a question worrying many today: if I finish faster with AI, should I charge less? The answer is no, and here you’ll find why and how to explain it to the client. One project priced right pays back the cost of the event many times over.'}}
];
const B=b=>b[isEn()?'en':'ar'];
const inStage=(b,n)=>b.stages==='all'||b.stages.includes(n);

/* ───────── localized data ───────── */
const stg=n=>{const i=n-1;return isEn()?Object.assign({},STAGES[i],STAGES_EN[i]):STAGES[i];};
const stagesL=()=>STAGES.map(s=>stg(s.n));
const MAT_CATS=[{k:'floor',ar:'أرضيات',en:'Flooring'},{k:'surface',ar:'أسطح وكاونترات',en:'Surfaces & Countertops'},{k:'wood',ar:'أخشاب وألواح',en:'Wood & Boards'},{k:'wall',ar:'حوائط وأسقف',en:'Walls & Ceilings'},{k:'fabric',ar:'أقمشة وتنجيد',en:'Fabrics & Upholstery'},{k:'metal',ar:'معادن وزجاج',en:'Metals & Glass'}];
const MAT_SPACES=[{k:0,ar:'مطبخ',en:'Kitchen'},{k:1,ar:'حمام',en:'Bathroom'},{k:2,ar:'مدخل وممر كثيف الحركة',en:'Entrance & busy corridor'},{k:3,ar:'معيشة واستقبال',en:'Living & reception'},{k:4,ar:'غرفة نوم',en:'Bedroom'},{k:5,ar:'خارجي وبلكونات',en:'Outdoor & balconies'},{k:6,ar:'تجاري كثيف الاستخدام',en:'High-traffic commercial'}];
const MAT_PROPS=[{k:0,ar:'مقاومة الماء والرطوبة',en:'Water & moisture'},{k:1,ar:'مقاومة الخدش والتآكل',en:'Scratch & wear'},{k:2,ar:'تحمّل الحرارة',en:'Heat tolerance'},{k:3,ar:'مقاومة البقع',en:'Stain resistance'},{k:4,ar:'سهولة الصيانة',en:'Easy maintenance'}];
const lab=o=>o[isEn()?'en':'ar'];
const mat=i=>{const m=MATERIALS[i];return isEn()?Object.assign({},m,MAT_EN[i],{n:m.en,en:''}):m;};
const SLABEL=v=>({2:L('مناسب','Suitable'),1:L('بحذر','With care'),0:L('تجنّب','Avoid'),'-':L('غير مستخدم عادة','Not typical')})[v];
const briefL=()=>isEn()?BRIEF.map((s,si)=>{const e=BRIEF_EN.sections[si];return Object.assign({},s,{t:e.t,intro:e.intro,qs:s.qs.map((q,qi)=>Object.assign({},q,{why:undefined,follow:undefined,ph:undefined},e.qs[qi]))});}):BRIEF;
const P=()=>isEn()?{principles:PRICE_EN.principles,methods:PRICE_EN.methods.map((m,i)=>Object.assign({},PRICE_METHODS[i],m)),phases:PRICE_EN.phases,objections:PRICE_EN.objections,ai:PRICE_EN.ai,ai_script:PRICE_EN.ai_script,check:PRICE_EN.check,pay:PRICE_EN.pay}
  :{principles:PRICE_PRINCIPLES,methods:PRICE_METHODS,phases:PRICE_PHASES.map(p=>p.t),objections:OBJECTIONS,ai:AI_PRICING,ai_script:AI_SCRIPT,check:PRICE_CHECK,pay:PAY_DEFAULT.map(p=>p.t)};

/* ───────── state migration ───────── */
if(/^(\d+|quality|guide)$/.test(String(S.view))){S.stage=String(S.view);S.view='stages';}
const CALC0={cur:'EGP',over:40000,sal:30000,bh:100,hrs:PRICE_PHASES.map(p=>p.h),margin:30,area:150,rate:900,cx:1,rush:false,exec:2000000,pct:6,pay:PAY_DEFAULT.map(p=>p.p)};
S.calc=Object.assign({},CALC0,S.calc||{});
if(!CURS[S.calc.cur]){const f=Object.keys(CURS).find(k=>CURS[k][0]===S.calc.cur);S.calc.cur=f||'EGP';}
if(!Array.isArray(S.calc.hrs)||S.calc.hrs.length!==PRICE_PHASES.length) S.calc.hrs=CALC0.hrs.slice();
if(!Array.isArray(S.calc.pay)||S.calc.pay.length!==PAY_DEFAULT.length) S.calc.pay=CALC0.pay.slice();
BRIEF.forEach(s=>s.qs.forEach(q=>{const v=S.brief[q.id];
  if(q.type==='choice'&&typeof v==='string'){const k=q.opts.indexOf(v);if(k>=0)S.brief[q.id]=k;else delete S.brief[q.id];}
  if(q.type==='chips'&&Array.isArray(v))S.brief[q.id]=v.map(x=>typeof x==='number'?x:q.opts.indexOf(x)).filter(x=>x>=0);}));

let saveT; function flush(){clearTimeout(saveT);try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function save(){clearTimeout(saveT);saveT=setTimeout(flush,150);}
addEventListener('pagehide',flush); document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();});
const $=s=>document.querySelector(s);
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const fmt=n=>Math.round(n||0).toLocaleString('en-US');
const doneIn=s=>s.checklist.reduce((a,_,i)=>a+(S.checks[s.n+'-'+i]?1:0),0);
const sep=()=>L('، ',', ');

/* ───────── shared UI ───────── */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),1800);}
function writeClip(text,btn){
  const label=btn?btn.textContent:'';
  const done=()=>{if(btn){btn.classList.add('ok');btn.textContent=L('تم النسخ','Copied');setTimeout(()=>{btn.classList.remove('ok');btn.textContent=label;},1600);}toast(L('تم النسخ','Copied'));};
  const fallback=()=>{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}ta.remove();ok?done():toast(L('تعذر النسخ. ظلّل النص وانسخه يدويًا','Copy failed. Select the text and copy it manually'));};
  try{navigator.clipboard.writeText(text).then(done,fallback);}catch(e){fallback();}
}
function bIntro(k){
  const b=BONUSES.find(x=>x.k===k), c=B(b);
  return `<section class="bintro">
    <div class="bicon">${ico(k)}</div>
    <div style="min-width:0">
      <div class="eyeb"><span class="caps">Bonus ${b.no} · ${b.nm}</span></div>
      <h2>${esc(c.t)}${c.t2?`<span style="font-weight:600;color:var(--ink-3)">${L('، ',', ')}${esc(c.t2)}</span>`:''}</h2>
      <p class="lead">${esc(c.one)}</p>
    </div>
    <div class="why2">
      <div class="card soft"><h4><i>${ico('check')}</i>${L('ما الذي يتغيّر عندك','What changes for you')}</h4><p>${esc(c.change)}</p></div>
      <div class="card soft"><h4><i>${ico('trend')}</i>${L('النتيجة العملية','The practical result')}</h4><p>${esc(c.result)}</p></div>
    </div>
  </section>`;
}
function checkRow(id,attr,text,on,idn){
  return `<li class="${on?'is-done':''}"><label class="ck" for="${id}"><input type="checkbox" id="${id}" ${attr} ${on?'checked':''}><span class="box">${CHECK_SVG}</span><span class="txt">${esc(text)}</span>${idn?`<span class="idn">${idn}</span>`:''}</label></li>`;
}

/* ───────── prompts ───────── */
let ALL_PROMPTS=[];
function buildPrompts(){
  ALL_PROMPTS=[{id:'P00',title:L('البرومبت العام للمشروع','General project prompt'),tool:L('Claude أو ChatGPT — مرة واحدة في بداية محادثة المشروع','Claude or ChatGPT — once, at the start of the project chat'),text:GENERAL_PROMPT[S.lang],en:false,n:0,general:true}]
   .concat(...stagesL().map(s=>s.prompts.map(p=>Object.assign({n:s.n},p))));
}
const findPrompt=id=>ALL_PROMPTS.find(p=>p.id===id);
const phsOf=p=>[...new Set([...p.text.matchAll(/\[([^\]]+)\]/g)].map(m=>m[1]))];
const isProjVar=v=>/اسم أو كود المشروع|اسم المشروع|project name/i.test(v);
const varVal=v=>(S.vars[v]||'').trim()||(isProjVar(v)?(S.project||'').trim():'');
const fullText=p=>p.en||p.general?p.text:p.text+'\n\n'+RULE[S.lang];
const filledText=p=>fullText(p).replace(/\[([^\]]+)\]/g,(m,v)=>varVal(v)||m);
function previewHTML(p){return esc(fullText(p)).replace(/\[([^\]]+)\]/g,(m,v)=>{const val=varVal(v);return val?`<mark class="ph" title="${esc(v)}">${esc(val)}</mark>`:`<mark class="ph" style="opacity:.75">[${v}]</mark>`;});}
function promptCard(p,extra=''){
  return `<details class="pr ${extra}" data-pid="${p.id}"><summary><span class="pid">${p.general?'★':p.id}</span><span class="ptl">${esc(p.title)}<small><span>${esc(p.tool)}</span>${p.en?`<span class="tag img">${L('برومبت صورة','Image prompt')}</span>`:''}</small></span>${CHEV}</summary><div class="pr-body"></div></details>`;
}
function fillPromptBody(det){
  const p=findPrompt(det.dataset.pid), body=det.querySelector('.pr-body'); if(!p||body.dataset.ready) return;
  const vars=phsOf(p), textDir=(p.en||isEn())?'ltr':'rtl';
  body.innerHTML=`
    ${vars.length?`<div><p class="hint" style="margin-bottom:8px">${L('املأ الخانات ببيانات مشروعك، والأمر يتحدث تلقائيًا. القيم تُحفظ وتُستخدم في باقي الأوامر.','Fill in your project details and the prompt updates live. Values are saved and reused across the other prompts.')}</p>
    <div class="pr-vars">${vars.map((v,i)=>`<label>${esc(v)}<input class="field" type="text" id="v-${p.id}-${i}" data-var="${esc(v)}" value="${esc(S.vars[v]||'')}" placeholder="${isProjVar(v)&&S.project?esc(S.project):''}" dir="auto"></label>`).join('')}</div></div>`:''}
    <pre class="pr-text" dir="${textDir}">${previewHTML(p)}</pre>
    <div class="pr-foot"><p class="hint">${p.en?L('مخصص للأدوات البصرية: Midjourney أو Magnific.','For visual tools: Midjourney or Magnific.'):L('الخانات غير المملوءة تبقى بين [ ] لتكملها في المحادثة.','Unfilled fields stay in [ ] so you can complete them in the chat.')}</p>
    <div class="acts">${vars.length?`<button class="btn-line" type="button" data-clearvars="${p.id}">${L('مسح الخانات','Clear fields')}</button>`:''}<button class="btn" type="button" data-copyp="${p.id}">${L('نسخ الأمر','Copy prompt')}</button></div></div>`;
  body.dataset.ready='1';
}
function refreshPreviews(){document.querySelectorAll('details.pr[open]').forEach(d=>{const p=findPrompt(d.dataset.pid);const pre=d.querySelector('.pr-text');if(p&&pre)pre.innerHTML=previewHTML(p);});}

/* ───────── chrome: header, tabs, routing ───────── */
function applyLang(){
  const h=document.documentElement; h.lang=S.lang; h.dir=isEn()?'ltr':'rtl';
  document.title='Bonus Design 2030';
  buildPrompts();
  $('#bandSub').textContent=L('حقيبة الأدوات التي ترافقك في كل مرحلة من مشروعك: أوامر جاهزة، بريف منظم، تشيك لست للمراحل، دليل خامات، ودليل تسعير.','The toolkit that stays with you through every stage of your project: ready prompts, a structured brief, a stages checklist, a materials guide and a pricing guide.');
  $('#projL').textContent=L('المشروع','Project');
  $('#proj').placeholder=L('اسم أو كود مشروعك الحالي','Your current project name or code');
  $('#footNote').textContent=L('التقدم والبيانات محفوظة على جهازك فقط، ولا يراها أحد غيرك.','Your progress and entries are saved on your device only. No one else can see them.');
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===S.lang));
}
function scrollTab(){const b=document.querySelector('.tab[aria-current="true"]');if(b&&b.scrollIntoView)try{b.scrollIntoView({block:'nearest',inline:'center'});}catch(e){}}
function renderTabs(){
  const views=[{k:'home',t:L('الرئيسية','Home')}].concat(BONUSES.map(b=>({k:b.k,t:B(b).tab,no:b.no})));
  $('#tabs').innerHTML=views.map(v=>`<button class="tab" type="button" data-view="${v.k}" aria-current="${S.view===v.k}">${ico(v.k)}${v.no?`<span class="tno">${v.no}</span>`:''}<span>${v.t}</span></button>`).join('');
}
function setHash(){const h=S.view==='stages'?(/^\d+$/.test(S.stage)?'s'+S.stage:S.stage):S.view;try{history.replaceState(null,'','#'+h);}catch(e){}}
function go(view,sub){
  S.view=view; if(sub!==undefined) S.stage=String(sub);
  save(); renderTabs(); renderView(); setHash(); scrollTab();
  const top=$('.tabs').offsetTop; if(scrollY>top) scrollTo({top,behavior:'smooth'});
}
function renderView(){
  const v=$('#view');
  if(S.view==='prompts'){v.innerHTML=viewPrompts();renderPromptList();}
  else if(S.view==='brief'){v.innerHTML=viewBrief();refreshBriefNav();}
  else if(S.view==='stages'){v.innerHTML=viewStages();renderStageParts();}
  else if(S.view==='materials'){v.innerHTML=viewMaterials();renderMaterials();}
  else if(S.view==='pricing'){v.innerHTML=viewPricing();renderCalc();}
  else {S.view='home';v.innerHTML=viewHome();}
}

/* ───────── HOME ───────── */
function viewHome(){
  const flow=isEn()?[['The brief','in the first client meeting.'],['The pricing guide','before sending your service proposal.'],['The checklist','to run the project stage by stage.'],['The ready prompts','inside each stage when working with AI.'],['The materials guide','for every material decision before approval.']]
    :[['البريف','في اللقاء الأول مع العميل.'],['دليل التسعير','قبل إرسال عرض الخدمة.'],['التشيك لست','لإدارة المشروع مرحلة بمرحلة.'],['الأوامر الجاهزة','داخل كل مرحلة مع الذكاء الاصطناعي.'],['دليل الخامات','عند كل قرار خامة قبل اعتماده.']];
  return `<section class="hero">
    <div><div class="caps" style="color:var(--blue)">Design 2030 · Bonus Kit</div>
      <h2>${L('كل ما تحتاجه لتدير مشروعك من أول لقاء حتى التسليم','Everything you need to run your project from the first meeting to handover')}</h2>
      <p>${L('خمس أدوات عملية تعمل مع بعضها. كل أداة مرتبطة بالمراحل التي تحتاجها فيها، وكل ما تكتبه أو تعلّم عليه يُحفظ على جهازك لتعود إليه في أي وقت.','Five practical tools that work together. Each tool is linked to the stages where you need it, and everything you write or tick is saved on your device so you can come back to it any time.')}</p></div>
    <ol class="flow">${flow.map(([a,b])=>`<li><span><b>${a}</b> ${b}</span></li>`).join('')}</ol>
  </section>
  <div class="bgrid">${BONUSES.map(b=>`<button class="bcard" type="button" data-view="${b.k}">
     <span class="top"><span class="ic">${ico(b.k)}</span><span class="no">BONUS ${b.no}</span></span>
     <h3>${esc(B(b).t)}</h3><p>${esc(B(b).one)}</p>
     <span class="ft"><span class="val">${b.nm}</span><span class="go">${L('افتح الأداة ←','Open tool →')}</span></span></button>`).join('')}</div>
  <section class="sec">
    <div class="sec-h"><h3>${L('أي أداة تفتح في كل مرحلة؟','Which tool to open at each stage?')} <span class="caps">Stage Map</span></h3><p>${L('اضغط على أي مرحلة لتفتح تفاصيلها وبنودها.','Click any stage to open its details and review items.')}</p></div>
    <div class="scroll-x"><table class="matrix">
      <thead><tr><th>${L('المرحلة','Stage')}</th>${BONUSES.map(b=>`<th>${esc(B(b).tab)}</th>`).join('')}</tr></thead>
      <tbody>${stagesL().map(s=>`<tr data-stage="${s.n}"><td><span class="sn">${pad(s.n)}</span>${esc(s.title)} <span class="g">${s.gate}</span></td>${BONUSES.map(b=>`<td>${inStage(b,s.n)?`<span class="mk${b.stages==='all'?' lt':''}" title="${esc(B(b).t)}"></span>`:''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <p class="hint" style="margin-top:8px"><span class="mk" style="vertical-align:middle"></span> ${L('أداة أساسية لهذه المرحلة','Key tool for this stage')} · <span class="mk lt" style="vertical-align:middle"></span> ${L('مستخدمة في كل المراحل','Used in every stage')}</p>
  </section>`;
}

/* ───────── PROMPT LIBRARY ───────── */
function viewPrompts(){
  const f=S.pf;
  return bIntro('prompts')+`
  <section class="sec">
    <div class="sec-h"><h3>${L('ابحث عن الأمر المناسب','Find the right prompt')} <span class="caps">48 Prompts</span></h3><p>${L('اختر المرحلة أو نوع الأداة، افتح الأمر، املأ بيانات مشروعك، ثم انسخه.','Pick a stage or tool type, open a prompt, fill in your project details, then copy it.')}</p></div>
    <div class="pbar">
      <input class="field" id="pq" type="search" placeholder="${L('ابحث: Concept، خامات، BOQ، Shot List…','Search: Concept, materials, BOQ, Shot List…')}" value="${esc(f.q)}">
      <select class="field" id="pstage" aria-label="${L('المرحلة','Stage')}"><option value="all">${L('كل المراحل','All stages')}</option>${stagesL().map(s=>`<option value="${s.n}" ${String(f.stage)===String(s.n)?'selected':''}>${pad(s.n)} · ${esc(s.title)}</option>`).join('')}</select>
      <span class="seg" role="group">${[['all',L('الكل','All')],['text',L('نص وتحليل','Text & analysis')],['img',L('صور','Images')]].map(([k,l])=>`<button type="button" data-ptype="${k}" aria-pressed="${f.type===k}">${l}</button>`).join('')}</span>
    </div>
    <p class="hint" id="pcount"></p>
    <div id="plist"></div>
  </section>`;
}
function renderPromptList(){
  const f=S.pf, q=f.q.trim().toLowerCase();
  const match=p=>(f.stage==='all'||String(p.n)===String(f.stage)||p.general)&&(f.type==='all'||(f.type==='img'?p.en:!p.en))&&(!q||(p.title+' '+p.text+' '+p.tool+' '+p.id).toLowerCase().includes(q));
  const list=ALL_PROMPTS.filter(match), cnt=list.filter(p=>!p.general).length;
  $('#pcount').textContent=L(cnt+' أمر مطابق',cnt+' matching prompts');
  if(!list.length){$('#plist').innerHTML=`<div class="empty">${L('لا توجد أوامر مطابقة. جرّب كلمة أخرى أو اختر «كل المراحل».','No matching prompts. Try another word or choose “All stages”.')}</div>`;return;}
  let html='';
  const gen=list.find(p=>p.general); if(gen) html+=`<div class="pgroup"><h4>${L('ابدأ بهذا الأمر في كل مشروع','Start every project with this prompt')}</h4>${promptCard(gen,'pin')}</div>`;
  stagesL().forEach(s=>{const ps=list.filter(p=>p.n===s.n); if(ps.length) html+=`<div class="pgroup"><h4><span class="num">${pad(s.n)}</span>${esc(s.title)}<span class="g">${s.gate}</span></h4>${ps.map(p=>promptCard(p)).join('')}</div>`;});
  $('#plist').innerHTML=html;
}

/* ───────── BRIEF ───────── */
const bAns=q=>{const v=S.brief[q.id];return Array.isArray(v)?v.length>0:(typeof v==='number'?v>=0:!!(v&&String(v).trim()));};
const minL=m=>L(m+' دقائق',m+' min');
function viewBrief(){
  const BR=briefL(), totalMin=BR.reduce((a,s)=>a+s.min,0);
  const prep=isEn()?BRIEF_EN.prep:BRIEF_PREP, rules=isEn()?BRIEF_EN.rules:BRIEF_RULES, flags=isEn()?BRIEF_EN.flags:BRIEF_FLAGS;
  return bIntro('brief')+`
  <div class="bmain">
    <nav class="bnav" id="bnav"></nav>
    <div style="min-width:0">
      <section class="bsec" id="b-prep">
        <div class="bsec-h"><span class="num">·</span><h3>${L('قبل اللقاء','Before the meeting')}<small>Preparation</small></h3><span class="min">${minL(5)}</span></div>
        <ul class="checks">${prep.map((t,i)=>checkRow('bp'+i,`data-bprep="${i}"`,t,S.bprep[i])).join('')}</ul>
        <div class="sec-h" style="margin:22px 0 10px"><h3 style="font-size:16px">${L('قواعد إدارة اللقاء','How to run the meeting')}</h3></div>
        <div class="rules">${rules.map(r=>`<div class="card soft"><h4>${esc(r.t)}</h4><p>${esc(r.d)}</p></div>`).join('')}</div>
      </section>
      ${BR.map((sec,si)=>`<section class="bsec" id="b-${sec.k}">
        <div class="bsec-h"><span class="num">${pad(si+1)}</span><h3>${esc(sec.t)}${isEn()?'':`<small>${sec.en}</small>`}</h3><span class="min">${minL(sec.min)}</span></div>
        <p class="sintro">${esc(sec.intro)}</p>
        ${sec.qs.map(q=>briefQ(q)).join('')}
      </section>`).join('')}
      <section class="bsec" id="b-flags">
        <div class="bsec-h"><span class="num">!</span><h3>${L('إشارات تحتاج انتباهك','Signals to watch')}${isEn()?'':'<small>Red Flags</small>'}</h3><span class="min"></span></div>
        <p class="sintro">${L('علّم على أي إشارة ظهرت في اللقاء. إشارة واحدة لا تعني رفض العميل، لكنها تعني أن تكتب شروطك بوضوح أكبر في العرض.','Tick any signal that came up in the meeting. One signal doesn’t mean turning the client down, but it does mean writing your terms more clearly in the proposal.')}</p>
        <ul class="checks flag">${flags.map((t,i)=>checkRow('bf'+i,`data-bflag="${i}"`,t,S.bflags[i])).join('')}</ul>
      </section>
      <section class="bsec" id="b-out">
        <div class="bsec-h"><span class="num">✓</span><h3>${L('ملخص البريف','Brief summary')}${isEn()?'':'<small>Brief Summary</small>'}</h3><span class="min"></span></div>
        <p class="sintro">${L('راجع الأسئلة الأساسية الناقصة، ثم انسخ الملخص لملف المشروع أو للبرومبت العام أو لرسالة تأكيد للعميل.','Check the key questions still unanswered, then copy the summary into the project file, the general prompt, or a confirmation message to the client.')}</p>
        <div id="bmissing"></div>
        <div class="acts" style="margin-top:14px">
          <button class="btn" type="button" id="bcopy">${L('نسخ ملخص البريف','Copy brief summary')}</button>
          <button class="btn-line" type="button" id="bblank">${L('نسخ الأسئلة فارغة','Copy blank questions')}</button>
          <span id="bclearWrap"><button class="btn-line" type="button" id="bclear">${L('مسح إجابات النموذج','Clear all answers')}</button></span>
        </div>
        <p class="hint" style="margin-top:10px">${L(`مدة اللقاء المقترحة حوالي ${totalMin} دقيقة. لو الوقت أقل، ركّز على الأسئلة المعلّمة بنجمة.`,`Suggested meeting length: about ${totalMin} minutes. If you have less time, focus on the starred questions.`)}</p>
      </section>
    </div>
  </div>`;
}
function briefQ(q){
  const v=S.brief[q.id], id='bq-'+q.id;
  let input='';
  if(q.type==='text') input=`<input class="field" type="text" id="${id}" data-bq="${q.id}" value="${esc(v||'')}" placeholder="${esc(q.ph||'')}" dir="auto">`;
  else if(q.type==='area') input=`<textarea class="field" id="${id}" data-bq="${q.id}" placeholder="${esc(q.ph||'')}" dir="auto">${esc(v||'')}</textarea>`;
  else if(q.type==='choice') input=`<div class="opts" role="group" aria-labelledby="${id}-l">${q.opts.map((o,k)=>`<button type="button" class="chip" data-bchoice="${q.id}" data-idx="${k}" aria-pressed="${v===k}">${esc(o)}</button>`).join('')}</div>`;
  else if(q.type==='chips'){const arr=Array.isArray(v)?v:[];input=`<div class="opts" role="group" aria-labelledby="${id}-l">${q.opts.map((o,k)=>`<button type="button" class="chip" data-bchip="${q.id}" data-idx="${k}" aria-pressed="${arr.includes(k)}">${esc(o)}</button>`).join('')}</div>`;}
  return `<div class="q"><label class="ql" id="${id}-l" ${q.type==='text'||q.type==='area'?`for="${id}"`:''}>${esc(q.q)}${q.key?`<span class="star">★ ${L('أساسي','Key')}</span>`:''}</label>
    ${q.why?`<p class="qwhy"><b>${L('ليه بنسأل؟','Why ask?')}</b><span>${esc(q.why)}</span></p>`:''}
    ${input}
    ${q.follow?`<p class="qf">${L('سؤال متابعة:','Follow-up:')} ${esc(q.follow)}</p>`:''}</div>`;
}
function refreshBriefNav(){
  const nav=$('#bnav'); if(!nav) return;
  const BR=briefL(); let ans=0,tot=0;
  const items=BR.map((s,i)=>{const a=s.qs.filter(bAns).length;ans+=a;tot+=s.qs.length;return `<button type="button" data-bjump="b-${s.k}" class="${a===s.qs.length?'full':''}"><span class="n">${pad(i+1)}</span><span>${esc(s.t)}</span><span class="c">${a}/${s.qs.length}</span></button>`;}).join('');
  nav.innerHTML=`<button type="button" data-bjump="b-prep"><span class="n">·</span><span>${L('قبل اللقاء','Before the meeting')}</span><span class="c"></span></button>${items}<button type="button" data-bjump="b-flags"><span class="n">!</span><span>${L('إشارات التنبيه','Red flags')}</span><span class="c"></span></button><button type="button" data-bjump="b-out"><span class="n">✓</span><span>${L('الملخص','Summary')}</span><span class="c"></span></button>
    <div class="bnav-total"><span>${L(`تمت الإجابة على ${ans} من ${tot} سؤال`,`${ans} of ${tot} questions answered`)}</span><span class="bar${ans===tot?' full':''}"><i style="width:${ans/tot*100}%"></i></span></div>`;
  const miss=[];BR.forEach(s=>s.qs.forEach(q=>{if(q.key&&!bAns(q))miss.push(q.q.replace(/[؟?].*$/,'').slice(0,50));}));
  const m=$('#bmissing'); if(m) m.innerHTML=miss.length?`<p class="hint" style="margin-bottom:8px">${L(`أسئلة أساسية لم تُجب بعد (${miss.length}):`,`Key questions not answered yet (${miss.length}):`)}</p><div class="missing">${miss.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:`<p class="okmsg">${L('كل الأسئلة الأساسية مجابة. البريف جاهز للمراجعة مع العميل.','All key questions are answered. The brief is ready to review with the client.')}</p>`;
}
function ansText(q){const v=S.brief[q.id];if(q.type==='choice')return typeof v==='number'&&q.opts[v]?q.opts[v]:'';if(q.type==='chips')return Array.isArray(v)?v.map(k=>q.opts[k]).filter(Boolean).join(sep()):'';return v||'';}
function briefText(blank){
  const BR=briefL(), flags=isEn()?BRIEF_EN.flags:BRIEF_FLAGS;
  const client=ansText(BR[0].qs[0])||S.project||L('مشروع جديد','New project');
  const Ls=[L('بريف العميل — ','Client brief — ')+client,''];
  BR.forEach((s,i)=>{Ls.push(pad(i+1)+' · '+s.t);s.qs.forEach(q=>{const a=ansText(q);if(blank)Ls.push('- '+q.q+'\n  ……………………');else if(String(a).trim())Ls.push('- '+q.q+': '+String(a).trim());});Ls.push('');});
  if(!blank){const fl=flags.filter((_,i)=>S.bflags[i]);if(fl.length){Ls.push(L('إشارات تنبيه:','Red flags:'));fl.forEach(f=>Ls.push('- '+f));}}
  return Ls.join('\n');
}

/* ───────── STAGES ───────── */
function viewStages(){
  return bIntro('stages')+`
  <div class="st-top"><div class="ring" id="ring"><div><div><span class="pct" id="pct">0%</span><small>${L('إجمالي التقدم','Overall progress')}</small></div></div></div>
    <div><h3 id="stTitle"></h3><p class="hint" id="stSub"></p>
    <div class="tools"><button class="btn-line" id="copySummary" type="button">${L('نسخ ملخص التقدم','Copy progress summary')}</button><span id="resetWrap"><button class="btn-line" id="reset" type="button">${L('مسح التقدم','Clear progress')}</button></span></div></div></div>
  <nav class="gates" id="gates"></nav>
  <div class="smain">
    <aside class="index"><ul class="idx-list" id="idx"></ul><div class="idx-extra" id="idxExtra"></div>
      <div class="legend"><span><i class="dot"></i>${stLabel('draft')}</span><span><i class="dot review"></i>${stLabel('review')}</span><span><i class="dot approved"></i>${stLabel('approved')}</span></div></aside>
    <section class="sheet" id="sheet" aria-live="polite"></section>
  </div>`;
}
function renderStageParts(){renderTotals();renderSheet();}
function renderTotals(){
  const ring=$('#ring'); if(!ring) return;
  const SS=stagesL(), d=SS.reduce((a,s)=>a+doneIn(s),0), p=Math.round(d/TOTAL*100);
  ring.style.setProperty('--p',p); $('#pct').textContent=p+'%';
  const ap=SS.filter(s=>S.status[s.n]==='approved').length;
  $('#stTitle').textContent=(S.project?S.project+' · ':'')+L(`${d} من ${TOTAL} بند مكتمل`,`${d} of ${TOTAL} items complete`);
  $('#stSub').textContent=L(`${ap} من 16 مرحلة معتمدة. علّم على كل بند بعد التحقق منه، وحدّث حالة المرحلة قبل الانتقال لما بعدها.`,`${ap} of 16 stages approved. Tick each item once verified, and update the stage status before moving on.`);
  $('#gates').innerHTML=GATES.map(g=>{const ss=SS.filter(s=>s.gate===g.k),t=ss.reduce((a,s)=>a+s.checklist.length,0),dd=ss.reduce((a,s)=>a+doneIn(s),0);
    return `<button class="gate${dd===t?' done':''}" type="button" data-stage="${ss[0].n}"><span class="g-name">${g.k}</span><span class="g-ar">${lab(g)}</span><span class="bar"><i style="width:${dd/t*100}%"></i></span><span class="g-st">${L('المراحل','Stages')} ${ss.map(s=>s.n).join(sep())} · <span class="num">${dd}/${t}</span></span></button>`;}).join('');
  $('#idx').innerHTML=SS.map(s=>{const d=doneIn(s),st=S.status[s.n]||'draft';
    return `<li><button class="idx-btn${d===s.checklist.length?' full':''}" type="button" data-stage="${s.n}" aria-current="${S.stage==String(s.n)}"><span class="n">${pad(s.n)}</span><span class="t">${esc(s.title)}<small>${s.gate}</small></span><span class="c">${d}/${s.checklist.length}<i class="dot ${st}"></i></span></button></li>`;}).join('');
  const qd=QUALITY.reduce((a,_,i)=>a+(S.q[i]?1:0),0);
  $('#idxExtra').innerHTML=`<button class="idx-btn" type="button" data-stage="quality" aria-current="${S.stage==='quality'}"><span class="n">✓</span><span class="t">${L('ضوابط الجودة العامة','General quality controls')}${isEn()?'':'<small>Quality Controls</small>'}</span><span class="c">${qd}/${QUALITY.length}</span></button>
    <button class="idx-btn" type="button" data-stage="guide" aria-current="${S.stage==='guide'}"><span class="n">i</span><span class="t">${L('طريقة الاستخدام','How to use')}${isEn()?'':'<small>How to use</small>'}</span><span class="c"></span></button>`;
}
function renderSheet(){
  if(S.stage==='quality') return sheetQuality();
  if(S.stage==='guide') return sheetGuide();
  const n=+S.stage||1, s=stg(n), d=doneIn(s), t=s.checklist.length, st=S.status[n]||'draft';
  const prev=n>1?stg(n-1):null, next=n<16?stg(n+1):null;
  const outs=s.outputs.replace(/\.$/,'').split(isEn()?/;\s*/:/،\s*/).map(o=>`<span>${esc(isEn()?o.charAt(0).toUpperCase()+o.slice(1):o)}</span>`).join('');
  const helpers=BONUSES.filter(b=>b.stages!=='all'&&inStage(b,n));
  $('#sheet').innerHTML=`
  <div class="s-head"><div class="s-big">${pad(n)}</div>
    <div class="s-meta"><span class="gate-chip">${s.gate} Gate</span>${isEn()?'':`<span class="s-en">${esc(s.en)}</span>`}</div>
    <h2>${esc(s.title)}</h2><p class="s-intro">${esc(s.intro)}</p>
    <div class="s-controls"><div><span class="seg-l">${L('حالة المرحلة','Stage status')}</span><span class="seg" role="group">${STATUS.map(([k])=>`<button type="button" data-status="${k}" aria-pressed="${st===k}"><i class="dot ${k}"></i>${stLabel(k)}</button>`).join('')}</span></div>
      <div class="prog"><span class="bar"><i id="sbar" style="width:${d/t*100}%"></i></span><b id="scount">${L(`${d} من ${t}`,`${d} of ${t}`)}</b></div></div></div>
  <div class="s-body">
    ${helpers.length?`<section class="blk"><div class="blk-h"><h3>${L('أدوات البونص لهذه المرحلة','Bonus tools for this stage')}</h3></div><div class="helpers">${helpers.map(b=>`<button class="helper" type="button" data-view="${b.k}">${ico(b.k)}${esc(B(b).t)}</button>`).join('')}</div></section>`:''}
    <section class="blk"><div class="grid2"><div class="card soft"><h4>${L('مدخلات المرحلة','Stage inputs')}</h4><p>${esc(s.inputs)}</p></div><div class="card soft"><h4>${L('الأدوات المقترحة','Suggested tools')}</h4><p>${esc(s.tools)}</p></div></div></section>
    <section class="blk"><div class="blk-h"><h3>${L('خطوات العمل','Workflow')}${isEn()?'':' <span class="caps">Workflow</span>'}</h3></div><ol class="steps">${s.steps.map(x=>`<li><span>${esc(x)}</span></li>`).join('')}</ol></section>
    <section class="blk"><div class="blk-h"><h3>Checklist <span class="caps">${L('بنود المراجعة','Review items')}</span></h3>
      <div class="acts"><button class="mini" type="button" id="hideDone" aria-pressed="${S.hideDone}">${L('إخفاء المكتمل','Hide completed')}</button><button class="mini" type="button" id="allToggle">${d===t?L('إلغاء تحديد الكل','Untick all'):L('تحديد الكل','Tick all')}</button></div></div>
      <ul class="checks${S.hideDone?' hide-done':''}${d===t?' complete':''}" id="checks">${s.checklist.map((x,i)=>checkRow(`c${n}-${i}`,`data-ck="${i}"`,x,!!S.checks[n+'-'+i],n+'.'+(i+1))).join('')}</ul>
      <div class="all-done">${L('كل بنود المرحلة مكتملة. راجع المخرجات وحدّث الحالة إلى «معتمد» بعد الاعتماد.','All items in this stage are complete. Review the deliverables and set the status to “Approved” once signed off.')}</div></section>
    <section class="blk"><div class="blk-h"><h3>${L('المخرجات والاعتماد','Deliverables & approval')}${isEn()?'':' <span class="caps">Deliverables</span>'}</h3></div><div class="outs">${outs}</div><p class="appr">${esc(s.approval)}</p></section>
    <section class="blk"><div class="blk-h"><h3>${L('ملاحظات وقرارات مفتوحة','Notes & open decisions')}</h3></div>
      <label for="notes${n}" class="hint">${L('سجّل مصدر البيانات، ومن راجع، والقرار النهائي، وما بقي مفتوحًا.','Record the data source, who reviewed, the final decision, and what remains open.')}</label>
      <textarea class="field" id="notes${n}" data-notes="${n}" dir="auto" placeholder="${L('مثال: القياسات من رفع 12 سبتمبر، إصدار 02. في انتظار تأكيد العميل على نطاق المطبخ.','e.g. Measurements from the 12 September survey, v02. Waiting for the client to confirm the kitchen scope.')}">${esc(S.notes[n]||'')}</textarea></section>
    <section class="blk"><div class="blk-h"><h3>${L('الأوامر الجاهزة لهذه المرحلة','Ready prompts for this stage')} <span class="caps">Prompt Library</span></h3></div>
      <div>${s.prompts.map(p=>promptCard(findPrompt(p.id))).join('')}</div>
      <p class="hint">${L('احفظ المخرج باسم كود المشروع والمرحلة والتاريخ والإصدار، واحتفظ بمدخلات البرومبت لتكرار العمل ومراجعة سبب الاختيار.','Save each output with the project code, stage, date and version, and keep the prompt inputs so the work can be repeated and the choice reviewed.')}</p></section>
  </div>
  <nav class="pager">${prev?`<button type="button" data-stage="${prev.n}"><small>${L('المرحلة السابقة','Previous stage')} · ${pad(prev.n)}</small>${esc(prev.title)}</button>`:''}${next?`<button class="next" type="button" data-stage="${next.n}"><small>${L('المرحلة التالية','Next stage')} · ${pad(next.n)}</small>${esc(next.title)}</button>`:''}</nav>`;
}
function sheetQuality(){
  $('#sheet').innerHTML=`<div class="s-head"><div class="s-big">✓</div><div class="s-meta"><span class="gate-chip">All Gates</span>${isEn()?'':'<span class="s-en">Quality &amp; Change Control</span>'}</div>
    <h2>${L('ضوابط الجودة وإدارة التغييرات','Quality & change control')}</h2><p class="s-intro">${L('المصمم مسؤول عن القرار النهائي. الذكاء الاصطناعي يساعد في التنظيم والتصور والفحص الأولي، لكنه لا يضمن اكتمال المراجعة الفنية. راجع هذه الضوابط في كل مرحلة.','The designer owns the final decision. AI helps with organizing, visualizing and first-pass checks, but it doesn’t guarantee a complete technical review. Apply these controls at every stage.')}</p></div>
  <div class="s-body"><section class="blk"><ul class="checks">${QUALITY.map((x,i)=>checkRow('q'+i,`data-q="${i}"`,x[isEn()?1:0],S.q[i],'Q'+(i+1))).join('')}</ul></section>
  <section class="blk"><div class="blk-h"><h3>${L('متى نعيد فتح مرحلة','When to reopen a stage')}</h3></div><p style="margin:0;color:var(--ink-2)">${L('عند ظهور قياس جديد مؤثر، أو تغيير احتياج العميل أو نطاقه، أو تعذر توريد عنصر، ارجع إلى القرار المتأثر. لا تحاول حل التعارض داخل صورة العرض فقط؛ حدّث المستند الأصلي ثم المخرجات التابعة له.','When a new measurement changes things, the client’s needs or scope change, or an item can’t be supplied, go back to the affected decision. Don’t try to resolve the conflict inside the presentation image alone; update the source document first, then everything that depends on it.')}</p></section>
  <section class="blk"><div class="blk-h"><h3>${L('قالب سجل القرار','Decision log template')}${isEn()?'':' <span class="caps">Decision Log</span>'}</h3></div><div class="grid2">${DECISION_LOG.map(r=>`<div class="card soft"><h4>${isEn()?r[1]:r[0]}</h4><p>${isEn()?r[3]:r[2]}</p></div>`).join('')}</div></section></div>`;
}
function sheetGuide(){
  const steps=isEn()?['Enter your project name or code at the top of the page. Progress saves automatically on your device, and everyone who opens the link has their own copy.','Open a stage from the list or the approval-gate bar, and tick each item only after you’ve actually verified it.','Move the stage status from Draft to In review to Approved. Carry the approved version into the next stage, along with notes on open decisions.','Use “Copy progress summary” to send the project status to your team or client.']
    :['اكتب اسم أو كود المشروع في أعلى الصفحة. التقدم يُحفظ تلقائيًا على جهازك، وكل من يفتح الرابط لديه نسخته الخاصة.','افتح المرحلة من القائمة أو من شريط بوابات الاعتماد، وعلّم على كل بند بعد التحقق منه فعليًا.','غيّر حالة المرحلة من مسودة إلى قيد مراجعة ثم معتمد. انقل للمرحلة التالية النسخة المعتمدة مع ملاحظات القرارات المفتوحة.','استخدم «نسخ ملخص التقدم» لإرسال وضع المشروع للفريق أو للعميل.'];
  $('#sheet').innerHTML=`<div class="s-head"><div class="s-big">i</div><div class="s-meta"><span class="gate-chip">Start Here</span></div>
    <h2>${L('طريقة استخدام التشيك لست','How to use the checklist')}</h2><p class="s-intro">${L('ابدأ بالمرحلة التي تعمل عليها. جهّز المدخلات، نفّذ خطوات العمل، استخدم الأمر المناسب، ثم علّم على بنود المراجعة. المخرج لا يُعتمد لمجرد أنه منظم؛ قارن النتيجة ببيانات المشروع ووثّق القرار.','Start with the stage you’re working on. Prepare the inputs, follow the workflow, use the right prompt, then tick the review items. An output isn’t approved just because it looks organized; compare it with the project data and document the decision.')}</p></div>
  <div class="s-body"><section class="blk"><div class="blk-h"><h3>${L('خطوات سريعة','Quick steps')}</h3></div><ol class="steps">${steps.map(x=>`<li><span>${esc(x)}</span></li>`).join('')}</ol></section>
  <section class="blk"><div class="blk-h"><h3>${L('معنى بوابة الاعتماد','What an approval gate means')}${isEn()?'':' <span class="caps">Gates</span>'}</h3></div><p style="margin:0;color:var(--ink-2)">${L('كل Gate نقطة قرار وليست مجرد مجلد. المراحل من 5 إلى 10 تتداخل عمليًا؛ البحث والـConcept والتخطيط قد تتكرر معًا، واختيار الخامات والتكلفة يبدأ مبكرًا ويتطور. الترقيم لا يفرض تأخير أي مرحلة عن الوقت اللازم.','Each gate is a decision point, not just a folder. Stages 5 to 10 overlap in practice: research, Concept and planning can loop together, and material and cost decisions start early and evolve. The numbering never forces a stage to wait longer than it needs to.')}</p></section>
  <section class="blk"><div class="blk-h"><h3>${L('البرومبت العام للمشروع','General project prompt')}</h3></div>${promptCard(ALL_PROMPTS[0],'pin')}</section></div>`;
}
function refreshStageProgress(n){
  const s=STAGES[n-1],d=doneIn(s),t=s.checklist.length;
  $('#sbar').style.width=(d/t*100)+'%';$('#scount').textContent=L(`${d} من ${t}`,`${d} of ${t}`);
  $('#allToggle').textContent=d===t?L('إلغاء تحديد الكل','Untick all'):L('تحديد الكل','Tick all');$('#checks').classList.toggle('complete',d===t);
  renderTotals();
}
function stagesSummary(){
  const SS=stagesL(), d=SS.reduce((a,s)=>a+doneIn(s),0);
  const Ls=[L('مراحل المشروع — Bonus Design 2030','Project stages — Bonus Design 2030'),L('المشروع: ','Project: ')+(S.project||'—'),L(`إجمالي التقدم: ${d} من ${TOTAL} بند`,`Overall progress: ${d} of ${TOTAL} items`)+' ('+Math.round(d/TOTAL*100)+'%)',''];
  SS.forEach(s=>{const dn=doneIn(s);
    Ls.push(pad(s.n)+' · '+s.title+' ['+s.gate+'] — '+dn+'/'+s.checklist.length+' · '+stLabel(S.status[s.n]||'draft'));
    if(dn>0&&dn<s.checklist.length)s.checklist.forEach((x,i)=>{if(!S.checks[s.n+'-'+i])Ls.push('   ☐ '+x);});
    if(S.notes[s.n])Ls.push('   '+L('ملاحظات: ','Notes: ')+S.notes[s.n].replace(/\n+/g,' / '));});
  return Ls.join('\n');
}

/* ───────── MATERIALS ───────── */
function viewMaterials(){
  const f=S.mf;
  return bIntro('materials')+`
  <section class="sec">
    <div class="sec-h"><h3>${L('اختر الخامة بحدودها','Choose materials by their limits')} <span class="caps">${MATERIALS.length} Materials</span></h3><p>${L('اختر المكان الذي ستُستخدم فيه الخامة لتعرف فورًا ما يناسبه وما يجب تجنبه. علّم «قارن» على خامتين أو ثلاث لتراها جنبًا إلى جنب.','Pick where the material will be used to see instantly what suits it and what to avoid. Tick “Compare” on two or three materials to see them side by side.')}</p></div>
    <div class="mbar">
      <div class="mrow"><span class="lb">${L('أين ستُستخدم؟','Where will it go?')}</span><div class="chipset">${[{k:-1,ar:'كل الأماكن',en:'All spaces'}].concat(MAT_SPACES).map(s=>`<button type="button" class="chip" data-mspace="${s.k}" aria-pressed="${f.space===s.k}">${lab(s)}</button>`).join('')}</div></div>
      <div class="mrow"><span class="lb">${L('نوع الخامة','Category')}</span><div class="chipset">${[{k:'all',ar:'الكل',en:'All'}].concat(MAT_CATS).map(c=>`<button type="button" class="chip" data-mcat="${c.k}" aria-pressed="${f.cat===c.k}">${lab(c)}</button>`).join('')}</div></div>
      <div class="mrow"><input class="field" id="mq" type="search" placeholder="${L('ابحث باسم الخامة بالعربي أو بالإنجليزي','Search by material name')}" value="${esc(f.q)}" style="flex:1 1 220px;width:auto">
        <select class="field" id="msort" style="flex:0 1 230px;width:auto" aria-label="Sort">${[['def',L('الترتيب الافتراضي','Default order')],['0',L('الأعلى في مقاومة الماء','Most water resistant')],['1',L('الأعلى في مقاومة الخدش','Most scratch resistant')],['2',L('الأعلى في تحمّل الحرارة','Most heat tolerant')],['3',L('الأعلى في مقاومة البقع','Most stain resistant')],['4',L('الأسهل في الصيانة','Easiest to maintain')],['c',L('الأقل تكلفة','Lowest cost')]].map(([k,l])=>`<option value="${k}" ${f.sort===k?'selected':''}>${l}</option>`).join('')}</select>
        <span class="mcount" id="mcount"></span></div>
    </div>
    <div id="mcmp"></div>
    <div class="mgrid" id="mgrid"></div>
    <p class="note" style="margin-top:18px"><b>${L('للاستخدام الصحيح:','Use it right:')}</b><span>${L('التقييمات من 5 نسبية للمقارنة بين الخامات، وتختلف حسب المنتج والمورد وجودة التنفيذ. قبل الاعتماد النهائي راجع الداتا شيت والعينة وعرض السعر المؤرخ، كما في ضوابط الجودة.','Ratings out of 5 are relative, for comparing materials, and vary by product, supplier and workmanship. Before final approval, check the datasheet, the sample and a dated quotation, as in the quality controls.')}</span></p>
  </section>`;
}
function matCard(i,space){
  const m=mat(i), cat=lab(MAT_CATS.find(c=>c.k===m.cat)), s=space>=0?m.sp[space]:null, sel=S.cmp.includes(i);
  return `<article class="mat${sel?' sel':''}">
    ${s!==null&&s!=='-'?`<span class="status sp s${s}">${SLABEL(s)} ${L('في','in')} ${lab(MAT_SPACES[space])}</span>`:''}
    <div class="mat-h"><div><h4>${esc(m.n)}</h4>${m.en?`<div class="en ltr">${esc(m.en)}</div>`:''}
      <div class="meta"><span class="pill">${cat}</span><span class="pill">${esc(m.use)}</span></div></div>
      <div style="display:grid;gap:6px;justify-items:end"><span class="cost" title="${L('مستوى التكلفة','Cost level')}"><b>${'$'.repeat(m.c)}</b>${'$'.repeat(3-m.c)}</span>
      <label class="cmp-toggle"><input type="checkbox" data-cmp="${i}" ${sel?'checked':''}>${L('قارن','Compare')}</label></div></div>
    <p class="props">${esc(m.props)}</p>
    <div class="rates">${MAT_PROPS.map(p=>`<div class="rate"><span>${lab(p)}</span><span class="pips" aria-label="${m.r[p.k]}/5">${[1,2,3,4,5].map(x=>`<i class="${x<=m.r[p.k]?'on':''}"></i>`).join('')}</span><span class="v">${m.r[p.k]}</span></div>`).join('')}</div>
    <div class="suit">${MAT_SPACES.map(sp=>{const v=m.sp[sp.k];return `<span class="sp ${v==='-'?'sn':'s'+v}" title="${SLABEL(v)}">${lab(sp)}</span>`;}).join('')}</div>
    <div class="gb"><div class="y">${ico('check')}<span><b>${L('يصلح في:','Works in:')}</b> ${esc(m.good)}</span></div><div class="n">${ico('x')}<span><b>${L('يفشل في:','Fails in:')}</b> ${esc(m.bad)}</span></div></div>
    <details><summary>${CHEV.replace('class="chev"','class="chev" style="width:16px;height:16px"')}${L('قبل ما تعتمدها في التنفيذ','Before you approve it for execution')}</summary><p>${esc(m.exec)}</p></details>
  </article>`;
}
function renderMaterials(){
  const f=S.mf,q=f.q.trim().toLowerCase();
  let list=MATERIALS.map((m,i)=>({m,i})).filter(({m,i})=>(f.cat==='all'||m.cat===f.cat)&&(!q||(m.n+' '+m.en+' '+m.use+' '+MAT_EN[i].use).toLowerCase().includes(q)));
  if(f.sort==='c') list.sort((a,b)=>a.m.c-b.m.c); else if(f.sort!=='def') list.sort((a,b)=>b.m.r[+f.sort]-a.m.r[+f.sort]);
  let html='';
  if(f.space>=0){
    const sp=lab(MAT_SPACES[f.space]);
    [[2,L(`خامات مناسبة لـ ${sp}`,`Suitable for ${sp}`)],[1,L(`تُستخدم بحذر في ${sp}`,`Use with care in ${sp}`)],[0,L(`تجنّبها في ${sp}`,`Avoid in ${sp}`)]].forEach(([v,l])=>{const g=list.filter(x=>String(x.m.sp[f.space])===String(v));
      if(g.length) html+=`<div class="mgroup-h"><span class="sp s${v}">${g.length}</span>${l}</div>`+g.map(x=>matCard(x.i,f.space)).join('');});
    const na=list.filter(x=>x.m.sp[f.space]==='-').length;
    if(na) html+=`<p class="hint" style="grid-column:1/-1">${L(`${na} خامة غير مستخدمة عادة في ${sp}، لذلك لم تظهر.`,`${na} materials aren’t typically used in ${sp}, so they’re hidden.`)}</p>`;
  } else html=list.map(x=>matCard(x.i,-1)).join('');
  $('#mgrid').innerHTML=html||`<div class="empty" style="grid-column:1/-1">${L('لا توجد خامات مطابقة. جرّب كلمة أخرى أو اختر «الكل».','No matching materials. Try another word or choose “All”.')}</div>`;
  $('#mcount').textContent=L(list.length+' خامة',list.length+' materials');
  renderCompare();
}
function renderCompare(){
  const box=$('#mcmp'); if(!box) return;
  if(S.cmp.length<2){box.innerHTML=S.cmp.length?`<p class="hint" style="margin-top:12px">${L('اختر خامة أخرى على الأقل للمقارنة.','Pick at least one more material to compare.')}</p>`:'';return;}
  const ms=S.cmp.map(i=>mat(i));
  const row=(l,f)=>`<tr><th>${l}</th>${ms.map(m=>`<td>${f(m)}</td>`).join('')}</tr>`;
  box.innerHTML=`<div class="cmp"><div class="sec-h" style="margin-bottom:10px"><h3 style="font-size:17px">${L('مقارنة الخامات','Material comparison')}</h3><button class="mini" type="button" id="cmpClear">${L('مسح المقارنة','Clear comparison')}</button></div>
  <div class="scroll-x"><table><thead><tr><th></th>${ms.map(m=>`<th>${esc(m.n)}</th>`).join('')}</tr></thead><tbody>
  ${row(L('الاستخدام','Use'),m=>esc(m.use))}
  ${MAT_PROPS.map(p=>row(lab(p),m=>`<b class="num">${m.r[p.k]}</b> / 5`)).join('')}
  ${row(L('التكلفة','Cost'),m=>'$'.repeat(m.c))}
  ${MAT_SPACES.map(sp=>row(lab(sp),m=>{const v=m.sp[sp.k];return `<span class="sp ${v==='-'?'sn':'s'+v}">${SLABEL(v)}</span>`;})).join('')}
  ${row(L('يفشل في','Fails in'),m=>esc(m.bad))}
  ${row(L('ملاحظة التنفيذ','Execution note'),m=>esc(m.exec))}
  </tbody></table></div></div>`;
}

/* ───────── PRICING ───────── */
function viewPricing(){
  const c=S.calc, p=P();
  const num=(id,v,l,step)=>`<label>${l}<input class="field" type="number" inputmode="decimal" min="0" step="${step||'any'}" id="c-${id}" data-calc="${id}" value="${v}"></label>`;
  return bIntro('pricing')+`
  <section class="sec"><div class="sec-h"><h3>${L('قواعد قبل أي رقم','Rules before any number')}${isEn()?'':' <span class="caps">Principles</span>'}</h3></div>
    <div class="g5">${p.principles.map(x=>`<div class="card"><h4 style="color:var(--ink);font-size:15px">${esc(x.t)}</h4><p style="color:var(--ink-2);font-size:13.5px">${esc(x.d)}</p></div>`).join('')}</div></section>

  <section class="sec"><div class="sec-h"><h3>${L('طرق التسعير ومتى تستخدم كل طريقة','Pricing methods and when to use each')}${isEn()?'':' <span class="caps">Pricing Methods</span>'}</h3></div>
    <div class="g5">${p.methods.map(m=>`<div class="card meth"><div class="mt"><h4>${esc(m.t)}</h4>${isEn()?'':`<span class="en">${m.en}</span>`}</div><div class="formula">${esc(m.f)}</div>
      <dl><dt>${L('متى تستخدمها','When to use it')}</dt><dd>${esc(m.when)}</dd><dt>${L('الميزة','Advantage')}</dt><dd>${esc(m.pro)}</dd><dt>${L('انتبه','Watch out')}</dt><dd>${esc(m.con)}</dd></dl></div>`).join('')}</div></section>

  <section class="sec"><div class="sec-h"><h3>${L('حاسبة سعر المشروع','Project fee calculator')}${isEn()?'':' <span class="caps">Pricing Calculator</span>'}</h3>
    <p>${L('الحاسبة تجمع ثلاث طرق: تكلفتك الحقيقية كحد أدنى، وسعر المتر الذي تعمل به، ونسبة التنفيذ كمرجع. الأرقام الموجودة مثال فقط؛ غيّرها بأرقام مكتبك.','The calculator combines three methods: your real cost as a floor, the per-m² rate you work with, and a percentage of construction as a reference. The numbers shown are examples only; replace them with your studio’s figures.')}</p></div>
    <div class="calc"><div style="display:grid;gap:14px;min-width:0">
      <div class="cpanel"><h4><span class="lt">A</span>${L('تكلفتك الحقيقية (الحد الأدنى)','Your real cost (the floor)')}</h4>
        <div class="frow"><label>${L('العملة','Currency')}<select class="field" id="c-cur" data-calc="cur">${Object.keys(CURS).map(k=>`<option value="${k}" ${c.cur===k?'selected':''}>${curL(k)}</option>`).join('')}</select></label>
          ${num('over',c.over,L('مصاريف المكتب الشهرية','Monthly studio overheads'))}${num('sal',c.sal,L('راتبك أو رواتب الفريق الشهرية','Your or your team’s monthly salaries'))}${num('bh',c.bh,L('ساعات عمل مدفوعة في الشهر','Billable hours per month'),1)}</div>
        <div class="derived"><span>${L('تكلفة الساعة الفعلية','Actual cost per hour')}</span><b id="o-hour"></b></div>
        <table class="ptable"><tbody>${p.phases.map((t,i)=>`<tr><td><label for="c-h${i}">${esc(t)}</label></td><td><input class="field" type="number" min="0" step="1" id="c-h${i}" data-hr="${i}" value="${c.hrs[i]}"></td></tr>`).join('')}</tbody>
          <tfoot><tr><td>${L('إجمالي ساعات المشروع','Total project hours')}</td><td style="text-align:center" id="o-hrs"></td></tr></tfoot></table>
        <div class="frow">${num('margin',c.margin,L('هامش الربح %','Profit margin %'),1)}</div></div>
      <div class="cpanel"><h4><span class="lt">B</span>${L('بالمتر المربع (سعر السوق)','Per m² (market rate)')}</h4>
        <div class="frow">${num('area',c.area,L('المساحة م²','Area m²'))}${num('rate',c.rate,L('سعر المتر عندك','Your rate per m²'))}
          <label>${L('درجة الصعوبة','Complexity')}<select class="field" id="c-cx" data-calc="cx">${[['0.9',L('بسيط ×0.9','Simple ×0.9')],['1',L('متوسط ×1','Standard ×1')],['1.25',L('معقد ×1.25','Complex ×1.25')],['1.5',L('فاخر أو تفاصيل خاصة ×1.5','Luxury or custom detailing ×1.5')]].map(([v,l])=>`<option value="${v}" ${String(c.cx)===v?'selected':''}>${l}</option>`).join('')}</select></label></div>
        <label class="cmp-toggle" style="font-size:13.5px;color:var(--ink-2)"><input type="checkbox" id="c-rush" data-calc="rush" ${c.rush?'checked':''}>${L('تسليم مستعجل (+20%)','Rush delivery (+20%)')}</label></div>
      <div class="cpanel"><h4><span class="lt">C</span>${L('نسبة من تكلفة التنفيذ (للمرجعية)','Percentage of construction (reference)')}</h4>
        <div class="frow">${num('exec',c.exec,L('ميزانية التنفيذ التقديرية','Estimated construction budget'))}${num('pct',c.pct,L('النسبة التي تعمل بها %','Your percentage %'))}</div>
        <p class="hint">${L('مفيدة عندما يشمل عملك الإشراف أو إدارة التنفيذ، ولمقارنة رقمك بحجم المسؤولية.','Useful when your work includes supervision or construction management, and for comparing your fee with the level of responsibility.')}</p></div>
    </div>
    <aside class="result" id="result" aria-live="polite"></aside></div>
  </section>

  <section class="sec"><div class="sec-h"><h3>${L('الرد على الاعتراضات','Handling objections')}${isEn()?'':' <span class="caps">Objection Handling</span>'}</h3><p>${L('لكل اعتراض: ماذا يعني غالبًا، وماذا تقول، وماذا تتجنب. الردود مكتوبة باللهجة المصرية لتقولها كما هي أو تعدلها بأسلوبك.','For each objection: what it usually means, what to say, and what to avoid. Use the scripts as they are or adapt them to your own voice.')}</p></div>
    ${p.objections.map((o,i)=>`<details class="obj"${i===0?' open':''}><summary><span>${esc(o.o)}</span>${CHEV}</summary><div class="obj-b">
      <div><h5>${L('ماذا يعني غالبًا','What it usually means')}</h5><p>${esc(o.mean)}</p></div>
      <div><h5>${L('ماذا تقول','What to say')}</h5><p class="script">${esc(o.say).replace(/\[([^\]]+)\]/g,'<mark class="ph">[$1]</mark>')}</p></div>
      <div class="pr-foot"><p class="avoid" style="margin:0;font-size:13.5px"><b>${L('تجنّب:','Avoid:')}</b> ${esc(o.avoid)}</p><button class="btn" type="button" data-copyo="${i}">${L('نسخ الرد','Copy script')}</button></div></div></details>`).join('')}
  </section>

  <section class="sec"><div class="sec-h"><h3>${L('التسعير مع الذكاء الاصطناعي','Pricing in the age of AI')}${isEn()?'':' <span class="caps">AI &amp; Pricing</span>'}</h3><p>${L('إن أنهيت أسرع بالذكاء الاصطناعي، فهل تأخذ أقل؟ لا. هذا هو السبب، وهذه طريقة شرحه للعميل.','If you finish faster with AI, should you charge less? No. Here’s why, and how to explain it to the client.')}</p></div>
    <div class="g5">${p.ai.map(a=>`<div class="card"><h4 style="color:var(--ink);font-size:15px">${esc(a.t)}</h4><p style="color:var(--ink-2);font-size:13.5px">${esc(a.d)}</p></div>`).join('')}
      <div class="card soft full" style="display:grid;gap:10px"><h4 style="color:var(--ink);font-size:15px">${L('ماذا تقول للعميل','What to tell the client')}</h4><p class="script" style="margin:0">${esc(p.ai_script)}</p><div><button class="btn" type="button" id="copyAi">${L('نسخ الرد','Copy script')}</button></div></div></div>
  </section>

  <section class="sec"><div class="sec-h"><h3>${L('قبل أن ترسل عرض السعر','Before you send the proposal')} <span class="caps">Checklist</span></h3></div>
    <ul class="checks">${p.check.map((t,i)=>checkRow('pc'+i,`data-pcheck="${i}"`,t,S.pcheck[i])).join('')}</ul></section>`;
}
function calcNums(){
  const c=S.calc,n=v=>Math.max(0,+v||0);
  const hour=n(c.bh)?(n(c.over)+n(c.sal))/n(c.bh):0, hrs=c.hrs.reduce((a,h)=>a+n(h),0);
  const floor=hrs*hour*(1+n(c.margin)/100), rushF=c.rush?1.2:1, cx=+c.cx||1;
  const market=n(c.area)*n(c.rate)*cx*rushF, pctFee=n(c.exec)*n(c.pct)/100, rec=Math.max(floor,market);
  return {hour,hrs,floor,market,pctFee,rec,minRate:n(c.area)?floor/(n(c.area)*cx*rushF):0,extra:hour*(1+n(c.margin)/100),perM:n(c.area)?rec/n(c.area):0};
}
function renderCalc(){
  const oh=$('#o-hour'); if(!oh) return;
  const r=calcNums(),c=S.calc,cur=esc(curL(c.cur)),pay=P().pay;
  oh.textContent=fmt(r.hour)+' '+curL(c.cur); $('#o-hrs').textContent=fmt(r.hrs)+' '+L('ساعة','hrs');
  const mx=Math.max(r.floor,r.market,r.pctFee,1), paySum=c.pay.reduce((a,p)=>a+(+p||0),0);
  $('#result').innerHTML=`<h4>${L('السعر المقترح لأتعاب التصميم','Suggested design fee')}</h4>
    <div class="big">${fmt(r.rec)}<small>${cur}</small></div>
    <p class="hint">≈ ${fmt(r.perM)} ${cur} ${L('للمتر المربع','per m²')} · ${r.rec===r.floor&&r.floor>r.market?L('مبني على تكلفتك الحقيقية','based on your real cost'):L('مبني على سعر المتر','based on your per-m² rate')}</p>
    <div class="rbars">
      <div class="rb floor"><div class="l"><span>A · ${L('الحد الأدنى (تكلفتك + الهامش)','Floor (cost + margin)')}</span><b>${fmt(r.floor)}</b></div><div class="t"><i style="width:${r.floor/mx*100}%"></i></div></div>
      <div class="rb"><div class="l"><span>B · ${L('بالمتر المربع','Per m²')}</span><b>${fmt(r.market)}</b></div><div class="t"><i style="width:${r.market/mx*100}%"></i></div></div>
      <div class="rb"><div class="l"><span>C · ${L('نسبة من التنفيذ (مرجع)','% of construction (reference)')}</span><b>${fmt(r.pctFee)}</b></div><div class="t"><i style="width:${r.pctFee/mx*100}%"></i></div></div>
    </div>
    ${r.market<r.floor?`<div class="rwarn">${L(`سعر المتر الحالي أقل من تكلفتك الفعلية. لكي لا تخسر، ارفعه إلى <b>${fmt(Math.ceil(r.minRate))} ${cur}</b> للمتر على الأقل، أو قلل ساعات العمل بتحديد النطاق.`,`Your current per-m² rate is below your real cost. To avoid a loss, raise it to at least <b>${fmt(Math.ceil(r.minRate))} ${cur}</b> per m², or reduce the hours by tightening the scope.`)}</div>`:''}
    ${r.pctFee>r.rec*1.2?`<div class="rwarn">${L('نسبة التنفيذ أعلى بوضوح من سعرك. لو المشروع يشمل إشرافًا أو إدارة تنفيذ، فكّر في التسعير بالنسبة.','The construction percentage is clearly higher than your fee. If the project includes supervision or construction management, consider pricing by percentage.')}</div>`:''}
    <div><h4 style="margin-bottom:6px">${L('جدول الدفعات المقترح','Suggested payment schedule')}</h4><table class="pay"><tbody>${pay.map((t,i)=>`<tr><td>${esc(t)}</td><td class="pc"><input type="number" min="0" max="100" data-pay="${i}" value="${c.pay[i]}">%</td><td class="a">${fmt(r.rec*(+c.pay[i]||0)/100)}</td></tr>`).join('')}</tbody></table>
    ${paySum!==100?`<p class="hint" style="color:#fff;margin-top:6px">${L(`مجموع الدفعات ${paySum}% ويجب أن يساوي 100%.`,`Payments total ${paySum}%; they should add up to 100%.`)}</p>`:''}</div>
    <div class="derived" style="background:rgba(255,255,255,.1)"><span>${L('سعر ساعة التعديل الإضافي خارج النطاق','Hourly rate for out-of-scope revisions')}</span><b>${fmt(r.extra)} ${cur}</b></div>
    <button class="btn" type="button" id="copyQuote">${L('نسخ ملخص التسعير','Copy pricing summary')}</button>`;
}
function quoteText(){
  const r=calcNums(),c=S.calc,cu=curL(c.cur),pay=P().pay;
  return [L('ملخص تسعير — ','Pricing summary — ')+(S.project||L('مشروع','Project')),L('السعر المقترح لأتعاب التصميم: ','Suggested design fee: ')+fmt(r.rec)+' '+cu+' (≈ '+fmt(r.perM)+' '+cu+'/m²)',
    L('الحد الأدنى (التكلفة + ','Floor (cost + ')+c.margin+'%): '+fmt(r.floor),L('بالمتر المربع: ','Per m²: ')+fmt(r.market),L('نسبة من التنفيذ (مرجع): ','% of construction (reference): ')+fmt(r.pctFee),'',
    L('الدفعات:','Payments:')].concat(pay.map((t,i)=>'- '+t+': '+c.pay[i]+'% = '+fmt(r.rec*(+c.pay[i]||0)/100)+' '+cu))
    .concat(['',L('سعر ساعة التعديل الإضافي: ','Out-of-scope revision rate per hour: ')+fmt(r.extra)+' '+cu]).join('\n');
}

/* ───────── events ───────── */
document.addEventListener('click',e=>{
  const t=e.target;
  const lg=t.closest('[data-lang]'); if(lg){if(S.lang!==lg.dataset.lang){S.lang=lg.dataset.lang;save();applyLang();renderTabs();renderView();scrollTab();}return;}
  const v=t.closest('[data-view]'); if(v){go(v.dataset.view);return;}
  const sg=t.closest('[data-stage]'); if(sg){if(S.view!=='stages'){go('stages',sg.dataset.stage);}else{S.stage=sg.dataset.stage;save();renderStageParts();setHash();const sh=$('#sheet');if(sh&&sh.getBoundingClientRect().top<0)sh.scrollIntoView({behavior:'smooth'});}return;}
  const st=t.closest('[data-status]'); if(st){S.status[S.stage]=st.dataset.status;save();renderStageParts();return;}
  const cp=t.closest('[data-copyp]'); if(cp){writeClip(filledText(findPrompt(cp.dataset.copyp)),cp);return;}
  const cv=t.closest('[data-clearvars]'); if(cv){phsOf(findPrompt(cv.dataset.clearvars)).forEach(x=>delete S.vars[x]);save();cv.closest('details').querySelectorAll('[data-var]').forEach(i=>i.value='');refreshPreviews();return;}
  if(t.id==='hideDone'){S.hideDone=!S.hideDone;save();t.setAttribute('aria-pressed',S.hideDone);$('#checks').classList.toggle('hide-done',S.hideDone);return;}
  if(t.id==='allToggle'){const n=+S.stage,s=STAGES[n-1],all=doneIn(s)===s.checklist.length;s.checklist.forEach((_,i)=>S.checks[n+'-'+i]=!all);save();renderStageParts();return;}
  if(t.id==='copySummary'){writeClip(stagesSummary(),t);return;}
  const resetBtn=()=>`<button class="btn-line" id="reset" type="button">${L('مسح التقدم','Clear progress')}</button>`;
  if(t.id==='reset'){$('#resetWrap').innerHTML=`<span class="confirm"><span>${L('مسح كل التقدم؟','Clear all progress?')}</span><button class="btn" id="rYes" type="button">${L('نعم، امسح','Yes, clear')}</button><button class="btn-line" id="rNo" type="button">${L('إلغاء','Cancel')}</button></span>`;return;}
  if(t.id==='rYes'){S.checks={};S.status={};S.notes={};S.q={};save();renderStageParts();$('#resetWrap').innerHTML=resetBtn();toast(L('تم مسح التقدم','Progress cleared'));return;}
  if(t.id==='rNo'){$('#resetWrap').innerHTML=resetBtn();return;}
  const pt=t.closest('[data-ptype]'); if(pt){S.pf.type=pt.dataset.ptype;save();document.querySelectorAll('[data-ptype]').forEach(b=>b.setAttribute('aria-pressed',b===pt));renderPromptList();return;}
  const bc=t.closest('[data-bchoice]'); if(bc){const id=bc.dataset.bchoice,k=+bc.dataset.idx;S.brief[id]=S.brief[id]===k?-1:k;save();bc.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',S.brief[id]===+b.dataset.idx));refreshBriefNav();return;}
  const bh=t.closest('[data-bchip]'); if(bh){const id=bh.dataset.bchip,arr=Array.isArray(S.brief[id])?S.brief[id]:[],k=+bh.dataset.idx,j=arr.indexOf(k);j>=0?arr.splice(j,1):arr.push(k);S.brief[id]=arr;save();bh.setAttribute('aria-pressed',j<0);refreshBriefNav();return;}
  const bj=t.closest('[data-bjump]'); if(bj){const el=document.getElementById(bj.dataset.bjump);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(t.id==='bcopy'){writeClip(briefText(false),t);return;}
  if(t.id==='bblank'){writeClip(briefText(true),t);return;}
  if(t.id==='bclear'){$('#bclearWrap').innerHTML=`<span class="confirm"><span>${L('مسح كل الإجابات؟','Clear all answers?')}</span><button class="btn" id="bcYes" type="button">${L('نعم، امسح','Yes, clear')}</button><button class="btn-line" id="bcNo" type="button">${L('إلغاء','Cancel')}</button></span>`;return;}
  if(t.id==='bcYes'){S.brief={};S.bflags={};S.bprep={};save();renderView();toast(L('تم مسح النموذج','Answers cleared'));return;}
  if(t.id==='bcNo'){$('#bclearWrap').innerHTML=`<button class="btn-line" type="button" id="bclear">${L('مسح إجابات النموذج','Clear all answers')}</button>`;return;}
  const ms=t.closest('[data-mspace]'); if(ms){S.mf.space=+ms.dataset.mspace;save();document.querySelectorAll('[data-mspace]').forEach(b=>b.setAttribute('aria-pressed',b===ms));renderMaterials();return;}
  const mc=t.closest('[data-mcat]'); if(mc){S.mf.cat=mc.dataset.mcat;save();document.querySelectorAll('[data-mcat]').forEach(b=>b.setAttribute('aria-pressed',b===mc));renderMaterials();return;}
  if(t.id==='cmpClear'){S.cmp=[];save();renderMaterials();return;}
  const co=t.closest('[data-copyo]'); if(co){writeClip(P().objections[+co.dataset.copyo].say,co);return;}
  if(t.id==='copyAi'){writeClip(P().ai_script,t);return;}
  if(t.id==='copyQuote'){writeClip(quoteText(),t);return;}
});
document.addEventListener('change',e=>{
  const t=e.target,d=t.dataset;
  if(d.ck!==undefined){const n=+S.stage;S.checks[n+'-'+d.ck]=t.checked;t.closest('li').classList.toggle('is-done',t.checked);save();refreshStageProgress(n);}
  else if(d.q!==undefined){S.q[d.q]=t.checked;t.closest('li').classList.toggle('is-done',t.checked);save();renderTotals();}
  else if(d.bprep!==undefined){S.bprep[d.bprep]=t.checked;t.closest('li').classList.toggle('is-done',t.checked);save();}
  else if(d.bflag!==undefined){S.bflags[d.bflag]=t.checked;save();}
  else if(d.pcheck!==undefined){S.pcheck[d.pcheck]=t.checked;t.closest('li').classList.toggle('is-done',t.checked);save();}
  else if(d.cmp!==undefined){const i=+d.cmp,k=S.cmp.indexOf(i);if(t.checked&&k<0){if(S.cmp.length>=3){t.checked=false;toast(L('تقدر تقارن 3 خامات كحد أقصى','You can compare up to 3 materials'));return;}S.cmp.push(i);}else if(!t.checked&&k>=0)S.cmp.splice(k,1);save();t.closest('.mat').classList.toggle('sel',t.checked);renderCompare();}
  else if(t.id==='pstage'){S.pf.stage=t.value;save();renderPromptList();}
  else if(t.id==='msort'){S.mf.sort=t.value;save();renderMaterials();}
  else if(d.calc==='cur'||d.calc==='cx'){S.calc[d.calc]=t.value;save();renderCalc();}
  else if(d.calc==='rush'){S.calc.rush=t.checked;save();renderCalc();}
});
document.addEventListener('input',e=>{
  const t=e.target,d=t.dataset;
  if(t.id==='proj'){S.project=t.value;save();refreshPreviews();if(S.view==='stages')renderTotals();return;}
  if(d.var!==undefined){S.vars[d.var]=t.value;save();refreshPreviews();return;}
  if(d.notes!==undefined){S.notes[d.notes]=t.value;save();return;}
  if(d.bq!==undefined){S.brief[d.bq]=t.value;save();refreshBriefNav();return;}
  if(t.id==='pq'){S.pf.q=t.value;save();renderPromptList();return;}
  if(t.id==='mq'){S.mf.q=t.value;save();renderMaterials();return;}
  if(d.calc!==undefined&&t.type==='number'){S.calc[d.calc]=t.value;save();renderCalc();return;}
  if(d.hr!==undefined){S.calc.hrs[+d.hr]=t.value;save();renderCalc();return;}
  if(d.pay!==undefined){S.calc.pay[+d.pay]=t.value;save();renderCalc();const ni=document.querySelector(`[data-pay="${d.pay}"]`);if(ni)ni.focus();return;}
});
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.pr')&&d.open)fillPromptBody(d);},true);

/* ───────── boot ───────── */
(function route(){
  const h=(location.hash||'').slice(1);
  if(/^s\d{1,2}$/.test(h)&&+h.slice(1)>=1&&+h.slice(1)<=16){S.view='stages';S.stage=h.slice(1);}
  else if(h==='quality'||h==='guide'){S.view='stages';S.stage=h;}
  else if(['home','prompts','brief','stages','materials','pricing'].includes(h)) S.view=h;
})();
$('#proj').value=S.project||'';
applyLang(); renderTabs(); renderView(); scrollTab();
