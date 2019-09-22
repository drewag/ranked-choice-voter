//
//  File.swift
//  
//
//  Created by Andrew J Wagner on 9/20/19.
//

import SwiftServe

struct APIRouter: Router {
    var routes: [Route] = [
        .any("v1", router: APIV1Router()),
    ]
}

struct APIV1Router: Router {
    var routes: [Route] = [
        .any("polls", router: PollRouter()),
    ]
}
