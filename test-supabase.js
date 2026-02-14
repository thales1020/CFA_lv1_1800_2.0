const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Kiểm tra cấu hình Supabase...\n');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING');
console.log('');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Thiếu biến môi trường Supabase!');
  process.exit(1);
}

// Check anon key format
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.warn('⚠️  Anon key không đúng định dạng JWT (phải bắt đầu bằng "eyJ")');
  console.warn('   Key hiện tại có vẻ là placeholder, không phải key thực.');
  console.log('');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔄 Đang kiểm tra kết nối...\n');
    
    // Try to query the database
    const { data, error } = await supabase
      .from('questions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Lỗi kết nối:', error.message);
      console.error('Chi tiết:', error);
      return false;
    }
    
    console.log('✅ Kết nối Supabase thành công!');
    console.log('Database có thể truy cập được.');
    return true;
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    return false;
  }
}

testConnection().then((success) => {
  process.exit(success ? 0 : 1);
});
