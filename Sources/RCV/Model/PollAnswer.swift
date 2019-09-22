//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import SQL

struct PollAnswer: TableStorable, Codable {
    static let tableName = "poll_answers"
    typealias Fields = CodingKeys

    enum CodingKeys: String, CodingKey {
        case pollId, rankings
    }

    let pollId: UUID
    let rankings: [Int]
}

extension PollAnswer.CodingKeys: Field {
    var sqlFieldSpec: FieldSpec? {
        switch self {
        case .pollId:
            return self.spec(referencing: .id, in: Poll.self, onDelete: .cascade)
        case .rankings:
            return self.spec(dataType: .string(length: nil), allowNull: false)
        }
    }
}
