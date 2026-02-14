# 🎯 HƯỚNG DẪN NGHIỆM THU REVIEW MODE

## Bước 1: Insert Questions vào Database

1. Mở **Supabase Dashboard** → SQL Editor
2. Copy toàn bộ nội dung file `docs/insert-sample-questions.sql`
3. Paste vào SQL Editor và click **Run**
4. Verify thấy message: "Questions inserted successfully! ✅"

## Bước 2: Tạo Test Attempt với Mixed Answers

Chạy script để tạo attempt với đầy đủ 3 loại câu trả lời:

```bash
node create-test-attempt.js
```

Script sẽ tạo:
- ✅ **8 câu ĐÚNG** (câu 1-8) → Hiển thị 1 ô XANH LÁ
- ❌ **7 câu SAI** (câu 9-15) → Hiển thị 1 ô ĐỎ + 1 ô XANH LÁ
- ⚪ **5 câu BỎ TRỐNG** (câu 16-20) → Hiển thị 1 ô XANH LÁ

## Bước 3: Kiểm Tra Nghiệm Thu

Script sẽ hiển thị URL dạng:
```
http://localhost:3000/result/[attempt-id]
```

### ✅ Tiêu chí 1: Fetch Dữ liệu

- [ ] Trang load đầy đủ không lỗi undefined
- [ ] Hiển thị title "Review Mode"
- [ ] Có 20 câu hỏi
- [ ] Explanation hiển thị cho tất cả câu

### ✅ Tiêu chí 2: Logic Màu sắc

**Test Case 1: Câu trả lời ĐÚNG (câu 1-8)**
- [ ] Chuyển đến câu 3
- [ ] Chỉ có 1 ô màu XANH LÁ (border-green-600, bg-green-100)
- [ ] Có icon "✓ Correct"
- [ ] Explanation hiển thị: "Your answer was correct!"

**Test Case 2: Câu trả lời SAI (câu 9-15)**
- [ ] Chuyển đến câu 10
- [ ] Có 1 ô màu ĐỎ (border-red-600, bg-red-100) với "✗ Your answer"
- [ ] Có 1 ô màu XANH LÁ (border-green-600, bg-green-100) với "✓ Correct"
- [ ] Explanation hiển thị: "You selected X, which is incorrect."

**Test Case 3: Câu BỎ TRỐNG (câu 16-20)**
- [ ] Chuyển đến câu 18
- [ ] Chỉ có 1 ô màu XANH LÁ với "✓ Correct"
- [ ] Không có ô màu ĐỎ
- [ ] Explanation hiển thị: "You did not answer this question."

### ✅ Tiêu chí 3: Tương tác Read-only

- [ ] Click vào bất kỳ option nào → KHÔNG có phản ứng
- [ ] Cursor không đổi thành pointer (vẫn là default)
- [ ] Không thể thay đổi lựa chọn

### ✅ Tiêu chí 4: Điều hướng

**Previous/Next Buttons:**
- [ ] Click "Next" → Chuyển sang câu 2
- [ ] Click "Next" nhiều lần → Chuyển tuần tự
- [ ] Click "Previous" → Quay lại câu trước
- [ ] Ở câu 1, "Previous" disabled
- [ ] Ở câu 20, "Next" disabled

**Question Navigator:**
- [ ] Click số "5" → Nhảy đến câu 5
- [ ] Click số "15" → Nhảy đến câu 15
- [ ] Navigator highlight đúng câu hiện tại

**State Update:**
- [ ] Màu sắc options UPDATE đúng khi chuyển câu
- [ ] Explanation UPDATE đúng khi chuyển câu
- [ ] Question text UPDATE đúng
- [ ] Không bị lag hoặc giật

## Bước 4: Kiểm Tra Responsive

- [ ] Màu sắc rõ ràng, dễ phân biệt đúng/sai
- [ ] Text không bị cắt hoặc overflow
- [ ] Explanation box dễ đọc với border-left màu xanh
- [ ] Layout ổn định khi chuyển câu

## Bước 5: Kiểm Tra Back to History

- [ ] Click "Back to History" button
- [ ] Redirect về `/history`
- [ ] History page hiển thị attempt vừa xem
- [ ] Có thể click "View Details" để quay lại review

---

## 📊 Kết quả Mong đợi

Sau khi hoàn thành tất cả checklist:

✅ **Tiêu chí 1** - Fetch dữ liệu: PASS  
✅ **Tiêu chí 2** - Logic màu sắc: PASS  
✅ **Tiêu chí 3** - Tương tác read-only: PASS  
✅ **Tiêu chí 4** - Điều hướng: PASS  

## 🐛 Troubleshooting

**Lỗi: "Không tìm thấy questions"**
→ Chạy `docs/insert-sample-questions.sql` trong Supabase SQL Editor

**Lỗi: "Could not find column"**
→ Check schema attempts table có đủ columns: exam_id, answers_data, score, time_spent_seconds

**Màu sắc không hiển thị**
→ Verify Tailwind classes: border-green-600, bg-green-100, border-red-600, bg-red-100

**Navigation không hoạt động**
→ Check console errors, verify useState currentQuestionIndex
