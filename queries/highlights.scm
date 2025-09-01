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

[
  "options"
  "tag"
  "name"
  "config"
  "profile"
  "script"
] @keyword

(unit_stmt (invocable_unit) @keyword)

(invocation type: (invocable_unit) @function.call )
(quoted_identifier (_ identifier: (identifier) @local.definition) )

(double_string) @string
(single_string) @string

(line_comment) @comment
(block_comment) @comment
