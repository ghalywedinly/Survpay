import { LocalizedText, QuestionType, SurveyCategory } from '../types';

export interface QuestionTemplate {
  type: QuestionType;
  prompt: LocalizedText;
  options?: LocalizedText[];
  isAttentionCheck?: boolean;
}

const t = (en: string, ar: string): LocalizedText => ({ en, ar });

export const QUESTION_BANK: Record<SurveyCategory, QuestionTemplate[]> = {
  shopping: [
    {
      type: 'single_choice',
      prompt: t('How often do you shop online per month?', 'كم مرة تتسوق عبر الإنترنت في الشهر؟'),
      options: [
        t('Never', 'أبدًا'),
        t('1-2 times', 'مرة أو مرتين'),
        t('3-5 times', '3 إلى 5 مرات'),
        t('6-10 times', '6 إلى 10 مرات'),
        t('More than 10 times', 'أكثر من 10 مرات'),
      ],
    },
    {
      type: 'multiple_choice',
      prompt: t('Which platforms do you use most for online shopping?', 'ما هي المنصات التي تستخدمها أكثر للتسوق عبر الإنترنت؟'),
      options: [
        t('Amazon.sa', 'أمازون السعودية'),
        t('Noon', 'نون'),
        t('SHEIN', 'شي إن'),
        t('Jarir', 'جرير'),
        t('Extra', 'إكسترا'),
        t('Local stores', 'متاجر محلية'),
      ],
    },
    {
      type: 'rating',
      prompt: t('How satisfied are you with delivery times in Saudi Arabia?', 'ما مدى رضاك عن سرعة التوصيل في المملكة؟'),
    },
    {
      type: 'single_choice',
      prompt: t('How do you prefer to pay for online purchases?', 'ما هي طريقة الدفع المفضلة لديك للمشتريات عبر الإنترنت؟'),
      options: [
        t('Cash on delivery', 'الدفع عند الاستلام'),
        t('Credit / debit card', 'بطاقة ائتمان / خصم'),
        t('Apple Pay', 'آبل باي'),
        t('STC Pay', 'إس تي سي باي'),
      ],
    },
    {
      type: 'yes_no',
      prompt: t('Have you returned an online purchase in the last 3 months?', 'هل قمت بإرجاع مشترى عبر الإنترنت خلال آخر 3 أشهر؟'),
    },
  ],
  food: [
    {
      type: 'single_choice',
      prompt: t('How often do you order food online?', 'كم مرة تطلب الطعام عبر الإنترنت؟'),
      options: [
        t('Daily', 'يوميًا'),
        t('Several times a week', 'عدة مرات في الأسبوع'),
        t('Once a week', 'مرة في الأسبوع'),
        t('A few times a month', 'عدة مرات في الشهر'),
        t('Rarely', 'نادرًا'),
        t('Never', 'أبدًا'),
      ],
    },
    {
      type: 'single_choice',
      prompt: t('Which food delivery app do you use most?', 'ما هو تطبيق توصيل الطعام الذي تستخدمه أكثر؟'),
      options: [
        t('HungerStation', 'هنقرستيشن'),
        t('Jahez', 'جاهز'),
        t('Mrsool', 'مرسول'),
        t('ToYou', 'تو يو'),
        t('Talabat', 'طلبات'),
      ],
    },
    {
      type: 'single_choice',
      prompt: t('How much do you typically spend per food delivery order?', 'كم تنفق عادةً في طلب توصيل طعام واحد؟'),
      options: [
        t('Under SAR 30', 'أقل من 30 ريال'),
        t('SAR 30-60', '30 إلى 60 ريال'),
        t('SAR 60-100', '60 إلى 100 ريال'),
        t('Over SAR 100', 'أكثر من 100 ريال'),
      ],
    },
    {
      type: 'rating',
      prompt: t('Rate your overall satisfaction with food delivery services', 'قيّم رضاك العام عن خدمات توصيل الطعام'),
    },
    {
      type: 'yes_no',
      prompt: t('Do you read restaurant reviews before ordering?', 'هل تقرأ تقييمات المطاعم قبل الطلب؟'),
    },
  ],
  technology: [
    {
      type: 'single_choice',
      prompt: t('Which smartphone brand do you currently use?', 'ما هي الشركة المصنّعة لهاتفك الذكي الحالي؟'),
      options: [t('iPhone', 'آيفون'), t('Samsung', 'سامسونج'), t('Huawei', 'هواوي'), t('Xiaomi', 'شاومي'), t('Other', 'أخرى')],
    },
    {
      type: 'single_choice',
      prompt: t('How many hours per day do you spend on social media?', 'كم ساعة تقضي يوميًا على وسائل التواصل الاجتماعي؟'),
      options: [t('Less than 1 hour', 'أقل من ساعة'), t('1-3 hours', '1 إلى 3 ساعات'), t('3-5 hours', '3 إلى 5 ساعات'), t('More than 5 hours', 'أكثر من 5 ساعات')],
    },
    {
      type: 'single_choice',
      prompt: t('Which social media platform do you use most?', 'ما هي منصة التواصل الاجتماعي التي تستخدمها أكثر؟'),
      options: [t('X (Twitter)', 'إكس (تويتر)'), t('Instagram', 'إنستغرام'), t('Snapchat', 'سناب شات'), t('TikTok', 'تيك توك'), t('YouTube', 'يوتيوب')],
    },
    {
      type: 'rating',
      prompt: t('How likely are you to buy a new smartphone in the next 6 months?', 'ما مدى احتمالية شرائك هاتفًا ذكيًا جديدًا خلال 6 أشهر؟'),
    },
    {
      type: 'yes_no',
      prompt: t('Do you use mobile banking apps regularly?', 'هل تستخدم تطبيقات الخدمات المصرفية على الجوال بانتظام؟'),
    },
  ],
  finance: [
    {
      type: 'single_choice',
      prompt: t('Which bank do you primarily use?', 'ما هو البنك الذي تتعامل معه بشكل أساسي؟'),
      options: [t('Al Rajhi Bank', 'مصرف الراجحي'), t('Saudi National Bank', 'البنك الأهلي السعودي'), t('Riyad Bank', 'بنك الرياض'), t('SABB', 'ساب'), t('Other', 'أخرى')],
    },
    {
      type: 'yes_no',
      prompt: t("Have you used a 'buy now pay later' service (e.g. Tamara, Tabby)?", 'هل استخدمت خدمة "اشترِ الآن وادفع لاحقًا" مثل تمارا أو تابي؟'),
    },
    {
      type: 'rating',
      prompt: t('How confident do you feel about your financial future?', 'ما مدى ثقتك بمستقبلك المالي؟'),
    },
    {
      type: 'single_choice',
      prompt: t('What is your primary savings goal?', 'ما هو هدفك الأساسي من الادخار؟'),
      options: [t('Home', 'منزل'), t('Car', 'سيارة'), t('Travel', 'سفر'), t('Education', 'تعليم'), t('Emergency fund', 'صندوق طوارئ')],
    },
    {
      type: 'single_choice',
      prompt: t('How do you prefer to manage your monthly budget?', 'كيف تفضل إدارة ميزانيتك الشهرية؟'),
      options: [t('Banking app', 'تطبيق البنك'), t('Spreadsheet', 'جدول بيانات'), t('Budgeting app', 'تطبيق مخصص للميزانية'), t("I don't track it", 'لا أتابعها')],
    },
  ],
  travel: [
    {
      type: 'single_choice',
      prompt: t('How many domestic trips did you take within Saudi Arabia last year?', 'كم رحلة داخلية قمت بها ضمن المملكة العام الماضي؟'),
      options: [t('None', 'لا شيء'), t('1-2', '1-2'), t('3-5', '3-5'), t('More than 5', 'أكثر من 5')],
    },
    {
      type: 'single_choice',
      prompt: t('What matters most when booking a flight?', 'ما أهم عامل عند حجز رحلة طيران؟'),
      options: [t('Price', 'السعر'), t('Schedule', 'الجدول الزمني'), t('Airline', 'شركة الطيران'), t('Baggage allowance', 'وزن الأمتعة المسموح')],
    },
    {
      type: 'yes_no',
      prompt: t('Have you traveled internationally in the past 12 months?', 'هل سافرت خارج المملكة خلال آخر 12 شهرًا؟'),
    },
    {
      type: 'rating',
      prompt: t('Rate your experience with Saudi airport services', 'قيّم تجربتك مع خدمات المطارات السعودية'),
    },
    {
      type: 'text',
      prompt: t('Which destination would you most like to visit next?', 'ما هي الوجهة التي ترغب بزيارتها لاحقًا؟'),
    },
  ],
  entertainment: [
    {
      type: 'single_choice',
      prompt: t('How often do you go to the cinema?', 'كم مرة تذهب إلى السينما؟'),
      options: [t('Weekly', 'أسبوعيًا'), t('Monthly', 'شهريًا'), t('A few times a year', 'عدة مرات في السنة'), t('Never', 'أبدًا')],
    },
    {
      type: 'multiple_choice',
      prompt: t('Which streaming services do you subscribe to?', 'ما هي خدمات البث التي تشترك فيها؟'),
      options: [t('Netflix', 'نتفليكس'), t('Shahid', 'شاهد'), t('OSN+', 'أو إس إن بلس'), t('Disney+', 'ديزني بلس'), t('STARZPLAY', 'ستارزبلاي')],
    },
    {
      type: 'rating',
      prompt: t('Rate the entertainment options available in your city', 'قيّم خيارات الترفيه المتوفرة في مدينتك'),
    },
    {
      type: 'yes_no',
      prompt: t('Do you attend live events or concerts?', 'هل تحضر فعاليات أو حفلات مباشرة؟'),
    },
    {
      type: 'single_choice',
      prompt: t('What type of content do you stream most?', 'ما نوع المحتوى الذي تشاهده أكثر؟'),
      options: [t('Movies', 'أفلام'), t('TV Series', 'مسلسلات'), t('Sports', 'رياضة'), t('Gaming streams', 'بث ألعاب')],
    },
  ],
  healthcare: [
    {
      type: 'single_choice',
      prompt: t('How often do you visit a doctor for check-ups?', 'كم مرة تزور طبيبًا لفحص دوري؟'),
      options: [t('Every few months', 'كل بضعة أشهر'), t('Once a year', 'مرة سنويًا'), t('Only when sick', 'فقط عند المرض'), t('Rarely / never', 'نادرًا / أبدًا')],
    },
    {
      type: 'yes_no',
      prompt: t('Do you use any health or fitness tracking apps?', 'هل تستخدم تطبيقات لتتبع الصحة أو اللياقة؟'),
    },
    {
      type: 'rating',
      prompt: t('Rate your satisfaction with healthcare services in your city', 'قيّم رضاك عن الخدمات الصحية في مدينتك'),
    },
    {
      type: 'single_choice',
      prompt: t('Which health insurance provider do you use?', 'من هو مزود التأمين الصحي الذي تتعامل معه؟'),
      options: [t('Bupa Arabia', 'بوبا العربية'), t('Tawuniya', 'التعاونية'), t('MedGulf', 'ميدغلف'), t('Company-provided', 'مقدم من جهة العمل'), t('None', 'لا يوجد')],
    },
    {
      type: 'single_choice',
      prompt: t('What wellness topic interests you most?', 'ما موضوع الصحة الذي يهمك أكثر؟'),
      options: [t('Nutrition', 'التغذية'), t('Fitness', 'اللياقة'), t('Mental health', 'الصحة النفسية'), t('Sleep', 'النوم')],
    },
  ],
  automotive: [
    {
      type: 'single_choice',
      prompt: t('What type of vehicle do you currently drive?', 'ما نوع السيارة التي تقودها حاليًا؟'),
      options: [t('Sedan', 'سيدان'), t('SUV', 'دفع رباعي'), t('Pickup truck', 'بيك أب'), t("I don't own a car", 'لا أملك سيارة')],
    },
    {
      type: 'yes_no',
      prompt: t('Are you considering buying a new car in the next year?', 'هل تفكر بشراء سيارة جديدة خلال السنة القادمة؟'),
    },
    {
      type: 'single_choice',
      prompt: t('Which factor matters most when choosing a car?', 'ما أهم عامل عند اختيار السيارة؟'),
      options: [t('Price', 'السعر'), t('Fuel efficiency', 'كفاءة استهلاك الوقود'), t('Safety', 'السلامة'), t('Brand reputation', 'سمعة الماركة')],
    },
    {
      type: 'rating',
      prompt: t('Rate your satisfaction with your current vehicle', 'قيّم رضاك عن سيارتك الحالية'),
    },
    {
      type: 'yes_no',
      prompt: t('Would you consider an electric vehicle for your next purchase?', 'هل تفكر بسيارة كهربائية عند الشراء القادم؟'),
    },
  ],
  lifestyle: [
    {
      type: 'single_choice',
      prompt: t('How many hours of sleep do you get on an average night?', 'كم ساعة تنام في الليلة المتوسطة؟'),
      options: [t('Less than 5', 'أقل من 5'), t('5-6', '5-6'), t('7-8', '7-8'), t('More than 8', 'أكثر من 8')],
    },
    {
      type: 'single_choice',
      prompt: t('How often do you exercise per week?', 'كم مرة تمارس الرياضة أسبوعيًا؟'),
      options: [t('Never', 'أبدًا'), t('1-2 times', 'مرة أو مرتين'), t('3-4 times', '3 إلى 4 مرات'), t('5+ times', '5 مرات أو أكثر')],
    },
    {
      type: 'single_choice',
      prompt: t('What best describes your daily commute?', 'ما الذي يصف تنقلك اليومي بشكل أفضل؟'),
      options: [t('Own car', 'سيارتي الخاصة'), t('Ride-hailing app', 'تطبيق نقل ركاب'), t('Public transport', 'نقل عام'), t('Work from home', 'العمل من المنزل')],
    },
    {
      type: 'rating',
      prompt: t('Rate your overall work-life balance', 'قيّم توازنك بين العمل والحياة بشكل عام'),
    },
    {
      type: 'single_choice',
      prompt: t('Which season do you enjoy most in Saudi Arabia?', 'ما هو فصلك المفضل في المملكة؟'),
      options: [t('Winter', 'الشتاء'), t('Spring', 'الربيع'), t('Summer', 'الصيف'), t('Autumn', 'الخريف')],
    },
  ],
  other: [
    {
      type: 'single_choice',
      prompt: t('What is your preferred language for daily communication?', 'ما هي لغتك المفضلة للتواصل اليومي؟'),
      options: [t('Arabic', 'العربية'), t('English', 'الإنجليزية'), t('Both equally', 'كلاهما بالتساوي')],
    },
    {
      type: 'single_choice',
      prompt: t(
        "To help us keep survey quality high, please select 'Somewhat agree' for this question.",
        'للمساعدة في الحفاظ على جودة الاستبيان، يرجى اختيار "أوافق نوعًا ما" لهذا السؤال.'
      ),
      options: [
        t('Strongly disagree', 'لا أوافق بشدة'),
        t('Disagree', 'لا أوافق'),
        t('Somewhat agree', 'أوافق نوعًا ما'),
        t('Agree', 'أوافق'),
        t('Strongly agree', 'أوافق بشدة'),
      ],
      isAttentionCheck: true,
    },
    {
      type: 'text',
      prompt: t('Is there anything else you would like to share with us?', 'هل هناك أي شيء آخر تود مشاركته معنا؟'),
    },
  ],
};
