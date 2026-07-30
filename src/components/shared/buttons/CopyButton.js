'use client';
import { useState } from 'react';
import { trackEvent, getSessionId } from '@/lib/tracking';

export default function CopyButton({ text, trackName, color = 'inherit' }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        trackEvent({ eventType: 'click', buttonName: trackName, sessionId: getSessionId() });
      });
    }
  };

  const style = {
    display: 'inline-flex', cursor: 'pointer', padding: '2px 4px', marginLeft: '8px',
    borderRadius: '4px', transition: 'all 0.2s',
    color: copied ? '#10b981' : (isHovered ? '#2b5aeb' : color),
    opacity: copied || isHovered ? '1' : '0.6',
    transform: isHovered ? 'scale(1.1)' : 'none'
  };

  return (
    <span onClick={handleCopy} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={style} title={copied ? "Copied!" : "Copy to clipboard"}>
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      )}
    </span>
  );
}
