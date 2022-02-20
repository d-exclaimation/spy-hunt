//
//  Global.scala
//  spy-hunt
//
//  Created by d-exclaimation on 2:00 PM.
//

package implicits

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.stream.Materializer

import scala.concurrent.ExecutionContext

object Global {
  implicit val system: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "SpyHuntWebSocket")
  implicit val materializer: Materializer = Materializer.createMaterializer(system)
  implicit val executionContext: ExecutionContext = system.executionContext
}