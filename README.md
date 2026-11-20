# 🩺 Smart Health Diabetes

**Smart Health Diabetes** adalah sistem *Content Management System* (CMS) dan platform survei interaktif berbasis web yang dirancang untuk memfasilitasi edukasi kesehatan mengenai **Diabetes Melitus Tipe 2**. Sistem ini dikembangkan menggunakan **Laravel 11** dan **MySQL** untuk mendukung penyampaian materi edukatif (E-Modul, Poster, Video) sekaligus mengukur tingkat pemahaman pasien/pengunjung melalui instrumen *Pre-Test* dan *Post-Test*.

---

## ✨ Fitur Utama

### 🌐 Halaman Pengunjung (Public Interface)
* **Halaman Intro & Prolog**: Pengenalan platform edukasi beserta informasi tim penyusun materi, dosen pembimbing, dan pengembang sistem.
* **Kuis Interaktif (Pre-Test & Post-Test)**: Instrumen evaluasi pemahaman pengunjung sebelum dan sesudah mengakses materi edukasi dengan sistem penilaian otomatis.
* **Media Edukasi Interaktif**:
  * **E-Modul Digital**: Daftar buku saku/modul PDF lengkap dengan fitur *built-in PDF Previewer*, navigasi halaman, dan tombol unduh (*Download PDF*).
  * **Galeri Poster**: Tampilan poster edukasi berbasis kartu (*card layout*) lengkap dengan keterangan dan tautan referensi sumber.
  * **Galeri Video**: Pemutar video edukasi terintegrasi beserta referensi sumber informasi.
* **Ruang Diskusi (Comments Section)**: Fitur komentar interaktif bagi pengunjung untuk berdiskusi dan bertanya seputar materi diabetes.

### 🛠️ Panel Administrator (Admin Dashboard)
* **Dashboard & Statistik Real-Time**: Ringkasan jumlah total responden (terdaftar berbasis email maupun anonim) serta metrik partisipasi *Pre-Test* dan *Post-Test* pada halaman Interaktif dan E-Modul.
* **Sistem Scoring & Rekapitulasi Jawaban**:
  * Pemantauan skor otomatis per responden dengan indikator progres visual.
  * Filter data berdasarkan penempatan (*placement*), nama form, dan pencarian email.
  * Rekapitulasi distribusi jawaban per butir soal, serta fitur ekspor/unduh data.
* **Dynamic Form & Quiz Builder**: Pembuatan dan pengelolaan instrumen kuis secara modular (*Section Box* & *Question Box*) dengan pengaturan bobot nilai tiap opsi jawaban, batasan pengisian, serta wajib email.
* **Visual Webpage Builder**: Penyuntingan konten dan gaya tata letak halaman depan secara langsung (*live preview*) mencakup pengaturan *Font Styling*, *Box*, *Border*, *Background*, *Padding*, *Margin*, serta pratinjau responsif (*Mobile, Tablet, Desktop*).
* **Manajemen Konten & Pengguna**: Pengelolaan dokumen E-Modul (PDF), media Poster & Video, moderasi komentar pengunjung, serta manajemen akun administrator.

---

## 💻 Teknologi yang Digunakan

* **Backend Framework**: Laravel 11 (PHP)
* **Frontend & Interactivity**: Blade Template, Livewire, JavaScript, Tailwind CSS / Bootstrap
* **Database**: MySQL
* **Arsitektur & Keamanan**: Autentikasi Admin terproteksi, validasi input berlapis, serta konfirmasi verifikasi ganda (*text-typing validation*) untuk pencegahan penghapusan data secara tidak sengaja.

---
