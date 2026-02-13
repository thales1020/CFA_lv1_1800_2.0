**Kế hoạch Phát triển Dự án: Ứng dụng Thi thử CFA Level 1 (Prometric CBT Simulator)**

**1. Chiến lược Clone Giao diện (Figma to Code)**

* **Bóc tách UI Components:**
* `TopBar`: Component hiển thị tên thí sinh, tiến độ câu hỏi và đồng hồ đếm ngược góc phải.
* `MainArea`: Container chia layout hiển thị `QuestionContent` và `OptionList`.
* `OptionItem`: Component độc lập chứa logic radio button và class CSS line-through cho tính năng loại trừ.
* `BottomBar`: Các nút điều hướng (Previous, Next) và nút kích hoạt `ReviewGrid`.
* `ReviewGrid`: Modal/Panel hiển thị lưới 90 ô, map CSS class dựa trên trạng thái từng câu.


* **Trích xuất Design Tokens (`tailwind.config.ts`):**
* Định nghĩa hệ màu tĩnh của Prometric: Xám nền (background), Xanh navy (header), Vàng nhạt (highlight).
* Cấu hình Typography chuẩn (Arial/Tahoma, font size cố định không responsive để sát với thực tế phòng máy).
* Tắt tính năng text selection toàn cục, chỉ mở lại ở khu vực `QuestionContent`.



**2. Luồng Dữ Liệu Chi Tiết (Data Flow Execution)**

* **Giai đoạn Init (Tải đề):**
1. Next.js (Server Component) truy vấn Supabase qua `@supabase/supabase-js` để lấy danh sách `questions` dựa trên `exam_id`.
2. Dữ liệu truyền xuống Client Component.
3. Init Zustand Store: Đẩy mảng `questions` vào store. Khởi tạo `timer` (ví dụ: 135 phút), `answers` (object rỗng), `flags` (set rỗng), `strikethroughs` (object rỗng).


* **Giai đoạn Làm bài (Interaction):**
1. **Chọn đáp án:** User click -> Component gọi hàm `setAnswer(question_id, option_id)` của Zustand -> Store cập nhật -> Next.js re-render cục bộ `OptionList` và ô tương ứng trong `ReviewGrid`.
2. **Flag (Đánh dấu):** User click nút Flag -> Gọi `toggleFlag(question_id)` -> Cập nhật state -> Re-render icon Flag và ô trong `ReviewGrid`.
3. **Strikethrough (Chuột phải):** Bắt event `onContextMenu` tại `OptionItem`, chặn mặc định bằng `e.preventDefault()`. Gọi hàm `toggleStrikethrough(question_id, option_id)` trong Zustand. Trạng thái gạch bỏ được lưu trữ để giữ nguyên khi user chuyển qua lại giữa các câu.
4. **Highlight (Bôi đen):** Sử dụng `window.getSelection()`. Bắt sự kiện `onMouseUp` tại khu vực text câu hỏi, lấy range và wrap bằng `<span className="bg-prometric-yellow">`. Trạng thái này quản lý bằng DOM/Local State của React, sẽ bị reset nếu chuyển câu (đúng với logic Prometric chuẩn).


* **Giai đoạn Nộp bài (Submit):**
1. Trigger bằng nút Submit hoặc khi `timer === 0`.
2. Zustand thực thi `calculateScore()`: Lặp qua `answers`, so sánh với `correct_option` từ mảng `questions` đã mã hóa.
3. Đóng gói Payload: `{ user_id, exam_id, score, time_spent, answer_details: JSON }`.
4. Gọi API POST chèn record vào bảng `attempts` của Supabase. Xóa state cục bộ và redirect sang trang kết quả.



**3. Cấu trúc Thư mục Dự kiến (Next.js App Router)**

```text
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── exam/[id]/page.tsx         # Layout Prometric và logic thi
│   ├── result/[attemptId]/page.tsx
│   └── layout.tsx
├── components/
│   ├── exam/
│   │   ├── TopBar.tsx
│   │   ├── QuestionArea.tsx
│   │   ├── OptionItem.tsx
│   │   ├── BottomBar.tsx
│   │   └── ReviewGrid.tsx
│   └── ui/                        # Shared components
├── store/
│   └── useExamStore.ts            # Quản lý state cốt lõi (Zustand)
├── lib/
│   └── supabase/
│       ├── client.ts              # Supabase Client config
│       └── services.ts            # Các hàm CRUD Database
└── types/
    └── index.ts                   # TypeScript Interfaces (Question, Attempt)

```

**4. Lộ trình Phát triển (Milestones)**

* **M1:** Figma UI/UX Clone & Thiết lập cấu hình Design Tokens vào Tailwind.
* **M2:** Setup Project (Next.js, Supabase). Dựng khung layout tĩnh Prometric (Header, Main, Footer).
* **M3:** Tích hợp Zustand. Xây dựng Data Fetching lấy đề thi từ Supabase đổ vào giao diện.
* **M4:** Code logic cốt lõi: Điều hướng Previous/Next, Chọn đáp án, Đánh dấu (Flag), đồng bộ dữ liệu với Review Grid.
* **M5:** Tích hợp tính năng đặc thù (Chặn chuột phải làm Strikethrough, Highlight text). Xử lý logic đếm ngược đếm giờ, chấm điểm và Submit lưu vào Supabase.
* **M6:** Kiểm thử Edge Cases và Deploy lên Vercel.

**5. Kế hoạch Kiểm thử (Test Plan - Edge Cases)**

* **Reload F5 khi đang thi:** Sử dụng Zustand `persist` middleware với `sessionStorage` để đồng bộ `timer`, `answers`, và `strikethroughs`. User F5 không bị mất bài làm và thời gian tiếp tục chạy đúng.
* **Hết giờ đếm ngược:** Store tự động block mọi UI click, ép buộc gọi hàm Submit để đẩy data hiện tại lên Supabase, bất chấp thao tác của user.
* **Bypass Context Menu:** Đảm bảo `e.preventDefault()` hoạt động ổn định trên các trình duyệt (Chrome, Safari, Edge) để menu chuột phải mặc định không che khuất UI bài thi.
* **Mất kết nối mạng:** Áp dụng try/catch ở hàm Submit. Nếu Supabase throw error do network, mã hóa JSON bài làm lưu vào `localStorage`, hiển thị cảnh báo "Network Error" và tự động retry background đẩy kết quả lên khi có lại kết nối.

---

