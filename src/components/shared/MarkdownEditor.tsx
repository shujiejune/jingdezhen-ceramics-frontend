import { onMount, onCleanup, Component } from "solid-js";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import "./MarkdownEditor.css";
import { MarkdownLogo, Image } from "~/components/icons/Phosphor";

interface MarkdownEditorProps {
  initialValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: Component<MarkdownEditorProps> = (props) => {
  let textareaRef: HTMLTextAreaElement | undefined;
  let easymde: EasyMDE | undefined;

  onMount(() => {
    if (textareaRef) {
      easymde = new EasyMDE({
        element: textareaRef,
        initialValue: props.initialValue || "",
        placeholder:
          props.placeholder ||
          "Ask a question, start a conversation, or make an announcement",
        spellChecker: false,
        toolbar: [
          "heading",
          "bold",
          "italic",
          "|",
          "quote",
          "code",
          "link",
          "|",
          "unordered-list",
          "ordered-list",
          "strikethrough", // Strikethrough is a good addition
          "|",
          "preview",
          "side-by-side",
        ],
        // Hide the default status bar, create our own footer
        status: false,
      });

      easymde.codemirror.on("change", () => {
        if (props.onValueChange) {
          props.onValueChange(easymde?.value() || "");
        }
      });
    }
  });

  onCleanup(() => {
    easymde?.toTextArea();
    easymde = undefined;
  });

  return (
    <div class="easymde-container">
      <textarea ref={textareaRef} />
      {/* --- Custom Footer --- */}
      <div class="editor-footer">
        <a
          href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          <MarkdownLogo size={16} />
          <span>Markdown is supported</span>
        </a>
        <button class="footer-button">
          <Image size={16} />
          <span>Paste, drop, or click to add images</span>
        </button>
      </div>
    </div>
  );
};
