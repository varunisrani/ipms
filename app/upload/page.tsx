"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PatientIdInput from "@/components/upload/patient-id-input";
import FileUploader from "@/components/upload/file-uploader";
import FilePreview from "@/components/upload/file-preview";
import UploadProgress, { UploadProgressItem } from "@/components/upload/upload-progress";
import Button from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { initializeStorage } from "@/lib/storage/file-storage";
import { Upload, CheckCircle2, XCircle } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState("");
  const [isPatientIdValid, setIsPatientIdValid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStarted, setUploadStarted] = useState(false);

  const { uploadFiles, isUploading, progress, error, clearError } = useFileUpload();

  // Initialize storage on mount
  useEffect(() => {
    initializeStorage();
  }, []);

  // Convert progress to UploadProgressItem format
  const progressItems: UploadProgressItem[] = progress.map((p) => ({
    fileName: p.fileName,
    progress: p.progress,
    status: p.status,
    error: p.error,
  }));

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) added`);
  };

  const handleFilesRejected = (errors: Array<{ file: File; error: string }>) => {
    errors.forEach(({ file, error }) => {
      toast.error(`${file.name}: ${error}`);
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const handleUpload = async () => {
    if (!isPatientIdValid) {
      toast.error("Please enter a valid patient ID");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setUploadStarted(true);
    clearError();

    try {
      const uploadedFiles = await uploadFiles(selectedFiles, {
        patientId,
        maxSize: 5 * 1024 * 1024, // 5MB
        onSuccess: (files) => {
          toast.success(`Successfully uploaded ${files.length} file(s)!`, {
            description: `Files saved for patient ${patientId}`,
          });
        },
        onError: (error) => {
          toast.error("Upload failed", {
            description: error.message,
          });
        },
      });

      // Clear form after successful upload
      setSelectedFiles([]);
      setUploadStarted(false);

      // Show success message with navigation option
      toast.success("Upload complete!", {
        description: "Would you like to view the patient's files?",
        action: {
          label: "View Patient",
          onClick: () => router.push(`/patient/${patientId}`),
        },
        duration: 5000,
      });
    } catch (err) {
      setUploadStarted(false);
      console.error("Upload error:", err);
    }
  };

  const handleReset = () => {
    setPatientId("");
    setIsPatientIdValid(false);
    setSelectedFiles([]);
    setUploadStarted(false);
    clearError();
    toast.info("Form reset");
  };

  const canUpload = isPatientIdValid && selectedFiles.length > 0 && !isUploading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Upload Patient Photos
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Upload medical images and documents for patient records
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient ID Input */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Step 1: Enter Patient ID
            </h2>
            <PatientIdInput
              value={patientId}
              onChange={setPatientId}
              onValidationChange={setIsPatientIdValid}
              disabled={isUploading}
            />
          </div>

          {/* File Uploader */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Step 2: Select Files
            </h2>
            <FileUploader
              onFilesSelected={handleFilesSelected}
              onFilesRejected={handleFilesRejected}
              disabled={!isPatientIdValid || isUploading}
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
            />
          </div>

          {/* File Preview */}
          {selectedFiles.length > 0 && !uploadStarted && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <FilePreview
                files={selectedFiles}
                onRemove={handleRemoveFile}
                disabled={isUploading}
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploadStarted && progressItems.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Step 3: Upload Progress
              </h2>
              <UploadProgress items={progressItems} />
            </div>
          )}

          {/* Error Display */}
          {error && !isUploading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">Upload Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleUpload}
              disabled={!canUpload}
              variant="primary"
              size="lg"
              isLoading={isUploading}
              className="flex-1"
            >
              <Upload className="mr-2 h-5 w-5" />
              {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
            </Button>
            <Button
              onClick={handleReset}
              disabled={isUploading}
              variant="secondary"
              size="lg"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Sidebar - Upload Guidelines */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Upload Guidelines
            </h3>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Supported Formats
                </h4>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    JPG, JPEG - Image files
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    PNG - Image files
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    PDF - Document files
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  File Limits
                </h4>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Maximum file size: 5MB per file</li>
                  <li>Maximum files per upload: 10 files</li>
                  <li>Total storage limited by browser</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  File Naming
                </h4>
                <p>
                  Files are automatically renamed using the format:
                </p>
                <code className="block mt-2 p-2 bg-zinc-100 dark:bg-zinc-900 rounded text-xs">
                  [PATIENT_ID]_[DATE]_[SEQUENCE].[ext]
                </code>
              </div>

              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Storage Location
                </h4>
                <p>
                  Files are stored securely in your browser&apos;s local storage with
                  associated patient metadata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
