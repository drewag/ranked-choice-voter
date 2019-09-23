//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/22/19.
//

import Foundation
import SwiftServe
import Swiftlier

struct AppRouter: Router {
    var routes: [Route] {
        return [
            .anyWithParam(consumeEntireSubPath: true, handler: { (request, path: String) in
                let path = FileSystem.default.path(from: URL(fileURLWithPath: "App/build/\(path)"))
                if let file = path.file {
                    return .handled(try request.response(withFileAt: file.url.relativePath, status: .ok))
                }
                else if let directory = path.directory {
                    if let indexPath = try directory.file("index.html").file {
                        return .handled(try request.response(withFileAt: indexPath.url.relativePath, status: .ok))
                    }
                }
                return .handled(try request.response(withFileAt: "App/build/index.html", status: .ok))
            }),
        ]
    }
}
