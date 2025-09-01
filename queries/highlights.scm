; General, easy rules
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
] @keyword.directive

[ "(" ")" "{" "}" "[" "]" ] @punctuation.bracket
[ "," "." ] @punctuation.delimiter

(double_string) @string
(single_string) @string
(escape_sequence) @string.escape

(line_comment) @comment
(block_comment) @comment

; Special nf-test strings whose quotes act as brackets
(groovy_triple_string "\"\"\"" @punctuation.bracket)
(double_quoted_identifier "\"" @punctuation.bracket)
(single_quoted_identifier "'" @punctuation.bracket)

(unit_stmt (invocable_unit) @keyword)

(invocation type: (invocable_unit) @function.call )
(quoted_identifier (_ identifier: (identifier) @constant) )

(script_stmt value: (string) @string.special.path)
(config_stmt value: (string) @string.special.path)
