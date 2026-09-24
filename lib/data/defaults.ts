import { Category, Post, Prayer, SiteSettings } from '@/types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name_gu: 'શ્રીજી બાબાની કૃપા',
  site_name_en: 'Shreeji Baba Ni Krupa',
  site_tagline_gu: 'શ્રીજી બાવાની કૃપા સર્વે પર બની રહે.',
  site_tagline_en: 'May the grace of Shreeji Baba be upon everyone.',
  hero_heading_gu: 'જય શ્રી કૃષ્ણ',
  hero_heading_en: 'Jai Shree Krishna',
  hero_intro_gu: 'શ્રીજી બાવાની અપર કૃપાથી આ જીવન ધન્ય છે. આપણા સંસ્કાર, પરંપરા અને ભક્તિની સુગંધ આપ સી સુધી પહોંચે એ જ પ્રયત્ન.',
  hero_intro_en: 'By the boundless grace of Shreeji Baba, this life is blessed. Our humble endeavor is to bring the fragrance of our traditions, heritage, and devotion to you.',
  hero_sanskrit_line_gu: '|| શ્રી કૃષ્ણ શરણં મમ: ||',
  hero_sanskrit_line_en: '|| Shree Krishna Sharanam Mama: ||',
  hero_image_url: '/images/defaults/hero-shrinathji.webp',
  tradition_title_gu: 'વૈષ્ણવ વાણીયા સમાજ',
  tradition_title_en: 'Vaishnav Vaniya Samaj',
  tradition_text_gu: `વૈષ્ણવ વાણીયા સમાજ વૈષ્ણવ ધાર્મિક પરંપરાથી પ્રેરિત, સેવા, સદાચાર અને સંસ્કારોથી સમૃદ્ધ સમુદાય છે. શ્રી વલ્લભાચાર્ય મહાપ્રભુજી દ્વારા સ્થાપિત પુષ્ટિમાર્ગના અનુયાયી તરીકે અમે શ્રીનાથજીની અનન્ય કૃપાના ઉપલબ્ધ છીએ.\n\nશતાબ્દીઓથી આ સમુદાયે વેપાર, દાન, ભક્તિ અને શિક્ષણના ક્ષેત્રે મહત્વપૂર્ણ યોગદાન આપ્યું છે. આપણા પૂર્વજોએ શ્રદ્ધા અને પરિશ્રમથી જે મૂલ્યો અને પરંપરા સંભાળી છે, તેને આગળની પેઢીઓને પહોંચાડવી એ આપણું કર્તવ્ય છે.`,
  tradition_text_en: `The Vaishnav Vaniya Samaj is a heritage community guided by Vaishnav principles, devoted seva, righteousness, and cultural values. As followers of Pushtimarg founded by Shri Vallabhacharya Mahaprabhuji, we cherish the eternal grace of Shrinathji.\n\nFor centuries, this community has contributed deeply to commerce, philanthropy, spiritual devotion, and education. Upholding and passing these sacred values to future generations is our lifelong duty.`,
  tradition_image_url: '/images/defaults/tradition-haveli.webp',
  contact_email: 'example@gmail.com',
  contact_phone: '+91 98765 43210',
  social_facebook: 'https://facebook.com',
  social_instagram: 'https://instagram.com',
  social_youtube: 'https://youtube.com',
  footer_copyright_gu: '© 2025 શ્રીજી બાબાની કૃપા | બધા હક્ક સુરક્ષિત.',
  footer_copyright_en: '© 2025 Shreeji Baba Ni Krupa | All rights reserved.',
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    slug: 'bhakti-sadhana',
    name_gu: 'ભક્તિ અને સાધના',
    name_en: 'Devotion & Sadhana',
    description_gu: 'શ્રીજીના ચરણોમાં સમર્પણ અને નિત્ય સાધનાના પાવન માર્ગદર્શન.',
    description_en: 'Guidance and devotion dedicated to the lotus feet of Shreeji.',
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    slug: 'pushtimarg-sanskar',
    name_gu: 'પુષ્ટિમાર્ગીય સંસ્કાર',
    name_en: 'Pushtimarg Heritage',
    description_gu: 'મહાપ્રભુજી વલ્લભાચાર્યજીની દિવ્ય પરંપરા અને સેવા ભાવના.',
    description_en: 'The divine heritage and seva spirit of Mahaprabhuji Vallabhacharyaji.',
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    slug: 'santan-anubhav',
    name_gu: 'જીવન અનુભવો',
    name_en: 'Life & Reflections',
    description_gu: 'જીવનમાંથી શીખેલા આધ્યાત્મિક પાઠ અને હૃદયસ્પર્શી સંસ્મરણો.',
    description_en: 'Spiritual life lessons and heartfelt reflections.',
    sort_order: 3,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    slug: 'utsav-darshan',
    name_gu: 'ઉત્સવ અને દર્શન',
    name_en: 'Festivals & Darshan',
    description_gu: 'વૈષ્ણવ ઉત્સવો, ઝાંખી અને અલૌકિક લીલાઓનું વર્ણન.',
    description_en: 'Vaishnav festivals, darshan glimpses, and divine celebrations.',
    sort_order: 4,
    created_at: '2025-01-01T00:00:00Z',
  },
];

