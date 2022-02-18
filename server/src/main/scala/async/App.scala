//
//  App.scala
//  spy-hunt
//
//  Created by d-exclaimation on 3:20 PM.
//

package async

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

/**
 * Asynchronous Application based on Futures
 */
trait App {
  /** Main asynchronous running function */
  def startLink(args: Array[String]): Future[Unit]

  /**
   * Main function for Scala compiler
   *
   * @param args Execution arguments
   */
  def main(args: Array[String]): Unit = {
    Await.result(startLink(args), Duration.Inf)
  }
}
