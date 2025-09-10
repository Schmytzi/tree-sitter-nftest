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
    source_file: $ => $.suite,

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
      repeat(choice(
        $.invocation,
        $.script_stmt,
        $.config_stmt
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

    test_header: $ => seq('test', '(', field('name', $.string), ')'),

    // When ----------------------------------------------------------------
    when_block: $ => seq(
      'when', '{',
      choice(
        $.params_block,
        $.invocation,
        seq($.params_block, $.invocation),
        seq($.invocation, $.params_block)
      ),
      '}'
    ),

    params_block: $ => seq(
      'params',
      $.groovy_block // Assuming params can be parsed as a bunch of nested Groovy closures
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
      $.script_stmt,
      $.profile_stmt
    ),

    tag_stmt: $ => seq('tag', field('value', $.string)),
    script_stmt: $ => seq('script', field('value', $.string)),
    options_stmt: $ => seq('options', field('value', $.string)),
    config_stmt: $ => seq('config', field('value', $.string)),
    unit_stmt: $ => seq($.invocable_unit, field('value', $.quoted_identifier)),
    name_stmt: $ => seq('name', field('value', $.string)),
    profile_stmt: $ => seq('profile', field('value', $.string)),

    // Blocks --------------------------------------------------------------
    // We handle braces spearately to make sure they are matched
    // However, that requires us to add a special case for strings in case they contain braces
    groovy_block: $ => seq('{', field('groovy', prec.left(repeat(choice($.groovy_code, $.brace_block, $.string)))), '}'),

    groovy_code: $ => /[^{}"']+/, // permissive, inject as Groovy via queries

    brace_block: $ => seq('{', prec.left(repeat(choice($.groovy_code, $.brace_block, $.string))), '}'),

    // Strings & identifiers ----------------------------------------------
    string: $ => choice($.double_string, $.single_string),

    double_string: $ => seq(
      '"',
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1,/[^"\\\n]/))
      )),
      '"'
    ),
    single_string: $ => seq(
      '\'',
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^'\\\n]/))
      )),
      '\''
    ),
    triple_single_string: $ => seq(
      '\'\'\'',
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^"\\]/))
      )),
      '\'\'\''
    ),
    triple_double_string: $ => seq(
      '"""',
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^"\\]/))
      )),
      '"""'
    ),

    groovy_triple_string: $ => seq(
      '"""',
      field('groovy', prec.left(repeat(choice(
        $.escape_sequence,
        /[^\\]/
      )))),
      '"""'
    ),

    escape_sequence: $ => token(seq('\\', /./)),

    quoted_identifier: $ => choice($.double_quoted_identifier, $.single_quoted_identifier),
    double_quoted_identifier: $ => seq('"', field('identifier', $.identifier), '"'),
    single_quoted_identifier: $ => seq('\'', field('identifier', $.identifier), '\''),

    identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,
    number: $ => /\d+(?:\.\d+)?/,
    invocable_unit: $ => choice('process', 'workflow', 'function'),

    // Comments ------------------------------------------------------------
    line_comment: $ => token(seq('//', /[^\n]*/)),
    block_comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),
  }
});
