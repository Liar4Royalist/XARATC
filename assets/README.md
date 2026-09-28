# 原文图像资产

全部图像来自项目原 PDF 的扫描页，按原像素裁切并保存为 PNG，不重采样、不重绘。PDF 页码按文件顺序从1计，正文印刷页码为 PDF 页码减8。

| 文件 | PDF页码 | 内容 |
| --- | ---: | --- |
| figures/figure-01.png | 36 | 试验田中的矮秆青稞 |
| figures/figure-02.png | 36 | 藏青320和柴青1号 |
| figures/figure-03.png | 43 | 牛粪墙 |
| figures/figure-04.png | 43 | 老人展示新氆氇 |
| figures/figure-05.png | 47 | 夏季稀疏草原 |
| figures/figure-06.png | 47 | 冬季饲草 |
| facsimiles/catalog-barcode.png | 2 | 目录页条码与Y2700936 |
| facsimiles/originality-signature.png | 179 | 独创性声明作者签名和日期 |
| facsimiles/authorization-signatures.png | 179 | 授权声明作者、导师签名和日期 |

裁切范围保存在 [extract-figures.ps1](../scripts/extract-figures.ps1)。原始扫描页36、43、47分别为2435×3508、2428×3508、2431×3517像素，照片未采用目录中1255×1833像素的低分辨率渲染页。

需要重建时，在项目根目录通过 Git Bash 导出五个原始扫描页：

```bash
mkdir -p .repair-work
for page in 2 36 43 47 179; do
  pdfimages -f "$page" -l "$page" -png "当代西藏作物种植史的政治学叙事.pdf" ".repair-work/page-$page"
done
```

然后在 PowerShell 中运行：

```powershell
./scripts/extract-figures.ps1
```

MiKTeX 版的 pdfimages 可能需要完成本机初始化，并会对 PDF 中缺失的文本字体给出警告；本次提取的是扫描图像对象，已逐幅检查导出的像素图。不要用生成式图像工具重新生成论文中的照片、签名或条码。
