import { useEffect, useState } from 'react';

/**
 * Returns cache-busting query string for dev mode.
 * Initial render returns empty string to avoid hydration mismatches.
 */
export function useAssetCacheBuster() {
  const [suffix, setSuffix] = useState('');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setSuffix(`&t=${Date.now()}`);
    }
  }, []);

  return suffix;
}


