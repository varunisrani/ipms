import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Photos | IPMS",
  description: "Upload patient photos to the system",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Upload Patient Photos
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Upload and process patient photos with metadata
        </p>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <svg
              className="h-10 w-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Photo Upload Component
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Upload functionality will be implemented in Phase 2
          </p>
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 dark:border-zinc-700 dark:bg-zinc-900/50">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Features to be implemented:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Drag and drop file upload
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Patient ID and metadata entry
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Image preview and validation
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload progress tracking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
