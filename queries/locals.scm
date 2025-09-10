(run_header
  identifier: (quoted_identifier
    (_ identifier: ((identifier) @local.definition.import ) (#set! definition.var.scope "global"))
  )
  alias: (quoted_identifier
    (_ identifier: ((identifier) @local.definition.constant ) (#set! definition.var.scope "global"))
  )
)

(unit_stmt
  value: (quoted_identifier
    (_ identifier: ((identifier) @local.defintion.import ) (#set! definition.var.scope "global"))
  )
)

(import
  import: ((qualified_identifier) @local.defintion.import) (#set! definition.var.scope "global")
)

(import
  alias: ((identifier) @local.defintion.import) (#set! definition.var.scope "global")
)
