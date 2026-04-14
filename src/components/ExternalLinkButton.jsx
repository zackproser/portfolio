import Link from 'next/link'
import { ExternalLink, Youtube, Link as LinkIcon } from 'lucide-react'

export function ExternalLinkButton({ link }) {
  const getIcon = () => {
    switch (link.type) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'blog':
        return <LinkIcon className="h-4 w-4" />;
      case 'twitter':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getButtonStyle = () => {
    switch (link.type) {
      case 'youtube':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'blog':
        return 'bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white';
      case 'twitter':
        return 'bg-sky-500 hover:bg-sky-600 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const isExternal = link.url.startsWith('http');
  const LinkComponent = isExternal ? 'a' : Link;
  
  const linkProps = isExternal 
    ? { href: link.url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: link.url };

  return (
    <LinkComponent
      {...linkProps}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${getButtonStyle()}`}
    >
      {getIcon()}
      {link.label}
    </LinkComponent>
  );
}
