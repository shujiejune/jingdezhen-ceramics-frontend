import { onMount, onCleanup, Component, Show } from "solid-js";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css"; // Import the editor's styles

interface MarkdownEditorProps {
  initialValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  onCancel?: () => void;
}

export const MarkdownEditor: Component<MarkdownEditorProps> = (props) => {
  let textareaRef: HTMLTextAreaElement | undefined;
  let easymde: EasyMDE | undefined;

  onMount(() => {
    if (textareaRef) {
      easymde = new EasyMDE({
        element: textareaRef,
        initialValue: props.initialValue || "",
        placeholder: props.placeholder || "Write your content here...",
        spellChecker: false,
        status: false, // Hides the status bar (word count, etc.)
        toolbar: [
          "bold",
          "italic",
          "heading",
          "|",
          "quote",
          "unordered-list",
          "ordered-list",
          "|",
          "link",
          "image",
          "|",
          "preview",
          "side-by-side",
          "fullscreen",
        ],
      });

      easymde.codemirror.on("change", () => {
        if (props.onValueChange) {
          props.onValueChange(easymde?.value() || "");
        }
      });
    }
  });

  // Clean up the editor instance when the component is removed
  onCleanup(() => {
    easymde?.toTextArea();
    easymde = undefined;
  });

  return (
    <div class="editor-wrapper">
      <textarea ref={textareaRef} />
      <div class="editor-actions">
        <Show when={props.onCancel}>
          <button class="cancel-button" onClick={props.onCancel}>
            Cancel
          </button>
        </Show>
        <button class="submit-button">Submit</button>
      </div>
    </div>
  );
};
