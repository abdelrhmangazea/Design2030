# Bonus Design 2030

حقيبة أدوات إيفنت **Design 2030** من Interior Zone وIADB — موقع ثابت (HTML + CSS + JavaScript) بدون أي build أو مكتبات.

**الأدوات:** مكتبة الأوامر الجاهزة · نموذج بريف العميل · تشيك لست مراحل المشروع · دليل الخامات المرجعي · دليل التسعير.
متاح بالعربية والإنجليزية من زرار اللغة في أعلى الصفحة. كل التقدم والإجابات تُحفظ في متصفح المستخدم فقط (localStorage).

## هيكل الملفات

```
index.html            الصفحة الرئيسية
css/styles.css        التصميم (هوية IADB، وضع فاتح وداكن)
js/app.js             منطق الأداة والتبديل بين اللغتين
js/data/stages.js     الـ16 مرحلة: البنود والخطوات والأوامر (عربي + إنجليزي)
js/data/materials.js  دليل الخامات (33 خامة)
js/data/brief.js      أسئلة البريف
js/data/pricing.js    محتوى دليل التسعير
assets/iadb-seal.png  لوجو IADB والأيقونة
vercel.json           إعدادات Vercel
```

## التشغيل محليًا

افتح `index.html` مباشرة في المتصفح، أو شغّل سيرفر بسيط:

```
npx serve .
```

## النشر على Vercel

1. ارفع الفولدر ده كـ repository على GitHub.
2. من Vercel: **Add New → Project** واختار الـ repository.
3. Framework Preset: **Other** — اترك Build Command وOutput Directory فاضيين.
4. اضغط **Deploy**. أي push على الـ main بعد كده بيتنشر تلقائيًا.

## تعديل المحتوى

كل المحتوى في `js/data/`. عدّل النص العربي والإنجليزي في نفس الملف، واحتفظ بنفس ترتيب العناصر وعددها بين اللغتين.
