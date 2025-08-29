/**
 * @file nf-test suites
 * @author Daniel Schmitz <me@schmytzi.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
module.exports = grammar({
  name: 'nftest',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  rules: {
    // Entry ---------------------------------------------------------------
    source_file: $ => repeat1($.suite),

    suite: $ => seq(
      choice('nextflow_process', 'nextflow_workflow', 'nextflow_pipeline', 'nextflow_function'),
      field('body', $.suite_block)
    ),

    suite_block: $ => seq('{',
      repeat($.top_level_declaration),
      optional($.setup_block),
      repeat(
        $.test_block
      ),
      '}'
    ),


    // Setup --------------------------------------------------------------
    setup_block: $ => seq(
      'setup',
      '{',
      repeat($.run_block),
      '}'
    ),

    run_block: $ => seq(
      $.run_header,
      '{',
      repeat1(choice(
        $.script_stmt,
        $.invocation
      )),
      '}',
    ),

    run_header: $ => seq(
      'run',
      '(',
      field('identifier', $.quoted_identifier),
      optional(seq(
        ',',
        'alias',
        ':',
        field('alias', $.quoted_identifier)
      )),
      ')'
    ),

    // Test ----------------------------------------------------------------
    test_block: $ => seq(
      $.test_header,
      '{',
      repeat(choice(
        $.tag_stmt,
        $.options_stmt,
        $.config_stmt,
        $.setup_block,
        $.when_block,
        $.then_block
      )),
      '}'
    ),

    test_header: $ => seq('test', '(', field('name', $.quoted_identifier), ')'),

    // When ----------------------------------------------------------------
    when_block: $ => seq(
      'when', '{',
      repeat(choice(
        $.params_block,
        $.invocation,
      )),
      '}'
    ),

    params_block: $ => seq(
      'params',
      '{',
      repeat(choice(
        $.nested_params_map,
        $.assignment
      )),
      '}'
    ),

    nested_params_map: $ => seq(
      $.identifier,
      '{',
      repeat(choice(
        $.nested_params_map,
        $.assignment
      )),
      '}'
    ),

    assignment: $ => seq($.identifier, '=', $.expression),

    expression: $ => choice(
      $.string,
      $.number,
      seq($.identifier, repeat(seq('.', $.identifier))), // Allow member access like obj.prop.another
      $.groovy_block // Allow complex expressions in Groovy syntax in braces
    ),

    // Then ---------------------------------------------------------------
    then_block: $ => seq('then', $.groovy_block),


    // Invocation ---------------------------------------------------------
    invocation: $ => seq(
      field('type', $.invocable_unit),
      '{',
      $.groovy_triple_string,
      '}'
    ),

    // Declarations --------------------------------------------------------
    top_level_declaration: $ => choice(
      $.name_stmt,
      $.unit_stmt,
      $.config_stmt,
      $.options_stmt,
      $.tag_stmt,
      $.script_stmt
    ),

    tag_stmt: $ => seq('tag', $.string),
    script_stmt: $ => seq('script', $.string),
    options_stmt: $ => seq('options', $.string),
    config_stmt: $ => seq('config', $.string),
    unit_stmt: $ => seq($.invocable_unit, $.string),
    name_stmt: $ => seq('name', $.string),

    // Blocks --------------------------------------------------------------
    groovy_block: $ => seq('{', field('groovy', repeat(choice($.groovy_code, $.brace_block))), '}'),

    groovy_code: $ => /[^{}]+/, // permissive, inject as Groovy via queries

    brace_block: $ => seq('{', repeat(choice($.groovy_code, $.brace_block)), '}'),

    // Strings & identifiers ----------------------------------------------
    string: $ => choice($.double_string, $.single_string),

    double_string: $ => seq('"', repeat(choice($.escape_sequence, /[^"\\\n]+/)), '"'),
    single_string: $ => seq('\'', repeat(choice($.escape_sequence, /[^'\\\n]+/)), '\''),
    triple_string: $ => seq('"""', repeat(/[^"""]*/), '"""'),

    groovy_triple_string: $ => seq('"""', field('groovy', repeat(/[^"""]*/)), '"""'),

    escape_sequence: $ => token(seq('\\', /./)),

    quoted_identifier: $ => choice($.double_quoted_identifier, $.single_quoted_identifier),
    double_quoted_identifier: $ => seq('"', field('identifier', $.identifier), '"'),
    single_quoted_identifier: $ => seq('\'', field('identifier', $.identifier), '\''),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_\-]*/,
    number: $ => /\d+(?:\.\d+)?/,
    invocable_unit: $ => choice('process', 'workflow', 'function'),

    // Comments ------------------------------------------------------------
    line_comment: $ => token(seq('//', /[^\n]*/)),
    block_comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),
  }
});
