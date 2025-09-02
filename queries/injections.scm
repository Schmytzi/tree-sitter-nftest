(
  (groovy_block) @injection.content
  (#set! injection.language "groovy")
  (#set! injection.include-children)
)
(
  (groovy_triple_string) @injection.content
  (#offset! @injection.content 0 3 0 -3)
  (#set! injection.language "groovy")
  (#set! injection.include-children)
)
