//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import Swiftlier
import SQL

struct PollService {
    let connection: Connection

    init(connection: Connection) {
        self.connection = connection
    }

    func createPoll(named name: String, details: String, answers: [String]) throws -> Poll {
        guard !name.isEmpty else {
            throw GenericSwiftlierError("creating poll", because: "a name is required")
        }

        let poll = Poll(id: UUID(), name: name, details: details)
        try self.connection.transaction() {
            try self.connection.execute(try poll.insert())
            for (index, name) in answers.enumerated() {
                let answer = PollChoice(pollId: poll.id, id: index, name: name)
                try self.connection.execute(try answer.insert())
            }
        }
        return poll
    }

    func getPoll(withId id: UUID) throws -> (Poll, [PollChoice])? {
        let select = Poll.select()
            .joined(to: PollChoice.self, on: Poll.field(.id) == PollChoice.field(.pollId))
            .filtered(Poll.field(.id) == id.uuidString)
        let result = try self.connection.execute(select)

        let rows = Array(result.rows)
        guard let firstRow = rows.first else {
            return nil
        }

        let poll: Poll = try firstRow.decode(purpose: .create)
        let answers: [PollChoice] = try rows.map({ try $0.decode(purpose: .create) })
        return (poll, answers)
    }

    func answer(_ poll: Poll, rankings: [Int]) throws {
        for rank in rankings {
            guard try self.choiceExists(withId: rank, for: poll) else {
                throw GenericSwiftlierError("answering poll", because: "one of your answers couldn't be found")
            }
        }
        let answer = PollAnswer(pollId: poll.id, rankings: rankings)
        try self.connection.execute(try answer.insert())
    }

    func results(for poll: Poll) throws -> PollResult {
        let answers = try self.answers(to: poll)
        let choices = try self.choices(for: poll)
        return try PollResult(choices: choices, answers: answers)
    }

    func clearAnswers(for poll: Poll) throws {
        let delete = PollAnswer.delete().filtered(PollAnswer.field(.pollId) == poll.id.uuidString)
        try self.connection.execute(delete)
    }
}

private extension PollService {
    func choiceExists(withId id: Int, for poll: Poll) throws -> Bool {
        let select = PollChoice.select()
            .filtered(PollChoice.field(.pollId) == poll.id.uuidString)
            .filtered(PollChoice.field(.id) == id)
        let result = try self.connection.execute(select)
        return result.rows.next() != nil
    }

    func choices(for poll: Poll) throws -> [PollChoice] {
        let select = PollChoice.select()
            .filtered(PollChoice.field(.pollId) == poll.id.uuidString)
        let result = try self.connection.execute(select)
        return try result.rows.map({ try $0.decode(purpose: .create) })
    }

    func answers(to poll: Poll) throws -> [PollAnswer] {
        let select = PollAnswer.select()
            .filtered(PollAnswer.field(.pollId) == poll.id.uuidString)
        let result = try self.connection.execute(select)
        return try result.rows.map({ try $0.decode(purpose: .create) })
    }
}
