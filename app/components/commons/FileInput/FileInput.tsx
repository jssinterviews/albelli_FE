import "./styles.scss";
import React, { LegacyRef } from "react";

interface IFileInput {
  id: string;
  onChange?: (value: FileList | null) => void;
  accept?: string;
  ref?: LegacyRef<HTMLInputElement>;
}

const FileInput = React.forwardRef(
  (
    { id, accept = "image/*", onChange = () => null }: IFileInput,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return (
      <input
        type="file"
        className="file_input"
        id={id}
        ref={ref}
        accept={accept}
        onChange={(event) => onChange(event.currentTarget.files)}
      />
    );
  }
);

export default FileInput;
