// Tiny inline formatter for quiz text: escapes HTML, then renders `code`.
export function inline(text: string): string {
  const escaped = text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export const countQuestions = (body = '') => (body.match(/<QA\s/g) ?? []).length;
