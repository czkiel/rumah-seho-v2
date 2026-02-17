// frontend/src/app/admin-portal/page.js
import Link from "next/link";
import Image from "next/image";

export default function AdminLanding() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-stone-900">
      {/* Background Image dengan Overlay Hijau Tua */}
      <div className="absolute inset-0 z-0">
         {/* Ganti src dengan gambar background aesthetic pilihan Anda */}
        <Image 
          src="/images/80f8da21d0201c508517251f4b6d6425.jpg" 
          alt="Background" 
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-emerald-950/90 mix-blend-multiply"></div>
      </div>

      {/* Content Center */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in-up">
        {/* Logo */}
        <div className="w-32 h-32 md:w-40 md:h-40 relative drop-shadow-2xl">
           <Image src="/logo-admin.png" alt="Logo" fill className="object-contain" />
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest font-serif">
                RUMAH SEHO NUSANTARA
            </h1>
            <p className="text-emerald-200/80 tracking-[0.2em] text-sm uppercase">Admin Portal Access</p>
        </div>

        {/* Tombol Login Admin */}
        <Link href="/login" className="group relative px-8 py-3 bg-transparent border border-emerald-400/30 text-emerald-100 font-medium tracking-wide transition-all duration-300 hover:bg-emerald-500 hover:text-emerald-950 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] rounded-sm">
          <span className="relative z-10">MASUK DASHBOARD</span>
        </Link>
      </div>

      <div className="absolute bottom-10 z-10 text-emerald-800/50 text-xs">
        &copy; {new Date().getFullYear()} Rumah Seho Nusantara. Internal Use Only.
      </div>
    </div>
  );
}