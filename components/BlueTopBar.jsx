import Image from 'next/image';

export default function BlueTopBar() {
  return (
    <div className="blue-top-bar">
      <Image
        src="/assets/image/Rectangle_17_1389.png"
        alt="Unicorn Blocks Logo"
        width={50}
        height={50}
        className="blue-top-bar-logo"
      />
      <span className="blue-top-bar-text">Unicorn Blocks</span>
      
      <style jsx>{`
        .blue-top-bar {
          position: relative;
          width: 100%;
          background-color: #AAC2F4;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0.8px 24px;
          z-index: 8;
        }

        .blue-top-bar-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .blue-top-bar-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #000000;
        }
      `}</style>
    </div>
  );
}