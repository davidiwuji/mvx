import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Boxo',
  description: 'Boxo privacy policy, disclaimer, and content rights information.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-3">Disclaimer</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-white">Boxo does not host, store, upload, or manage any video content, movies, TV series, or copyrighted material.</strong>
          </p>
          <p>
            All video content displayed on this website is embedded from third-party services that are publicly accessible on the internet. 
            We do not have any control over the content, availability, or quality of these third-party services.
          </p>
          <p>
            <strong className="text-white">All trademarks, copyrights, and intellectual property rights</strong> for the movies, TV shows, 
            and other media content belong to their respective owners. Boxo does not claim any ownership or rights to any of the 
            content displayed on this website.
          </p>
          <p>
            Boxo functions solely as a search engine and directory of links to content hosted by third-party servers. 
            We do not endorse, promote, or encourage any form of copyright infringement.
          </p>
          <p>
            If you are a copyright owner and believe that any content on this website infringes upon your rights, 
            please contact us and we will promptly remove the relevant links.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-3">Content Rights</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 space-y-4 text-sm leading-relaxed">
          <p>
            Boxo aggregates links to video content that is already publicly available on the internet through various 
            third-party embedding services. We do not:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Host any video files on our servers</li>
            <li>Upload any content to third-party services</li>
            <li>Distribute copyrighted material</li>
            <li>Profit from copyrighted content</li>
          </ul>
          <p className="mt-4">
            All content featured on Boxo is the intellectual property of its respective creators, 
            production studios, distributors, and license holders.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-3">DMCA & Copyright Complaints</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 text-sm leading-relaxed space-y-3">
          <p>
            If you are a copyright owner or an agent thereof and believe that any content on Boxo 
            infringes upon your copyrights, please notify us at the contact email below. 
            We will respond expeditiously to remove any content that infringes on your copyrights.
          </p>
          <p>
            When submitting a takedown request, please include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the material that is claimed to be infringing</li>
            <li>Your contact information (email, address, phone number)</li>
            <li>A statement that you have a good faith belief that the use is not authorized</li>
            <li>A statement of accuracy under penalty of perjury</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 text-sm leading-relaxed space-y-3">
          <p>
            Boxo does not require user registration or accounts. We do not collect personal information 
            such as names, email addresses, or payment details.
          </p>
          <p>
            We may collect anonymous usage data through standard web analytics to improve our service, 
            including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pages visited and search queries</li>
            <li>Browser type and device information</li>
            <li>General geographic location (country/city level)</li>
            <li>Referring website URLs</li>
          </ul>
          <p>
            This data is aggregated and anonymized — it cannot be used to identify individual users.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 text-sm leading-relaxed space-y-3">
          <p>
            Boxo embeds video content from third-party services. These services may collect data 
            independently. We recommend reviewing the privacy policies of those services:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>VidSrc</li>
            <li>VidLink</li>
            <li>Embed.su</li>
            <li>2Embed</li>
          </ul>
          <p className="mt-3">
            Boxo is not responsible for the data practices of these third-party services.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 text-sm leading-relaxed">
          <p>For copyright complaints or any questions regarding this policy:</p>
          <p className="mt-2 text-white">Email: dmca@boxo.app</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 text-sm leading-relaxed">
          <p>
            We reserve the right to update this privacy policy at any time. Changes will be posted 
            on this page. Continued use of Boxo after changes constitutes acceptance of the updated policy.
          </p>
          <p className="mt-3 text-gray-500">Last updated: July 2026</p>
        </div>
      </section>
    </div>
  )
}
