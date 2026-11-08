/* solo.js - landing copy for the solo-founder story: Ishak is the ONE in ONE FOR ALL, his team is AI.
   Loaded right after landing.js; overrides hero texts, page title and adds a FAQ entry, then re-renders. */
Object.assign(T, {
  tagline: ['واحد للكل، بالذكاء الاصطناعي', 'Un pour tous, avec l\'IA', 'One for all, powered by AI'],
  eyb: ['شخص واحد، وكالة كاملة', 'Une seule personne, une agence complète', 'One person, a full agency'],
  h_title: ['أنا <em>الـ ONE</em>، والخدمة <em>للكل</em>', 'Je suis <em>le ONE</em>, au service de <em>tous</em>', 'I\'m <em>the ONE</em>, working for <em>all</em>'],
  h_sub: ['أنا إسحاق، وفريقي هو الذكاء الاصطناعي. فيديوهات، صفحات هبوط، متاجر، حسابات إعلانية وخدمات رقمية، بسرعة الأوتوماسيون وبشخص واحد يتابع مشروعك من الأول للأخير. سجّل، اطلب، ادفع بـ BaridiMob وتابع طلبك خطوة بخطوة.', 'Je suis Ishak, et mon équipe, c\'est l\'IA. Vidéos, landing pages, boutiques, comptes publicitaires et services digitaux, à la vitesse de l\'automatisation, avec une seule personne qui suit votre projet du début à la fin. Inscrivez-vous, commandez, payez par BaridiMob et suivez chaque étape.', 'I\'m Ishak, and my team is AI. Videos, landing pages, stores, ad accounts and digital services, at automation speed, with one person following your project from start to finish. Sign up, order, pay with BaridiMob and track every step.'],
});
FAQ.unshift([['شكون يخدم على طلبي؟', 'Qui travaille sur ma commande ?', 'Who works on my order?'], ['أنا إسحاق، مع أدوات الذكاء الاصطناعي. ما كاينش وسيط: تحكي معايا مباشرة، والـ AI يخليني نسلّم أسرع وبسعر أحسن.', 'Moi, Ishak, avec des outils d\'IA. Pas d\'intermédiaire : vous parlez directement avec moi, et l\'IA me permet de livrer plus vite et moins cher.', 'Me, Ishak, with AI tools. No middleman: you talk to me directly, and AI lets me deliver faster and at a better price.']]);
applyI18n();
