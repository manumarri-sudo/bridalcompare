import { Heart, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Heart className="w-16 h-16 mx-auto mb-6 text-vara-rose fill-vara-rose" />
          <h1 className="text-5xl font-display mb-6">About Vara</h1>
          <p className="text-xl text-vara-warmGray">
            Born from wedding chaos, built for every South Asian fashion moment
          </p>
        </div>

        <div className="vara-card p-12 mb-12">
          <h2 className="text-3xl font-display mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-vara-warmGray space-y-6">
            <p className="leading-relaxed">
              While shopping for my sister's wedding, I was completely overwhelmed. Dozens of browser tabs open across Aza, Kynah, Pernia's, Lashkaraa... I kept getting confused about which lehenga was from where, missing price drops, and losing track of the outfits I loved.
            </p>
            <p className="leading-relaxed">
              I'd find the perfect outfit, close the tab by accident, and spend hours trying to find it again. I'd see something beautiful, save it in my notes app with no photo, no price, no context. It was chaos.
            </p>
            <p className="leading-relaxed">
              So I built Vara - a simple way to save, organize, and compare South Asian fashion from every designer in one beautiful place. No more lost tabs, no more confusion, no more missed deals.
            </p>
            <p className="leading-relaxed font-medium text-gray-900">
              Whether you're planning a wedding, shopping for Diwali, or just building your dream wardrobe - I hope this helps. ♥
            </p>
          </div>
        </div>

        <div className="text-center vara-card p-8">
          <h3 className="text-2xl font-display mb-4">Get in Touch</h3>
          <p className="text-vara-warmGray mb-6">
            Questions, feedback, or just want to say hi?
          </p>
          <a 
            href="mailto:hello@vara.style"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-vara-rose to-vara-marigold text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-5 h-5" />
            hello@vara.style
          </a>
        </div>
      </div>
    </div>
  );
}
