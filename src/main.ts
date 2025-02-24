import './style.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.min.css';
import { deltaToHtml } from '../lib';

const quill = new Quill('#editor', {
  theme: 'snow',
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
