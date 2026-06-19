# Color space cheatsheet

| Channel | Use sRGB | Use CMYK |
|---|---|---|
| KDP paperback | YES (KDP converts) | NO |
| KDP ebook | YES | NO |
| IngramSpark paperback | NO | YES (Ghostscript convert) |
| Shopify product images | YES | NO |

## Convert sRGB PDF to CMYK (Ghostscript)
```
gswin64c -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pdfwrite ^
  -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK ^
  -o cmyk.pdf in.pdf
```
