import { Globe } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface Props {
  url: string | null;
  className?: string;
  Fallback?: LucideIcon;
}

export const Favicon = ({
  url,
  className = 'size-6',
  Fallback = Globe,
}: Props) => {
  if (!url) return <Fallback className={className} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="Favicon" className={className} />;
};
