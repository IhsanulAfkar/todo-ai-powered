'use client';

import { NextPage } from 'next';
import dynamic from 'next/dynamic';
const Editor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false }, // 👈 prevent SSR
);
import { Dispatch, SetStateAction, useRef } from 'react';
interface Props {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

const RichEditor: NextPage<Props> = ({ setText, text }) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(_evt, editor) => {
        editorRef.current = {
          editor,
        };
      }}
      value={text} // controlled value
      onEditorChange={(newValue) => {
        setText(newValue); // sync to parent
      }}
      init={{
        height: 500,
        menubar: true,
        // skin: editorTheme,
        // content_css: theme === "dark" ? "dark" : "default",
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'preview',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
      }}
    />
  );
};

export default RichEditor;
