const clipPathIdRE = /(<clipPath\s+id=")(c\d+)(")/g
const clipPathRefRE = /url\(#(c\d+)\)/g

export function prefixSponsorSvgClipPathIds(svg: string, prefix: string) {
  return svg
    .replace(clipPathIdRE, `$1${prefix}-$2$3`)
    .replace(clipPathRefRE, `url(#${prefix}-$1)`)
}
