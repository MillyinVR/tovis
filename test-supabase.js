// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vcqqygqwlppnenirfels.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcXF5Z3F3bHBwbmVuaXJmZWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDIwMTI0NSwiZXhwIjoyMDY5Nzc3MjQ1fQ.orunk9OZOIV8swZxGaArD7VlJKNUITI33UhrVft4NNg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // List buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Available buckets:', buckets);
      
      // Check if licenses-private bucket exists
      const licenseBucket = buckets.find(b => b.name === 'licenses-private');
      if (licenseBucket) {
        console.log('✅ licenses-private bucket found!');
      } else {
        console.log('❌ licenses-private bucket NOT found. Please create it in your Supabase dashboard.');
      }
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
