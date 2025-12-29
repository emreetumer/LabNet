# 🧬 LabNet - İmmünoglobulin Test Değerlendirme Uygulaması

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Tıbbi laboratuvar test sonuçlarını yaş gruplarına göre değerlendiren mobil uygulama**

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [Mimari](#-proje-mimarisi) • [Katkıda Bulunma](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Proje Mimarisi](#-proje-mimarisi)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Firebase Yapılandırması](#-firebase-yapılandırması)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🔬 Hakkında

**LabNet**, çocuklar için immünoglobulin (IgA, IgM, IgG ve alt grupları) test sonuçlarını yaş gruplarına göre değerlendiren, Firebase tabanlı bir mobil sağlık uygulamasıdır. 

Uygulama, laboratuvar test sonuçlarını referans değerlerle karşılaştırarak sonuçların **Normal**, **Düşük** veya **Yüksek** olduğunu gösterir ve kullanıcıların geçmiş test kayıtlarını takip etmelerini sağlar.

### 🎯 Uygulama Kapsamı

- **Kullanıcı Yönetimi**: Admin ve standart kullanıcı rolleri
- **Test Değerlendirme**: Yaş gruplarına göre otomatik analiz
- **Geçmiş Takibi**: Önceki test sonuçlarıyla karşılaştırma
- **Veri Güvenliği**: Firebase Authentication ile güvenli oturum yönetimi
- **Referans Kılavuzları**: Bilimsel kaynaklara dayalı referans değerleri

---

## ✨ Özellikler

### 👤 Kullanıcı Özellikleri

- ✅ **Giriş Yapma ve Kayıt Olma** - Firebase Authentication ile güvenli kimlik doğrulama
- 📊 **Test Sonucu Girişi** - TC Kimlik No ve yaş bilgisi ile test değerlerini kaydetme
- 📈 **Sonuç Analizi** - Referans değerlere göre otomatik değerlendirme (Normal/Düşük/Yüksek)
- 📝 **Geçmiş Görüntüleme** - Önceki test kayıtlarını listeleme ve detaylı inceleme
- 🔄 **Test Karşılaştırma** - En son iki test sonucunu karşılaştırma
- 🏠 **Bilgilendirme Ekranı** - İmmünoglobulin türleri hakkında eğitici içerik
- ⚙️ **Profil Yönetimi** - Kullanıcı bilgilerini görüntüleme ve çıkış yapma

### 👨‍💼 Admin Özellikleri

- 📋 **Kullanıcı Listesi** - Tüm kayıtlı kullanıcıları görüntüleme
- 🗂️ **Kullanıcı Testleri** - Belirli bir kullanıcının tüm test kayıtlarını görüntüleme
- 🧪 **Hızlı Test Girişi** - Seçili kullanıcı için hızlı test kaydı oluşturma
- 📖 **Referans Kılavuzları** - Test kılavuzlarını görüntüleme
- ➕ **Kılavuz Oluşturma** - Yeni referans kılavuzları ekleme

---

## 🛠️ Teknolojiler

### Frontend
- **React Native** `0.76.5` - Mobil uygulama geliştirme framework'ü
- **Expo** `~52.0.20` - React Native geliştirme platformu
- **React Navigation** `7.x` - Ekranlar arası navigasyon
  - Stack Navigator - Sayfa geçişleri
  - Bottom Tabs Navigator - Alt menü navigasyonu

### Backend & Database
- **Firebase Authentication** - Kullanıcı kimlik doğrulama
- **Firebase Firestore** - NoSQL veritabanı (test kayıtları ve kullanıcı verileri)

### UI/UX
- **React Native Vector Icons** - İkon kütüphanesi
- **React Native Chart Kit** - Grafik ve görselleştirme
- **Victory Native** - İleri düzey veri görselleştirme

### Diğer Kütüphaneler
- **React Native Gesture Handler** - Dokunmatik etkileşimler
- **React Native Reanimated** - Performanslı animasyonlar
- **React Native SVG** - SVG grafik desteği

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** (v16 veya üzeri)
- **npm** veya **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** uygulaması (iOS/Android cihazınızda)

### Adım Adım Kurulum

1. **Projeyi Klonlayın**
   ```bash
   git clone https://github.com/emreetumer/LabNet.git
   cd LabNet
   ```

2. **Bağımlılıkları Yükleyin**
   ```bash
   npm install
   # veya
   yarn install
   ```

3. **Firebase Yapılandırması**
   
   `firebaseConfig.example.js` dosyasını `firebaseConfig.js` olarak kopyalayın:
   ```bash
   cp firebaseConfig.example.js firebaseConfig.js
   ```
   
   Ardından `firebaseConfig.js` dosyasını kendi Firebase proje bilgilerinizle güncelleyin:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Uygulamayı Başlatın**
   ```bash
   npm start
   # veya
   expo start
   ```

5. **Cihazınızda Çalıştırın**
   - iOS: Expo Go uygulamasında QR kodu tarayın
   - Android: Expo Go uygulamasında QR kodu tarayın
   - Web: Tarayıcıda otomatik açılacaktır

---

## 📱 Kullanım

### İlk Kullanım

1. **Kayıt Olma**
   - Uygulamayı açın
   - "Kayıt Ol" butonuna tıklayın
   - Kullanıcı bilgilerinizi ve TC Kimlik No'nuzu girin
   - Rol seçimi yapın (User/Admin)

2. **Giriş Yapma**
   - E-posta ve şifreniz ile giriş yapın
   - Rolünüze göre ilgili ekrana yönlendirileceksiniz

### Test Sonucu Girişi

1. "Test Sonuçlarım" sekmesine gidin
2. TC Kimlik No ve yaş (ay) bilgisini girin
3. Test değerlerini (IgA, IgM, IgG, vb.) girin
4. "Sonuçları Değerlendir" butonuna tıklayın
5. Sonuçlar otomatik olarak analiz edilecektir:
   - 🔵 **Mavi**: Normal değer
   - 🔴 **Kırmızı**: Düşük değer
   - 🟢 **Yeşil**: Yüksek değer

### Admin İşlemleri

1. **Kullanıcıları Görüntüleme**
   - "Kullanıcılar" sekmesinden tüm kayıtlı kullanıcıları görüntüleyin

2. **Kullanıcı Testlerini İnceleme**
   - Bir kullanıcıya tıklayın
   - Tüm test geçmişini görüntüleyin

3. **Kılavuz Oluşturma**
   - "Kılavuz Oluştur" sekmesinden yeni referans değerleri ekleyin

---

## 📐 Proje Mimarisi

```
LabNet/
│
├── 📱 App.js                       # Ana uygulama dosyası ve navigasyon yapısı
├── 🔧 index.js                     # Uygulama giriş noktası
├── ⚙️ app.json                     # Expo yapılandırması
├── 📊 klavuzVerileri.json          # Referans değerleri JSON dosyası
├── 🔥 firebaseConfig.js            # Firebase yapılandırması (git'te yok)
├── 📝 firebaseConfig.example.js   # Firebase yapılandırma şablonu
│
├── 📂 screens/                     # Tüm ekran bileşenleri
│   ├── LoginScreen.js             # Giriş ekranı
│   ├── SignupScreen.js            # Kayıt ekranı
│   ├── HomeScreen.js              # Ana sayfa / Bilgilendirme
│   ├── TestScreen.js              # Test sonucu giriş ve değerlendirme
│   ├── FastTestScreen.js          # Admin için hızlı test girişi
│   ├── UserTestsScreen.js         # Kullanıcının test geçmişi
│   ├── UserSettingsScreen.js      # Kullanıcı ayarları ve profil
│   ├── AdminScreen.js             # Admin ana ekranı
│   ├── UsersScreen.js             # Tüm kullanıcılar listesi (Admin)
│   ├── GuideScreen.js             # Referans kılavuzları görüntüleme
│   └── CreateGuideScreen.js       # Yeni kılavuz oluşturma (Admin)
│
├── 📂 navigators/                  # Navigasyon yapılandırmaları
│   ├── UserTabNavigator.js        # Kullanıcı için alt menü
│   ├── AdminTabNavigator.js       # Admin için alt menü
│   └── AdminStackNavigator.js     # Admin için stack navigasyon
│
└── 📂 assets/                      # Görsel ve medya dosyaları
    ├── icon.png
    ├── splash-icon.png
    ├── adaptive-icon.png
    └── favicon.png
```

### Veri Modeli

#### Firestore Koleksiyonları

**users** koleksiyonu:
```javascript
{
  uid: "kullanıcı_id",
  email: "ornek@email.com",
  tcKimlikNo: "12345678901",
  role: "user" | "admin",
  createdAt: Timestamp
}
```

**testResults** koleksiyonu:
```javascript
{
  userId: "kullanıcı_id",
  tcKimlikNo: "12345678901",
  ayBilgisi: 24,
  testDate: Timestamp,
  testValues: {
    IgA: { value: 45.5, result: "Normal", referenceRange: "23-130" },
    IgM: { value: 98.3, result: "Normal", referenceRange: "25.6-201" },
    IgG: { value: 750, result: "Normal", referenceRange: "492-1190" },
    // ... diğer değerler
  }
}
```

---

## 🔐 Firebase Yapılandırması

### Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" butonuna tıklayın
3. Proje adını girin ve oluşturun

### Authentication Kurulumu

1. Firebase Console'da "Authentication" bölümüne gidin
2. "Get Started" butonuna tıklayın
3. "Email/Password" seçeneğini etkinleştirin

### Firestore Database Kurulumu

1. Firebase Console'da "Firestore Database" bölümüne gidin
2. "Create database" butonuna tıklayın
3. "Start in test mode" seçeneğini seçin (geliştirme için)
4. Konum seçin ve oluşturun

### Web Uygulaması Ekleme

1. Firebase Console'da proje ayarlarına gidin
2. "Add app" butonuna tıklayın ve "Web" seçin
3. Uygulama adını girin
4. Firebase yapılandırma kodunu kopyalayın
5. `firebaseConfig.js` dosyasına yapıştırın

### Güvenlik Kuralları (Production için)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /testResults/{testId} {
      allow read, write: if request.auth != null;
      allow read: if request.auth.token.role == "admin";
    }
  }
}
```

## 🧪 Test Değerlendirme Mantığı

Uygulama, girilen yaş bilgisine (ay cinsinden) göre uygun yaş grubunu belirler ve test değerlerini referans aralıklarıyla karşılaştırır:

```javascript
// Örnek: IgA testi için 24 aylık çocuk
ayBilgisi: 24 (ay)
yaşAralığı: "25-36" ay grubundan önceki "13-24" ay grubu
IgA değeri: 15 g/L
Referans aralığı: 11.5 - 94.3 g/L
Sonuç: Normal ✓
```

### Değerlendirme Kriterleri

- **Normal**: Değer, referans aralığı içinde
- **Düşük**: Değer, minimum referans değerinin altında
- **Yüksek**: Değer, maksimum referans değerinin üstünde

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen aşağıdaki adımları izleyin:

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

### Geliştirme Kuralları

- Kod standartlarına uyun
- Anlamlı commit mesajları yazın
- Her yeni özellik için testler ekleyin
- Dokümantasyonu güncelleyin


---

## 👨‍💻 Geliştirici

**Emre**  
Mobil Uygulama Geliştirme Dersi Projesi

---

## 🙏 Teşekkürler

- React Native ve Expo topluluğuna
- Firebase ekibine
- Tüm açık kaynak katkıda bulunanlara

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

</div> 
