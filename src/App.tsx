import { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import AccessibilityStatement from './AccessibilityStatement';
import AdminGallery from './AdminGallery';
import { loadSupabaseGallery } from './lib/supabase';

const contactFormEndpoint = 'https://script.google.com/macros/s/AKfycby-tb9kvy_OgmQ7l-Id9d0kc5VHEjnt740rHpuhJsbwvnt3ibMk2ZJphN-cYOWZHAU4ww/exec';

type GalleryMediaItem = {
  src: string;
  alt: string;
  type: 'image' | 'video';
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'gallery' | 'privacy' | 'accessibility' | 'admin'>('home');
  
  // Form state management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    agreeToPrivacy: false
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  

  // Image modal state
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  
  // Accessibility statement modal state
  const [isAccessibilityStatementOpen, setIsAccessibilityStatementOpen] = useState(false);

  // Dynamic gallery media loading
  const [galleryMedia, setGalleryMedia] = useState<GalleryMediaItem[]>([]);

  // Load gallery media from Supabase Storage
  useEffect(() => {
    void loadSupabaseGallery().then(setGalleryMedia);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [selectedImage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToPrivacy) {
      return;
    }

    setSubmitStatus('sending');

    try {
      await fetch(contactFormEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        agreeToPrivacy: false,
      });
    } catch {
      setSubmitStatus('error');
    }
  };

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home view, switch to home first
    if (currentView !== 'home') {
      setCurrentView('home');
      // Use setTimeout to allow DOM to update before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  // Featured images for home page (first 3 images)
  const featuredImages = galleryMedia.filter(media => media.type === 'image').slice(0, 3);

  // Image Modal Component
  const ImageModal = () => (
    selectedImage ? (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={() => setSelectedImage(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedImage(null);
              }
            }}
            className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors z-10"
            aria-label="סגור תמונה"
          >
            <X className="h-6 w-6 text-gray-800" />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
            <p className="text-center text-lg">{selectedImage.alt}</p>
          </div>
        </div>
      </div>
    ) : null
  );

  // Gallery Component
  const GalleryPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header for Gallery Page */}
      <div className="bg-white shadow-sm pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => setCurrentView('home')} 
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4"
                aria-label="חזרה לעמוד הבית"
              >
                <ArrowRight className="h-5 w-5 ml-2 rotate-180" />
                חזרה לעמוד הבית
              </button>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                גלריית הפרויקטים שלנו
              </h1>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl">
                צפו בכל ההפרויקטים והסרטונים מהמפעל שלנו, העבודות שלנו והמוצרים האיכותיים שאנו מייצרים
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryMedia.map((media, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-w-4 aspect-h-3 h-64">
                {media.type === 'video' ? (
                  <video 
                    src={media.src}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    controls
                    preload="none"
                    aria-label={`סרטון: ${media.alt}`}
                    title={media.alt}
                  >
                    <p>הדפדפן שלך לא תומך בתגית וידאו. <a href={media.src} target="_blank" rel="noopener noreferrer">לחץ כאן לצפייה בסרטון</a></p>
                  </video>
                ) : (
                  <img 
                    src={media.src}
                    alt={media.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => setSelectedImage({src: media.src, alt: media.alt})}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedImage({src: media.src, alt: media.alt});
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`לחץ להגדלת התמונה: ${media.alt}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal for Gallery */}
      <ImageModal />
    </div>
  );

  // Privacy Policy Page Component
  const PrivacyPage = () => (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => setCurrentView('home')} 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
            aria-label="חזרה לעמוד הבית"
          >
            <ArrowRight className="h-5 w-5 ml-2 rotate-180" />
            חזרה לעמוד הבית
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">מדיניות פרטיות</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                אנו ב״ידיים הדבקות והפקות דפוס בע״מ״ (להלן: ״החברה״ או ״אנו״) מכבדים את פרטיות המשתמשים באתר ומחויבים להגן על המידע האישי הנמסר לנו.
              </p>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">איסוף מידע</h2>
                <p className="mb-4">בעת שימוש באתר, ייתכן שתתבקש למסור מידע אישי כגון:</p>
                <ul className="list-disc list-inside mb-6 space-y-2 mr-6">
                  <li>שם פרטי ושם משפחה</li>
                  <li>מספר טלפון</li>
                  <li>כתובת דוא״ל</li>
                  <li>תוכן הפנייה</li>
                </ul>
                <p className="mb-6">המידע נמסר מרצונך החופשי במסגרת יצירת קשר או בקשת הצעת מחיר.</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">מטרת השימוש במידע</h2>
                <p className="mb-4">המידע שנאסף ישמש לצורך:</p>
                <ul className="list-disc list-inside mb-6 space-y-2 mr-6">
                  <li>יצירת קשר עם הפונה</li>
                  <li>מתן הצעות מחיר ושירותים</li>
                  <li>מענה לפניות</li>
                  <li>שיפור השירות</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">שמירת מידע ואבטחתו</h2>
                <p className="mb-6">החברה נוקטת באמצעי אבטחה מקובלים לשמירה על המידע ומניעת גישה בלתי מורשית.</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">העברת מידע לצדדים שלישיים</h2>
                <p className="mb-6">החברה אינה מעבירה מידע אישי לצדדים שלישיים, אלא אם הדבר נדרש לצורך מתן השירות או לפי דין.</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">זכויות המשתמש</h2>
                <p className="mb-6">
                  כל משתמש רשאי לעיין במידע שנשמר עליו או לבקש תיקון/מחיקה באמצעות פנייה בדוא״ל:
                  <br />
                  <a href="mailto:moshikon1975@gmail.com" className="text-blue-600 hover:text-blue-800 underline">📧 moshikon1975@gmail.com</a>
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">קובצי Cookies</h2>
                <p className="mb-6">ייתכן שהאתר משתמש בקובצי Cookies לצורך תפעול תקין ושיפור חוויית המשתמש.</p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">פרטי החברה</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="font-semibold mb-2 text-gray-900">ידיים הדבקות והפקות דפוס בע״מ</p>
                  <p className="mb-1">משה לוי 9, ראשון לציון, ישראל</p>
                  <p className="mb-1">טלפון: 050-9299292</p>
                  <p>דוא״ל: <a href="mailto:moshikon1975@gmail.com" className="text-blue-600 hover:text-blue-800 underline">moshikon1975@gmail.com</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Accessibility Statement Page Component
  const AccessibilityStatementPage = () => (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => setCurrentView('home')} 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
            aria-label="חזרה לעמוד הבית"
          >
            <ArrowRight className="h-5 w-5 ml-2 rotate-180" />
            חזרה לעמוד הבית
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">♿ הצהרת נגישות</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg mb-6">
                חברת ידיים הדבקות והפקות דפוס בע״מ רואה חשיבות רבה בהנגשת אתר האינטרנט שלה לאנשים עם מוגבלות ופועלת להבטיח חוויית שימוש נגישה, שוויונית ונוחה לכלל המשתמשים.
              </p>
              
              <p className="mb-6">
                אנו משקיעים מאמצים מתמשכים בשיפור נגישות האתר בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013 ולתקן הישראלי ת״י 5568, המבוסס על הנחיות WCAG 2.0 ברמת AA.
              </p>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">התאמות הנגישות באתר</h2>
                <p className="mb-4">באתר הוטמעו בין היתר ההתאמות הבאות:</p>
                <ul className="list-disc list-inside mb-6 space-y-2 mr-6">
                  <li>ניווט ברור ופשוט בין דפי האתר</li>
                  <li>מבנה כותרות היררכי תקין</li>
                  <li>התאמה לשימוש בדפדפנים מודרניים</li>
                  <li>התאמה לתצוגה במובייל ובטאבלט</li>
                  <li>אפשרות הגדלת טקסט באמצעות הדפדפן</li>
                  <li>ניגודיות צבעים מספקת</li>
                  <li>טפסים עם תוויות ברורות</li>
                  <li>קישורים וכפתורים ברורים</li>
                  <li>הוספת תיאורי ALT לתמונות (במידת האפשר)</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">סייגים לנגישות</h2>
                <p className="mb-4">
                  ייתכן וחלק מהתכנים באתר, לרבות תמונות שהועלו בעבר או תכנים חיצוניים, אינם נגישים באופן מלא. אנו פועלים באופן שוטף לשיפור הנגישות באתר.
                </p>
                <p className="mb-6 font-medium text-gray-900">
                  אם נתקלתם ברכיב שאינו נגיש — נשמח שתעדכנו אותנו.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">יצירת קשר בנושא נגישות</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="font-semibold mb-2 text-gray-900">רכז הנגישות באתר:</p>
                  <p className="font-semibold mb-3 text-gray-900">משה נחמה</p>
                  <p className="mb-1">טלפון: 050-9299292</p>
                  <p className="mb-4">דוא״ל: <a href="mailto:moshikon1975@gmail.com" className="text-blue-600 hover:text-blue-800 underline">moshikon1975@gmail.com</a></p>
                  <p className="font-medium text-gray-900">אנו מתחייבים לטפל בפנייה בנושא נגישות בהקדם האפשרי.</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">פרטי החברה</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="font-semibold mb-2 text-gray-900">ידיים הדבקות והפקות דפוס בע״מ</p>
                  <p className="mb-1">משה לוי 9, ראשון לציון</p>
                  <p className="mb-1">טלפון: 050-9299292</p>
                  <p>דוא״ל: <a href="mailto:moshikon1975@gmail.com" className="text-blue-600 hover:text-blue-800 underline">moshikon1975@gmail.com</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white" lang="he" dir="rtl">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:z-[60]"
      >
        דלג לתוכן הראשי
      </a>

      {/* Conditional Rendering */}
      {currentView === 'admin' ? (
        <AdminGallery
          onBack={() => setCurrentView('home')}
        />
      ) : currentView === 'gallery' ? (
        <GalleryPage />
      ) : currentView === 'privacy' ? (
        <PrivacyPage />
      ) : currentView === 'accessibility' ? (
        <AccessibilityStatementPage />
      ) : (
        <>
          {/* Home Page Content */}
     
      <header>
        <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50" role="navigation" aria-label="ניווט ראשי">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img 
  src="/hands.jpg" 
  alt="ידיים Logo" 
  className="h-8 w-8 object-contain"
/>
              <span className="text-xl font-bold text-gray-900">ידיים</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg"
                >
                  בית
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg"
                >
                  שירותים
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg"
                >
                  אודות
                </button>
                <button 
                  onClick={() => setCurrentView('gallery')} 
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-3 py-2 text-sm font-medium transition-colors rounded-lg"
                >
                  גלריה
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 px-6 py-2 rounded-lg transition-colors"
                >
                  צור קשר
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsMenuOpen(!isMenuOpen);
                  }
                }}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1" role="menu">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block px-3 py-2 text-base font-medium w-full text-right rounded-lg"
                role="menuitem"
              >
                דף הבית
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block px-3 py-2 text-base font-medium w-full text-right rounded-lg"
                role="menuitem"
              >
                שירותים
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block px-3 py-2 text-base font-medium w-full text-right rounded-lg"
                role="menuitem"
              >
                אודות
              </button>
              <button 
                onClick={() => setCurrentView('gallery')} 
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block px-3 py-2 text-base font-medium w-full text-right rounded-lg"
                role="menuitem"
              >
                גלריה
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block px-3 py-2 text-base font-medium w-full text-right rounded-lg"
                role="menuitem"
              >
                צור קשר
              </button>
            </div>
          </div>
        )}
      </nav>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/factory.jpg')`,
          }}
        ></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight bg-blue-600">
            ידיים הדבקות והפקות דפוס בע''מ
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2 bg-blue-600">
            ידיים – מומחיות רבת שנים באריזות קרטון ודפוס, עם פתרונות מקיפים בהדבקות, גימורים, הפקות דפוס וייעוץ מקצועי מותאם אישית.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button 
              onClick={() => scrollToSection('services')}
              className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 active:scale-95 sm:hover:scale-105 flex items-center justify-center gap-2"
              aria-label="עיינו בשירותים שלנו"
            >
              עיינו בשירותים <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              צור קשר
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">הסטטיסטיקות שלנו</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
            <div className="text-center" role="listitem">
              <div className="text-4xl font-bold text-blue-600 mb-2" aria-label="שלושים ועוד שנות ניסיון">30+</div>
              <div className="text-gray-600 font-medium">שנות ניסיון</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-4xl font-bold text-blue-600 mb-2" aria-label="עשרת אלפים ועוד פרויקטים שהושלמו">10,000+</div>
              <div className="text-gray-600 font-medium">פרויקטים שהושלמו</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-4xl font-bold text-blue-600 mb-2" aria-label="תשעים ותשעה אחוז איכות">99%</div>
              <div className="text-gray-600 font-medium">איכות</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-4xl font-bold text-blue-600 mb-2" aria-label="מאה אחוז שביעות רצון לקוחות">100%</div>
              <div className="text-gray-600 font-medium">שביעות רצון לקוחות</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="services-heading" className="text-4xl font-bold text-gray-900 mb-4">השירותים שלנו</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              פתרונות ייצור מקיפים המותאמים לצרכים התעשייתיים שלך עם דיוק ומצוינות
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            <article className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" role="listitem">
              <div className="bg-blue-100 rounded-lg p-3 inline-block mb-6 group-hover:bg-blue-200 transition-colors" aria-hidden="true">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
             <h3 className="text-xl font-semibold text-gray-900 mb-4">פתרונות מקיפים באריזות קרטון</h3>
<p className="text-gray-600 mb-6 leading-relaxed">
  מידיים מביאה עמה ניסיון רב שנים בתחום האריזות והדפוס, ומספקת פתרונות מקצועיים בהדבקות, גימורים, איסופים והקמת קופסאות. אנו מקפידים על איכות גבוהה ומציעים גם שירותי ייצור והרכבה בבית הלקוח במקרה הצורך.
</p>

              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                גלה עוד<ArrowRight className="h-4 w-4 ml-1 group-hover:ml-0 transition-all" aria-hidden="true" />
              </div>
            </article>

            <article className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" role="listitem">
              <div className="bg-green-100 rounded-lg p-3 inline-block mb-6 group-hover:bg-green-200 transition-colors" aria-hidden="true">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
             <h3 className="text-xl font-semibold text-gray-900 mb-4">בקרת איכות</h3>
<p className="text-gray-600 mb-6 leading-relaxed">
  בידיים הדבקות והפקות דפוס בע"מ אנו מקפידים על תהליכי בקרת איכות קפדניים, כדי להבטיח שכל מוצר יעמוד בסטנדרטים הגבוהים ביותר.
</p>
              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
               גלה עוד <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-0 transition-all" aria-hidden="true" />
              </div>
            </article>

            <article className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" role="listitem">
              <div className="bg-orange-100 rounded-lg p-3 inline-block mb-6 group-hover:bg-orange-200 transition-colors" aria-hidden="true">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
             <h3 className="text-xl font-semibold text-gray-900 mb-4">פתרונות מותאמים אישית</h3>
<p className="text-gray-600 mb-6 leading-relaxed">
  אנו מציעים פתרונות ייחודיים ומותאמים אישית בתחומי ההדבקות, הגימורים והפקות הדפוס – כדי לענות בדיוק על הצרכים של העסק שלך.
</p>
              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                גלה עוד <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-0 transition-all" aria-hidden="true" />
              </div>
            </article>

            <article className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" role="listitem">
              <div className="bg-purple-100 rounded-lg p-3 inline-block mb-6 group-hover:bg-purple-200 transition-colors" aria-hidden="true">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
             <h3 className="text-xl font-semibold text-gray-900 mb-4">הקפדה על לוחות זמנים</h3>
<p className="text-gray-600 mb-6 leading-relaxed">
  תהליכי עבודה יעילים והקפדה על תכנון מוקפד מאפשרים לנו לתקתק כל פרויקט בזמן ובמקצועיות.
</p>
              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                גלה עוד <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-0 transition-all" aria-hidden="true" />
              </div>
            </article>

            <article className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" role="listitem">
              <div className="bg-red-100 rounded-lg p-3 inline-block mb-6 group-hover:bg-red-200 transition-colors" aria-hidden="true">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ניהול פרויקטים</h3>
<p className="text-gray-600 mb-6 leading-relaxed">
  ניהול פרויקטים מקצה לקצה – מהרעיון ועד להשלמת הפרויקט – תוך שמירה על תיאום, יעילות וביצוע חלק.
</p>
              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                גלה עוד <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-0 transition-all" aria-hidden="true" />
              </div>
            </article>

            <article className="group bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" role="listitem">
              <div className="bg-teal-100 rounded-lg p-3 inline-block mb-6 group-hover:bg-teal-200 transition-colors" aria-hidden="true">
                <Zap className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">חדשנות וביצוע</h3>
<p className="text-gray-600 mb-6 leading-relaxed">
  חדשנות מתמדת ומחקר ופיתוח מאפשרים לנו להוביל את תחום האריזות והדפוס ולהישאר בראש הטכנולוגיה והמגמות.
</p>
              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                גלה עוד <ArrowRight className="h-4 w-4 ml-1 group-hover:ml-0 transition-all" aria-hidden="true" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50" aria-labelledby="about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="about-heading" className="text-4xl font-bold text-gray-900 mb-6">על החברה</h2>
              <div className="text-lg text-gray-600 mb-6 leading-relaxed space-y-4">
                <p>
                  חברת "ידיים הדבקות והפקות דפוס בע"מ" היא מפעל בראשון לציון המתמחה בתחום הדפוס, האריזות והעבודות הידניות. החברה מייצרת אריזות מקרטון ומקרטון גלי, מודפסות וחלקות, בהתאמה אישית לצורכי כל לקוח.
                </p>
                <p>
                  החברה מספקת פתרונות לעסקים ולחברות הזקוקים לאריזות מיוחדות בכמויות קטנות ובינוניות. בין מוצריה ניתן למצוא אריזות למוצרי מזון ומשקאות, יין, שמן זית, ליקרים, מארזי מתנה, מוצרי קוסמטיקה ומוצרים מסחריים נוספים.
                </p>
                <p>
                  לצד ייצור האריזות, החברה מבצעת עבודות דפוס, הדבקה, קיפול, הרכבה ואריזה ידנית. הלקוחות מקבלים ליווי אישי ומקצועי משלב הרעיון והתכנון ועד לקבלת המוצר המוגמר.
                </p>
                <p>
                  אנו שמים דגש על שירות אישי, איכות גבוהה וגמישות בייצור, ומעניקים פתרונות יצירתיים גם לפרויקטים מורכבים ולכמויות שאינן גדולות.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">ייצור אריזות קרטון וקרטון גלי בהתאמה אישית</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">שירותי דפוס, הדבקה, קיפול והרכבה</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">פתרונות בכמויות קטנות ובינוניות</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">ליווי אישי משלב התכנון ועד המוצר המוגמר</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/description.jpg"
                  alt="מפעל ידיים הדבקות והפקות דפוס - חלל ייצור מודרני עם מכונות הדפסה והדבקה מתקדמות"
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-200 rounded-lg -z-10" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Images Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" aria-labelledby="featured-gallery-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 id="featured-gallery-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">גלריית תמונות</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              צפו בתמונות מהמפעל והעבודות שלנו
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredImages.map((media, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-w-4 aspect-h-3 h-64">
                  <img 
                    src={media.src}
                    alt={media.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => setSelectedImage({src: media.src, alt: media.alt})}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedImage({src: media.src, alt: media.alt});
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`לחץ להגדלת התמונה: ${media.alt}`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* View More Images Button */}
          <div className="text-center">
            <button 
              onClick={() => setCurrentView('gallery')}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              aria-label="צפייה בכל התמונות והסרטונים"
            >
              <span className="ml-2">צפו בכל התמונות</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="text-gray-600 mt-2 text-sm">
              גלו עוד תמונות וסרטונים מהמפעל שלנו
            </p>
            <a
              href="https://drive.google.com/file/d/1E3vVXbB_vUcquFJ2mora9_y4D74m2HHt/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="צפייה בקטלוג הפרויקטים והמוצרים - נפתח בחלון חדש"
            >
              קטלוג הפרויקטים והמוצרים שלנו
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="instagram-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 p-1 rounded-2xl shadow-lg">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 p-4 rounded-full" aria-hidden="true">
                  <Instagram className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h3 id="instagram-heading" className="text-2xl font-bold text-gray-900 mb-4">עקבו אחרינו באינסטגרם</h3>
              <p className="text-xl font-semibold text-gray-700 mb-2">@moshiko_nehama12</p>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                עקבו אחרי הפרויקטים החדשים שלנו, תהליכי הייצור והעדכונים מהמפעל
              </p>
              
              <a 
                href="https://www.instagram.com/moshiko_nehama12/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 text-lg"
                aria-label="עקבו אחרינו באינסטגרם - נפתח בחלון חדש"
              >
                <Instagram className="h-6 w-6" aria-hidden="true" />
                עקבו אחרינו באינסטגרם
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50" aria-labelledby="contact-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="contact-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">צור קשר</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              נשמח לשמוע ממך! צור קשר עם הצוות שלנו לקבלת מידע נוסף.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="order-2 lg:order-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 text-center lg:text-right">מידע ליצירת קשר</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">טלפון</h4>
                    <p className="text-gray-600">050-9299292 מושיקו</p>
                    
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">דואר אלקטרוני</h4>
                    <p className="text-gray-600">moshikon1975@gmail.com</p>
                  
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">כתובת</h4>
                    <p className="text-gray-600">
                     משה לוי 9<br />
                      ראשון לציון<br />
                      ישראל
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-xl">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">בקשת הצעת מחיר</h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      שם פרטי <span className="text-red-500" aria-label="שדה חובה">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby="firstName-error"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                      placeholder="הזן שם פרטי"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      שם משפחה <span className="text-red-500" aria-label="שדה חובה">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby="lastName-error"
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                      placeholder="הזן שם משפחה"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    דואר אלקטרוני <span className="text-red-500" aria-label="שדה חובה">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-describedby="email-error email-help"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                    placeholder="israel@gmail.com"
                  />
                  <p id="email-help" className="text-sm text-gray-600 mt-1">נשתמש בכתובת הדואר האלקטרוני שלך לשליחת הצעת המחיר</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון <span className="text-red-500" aria-label="שדה חובה">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-describedby="phone-error phone-help"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                    placeholder="050-1234567"
                  />
                  <p id="phone-help" className="text-sm text-gray-600 mt-1">מספר טלפון ליצירת קשר מהיר</p>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    הודעה נוספת <span className="text-gray-500">(אופציונלי)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    aria-describedby="message-help"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical placeholder-gray-500"
                    placeholder="פרטים נוספים על הפרויקט שלכם..."
                  />
                  <p id="message-help" className="text-sm text-gray-600 mt-1">ניתן להוסיף פרטים נוספים על הפרויקט או דרישות מיוחדות</p>
                </div>

                {/* Privacy Agreement Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    id="agreeToPrivacy"
                    type="checkbox"
                    name="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToPrivacy" className="text-sm text-gray-700 leading-5">
                    אני מאשר/ת כי קראתי את{' '}
                    <button
                      type="button"
                      onClick={() => setCurrentView('privacy')}
                      className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      מדיניות הפרטיות
                    </button>
                    {' '}ומסכים/ה להעברת פרטיי לצורך יצירת קשר.
                    <span className="text-red-500 mr-1" aria-label="שדה חובה">*</span>
                  </label>
                </div>

                {submitStatus === 'success' && (
                  <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="status">
                    הפרטים נשלחו בהצלחה. נחזור אליכם בהקדם.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    השליחה נכשלה. אנא נסו שוב.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!formData.agreeToPrivacy || submitStatus === 'sending'}
                  className="w-full bg-blue-600 text-white px-6 py-4 text-base sm:text-lg rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitStatus === 'sending' ? 'שולח בקשה...' : 'שלח בקשה'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
  src="/hands.jpg" 
  alt="ידיים Logo" 
  className="h-8 w-8 object-contain"
/>

                <span className="text-xl font-bold">ידיים הדבקות והפקות דפוס בע''מ</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                מובילים בפתרונות ייצור מתקדמים עם מחויבות לאיכות, חדשנות ושירות לקוחות מעולה.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.instagram.com/moshiko_nehama12/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors p-2 hover:bg-gray-800 rounded-full"
                  aria-label="עקבו אחרינו באינסטגרם - נפתח בחלון חדש"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <span className="text-gray-400 text-sm">עקבו אחרינו ברשתות החברתיות</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">לינקים מהירים</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors text-right">דף הבית</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors text-right">שירותים</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors text-right">אודות</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors text-right">צור קשר</button></li>
                <li>
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="mt-3 inline-flex items-center border border-gray-500 text-gray-200 hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white px-3 py-2 rounded-lg transition-colors"
                  >
                    כניסת מנהל
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">פרטי קשר</h4>
              <ul className="space-y-2 text-gray-400">
                <li>050-9299292</li>
                <li>Moshikon1975@gmail.com</li>
                <li>משה לוי 9<br />ראשון לציון, ישראל</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <div className="mb-4">
              <button 
                onClick={() => setCurrentView('privacy')} 
                className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors"
              >
                מדיניות פרטיות 
              </button>
              <span className="mx-3">|</span>
              <button 
                onClick={() => setCurrentView('accessibility')} 
                className="hover:text-white focus:text-white focus:outline-none focus:underline transition-colors"
              >
               הצהרת נגישות
              </button>
            </div>
            <p>2026 ידיים הדבקות והפקות דפוס בע''מ</p>
          </div>
        </div>
      </footer>

      {/* Image Modal for Home Page */}
      <ImageModal />

      {/* Accessibility Statement Modal */}
      <AccessibilityStatement 
        isOpen={isAccessibilityStatementOpen} 
        onClose={() => setIsAccessibilityStatementOpen(false)} 
      />
        </>
      )}
    </div>
  );
}

export default App;