//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import SwiftServe

struct PollRouter: Router {
    var routes: [Route] = [
        .endpoint(CreatePoll.self, handler: { request, poll in
            let service = PollService(connection: request.databaseConnection)
            let poll = try service.createPoll(
                named: poll.name,
                details: poll.details,
                answers: poll.choices
            )
            return (.created, .init(id: poll.id.uuidString))
        }),

        .anyWithParam(consumeEntireSubPath: false, subRoutes: [
            .endpoint(GetPoll.self, handler: { (request, id: String) in
                let service = PollService(connection: request.databaseConnection)
                guard let id = UUID(uuidString: id)
                    , let (poll, answers) = try service.getPoll(withId: id)
                    else
                {
                    throw SwiftServeError(.notFound, "getting poll", reason: "It could not be found.")
                }

                let output = GetPoll.Output(
                    name: poll.name,
                    details: poll.details,
                    choices: answers.map{ GetPoll.Choice(id: $0.id, name: $0.name) }
                )
                return (.ok, output)
            }),

            .endpoint(AnswerPoll.self, handler: { (request, id: String, rankings) in
                let service = PollService(connection: request.databaseConnection)
                guard let id = UUID(uuidString: id)
                    , let (poll, answers) = try service.getPoll(withId: id)
                    else
                {
                    throw SwiftServeError(.notFound, "answering poll", reason: "It could not be found.")
                }
                try service.answer(poll, rankings: rankings)
                return .created
            }),

            .endpoint(GetPollResults.self, at: "results", handler: { (request, id: String) in
                let service = PollService(connection: request.databaseConnection)
                guard let id = UUID(uuidString: id)
                    , let (poll, answers) = try service.getPoll(withId: id)
                    else
                {
                    throw SwiftServeError(.notFound, "getting results", reason: "It could not be found.")
                }

                let output = GetPollResults.Output(
                    pollName: poll.name,
                    result: try service.results(for: poll)
                )
                return (.ok, output)
            }),
        ]),
    ]
}
