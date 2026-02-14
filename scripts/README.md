# Scripts Documentation

## 1. Setup

### Install Dependencies
```bash
npm install dotenv @supabase/supabase-js ts-node typescript @types/node --save-dev
```

### Configure Environment
Create `.env` file in project root:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 2. Seed Database

### Option A: Seed Specific Exam (Recommended)
```bash
# Syntax
npx ts-node --project tsconfig.scripts.json scripts/seed-exam.ts "<title>" <questions_file> <answers_file> [duration] [total]

# Examples
npx ts-node --project tsconfig.scripts.json scripts/seed-exam.ts "MOCK 1 SESSION 1" mock1_sec1_ques.txt mock1_sec1_ans.txt
npx ts-node --project tsconfig.scripts.json scripts/seed-exam.ts "MOCK 1 SESSION 2" mock1_sec2_ques.txt mock1_sec2_ans.txt 135 90
```

### Option B: Seed Default Exam (Session 1)
```bash
npx ts-node --project tsconfig.scripts.json scripts/seed.ts
```

### Expected Output
```
🚀 Starting seed for: MOCK 1 SESSION 1
   Questions: mock1_sec1_ques.txt
   Answers: mock1_sec1_ans.txt

✅ Exam created with ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
📝 Parsed 90 questions
✅ Successfully inserted 90 questions
```

## 3. Verify Results

### Run Verification Script
```bash
npx ts-node --project tsconfig.scripts.json scripts/verify-seed.ts
```

### Verification Checklist (DoD)

✅ **Execution & Configuration**
- Script runs without syntax or module errors
- Reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `.env`

✅ **Exams Table**
- 1 record with title = "MOCK 1 SESSION 1"
- duration_minutes = 135
- total_questions = 90

✅ **Questions Table**
- Exactly 90 records inserted
- All records have matching exam_id
- question_text clean (no "1/ Q." prefix)
- option_a/b/c clean (no "A. ", "B. ", "C. " prefix)
- correct_option = single char 'A', 'B', or 'C'
- explanation = full text without truncation

## 4. Delete Exam

### List All Exams
```bash
npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts --list
```

### Delete by ID
```bash
npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts <exam_id>
```

### Delete by Title
```bash
npx ts-node --project tsconfig.scripts.json scripts/delete-exam.ts "MOCK 1 SESSION 1"
```

**Note:** Deleting an exam will also delete all its questions (CASCADE).

## 5. Troubleshooting

### Module Not Found
```bash
npm install
```

### Environment Variables Not Loaded
- Check `.env` file exists in project root
- Verify no typos in variable names
- Restart terminal after creating `.env`

### Database Errors
- Verify Supabase credentials
- Check RLS policies (use service role key)
- Ensure tables exist (run schema.sql)
