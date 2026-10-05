"use client";

import * as React from "react";

/**
 * CkEditorField — CKEditor 5 WYSIWYG editor wrapper.
 * Matches the 24online captive portal editor (CKEditor with full toolbar).
 *
 * Toolbar includes: Source, Bold, Italic, Underline, Strikethrough,
 * Lists, Alignment, Links, Images, Tables, Colors, Forms, etc.
 *
 * Uses dynamic import to avoid SSR issues with CKEditor.
 */

const CKEditor = React.lazy(() =>
  import("@ckeditor/ckeditor5-react").then((mod) => ({ default: mod.CKEditor }))
);

const EditorBuild = React.lazy(() =>
  import("@ckeditor/ckeditor5-build-classic").then((mod) => ({
    default: mod.default,
  }))
);

interface CkEditorFieldProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

export function CkEditorField({ value, onChange, placeholder }: CkEditorFieldProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-border bg-muted/30">
        <div className="text-sm text-muted-foreground">Loading WYSIWYG editor…</div>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-md border border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">Loading CKEditor…</div>
        </div>
      }
    >
      <LazyEditor value={value} onChange={onChange} placeholder={placeholder} />
    </React.Suspense>
  );
}

function LazyEditor({
  value,
  onChange,
  placeholder,
}: CkEditorFieldProps) {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-md border border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">Loading editor build…</div>
        </div>
      }
    >
      <EditorImpl value={value} onChange={onChange} placeholder={placeholder} />
    </React.Suspense>
  );
}

function EditorImpl({
  value,
  onChange,
  placeholder,
}: CkEditorFieldProps) {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-md border border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">Initializing…</div>
        </div>
      }
    >
      <EditorInner value={value} onChange={onChange} placeholder={placeholder} />
    </React.Suspense>
  );
}

function EditorInner({
  value,
  onChange,
  placeholder,
}: CkEditorFieldProps) {
  const [Editor, setEditor] = React.useState<any>(null);
  const [CKEditorComp, setCKEditorComp] = React.useState<any>(null);

  React.useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setEditor(() => mod.default);
    });
    import("@ckeditor/ckeditor5-react").then((mod) => {
      setCKEditorComp(() => mod.CKEditor);
    });
  }, []);

  if (!Editor || !CKEditorComp) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-border bg-muted/30">
        <div className="text-sm text-muted-foreground">Loading CKEditor components…</div>
      </div>
    );
  }

  return (
    <div className="ck-editor-wrapper">
      <style>{`
        .ck-editor-wrapper .ck-content { min-height: 400px; }
        .ck-editor-wrapper .ck-toolbar { border-radius: 0.5rem 0.5rem 0 0; }
        .ck-editor-wrapper .ck-content { border-radius: 0 0 0.5rem 0.5rem; }
        .ck-editor-wrapper .ck-focused { border-color: hsl(var(--primary)) !important; box-shadow: 0 0 0 1px hsl(var(--primary)) !important; }
      `}</style>
      <CKEditorComp
        editor={Editor}
        data={value}
        onChange={(_event: any, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder: placeholder || "Design your captive portal login page here…",
          toolbar: {
            items: [
              "sourceEditing",
              "|",
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "alignment",
              "|",
              "numberedList",
              "bulletedList",
              "outdent",
              "indent",
              "|",
              "link",
              "imageUpload",
              "insertTable",
              "blockQuote",
              "codeBlock",
              "|",
              "undo",
              "redo",
            ],
          },
        }}
      />
    </div>
  );
}
