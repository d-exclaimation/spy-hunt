//
//  Global.scala
//  spy-hunt
//
//  Created by d-exclaimation on 2:00 PM.
//

package implicits

import actor.Matchmaking
import akka.actor.typed.ActorSystem
import akka.stream.Materializer

import scala.concurrent.ExecutionContext

object Services {
  implicit val system: ActorSystem[Matchmaking.Act] = ActorSystem(Matchmaking.apply(), "SpyHuntWebSocket")
  implicit val materializer: Materializer = Materializer.createMaterializer(system)
  implicit val executionContext: ExecutionContext = system.executionContext
}