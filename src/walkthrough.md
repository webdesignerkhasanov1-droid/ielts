# American School IELTS Mock Portal - Walkthrough (Header Back Button Integration)

Biz foydalanuvchilarning sayt bo'ylab qulay harakatlanishi uchun yuqori boshqaruv panelida (Navbar'da) boshqa standart veb-saytlardek yagona va doimiy **"◀ BOSH SAHIFA / BACK TO HOME"** tugmasini muvaffaqiyatli joriy etdik.

---

## 1. Amalga Oshirilgan Yangilanishlar

- **Navbar'dagi "◀ BOSH SAHIFA" tugmasi (`Navbar.tsx`)**:
  - Istalgan ichki bo'limga (Test kutubxonasi, Lug'at, Admin paneli yoki Natijalar sertifikati sahifasiga) kirilganda, Navbar'ning o'rta qismida static rejim belgisi o'rniga chiroyli **"◀ BOSH SAHIFA / BACK TO HOME"** tugmasi paydo bo'ladi.
  - Tugma **American School** brend ranglarining silliq gradienti (Navy to Green) va hover animatsiyalari bilan bezatilgan.
  - Har qanday joyda ushbu tugma bosilsa, foydalanuvchini zudlik bilan bosh sahifaga (Dashboard'ga) xavfsiz tarzda qaytaradi.

---

## 2. Qanday Sinab Ko'rish Mumkin?
1. Bosh sahifaga kiring: [http://localhost:5173/](http://localhost:5173/)
2. **📚 Test Kutubxonasi** yoki **Moydionov's Vocab** bo'limiga kiring.
3. Yuqori boshqaruv panelida (Navbar'da) yaltiroq ko'k-yashil gradientdagi **`◀ BOSH SAHIFA`** tugmasi chiqadi.
4. Uni bosing va bosh sahifaga oson qayting!

Tizim faol va server ishlamoqda:
👉 [http://localhost:5173/](http://localhost:5173/)
