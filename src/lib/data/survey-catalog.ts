import { LocalizedText, SurveyCategory } from '../types';

export interface SurveyBlueprint {
  category: SurveyCategory;
  title: LocalizedText;
  description: LocalizedText;
  minutes: number;
}

const t = (en: string, ar: string): LocalizedText => ({ en, ar });

export const SURVEY_CATALOG: SurveyBlueprint[] = [
  {
    category: 'shopping',
    title: t('Saudi Consumer Shopping Habits', 'عادات التسوق لدى المستهلك السعودي'),
    description: t(
      'Help us understand how Saudi shoppers discover, compare, and buy products online and in-store.',
      'ساعدنا في فهم كيف يكتشف المتسوقون السعوديون المنتجات ويقارنونها ويشترونها عبر الإنترنت وفي المتاجر.'
    ),
    minutes: 8,
  },
  {
    category: 'shopping',
    title: t('Ramadan Shopping Preferences 2026', 'تفضيلات التسوق في رمضان 2026'),
    description: t(
      'Share how your shopping habits change during the holy month of Ramadan.',
      'شاركنا كيف تتغير عاداتك الشرائية خلال شهر رمضان المبارك.'
    ),
    minutes: 6,
  },
  {
    category: 'shopping',
    title: t('Loyalty Programs & Rewards Study', 'دراسة برامج الولاء والمكافآت'),
    description: t(
      'Tell us which loyalty programs you use and what would make you use them more.',
      'أخبرنا عن برامج الولاء التي تستخدمها وما الذي يجعلك تستخدمها أكثر.'
    ),
    minutes: 5,
  },
  {
    category: 'food',
    title: t('Food Delivery App Experience', 'تجربة تطبيقات توصيل الطعام'),
    description: t(
      'A quick survey about how often you order food online and what matters most to you.',
      'استبيان سريع حول عدد مرات طلبك للطعام عبر الإنترنت وما الأهم بالنسبة لك.'
    ),
    minutes: 6,
  },
  {
    category: 'food',
    title: t('Restaurant Dining Preferences', 'تفضيلات تناول الطعام في المطاعم'),
    description: t(
      'Share your preferences around dining out with family and friends in Saudi Arabia.',
      'شاركنا تفضيلاتك حول تناول الطعام خارج المنزل مع العائلة والأصدقاء في المملكة.'
    ),
    minutes: 7,
  },
  {
    category: 'technology',
    title: t('Smartphone Usage & Upgrade Plans', 'استخدام الهواتف الذكية وخطط الترقية'),
    description: t(
      'Tell us about your current smartphone and what would make you upgrade.',
      'أخبرنا عن هاتفك الذكي الحالي وما الذي قد يدفعك للترقية.'
    ),
    minutes: 5,
  },
  {
    category: 'technology',
    title: t('Social Media Habits in Saudi Arabia', 'عادات استخدام وسائل التواصل الاجتماعي في السعودية'),
    description: t(
      'Help brands understand how Saudi users engage with social platforms.',
      'ساعد العلامات التجارية على فهم كيفية تفاعل المستخدمين السعوديين مع منصات التواصل.'
    ),
    minutes: 6,
  },
  {
    category: 'technology',
    title: t('Mobile Banking App Satisfaction', 'مدى الرضا عن تطبيقات الخدمات المصرفية'),
    description: t(
      'Rate your experience using mobile banking apps for everyday transactions.',
      'قيّم تجربتك في استخدام تطبيقات الخدمات المصرفية للمعاملات اليومية.'
    ),
    minutes: 7,
  },
  {
    category: 'finance',
    title: t('Personal Finance & Budgeting Study', 'دراسة التمويل الشخصي والميزانية'),
    description: t(
      'A confidential survey about how you manage your personal finances.',
      'استبيان سري حول كيفية إدارتك لأمورك المالية الشخصية.'
    ),
    minutes: 9,
  },
  {
    category: 'finance',
    title: t('Buy Now, Pay Later Trends', 'اتجاهات خدمات اشترِ الآن وادفع لاحقًا'),
    description: t(
      'Share your experience with installment and BNPL payment services.',
      'شاركنا تجربتك مع خدمات الدفع بالتقسيط واشترِ الآن وادفع لاحقًا.'
    ),
    minutes: 5,
  },
  {
    category: 'travel',
    title: t('Domestic Tourism in Saudi Arabia', 'السياحة الداخلية في المملكة العربية السعودية'),
    description: t(
      'Tell us about your travel plans and preferences within the Kingdom.',
      'أخبرنا عن خططك وتفضيلاتك للسفر داخل المملكة.'
    ),
    minutes: 7,
  },
  {
    category: 'travel',
    title: t('Flight Booking Experience', 'تجربة حجز رحلات الطيران'),
    description: t(
      'Help airlines understand what matters most when you book a flight.',
      'ساعد شركات الطيران على فهم ما يهمك أكثر عند حجز رحلة.'
    ),
    minutes: 6,
  },
  {
    category: 'entertainment',
    title: t('Streaming & Entertainment Preferences', 'تفضيلات البث والترفيه'),
    description: t(
      'Tell us which streaming services and content you enjoy most.',
      'أخبرنا عن خدمات البث والمحتوى الذي تفضله أكثر.'
    ),
    minutes: 5,
  },
  {
    category: 'entertainment',
    title: t('Cinema & Live Events Study', 'دراسة دور السينما والفعاليات المباشرة'),
    description: t(
      'Share your habits around movies, concerts, and live entertainment.',
      'شاركنا عاداتك المتعلقة بالأفلام والحفلات والفعاليات الترفيهية المباشرة.'
    ),
    minutes: 6,
  },
  {
    category: 'healthcare',
    title: t('Health & Wellness Habits', 'عادات الصحة والعافية'),
    description: t(
      'Help healthcare providers understand your wellness priorities.',
      'ساعد مقدمي الرعاية الصحية على فهم أولوياتك الصحية.'
    ),
    minutes: 8,
  },
  {
    category: 'healthcare',
    title: t('Health Insurance Satisfaction Survey', 'استبيان الرضا عن التأمين الصحي'),
    description: t(
      'Rate your experience with your current health insurance provider.',
      'قيّم تجربتك مع مزود التأمين الصحي الحالي لديك.'
    ),
    minutes: 6,
  },
  {
    category: 'automotive',
    title: t('New Car Buying Intentions', 'نوايا شراء سيارة جديدة'),
    description: t(
      'Share your plans and preferences for your next vehicle purchase.',
      'شاركنا خططك وتفضيلاتك لشراء سيارتك القادمة.'
    ),
    minutes: 7,
  },
  {
    category: 'automotive',
    title: t('Electric Vehicle Interest Study', 'دراسة الاهتمام بالسيارات الكهربائية'),
    description: t(
      'Tell us how you feel about electric vehicles in the Saudi market.',
      'أخبرنا برأيك حول السيارات الكهربائية في السوق السعودي.'
    ),
    minutes: 5,
  },
  {
    category: 'lifestyle',
    title: t('Work-Life Balance in Saudi Arabia', 'التوازن بين العمل والحياة في السعودية'),
    description: t(
      'Help us understand how working professionals balance career and life.',
      'ساعدنا في فهم كيف يوازن الموظفون بين حياتهم المهنية والشخصية.'
    ),
    minutes: 6,
  },
  {
    category: 'lifestyle',
    title: t('Fitness & Exercise Trends', 'اتجاهات اللياقة والتمارين الرياضية'),
    description: t(
      'Share your exercise routine and fitness goals with us.',
      'شاركنا روتينك الرياضي وأهدافك المتعلقة باللياقة البدنية.'
    ),
    minutes: 5,
  },
  {
    category: 'other',
    title: t('General Consumer Confidence Index', 'مؤشر ثقة المستهلك العام'),
    description: t(
      'A short study tracking how confident consumers feel about the economy.',
      'دراسة قصيرة لرصد مدى ثقة المستهلكين تجاه الاقتصاد.'
    ),
    minutes: 4,
  },
  {
    category: 'shopping',
    title: t('Grocery Shopping Habits', 'عادات التسوق للبقالة'),
    description: t(
      'Tell us how and where you buy your weekly groceries.',
      'أخبرنا كيف وأين تشتري احتياجاتك الأسبوعية من البقالة.'
    ),
    minutes: 5,
  },
  {
    category: 'food',
    title: t('Coffee & Cafe Culture Survey', 'استبيان ثقافة القهوة والمقاهي'),
    description: t(
      'Share your coffee shop habits and preferences.',
      'شاركنا عاداتك وتفضيلاتك المتعلقة بالمقاهي.'
    ),
    minutes: 4,
  },
  {
    category: 'technology',
    title: t('Home Internet & Connectivity Study', 'دراسة الإنترنت المنزلي والاتصال'),
    description: t(
      'Help us understand your home internet setup and satisfaction.',
      'ساعدنا في فهم إعداد الإنترنت المنزلي لديك ومدى رضاك عنه.'
    ),
    minutes: 5,
  },
  {
    category: 'finance',
    title: t('Insurance Awareness Survey', 'استبيان الوعي بالتأمين'),
    description: t(
      'Tell us about your awareness and use of insurance products.',
      'أخبرنا عن وعيك واستخدامك لمنتجات التأمين.'
    ),
    minutes: 6,
  },
  {
    category: 'travel',
    title: t('Umrah & Religious Tourism Study', 'دراسة سياحة العمرة والسياحة الدينية'),
    description: t(
      'Share your experience planning and taking religious tourism trips.',
      'شاركنا تجربتك في التخطيط للرحلات الدينية والقيام بها.'
    ),
    minutes: 6,
  },
  {
    category: 'entertainment',
    title: t('Gaming Habits in Saudi Arabia', 'عادات الألعاب في السعودية'),
    description: t(
      'Tell us about the games you play and how you play them.',
      'أخبرنا عن الألعاب التي تلعبها وكيفية لعبها.'
    ),
    minutes: 5,
  },
  {
    category: 'healthcare',
    title: t('Pharmacy & Medication Habits', 'عادات الصيدلية والأدوية'),
    description: t(
      'Help us understand how you access medication and pharmacy services.',
      'ساعدنا في فهم كيفية حصولك على الأدوية وخدمات الصيدليات.'
    ),
    minutes: 5,
  },
  {
    category: 'automotive',
    title: t('Car Maintenance & Service Study', 'دراسة صيانة وخدمة السيارات'),
    description: t(
      'Share how you maintain and service your vehicle.',
      'شاركنا كيف تصون سيارتك وتخدمها.'
    ),
    minutes: 5,
  },
  {
    category: 'lifestyle',
    title: t('Home & Interior Design Preferences', 'تفضيلات التصميم الداخلي للمنزل'),
    description: t(
      'Tell us about your home decor and furnishing preferences.',
      'أخبرنا عن تفضيلاتك في ديكور المنزل والأثاث.'
    ),
    minutes: 5,
  },
  {
    category: 'shopping',
    title: t('Fashion & Apparel Shopping Study', 'دراسة تسوق الأزياء والملابس'),
    description: t(
      'Share your preferences for buying clothes and fashion items.',
      'شاركنا تفضيلاتك في شراء الملابس ومنتجات الأزياء.'
    ),
    minutes: 5,
  },
  {
    category: 'other',
    title: t('Saudi Vision 2030 Awareness Study', 'دراسة الوعي برؤية السعودية 2030'),
    description: t(
      'Share your awareness of Saudi Vision 2030 initiatives.',
      'شاركنا مدى وعيك بمبادرات رؤية السعودية 2030.'
    ),
    minutes: 5,
  },
  {
    category: 'other',
    title: t('National Day Celebrations Survey', 'استبيان احتفالات اليوم الوطني'),
    description: t(
      'Tell us how you celebrate Saudi National Day.',
      'أخبرنا كيف تحتفل باليوم الوطني السعودي.'
    ),
    minutes: 4,
  },
];
