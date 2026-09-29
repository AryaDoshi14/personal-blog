-- ==============================================================================
-- Shreeji Bawa Blog / શ્રીજી બાબાની કૃપા
-- Comprehensive Seed Data
-- ==============================================================================

-- 1. CATEGORIES SEED
INSERT INTO public.categories (id, slug, name_gu, name_en, description_gu, description_en, sort_order)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'bhakti-sadhana',
    'ભક્તિ અને સાધના',
    'Devotion & Sadhana',
    'શ્રીજીના ચરણોમાં સમર્પણ અને નિત્ય સાધનાના પાવન માર્ગદર્શન.',
    'Guidance and devotion dedicated to the lotus feet of Shreeji.',
    1
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'pushtimarg-sanskar',
    'પુષ્ટિમાર્ગીય સંસ્કાર',
    'Pushtimarg Heritage',
    'મહાપ્રભુજી વલ્લભાચાર્યજીની દિવ્ય પરંપરા અને સેવા ભાવના.',
    'The divine heritage and seva spirit of Mahaprabhuji Vallabhacharyaji.',
    2
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'santan-anubhav',
    'જીવન અનુભવો',
    'Life & Reflections',
    'જીવનમાંથી શીખેલા આધ્યાત્મિક પાઠ અને હૃદયસ્પર્શી સંસ્મરણો.',
    'Spiritual life lessons and heartfelt reflections.',
    3
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'utsav-darshan',
    'ઉત્સવ અને દર્શન',
    'Festivals & Darshan',
    'વૈષ્ણવ ઉત્સવો, ઝાંખી અને અલૌકિક લીલાઓનું વર્ણન.',
    'Vaishnav festivals, darshan glimpses, and divine celebrations.',
    4
  )
ON CONFLICT (slug) DO UPDATE SET
  name_gu = EXCLUDED.name_gu,
  name_en = EXCLUDED.name_en,
  description_gu = EXCLUDED.description_gu,
  description_en = EXCLUDED.description_en,
  sort_order = EXCLUDED.sort_order;

-- 2. PRAYERS SEED (Sacred Prayers matching reference)
INSERT INTO public.prayers (id, slug, title_gu, title_en, subtitle_gu, subtitle_en, icon_type, order_index, content_gu, content_en)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'adharam-madhuram',
    'અધરમ મધુરમ',
    'Adharam Madhuram (Madhurashtakam)',
    'શ્રી કૃષ્ણના મધુર રૂપનું વર્ણન.',
    'Description of Lord Krishna''s all-encompassing sweetness.',
    'flute',
    1,
    'અધરં મધુરં વદનં મધુરં નયનં મધુરં હસિતં મધુરમ્ ।
હૃદયં મધુરં ગમનં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૧ ॥

વચનં મધુરં ચરિતં મધુરં વસનં મધુરં વલિતં મધુરમ્ ।
ચલિતં મધુરં ભ્રમિતં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૨ ॥

વેણુર્મધુરો રેણુર્મધુરઃ પાણિર્મધુરઃ પાદૌ મધુરૌ ।
નૃત્યં મધુરં સખ્યં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૩ ॥

ગીતં મધુરં પીતં મધુરં ભુક્તં મધુરં સુપ્તં મધુરમ્ ।
રૂપં મધુરં તિલકં મધુરં મધુરાધિપતેરખિલં મધુરમ્ ॥ ૪ ॥

શ્રીમદ્ વલ્લભાચાર્ય રચિત આ મધુરાષ્ટકમ શ્રી કૃષ્ણના પ્રત્યેક અંગ, ચરિત્ર અને લીલાની મધુરતાનું પરમ ગુણગાન કરે છે. જ્યારે ભક્ત પ્રેમપૂર્વક આ સ્તુતિ કરે છે, ત્યારે તેનું સમગ્ર જીવન મધુરતાથી ભરાઈ જાય છે.',
    'Adharam Madhuram Vadanam Madhuram Nayanam Madhuram Hasitam Madhuram |
Hridayam Madhuram Gamanam Madhuram Madhuradhipater Akhilam Madhuram || 1 ||

His lips are sweet, His face is sweet, His eyes are sweet, His smile is sweet,
His loving heart is sweet, His gait is sweet — everything about the Lord of Sweetness is sweet!

