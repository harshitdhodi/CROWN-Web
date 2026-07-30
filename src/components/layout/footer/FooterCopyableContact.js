'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FooterCopyableContact({ mobile, email }) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopy = (e, text, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (type === 'email') {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2000);
        } else {
          setCopiedPhone(true);
          setTimeout(() => setCopiedPhone(false), 2000);
        }
        try {
          const { trackEvent, getSessionId } = require('@/lib/tracking');
          trackEvent({ eventType: 'click', buttonName: type === 'email' ? 'footer_email_copy' : 'footer_phone_copy', sessionId: getSessionId() });
        } catch (err) {}
      });
    }
  };

  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <Link href={`tel:${mobile.replace(/[^0-9+]/g, '')}`}>P: {mobile}</Link>
        <span className="ms-2 d-inline-flex align-items-center" style={{ cursor: 'pointer', color: 'var(--tj-theme-primary, #c29742)' }} title="Copy Phone Number" onClick={(e) => handleCopy(e, mobile, 'phone')}>
          {copiedPhone ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </span>
      </div>
      <div className="d-flex align-items-center gap-2 mt-1">
        <Link href={`mailto:${email}`}>M: {email}</Link>
        <span className="ms-2 d-inline-flex align-items-center" style={{ cursor: 'pointer', color: 'var(--tj-theme-primary, #c29742)' }} title="Copy Email Address" onClick={(e) => handleCopy(e, email, 'email')}>
          {copiedEmail ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </span>
      </div>
    </>
  );
}
