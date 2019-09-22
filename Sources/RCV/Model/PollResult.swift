//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import Swiftlier

struct PollResult: Codable {
    let rankings: [String]
    let rounds: [PollRound]

    init(choices: [PollChoice], answers: [PollAnswer]) throws {
        var activeChoices = [Int:(PollChoice, Int)]()
        for choice in choices {
            activeChoices[choice.id] = (choice, 0)
        }

        var rounds = [PollRound]()

        while !activeChoices.isEmpty {
            // Tally votes
            activeChoices = activeChoices.mapValues { ($0.0, 0) }
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

        self.rankings = rounds.map({$0.tallies.last?.choice ?? "No Choice"}).reversed()
        self.rounds = rounds
    }
}
