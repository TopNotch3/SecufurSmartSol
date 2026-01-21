import Link from 'next/link';
import { ArrowRight, ShoppingBag, Store } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-hidden">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center">

        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Secufur Smart Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            Connecting premium power solutions with a vibrant marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* Buyer Card */}
          <Link
            href="/buyer"
            className="group relative p-1 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-500 hover:to-purple-600 transition-all duration-500"
          >
            <div className="bg-gray-950 rounded-[22px] p-8 h-full flex flex-col items-center text-center group-hover:bg-gray-900/90 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all duration-500 shadow-xl shadow-black/20">
                <ShoppingBag size={40} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
              </div>

              <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Start Shopping</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Explore our extensive collection of batteries, electronics, and custom solutions tailored for your needs.
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                Enter Store <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Seller Card */}
          <Link
            href="/seller"
            className="group relative p-1 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-500 hover:to-pink-600 transition-all duration-500"
          >
            <div className="bg-gray-950 rounded-[22px] p-8 h-full flex flex-col items-center text-center group-hover:bg-gray-900/90 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-all duration-500 shadow-xl shadow-black/20">
                <Store size={40} className="text-gray-300 group-hover:text-purple-400 transition-colors" />
              </div>

              <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Become a Seller</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Join our marketplace, manage your products, track orders, and grow your business with our powerful tools.
              </p>

              <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
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
