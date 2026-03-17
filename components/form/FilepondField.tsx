import React from 'react'
import type { FilePondFile } from 'filepond'
import { FilePond, registerPlugin } from 'react-filepond'
import { Controller, Control } from 'react-hook-form'

// styles
// @ts-ignore
import 'filepond/dist/filepond.min.css'
// @ts-ignore
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

// register plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
)

interface Props {
  name: string
  control: Control<any>
  placeholder?: string
  acceptedFileTypes?: string[]
}

const FilepondField: React.FC<Props> = ({
  name,
  control,
  placeholder = 'Drop your file here',
  acceptedFileTypes,
}) => {
  return (
    <div className="mt-2">
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <FilePond
            credits={false}
            files={value}
            allowMultiple={false}
            name={name}
            labelIdle={placeholder}
            acceptedFileTypes={acceptedFileTypes}
            onupdatefiles={(fileItems: FilePondFile[]) => {
              onChange(fileItems.map((f) => f.file))
            }}
            server={{
              load: (source, load, error, progress, abort) => {
                fetch(source)
                  .then((res) => res.blob())
                  .then(load)
                  .catch(error)

                return {
                  abort: () => {
                    abort()
                  },
                }
              },
            }}
          />
        )}
      />
    </div>
  )
}

export default FilepondField