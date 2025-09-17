"use client";

export function Footer() {
  return (
    <footer className="py-6 md:py-0 bg-transparent">
      <div className="w-full flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:px-6">
        <div className="flex items-center gap-4 text-sm">
          <p className="text-sm text-shark-gray-400">
            &copy; {new Date().getFullYear()} Nido. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
