# Environment Setup untuk Food Review Admin

## Cara Setup Environment Variables

1. **Salin template environment**:
   ```bash
   cp env.template .env
   ```

2. **Edit file `.env`** dan isi dengan nilai yang sesuai:
   - `VITE_SUPABASE_URL`: URL dari Supabase project Anda
   - `VITE_SUPABASE_ANON_KEY`: Anon key dari Supabase project Anda

## Environment Variables yang Tersedia

### Supabase Configuration
- `VITE_SUPABASE_URL`: URL endpoint Supabase project
- `VITE_SUPABASE_ANON_KEY`: Public anon key untuk autentikasi

### Application Configuration
- `VITE_APP_ENV`: Environment aplikasi (development/production)
- `VITE_APP_NAME`: Nama aplikasi
- `VITE_APP_VERSION`: Versi aplikasi

### API Configuration
- `VITE_API_BASE_URL`: Base URL untuk API calls

### Debug Configuration
- `VITE_DEBUG`: Mode debug (true/false)

## Cara Mendapatkan Supabase Credentials

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke Settings > API
4. Salin:
   - Project URL sebagai `VITE_SUPABASE_URL`
   - Anon public key sebagai `VITE_SUPABASE_ANON_KEY`

## Catatan Penting

- File `.env` sudah ada di `.gitignore` sehingga tidak akan di-commit
- Jangan pernah commit file yang berisi credentials asli
- Gunakan `env.template` sebagai referensi untuk environment variables yang diperlukan

## Troubleshooting

Jika Anda mendapat error "Missing Supabase environment variables", pastikan:
1. File `.env` ada di root directory
2. Semua variable yang diperlukan sudah diisi
3. Tidak ada spasi ekstra di sekitar nilai variable
4. Restart development server setelah mengubah environment variables
