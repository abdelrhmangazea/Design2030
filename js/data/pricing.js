/* Pricing guide */
const PRICE_PRINCIPLES = [
  {t:'السعر رقم تحسبه، لا رقم تخمّنه', d:'ابدأ دائمًا من تكلفتك الحقيقية (الحد الأدنى)، ثم قارن بالسوق، ثم بالقيمة التي يحصل عليها العميل. الرقم النهائي لا يقل عن الحد الأدنى أبدًا.'},
  {t:'العميل يدفع مقابل النتيجة والمسؤولية', d:'العميل لا يشتري ساعات عملك. يشتري قرارات صحيحة، وتوفيرًا في أخطاء التنفيذ، وشكلًا نهائيًا يرفع قيمة المكان.'},
  {t:'لا تخفّض السعر، عدّل النطاق', d:'أي تخفيض بدون تقليل الخدمة يقول للعميل إن رقمك الأول لم يكن حقيقيًا. إذا أراد رقمًا أقل، احذف مخرجًا أو خدمة.'},
  {t:'قل رقمك بثقة ثم اسكت', d:'بعد ذكر السعر لا تبرر ولا تعتذر. التردد في النبرة يفتح باب التفاوض قبل أن يعترض العميل.'},
  {t:'اكتب حدود الخدمة', d:'عدد جولات التعديل، والمخرجات، وما هو خارج النطاق. هذا يحمي ربحك من التعديلات المفتوحة.'}
];
const PRICE_METHODS = [
  {k:'sqm', t:'بالمتر المربع', en:'Per m²',
   f:'المساحة × سعر المتر × معامل الصعوبة',
   when:'الشقق والفلل والمكاتب ذات النطاق الواضح. الأسهل في الشرح للعميل.',
   pro:'واضح وسريع ويسهل المقارنة.',
   con:'لا يعكس صعوبة المشروع؛ حمام صغير معقد قد يأخذ وقت غرفة كبيرة. عالجها بمعامل الصعوبة.'},
  {k:'pct', t:'نسبة من تكلفة التنفيذ', en:'% of Construction',
   f:'ميزانية التنفيذ × النسبة المتفق عليها',
   when:'المشاريع الكبيرة والتجارية، وعندما تشمل الخدمة الإشراف أو إدارة التنفيذ.',
   pro:'الأتعاب تكبر مع حجم ومسؤولية المشروع.',
   con:'العميل قد يشك أنك تزيد الميزانية لتزيد أتعابك. اربطها بميزانية معتمدة في بداية العقد.'},
  {k:'hour', t:'بالساعة', en:'Hourly',
   f:'عدد الساعات × سعر الساعة',
   when:'الاستشارات، زيارات الموقع، والتعديلات خارج النطاق.',
   pro:'عادل في المهام الصغيرة وغير الواضحة.',
   con:'يعاقبك كلما أصبحت أسرع، خصوصًا مع الذكاء الاصطناعي. لا تستخدمه لمشروع كامل.'},
  {k:'fixed', t:'سعر ثابت لباقة', en:'Fixed Package',
   f:'مجموع قيمة المخرجات المحددة في الباقة',
   when:'الخدمات المتكررة: تصميم غرفة، استشارة ألوان وخامات، باقة 3D فقط.',
   pro:'العميل يعرف ما سيدفعه وما سيستلمه بالضبط.',
   con:'يحتاج تعريفًا دقيقًا للمخرجات وحدًا للتعديلات، وإلا يتحول لخدمة مفتوحة.'},
  {k:'value', t:'على أساس القيمة', en:'Value-based',
   f:'نسبة من القيمة المالية أو الأثر الذي يحققه التصميم',
   when:'المشاريع التجارية (مطعم، محل، عيادة) والاستثمارية حيث يمكن قياس الأثر.',
   pro:'أعلى هامش، ويربطك بنتيجة العميل لا بوقتك.',
   con:'يحتاج خبرة في الحوار وأعمالًا سابقة تثبت الأثر.'}
];
const PRICE_PHASES = [
  {t:'تأهيل العميل واللقاء الأول والـBrief', h:8},
  {t:'الرفع والتحليل والبحث', h:8},
  {t:'التخطيط وبدائل الـLayout', h:14},
  {t:'الـConcept والـMoodboard', h:14},
  {t:'التطوير والإظهار 3D', h:30},
  {t:'الرسومات التنفيذية والمواصفات', h:40},
  {t:'الـBOQ واختيار الخامات والأثاث', h:12},
  {t:'الاجتماعات وجولات التعديل', h:12},
  {t:'زيارات الإشراف', h:0}
];
const OBJECTIONS = [
  {o:'«السعر غالي»',
   mean:'غالبًا لا يرى الفرق بين ما ستقدمه وبين البديل الأرخص في ذهنه، أو الرقم أعلى من ميزانيته فعلًا.',
   say:'أفهم ذلك. خليني أسألك: غالي مقارنة بإيه؟ لأن العرض ده شامل [المخرجات]، وده اللي بيمنع أخطاء التنفيذ اللي بتكلف في العادة أكتر من أتعاب التصميم نفسها. لو الرقم أعلى من اللي مخططله، نقدر نراجع النطاق ونشوف إيه الأهم ليك دلوقتي.',
   avoid:'تخفيض السعر فورًا، أو الدخول في تبرير طويل لعدد ساعاتك.'},
  {o:'«في مصمم تاني بنص السعر»',
   mean:'يقارن رقمًا برقم، دون مقارنة ما يشمله كل عرض.',
   say:'ده وارد جدًا، والأسعار بتختلف حسب اللي بيتسلم. ممكن نقارن العرضين بندًا ببند: عدد اللقطات، الرسومات التنفيذية، الـBOQ، عدد التعديلات، والمتابعة في الموقع. لو لقيت نفس النطاق بنفس الجودة، يبقى اختيارك منطقي.',
   avoid:'انتقاد المصمم الآخر، أو مطابقة سعره.'},
  {o:'«ممكن خصم؟»',
   mean:'اختبار طبيعي. أحيانًا يريد إحساسًا بالفوز أكثر من الرقم نفسه.',
   say:'السعر محسوب على النطاق ده بالظبط. لو محتاج رقم أقل، أقترح نشيل [بند محدد] أو ننفذه على مرحلتين. أو لو الدفع مقدم بالكامل، أقدر أقدم [ميزة إضافية بدل الخصم].',
   avoid:'خصم بدون مقابل، لأنه يعلّم العميل أن التفاوض يربح دائمًا.'},
  {o:'«هفكر وأرد عليك»',
   mean:'غالبًا هناك سؤال أو قلق لم يُقل، أو صاحب قرار آخر لم يرَ العرض.',
   say:'أكيد، ده قرار مهم. عشان أساعدك في التفكير: إيه النقطة اللي محتاج توضيح أكتر فيها؟ ولو في حد تاني بيشاركك القرار، أحب أشرح له العرض بنفسي.',
   avoid:'إنهاء المكالمة بدون موعد متابعة محدد.'},
  {o:'«المقاول هيعمل التصميم ببلاش»',
   mean:'لا يرى التصميم كخدمة مستقلة، أو لم يمر بتجربة سيئة بعد.',
   say:'المقاول بيكسب من التنفيذ، فالتصميم عنده وسيلة لبيع الشغل. أنا شغلي أحميك: مواصفات واضحة، كميات محسوبة، وعروض أسعار تقدر تقارنها بين أكتر من مقاول. الفرق ده بيظهر في فاتورة التنفيذ.',
   avoid:'الهجوم على المقاولين عمومًا.'},
  {o:'«عايز 3D بس من غير رسومات»',
   mean:'يرى الصورة هي المنتج، ولا يعرف قيمة الرسومات في التنفيذ.',
   say:'أقدر أعمل كده، بس خلي بالك إن الصورة بتوري الشكل، والرسومات هي اللي بتضمن إن المنفذ يعمل نفس الشكل بالمقاسات الصح. من غيرها المقاول هيجتهد، والاجتهاد بيتدفع تمنه في الموقع.',
   avoid:'تقديم الرسومات مجانًا ضمن الـ3D.'},
  {o:'«أدفع بعد ما أشوف التصميم»',
   mean:'قلق من المخاطرة وعدم الثقة الكافية بعد.',
   say:'أفهم القلق ده. عشان كده الدفع مقسم على مراحل، وكل دفعة مرتبطة بمخرج تشوفه وتعتمده. الدفعة الأولى بتحجز الوقت وتبدأ الرفع والتخطيط.',
   avoid:'البدء في العمل بدون دفعة مقدمة وعقد.'},
  {o:'«الذكاء الاصطناعي بيعمل الصور دي في ثانية»',
   mean:'يخلط بين الصورة وبين التصميم القابل للتنفيذ.',
   say:'صحيح، أي حد يقدر يطلع صورة حلوة. اللي أنت بتدفع مقابله إن الصورة دي تكون مطابقة لمقاسات بيتك، وخاماتها موجودة في السوق وفي ميزانيتك، وتتحول لرسومات ينفذها المقاول بدون مفاجآت. الأدوات بتخليني أسرع وأديك بدائل أكتر، لكن القرار والمسؤولية عليّ.',
   avoid:'إنكار استخدامك للذكاء الاصطناعي.'}
];
const AI_PRICING = [
  {t:'لماذا لا تخفّض سعرك؟', d:'العميل يدفع مقابل النتيجة: مكان يعمل، وقرارات صحيحة، وتنفيذ بلا أخطاء. الذكاء الاصطناعي اختصر وقت الإظهار والصياغة، لكنه لم يختصر خبرتك في الحكم على الفكرة ولا مسؤوليتك عن المقاسات والمواصفات.'},
  {t:'أين يذهب الوقت الذي وفرته؟', d:'حوّله إلى قيمة يراها العميل: بدائل أكثر في الـConcept، سرعة في الرد والتسليم، وجودة أعلى في المراجعة. أو حوّله إلى ربح: نفس السعر في وقت أقل يعني مشاريع أكثر في الشهر.'},
  {t:'سعّر بالمخرج لا بالساعة', d:'انقل مشاريعك الكاملة إلى التسعير بالمتر أو الباقة أو القيمة. التسعير بالساعة يجعل كل تحسين في سرعتك خصمًا تلقائيًا من دخلك.'},
  {t:'اجعل السرعة ميزة مدفوعة', d:'التسليم السريع خدمة لها قيمة. يمكنك تقديم باقة «تسليم مستعجل» بسعر أعلى بدل أن تمنحها مجانًا.'},
  {t:'كن صريحًا في استخدامك للأدوات', d:'اشرح للعميل أنك تستخدم أدوات حديثة ليحصل على بدائل أكثر ووضوح أعلى قبل التنفيذ. الإخفاء يضعفك إذا اكتشفه لاحقًا، والصراحة تضعك كمصمم متقدم.'}
];
const AI_SCRIPT = 'أنا بستخدم أدوات ذكاء اصطناعي في مراحل الإظهار والبدائل، وده معناه إنك هتشوف أفكار أكتر وبوضوح أعلى قبل ما تصرف جنيه على التنفيذ. لكن سعري مش على عدد الساعات، سعري على النتيجة: تصميم مدروس لمساحتك وميزانيتك، ورسومات ومواصفات تحميك من أخطاء التنفيذ. الأداة بتسرّعني، لكن القرار والمسؤولية عليّ أنا.';
const PRICE_CHECK = [
  'حسبت الحد الأدنى من تكاليفي الفعلية وساعات المشروع، والسعر أعلى منه.',
  'فصلت أتعاب التصميم عن تكلفة التنفيذ والأثاث في العرض.',
  'كتبت المخرجات بالتفصيل لكل مرحلة (عدد اللقطات، الرسومات، الـBOQ).',
  'حددت عدد جولات التعديل وسعر التعديل الإضافي.',
  'كتبت ما هو خارج النطاق بوضوح.',
  'ربطت كل دفعة بمخرج يعتمده العميل.',
  'حددت مدة صلاحية العرض.',
  'جهزت ردًا على أول اعتراض متوقع قبل إرسال العرض.'
];
const PAY_DEFAULT = [
  {t:'عند توقيع الاتفاق وبدء الرفع', p:30},
  {t:'عند اعتماد التخطيط والـConcept', p:30},
  {t:'عند تسليم الـ3D والرسومات التنفيذية', p:30},
  {t:'عند تسليم الـBOQ والمواصفات النهائية', p:10}
];

