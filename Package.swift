// swift-tools-version:5.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "rcv.drewag.me",
    platforms: [
        .macOS(.v10_11),
    ],
    dependencies: [
        .package(url: "https://github.com/drewag/swift-serve-kitura.git", from: "18.0.0"),
    ],
    targets: [
        .target(name: "rcv.drewag.me", dependencies: ["RCV"]),
        .target(name: "RCV", dependencies: [
            "SwiftServeKitura",
        ]),
        .testTarget(name: "RCVTests", dependencies: ["RCV"]),
    ]
)
