//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import Swiftlier

struct PollResult: Codable {
    let winners: [String]
    let rounds: [PollRound]

    init(choices: [PollChoice], answers: [PollAnswer]) throws {
        var activeChoices = [Int:(PollChoice, Int)]()
        for choice in choices {
            activeChoices[choice.id] = (choice, 0)
        }

        var rounds = [PollRound]()
        var previouslyRemovedChoices = [String]()

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

            var rank = 0
            var previousScore: Int? = nil
            var tallies = [PollRound.Tally]()
            for (choice, count) in activeChoices.values.sorted(by: {$0.1 > $1.1}) {
                if count != previousScore {
                    rank += 1
                }
                tallies.append(PollRound.Tally(
                    choice: choice.name,
                    choiceId: choice.id,
                    count: count,
                    rank: rank
                ))
                previousScore = count
            }
            let round = PollRound(tallies: tallies, previouslyRemovedChoices: previouslyRemovedChoices)
            rounds.append(round)

            for loser in round.losers {
                activeChoices[loser.choiceId] = nil
            }
            previouslyRemovedChoices = round.losers.map({$0.choice})
        }

        self.rounds = rounds
        self.winners = (rounds.last?.winners ?? []).map({$0.choice})
    }
}