Composed by Shrimad Vallabhacharya Mahaprabhuji, this divine hymn celebrates the infinite sweetness of every aspect of Lord Krishna.'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'chintamani-prarthana',
    'શ્રી ચિંતામણિ પ્રાર્થના',
    'Shree Chintamani Prarthana',
    'અરે ચિંત કપરીને કાર્યમ',
    'Sacred prayer for overcoming anxiety and spiritual surrender.',
    'lotus',
    2,
    'અરે ચેતો મા ગા વ્યથામ્ ।
શ્રીકૃષ્ણશ્ચરણે મનઃ સદૈવ સુસ્થિરં કુરુ ॥

ચિંતા કાપિ ન કાર્તવ્યા યદિ ચેત્ શ્રીપતિર્હૃદિ ।
જગદીશિતુઃ કૃપાલાવાત્ સર્વં સંસિધ્યતિ ક્ષણાત્ ॥

હે મન! તું વ્યર્થ ચિંતા ન કર. જે શ્રીજી બાવા સમગ્ર જગતના પાલનહાર છે, તે તારું કલ્યાણ કેમ નહીં કરે? શ્રીકૃષ્ણના ચરણારવિંદમાં સંપૂર્ણ સમર્પણ કરવાથી સર્વ ચિંતાઓ ક્ષણમાત્રમાં દૂર થાય છે. આ પવિત્ર પ્રાર્થના ભક્તના હૃદયમાં અડગ શ્રદ્ધા અને શાંતિ સ્થાપિત કરે છે.',
    'O my mind! Do not worry or despair.
Fix your heart and thoughts steadfastly upon the divine lotus feet of Shree Krishna.

When the Lord of the Universe resides in your heart, no anxiety can touch you. By a mere drop of His grace, all obstacles vanish instantly.'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'yamunashtakam',
    'યમુનાષ્ટકમ',
    'Yamunashtakam',
    'યમુના મહારાણીની સ્તુતિ.',
    'Hymn in praise of Shri Yamuna Maharani.',
    'peacock',
    3,
    'નમામિ યમુનામહં સકલ સિદ્ધિ હેતું મુદા
મુરારી પદ પંકજ સ્ફુરદ મંદ રેણૂત્કટામ્ ।
તટસ્થ નવ કાનન પ્રકટ મોદ પુષ્પાંબુના
સુરાસુર સુપૂજિત પ્રભવ શુદ્ધ દંભોમ્ભુજામ્ ॥ ૧ ॥

કલિકલુષ નાશિની સકલ સિદ્ધિ દાત્રી શ્રી યમુના મહારાણી ભક્તોને શ્રીકૃષ્ણના ચરણો સુધી પહોંચાડનાર પરમ કૃપાળુ માતા છે. પુષ્ટિમાર્ગમાં યમુનાજીની કૃપા વગર ભક્તિભાવ પુષ્ટ થતો નથી.',
    'Namami Yamunam Aham Sakala Siddhi Hetum Muda
Murari Pada Pankaja Sphurad Amanda Renutkatam |
Tatastha Nava Kanana Prakata Moda Pushpambuna
Surasura Supujita Prabhava Shuddha Dambhom-bhujam || 1 ||

I joyfully bow to Shri Yamuna Maharani, the source of all divine fulfillment and spiritual accomplishments, who carries the sacred dust of the lotus feet of Lord Krishna.'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_gu = EXCLUDED.title_gu,
  title_en = EXCLUDED.title_en,
  subtitle_gu = EXCLUDED.subtitle_gu,
  subtitle_en = EXCLUDED.subtitle_en,
  icon_type = EXCLUDED.icon_type,
  order_index = EXCLUDED.order_index,
  content_gu = EXCLUDED.content_gu,
  content_en = EXCLUDED.content_en;

