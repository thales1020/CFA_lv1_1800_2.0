# Task 1: Cấu hình Tailwind CSS & Supabase - NGHIỆM THU

## ✅ Checklist Nghiệm thu

### 1. Kiểm tra `tailwind.config.ts`
- ✅ Có object `colors.prometric` trong `theme.extend`
- ✅ Định nghĩa màu: navy, yellow, gray borders
- ✅ Plugin tạo utility `.no-select` và `.allow-select`

### 2. Kiểm tra `src/app/globals.css`
- ✅ Có đầy đủ 3 directives: `@tailwind base/components/utilities`
- ✅ Áp dụng `.no-select` toàn cục qua `* { @apply no-select; }`
- ✅ Class `.question-content { @apply allow-select; }` cho vùng selectable

### 3. Kiểm tra `src/lib/supabase/client.ts`
- ✅ Sử dụng `createClient` từ `@supabase/supabase-js`
- ✅ Đọc env: `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Guard clause kiểm tra env variables trước khi init

### 4. Test thực tế

#### Bước 1: Cài đặt dependencies
```bash
npm install
```

#### Bước 2: Cấu hình Supabase
Sửa file `.env.local` với credentials thật:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Bước 3: Chạy dev server
```bash
npm run dev
```

#### Bước 4: Kiểm tra UI (http://localhost:3000)
- ✅ **CSS Build**: Không có lỗi Tailwind trong terminal
- ✅ **Text Selection**: 
  - Vùng thường: KHÔNG thể bôi đen
  - Vùng có class `.question-content`: CÓ THỂ bôi đen
- ✅ **DevTools Console (F12)**: Không có lỗi Supabase

#### Bước 5: Test màu Prometric
Kiểm tra trong trang chủ:
- Navy header color: `#003366`
- Yellow highlight
- Gray borders

## 📁 File Structure
```
├── .env.local                    # Supabase credentials
├── .env.local.example            # Template
├── tailwind.config.ts            # Design tokens
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── package.json
└── src/
    ├── app/
    │   ├── layout.tsx            # Import globals.css
    │   ├── globals.css           # Base CSS + Tailwind
    │   └── page.tsx              # Demo page
    ├── lib/
    │   └── supabase/
    │       └── client.ts         # Supabase client
    └── types/
        └── index.ts              # Database types
```

## 🎯 Kết quả mong đợi
- Dev server chạy không lỗi
- Text selection hoạt động đúng logic
- Màu sắc hiển thị đúng design tokens Prometric
- Console sạch, không có warning/error Supabase
