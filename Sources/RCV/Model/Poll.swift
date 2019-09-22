//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import Foundation
import SQL

struct Poll: TableStorable, Codable {
    static let tableName = "polls"
    typealias Fields = CodingKeys

    enum CodingKeys: String, CodingKey {
        case id, name, details
    }

    let id: UUID
    let name: String
    let details: String?
}

extension Poll.CodingKeys: Field {
    var sqlFieldSpec: FieldSpec? {
        switch self {
        case .name:
            return self.spec(dataType: .string(length: nil), allowNull: false)
        case .details:
            return self.spec(dataType: .string(length: nil), allowNull: true)
        case .id:
            return self.spec(dataType: .string(length: 36), allowNull: false, isUnique: true)
        }
    }
}
