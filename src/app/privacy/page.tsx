import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Content Rights | MVX',
  description: 'MVX privacy policy, disclaimer, and DMCA content rights information.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-20 text-gray-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full" />
        <h1 className="text-3xl md:text-4xl font-black text-white">Privacy Policy &amp; Disclaimer</h1>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3">Disclaimer</h2>
        <div className="bg-[#121624] border border-white/10 rounded-2xl p-6 space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-white">MVX does not host, store, upload, or manage any video content, movies, TV series, or copyrighted material.</strong>
          </p>
          <p>
            All video content displayed on this website is embedded from third-party services that are publicly accessible on the internet. 
            We do not have any control over the content, availability, or quality of these third-party services.
          </p>
          <p>
            <strong className="text-white">All trademarks, copyrights, and intellectual property rights</strong> for the movies, TV shows, 
            and other media content belong to their respective owners. MVX does not claim any ownership or rights to any of the 
            content displayed on this website.
          </p>
          <p>
            MVX functions solely as a search engine and directory of links to content hosted by third-party servers. 
            We do not endorse, promote, or encourage any form of copyright infringement.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3">Content Rights &amp; DMCA</h2>
        <div className="bg-[#121624] border border-white/10 rounded-2xl p-6 space-y-4 text-sm leading-relaxed">
          <p>
            MVX aggregates links to video content that is already publicly available on the internet through various 
            third-party embedding services. We do not:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Host any video files on our servers</li>
            <li>Upload any content to third-party services</li>
            <li>Distribute copyrighted material</li>
            <li>Charge fees or require payments for stream access</li>
          </ul>
          <p className="mt-4">
            If you are a copyright owner and believe that any content on this website infringes upon your rights, 
            please contact the respective third-party hosting server or contact us to remove the index entry.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-3">Information We Collect</h2>
        <div className="bg-[#121624] border border-white/10 rounded-2xl p-6 text-sm leading-relaxed space-y-3">
          <p>
            MVX does not require user registration or accounts. Watchlist items and watch history are stored entirely 
            client-side inside your browser&apos;s local storage. We do not sell or track personal user identities.
          </p>
        </div>
      </section>
    </div>
  );
}
