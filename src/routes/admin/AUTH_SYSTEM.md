# Sistem Autentikasi - Food Blogging Admin

## 🎯 Overview

Sistem autentikasi yang aman dan user-friendly untuk Food Blogging Admin. Sistem ini menggunakan Supabase Auth dengan proteksi halaman yang komprehensif.

## 🔐 Fitur Autentikasi

### 1. **Login System**
- ✅ Halaman login yang responsive dan menarik
- ✅ Validasi form yang robust
- ✅ Error handling yang informatif
- ✅ Auto-redirect jika sudah login
- ✅ Support Enter key untuk submit

### 2. **Security Features**
- ✅ Session management dengan Supabase
- ✅ Protected routes untuk semua halaman admin
- ✅ Automatic logout pada session expire
- ✅ CSRF protection
- ✅ Secure password handling

### 3. **User Experience**
- ✅ Loading states yang smooth
- ✅ Auto-redirect setelah login
- ✅ Remember user session
- ✅ Clean logout process

## 🚀 Cara Penggunaan

### **Login**
1. Buka `/login` atau root `/`
2. Masukkan email dan password
3. Klik "Masuk" atau tekan Enter
4. Otomatis redirect ke admin dashboard

### **Logout**
1. Klik tombol "Logout" di header admin
2. Otomatis redirect ke halaman login
3. Session di-clear secara aman

### **Access Control**
- Semua halaman `/admin/*` diproteksi
- User harus login untuk akses
- Auto-redirect ke login jika tidak authenticated

## 🏗️ Arsitektur Sistem

### **File Structure**
```
src/
├── lib/
│   ├── stores/
│   │   └── authStore.js          # Auth state management
│   └── supabase.js               # Supabase client
├── routes/
│   ├── +page.svelte              # Root redirect
│   ├── login/
│   │   └── +page.svelte          # Login page
│   ├── logout/
│   │   └── +page.svelte          # Logout handler
│   └── admin/
│       ├── +layout.svelte        # Protected admin layout
│       ├── +page.svelte          # Admin redirect
│       └── select-website/
│           └── +page.svelte      # Website selection
└── app.html                      # App initialization
```

### **Data Flow**
```
User Access → Auth Check → Protected Route → Admin Dashboard
     ↓
Login Page → Supabase Auth → Auth Store → Redirect to Admin
     ↓
Admin Layout → Check Auth → Render Content or Redirect
```

## 🔧 Konfigurasi

### **Environment Variables**
```bash
# .env.local
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Supabase Setup**
1. Buat project di Supabase
2. Enable Email Auth di Authentication settings
3. Create user dengan email dan password
4. Set RLS policies untuk security

## 🛡️ Security Measures

### **Route Protection**
- Semua admin routes diproteksi di `+layout.svelte`
- Auth check sebelum render content
- Automatic redirect ke login jika unauthorized

### **Session Management**
- Session disimpan di Supabase
- Auto-refresh token
- Secure logout dengan clear session

### **Data Validation**
- Input validation di login form
- Sanitasi data sebelum submit
- Error handling yang aman

## 📱 UI/UX Features

### **Design Theme**
- Gradient background (orange → red → yellow)
- Modern card design dengan shadow
- Responsive layout untuk semua device
- Smooth animations dan transitions

### **Interactive Elements**
- Hover effects pada buttons
- Loading spinners
- Success/error messages
- Responsive form elements

## 🚨 Troubleshooting

### **Common Issues**

#### 1. **Login Gagal**
- Check email dan password
- Verify Supabase connection
- Check console untuk error details

#### 2. **Redirect Loop**
- Clear browser cache
- Check auth store state
- Verify route protection logic

#### 3. **Session Expired**
- Auto-redirect ke login
- Clear local storage
- Re-authenticate user

### **Debug Steps**
```javascript
// Check auth state
console.log('Auth state:', $isAuthenticated);
console.log('User:', $user);
console.log('Loading:', $isLoading);

// Check Supabase connection
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data, error);
```

## 🔄 Maintenance

### **Regular Tasks**
- Monitor auth logs
- Update dependencies
- Test login/logout flow
- Verify security policies

### **Updates**
- Keep Supabase client updated
- Monitor security advisories
- Test with new browsers
- Performance optimization

## 📚 Related Documentation

- [Content Blocks System](./CONTENT_SYSTEM.md)
- [System Overview](./SYSTEM_OVERVIEW.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Supabase Documentation](https://supabase.com/docs)

## 🆘 Support

Jika mengalami masalah:

1. **Check Console:** Lihat error messages di browser
2. **Verify Auth:** Pastikan user credentials benar
3. **Check Network:** Verify Supabase connection
4. **Review Logs:** Check Supabase auth logs
5. **Test Flow:** Verify login → admin → logout cycle

---

**Note:** Sistem ini dirancang untuk single-user admin dengan security yang optimal. Untuk multi-user, perlu implementasi role-based access control (RBAC).
