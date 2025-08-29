((groovy_triple_string)
  groovy: _ @injection.content
  (#set! injection.language "groovy"))

((groovy_block) @injection.content
  (#set! injection.language "groovy"))
