//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation

struct PollRound: Codable {
    struct Tally: Codable {
        let choice: String
        let choiceId: Int
        let count: Int
        let rank: Int
    }

    let tallies: [Tally]
    let previouslyRemovedChoices: [String]

    var total: Int {
        return self.tallies.reduce(0, { $0 + $1.count })
    }

    var winners: [Tally] {
        var winners = [Tally]()
        for tally in self.tallies {
            guard let prev = winners.last else {
                winners.append(tally)
                continue
            }
            guard prev.count == tally.count else {
                break
            }
            winners.append(tally)
        }
        return winners
    }

    var losers: [Tally] {
        var losers = [Tally]()
        for tally in self.tallies.reversed() {
            guard let prev = losers.last else {
                losers.append(tally)
                continue
            }
            guard prev.count == tally.count else {
                break
            }
            losers.append(tally)
        }
        return losers
    }

    var winningPercentage: Double? {
        guard let winner = self.winners.first else {
            return nil
        }
        let total = self.total
        return Double(winner.count) / Double(total)
    }
}
