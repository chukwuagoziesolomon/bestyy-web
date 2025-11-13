import React from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_LINK = "https://wa.me/2340000000000"; // Replace with actual WhatsApp number if needed

const ChatWithBestie: React.FC = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: 'fixed',
      right: 24,
      bottom: 24,
      zIndex: 2000,
      background: '#10b981',
      color: '#fff',
      borderRadius: '50%',
      width: 64,
      height: 64,
      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      flexDirection: 'column',
      transition: 'box-shadow .2s',
    }}
    aria-label="Chat With Bestie"
  >
    <MessageCircle size={28} />
    <div style={{ fontSize: 12, lineHeight: 1, marginTop: 4 }}>Chat With<br />Bestie</div>
  </a>
);

export default ChatWithBestie;



