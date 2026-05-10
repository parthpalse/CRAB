import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlepbbpxpkbegmbqqnrfy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZXBicHhwa2JlZ21icXFucmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzY5NDUsImV4cCI6MjA5MzMxMjk0NX0.VULv7xGrukOYDdtt2fA0cW6uEu_BXIKDyugkr9seVP4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
