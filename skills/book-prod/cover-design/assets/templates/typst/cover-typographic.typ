// Typographic cover template (front + spine + back as a single wraparound page).
// Caller passes geometry from cover-design/scripts/spine.py.

#let cover-typographic(
  title: "",
  subtitle: "",
  author: "",
  blurb: "",
  trim_w: 8.5in,
  trim_h: 11in,
  spine_w: 0.2in,
  bleed: 0.125in,
  primary: rgb("#0F2A4A"),
  secondary: rgb("#E5B53D"),
  ink: rgb("#1A1A1A"),
  paper: rgb("#FFFFFF"),
  display_font: "EB Garamond",
  ui_sans: "Inter",
) = {
  let cover_w = bleed + trim_w + spine_w + trim_w + bleed
  let cover_h = trim_h + 2 * bleed
  set page(width: cover_w, height: cover_h, margin: 0pt)
  set text(font: display_font, fill: paper)

  // Full bleed primary fill
  rect(width: 100%, height: 100%, fill: primary, stroke: none)

  // Spine area (subtle gold line)
  place(top + left, dx: bleed + trim_w, dy: 0pt,
    rect(width: spine_w, height: cover_h, fill: secondary.lighten(20%), stroke: none))

  // FRONT cover content (right panel)
  let front_x = bleed + trim_w + spine_w + 0.5in
  let front_w = trim_w - 1.0in
  place(top + left, dx: front_x, dy: bleed + 1.5in)[
    #box(width: front_w)[
      #text(size: 56pt, weight: 800, fill: paper)[#title]
      #v(18pt)
      #text(size: 18pt, weight: 400, fill: secondary, style: "italic")[#subtitle]
    ]
  ]
  place(bottom + left, dx: front_x, dy: bleed + 0.6in)[
    #text(size: 14pt, font: ui_sans, fill: paper)[#author]
  ]

  // BACK cover content (left panel)
  let back_x = bleed + 0.5in
  place(top + left, dx: back_x, dy: bleed + 1.0in)[
    #box(width: trim_w - 1.0in)[
      #text(size: 12pt, font: ui_sans, fill: paper)[#blurb]
    ]
  ]
}
