import './style.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.min.css';
import { deltaToHtml } from '../lib';

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      // [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  },
});

const deltaOutput = document.getElementById('delta')!;
const htmlOutput = document.getElementById('html')!;

update();
quill.on('text-change', update);

function update(): void {
  const delta = quill.getContents();
  deltaOutput.textContent = JSON.stringify(delta, null, 2);
  htmlOutput.textContent = deltaToHtml(delta);

  deltaOutput.removeAttribute('data-highlighted');
  hljs.highlightElement(deltaOutput);
  htmlOutput.removeAttribute('data-highlighted');
  hljs.highlightElement(htmlOutput);
}
