import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col justify-between px-4">
      <section className="max-w-4xl text-center mx-auto py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Slide Sync Clean
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Upload and clean your slide images effortlessly. Convert cluttered lecture slides into clean, professional ones in seconds.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/upload"
            className="bg-black text-white px-6 py-3 rounded-xl text-lg hover:bg-gray-800 transition"
          >
            Try It Now
          </Link>
          <Link
            href="#features"
            className="border border-gray-300 text-gray-800 px-6 py-3 rounded-xl text-lg hover:bg-gray-100 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section id="features" className="w-full max-w-4xl mx-auto py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">Features</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left px-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Slide Cleanup</h3>
            <p className="text-gray-600">
              Automatically remove background clutter and highlight main content.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Fast Uploads</h3>
            <p className="text-gray-600">
              Upload multiple slides at once with quick processing time.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
            <p className="text-gray-600">
              Download clean images or PDFs ready to share or print.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8">
        © 2025 Slide Sync Clean. All rights reserved.
      </footer>
    </main>
  );
}




