# Task 2: Zustand Store - NGHIỆM THU

## ✅ Checklist Nghiệm thu

### 1. Kiểm tra Khởi tạo & Kiểu dữ liệu
- ✅ File export hook `useExamStore`
- ✅ Interfaces đầy đủ: `ExamStoreState`, `ExamStoreActions`, `ExamStore`
- ✅ TypeScript không báo lỗi type mismatch

### 2. Kiểm tra Middleware Persist
- ✅ State được bọc `persist` middleware
- ✅ Config: `createJSONStorage(() => sessionStorage)`
- ✅ `flags` lưu dạng **Array** (không phải Set) → JSON serializable
- ✅ `partialize` chỉ persist các field cần thiết (loại bỏ `isSubmitting`)

### 3. Kiểm tra Logic Actions

#### `toggleFlag`
```typescript
// ✅ Logic: Toggle add/remove questionId trong array
const flags = [...state.flags];
const index = flags.indexOf(questionId);
if (index > -1) {
  flags.splice(index, 1); // Remove
} else {
  flags.push(questionId); // Add
}
```

#### `toggleStrikethrough`
```typescript
// ✅ Logic: Toggle option trong Record<string, OptionType[]>
// VD: { 'q1': ['A', 'C'] } - đã gạch option A và C
const currentStrikethroughs = state.strikethroughs[questionId] || [];
if (index > -1) {
  newStrikethroughs = currentStrikethroughs.filter((o) => o !== option);
} else {
  newStrikethroughs = [...currentStrikethroughs, option];
}
```

#### `tickTimer`
```typescript
// ✅ Logic: Giảm time, chặn không cho xuống âm
const newTime = Math.max(0, state.timeLeftSeconds - 1);
```

### 4. Test Thực Tế

#### Bước 1: Chạy dev server
```bash
npm run dev
```

#### Bước 2: Mở test page
```
http://localhost:3000/test-store
```

#### Bước 3: Test F5 Persistence
1. Click **"Init Exam"** → Load 3 câu hỏi, timer 5 phút
2. Click **"Set Answer Q1 = A"** → State `answers` = `{"q1": "A"}`
3. Click **"Toggle Flag Q1"** → State `flags` = `["q1"]`
4. Click **"Toggle Strike Q1 Option A"** → State `strikethroughs` = `{"q1": ["A"]}`
5. **Press F5** (Reload page)
6. ✅ Kiểm tra panel "Detailed Data":
   - `answers` vẫn là `{"q1": "A"}`
   - `flags` vẫn là `["q1"]`
   - `strikethroughs` vẫn là `{"q1": ["A"]}`
   - Timer vẫn đếm tiếp từ giá trị trước khi reload

#### Bước 4: Test các actions khác
- **Toggle Flag lần 2** → Flags array trống (removed)
- **Toggle Strike C** → `{"q1": ["A", "C"]}`
- **Navigate to Q2** → currentQuestionIndex = 1
- **Timer countdown** → Tự động giảm mỗi giây, dừng ở 0

### 5. Kiểm tra DevTools

#### Chrome DevTools → Application Tab
1. Mở Application tab
2. Storage → Session Storage → `http://localhost:3000`
3. Tìm key: `exam-storage`
4. ✅ Value phải là JSON hợp lệ với structure:
```json
{
  "state": {
    "questions": [...],
    "currentQuestionIndex": 0,
    "answers": {"q1": "A"},
    "flags": ["q1"],
    "strikethroughs": {"q1": ["A"]},
    "timeLeftSeconds": 285
  },
  "version": 0
}
```

## 🎯 Kết quả mong đợi
- ✅ Store compile không lỗi TypeScript
- ✅ F5 reload: State được restore hoàn toàn
- ✅ Flags lưu dạng Array, không dùng Set
- ✅ Timer tick xuống 0 và dừng (không âm)
- ✅ Toggle logic hoạt động đúng (add/remove)
- ✅ SessionStorage lưu đúng format JSON

## 📁 Files
- [src/store/useExamStore.ts](src/store/useExamStore.ts) - Zustand store với persist
- [src/app/test-store/page.tsx](src/app/test-store/page.tsx) - Test UI
