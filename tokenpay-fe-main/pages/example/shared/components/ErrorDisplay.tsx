import React from "react";

interface ErrorDisplayProps {
  errors: Record<string, string>;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => (
  <div className="space-y-2">
    {Object.entries(errors).map(([field, error]) => (
      <div key={field} className="text-red-500 text-sm">
        {error}
      </div>
    ))}
  </div>
);

export default ErrorDisplay;
