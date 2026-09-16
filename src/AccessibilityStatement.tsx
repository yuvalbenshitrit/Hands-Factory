import React from 'react';
import { X } from 'lucide-react';

interface AccessibilityStatementProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityStatement: React.FC<AccessibilityStatementProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="accessibility-title"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="סגור הצהרת נגישות"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        <div className="pr-12">
          <h2 id="accessibility-title" className="text-3xl font-bold text-gray-900 mb-6 text-right">
            הצהרת נגישות
          </h2>

          <div className="space-y-6 text-right" lang="he">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">מחויבות לנגישות</h3>
              <p className="text-gray-700 leading-relaxed">
                ידיים הדבקות והפקות דפוס בע"מ מחויבת להנגיש את השירותים שלה לכלל הציבור, 
                לרבות אנשים עם מוגבלויות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 
                ולתקנות הנגישות לשירותי תקשורת (התאמות נגישות לאתרי אינטרנט), התש"ף-2019.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">רמת הנגישות</h3>
              <p className="text-gray-700 leading-relaxed">
                אתר זה נגיש בהתאם לרמת AA של הנחיות הנגישות לתוכן האינטרנט (WCAG 2.1), 
                וכולל התאמות עבור:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>ניווט באמצעות מקלדת בלבד</li>
                <li>תמיכה בקוראי מסך</li>
                <li>ניגודיות צבעים מתאימה</li>
                <li>תמיכה בכיוון כתיבה מימין לשמאל (RTL)</li>
                <li>תמיכה בהגדלת טקסט עד 200%</li>
                <li>תוויות וארגון ברור של תוכן</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">תאימות לדפדפנים ולטכנולוגיות מסייעות</h3>
              <p className="text-gray-700 leading-relaxed">
                האתר נבדק ונמצא תואם לדפדפנים העיקריים ולטכנולוגיות מסייעות כגון:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
                <li>קוראי מסך: NVDA, JAWS, VoiceOver</li>
                <li>דפדפנים: Chrome, Firefox, Safari, Edge</li>
                <li>ניווט במקלדת</li>
                <li>תוכנות הזדקפות קולית</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">אמצעי נגישות באתר</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>ניווט עיקרי נגיש עם תמיכה במקלדת</li>
                <li>קישור "דלג לתוכן הראשי" בתחילת העמוד</li>
                <li>כותרות מסודרות והיררכיות</li>
                <li>תיאורים אלטרנטיביים לתמונות</li>
                <li>תוויות ברורות לטפסים</li>
                <li>הודעות שגיאה ברורות</li>
                <li>ניגודיות צבעים מתאימה</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">פרטי קשר לנושאי נגישות</h3>
              <p className="text-gray-700 leading-relaxed">
                אם נתקלתם בבעיית נגישות באתר או זקוקים לסיוע, אנא פנו אלינו:
              </p>
              <div className="mt-3 text-gray-700">
                <p><strong>טלפון:</strong> 050-9299292</p>
                <p><strong>דואר אלקטרוני:</strong> moshikon1975@gmail.com</p>
                <p><strong>כתובת:</strong> משה לוי 9, ראשון לציון</p>
              </div>
              <p className="text-gray-700 mt-3">
                אנו נעשה מאמץ לטפל בפנייתכם בהקדם האפשרי.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">מידע נוסף</h3>
              <p className="text-gray-700 leading-relaxed">
                הצהרת נגישות זו עודכנה לאחרונה בתאריך: {new Date().toLocaleDateString('he-IL')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityStatement;