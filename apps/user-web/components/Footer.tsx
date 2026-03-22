import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Gajraula Eats
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The fastest premium food delivery platform connecting you to the best local restaurants across a 30km radius.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Discover</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Restaurants</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Cloud Kitchens</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Partner with Us</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Add your Restaurant</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Become a Delivery Partner</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Corporate Accounts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Gajraula Eats. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             {/* Social mock icons */}
             <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-brand-500 hover:text-white transition-colors">
                <span className="text-xs font-bold">In</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-brand-500 hover:text-white transition-colors">
                <span className="text-xs font-bold">Tw</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-brand-500 hover:text-white transition-colors">
                <span className="text-xs font-bold">Fb</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
