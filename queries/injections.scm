(
  (groovy_block) @injection.content
  (#set! injection.language "groovy")
  (#set! injection.include-children)
)
(
  (groovy_triple_string) @injection.content
  (#offset! @injection.conent 0 1 0 -1)
  (#set! injection.language "groovy")
  (#set! injection.include-children)
)
