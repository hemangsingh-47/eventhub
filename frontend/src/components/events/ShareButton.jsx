import { useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Check } from 'lucide-react';

const ShareButton = ({ eventId, title }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const eventUrl = `${window.location.origin}/events/${eventId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this event: ${title}\n\n${eventUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowMenu(false);
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out this event: ${title}`);
    const url = encodeURIComponent(eventUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`p-3 rounded-xl border flex items-center justify-center transition-all duration-300 ${
          showMenu
            ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[var(--color-primary-muted)]'
            : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]'
        }`}
        aria-label="Share Event"
        title="Share Event"
      >
        <Share2 className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-14 right-0 w-48 bg-white/95 backdrop-blur-xl border border-[var(--color-border)] shadow-xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-sm font-medium">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <span className="flex items-center gap-2">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Link'}
              </span>
            </button>
            <div className="h-px w-full bg-[var(--color-border)] my-1" />
            <button
              onClick={handleTwitterShare}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[#E8F5FE] hover:text-[#1DA1F2] transition-colors"
            >
              <Twitter className="w-4 h-4" /> Twitter
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[#E8F5E9] hover:text-[#25D366] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
