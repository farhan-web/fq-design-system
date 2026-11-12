import { useCallback, useEffect, useRef } from 'react';

// Dialog and inline/portalled sheets must own one document scroll lock.
const locks = new WeakMap<Document, { count: number; restore: () => void }>();

function acquire(doc: Document): () => void {
  let entry = locks.get(doc);
  if (!entry) {
    const body = doc.body;
    const elements = [body, ...doc.querySelectorAll<HTMLElement>('.mui-fixed')];
    const saved = elements.map((element) => ({
      element,
      css: ['overflow', 'overflow-x', 'overflow-y', 'padding-right'].map(
        (name) => ({
          name,
          value: element.style.getPropertyValue(name),
          priority: element.style.getPropertyPriority(name),
        }),
      ),
    }));
    const gap = Math.max(
      0,
      (doc.defaultView?.innerWidth ?? 0) - doc.documentElement.clientWidth,
    );
    if (body.scrollHeight > doc.documentElement.clientHeight && gap > 0) {
      for (const element of elements) {
        const padding =
          parseFloat(doc.defaultView!.getComputedStyle(element).paddingRight) ||
          0;
        element.style.paddingRight = `${padding + gap}px`;
      }
    }
    body.style.overflow = 'hidden';
    entry = {
      count: 0,
      restore: () => {
        for (const { element, css } of saved) {
          for (const { name, value, priority } of css) {
            if (value) element.style.setProperty(name, value, priority);
            else element.style.removeProperty(name);
          }
        }
      },
    };
    locks.set(doc, entry);
  }
  entry.count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    entry.count -= 1;
    if (entry.count === 0) {
      entry.restore();
      locks.delete(doc);
    }
  };
}

/** Defer release for components whose closing transition outlives open=false. */
export function useModalScrollLock(active: boolean, deferRelease = false) {
  const releaseRef = useRef<(() => void) | null>(null);
  const release = useCallback(() => {
    releaseRef.current?.();
    releaseRef.current = null;
  }, []);
  useEffect(() => {
    if (active) releaseRef.current ??= acquire(document);
    else if (!deferRelease) release();
  }, [active, deferRelease, release]);
  useEffect(() => release, [release]);
  return release;
}
