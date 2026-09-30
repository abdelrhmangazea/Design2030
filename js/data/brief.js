/* Client brief template */
const BRIEF_PREP = [
  'قرأت رسالة الاستفسار الأولى ودونت ما قاله العميل بكلماته.',
  'طلبت مسبقًا صور الموقع أو الرسومات المتاحة وموقع المشروع على الخريطة.',
  'حددت مدة اللقاء (60 إلى 90 دقيقة) وأبلغت العميل بها.',
  'تأكدت من حضور كل أصحاب القرار، أو عرفت من سيغيب ومتى يتم إشراكه.',
  'جهزت عينتين أو ثلاثًا من أعمال سابقة مشابهة لنوع المشروع.',
  'استأذنت العميل في تسجيل اللقاء أو كتابة الملاحظات أمامه.'
];
const BRIEF_RULES = [
  {t:'ابدأ بالحياة لا بالستايل', d:'السؤال عن اليوم المعتاد يفتح العميل ويكشف الاحتياج الحقيقي. سؤال «بتحب ستايل إيه؟» في البداية يعطيك صورًا من الإنترنت لا احتياجًا.'},
  {t:'من السهل إلى العميق', d:'الأسئلة مرتبة بحيث تبني الثقة أولًا، ثم تصل إلى الميزانية وصاحب القرار بعد أن يكون العميل مرتاحًا في الحديث.'},
  {t:'استمع 70% وتكلم 30%', d:'دورك في اللقاء الأول هو الفهم. أجّل عرض أفكارك وحلولك إلى مرحلة الـConcept.'},
  {t:'اكتب كلماته كما هي', d:'عبارة مثل «عايز البيت يبقى هادي» معلومة تصميمية. اكتبها بين علامتي تنصيص ولا تترجمها لستايل من عندك.'},
  {t:'افصل الرغبة عن الأولوية', d:'كل عميل يريد كل شيء. اسأل دائمًا: لو اضطررنا نختار، إيه الأهم؟'}
];
const BRIEF = [
 {k:'basics', t:'بيانات المشروع', en:'Project Details', min:5,
  intro:'بيانات سريعة تُملأ في أول دقيقتين أو قبل اللقاء.',
  qs:[
   {id:'client',q:'اسم العميل',type:'text',key:1},
   {id:'phone',q:'رقم التواصل',type:'text'},
   {id:'location',q:'موقع المشروع (المدينة والحي)',type:'text',key:1},
   {id:'ptype',q:'نوع المشروع',type:'choice',opts:['شقة','فيلا','دوبلكس','مكتب','محل تجاري','مطعم أو كافيه','عيادة','أخرى'],key:1},
   {id:'pstate',q:'حالة المشروع',type:'choice',opts:['على الطوب','نصف تشطيب','مسكون ويحتاج تجديد','تجديد جزئي'],key:1},
   {id:'area',q:'المساحة التقريبية ومصدرها',type:'text',ph:'مثال: 180 م² حسب عقد الشراء، تحتاج رفع',why:'المساحة من العقد ليست رفعًا معتمدًا. سجل المصدر حتى لا تُبنى عليها تسعيرة نهائية.'},
   {id:'source',q:'كيف وصل إلينا؟',type:'choice',opts:['ترشيح من عميل','إنستجرام','فيسبوك','تيك توك','موقع إلكتروني','أخرى'],why:'يعرفك ماذا شاهد العميل من أعمالك قبل اللقاء وما توقعاته.'}
  ]},
 {k:'opening', t:'البداية الدافئة', en:'Opening', min:10,
  intro:'أسئلة مفتوحة تجعل العميل يحكي. لا تقاطعه، ودوّن الكلمات التي يكررها.',
  qs:[
   {id:'story',q:'احكيلي عن المشروع ده، إيه اللي خلاك تفكر فيه دلوقتي؟',type:'area',why:'يكشف الدافع الحقيقي: زواج، مولود جديد، انتقال، استثمار، أو ضيق من الوضع الحالي.',follow:'وليه التوقيت ده بالذات؟',key:1},
   {id:'success',q:'لو تخيلت نفسك بعد ما المشروع يخلص، إيه اللي هيخليك تقول إنه نجح؟',type:'area',why:'يعطيك معيار النجاح بكلمات العميل، وتعود إليه عند كل قرار.',follow:'إيه الإحساس اللي عايزه أول ما تفتح الباب؟',key:1},
   {id:'prev',q:'اشتغلت مع مصمم أو مقاول قبل كده؟ إيه اللي عجبك وإيه اللي ضايقك؟',type:'area',why:'يكشف المخاوف والتوقعات المسبقة، ويحذرك من تكرار نفس المشكلة.'}
  ]},
 {k:'people', t:'الناس والحياة اليومية', en:'Users & Lifestyle', min:15,
  intro:'التصميم يُبنى على من سيستخدم المكان وكيف. هنا تظهر أغلب الاحتياجات التي لا يقولها العميل صراحة.',
  qs:[
   {id:'users',q:'مين هيعيش أو يشتغل في المكان؟ (الأعمار والأدوار)',type:'area',ph:'مثال: زوجان في الثلاثينات، طفلان 4 و9 سنوات، والدة الزوج تزور أسبوعيًا',why:'الأطفال وكبار السن والحيوانات الأليفة يغيرون اختيار الخامات والحواف والإضاءة والحركة.',key:1},
   {id:'day',q:'احكيلي يوم عادي عندكم من الصبح لبالليل.',type:'area',why:'يكشف أوقات الذروة في المطبخ والحمامات، ومن يعمل من البيت، وأين يقضون وقتهم فعلًا.',follow:'وفي الويك إند بيختلف إزاي؟'},
   {id:'guests',q:'بتستقبلوا ضيوف قد إيه؟ وكام شخص في العادة؟',type:'text',why:'يحدد حجم الاستقبال والسفرة، والفصل بين منطقة الضيوف ومنطقة العائلة.'},
   {id:'privacy',q:'إيه درجة الخصوصية المطلوبة بين الضيوف والعائلة، أو بين الموظفين والعملاء؟',type:'text'},
   {id:'habits',q:'في عادات أو هوايات محتاجة مكان خاص؟ (طبخ كثير، رياضة، قراءة، شغل من البيت، صلاة)',type:'area'},
   {id:'access',q:'في حد محتاج اعتبارات خاصة في الحركة أو الوصول؟',type:'text',why:'اسأل بلطف وبدون افتراض. الإجابة تؤثر على العروض والارتفاعات والأرضيات.'}
  ]},
 {k:'spaces', t:'الفراغات والتخزين', en:'Spaces & Storage', min:10,
  intro:'حوّل الحياة اليومية إلى قائمة فراغات وأولويات.',
  qs:[
   {id:'rooms',q:'الفراغات المطلوبة',type:'chips',opts:['استقبال','معيشة','سفرة','مطبخ مفتوح','مطبخ مغلق','غرفة نوم رئيسية','غرف أطفال','غرفة ضيوف','مكتب','غرفة ملابس','حمام ضيوف','غرفة غسيل','غرفة خادمة','تراس أو بلكونة','غرفة ألعاب','مخزن'],key:1},
   {id:'storage',q:'إيه اللي محتاج تخزين ومش لاقي له مكان دلوقتي؟',type:'area',why:'نقص التخزين هو أكثر شكوى بعد السكن. اسأل عن الشنط والمواسم والأدوات الكبيرة.'},
   {id:'keep',q:'في أثاث أو قطع حالية عايز تحتفظ بيها؟',type:'area',why:'القطع المحتفظ بها لها مقاسات وألوان ستفرض نفسها على التخطيط والـPalette، فاطلب صورها ومقاساتها.'},
   {id:'tech',q:'احتياجات تقنية أو خاصة (سمارت هوم، شاشات، صوتيات، كاميرات، تكييف مركزي)',type:'text'}
  ]},
 {k:'pain', t:'المشاكل والأولويات', en:'Pain Points & Priorities', min:10,
  intro:'هنا تعرف ما الذي يضايق العميل فعلًا، وما الذي لا يمكن التنازل عنه.',
  qs:[
   {id:'hate',q:'إيه أكثر حاجة بتضايقك في مكانك الحالي؟',type:'area',why:'المشكلة الحالية هي أقوى نقطة بيع لحلك لاحقًا في العرض.',key:1},
   {id:'must',q:'إيه الحاجات اللي لازم تكون موجودة مهما حصل؟ (Must Have)',type:'area',key:1},
   {id:'nice',q:'وإيه الحاجات اللي لو موجودة يبقى أحسن؟ (Nice to Have)',type:'area'},
   {id:'tradeoff',q:'لو اضطرينا نختار بين مساحة أكبر للمعيشة أو غرفة إضافية، تختار إيه؟',type:'text',why:'سؤال مفاضلة واحد يكشف أولوياته أسرع من عشرة أسئلة مباشرة. غيّر طرفيه حسب المشروع.'}
  ]},
 {k:'taste', t:'الذوق والإحساس', en:'Style & Mood', min:10,
  intro:'تأتي بعد فهم الحياة، حتى يكون الستايل وسيلة لخدمة الاحتياج وليس بداية له.',
  qs:[
   {id:'words',q:'لو هتوصف إحساس المكان في 3 كلمات، هتقول إيه؟',type:'text',ph:'مثال: هادي، دافي، منظم',why:'الكلمات الثلاث تصبح معيار الحكم على الـConcept لاحقًا.',key:1},
   {id:'refs',q:'عندك صور مرجعية؟ إيه اللي عاجبك فيها بالتحديد؟',type:'area',why:'اسأل عن السبب لا عن الصورة. العميل قد يحب الصورة بسبب الإضاءة لا الأثاث.'},
   {id:'dislike',q:'إيه الألوان أو الخامات أو الأشكال اللي مش بتحبها؟',type:'area',why:'الرفض أوضح من القبول. صور الرفض توفر عليك جولات تعديل كاملة.',key:1},
   {id:'colors',q:'الألوان المفضلة وإحساسك تجاه الألوان الجريئة',type:'text'},
   {id:'light',q:'بتحب الإضاءة دافية ولا بيضاء؟ وفي أماكن محتاجة إضاءة قوية للشغل أو القراءة؟',type:'text'},
   {id:'care',q:'قد إيه وقتك يسمح بصيانة الخامات؟ (رخام يحتاج عناية، خشب طبيعي، أقمشة فاتحة)',type:'choice',opts:['أفضل خامات بدون صيانة','صيانة بسيطة مقبولة','لا مانع من الصيانة مقابل الشكل'],why:'يربط الذوق بالواقع قبل أن تقترح خامات يرفضها العميل بعد التنفيذ.'}
  ]},
 {k:'budget', t:'الميزانية', en:'Budget', min:10,
  intro:'تسأل عنها بعد بناء الثقة، وتفصل دائمًا بين أتعاب التصميم وتكلفة التنفيذ والأثاث.',
  qs:[
   {id:'budget',q:'حاطط ميزانية تقريبية للمشروع كله؟',type:'text',ph:'مثال: من 1.2 إلى 1.5 مليون جنيه',why:'إذا تردد العميل، اعرض عليه نطاقات لمشاريع مشابهة واسأله أين يرى نفسه. لا تكمل بدون نطاق.',follow:'الرقم ده شامل التشطيب والأثاث والأجهزة ولا التشطيب بس؟',key:1},
   {id:'bincl',q:'الميزانية تشمل إيه؟',type:'chips',opts:['التشطيب','الأثاث','الإضاءة','الأجهزة الكهربائية','المطبخ','التكييف','الإكسسوارات والديكور','أتعاب التصميم']},
   {id:'bflex',q:'مدى مرونة الميزانية',type:'choice',opts:['ثابتة لا تزيد','مرنة في حدود 10–15%','مرنة لو القيمة واضحة'],key:1},
   {id:'bprior',q:'لو الميزانية ما كفتش كل حاجة، تفضل تصرف فين الأول؟',type:'text',why:'يعطيك خطة المرحلية: ما يُنفذ الآن وما يُؤجل.'}
  ]},
 {k:'time', t:'الجدول الزمني', en:'Timeline', min:5,
  intro:'المواعيد تؤثر على اختيار الخامات المستوردة وطريقة التنفيذ ونطاق الخدمة.',
  qs:[
   {id:'start',q:'إمتى تحب نبدأ؟',type:'text'},
   {id:'deadline',q:'في موعد لازم المشروع يخلص قبله؟ وليه؟',type:'text',why:'الموعد المرتبط بحدث (فرح، دراسة، افتتاح) غير قابل للتحريك، ويجب أن يظهر في العرض وخطة التوريد.',key:1},
   {id:'living',q:'هتكون ساكن في المكان أثناء التنفيذ؟',type:'choice',opts:['نعم','لا','جزئيًا']}
  ]},
 {k:'decision', t:'القرار والتواصل', en:'Decision Making', min:5,
  intro:'أغلب التأخير والتعديلات سببه شخص غير حاضر في اللقاء لكنه يملك رأيًا.',
  qs:[
   {id:'dm',q:'مين هيشارك في القرارات؟ ومين صاحب القرار النهائي؟',type:'area',why:'اعرف من يوقّع ومن يؤثر (الزوج أو الزوجة، الأهل، الشريك، المستثمر). اطلب حضورهم في العرض القادم.',key:1},
   {id:'approve',q:'تحب الاعتمادات تتم إزاي؟',type:'choice',opts:['اجتماع في المكتب','أونلاين','رسائل واتساب مع ملف PDF','زيارة الموقع']},
   {id:'contact',q:'أفضل وسيلة وتوقيت للتواصل',type:'text'},
   {id:'others',q:'بتكلم مصممين أو شركات تانية على نفس المشروع؟',type:'text',why:'سؤال مباشر ومهذب يعرفك موقعك في المقارنة وماذا يقارن العميل.'}
  ]},
 {k:'close', t:'الإغلاق والخطوة التالية', en:'Closing', min:5,
  intro:'لخّص ما فهمته بصوت عالٍ، واترك اللقاء بخطوة محددة وموعد.',
  qs:[
   {id:'summary',q:'ملخص ما فهمته (اقرأه على العميل للتأكيد)',type:'area',ph:'«فهمت إن أهم حاجة عندكم…، والمشكلة الأساسية…، والميزانية في حدود…، والموعد…»',key:1},
   {id:'need',q:'المطلوب من العميل (رسومات، صور، مقاسات، قائمة قطع محتفظ بها)',type:'area'},
   {id:'next',q:'الخطوة التالية وموعدها',type:'text',ph:'مثال: إرسال عرض الخدمة يوم الأحد، ومكالمة مراجعة الثلاثاء',key:1}
  ]}
];
const BRIEF_FLAGS = [
  'العميل يريد بدء العمل قبل الاتفاق على النطاق والأتعاب.',
  'صاحب القرار الحقيقي غير حاضر ولا يوجد موعد لإشراكه.',
  'لا يوجد نطاق ميزانية حتى بعد عرض أمثلة.',
  'موعد التسليم غير واقعي مقارنة بحجم الأعمال.',
  'يطلب «أفكار أولية» مجانية قبل التعاقد.',
  'يتكلم بسلبية شديدة عن كل من تعامل معهم سابقًا.',
  'يغيّر المطلوب الأساسي أكثر من مرة في نفس اللقاء.'
];