const PRICE_EN = {
 "principles": [
  {
   "t": "Price is a number you calculate, not one you guess",
   "d": "Always start from your real cost (the floor), then compare with the market, then with the value the client gets. The final number never goes below the floor."
  },
  {
   "t": "The client pays for the outcome and the responsibility",
   "d": "The client isn't buying your hours. They're buying the right decisions, savings on execution mistakes, and a finished result that raises the value of the space."
  },
  {
   "t": "Don't cut the price — adjust the scope",
   "d": "Any discount without reducing the service tells the client your first number wasn't real. If they want a lower number, remove a deliverable or a service."
  },
  {
   "t": "State your number with confidence, then stop talking",
   "d": "After you name the price, don't justify or apologize. Hesitation in your tone opens negotiation before the client has even objected."
  },
  {
   "t": "Put the service limits in writing",
   "d": "Number of revision rounds, deliverables, and what's out of scope. This protects your profit from open-ended revisions."
  }
 ],
 "methods": [
  {
   "k": "sqm",
   "t": "Per m²",
   "f": "Area × rate per m² × complexity factor",
   "when": "Apartments, villas and offices with a clear scope. The easiest to explain to a client.",
   "pro": "Clear, fast and easy to compare.",
   "con": "Doesn't reflect project complexity; a small, complex bathroom can take as long as a large room. Offset this with the complexity factor."
  },
  {
   "k": "pct",
   "t": "% of Construction Cost",
   "f": "Construction budget × agreed percentage",
   "when": "Large and commercial projects, and when the service includes supervision or construction management.",
   "pro": "Fees grow with the project's size and responsibility.",
   "con": "The client may suspect you're inflating the budget to raise your fee. Tie it to an approved budget at the start of the contract."
  },
  {
   "k": "hour",
   "t": "Hourly",
   "f": "Number of hours × hourly rate",
   "when": "Consultations, site visits, and out-of-scope revisions.",
   "pro": "Fair for small or undefined tasks.",
   "con": "Penalizes you the faster you get, especially with AI. Don't use it for a full project."
  },
  {
   "k": "fixed",
   "t": "Fixed Package",
   "f": "Total value of the deliverables defined in the package",
   "when": "Repeatable services: single-room design, colour and material consultation, 3D-only package.",
   "pro": "The client knows exactly what they'll pay and what they'll receive.",
   "con": "Needs precisely defined deliverables and a revision limit, or it turns into an open-ended service."
  },
  {
   "k": "value",
   "t": "Value-based",
   "f": "A share of the financial value or impact the design delivers",
   "when": "Commercial projects (restaurant, shop, clinic) and investment projects where impact can be measured.",
   "pro": "Highest margin, and it ties you to the client's results rather than your time.",
   "con": "Requires strong conversation skills and past work that proves impact."
  }
 ],
 "phases": [
  "Client qualification, first meeting & Brief",
  "Site survey, analysis & research",
  "Space planning & layout options",
  "Concept & moodboard",
  "Design development & 3D visualization",
  "Construction drawings & specifications",
  "BOQ, material & furniture selection",
  "Meetings & revision rounds",
  "Site supervision visits"
 ],
 "objections": [
  {
   "o": "“It's too expensive”",
   "mean": "Usually they don't see the difference between what you'll deliver and the cheaper alternative in their head — or the number really is above their budget.",
   "say": "I understand. Let me ask you — expensive compared to what? Because this proposal covers [deliverables], and that's what prevents the execution mistakes that usually cost more than the design fee itself. If the number is above what you'd planned, we can revisit the scope and see what matters most to you right now.",
   "avoid": "Dropping the price immediately, or launching into a long justification of your hours."
  },
  {
   "o": "“Another designer quoted half the price”",
   "mean": "They're comparing one number to another, not what each proposal includes.",
   "say": "That's very possible — prices vary depending on what's delivered. Let's compare the two proposals line by line: number of renders, construction drawings, the BOQ, number of revisions, and site follow-up. If you find the same scope at the same quality, then your choice makes sense.",
   "avoid": "Criticizing the other designer, or matching their price."
  },
  {
   "o": "“Can I get a discount?”",
   "mean": "A normal test. Sometimes they want the feeling of winning more than the number itself.",
   "say": "The price is calculated for exactly this scope. If you need a lower number, I'd suggest we remove [specific item] or do it in two phases. Or, if you pay in full upfront, I can offer [added benefit instead of a discount].",
   "avoid": "A discount with nothing in return — it teaches the client that negotiating always wins."
  },
  {
   "o": "“I'll think about it and get back to you”",
   "mean": "There's usually an unspoken question or concern, or another decision-maker who hasn't seen the proposal.",
   "say": "Of course — it's an important decision. To help you think it through: which point would you like more clarity on? And if someone else is part of the decision, I'd be glad to walk them through the proposal myself.",
   "avoid": "Ending the call without a specific follow-up date."
  },
  {
   "o": "“The contractor will do the design for free”",
   "mean": "They don't see design as a separate service, or they haven't had a bad experience yet.",
   "say": "The contractor makes money on the build, so design is just a way to sell the work. My job is to protect you: clear specifications, calculated quantities, and quotes you can compare across several contractors. That difference shows up on the construction bill.",
   "avoid": "Attacking contractors in general."
  },
  {
   "o": "“I just want 3D, no drawings”",
   "mean": "They see the image as the product and don't know the value of drawings during execution.",
   "say": "I can do that, but keep in mind: the image shows the look, and the drawings are what make sure the builder delivers that same look at the right dimensions. Without them, the contractor improvises — and you pay for improvisation on site.",
   "avoid": "Throwing in the drawings for free with the 3D."
  },
  {
   "o": "“I'll pay after I see the design”",
   "mean": "Anxiety about risk, and not enough trust yet.",
   "say": "I understand the concern. That's exactly why payment is split into stages, and each payment is tied to a deliverable you see and approve. The first payment reserves the time and kicks off the site survey and planning.",
   "avoid": "Starting work without a deposit and a contract."
  },
  {
   "o": "“AI makes these images in a second”",
   "mean": "They're confusing an image with a buildable design.",
   "say": "True — anyone can produce a nice image. What you're paying for is making sure that image matches your home's actual dimensions, uses materials that exist in the market and fit your budget, and turns into drawings a contractor can build without surprises. The tools make me faster and let me give you more options, but the decisions and the responsibility are mine.",
   "avoid": "Denying that you use AI."
  }
 ],
 "ai": [
  {
   "t": "Why you shouldn't lower your price",
   "d": "The client pays for the outcome: a space that works, the right decisions, and mistake-free execution. AI has cut the time spent on visualization and writing, but not your expertise in judging an idea, nor your responsibility for dimensions and specifications."
  },
  {
   "t": "Where does the time you saved go?",
   "d": "Turn it into value the client can see: more Concept options, faster replies and delivery, and higher review quality. Or turn it into profit: the same price in less time means more projects per month."
  },
  {
   "t": "Price by deliverable, not by the hour",
   "d": "Move your full projects to per-m², package or value-based pricing. Hourly pricing turns every gain in speed into an automatic cut to your income."
  },
  {
   "t": "Make speed a paid feature",
   "d": "Fast delivery is a service with value. Offer a \"rush delivery\" package at a higher price instead of giving it away for free."
  },
  {
   "t": "Be open about the tools you use",
   "d": "Explain to the client that you use modern tools so they get more options and greater clarity before execution. Hiding it weakens you if they find out later; openness positions you as an advanced designer."
  }
 ],
 "ai_script": "I use AI tools in the visualization and options stages, which means you'll see more ideas, with more clarity, before you spend a single penny on construction. But my price isn't based on hours — it's based on the result: a design that's thought through for your space and your budget, with drawings and specifications that protect you from execution mistakes. The tools make me faster, but the decisions and the responsibility are mine.",
 "check": [
  "I calculated my floor from actual costs and project hours, and the price is above it.",
  "I separated design fees from construction and furniture costs in the proposal.",
  "I listed the deliverables in detail for each phase (number of renders, drawings, BOQ).",
  "I set the number of revision rounds and the price of extra revisions.",
  "I clearly stated what's out of scope.",
  "I tied each payment to a deliverable the client approves.",
  "I set the proposal's validity period.",
  "I prepared a response to the first expected objection before sending the proposal."
 ],
 "pay": [
  "On signing the agreement and starting the site survey",
  "On approval of the space plan and Concept",
  "On delivery of the 3D and construction drawings",
  "On delivery of the BOQ and final specifications"
 ]
};
