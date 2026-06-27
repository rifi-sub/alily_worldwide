import React from 'react';
import { MessageCircle } from 'lucide-react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-logo">Goddess A Lilly Mentorship</div>
        
        <div className="footer-contact">
          <p style={{ marginBottom: '0.5rem' }}>Get in touch directly:</p>
          <a href="mailto:alilyworldwide@gmail.com">alilyworldwide@gmail.com</a>
        </div>

        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
            <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
            <MessageCircle size={20} />
          </a>
          {/* Custom Pinterest SVG */}
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Pinterest">
            <svg
              fill="currentColor"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.396-5.897 1.396-5.897s-.356-.71-.356-1.758c0-1.646.955-2.87 2.138-2.87 1.008 0 1.495.757 1.495 1.666 0 1.014-.646 2.531-.979 3.935-.279 1.177.59 2.137 1.75 2.137 2.099 0 3.712-2.211 3.712-5.397 0-2.822-2.029-4.8-4.93-4.8-3.357 0-5.328 2.518-5.328 5.12 0 1.014.39 2.102.879 2.695.097.118.11.221.082.336-.09.373-.29 1.18-.33 1.341-.052.212-.172.257-.397.153-1.482-.69-2.407-2.858-2.407-4.597 0-3.743 2.72-7.18 7.842-7.18 4.116 0 7.314 2.932 7.314 6.852 0 4.09-2.576 7.38-6.149 7.38-1.2 0-2.327-.624-2.713-1.361l-.74 2.82c-.267 1.02-.99 2.298-1.474 3.084 1.127.348 2.322.536 3.563.536 6.62 0 11.988-5.367 11.988-11.987C23.999 5.367 18.634 0 12.017 0z" />
            </svg>
          </a>
        </div>

        <div className="footer-copyright">
          <p>© 2026 Goddess A Lilly Mentorship. All rights reserved. Empowering Your Dream Life.</p>
        </div>
      </div>
    </footer>
  );
};
