import { useState } from 'react';
import PopModal from './PopModal';

export default function FloatingJoinButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          top: '8px',            // 略微上移以更贴近导航居中
          right: '25px',
          background: '#2F2737',
          color: '#fff',
          height: '36px',
          padding: '0 18px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 3px 10px 0 rgba(39,40,47,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 5px 15px 0 rgba(39,40,47,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 3px 10px 0 rgba(39,40,47,0.3)';
        }}
      >
        Join Adventure
      </button>
      
      {showModal && <PopModal onClose={() => setShowModal(false)} />}
    </>
  );
}
