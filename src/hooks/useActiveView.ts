import { useEffect, useState } from 'react';
import { findNavItem, type NavItem } from '@/config/navigation';
import { navigateTo } from '@/lib/navigate';

function readRoute(): NavItem | undefined {
  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return findNavItem(segment === '' ? 'overview' : segment);
}

export function useActiveView(): NavItem | undefined {
  const [item, setItem] = useState(readRoute);

  useEffect(() => {
    const syncRoute = () => setItem(readRoute());

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      if (anchor.origin !== window.location.origin) return;
      if (anchor.pathname === window.location.pathname && anchor.hash) return;
      event.preventDefault();
      navigateTo(`${anchor.pathname}${anchor.search}${anchor.hash}`);
    };

    window.addEventListener('popstate', syncRoute);
    document.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return item;
}
