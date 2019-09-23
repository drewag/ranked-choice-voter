import Foundation
import SwiftServe
import CommandLineParser
import SwiftServeKitura
import Swiftlier
import SQL

public struct ExtraInfo: Codable {}

public let ServiceInstance = SwiftServeInstance<KituraServer, ExtraInfo>(
    domain: "rcv.drewag.me",
    dataDirectories: ["App/build"],
    assetsEnabled: true,
    webConfiguration: .init(viewSubdirectory: ""),
    allowCrossOriginRequests: true,
    databaseChanges: [
        Poll.create(fields: [.id, .name, .details]),
        PollChoice.create(fields: [.pollId, .id, .name]),
        PollAnswer.create(fields: [.pollId, .rankings]),
    ],
    routes: [
        .any("api", router: APIRouter()),
        .any(router: AppRouter()),
    ]
)
