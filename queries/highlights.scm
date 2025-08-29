[
  "script"
] @keyword.import

[
 "nextflow_process"
 "nextflow_workflow"
 "nextflow_pipeline"
 "nextflow_function"
 "test"
 "run"
 "when"
 "then"
 "setup"
 "params"
] @keyword.function

( [(name_stmt) (unit_stmt) (tag_stmt) (options_stmt) (config_stmt) ]
  (_) @keyword.directive
  (string)
)

(invocation type: (invocable_unit) @function.call )
(quoted_identifier (_ identifier: (identifier) @local.definition) )

(double_string) @string
(single_string) @string
(triple_string) @string

(line_comment) @comment
(block_comment) @comment
