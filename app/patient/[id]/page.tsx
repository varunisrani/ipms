import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Patient ${id} | IPMS`,
    description: `View photos and details for patient ${id}`,
  };
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Patient Details
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Patient ID: <span className="font-mono font-semibold">{id}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Patient Information
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Patient ID
                </dt>
                <dd className="mt-1 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {id}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Total Photos
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  0
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Storage Used
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  0 MB
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  N/A
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Patient Photos
            </h2>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                <svg
                  className="h-8 w-8 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                No photos available for this patient
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Upload Photos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Photo gallery and management features will be implemented in Phase 2
        </p>
      </div>
    </div>
  );
}
