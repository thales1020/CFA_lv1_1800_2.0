# NGHIỆM THU TASK 5: HIGHLIGHT & REVIEW GRID

## ✅ Checklist Kiểm tra

### 1. Tính năng Highlight Text

#### Test Case 1: Highlight văn bản
**Steps:**
1. Mở http://localhost:3000/exam/demo
2. Bôi đen một đoạn text trong question content (gray box)
3. ✅ **Expected:** Đoạn text chuyển sang nền vàng `#F1D176` ngay lập tức

#### Test Case 2: Reset highlight khi chuyển câu
**Steps:**
1. Highlight một đoạn text ở câu 1
2. Click "Next >" → Sang câu 2
3. Click "< Back" → Về câu 1
4. ✅ **Expected:** Highlight đã biến mất (reset khi chuyển câu)

#### Test Case 3: Phạm vi highlight
**Steps:**
1. Thử bôi đen text ở TopBar
2. Thử bôi đen text ở OptionItem
3. Thử bôi đen text ở Sidebar numbers
4. ✅ **Expected:** KHÔNG highlight được (chỉ trong question content area)

#### Test Case 4: Multiple highlights
**Steps:**
1. Highlight đoạn 1: "risk and return"
2. Highlight đoạn 2: "investment portfolio"
3. ✅ **Expected:** Cả 2 đoạn đều có nền vàng

---

### 2. Review Grid Modal

#### Test Case 5: Hiển thị đúng số câu hỏi
**Steps:**
1. Click 📋 button (bottom bar)
2. Review Overlay mở ra
3. ✅ **Expected:** Hiển thị 20 ô số (q1-q20) trong grid

#### Test Case 6: Navigation từ Grid
**Steps:**
1. Đang ở câu 1
2. Click 📋 → Mở overlay
3. Click ô số "15" trong grid
4. ✅ **Expected:** 
   - Main area chuyển sang câu 15
   - Overlay tự động đóng

#### Test Case 7: Trạng thái Attempted (Answered)
**Steps:**
1. Chọn đáp án B cho câu 3
2. Click 📋 → Mở overlay
3. ✅ **Expected:** Ô số 3 có màu nền `#4D4C4D` (gray dark), chữ trắng

#### Test Case 8: Trạng thái Flagged
**Steps:**
1. Đang ở câu 5
2. Click 🚩 button (bottom bar)
3. Click 📋 → Mở overlay
4. ✅ **Expected:** Ô số 5 có CSS triangle màu vàng `#F1D176` ở góc trên trái

#### Test Case 9: Trạng thái Current
**Steps:**
1. Navigate đến câu 7
2. Click 📋 → Mở overlay
3. ✅ **Expected:** Ô số 7 có màu nền xanh lá `#749B44`

#### Test Case 10: Filter "Attempted"
**Steps:**
1. Chọn đáp án cho câu 1, 5, 10
2. Click 📋 → Mở overlay
3. Click button "Attempted (3)"
4. ✅ **Expected:** Chỉ hiển thị 3 ô: 1, 5, 10

#### Test Case 11: Filter "Flagged"
**Steps:**
1. Flag câu 2, 8, 15
2. Click 📋 → Mở overlay
3. Click button "Flagged (3)"
4. ✅ **Expected:** Chỉ hiển thị 3 ô: 2, 8, 15 (có triangle vàng)

#### Test Case 12: Clear Filter
**Steps:**
1. Đang ở filter "Attempted"
2. Click "✕ Clear" button (bottom right)
3. ✅ **Expected:** Quay về "All", hiện đủ 20 ô

#### Test Case 13: Close Overlay
**Steps:**
1. Mở overlay
2. Click backdrop (vùng tối bên ngoài)
3. ✅ **Expected:** Overlay đóng
4. Click ✕ button (top right)
5. ✅ **Expected:** Overlay đóng

---

## 🎯 Demo Scenarios

### Scenario A: Complete Workflow
1. Start exam → Câu 1
2. Highlight text: "risk and return" → Nền vàng ✅
3. Select answer B → Border xanh ✅
4. Right-click option A → Line-through ✅
5. Click 🚩 → Flagged ✅
6. Click Next → Câu 2 (highlight câu 1 đã mất) ✅
7. Click 📋 → Review grid:
   - Câu 1: Gray (#4D4C4D) với triangle vàng ✅
   - Câu 2: Green (#749B44) - current ✅
   - Các câu khác: White ✅
8. Click số 10 → Navigate + overlay đóng ✅

### Scenario B: Filter Testing
1. Làm câu 1, 3, 5, 7, 9 (answer + flag)
2. Làm câu 2, 4, 6 (chỉ answer)
3. Flag câu 10, 12 (không answer)
4. Mở Review Grid:
   - All: 20 ô
   - Attempted (8): 1,2,3,4,5,6,7,9
   - Flagged (7): 1,3,5,7,9,10,12
5. Click Attempted → 8 ô
6. Click Flagged → 7 ô (các ô có triangle)
7. Clear → 20 ô

---

## 📊 Visual Indicators

| State | Background | Text Color | Border | Special |
|-------|-----------|------------|--------|---------|
| **Current** | `#749B44` (Green) | White | - | - |
| **Answered** | `#4D4C4D` (Dark Gray) | White | - | - |
| **Unanswered** | White | `#4D4C4D` | `border-[#4D4C4D]` | - |
| **Flagged** | (inherit above) | (inherit above) | - | Yellow triangle |
| **Current + Flagged** | Green | White | - | Yellow triangle |

---

## 🐛 Common Issues & Fixes

### Issue 1: Không highlight được
- **Check:** QuestionArea có `select-text` class?
- **Check:** handleMouseUp có chạy không? (console.log)
- **Check:** Range có nằm trong questionContentRef không?

### Issue 2: Highlight không reset
- **Check:** useEffect dependency có `currentQuestionIndex`?
- **Check:** Logic reset text có chạy không?

### Issue 3: Grid không hiển thị đúng màu
- **Check:** Store có `answers`, `flags` data?
- **Check:** Logic conditional CSS đúng không?
- **Check:** `isAnswered = !!answers[question.id]`

### Issue 4: Click grid không navigate
- **Check:** `navigateQuestion` action có được gọi?
- **Check:** `onClose` có được gọi?
- **Check:** actualIndex có đúng không?

---

## ⚡ Performance Notes

- Highlight: Local DOM manipulation (không lưu store) → Nhẹ
- Reset khi chuyển câu: Đảm bảo DOM sạch
- Review Grid: Only render filtered questions → Tối ưu
- Session Storage: Auto persist answers/flags/strikethroughs

---

## 🎯 Final Checklist

- [ ] 20 mock questions loaded
- [ ] Highlight text → Yellow background
- [ ] Highlight reset on question change
- [ ] Cannot highlight outside question area
- [ ] Review grid shows all questions
- [ ] Click number → Navigate + close
- [ ] Answered → Gray background
- [ ] Flagged → Yellow triangle
- [ ] Current → Green background
- [ ] Filter "All" works
- [ ] Filter "Attempted" works
- [ ] Filter "Flagged" works
- [ ] Clear filter works
- [ ] Close on backdrop click
- [ ] Close on X button
- [ ] Timer counts down
- [ ] Progress updates
- [ ] F5 persistence works

**All tests passed → TASK 5 COMPLETE ✅**