export const DEFAULT_PRAYERS: Prayer[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    slug: 'adharam-madhuram',
    title_gu: 'અધરમ મધુરમ',
    title_en: 'Adharam Madhuram (Madhurashtakam)',
    subtitle_gu: 'શ્રી કૃષ્ણના મધુર રૂપનું વર્ણન.',
    subtitle_en: 'Description of Lord Krishna\'s all-encompassing sweetness.',
    icon_type: 'flute',
    order_index: 1,
    content_gu: `અધરં મધુરં વદનં મધુરં નયનં મધુરં હસિતં મધુરમ્ ।
હૃદયં મધુરં ગમનં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૧ ॥

વચનં મધુરં ચરિતં મધુરં વસનં મધુરં વલિતં મધુરમ્ ।
ચલિતં મધુરં ભ્રમિતં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૨ ॥

વેણુર્મધુરો રેણુર્મધુરઃ પાણિર્મધુરઃ પાદૌ મધુરૌ ।
નૃત્યં મધુરં સખ્યં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૩ ॥

ગીતં મધુરં પીતં મધુરં ભુક્તં મધુરં સુપ્તં મધુરમ્ ।
રૂપં મધુરં તિલકં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૪ ॥

શ્રીમદ્ વલ્લભાચાર્ય રચિત આ મધુરાષ્ટકમ શ્રી કૃષ્ણના પ્રત્યેક અંગ, ચરિત્ર અને લીલાની મધુરતાનું પરમ ગુણગાન કરે છે. જ્યારે ભક્ત પ્રેમપૂર્વક આ સ્તુતિ કરે છે, ત્યારે તેનું સમગ્ર જીવન મધુરતાથી ભરાઈ જાય છે.`,
    content_en: `Adharam Madhuram Vadanam Madhuram Nayanam Madhuram Hasitam Madhuram |
Hridayam Madhuram Gamanam Madhuram Madhuradhipater Akhilam Madhuram || 1 ||

His lips are sweet, His face is sweet, His eyes are sweet, His smile is sweet,
His loving heart is sweet, His gait is sweet — everything about the Lord of Sweetness is sweet!

Composed by Shrimad Vallabhacharya Mahaprabhuji, this divine hymn celebrates the infinite sweetness of every aspect of Lord Krishna.`,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    slug: 'chintamani-prarthana',
    title_gu: 'શ્રી ચિંતામણિ પ્રાર્થના',
    title_en: 'Shree Chintamani Prarthana',
    subtitle_gu: 'અરે ચિંત કપરીને કાર્યમ',
    subtitle_en: 'Sacred prayer for overcoming anxiety and spiritual surrender.',
    icon_type: 'lotus',
    order_index: 2,
    content_gu: `અરે ચેતો મા ગા વ્યથામ્ ।
શ્રીકૃષ્ણશ્ચરણે મનઃ સદૈવ સુસ્થિરં કુરુ ॥

ચિંતા કાપિ ન કાર્તવ્યા યદિ ચેત્ શ્રીપતિર્હૃદિ ।
જગદીશિતુઃ કૃપાલાવાત્ સર્વં સંસિધ્યતિ ક્ષણાત્ ॥

હે મન! તું વ્યર્થ ચિંતા ન કર. જે શ્રીજી બાવા સમગ્ર જગતના પાલનહાર છે, તે તારું કલ્યાણ કેમ નહીં કરે? શ્રીકૃષ્ણના ચરણારવિંદમાં સંપૂર્ણ સમર્પણ કરવાથી સર્વ ચિંતાઓ ક્ષણમાત્રમાં દૂર થાય છે. આ પવિત્ર પ્રાર્થના ભક્તના હૃદયમાં અડગ શ્રદ્ધા અને શાંતિ સ્થાપિત કરે છે.`,
    content_en: `O my mind! Do not worry or despair.
Fix your heart and thoughts steadfastly upon the divine lotus feet of Shree Krishna.

When the Lord of the Universe resides in your heart, no anxiety can touch you. By a mere drop of His grace, all obstacles vanish instantly.`,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    slug: 'yamunashtakam',
    title_gu: 'યમુનાષ્ટકમ',
    title_en: 'Yamunashtakam',
    subtitle_gu: 'યમુના મહારાણીની સ્તુતિ.',
    subtitle_en: 'Hymn in praise of Shri Yamuna Maharani.',
    icon_type: 'peacock',
    order_index: 3,
    content_gu: `નમામિ યમુનામહં સકલ સિદ્ધિ હેતું મુદા
મુરારી પદ પંકજ સ્ફુરદ મંદ રેણૂત્કટામ્ ।
તટસ્થ નવ કાનન પ્રકટ મોદ પુષ્પાંબુના
સુરાસુર સુપૂજિત પ્રભવ શુદ્ધ દંભોમ્ભુજામ્ ॥ ૧ ॥

કલિકલુષ નાશિની સકલ સિદ્ધિ દાત્રી શ્રી યમુના મહારાણી ભક્તોને શ્રીકૃષ્ણના ચરણો સુધી પહોંચાડનાર પરમ કૃપાળુ માતા છે. પુષ્ટિમાર્ગમાં યમુનાજીની કૃપા વગર ભક્તિભાવ પુષ્ટ થતો નથી.`,
    content_en: `Namami Yamunam Aham Sakala Siddhi Hetum Muda
Murari Pada Pankaja Sphurad Amanda Renutkatam |
Tatastha Nava Kanana Prakata Moda Pushpambuna
Surasura Supujita Prabhava Shuddha Dambhom-bhujam || 1 ||

I joyfully bow to Shri Yamuna Maharani, the source of all divine fulfillment and spiritual accomplishments, who carries the sacred dust of the lotus feet of Lord Krishna.`,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
];

