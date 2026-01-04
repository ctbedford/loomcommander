import './ui/styles.css';
import { Editor } from './editor';

async function main() {
  const app = document.getElementById('app');
  if (app) {
    const editor = new Editor(app);
    await editor.init();
  }
}

main();
