import './style.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.min.css';
import { deltaToHtml } from '../src';

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      ['link', 'image'],
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
const htmlPreview = document.getElementById('html-preview')!;

update();
quill.on('text-change', update);

function update(): void {
  const delta = quill.getContents();
  deltaOutput.textContent = JSON.stringify(delta, null, 2);
  const generatedHtml = deltaToHtml(delta);
  htmlOutput.textContent = generatedHtml;
  htmlPreview.innerHTML = generatedHtml;

  deltaOutput.removeAttribute('data-highlighted');
  hljs.highlightElement(deltaOutput);
  htmlOutput.removeAttribute('data-highlighted');
  hljs.highlightElement(htmlOutput);
}

document.getElementById('paste-delta')!.addEventListener('click', () => {
  navigator.clipboard.readText().then((t) => {
    quill.setContents(JSON.parse(t));
  });
});

document.getElementById('show-html-code')!.addEventListener('click', () => {
  htmlOutput.classList.remove('hidden');
  htmlPreview.classList.add('hidden');
});

document.getElementById('show-html-preview')!.addEventListener('click', () => {
  htmlOutput.classList.add('hidden');
  htmlPreview.classList.remove('hidden');
});
