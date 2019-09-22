//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import Swiftlier

struct PollResult: Codable {
    let winner: String
    let rounds: [PollRound]

    init(choices: [PollChoice], answers: [PollAnswer]) throws {
        var activeChoices = [Int:(PollChoice, Int)]()
        for choice in choices {
            activeChoices[choice.id] = (choice, 0)
        }

        var rounds = [PollRound]()

        while (rounds.last?.winningPercentage ?? 0) <= 0.5 {
            // Tally votes
            for answer in answers {
                for choiceId in answer.rankings {
                    guard var existing = activeChoices[choiceId] else {
                        continue
                    }
                    existing.1 += 1
                    activeChoices[choiceId] = existing
                    break
                }
            }

            let tallies = activeChoices.values
                .map({ (choice, count) in
                    return PollRound.Tally(choice: choice.name, choiceId: choice.id, count: count)
                })
                .sorted(by: {$0.count > $1.count})
            let round = PollRound(tallies: tallies)
            rounds.append(round)

            if let loser = round.loser {
                activeChoices[loser.choiceId] = nil
            }
        }

        guard let winner = rounds.last?.winner else {
            throw GenericSwiftlierError("calcuatling winner", because: "no round created")
        }

        self.winner = winner.choice
        self.rounds = rounds
    }
}
