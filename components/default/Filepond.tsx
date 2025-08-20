import React, { Dispatch, SetStateAction, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
);

// Our app
const Filepond = ({
  files,
  setFiles,
  placeholder = 'Drop your file here',
  acceptedFileTypes,
}: {
  files: any[];
  setFiles: Dispatch<SetStateAction<any[]>>;
  placeholder?: string;
  acceptedFileTypes?: string[];
}) => {
  return (
    <div className="mt-2">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        name="files"
        labelIdle={placeholder}
        acceptedFileTypes={acceptedFileTypes}
        server={{
          load: (source, load, error, progress, abort, headers) => {
            fetch(source)
              .then((res) => res.blob())
              .then(load)
              .catch(error);

            return {
              abort: () => {
                abort();
              },
            };
          },
        }}
      />
    </div>
  );
};
export default Filepond;
