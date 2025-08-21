import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Import, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface InputFileProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  className?: string;
}

export function InputFile({
  onFileSelect,
  accept = ".csv",
  className = ""
}: InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Input
        ref={fileInputRef}
        id="csv-file"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        className="cursor-pointer bg-[#619154] text-white hover:bg-[#4F7A43] flex items-center gap-2"
      >
        <Import className="h-4 w-4" />
        CSV Import
      </Button>
      {selectedFile && (
        <div className="flex items-center gap-2 text-sm text-[#619154]">
          <Upload className="h-4 w-4" />
          <span className="truncate max-w-[200px]" title={selectedFile.name}>
            {selectedFile.name}
          </span>
        </div>
      )}
    </div>
  );
}
