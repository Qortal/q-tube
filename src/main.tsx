import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './state/persist/jotaiIndexedDB';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <App />
    <div id="modal-root" />
  </>
);
