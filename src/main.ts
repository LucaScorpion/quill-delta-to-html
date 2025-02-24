import './style.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.min.css';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

const quill = new Quill('#editor', {
  theme: 'snow',
});

const deltaOutput = document.getElementById('delta')!;

update();
quill.on('text-change', update);

function update(): void {
  deltaOutput.textContent = JSON.stringify(quill.getContents(), null, 2);

  deltaOutput.removeAttribute('data-highlighted');
  hljs.highlightElement(deltaOutput);
}
