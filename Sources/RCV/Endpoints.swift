//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import Swiftlier
import Decree

extension GenericSwiftlierError: AnyErrorResponse {
    public var message: String {
        return self.description
    }
}

struct RCV: WebService {
    typealias BasicResponse = NoBasicResponse
    typealias ErrorResponse = GenericSwiftlierError

    static var shared = RCV()

    var sessionOverride: Session?

    let baseURL = URL(string: "https://rcv.drewag.me/api/v1")!
}

struct CreatePoll: InOutEndpoint {
    typealias Service = RCV

    struct Input: Codable {
        let name: String
        let details: String
        let choices: [String]
    }

    struct Output: Codable {
        let id: String
    }

    static var method = Method.post

    let path: String = "polls"
}


struct GetPoll: OutEndpoint {
    typealias Service = RCV

    let pollId: String

    struct Choice: Codable {
        let id: Int
        let name: String
    }

    struct Output: Codable {
        let name: String
        let details: String?
        let choices: [Choice]
    }

    var path: String {
        return "polls/\(pollId)"
    }
}

struct AnswerPoll: InEndpoint {
    typealias Service = RCV

    let pollId: String

    typealias Input = [Int]

    static var method = Method.post

    var path: String {
        return "polls/\(pollId)"
    }
}

struct GetPollResults: OutEndpoint {
    typealias Service = RCV

    let pollId: String

    typealias Output = PollResult

    var path: String {
        return "polls/\(pollId)/results"
    }

}
