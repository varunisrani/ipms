"use client";

import { CheckCircle2, XCircle, Loader2, FileText } from "lucide-react";
import Progress from "@/components/ui/progress";

export interface UploadProgressItem {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface UploadProgressProps {
  items: UploadProgressItem[];
}

export default function UploadProgress({ items }: UploadProgressProps) {
  if (items.length === 0) {
    return null;
  }

  const getStatusIcon = (status: UploadProgressItem["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (item: UploadProgressItem) => {
    switch (item.status) {
      case "success":
        return "Uploaded";
      case "error":
        return item.error || "Failed";
      case "uploading":
        return `Uploading... ${item.progress}%`;
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: UploadProgressItem["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "uploading":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  const totalFiles = items.length;
  const completedFiles = items.filter(
    (item) => item.status === "success" || item.status === "error"
  ).length;
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  return (
    <div className="w-full space-y-4">
      {/* Overall Progress */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Upload Progress</h3>
          <span className="text-sm text-gray-600">
            {completedFiles} / {totalFiles} files
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Individual File Progress */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="flex-shrink-0 pt-0.5">{getStatusIcon(item.status)}</div>

              {/* File Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="truncate text-sm font-medium text-gray-900"
                    title={item.fileName}
                  >
                    {item.fileName}
                  </p>
                  <span
                    className={`flex-shrink-0 text-xs font-medium ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusText(item)}
                  </span>
                </div>

                {/* Progress Bar (only show during upload) */}
                {item.status === "uploading" && (
                  <div className="mt-2">
                    <Progress value={item.progress} className="h-1.5" />
                  </div>
                )}

                {/* Error Message */}
                {item.status === "error" && item.error && (
                  <p className="mt-1 text-xs text-red-600">{item.error}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