-- 3. POSTS SEED (4 Featured Blogs matching reference image and DEFAULT_POSTS)
INSERT INTO public.posts (
  id, slug, title_gu, title_en, excerpt_gu, excerpt_en, content_gu, content_en,
  cover_image_url, cover_image_alt, category_id, status, published_at,
  author_name_gu, author_name_en, likes_count, tags
)
VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'bhakti-no-sacho-arth',
    'ભક્તિનો સાચો અર્થ',
    'The True Meaning of Bhakti',
    'ભક્તિ માત્ર રીવાજ નથી, તે જીવનની દિશા છે...',
    'Bhakti is not merely a custom or routine; it is the ultimate compass of life...',
    '<p>ભક્તિ માત્ર બાહ્ય આચરણ કે રોજિંદો રીવાજ નથી, પરંતુ હૃદયનો પરમાત્મા સાથેનો અતૂટ સંબંધ છે. જ્યારે મનુષ્ય પોતાના અહંકારને ઓગાળીને ઈશ્વરના ચરણોમાં સંપૂર્ણ સમર્પણ કરે છે, ત્યારે જ સાચી ભક્તિનો ઉદય થાય છે.</p><h2>નિઃસ્વાર્થ પ્રેમનું સ્વરૂપ</h2><p>પુષ્ટિમાર્ગમાં ભક્તિનો અર્થ છે પ્રેમલક્ષણા ભક્તિ. જેમાં કોઈ સ્વાર્થ કે અપેક્ષા નથી હોતી, માત્ર અને માત્ર શ્રીજી બાવાની પ્રસન્નતા જ મુખ્ય ધ્યેય હોય છે. આપણે જે કંઈ કરીએ તે પ્રભુ સેવાના ભાવથી કરવું એ જ સંસારમાં રહીને પણ મોક્ષ પામવાનો સરળ રાજમાર્ગ છે.</p><blockquote>"જે ક્ષણે મનમાંથી ''હું'' અને ''મારું'' છૂટી જાય છે, તે જ ક્ષણે પ્રભુ શ્રીજી બાવાની અસીમ કૃપાની અનુભૂતિ થાય છે."</blockquote><p>આપણા રોજિંદા જીવનમાં પણ દરેક કાર્યને ઈશ્વરને અર્પણ કરીને જીવવું એ સાચી સાધના છે. સેવા પૂજા કરતી વખતે ચિત્ત શાંત રાખવું અને અન્ય જીવો પ્રત્યે દયાભાવ રાખવો એ જ વૈષ્ણવ ધર્મનો સાર છે.</p>',
    '<p>Bhakti is not merely an external custom or a daily routine; it is an unbroken bond of the soul with the Divine. When an individual dissolves the ego and surrenders completely at the lotus feet of the Almighty, true devotion awakens.</p><h2>The Essence of Selfless Love</h2><p>In Pushtimarg, devotion is characterized as Prem-lakshana Bhakti — pure love without transactional desires. The sole goal is bringing happiness to Shreeji. Doing whatever comes our way with an attitude of humble service is the royal path of grace.</p><blockquote>"The moment the ego drops, the boundless grace of Shreeji begins to flow through one''s life."</blockquote><p>Surrendering all our actions throughout the day to the Lord is the essence of daily sadhana. Maintaining calm during seva and nurturing compassion toward all living beings reflects the true Vaishnav ethos.</p>',
    '/images/defaults/blog-bhakti.webp',
    'Sunset over holy river ghat with boats and devotional atmosphere',
    'a1111111-1111-1111-1111-111111111111',
    'published',
    NOW() - INTERVAL '3 days',
    'સંપાદક',
    'Editor',
    14,
    ARRAY['ભક્તિ', 'પુષ્ટિમાર્ગ', 'સાધના']
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'shreenathji-ane-aapun-natu',
    'શ્રીનાથજી અને આપણું નાતું',
    'Our Eternal Bond with Shrinathji',
    'શ્રીનાથજી સાથેનું નાતું એટલું પ્રગટ છે કે શબ્દો ઓછા પડે...',
    'The bond with Shrinathji is so intimate and profound that words fall short...',
    '<p>શ્રીનાથજી માત્ર એક મૂર્તિ કે વિગ્રહ નથી, પરંતુ વૈષ્ણવ ભક્ત માટે સાક્ષાત્ પૂર્ણ પુરુષોત્તમ છે. જેમ બાળક પોતાની માતાના ખોળામાં સંપૂર્ણ નિર્ભય બનીને સુઈ જાય છે, તેમ ભક્ત શ્રીજીના શરણમાં પરમ શાંતિ અનુભવે છે.</p><h2>નાથદ્વારાની દિવ્ય ઝાંખી</h2><p>નાથદ્વારામાં જ્યારે શંખનાદ થાય અને રાજભોગ કે શયનના દર્શન ખુલે, ત્યારે લાખો વૈષ્ણવોનું હૃદય એક અનોખા આનંદથી ધબકવા લાગે છે. શ્રીજીનો એ દિવ્ય શૃંગાર, કમળ સમાન નયનો અને મુખ પરનું મૃદુ હાસ્ય ભવભવના તાપ હરી લે છે.</p><p>આપણે જ્યાં પણ હોઈએ, ભાવપૂર્વક સ્મરણ કરીએ એટલે શ્રીજી આપણી સાથે જ બિરાજમાન છે તેવો અહેસાસ થાય છે. આ નાતું શ્રદ્ધા અને સમર્પણનું છે.</p>',
    '<p>Shrinathji is not just a sacred idol; to a devotee, He is the living Supreme Divine. Just as a child rests fearlessly in its mother''s lap, a Vaishnav finds supreme tranquility at Shreeji''s lotus feet.</p><h2>The Divine Glances of Nathdwara</h2><p>When the conch resonates in Nathdwara and the curtains part for Rajbhog or Shayan Darshan, millions of hearts beat with boundless ecstacy. His ornate shringar and lotus-like eyes banish the pains of worldly existence.</p><p>Wherever we may be, remembering Him with deep affection makes His presence immediately tangible.</p>',
    '/images/defaults/blog-shrinathji.webp',
    'Sacred Shrinathji deity adorned in divine jewels and flower garlands',
    'a2222222-2222-2222-2222-222222222222',
    'published',
    NOW() - INTERVAL '5 days',
    'શ્રીજી ભક્ત',
    'Shreeji Devotee',
    28,
    ARRAY['શ્રીનાથજી', 'દર્શન', 'વૈષ્ણવ']
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'jeevan-mathi-shikhela-path',
    'જીવનમાંથી શીખેલા પાઠ',
    'Life Lessons from Devotion',
    'કેટલાક અનુભવ શબ્દોમાં વણી શકાય, અનેક આંખો ભીંજાવે...',
    'Some life experiences can be captured in words, while others gently moisten the eyes...',
    '<p>જીવનના અનેક વળાંકો પર જ્યારે મુશ્કેલીઓનો સામનો કરવો પડે છે, ત્યારે સત્સંગ અને પ્રભુ સ્મરણ જ સાચો સહારો બને છે. વડીલોના આશીર્વાદ અને ધર્મના સંસ્કારો મનુષ્યને ગમે તેવી વિપરીત પરિસ્થિતિમાં પણ અડગ રાખે છે.</p><h2>નમ્રતા અને સંતોષ</h2><p>જીવનમાં સૌથી મોટી સંપત્તિ સંતોષ છે. જ્યારે આપણે બીજાની પ્રગતિ જોઈને ઈર્ષ્યા કરવાને બદલે પ્રભુએ જે આપ્યું છે તેનો આભાર માનીએ છીએ, ત્યારે જીવનમાં સાચી સુખ-શાંતિ આવે છે. સેવા માત્ર મંદિરમાં જ નહીં, જરૂરિયાતમંદ વ્યક્તિની મદદ કરવામાં પણ છે.</p><p>સૌમ્ય વાણી અને પરોપકારની ભાવના એ જ સાચું જીવન ઘડતર કરે છે.</p>',
    '<p>At various turns of life when challenges arise, spiritual satsang and remembering the Lord become our guiding light. Blessings of elders and roots in faith keep one anchored through every storm.</p><h2>Humility and Contentment</h2><p>The greatest wealth in life is contentment. When we thank God for what we have instead of comparing ourselves with others, genuine peace fills the heart. True seva extends beyond temple walls to serving those in need.</p>',
    '/images/defaults/blog-lessons.webp',
    'Ancient scripture manuscript with quill pen and warm lighting',
    'a3333333-3333-3333-3333-333333333333',
    'published',
    NOW() - INTERVAL '8 days',
    'સંપાદક',
    'Editor',
    9,
    ARRAY['સંસ્કાર', 'જીવન', 'અનુભવ']
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'vallabh-parampara-ni-divyata',
    'વલ્લભ પરંપરાની દિવ્યતા',
    'The Divinity of Vallabh Tradition',
    'પુષ્ટિમાર્ગની મહિમા અને તેની અનોખી ગતિ...',
    'The boundless glory and unique grace of the Pushtimarg path...',
    '<p>જગદ્ગુરુ શ્રી વલ્લભાચાર્ય મહાપ્રભુજીએ કલિયુગમાં જીવોના ઉદ્ધાર માટે પુષ્ટિમાર્ગની સ્થાપના કરી. આ માર્ગમાં કોઈ કઠોર તપસ્યા નથી, પરંતુ પ્રેમ અને સ્નેહથી શ્રીઠાકોરજીની સેવા કરવાનો આદેશ છે.</p><h2>બ્રહ્મસંબંધનું મહત્વ</h2><p>બ્રહ્મસંબંધ દીક્ષા દ્વારા જીવ પોતાના શરીર, મન, ધન અને સમગ્ર જીવનને શ્રીકૃષ્ણને સમર્પિત કરે છે. ત્યાર પછી જે પણ ભોજન કે વસ્તુ વપરાય તે પહેલાં પ્રભુને અર્પણ કરવામાં આવે છે. આ પરંપરા આપણા ઘરોને મંદિર બનાવે છે.</p><p>હવેલી સંગીત, વિવિધ ઋતુઓના મનોરથ અને શૃંગારની કળા આપણી સંસ્કૃતિનો અમૂલ્ય વારસો છે.</p>',
    '<p>Jagadguru Shri Vallabhacharya Mahaprabhuji established Pushtimarg for the spiritual elevation of souls in Kaliyuga. In this path, there is no harsh ascetic penance; rather, it is the joyful service of Thakorji with unconditional love.</p><h2>The Sanctity of Brahmasambandha</h2><p>Through Brahmasambandha, a seeker surrenders their body, mind, wealth, and soul to Shri Krishna. Every action and meal is offered first to the Divine, turning every home into a sacred haven.</p><p>Haveli Sangeet, seasonal Manoraths, and the sublime art of Shringar remain an irreplaceable spiritual legacy.</p>',
    '/images/defaults/blog-tradition.webp',
    'Ancient Hindu temple stone shikhar tower reaching toward the sky',
    'a2222222-2222-2222-2222-222222222222',
    'published',
    NOW() - INTERVAL '12 days',
    'વૈષ્ણવ જન',
    'Vaishnav Devotee',
    19,
    ARRAY['વલ્લભાચાર્ય', 'પુષ્ટિમાર્ગ', 'પરંપરા']
  )
