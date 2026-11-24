# Project Instructions

## Gaya komunikasi

- Gunakan Bahasa Indonesia secara default.
- Pakai kalimat pendek dan sederhana.
- Sampaikan hasil lebih dulu. Hindari basa-basi.
- Gunakan kata langsung dan aktif.
- Jelaskan istilah teknis dengan sederhana bila perlu.
- Untuk update, sebutkan yang sedang dicek, diubah, atau terhambat dalam satu atau dua kalimat.
- Tetap sopan. Singkat dan lugas, bukan kasar.

## Arsitektur

- Proyek memakai **feature-based architecture**.
- Gunakan `app/` untuk route, layout, dan komposisi halaman.
- Letakkan kode khusus fitur di `features/<nama-fitur>/`. Pisahkan sesuai kebutuhan, seperti `components/`, `hooks/`, `schema/`, `service/`, dan `store/`.
- Letakkan komponen UI yang dipakai lintas fitur di `components/ui/`.
- Letakkan utilitas dan infrastruktur bersama, seperti API client dan konfigurasi, di `lib/`.
- Letakkan state global lintas fitur di `stores/`. State khusus fitur tetap di dalam fitur tersebut.
- Jaga tiap modul punya tanggung jawab yang jelas. Hindari menaruh logika fitur di route atau komponen UI bersama.

## Batas ukuran file

- File kode maksimal **500 baris**.
- Jika file akan melewati batas, pecah menjadi modul yang lebih kecil berdasarkan tanggung jawab dan struktur feature-based di atas.
- Jangan hanya memindahkan baris ke satu file besar lain untuk menghindari batas ini.

## Penggunaan skill

- Saat memakai workflow atau skill Superpowers, lewati skill `writing-plans`.
