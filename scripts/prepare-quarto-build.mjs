import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceDir = path.join(root, "当代西藏作物种植史的政治学叙事_章节");
const outDir = path.join(root, ".quarto-build");
const sources = [
  ["01_指导小组成员名单.md", "frontmatter"],
  ["03_摘要.md", "abstract-zh"],
  ["04_Abstract.md", "abstract-en"],
  ["05_导论.md", "introduction"],
  ["06_第一章：藏族农民的生计传统与西藏的农业技术变迁.md", "chapter-01"],
  ["07_第二章：政治运动与 1970 年代西藏的冬小麦推广.md", "chapter-02"],
  ["08_第三章：民族习惯还是权力结构？——1980年西藏冬小麦调整政策及其后果分析.md", "chapter-03"],
  ["09_第四章 权力互动渠道与1980年代西藏种植业发展规划的转折.md", "chapter-04"],
  ["10_结论.md", "conclusion"],
  ["11_参考文献.md", "references"],
];

function checkFootnotes(text, source) {
  const definitions = [...text.matchAll(/^\[\^([^\]\s]+)\]:/gm)].map((match) => match[1]);
  const defined = new Set(definitions);
  if (defined.size !== definitions.length) {
    throw new Error(`Duplicate footnote definition in ${source}`);
  }
  for (const [, id] of text.matchAll(/\[\^([^\]\s]+)\](?!:)/g)) {
    if (!defined.has(id)) {
      throw new Error(`Missing footnote definition [^${id}] in ${source}`);
    }
  }
}

await mkdir(outDir, { recursive: true });

for (const [source, target] of sources) {
  let text = (await readFile(path.join(sourceDir, source), "utf8")).replace(/\r\n/g, "\n");
  checkFootnotes(text, source);

  // Both the source chapters and generated chapters are one directory below root.
  for (const [, imagePath] of text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    await access(path.resolve(outDir, imagePath));
  }

  if (target === "frontmatter") {
    // The book title comes from metadata, and index.qmd supplies the page heading.
    text = text.replace(/^# [^\n]+\n+## 指导小组成员名单\s*\n/, "");
  } else {
    // Definitions render at their references; their source heading would be empty.
    text = text.replace(/^## 本章注释[ \t]*\n/gm, "");
    text = text.replace(/^(#{2,6}) /gm, (_match, hashes) => `${hashes.slice(1)} `);
  }

  // Keep the original caption once; a hard break prevents an extra automatic caption.
  text = text.replace(
    /^!\[([^\]\n]+)\]\(([^)\n]+)\)\n\n\1(?=\n|$)/gm,
    (_match, caption, imagePath) => `![${caption}](${imagePath})\\\n${caption}`,
  );
  // Chinese document titles in ASCII angle brackets must not become HTML tags.
  text = text.replace(/<([\p{Script=Han}][^<>\n]*)>/gu, "&lt;$1&gt;");
  text = text.replace(/\[\^([^\]\s]+)\]/g, (_match, id) => `[^${target}-${id}]`);
  await writeFile(path.join(outDir, `${target}.qmd`), `${text.trim()}\n`);
}

console.log(`Prepared ${sources.length} book sources in .quarto-build/`);
