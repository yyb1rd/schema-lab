export async function fetchText(url:string) {
  const f = await fetch(url);
  if (f.ok) {
    const a = await (f.blob());
    const reader = new FileReader();
    reader.readAsText(a, 'GB18030');
    return reader.result;
  }
  throw new Error('无法下载文件');
}

export function previewArticle(article:string) :string {
  if (article.length < 120) {
    return article;
  }
  const r = article.match(/^(.{30}).*(.{10})$/su);
  if (r) {
    return `${r[1]}\n……\n${r[2]}`;
  }
  return article;
}
