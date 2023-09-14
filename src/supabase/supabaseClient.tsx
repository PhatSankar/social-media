import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient(
  'https://fyekiokjhakcsmckvyqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZWtpb2tqaGFrY3NtY2t2eXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1OTIyOTcsImV4cCI6MjAxMDE2ODI5N30.smW-2eu6LgFxm0c5hAXQgSd0kDKUOw_fkhE4RliKHig',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
export default supabase;
