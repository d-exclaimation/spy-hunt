//
//  Main.scala
//  spy-hunt
//
//  Created by d-exclaimation on 3:12 PM.
//

import java.util.concurrent.ForkJoinPool
import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}

object Main extends async.App {

  implicit val ex: ExecutionContextExecutor = ExecutionContext.fromExecutor(
    new ForkJoinPool(10)
  )

  def startLink(args: Array[String]) = Future {
    println("Server starting...")
    Thread.sleep(1000)
    println("Server closing...")
  }
}
