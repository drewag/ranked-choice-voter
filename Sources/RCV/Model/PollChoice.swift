//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import SQL

struct PollChoice: TableStorable, Codable {
    static let tableName = "poll_choices"
    typealias Fields = CodingKeys

    enum CodingKeys: String, CodingKey {
        case pollId, id, name
    }

    let pollId: UUID
    let id: Int
    let name: String
}

extension PollChoice.CodingKeys: Field {
    var sqlFieldSpec: FieldSpec? {
        switch self {
        case .name:
            return self.spec(dataType: .string(length: nil), allowNull: false)
        case .id:
            return self.spec(dataType: .integer, allowNull: false)
        case .pollId:
            return self.spec(referencing: .id, in: Poll.self, onDelete: .cascade)
        }
    }
}
