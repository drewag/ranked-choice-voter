//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/22/19.
//

import XCTest
@testable import RCV

class PollResultsTests: XCTestCase {
    func testSingleAnswer() throws {
        let result = try PollResult(
            choices: [
                PollChoice(pollId: UUID(), id: 1, name: "one"),
                PollChoice(pollId: UUID(), id: 2, name: "two"),
                PollChoice(pollId: UUID(), id: 3, name: "three"),
            ],
            answers: [
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
            ]
        )

        XCTAssertEqual(result.winners.count, 1)
        if result.winners.count == 1 {
            XCTAssertEqual(result.winners[0], "two")
        }

        XCTAssertEqual(result.rounds.count, 2)
        if result.rounds.count == 2 {
            // Round 1
            XCTAssertEqual(result.rounds[0].previouslyRemovedChoices.count, 0)
            XCTAssertEqual(result.rounds[0].tallies.count, 3)
            if result.rounds[0].tallies.count == 3 {
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 1
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "one"
                        && tally.count == 0
                        && tally.rank == 2
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 0
                        && tally.rank == 2
                }))
            }

            // Round 2
            XCTAssertEqual(result.rounds[1].previouslyRemovedChoices.count, 2)
            XCTAssertTrue(result.rounds[1].previouslyRemovedChoices.contains(where: {$0 == "one"}))
            XCTAssertTrue(result.rounds[1].previouslyRemovedChoices.contains(where: {$0 == "three"}))
            XCTAssertEqual(result.rounds[1].tallies.count, 1)
            if result.rounds[1].tallies.count == 3 {
                XCTAssertTrue(result.rounds[1].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 3
                        && tally.rank == 1
                }))
            }
        }
    }

    func testMultipleAnswers() throws {
        let result = try PollResult(
            choices: [
                PollChoice(pollId: UUID(), id: 1, name: "one"),
                PollChoice(pollId: UUID(), id: 2, name: "two"),
                PollChoice(pollId: UUID(), id: 3, name: "three"),
            ],
            answers: [
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
                PollAnswer(pollId: UUID(), rankings: [3,1,2]),
                PollAnswer(pollId: UUID(), rankings: [3,2,1]),
                PollAnswer(pollId: UUID(), rankings: [1,3,2]),
            ]
        )

        XCTAssertEqual(result.winners.count, 1)
        if result.winners.count == 1 {
            XCTAssertEqual(result.winners[0], "three")
        }

        XCTAssertEqual(result.rounds.count, 3)
        if result.rounds.count == 3 {
            // Round 1
            XCTAssertEqual(result.rounds[0].previouslyRemovedChoices.count, 0)
            XCTAssertEqual(result.rounds[0].tallies.count, 3)
            if result.rounds[0].tallies.count == 3 {
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 2
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 2
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "one"
                        && tally.count == 1
                        && tally.rank == 2
                }))
            }

            // Round 2
            XCTAssertEqual(result.rounds[1].previouslyRemovedChoices, ["one"])
            XCTAssertEqual(result.rounds[1].tallies.count, 2)
            if result.rounds[1].tallies.count == 2 {
                XCTAssertTrue(result.rounds[1].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 3
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[1].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 2
                        && tally.rank == 2
                }))
            }

            // Round 3
            XCTAssertEqual(result.rounds[2].previouslyRemovedChoices, ["two"])
            XCTAssertEqual(result.rounds[2].tallies.count, 1)
            if result.rounds[2].tallies.count == 1 {
                XCTAssertTrue(result.rounds[2].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 5
                        && tally.rank == 1
                }))
            }
        }
    }

    func testMultipleWinners() throws {
        let result = try PollResult(
            choices: [
                PollChoice(pollId: UUID(), id: 1, name: "one"),
                PollChoice(pollId: UUID(), id: 2, name: "two"),
                PollChoice(pollId: UUID(), id: 3, name: "three"),
            ],
            answers: [
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
                PollAnswer(pollId: UUID(), rankings: [2,1,3]),
                PollAnswer(pollId: UUID(), rankings: [3,1,2]),
                PollAnswer(pollId: UUID(), rankings: [3,2,1]),
                PollAnswer(pollId: UUID(), rankings: [1,3,2]),
            ]
        )

        XCTAssertEqual(result.winners.count, 2)
        if result.winners.count == 2 {
            XCTAssertTrue(result.winners.contains(where: {$0 == "three"}))
            XCTAssertTrue(result.winners.contains(where: {$0 == "two"}))
        }

        XCTAssertEqual(result.rounds.count, 2)
        if result.rounds.count == 2 {
            // Round 1
            XCTAssertEqual(result.rounds[0].previouslyRemovedChoices.count, 0)
            XCTAssertEqual(result.rounds[0].tallies.count, 3)
            if result.rounds[0].tallies.count == 3 {
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 3
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 2
                        && tally.rank == 2
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "one"
                        && tally.count == 1
                        && tally.rank == 3
                }))
            }

            // Round 2
            XCTAssertEqual(result.rounds[1].previouslyRemovedChoices, ["one"])
            XCTAssertEqual(result.rounds[1].tallies.count, 2)
            if result.rounds[1].tallies.count == 2 {
                XCTAssertTrue(result.rounds[1].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 3
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[1].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 3
                        && tally.rank == 1
                }))
            }
        }
    }

    func testMultipleLosers() throws {
        let result = try PollResult(
            choices: [
                PollChoice(pollId: UUID(), id: 1, name: "one"),
                PollChoice(pollId: UUID(), id: 2, name: "two"),
                PollChoice(pollId: UUID(), id: 3, name: "three"),
            ],
            answers: [
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
                PollAnswer(pollId: UUID(), rankings: [2,3,1]),
                PollAnswer(pollId: UUID(), rankings: [2,1,3]),
                PollAnswer(pollId: UUID(), rankings: [3,2,1]),
                PollAnswer(pollId: UUID(), rankings: [1,3,2]),
            ]
        )

        XCTAssertEqual(result.winners.count, 1)
        if result.winners.count == 1 {
            XCTAssertEqual(result.winners[0], "two")
        }

        XCTAssertEqual(result.rounds.count, 2)
        if result.rounds.count == 2 {
            // Round 1
            XCTAssertEqual(result.rounds[0].previouslyRemovedChoices.count, 0)
            XCTAssertEqual(result.rounds[0].tallies.count, 3)
            if result.rounds[0].tallies.count == 3 {
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 3
                        && tally.rank == 1
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "three"
                        && tally.count == 1
                        && tally.rank == 2
                }))
                XCTAssertTrue(result.rounds[0].tallies.contains(where: { tally in
                    return tally.choice == "one"
                        && tally.count == 1
                        && tally.rank == 2
                }))
            }

            // Round 2
            XCTAssertEqual(result.rounds[1].previouslyRemovedChoices.count, 2)
            XCTAssertTrue(result.rounds[1].previouslyRemovedChoices.contains(where: {$0 == "three"}))
            XCTAssertTrue(result.rounds[1].previouslyRemovedChoices.contains(where: {$0 == "one"}))
            XCTAssertEqual(result.rounds[1].tallies.count, 1)
            if result.rounds[1].tallies.count == 2 {
                XCTAssertTrue(result.rounds[1].tallies.contains(where: { tally in
                    return tally.choice == "two"
                        && tally.count == 5
                        && tally.rank == 1
                }))
            }
        }
    }
}
