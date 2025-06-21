export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold md:text-5xl mb-4">
          Slide Sync Clean
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-8">
          Turn your slides into perfectly synced videos — clean, fast, and easy.
        </p>
        <a
          href="/upload"
          className="inline-block px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
        >
          Upload a Slide
        </a>
        <p className="text-sm text-gray-400 mt-10">
          © 2025 Slide Sync Clean
        </p>
      </div>
    </main>
  );
}






