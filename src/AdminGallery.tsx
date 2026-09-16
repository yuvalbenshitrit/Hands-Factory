import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, LogOut, Trash2, Upload } from 'lucide-react';
import { loadSupabaseGallery, supabase, type GalleryMedia } from './lib/supabase';

type AdminGalleryProps = {
  onBack: () => void;
};

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];

const AdminGallery = ({ onBack }: AdminGalleryProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const refreshMedia = async () => {
    setMedia(await loadSupabaseGallery(true));
  };

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
      if (data.session) {
        void refreshMedia();
      }
    });
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('יש להגדיר את חיבור Supabase בקובץ .env.local');
      return;
    }

    setIsBusy(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsBusy(false);

    if (error) {
      setMessage('פרטי ההתחברות אינם נכונים.');
      return;
    }

    setIsLoggedIn(true);
    setPassword('');
    await refreshMedia();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0 || !supabase) {
      return;
    }
    const invalidFile = files.find(file => !allowedTypes.includes(file.type));
    if (invalidFile) {
      setMessage(`הקובץ ${invalidFile.name} אינו נתמך. אפשר להעלות תמונות JPG, PNG, GIF, WEBP או סרטוני MP4, MOV, WEBM בלבד.`);
      return;
    }
    const oversizedFile = files.find(file => file.size > 50 * 1024 * 1024);
    if (oversizedFile) {
      setMessage(`הקובץ ${oversizedFile.name} גדול מדי. הגודל המרבי הוא 50MB.`);
      return;
    }

    setIsBusy(true);
    setMessage('');
    let uploadedCount = 0;
    for (const [index, file] of files.entries()) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
      const path = `${Date.now()}-${index}-${safeName}`;
      const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: false });
      if (error) {
        setIsBusy(false);
        setMessage(`ההעלאה נכשלה עבור ${file.name}: ${error.message}`);
        await refreshMedia();
        return;
      }
      uploadedCount += 1;
    }
    setIsBusy(false);
    setMessage(`${uploadedCount} קבצים נוספו לגלריה.`);
    await refreshMedia();
  };

  const handleDelete = async (item: GalleryMedia) => {
    if (!supabase || !item.path || !window.confirm('למחוק את הקובץ מהגלריה?')) {
      return;
    }

    setIsBusy(true);
    const { error } = await supabase.storage.from('gallery').remove([item.path]);
    setIsBusy(false);

    if (error) {
      setMessage(`המחיקה נכשלה: ${error.message}`);
      return;
    }

    setMessage('הקובץ נמחק.');
    await refreshMedia();
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setIsLoggedIn(false);
    setMedia([]);
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-16" dir="rtl">
        <div className="max-w-md mx-auto px-4">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-8">
            <ArrowRight className="h-5 w-5 ml-2 rotate-180" />
            חזרה לאתר
          </button>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">כניסת מנהל</h1>
            <p className="text-gray-600 mb-6">התחברי כדי לנהל את גלריית הפרויקטים.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="block text-sm font-semibold mb-2">אימייל</span>
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} required className="w-full rounded-lg border border-gray-300 p-3" />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold mb-2">סיסמה</span>
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} required className="w-full rounded-lg border border-gray-300 p-3" />
              </label>
              <button type="submit" disabled={isBusy} className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 disabled:opacity-50">
                {isBusy ? 'מתחברת...' : 'התחברות'}
              </button>
            </form>
            {message && <p className="mt-4 text-red-600" role="alert">{message}</p>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowRight className="h-5 w-5 ml-2 rotate-180" />
              חזרה לאתר
            </button>
            <h1 className="text-3xl font-bold text-gray-900">ניהול גלריה</h1>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-gray-700 hover:text-red-600">
            <LogOut className="h-5 w-5" />
            התנתקות
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700">
            <Upload className="h-5 w-5" />
            {isBusy ? 'מעבד...' : 'העלאת תמונה או סרטון'}
            <input type="file" multiple accept="image/*,video/mp4,video/quicktime,video/webm" onChange={handleUpload} disabled={isBusy} className="sr-only" />
          </label>
          <p className="text-sm text-gray-600 mt-3">הקובץ יופיע בגלריה לכל המבקרים לאחר ההעלאה.</p>
          {message && <p className="mt-3 text-green-700 flex items-center gap-2"><CheckCircle className="h-5 w-5" />{message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {media.map(item => (
            <div key={item.path} className="bg-white rounded-xl shadow overflow-hidden">
              {item.type === 'video' ? <video src={item.src} controls className="w-full h-48 object-cover" /> : <img src={item.src} alt={item.alt} className="w-full h-48 object-cover" />}
              <button onClick={() => void handleDelete(item)} disabled={isBusy} className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 disabled:opacity-50">
                <Trash2 className="h-5 w-5" />
                מחיקה
              </button>
            </div>
          ))}
        </div>
        {media.length === 0 && <p className="text-center text-gray-600">אין עדיין קבצים שהועלו ל־Supabase.</p>}
      </div>
    </main>
  );
};

export default AdminGallery;
