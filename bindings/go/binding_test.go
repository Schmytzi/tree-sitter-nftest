package tree_sitter_nftest_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_nftest "github.com/schmytzi/treesitter-nftest/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_nftest.Language())
	if language == nil {
		t.Errorf("Error loading nf-test grammar")
	}
}
