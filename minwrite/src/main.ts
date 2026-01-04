import './ui/styles.css';
import { Editor } from './editor';

const app = document.getElementById('app');
if (app) {
  new Editor(app);
}
