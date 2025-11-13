export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-center sm:text-left text-xs text-zinc-600 dark:text-zinc-400">
            &copy; {currentYear} <span className="font-semibold text-zinc-900 dark:text-white">IPMS</span> - Integrated Patient Management System. All rights reserved.
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-6">
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors">
              Terms
            </a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
