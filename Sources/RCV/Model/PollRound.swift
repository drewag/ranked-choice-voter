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
    }

    let tallies: [Tally]

    var total: Int {
        return self.tallies.reduce(0, { $0 + $1.count })
    }

    var winner: Tally? {
        return self.tallies.first
    }

    var loser: Tally? {
        return self.tallies.last
    }

    var winningPercentage: Double? {
        guard let winner = self.winner else {
            return nil
        }
        let total = self.total
        return Double(winner.count) / Double(total)
    }
}
