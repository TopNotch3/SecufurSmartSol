import Link from 'next/link';
import { ArrowRight, ShoppingBag, Store } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black selection:bg-[#1e3a8a] selection:text-white overflow-hidden">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1e3a8a]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#1e3a8a]/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center">

        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="font-oswald font-bold text-5xl md:text-7xl tracking-tight text-black uppercase">
            Secufur Smart Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
            Premium batteries and electronics for all your power needs. Custom solutions designed for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* Buyer Card */}
          <Link
            href="/buyer"
            className="group relative p-1 rounded-3xl bg-gradient-to-br from-gray-300 to-gray-400 hover:from-[#1e3a8a] hover:to-[#0f1f4d] transition-all duration-500"
          >
            <div className="bg-[#e8eef9] rounded-[22px] p-8 h-full flex flex-col items-center text-center group-hover:bg-[#e8eef9]/90 transition-all duration-500 relative overflow-hidden border-2 border-black">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 to-[#1e3a8a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-20 h-20 bg-white rounded-2xl border-2 border-black flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#1e3a8a] group-hover:border-[#1e3a8a] transition-all duration-500 shadow-xl">
                <ShoppingBag size={40} className="text-black group-hover:text-white transition-colors" />
              </div>

              <h2 className="font-oswald font-bold text-3xl mb-3 text-black uppercase tracking-tight group-hover:text-[#1e3a8a] transition-colors">Start Shopping</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Explore our extensive collection of batteries, electronics, and custom solutions tailored for your needs.
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">
                Enter Store <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Seller Card */}
          <Link
            href="/seller"
            className="group relative p-1 rounded-3xl bg-gradient-to-br from-gray-300 to-gray-400 hover:from-[#1e3a8a] hover:to-[#0f1f4d] transition-all duration-500"
          >
            <div className="bg-[#e8eef9] rounded-[22px] p-8 h-full flex flex-col items-center text-center group-hover:bg-[#e8eef9]/90 transition-all duration-500 relative overflow-hidden border-2 border-black">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 to-[#1e3a8a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-20 h-20 bg-white rounded-2xl border-2 border-black flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#1e3a8a] group-hover:border-[#1e3a8a] transition-all duration-500 shadow-xl">
                <Store size={40} className="text-black group-hover:text-white transition-colors" />
              </div>

              <h2 className="font-oswald font-bold text-3xl mb-3 text-black uppercase tracking-tight group-hover:text-[#1e3a8a] transition-colors">Become a Seller</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Join our marketplace, manage your products, track orders, and grow your business with our powerful tools.
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">
                Access Dashboard <ArrowRight size={16} />
              </div>
            </div>
          </Link>

        </div>

        <footer className="absolute bottom-8 text-center text-gray-600 text-sm">
          Secufur Smart Solutions © {new Date().getFullYear()}
        </footer>

      </main>
    </div>
  );
}
