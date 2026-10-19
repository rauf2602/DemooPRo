# BronUz — Mehmonxona bron qilish (demo)

Oddiy, o‘quv/demo maqsadida yaratilgan bron qilish loyihasi.
Faqat **HTML + CSS + JavaScript** — hech qanday kutubxona yoki server kerak emas.

## Ishga tushirish

`index.html` faylini brauzerda ochish kifoya (ikki marta bosish).

## Imkoniyatlar

- Sanani (kelish/ketish) va mehmonlar sonini tanlash
- Kechalar soni va jami narxni avtomatik hisoblash
- Xonani tanlab, ism/telefon/email bilan bron qilish
- Bron tasdiqlangach bron raqami (masalan `BR-4K2P9Q`) beriladi
- «Mening bronlarim» bo‘limida bronlar ro‘yxati va bekor qilish
- Bitta xona bir sanada ikki marta bron qilinmaydi (band xona belgilanadi)
- Ma’lumotlar `localStorage` da saqlanadi — sahifa yangilansa ham qoladi

## Fayllar

| Fayl | Vazifasi |
|------|----------|
| `index.html` | Sahifa tuzilishi (header, qidiruv, xonalar, bronlar, modal) |
| `style.css` | Dizayn va moslashuvchan (responsive) uslublar |
| `app.js` | Xona ma’lumotlari va barcha bron logikasi |

## Nimani o‘zgartirish mumkin

- **Xonalar / narxlar** — `app.js` faylining boshidagi `ROOMS` massivi.
- **Ranglar** — `style.css` dagi `:root` o‘zgaruvchilari.
- **Valyuta ko‘rinishi** — `money()` funksiyasi (`Intl.NumberFormat('ru-RU')`).

## Eslatma

Bu demo: to‘lov tizimi, server yoki haqiqiy ma’lumotlar bazasi yo‘q.
Haqiqiy loyihada bronlarni serverga yuborish (masalan REST API) kerak bo‘ladi.
