// src/app/page.js
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
      {/* --- NAVBAR --- */}
      <nav className="navbar fixed top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100 px-4 lg:px-10 transition-all duration-300">
        <div className="flex-1">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Rumah Seho Logo"
                className="h-12 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-orange-900 tracking-wide group-hover:text-orange-700 transition-colors">
                Rumah Seho
              </span>
              <span className="text-xs text-gray-500 hidden sm:block font-medium">
                Nusantara
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-none gap-3 lg:gap-4 items-center">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/shop"
              className="btn btn-ghost btn-sm text-orange-900 hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200 rounded-full px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Lihat Produk
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="btn btn-ghost btn-sm text-orange-900 hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200 rounded-full px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden sm:inline">Masuk</span>
              <span className="sm:hidden">Login</span>
            </Link>
            <Link
              href="/register"
              className="btn bg-linear-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border-none rounded-full px-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1546258417-640a37db7563?q=80&w=2070&auto=format&fit=crop"
            alt="Sugar Palm Forest"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-orange-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto hero-content flex-col">
          <div className="animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30 text-sm font-semibold tracking-wider mb-4 backdrop-blur-sm">
              ASLI DARI TOMOHON, SULAWESI UTARA
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Manis Alami <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-300 to-amber-500 italic">
                Jantung Nusantara
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Menghadirkan kemurnian gula aren terbaik. Diproses secara
              tradisional dengan standar kualitas modern untuk kesehatan
              keluarga Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/shop"
                className="btn btn-lg bg-orange-600 hover:bg-orange-700 text-white border-none rounded-full px-10 shadow-xl hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300">
                Belanja Sekarang
              </Link>
              <Link
                href="#products"
                className="btn btn-lg btn-outline text-white hover:bg-white/10 border-white rounded-full px-10">
                Pelajari Produk
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* --- VALUE PROPOSITION --- */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
              Kenapa Memilih Rumah Seho?
            </h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Kami tidak hanya menjual gula, kami memberikan kualitas dan
              kepedulian terhadap alam serta petani lokal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="group p-8 bg-orange-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors text-3xl">
                🌿
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Organik & Alami
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tanpa bahan pengawet dan kimia tambahan. Dipanen langsung dari
                pohon Aren liar di hutan Tomohon yang asri.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-orange-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors text-3xl">
                🍯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Kualitas Premium
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Melalui proses penyaringan ganda dan pengolahan higienis untuk
                menghasilkan tekstur halus dan rasa yang konsisten.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-orange-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-100">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors text-3xl">
                🤝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Pemberdayaan Lokal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mendukung ekonomi petani lokal Tomohon. Setiap pembelian Anda
                berkontribusi pada kesejahteraan mereka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section
        id="products"
        className="py-24 px-4 bg-orange-900 text-white relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Keajaiban Alam <br />
                <span className="text-orange-300">Dalam Kemasan</span>
              </h2>
              <p className="text-orange-100 text-lg leading-relaxed">
                Temukan varian produk unggulan kami, mulai dari Gula Aren
                Granule yang praktis hingga Sirup Aren yang kental dan legit.
                Cocok untuk kopi, teh, masakan, hingga baking.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-800 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-orange-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">Seho Granule</h4>
                    <p className="text-orange-200/80">
                      Butiran halus mudah larut, pengganti gula pasir yang lebih
                      sehat.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-800 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-orange-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">Seho Sirup</h4>
                    <p className="text-orange-200/80">
                      Tekstur kental dengan aroma khas, sempurna untuk topping.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="btn btn-lg bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-8">
                  Lihat Semua Produk
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <img
                    src="/seho_granule.jpg"
                    alt="Seho Granule"
                    className="rounded-2xl shadow-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-6 bg-orange-800/50 backdrop-blur-sm rounded-2xl border border-orange-700">
                    <p className="font-bold text-2xl text-orange-300">
                      Glycemic Index Rendah
                    </p>
                    <p className="text-sm text-orange-100 mt-2">
                      Aman untuk penderita diabetes jika dikonsumsi wajar.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-orange-800/50 backdrop-blur-sm rounded-2xl border border-orange-700">
                    <p className="font-bold text-2xl text-orange-300">
                      Rich Flavor
                    </p>
                    <p className="text-sm text-orange-100 mt-2">
                      Menambah cita rasa karamel alami pada setiap hidangan.
                    </p>
                  </div>
                  <img
                    src="/seho_sirop.jpg"
                    alt="Seho Sirup"
                    className="rounded-2xl shadow-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-orange-400 to-red-500"></div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Siap Beralih ke Hidup Lebih Manis?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Dapatkan produk gula aren terbaik langsung dari sumbernya. Pesan
              sekarang dan rasakan bedanya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="btn btn-primary btn-lg rounded-full px-10 text-lg shadow-lg shadow-orange-500/30">
                Mulai Belanja
              </Link>
              <Link
                href="/register"
                className="btn btn-outline btn-lg rounded-full px-10 text-lg border-2">
                Buat Akun
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-auto brightness-200 grayscale"
              />
              <span className="text-xl font-bold text-white uppercase tracking-wider">
                Rumah Seho
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              PT. Rumah Seho Nusantara
              <br />
              Menghadirkan kebaikan alam Tomohon untuk Indonesia dan Dunia.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">
              Tautan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-orange-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-orange-400 transition-colors">
                  Belanja
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-orange-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-orange-400 transition-colors">
                  Masuk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Tomohon, Sulawesi Utara</li>
              <li>support@rumahseho.com</li>
              <li>+62 812 3456 7890</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider">
              Sosial Media
            </h4>
            <div className="flex gap-4">
              {/* Social Icons Placeholders */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.158 5.85 2.756 6.008 6.008.06 1.265.071 1.645.071 4.851 0 3.205-.012 3.584-.072 4.85-.158 3.252-2.756 5.85-6.008 6.008-1.265.06-1.645.071-4.851.071-3.205 0-3.584-.012-4.85-.072-3.252-.158-5.85-2.756-6.008-6.008-.06-1.265-.071-1.645-.071-4.851 0-3.205.012-3.584.072-4.85.158-3.252 2.756-5.85 6.008-6.008 1.265-.06 1.645-.071 4.851-.071zm-2.333 13.765l6.305-3.928-6.305-3.928v7.856z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} PT. Rumah Seho Nusantara. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
