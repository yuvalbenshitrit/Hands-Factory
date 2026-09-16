# React + TypeScript + Vite

to start the app - pm run dev

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

ידיים - אתר החברה

אתר תדמית לחברת "ידיים הדבקות והפקות דפוס בע"מ".

האתר כולל:

- עמוד בית בעברית עם מידע על החברה והשירותים.
- גלריית תמונות וסרטונים מ־Supabase Storage.
- אזור מנהל להעלאה ומחיקה של קבצי גלריה.
- טופס יצירת קשר שנשאר בעיצוב האתר ושומר פניות ב־Google Sheets.
- עמוד מדיניות פרטיות והצהרת נגישות.

## טכנולוגיות

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Google Apps Script

## התקנה והרצה מקומית

דרישות מוקדמות: Node.js ו־npm.

```bash
npm install
npm run dev
```

לאחר ההפעלה, פתחו את הכתובת שמופיעה בטרמינל, בדרך כלל:

```text
http://localhost:5173
```

## משתני סביבה

צרו בתיקיית הפרויקט קובץ בשם `.env.local` והוסיפו:

```env
VITE_SUPABASE_URL=כתובת_פרויקט_Supabase
VITE_SUPABASE_ANON_KEY=מפתח_Anon_של_Supabase
```

אין להעלות את `.env.local` ל־GitHub. הוא כבר מופיע ב־`.gitignore`.

## Supabase

Supabase משמש לאחסון קבצי הגלריה ולהתחברות המנהל.

יש ליצור ב־Storage bucket בשם `gallery` ולהגדיר את הרשאות הקריאה וההעלאה בהתאם להגדרות הפרויקט. פרטי מנהל הגלריה מנוהלים דרך Supabase Auth.

## טופס יצירת קשר

הטופס באתר שולח `POST` ל־Google Apps Script, והסקריפט מוסיף את הנתונים ל־Google Sheet.

ב־Google Apps Script צריכה להיות פונקציית `doPost`, והפריסה צריכה להיות מוגדרת כך:

- **Execute as:** Me
- **Who has access:** Anyone

לאחר שינוי קוד ב־Apps Script יש ליצור גרסה חדשה בפריסה. כתובת ה־Web App מוגדרת בקובץ `src/App.tsx`.

## בדיקות

```bash
npm run lint
npm run build
```

## פריסה ל־Vercel

1.  העלו את הפרויקט ל־GitHub.
2.  ב־Vercel בחרו **Add New Project** וחברו את מאגר GitHub.
3.  ודאו שהגדרות הבנייה הן:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

4.  הוסיפו ב־Vercel את משתני הסביבה `VITE_SUPABASE_URL` ו־`VITE_SUPABASE_ANON_KEY`.
5.  הפעילו Deploy.

לאחר הפריסה בדקו את הגלריה, התחברות המנהל ושליחת טופס יצירת הקשר.

## מבנה מרכזי

```text
src/
  App.tsx              # עמודי האתר וטופס יצירת הקשר
  AdminGallery.tsx     # ממשק ניהול הגלריה
  AccessibilityStatement.tsx
  lib/supabase.ts      # חיבור וטעינת קבצי Supabase
public/                # נכסים סטטיים המשמשים את האתר
```

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
