// LumosBooks workbook template (Typst 0.14)
// Project main.typ should import this AND a variables.typ from the imprint,
// then call: #show: workbook.with(title: "...", subtitle: "...", trim: (8.5in, 11in), page-count: 60, ...)

#let workbook(
  title: "",
  subtitle: "",
  trim: (8.5in, 11in),
  page-count: 60,
  primary: rgb("#0F2A4A"),
  secondary: rgb("#E5B53D"),
  ink: rgb("#1A1A1A"),
  muted: rgb("#6B6B6B"),
  body_font: "EB Garamond",
  display_font: "EB Garamond",
  ui_sans: "Inter",
  body_size: 11pt,
  body_leading: 1.45em,
  body
) = {
  let inside = if page-count <= 150 { 0.375in }
    else if page-count <= 300 { 0.5in }
    else if page-count <= 500 { 0.625in }
    else if page-count <= 700 { 0.75in }
    else { 0.875in }

  // Page = trim + 0.125in bleed on each side (KDP). Margins measured from trimmed edge.
  let bleed = 0.125in
  set page(
    width: trim.at(0) + 2 * bleed,
    height: trim.at(1) + 2 * bleed,
    margin: (inside: inside + bleed, outside: 0.5in + bleed, top: 0.75in + bleed, bottom: 0.75in + bleed),
  )
  set text(font: body_font, size: body_size, fill: ink)
  set par(leading: body_leading, justify: true)
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    block(below: 24pt, text(font: display_font, size: 32pt, fill: primary, weight: 700, it.body))
  }
  show heading.where(level: 2): it => {
    block(above: 18pt, below: 9pt, text(font: display_font, size: 18pt, fill: secondary, weight: 600, it.body))
  }

  // Cover page
  align(center + horizon)[
    #text(font: display_font, size: 48pt, fill: primary, weight: 800)[#title]
    #v(12pt)
    #text(font: ui_sans, size: 14pt, fill: muted)[#subtitle]
  ]
  pagebreak()
  body
}
