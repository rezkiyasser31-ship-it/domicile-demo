"use client";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  return (
    <a
      href={getWhatsAppUrl("Hello Domicile")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 end-6 z-50 rounded-full bg-[#25D366] p-4 text-white shadow-lg md:bottom-6"
    >
      WA
    </a>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed bottom-0 start-0 z-50 flex w-full border-t border-sand bg-ivory p-2 md:hidden">
      <button className="flex-1 text-center text-sm font-bold text-charcoal">
        Call
      </button>
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center text-sm font-bold text-brand"
      >
        WhatsApp
      </a>
      <button className="flex-1 text-center text-sm font-bold text-charcoal">
        Directions
      </button>
    </div>
  );
}
