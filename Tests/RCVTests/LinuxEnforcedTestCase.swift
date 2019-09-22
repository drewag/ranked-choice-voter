//
//  LinuxEnforcedTestCase.swift
//  WebLibTests
//
//  Created by Andrew Wagner on 12/22/17.
//

import XCTest

protocol AnyLinuxEnforcedTestCase {
    func validateIncludesTest(named: String)
}

protocol LinuxEnforcedTestCase: AnyLinuxEnforcedTestCase {
    static var allTests: [(String, (Self) -> () throws -> Void)] {get}
}

extension XCTestCase {
    func checkTestIncludedForLinux() {
        #if os(macOS)
            guard let enforced = self as? AnyLinuxEnforcedTestCase else {
                return
            }

            enforced.validateIncludesTest(named: invocation!.selector.description)
        #endif
    }

    #if os(macOS)
    override open func tearDown() {
        self.checkTestIncludedForLinux()

        super.tearDown()
    }
    #endif
}

extension LinuxEnforcedTestCase {
    func validateIncludesTest(named: String) {
        #if os(macOS)
            let contains = type(of: self).allTests.contains(where: { test in
                return test.0 == named || "\(test.0)AndReturnError:" == named
            })

            XCTAssert(contains, "Test '\(named)' is missing from the allTests array")
        #endif
    }
}

