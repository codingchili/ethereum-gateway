import io.vertx.ext.unit.TestContext
import io.vertx.ext.unit.junit.VertxUnitRunner
import org.junit.Test
import org.junit.runner.RunWith
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.methods.request.ShhPost
import org.web3j.protocol.ipc.UnixIpcService
import org.web3j.utils.Numeric
import se.idainfront.robdu.EthereumService

/**
 * Sends a whisper message to the given recipient.
 */
@RunWith(VertxUnitRunner::class)
class WhisperMessageTest {

    @Test
   fun testMessage(test: TestContext) {
        val web3 = Web3j.build(UnixIpcService(EthereumService.PIPE))
        val async = test.async()

        web3.shhNewIdentity().sendAsync().handle { shhNewIdentity, throwable ->
            val shh = ShhPost(shhNewIdentity.address,
                shhNewIdentity.address,
                listOf("srs","bisnis"),
                "{'message': true}",
                Numeric.toBigInt("0x64"),
                Numeric.toBigInt("0x64")
            )
            web3.shhPost(shh).sendAsync().handle { result, throwable ->
                println(result.messageSent())
                async.complete()
            }
        }
   }
}