export const DEFAULT_POSTS: Post[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    slug: 'bhakti-no-sacho-arth',
    title_gu: 'ભક્તિનો સાચો અર્થ',
    title_en: 'The True Meaning of Bhakti',
    excerpt_gu: 'ભક્તિ માત્ર રીવાજ નથી, તે જીવનની દિશા છે...',
    excerpt_en: 'Bhakti is not merely a custom or routine; it is the ultimate compass of life...',
    content_gu: `
<p>ભક્તિ માત્ર બાહ્ય આચરણ કે રોજિંદો રીવાજ નથી, પરંતુ હૃદયનો પરમાત્મા સાથેનો અતૂટ સંબંધ છે. જ્યારે મનુષ્ય પોતાના અહંકારને ઓગાળીને ઈશ્વરના ચરણોમાં સંપૂર્ણ સમર્પણ કરે છે, ત્યારે જ સાચી ભક્તિનો ઉદય થાય છે.</p>
<h2>નિઃસ્વાર્થ પ્રેમનું સ્વરૂપ</h2>
<p>પુષ્ટિમાર્ગમાં ભક્તિનો અર્થ છે પ્રેમલક્ષણા ભક્તિ. જેમાં કોઈ સ્વાર્થ કે અપેક્ષા નથી હોતી, માત્ર અને માત્ર શ્રીજી બાવાની પ્રસન્નતા જ મુખ્ય ધ્યેય હોય છે. આપણે જે કંઈ કરીએ તે પ્રભુ સેવાના ભાવથી કરવું એ જ સંસારમાં રહીને પણ મોક્ષ પામવાનો સરળ રાજમાર્ગ છે.</p>
<blockquote>
  "જે ક્ષણે મનમાંથી 'હું' અને 'મારું' છૂટી જાય છે, તે જ ક્ષણે પ્રભુ શ્રીજી બાવાની અસીમ કૃપાની અનુભૂતિ થાય છે."
</blockquote>
<p>આપણા રોજિંદા જીવનમાં પણ દરેક કાર્યને ઈશ્વરને અર્પણ કરીને જીવવું એ સાચી સાધના છે. સેવા પૂજા કરતી વખતે ચિત્ત શાંત રાખવું અને અન્ય જીવો પ્રત્યે દયાભાવ રાખવો એ જ વૈષ્ણવ ધર્મનો સાર છે.</p>
`,
    content_en: `
<p>Bhakti is not merely an external custom or a daily routine; it is an unbroken bond of the soul with the Divine. When an individual dissolves the ego and surrenders completely at the lotus feet of the Almighty, true devotion awakens.</p>
<h2>The Essence of Selfless Love</h2>
<p>In Pushtimarg, devotion is characterized as Prem-lakshana Bhakti — pure love without transactional desires. The sole goal is bringing happiness to Shreeji. Doing whatever comes our way with an attitude of humble service is the royal path of grace.</p>
<blockquote>
  "The moment the ego drops, the boundless grace of Shreeji begins to flow through one's life."
</blockquote>
<p>Surrendering all our actions throughout the day to the Lord is the essence of daily sadhana. Maintaining calm during seva and nurturing compassion toward all living beings reflects the true Vaishnav ethos.</p>
`,
    cover_image_url: '/images/defaults/blog-bhakti.webp',
    cover_image_alt: 'Sunset over holy river ghat with boats and devotional atmosphere',
    category_id: 'a1111111-1111-1111-1111-111111111111',
    category: DEFAULT_CATEGORIES[0],
    status: 'published',
    author_name_gu: 'સંપાદક',
    author_name_en: 'Editor',
    likes_count: 14,
    published_at: '2025-05-12T10:00:00Z',
    created_at: '2025-05-12T10:00:00Z',
    updated_at: '2025-05-12T10:00:00Z',
    tags: ['ભક્તિ', 'પુષ્ટિમાર્ગ', 'સાધના'],
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    slug: 'shreenathji-ane-aapun-natu',
    title_gu: 'શ્રીનાથજી અને આપણું નાતું',
    title_en: 'Our Eternal Bond with Shrinathji',
    excerpt_gu: 'શ્રીનાથજી સાથેનું નાતું એટલું પ્રગટ છે કે શબ્દો ઓછા પડે...',
    excerpt_en: 'The bond with Shrinathji is so intimate and profound that words fall short...',
    content_gu: `
<p>શ્રીનાથજી માત્ર એક મૂર્તિ કે વિગ્રહ નથી, પરંતુ વૈષ્ણવ ભક્ત માટે સાક્ષાત્ પૂર્ણ પુરુષોત્તમ છે. જેમ બાળક પોતાની માતાના ખોળામાં સંપૂર્ણ નિર્ભય બનીને સુઈ જાય છે, તેમ ભક્ત શ્રીજીના શરણમાં પરમ શાંતિ અનુભવે છે.</p>
<h2>નાથદ્વારાની દિવ્ય ઝાંખી</h2>
<p>નાથદ્વારામાં જ્યારે શંખનાદ થાય અને રાજભોગ કે શયનના દર્શન ખુલે, ત્યારે લાખો વૈષ્ણવોનું હૃદય એક અનોખા આનંદથી ધબકવા લાગે છે. શ્રીજીનો એ દિવ્ય શૃંગાર, કમળ સમાન નયનો અને મુખ પરનું મૃદુ હાસ્ય ભવભવના તાપ હરી લે છે.</p>
<p>આપણે જ્યાં પણ હોઈએ, ભાવપૂર્વક સ્મરણ કરીએ એટલે શ્રીજી આપણી સાથે જ બિરાજમાન છે તેવો અહેસાસ થાય છે. આ નાતું શ્રદ્ધા અને સમર્પણનું છે.</p>
`,
    content_en: `
<p>Shrinathji is not just a sacred idol; to a devotee, He is the living Supreme Divine. Just as a child rests fearlessly in its mother's lap, a Vaishnav finds supreme tranquility at Shreeji's lotus feet.</p>
<h2>The Divine Glances of Nathdwara</h2>
<p>When the conch resonates in Nathdwara and the curtains part for Rajbhog or Shayan Darshan, millions of hearts beat with boundless ecstacy. His ornate shringar and lotus-like eyes banish the pains of worldly existence.</p>
<p>Wherever we may be, remembering Him with deep affection makes His presence immediately tangible.</p>
`,
    cover_image_url: '/images/defaults/blog-shrinathji.webp',
    cover_image_alt: 'Sacred Shrinathji deity adorned in divine jewels and flower garlands',
    category_id: 'a2222222-2222-2222-2222-222222222222',
    category: DEFAULT_CATEGORIES[1],
    status: 'published',
    author_name_gu: 'શ્રીજી ભક્ત',
    author_name_en: 'Shreeji Devotee',
    likes_count: 28,
    published_at: '2025-05-10T14:30:00Z',
    created_at: '2025-05-10T14:30:00Z',
    updated_at: '2025-05-10T14:30:00Z',
    tags: ['શ્રીનાથજી', 'દર્શન', 'વૈષ્ણવ'],
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    slug: 'jeevan-mathi-shikhela-path',
    title_gu: 'જીવનમાંથી શીખેલા પાઠ',
    title_en: 'Life Lessons from Devotion',
    excerpt_gu: 'કેટલાક અનુભવ શબ્દોમાં વણી શકાય, અનેક આંખો ભીંજાવે...',
    excerpt_en: 'Some life experiences can be captured in words, while others gently moisten the eyes...',
    content_gu: `
<p>જીવનના અનેક વળાંકો પર જ્યારે મુશ્કેલીઓનો સામનો કરવો પડે છે, ત્યારે સત્સંગ અને પ્રભુ સ્મરણ જ સાચો સહારો બને છે. વડીલોના આશીર્વાદ અને ધર્મના સંસ્કારો મનુષ્યને ગમે તેવી વિપરીત પરિસ્થિતિમાં પણ અડગ રાખે છે.</p>
<h2>નમ્રતા અને સંતોષ</h2>
<p>જીવનમાં સૌથી મોટી સંપત્તિ સંતોષ છે. જ્યારે આપણે બીજાની પ્રગતિ જોઈને ઈર્ષ્યા કરવાને બદલે પ્રભુએ જે આપ્યું છે તેનો આભાર માનીએ છીએ, ત્યારે જીવનમાં સાચી સુખ-શાંતિ આવે છે. સેવા માત્ર મંદિરમાં જ નહીં, જરૂરિયાતમંદ વ્યક્તિની મદદ કરવામાં પણ છે.</p>
<p>સૌમ્ય વાણી અને પરોપકારની ભાવના એ જ સાચું જીવન ઘડતર કરે છે.</p>
`,
    content_en: `
<p>At various turns of life when challenges arise, spiritual satsang and remembering the Lord become our guiding light. Blessings of elders and roots in faith keep one anchored through every storm.</p>
<h2>Humility and Contentment</h2>
<p>The greatest wealth in life is contentment. When we thank God for what we have instead of comparing ourselves with others, genuine peace fills the heart. True seva extends beyond temple walls to serving those in need.</p>
`,
    cover_image_url: '/images/defaults/blog-lessons.webp',
    cover_image_alt: 'Ancient scripture manuscript with quill pen and warm lighting',
    category_id: 'a3333333-3333-3333-3333-333333333333',
    category: DEFAULT_CATEGORIES[2],
    status: 'published',
    author_name_gu: 'સંપાદક',
    author_name_en: 'Editor',
    likes_count: 9,
    published_at: '2025-05-06T09:15:00Z',
    created_at: '2025-05-06T09:15:00Z',
    updated_at: '2025-05-06T09:15:00Z',
    tags: ['સંસ્કાર', 'જીવન', 'અનુભવ'],
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    slug: 'vallabh-parampara-ni-divyata',
    title_gu: 'વલ્લભ પરંપરાની દિવ્યતા',
    title_en: 'The Divinity of Vallabh Tradition',
    excerpt_gu: 'પુષ્ટિમાર્ગની મહિમા અને તેની અનોખી ગતિ...',
    excerpt_en: 'The boundless glory and unique grace of the Pushtimarg path...',
    content_gu: `
<p>જગદ્ગુરુ શ્રી વલ્લભાચાર્ય મહાપ્રભુજીએ કલિયુગમાં જીવોના ઉદ્ધાર માટે પુષ્ટિમાર્ગની સ્થાપના કરી. આ માર્ગમાં કોઈ કઠોર તપસ્યા નથી, પરંતુ પ્રેમ અને સ્નેહથી શ્રીઠાકોરજીની સેવા કરવાનો આદેશ છે.</p>
<h2>બ્રહ્મસંબંધનું મહત્વ</h2>
<p>બ્રહ્મસંબંધ દીક્ષા દ્વારા જીવ પોતાના શરીર, મન, ધન અને સમગ્ર જીવનને શ્રીકૃષ્ણને સમર્પિત કરે છે. ત્યાર પછી જે પણ ભોજન કે વસ્તુ વપરાય તે પહેલાં પ્રભુને અર્પણ કરવામાં આવે છે. આ પરંપરા આપણા ઘરોને મંદિર બનાવે છે.</p>
<p>હવેલી સંગીત, વિવિધ ઋતુઓના મનોરથ અને શૃંગારની કળા આપણી સંસ્કૃતિનો અમૂલ્ય વારસો છે.</p>
`,
    content_en: `
<p>Jagadguru Shri Vallabhacharya Mahaprabhuji established Pushtimarg for the spiritual elevation of souls in Kaliyuga. In this path, there is no harsh ascetic penance; rather, it is the joyful service of Thakorji with unconditional love.</p>
<h2>The Sanctity of Brahmasambandha</h2>
<p>Through Brahmasambandha, a seeker surrenders their body, mind, wealth, and soul to Shri Krishna. Every action and meal is offered first to the Divine, turning every home into a sacred haven.</p>
<p>Haveli Sangeet, seasonal Manoraths, and the sublime art of Shringar remain an irreplaceable spiritual legacy.</p>
`,
    cover_image_url: '/images/defaults/blog-tradition.webp',
    cover_image_alt: 'Ancient Hindu temple stone shikhar tower reaching toward the sky',
    category_id: 'a2222222-2222-2222-2222-222222222222',
    category: DEFAULT_CATEGORIES[1],
    status: 'published',
    author_name_gu: 'વૈષ્ણવ જન',
    author_name_en: 'Vaishnav Devotee',
    likes_count: 19,
    published_at: '2025-05-01T16:00:00Z',
    created_at: '2025-05-01T16:00:00Z',
    updated_at: '2025-05-01T16:00:00Z',
    tags: ['વલ્લભાચાર્ય', 'પુષ્ટિમાર્ગ', 'પરંપરા'],
  },
];
