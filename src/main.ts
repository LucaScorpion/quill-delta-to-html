import './style.scss';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

const quill = new Quill('#editor', {
  theme: 'snow',
});

const delta = document.getElementById('delta')!;

quill.on('text-change', () => {
  delta.textContent = JSON.stringify(quill.getContents(), null, 2);
});
