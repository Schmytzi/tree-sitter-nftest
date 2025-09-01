(run_header
  identifier: (quoted_identifier
    (_ identifier: ((identifier) @local.definition.import ) (#set! definition.var.scope "global"))
  )
  alias: (quoted_identifier
    (_ identifier: ((identifier) @local.definition.constant ) (#set! definition.var.scope "global"))
  )
)

(unit_stmt value: ((identifier) @local.defintion.import ) (#set! definition.var.scope "global"))
