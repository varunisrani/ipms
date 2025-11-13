"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/input";
import { validatePatientId } from "@/lib/utils/validation";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface PatientIdInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  disabled?: boolean;
}

export default function PatientIdInput({
  value,
  onChange,
  onValidationChange,
  disabled = false,
}: PatientIdInputProps) {
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Only validate if the input has been touched
    if (!touched && !value) {
      return;
    }

    if (!value) {
      setError("Patient ID is required");
      setIsValid(false);
      onValidationChange(false);
      return;
    }

    if (value.length < 3) {
      setError("Patient ID must be at least 3 characters long");
      setIsValid(false);
      onValidationChange(false);
      return;
    }

    if (value.length > 20) {
      setError("Patient ID must not exceed 20 characters");
      setIsValid(false);
      onValidationChange(false);
      return;
    }

    if (!validatePatientId(value)) {
      setError("Patient ID must contain only letters, numbers, hyphens, and underscores");
      setIsValid(false);
      onValidationChange(false);
      return;
    }

    // Valid patient ID
    setError("");
    setIsValid(true);
    onValidationChange(true);
  }, [value, touched, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter patient ID (e.g., PAT001)"
        label="Patient ID"
        error={touched ? error : undefined}
        helperText="Alphanumeric ID, 3-20 characters (letters, numbers, -, _)"
        disabled={disabled}
        required
        maxLength={20}
        className="pr-10"
      />
      {touched && value && (
        <div className="absolute right-3 top-9">
          {isValid ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" aria-label="Valid" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" aria-label="Invalid" />
          )}
        </div>
      )}
    </div>
  );
}
