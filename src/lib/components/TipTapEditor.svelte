<script>
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Highlight from '@tiptap/extension-highlight';
  import TextAlign from '@tiptap/extension-text-align';
  import Underline from '@tiptap/extension-underline';
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';

  export let content = '';
  export let placeholder = 'Mulai menulis artikel...';
  export let onChange = () => {};

  let element;
  let editor;

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6]
          }
        }),
        Highlight.configure({
          multicolor: true
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph']
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-600 underline hover:text-blue-800'
          }
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'max-w-full h-auto rounded-lg'
          }
        })
      ],
      content: content,
      editorProps: {
        attributes: {
          class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4'
        }
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  // Check if formatting is active
  function isActive(type, attributes = {}) {
    if (!editor) return false;
    return editor.isActive(type, attributes);
  }

  // Toolbar functions with editor check
  function toggleBold() {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    if (!editor) return;
    editor.chain().focus().toggleItalic().run();
  }

  function toggleUnderline() {
    if (!editor) return;
    editor.chain().focus().toggleUnderline().run();
  }

  function toggleHighlight() {
    if (!editor) return;
    editor.chain().focus().toggleHighlight().run();
  }

  function setHeading(level) {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  }

  function setParagraph() {
    if (!editor) return;
    editor.chain().focus().setParagraph().run();
  }

  function toggleBulletList() {
    if (!editor) return;
    editor.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    if (!editor) return;
    editor.chain().focus().toggleOrderedList().run();
  }

  function toggleBlockquote() {
    if (!editor) return;
    editor.chain().focus().toggleBlockquote().run();
  }

  function setTextAlign(align) {
    if (!editor) return;
    editor.chain().focus().setTextAlign(align).run();
  }

  function addLink() {
    if (!editor) return;
    const url = window.prompt('Masukkan URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  function addImage() {
    if (!editor) return;
    const url = window.prompt('Masukkan URL gambar:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  function clearFormatting() {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }
</script>

<div class="border border-gray-300 rounded-lg overflow-hidden">
  <!-- Toolbar -->
  <div class="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2">
    <!-- Text Formatting -->
    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
      <button
        on:click={toggleBold}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Bold (Ctrl+B)"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12.6 18.6c-1.1 0-2.1-.4-2.8-1.1-.7-.7-1.1-1.7-1.1-2.8V5.3c0-1.1.4-2.1 1.1-2.8.7-.7 1.7-1.1 2.8-1.1h3.4c1.1 0 2.1.4 2.8 1.1.7.7 1.1 1.7 1.1 2.8v9.4c0 1.1-.4 2.1-1.1 2.8-.7.7-1.7 1.1-2.8 1.1h-3.4z"/>
        </svg>
      </button>
      
      <button
        on:click={toggleItalic}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Italic (Ctrl+I)"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 3a1 1 0 011 1v1h4V4a1 1 0 112 0v1h2a1 1 0 110 2h-2v8h2a1 1 0 110 2h-2v1a1 1 0 11-2 0v-1H8v1a1 1 0 11-2 0v-1H4a1 1 0 110-2h2V6H4a1 1 0 110-2h2V4a1 1 0 011-1z"/>
        </svg>
      </button>
      
      <button
        on:click={toggleUnderline}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Underline (Ctrl+U)"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      
      <button
        on:click={toggleHighlight}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('highlight') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Highlight"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M15.6 2.4c-.8-.8-2-1.2-3.2-1.2s-2.4.4-3.2 1.2L2.4 12.8c-.8.8-1.2 2-1.2 3.2s.4 2.4 1.2 3.2c.8.8 2 1.2 3.2 1.2s2.4-.4 3.2-1.2l6.8-6.8c.8-.8 1.2-2 1.2-3.2s-.4-2.4-1.2-3.2z"/>
        </svg>
      </button>
    </div>

    <!-- Headings -->
    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
      <button
        on:click={() => setHeading(1)}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Heading 1"
      >
        H1
      </button>
      <button
        on:click={() => setHeading(2)}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Heading 2"
      >
        H2
      </button>
      <button
        on:click={() => setHeading(3)}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Heading 3"
      >
        H3
      </button>
      <button
        on:click={setParagraph}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('paragraph') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Paragraph"
      >
        P
      </button>
    </div>

    <!-- Lists -->
    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
      <button
        on:click={toggleBulletList}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Bullet List"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        on:click={toggleOrderedList}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Ordered List"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        on:click={toggleBlockquote}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Blockquote"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
    </div>

    <!-- Alignment -->
    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
      <button
        on:click={() => setTextAlign('left')}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Align Left"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        on:click={() => setTextAlign('center')}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Align Center"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        on:click={() => setTextAlign('right')}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed {editor && isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}"
        title="Align Right"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
    </div>

    <!-- Media & Links -->
    <div class="flex items-center gap-1 border-r border-gray-300 pr-3">
      <button
        on:click={addLink}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
        title="Add Link"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
      <button
        on:click={addImage}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
        title="Add Image"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
    </div>

    <!-- Clear Formatting -->
    <div class="flex items-center gap-1">
      <button
        on:click={clearFormatting}
        disabled={!editor}
        class="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
        title="Clear Formatting"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Editor Content -->
  <div bind:this={element} class="min-h-[300px]">
    {#if !editor}
      <div class="flex items-center justify-center h-full text-gray-500">
        <svg class="animate-spin h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Memuat editor...
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.ProseMirror) {
    outline: none;
    min-height: 300px;
    padding: 1rem;
  }

  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  :global(.ProseMirror h1) {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
  }

  :global(.ProseMirror h2) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.83em 0;
  }

  :global(.ProseMirror h3) {
    font-size: 1.17em;
    font-weight: bold;
    margin: 1em 0;
  }

  :global(.ProseMirror ul) {
    list-style-type: disc;
    margin: 1em 0;
    padding-left: 2em;
  }

  :global(.ProseMirror ol) {
    list-style-type: decimal;
    margin: 1em 0;
    padding-left: 2em;
  }

  :global(.ProseMirror blockquote) {
    border-left: 4px solid #e5e7eb;
    margin: 1em 0;
    padding-left: 1em;
    font-style: italic;
  }

  :global(.ProseMirror mark) {
    background-color: #fef3c7;
    color: #92400e;
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
  }

  :global(.ProseMirror a) {
    color: #2563eb;
    text-decoration: underline;
  }

  :global(.ProseMirror a:hover) {
    color: #1d4ed8;
  }

  :global(.ProseMirror img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1em 0;
  }
</style>