const BRIEF_EN = {
 "prep": [
  "I read the client's first inquiry message and noted what they said in their own words.",
  "I asked in advance for site photos or any available drawings, plus the project location on a map.",
  "I set the meeting length (60 to 90 minutes) and told the client.",
  "I confirmed all decision-makers will attend, or I know who will be absent and when they'll be brought in.",
  "I prepared two or three samples of past work similar to this project type.",
  "I asked the client's permission to record the meeting or take notes in front of them."
 ],
 "rules": [
  {
   "t": "Start with their life, not the style",
   "d": "Asking about a typical day opens the client up and reveals the real need. Opening with \"What style do you like?\" gets you pictures from the internet, not a need."
  },
  {
   "t": "From easy to deep",
   "d": "The questions are ordered to build trust first, then reach budget and decision-maker once the client is comfortable talking."
  },
  {
   "t": "Listen 70%, talk 30%",
   "d": "Your job in the first meeting is to understand. Hold your ideas and solutions until the Concept stage."
  },
  {
   "t": "Write their exact words",
   "d": "A phrase like \"I want the house to feel calm\" is design information. Put it in quotation marks and don't translate it into a style of your own."
  },
  {
   "t": "Separate wants from priorities",
   "d": "Every client wants everything. Always ask: if we had to choose, what matters most?"
  }
 ],
 "flags": [
  "The client wants to start work before scope and fees are agreed.",
  "The real decision-maker is absent and there's no date to bring them in.",
  "No budget range, even after being shown examples.",
  "The deadline is unrealistic for the scope of work.",
  "They ask for free \"initial ideas\" before signing.",
  "They speak very negatively about everyone they've worked with before.",
  "They change the core requirements more than once in the same meeting."
 ],
 "sections": [
  {
   "k": "basics",
   "t": "Project Details",
   "intro": "Quick facts to fill in during the first two minutes or before the meeting.",
   "qs": [
    {
     "id": "client",
     "q": "Client name"
    },
    {
     "id": "phone",
     "q": "Contact number"
    },
    {
     "id": "location",
     "q": "Project location (city and district)"
    },
    {
     "id": "ptype",
     "q": "Project type",
     "opts": [
      "Apartment",
      "Villa",
      "Duplex",
      "Office",
      "Retail shop",
      "Restaurant or café",
      "Clinic",
      "Other"
     ]
    },
    {
     "id": "pstate",
     "q": "Project condition",
     "opts": [
      "Shell & core / unfinished",
      "Semi-finished",
      "Occupied, needs renovation",
      "Partial renovation"
     ]
    },
    {
     "id": "area",
     "q": "Approximate area and its source",
     "why": "An area from the contract is not a verified survey. Record the source so no final price is built on it.",
     "ph": "e.g. 180 m² per the purchase contract; needs a site survey"
    },
    {
     "id": "source",
     "q": "How did they find us?",
     "why": "Tells you what of your work the client saw before the meeting and what they expect.",
     "opts": [
      "Client referral",
      "Instagram",
      "Facebook",
      "TikTok",
      "Website",
      "Other"
     ]
    }
   ]
  },
  {
   "k": "opening",
   "t": "Warm Opening",
   "intro": "Open questions that get the client talking. Don't interrupt, and note the words they repeat.",
   "qs": [
    {
     "id": "story",
     "q": "Tell me about this project — what made you start thinking about it now?",
     "why": "Reveals the real driver: a wedding, a new baby, a move, an investment, or frustration with the current place.",
     "follow": "And why this timing in particular?"
    },
    {
     "id": "success",
     "q": "Picture yourself once the project is finished — what would make you say it was a success?",
     "why": "Gives you the success criteria in the client's own words, to come back to at every decision.",
     "follow": "What feeling do you want the moment you open the front door?"
    },
    {
     "id": "prev",
     "q": "Have you worked with a designer or contractor before? What did you like, and what frustrated you?",
     "why": "Surfaces fears and existing expectations, and warns you against repeating the same problem."
    }
   ]
  },
  {
   "k": "people",
   "t": "Users & Daily Life",
   "intro": "Design is built on who will use the space and how. This is where most of the needs the client never says out loud come up.",
   "qs": [
    {
     "id": "users",
     "q": "Who's going to live or work in the space? (Ages and roles)",
     "why": "Children, older people and pets change the choice of materials, edges, lighting and circulation.",
     "ph": "e.g. A couple in their thirties, two kids aged 4 and 9, the husband's mother visits weekly"
    },
    {
     "id": "day",
     "q": "Walk me through a normal day for you, from morning to night.",
     "why": "Reveals peak times in the kitchen and bathrooms, who works from home, and where they actually spend their time.",
     "follow": "And how is the weekend different?"
    },
    {
     "id": "guests",
     "q": "How often do you have guests over? And how many people, usually?",
     "why": "Sets the size of the reception and dining areas, and the separation between guest and family zones."
    },
    {
     "id": "privacy",
     "q": "How much privacy do you need between guests and family — or between staff and customers?"
    },
    {
     "id": "habits",
     "q": "Any habits or hobbies that need their own space? (Lots of cooking, exercise, reading, working from home, prayer)"
    },
    {
     "id": "access",
     "q": "Does anyone need special consideration for mobility or access?",
     "why": "Ask gently and without assumptions. The answer affects widths, heights and flooring."
    }
   ]
  },
  {
   "k": "spaces",
   "t": "Spaces & Storage",
   "intro": "Turn daily life into a list of spaces and priorities.",
   "qs": [
    {
     "id": "rooms",
     "q": "Required spaces",
     "opts": [
      "Formal reception",
      "Living room",
      "Dining",
      "Open kitchen",
      "Closed kitchen",
      "Master bedroom",
      "Kids' rooms",
      "Guest room",
      "Office",
      "Walk-in closet",
      "Guest bathroom",
      "Laundry room",
      "Maid's room",
      "Terrace or balcony",
      "Playroom",
      "Storage room"
     ]
    },
    {
     "id": "storage",
     "q": "What needs storage that you can't find a place for right now?",
     "why": "Lack of storage is the most common complaint after moving in. Ask about luggage, seasonal items and bulky equipment."
    },
    {
     "id": "keep",
     "q": "Is there any existing furniture or pieces you want to keep?",
     "why": "Kept pieces have sizes and colours that will shape the layout and the palette, so ask for photos and dimensions."
    },
    {
     "id": "tech",
     "q": "Technical or special needs (smart home, screens, audio, cameras, central A/C)"
    }
   ]
  },
  {
   "k": "pain",
   "t": "Pain Points & Priorities",
   "intro": "This is where you learn what really bothers the client, and what they won't compromise on.",
   "qs": [
    {
     "id": "hate",
     "q": "What bothers you most about your current place?",
     "why": "The current problem becomes the strongest selling point for your solution in the proposal later."
    },
    {
     "id": "must",
     "q": "What absolutely has to be there, no matter what? (Must Have)"
    },
    {
     "id": "nice",
     "q": "And what would be great to have if possible? (Nice to Have)"
    },
    {
     "id": "tradeoff",
     "q": "If we had to choose between a bigger living area or an extra room, which would you pick?",
     "why": "One trade-off question reveals priorities faster than ten direct ones. Swap the two options to suit the project."
    }
   ]
  },
  {
   "k": "taste",
   "t": "Style & Mood",
   "intro": "This comes after understanding their life, so style serves the need rather than starting it.",
   "qs": [
    {
     "id": "words",
     "q": "If you had to describe how the space should feel in three words, what would they be?",
     "why": "Those three words become the yardstick for judging the Concept later.",
     "ph": "e.g. Calm, warm, organized"
    },
    {
     "id": "refs",
     "q": "Do you have any reference images? What exactly do you like about them?",
     "why": "Ask about the reason, not the image. The client may love a photo for its lighting, not its furniture."
    },
    {
     "id": "dislike",
     "q": "Which colours, materials or shapes do you not like?",
     "why": "Dislikes are clearer than likes. Images of what they reject save you entire rounds of revisions."
    },
    {
     "id": "colors",
     "q": "Favourite colours, and how you feel about bold colours"
    },
    {
     "id": "light",
     "q": "Do you prefer warm or white lighting? And are there areas that need strong light for work or reading?"
    },
    {
     "id": "care",
     "q": "How much time can you give to maintaining materials? (Marble needs care, natural wood, light-coloured fabrics)",
     "why": "Connects taste to reality before you propose materials the client rejects after installation.",
     "opts": [
      "I prefer maintenance-free materials",
      "Light maintenance is fine",
      "Happy to maintain them for the right look"
     ]
    }
   ]
  },
  {
   "k": "budget",
   "t": "Budget",
   "intro": "Ask about it after trust is built, and always separate design fees from construction and furniture costs.",
   "qs": [
    {
     "id": "budget",
     "q": "Have you set a rough budget for the whole project?",
     "why": "If the client hesitates, show ranges from similar projects and ask where they see themselves. Don't move on without a range.",
     "follow": "Does that figure cover finishing, furniture and appliances, or just the finishing?",
     "ph": "e.g. 1.2 to 1.5 million"
    },
    {
     "id": "bincl",
     "q": "What does the budget include?",
     "opts": [
      "Finishing works",
      "Furniture",
      "Lighting",
      "Appliances",
      "Kitchen",
      "Air conditioning",
      "Accessories & décor",
      "Design fees"
     ]
    },
    {
     "id": "bflex",
     "q": "How flexible is the budget?",
     "opts": [
      "Fixed, can't go over",
      "Flexible within 10–15%",
      "Flexible if the value is clear"
     ]
    },
    {
     "id": "bprior",
     "q": "If the budget doesn't stretch to everything, where would you rather spend first?",
     "why": "Gives you the phasing plan: what gets done now and what gets deferred."
    }
   ]
  },
  {
   "k": "time",
   "t": "Timeline",
   "intro": "Dates affect the choice of imported materials, the execution method and the scope of service.",
   "qs": [
    {
     "id": "start",
     "q": "When would you like to start?"
    },
    {
     "id": "deadline",
     "q": "Is there a date the project has to be finished by? And why?",
     "why": "A deadline tied to an event (a wedding, a school year, an opening) can't be moved, and must appear in the proposal and the procurement plan."
    },
    {
     "id": "living",
     "q": "Will you be living in the space during the works?",
     "opts": [
      "Yes",
      "No",
      "Partly"
     ]
    }
   ]
  },
  {
   "k": "decision",
   "t": "Decisions & Communication",
   "intro": "Most delays and revisions come from someone who isn't in the meeting but still has an opinion.",
   "qs": [
    {
     "id": "dm",
     "q": "Who'll be involved in the decisions? And who has the final say?",
     "why": "Know who signs and who influences (spouse, family, partner, investor). Ask them to attend the next presentation."
    },
    {
     "id": "approve",
     "q": "How would you like approvals to happen?",
     "opts": [
      "Meeting at the office",
      "Online",
      "WhatsApp messages with a PDF",
      "Site visit"
     ]
    },
    {
     "id": "contact",
     "q": "Best way and time to reach you"
    },
    {
     "id": "others",
     "q": "Are you talking to other designers or firms about this project?",
     "why": "A direct, polite question that shows where you stand in the comparison and what the client is comparing."
    }
   ]
  },
  {
   "k": "close",
   "t": "Closing & Next Step",
   "intro": "Summarize what you understood out loud, and leave the meeting with a specific next step and date.",
   "qs": [
    {
     "id": "summary",
     "q": "Summary of what I understood (read it back to the client to confirm)",
     "ph": "\"So what matters most to you is…, the main problem is…, the budget is around…, and the deadline is…\""
    },
    {
     "id": "need",
     "q": "What we need from the client (drawings, photos, measurements, list of pieces to keep)"
    },
    {
     "id": "next",
     "q": "Next step and its date",
     "ph": "e.g. Send the service proposal on Sunday, review call on Tuesday"
    }
   ]
  }
 ]
};
