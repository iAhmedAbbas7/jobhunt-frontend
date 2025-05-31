// <= IMPORTS =>
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ARTICLE_API_ENDPOINT } from "@/utils/constants";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import { useCallback, useEffect, useMemo, useRef } from "react";
import axios from "axios";

// <= TOOLBAR OPTIONS =>
const toolbarOptions = [
  [
    { font: [] },
    { size: [] },
    "bold",
    "italic",
    "underline",
    "strike",
    { color: [] },
    { background: [] },
    { script: "sub" },
    { script: "super" },
    { header: [1, 2, 3, 4, 5, 6, false] },
    { list: "ordered" },
    { list: "bullet" },
    "blockquote",
    "code-block",
    "formula",
    { indent: "-1" },
    { indent: "+1" },
    { direction: "rtl" },
    { align: [] },
    "link",
    "image",
    "video",
    "clean",
  ],
];

const SectionEditor = ({ content, onContentChange, disabled }) => {
  // QUILL REF
  const quillRef = useRef(null);
  // TRACKING UPLOADED IMAGES
  const uploadedImages = useRef(new Set());
  // UPDATING CONTENT WHEN THE CONTENT IN PARENT CHANGES
  useEffect(() => {
    if (quillRef.current) {
      // GETTING EDITOR
      const editor = quillRef.current.getEditor();
      // CHANGING CONTENT
      if (editor.root.innerHTML !== content) {
        editor.root.innerHTML = content || [];
      }
    }
  }, [content]);
  // CUSTOM IMAGE HANDLER FUNCTION
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url, publicId } = await uploadToCloudinary(file);
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", url);
        editor.setSelection(range.index + 1);
        uploadedImages.current.add(publicId);
      } catch (error) {
        console.error("Failed to Upload to Cloudinary", error);
      }
    };
  }, []);
  // WHENEVER THE DOCUMENT CHANGES LOOKING FOR DELETED IMAGES
  useEffect(() => {
    // IF NO ACTIVE EDITOR
    if (!quillRef.current) return;
    // SELECTING EDITOR
    const editor = quillRef.current.getEditor();
    // HANDLING TEXT CHANGE
    const onTextChange = (delta) => {
      // TRACKING ACTION
      delta.ops.forEach((op) => {
        // IF IMAGE BACKSPACED
        if (op.delete) {
          // CHECKING IMAGES TO CHECK FOR CHANGE
          const currentImages = Array.from(
            editor.root.querySelectorAll("img")
          ).map((img) => img.src);
          // GETTING PUBLIC ID OF EACH IMAGE
          uploadedImages.current.forEach(async (publicId) => {
            // CHECKING IF PUBLIC ID IS PRESENT IN SET
            const urlContains = currentImages.some((src) =>
              src.includes(publicId)
            );
            // IF NOT PRESENT, DELETING IT FROM CLOUDINARY
            if (!urlContains) {
              await axios.post(
                `${ARTICLE_API_ENDPOINT}/image/destroy`,
                { publicId },
                { withCredentials: true }
              );
              uploadedImages.current.delete(publicId);
            }
          });
        }
      });
    };
    editor.on("text-change", onTextChange);
    return () => {
      editor.off("text-change", onTextChange);
    };
  }, []);
  // <= MODULES FOR QUILL EDITOR =>
  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbarOptions,
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  );
  return (
    <div className="w-full shadow-md">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={onContentChange}
        modules={modules}
        readOnly={disabled}
        className="w-full rounded-md bg-white focus:outline-none"
        formats={[
          "font",
          "size",
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "script",
          "list",
          "bullet",
          "blockquote",
          "code-block",
          "formula",
          "indent",
          "direction",
          "align",
          "link",
          "image",
          "video",
        ]}
      />
    </div>
  );
};

export default SectionEditor;
