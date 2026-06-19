#import "../../../../_shared/build/lumosread/variables.typ": *

#let prose-book(title: "", author: "", trim: (6in, 9in), page-count: 250, body) = {
  let inside = if page-count <= 150 { 0.375in }
    else if page-count <= 300 { 0.5in }
    else if page-count <= 500 { 0.625in }
    else { 0.75in }
  set page(width: trim.at(0), height: trim.at(1),
    margin: (inside: inside, outside: 0.5in, top: 0.75in, bottom: 0.75in))
  set text(font: body_font, size: body_size, fill: ink)
  set par(leading: body_leading, justify: true, first-line-indent: 1.2em)
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    align(center, block(below: 36pt,
      text(font: display_font, size: 24pt, fill: primary, weight: 700, it.body)))
  }
  body
}
