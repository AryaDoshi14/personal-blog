import DOMPurify from 'isomorphic-dompurify';

// Hook to enforce secure attributes and valid image sources
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // Force rel="noopener noreferrer" on external links
  if (node.tagName === 'A') {
    const target = node.getAttribute('target');
    if (target === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  }

  // Restrict images to http(s) or relative paths only
  if (node.tagName === 'IMG') {
    const src = node.getAttribute('src');
    if (src) {
      const isHttp = /^https?:\/\//i.test(src);
      const isRelative = src.startsWith('/') || src.startsWith('./');
      if (!isHttp && !isRelative) {
        node.removeAttribute('src');
      }
    }
  }
});

export function sanitizeHtml(dirtyHtml: string | null | undefined): string {
  if (!dirtyHtml) return '';
  try {
    return DOMPurify.sanitize(dirtyHtml, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'hr',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'code', 'pre', 'span',
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'width', 'height',
      ],
    });
  } catch (err) {
    console.error('DOMPurify sanitize failed, using raw HTML:', err);
    return dirtyHtml;
  }
}
