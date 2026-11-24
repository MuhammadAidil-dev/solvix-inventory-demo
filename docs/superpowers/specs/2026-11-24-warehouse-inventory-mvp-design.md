# MVP Demo Manajemen Stok Gudang

Tanggal: 2026-11-24

## Tujuan

Membuat demo pengelolaan stok untuk satu gudang. Gudang menampung komoditas, seperti beras dan air mineral, serta bahan bangunan. Pengguna dapat mencatat barang dan pergerakan stok, lalu melihat jumlah stok yang selalu mengikuti transaksi.

Demo berjalan di browser. Zustand menjadi sumber data aplikasi. `persist` menyimpan data ke `localStorage` agar data tetap ada setelah halaman dimuat ulang. Tidak ada sinkronisasi antar perangkat atau pengguna.

## Keputusan ruang lingkup

- Satu gudang dan satu alur pengguna. Dashboard langsung terbuka di `/`, tanpa login dalam alur demo.
- Stok dihitung sebagai total per barang. Tidak ada batch atau tanggal kedaluwarsa.
- Setiap barang mempunyai satu satuan dasar dan dapat mempunyai beberapa satuan kemasan dengan rasio konversi tetap.
- Pergerakan stok terdiri dari barang masuk, barang keluar, dan koreksi.
- Data contoh tersedia saat demo pertama dibuka. Pengguna dapat mengembalikan data contoh lewat tombol reset.

## Layar dan alur pengguna

1. **Dashboard (`/`)** menampilkan jumlah jenis barang, barang dengan stok rendah, dan transaksi terbaru.
2. **Barang (`/items`)** menampilkan daftar stok dengan pencarian dan filter kategori. Pengguna dapat menambah dan mengubah data barang.
3. **Transaksi (`/transactions`)** mencatat barang masuk, keluar, atau koreksi. Pengguna memilih barang, jumlah, satuan, tanggal, dan catatan.
4. **Riwayat (`/history`)** menampilkan pergerakan stok. Pengguna dapat mencari dan memfilter menurut barang, jenis transaksi, dan tanggal.

Navigasi utama menghubungkan keempat layar. Jumlah stok dan peringatan stok rendah langsung berubah setelah transaksi berhasil disimpan.

## Data dan perhitungan stok

**Barang** menyimpan ID, kode unik, nama, kategori, satuan dasar, daftar satuan kemasan beserta rasio konversi, dan batas stok minimum dalam satuan dasar. Barang tanpa kemasan tambahan tetap valid. Satuan dasar tidak dapat diubah setelah barang memiliki transaksi. Perubahan rasio konversi hanya berlaku untuk transaksi baru.

**Transaksi** menyimpan ID, ID barang, jenis transaksi, waktu, jumlah dan satuan yang dimasukkan pengguna, jumlah hasil konversi dalam satuan dasar, serta catatan. Koreksi mencatat selisih antara stok saat ini dan jumlah fisik yang dimasukkan pengguna. Stok awal data contoh juga dicatat sebagai transaksi agar asal jumlah stok terlihat di riwayat.

Stok suatu barang adalah jumlah seluruh perubahan stoknya dalam satuan dasar. Barang masuk menambah stok. Barang keluar mengurangi stok. Koreksi menambah atau mengurangi stok sesuai selisih. Total stok dihitung dari transaksi, bukan disimpan sebagai nilai terpisah yang dapat berbeda dari riwayat.

Contoh: satuan dasar air mineral adalah botol, dan 1 dus = 24 botol. Barang masuk 2 dus menambah stok 48 botol. Daftar stok dapat menampilkan jumlah dalam botol dan padanannya dalam dus.

## Aturan validasi

- Kode barang wajib diisi dan unik. Nama, kategori, dan satuan dasar wajib diisi. Batas stok minimum tidak boleh negatif.
- Rasio konversi harus lebih besar dari nol. Satuan kemasan tidak boleh berulang pada barang yang sama.
- Jumlah barang masuk dan keluar harus lebih besar dari nol. Jumlah fisik untuk koreksi boleh nol, tetapi koreksi tanpa perubahan stok ditolak. Hasil konversi harus valid.
- Barang keluar ditolak jika stok tidak cukup. Koreksi tidak boleh menghasilkan stok negatif.
- Kesalahan input tampil di form. Transaksi yang ditolak tidak mengubah data atau riwayat.
- Transaksi yang sudah dicatat tidak diedit atau dihapus pada MVP. Kesalahan stok diperbaiki lewat koreksi agar riwayat tetap jelas.

## Susunan kode

- `app/` berisi route, layout, dan komposisi layar.
- `features/items/` berisi daftar dan form barang.
- `features/inventory/` berisi form transaksi, riwayat, aturan konversi, dan perhitungan stok.
- `features/dashboard/` berisi ringkasan dan peringatan stok rendah.
- `stores/inventory.ts` memegang barang dan transaksi yang dipakai lintas fitur melalui Zustand `persist`.
- `components/ui/` berisi komponen tampilan yang dipakai ulang.

Komponen membaca data lewat selector Zustand. Aturan konversi dan perhitungan stok berada di fungsi terpisah agar dapat dipakai oleh form, daftar stok, dan dashboard. Setiap file kode maksimal 500 baris sesuai `AGENTS.md`. Tampilan menunggu proses pemuatan data `persist` sebelum menampilkan angka stok.

## Data demo

Data awal mencakup contoh komoditas dan bahan bangunan, termasuk beras, air mineral, dan semen. Setiap contoh mempunyai satuan, rasio konversi yang sesuai bila diperlukan, batas minimum, serta transaksi stok awal. Tombol reset menghapus perubahan lokal dan memuat ulang data contoh.

## Di luar MVP

Multi gudang, transfer antar gudang, batch, tanggal kedaluwarsa, pemasok, penerima, pembelian, penjualan, barcode, persetujuan, laporan ekspor, backend, sinkronisasi data, dan hak akses pengguna.

## Kriteria selesai

- Pengguna langsung melihat dashboard dan dapat berpindah ke daftar barang, transaksi, serta riwayat.
- Pengguna dapat menambah barang dengan satuan dasar dan konversi kemasan.
- Barang masuk, keluar, dan koreksi memperbarui stok serta tercatat di riwayat.
- Jumlah dalam kemasan dikonversi dengan benar ke satuan dasar.
- Sistem menolak stok negatif dan menandai barang di bawah batas minimum.
- Data tetap ada setelah halaman dimuat ulang. Reset mengembalikan data contoh.
