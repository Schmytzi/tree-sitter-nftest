import XCTest
import SwiftTreeSitter
import TreeSitterNftest

final class TreeSitterNftestTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_nftest())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading nf-test grammar")
    }
}
