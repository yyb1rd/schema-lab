/**
 *
 * @param {string} article
 * @returns
 */
function previewArticle(article) {
  const r = article.match(/^(.{20}).*(.{10})$/u);
  return r;
  return `${r[1]}\n……\n${r[2]}`;
}

const p = previewArticle('abcdefghijklmnjsdhfoiuashdoifugasdoiyfgoasduyfgcoiyag');
console.log(Boolean(p));
