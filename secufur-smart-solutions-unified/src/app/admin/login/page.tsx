import { ShieldCheck, Globe, Lock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen w-full grid md:grid-cols-2">
            {/* Left Branding Section */}
            <div className="bg-[#001f54] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">

                {/* Top Branding */}
                <div className="z-10">
                    <h1 className="text-3xl font-bold tracking-wider italic mb-1">LUVARTE</h1>
                    <p className="text-xs tracking-[0.2em] text-blue-200">SELLER CENTRAL V2.5</p>
                </div>

                {/* Hero Content */}
                <div className="z-10 my-10">
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                        Empowering Indian<br />
                        Merchants with Global<br />
                        Standards.
                    </h2>
                    <p className="text-blue-100/80 mb-8 max-w-md">
                        Secure, Transparent, and RBI Compliant seller platform for your growing business.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/20 rounded-full">
                                <ShieldCheck className="w-5 h-5 text-blue-300" />
                            </div>
                            <span className="text-sm">PCI-DSS v4.0 Compliant</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/20 rounded-full">
                                <Globe className="w-5 h-5 text-blue-300" />
                            </div>
                            <span className="text-sm">GST Ready Invoicing</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/20 rounded-full">
                                <Lock className="w-5 h-5 text-blue-300" />
                            </div>
                            <span className="text-sm">256-bit AES Encryption</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/20 rounded-full">
                                <FileText className="w-5 h-5 text-blue-300" />
                            </div>
                            <span className="text-sm">Automated Compliance</span>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="z-10">
                    <div className="w-12 h-1 bg-blue-800/50 mb-4 rounded-full"></div>
                    <p className="text-xs text-blue-300/60 uppercase tracking-widest font-semibold">Trusted by 12,400+ Sellers</p>
                </div>

                {/* Background Visual Element (Optional subtle gradient or shape) */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none"></div>

            </div>

            {/* Right Login Form Section */}
            <div className="bg-white p-8 md:p-12 lg:p-24 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto space-y-8">

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900">Merchant Portal</h2>
                        <p className="text-slate-500">Access your dashboard with secure credentials.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Merchant Email</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue="admin@luvarte.in"
                                className="bg-slate-50 border-slate-100 focus:border-blue-900 focus:ring-blue-900/20 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                defaultValue="password"
                                className="bg-slate-50 border-slate-100 focus:border-blue-900 focus:ring-blue-900/20 h-12 font-mono tracking-widest"
                            />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Demo Credentials</p>
                            <p className="text-sm font-mono text-slate-600">admin@luvarte.in / admin123</p>
                        </div>

                        <Button className="w-full h-12 bg-[#001f54] hover:bg-[#00153a] text-white font-semibold tracking-wide shadow-lg shadow-blue-900/20">
                            SECURE LOGIN
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <Link href="#" className="text-xs font-bold text-slate-500 hover:text-[#001f54] uppercase tracking-widest transition-colors">
                            Register as new merchant
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
