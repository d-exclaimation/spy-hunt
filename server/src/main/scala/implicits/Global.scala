//
//  Global.scala
//  spy-hunt
//
//  Created by d-exclaimation on 2:00 PM.
//

package implicits

import actor.{Gateway, gateway}
import akka.actor.typed.ActorSystem
import akka.stream.Materializer

import scala.concurrent.ExecutionContext

object Global {
  implicit val system: ActorSystem[gateway.Msg] = ActorSystem(Gateway.apply(), "SpyHuntWebSocket")
  implicit val materializer: Materializer = Materializer.createMaterializer(system)
  implicit val executionContext: ExecutionContext = system.executionContext
}