ON CONFLICT (slug) DO UPDATE SET
  title_gu = EXCLUDED.title_gu,
  title_en = EXCLUDED.title_en,
  excerpt_gu = EXCLUDED.excerpt_gu,
  excerpt_en = EXCLUDED.excerpt_en,
  content_gu = EXCLUDED.content_gu,
  content_en = EXCLUDED.content_en,
  cover_image_url = EXCLUDED.cover_image_url,
  cover_image_alt = EXCLUDED.cover_image_alt,
  category_id = EXCLUDED.category_id,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  author_name_gu = EXCLUDED.author_name_gu,
  author_name_en = EXCLUDED.author_name_en,
  likes_count = EXCLUDED.likes_count,
  tags = EXCLUDED.tags;

-- 4. SITE SETTINGS SEED (Editable texts matching reference)
INSERT INTO public.site_settings (key, value_gu, value_en, description)
VALUES
  (
    'site_name',
    'શ્રીજી બાબાની કૃપા',
    'Shreeji Baba Ni Krupa',
    'Main website title displayed in header and brand elements.'
  ),
  (
    'site_tagline',
    'શ્રીજી બાવાની કૃપા સર્વે પર બની રહે.',
    'May the grace of Shreeji Baba be upon everyone.',
    'Devotional blessing tagline in footer and banner.'
  ),
  (
    'hero_heading',
    'જય શ્રી કૃષ્ણ',
    'Jai Shree Krishna',
    'Main heading in the homepage hero section.'
  ),
  (
    'hero_intro',
    'શ્રીજી બાવાની અપર કૃપાથી આ જીવન ધન્ય છે. આપણા સંસ્કાર, પરંપરા અને ભક્તિની સુગંધ આપ સી સુધી પહોંચે એ જ પ્રયત્ન.',
    'By the boundless grace of Shreeji Baba, this life is blessed. Our humble endeavor is to bring the fragrance of our traditions, heritage, and devotion to you.',
    'Introductory text in the hero section.'
  ),
  (
    'hero_sanskrit_line',
    '|| શ્રી કૃષ્ણ શરણં મમ: ||',
    '|| Shree Krishna Sharanam Mama: ||',
    'Devotional Sanskrit mantra line in hero.'
  ),
  (
    'hero_image_url',
    '/images/defaults/hero-shrinathji.webp',
    '/images/defaults/hero-shrinathji.webp',
    'Configurable hero section devotional image.'
  ),
  (
    'tradition_title',
    'વૈષ્ણવ વાણીયા સમાજ',
    'Vaishnav Vaniya Samaj',
    'Heading of the tradition section on homepage.'
  ),
  (
    'tradition_text',
    'વૈષ્ણવ વાણીયા સમાજ વૈષ્ણવ ધાર્મિક પરંપરાથી પ્રેરિત, સેવા, સદાચાર અને સંસ્કારોથી સમૃદ્ધ સમુદાય છે. શ્રી વલ્લભાચાર્ય મહાપ્રભુજી દ્વારા સ્થાપિત પુષ્ટિમાર્ગના અનુયાયી તરીકે અમે શ્રીનાથજીની અનન્ય કૃપાના ઉપલબ્ધ છીએ.

શતાબ્દીઓથી આ સમુદાયે વેપાર, દાન, ભક્તિ અને શિક્ષણના ક્ષેત્રે મહત્વપૂર્ણ યોગદાન આપ્યું છે. આપણા પૂર્વજોએ શ્રદ્ધા અને પરિશ્રમથી જે મૂલ્યો અને પરંપરા સંભાળી છે, તેને આગળની પેઢીઓને પહોંચાડવી એ આપણું કર્તવ્ય છે.',
    'The Vaishnav Vaniya Samaj is a heritage community guided by Vaishnav principles, devoted seva, righteousness, and cultural values. As followers of Pushtimarg founded by Shri Vallabhacharya Mahaprabhuji, we cherish the eternal grace of Shrinathji.

For centuries, this community has contributed deeply to commerce, philanthropy, spiritual devotion, and education. Upholding and passing these sacred values to future generations is our lifelong duty.',
    'Detailed narrative text for the tradition section.'
  ),
  (
    'tradition_image_url',
    '/images/defaults/tradition-haveli.webp',
    '/images/defaults/tradition-haveli.webp',
    'Architectural heritage image for tradition section.'
  ),
  (
    'author_photo_url',
    '',
    '',
    'Global author portrait shown on blog posts.'
  ),
  (
    'author_name',
    'સંપાદક',
    'Editor',
    'Display name for the site author.'
  ),
  (
    'author_bio',
    'શ્રીજી બાબાની કૃપા અને પુષ્ટિમાર્ગીય ભાવના વહેંચવાનો વિનમ્ર પ્રયાસ.',
    'A humble effort to share the grace of Shreeji Baba and the spirit of Pushtimarg.',
    'Short bilingual bio for the About the Author block.'
  ),
  (
    'contact_email',
    'example@gmail.com',
    'example@gmail.com',
    'Public contact email address.'
  ),
  (
    'contact_phone',
    '+91 98765 43210',
    '+91 98765 43210',
    'Public contact phone number.'
  ),
  (
    'social_facebook',
    'https://facebook.com',
    'https://facebook.com',
    'Facebook social link.'
  ),
  (
    'social_instagram',
    'https://instagram.com',
    'https://instagram.com',
    'Instagram social link.'
  ),
  (
    'social_youtube',
    'https://youtube.com',
    'https://youtube.com',
    'YouTube social link.'
  ),
  (
    'footer_copyright',
    '© 2025 શ્રીજી બાબાની કૃપા | બધા હક્ક સુરક્ષિત.',
    '© 2025 Shreeji Baba Ni Krupa | All rights reserved.',
    'Footer copyright statement.'
  )
ON CONFLICT (key) DO UPDATE SET
  value_gu = EXCLUDED.value_gu,
  value_en = EXCLUDED.value_en,
  description = EXCLUDED.description;
