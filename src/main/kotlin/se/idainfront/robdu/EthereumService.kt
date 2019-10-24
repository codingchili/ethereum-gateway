package se.idainfront.robdu

import com.codingchili.core.context.CoreContext
import com.codingchili.core.listener.*
import com.codingchili.core.protocol.*
import com.codingchili.core.protocol.RoleMap.PUBLIC
import io.vertx.core.http.HttpMethod
import org.web3j.protocol.Web3j
import org.web3j.protocol.ipc.UnixIpcService

/** Handles ethereum integration. */
class EthereumService : CoreService {
    private lateinit var core: CoreContext

    override fun init(core: CoreContext) {
        this.core = core
        val web3 = Web3j.build(UnixIpcService(PIPE))
        blockPublisher(web3)
        core.handler { Handler() }
    }

    private fun blockPublisher(web3: Web3j) {
        web3.blockFlowable(false)
            .subscribe {
                core.logger(javaClass).event(BLOCK_MINED).put("hash", it.block.hash).send()
                core.bus().publish(BLOCK_MINED, enrichStream(Serializer.json(it.block)))
            }
    }

    @Address(GRAPHQL_API)
    @Roles(PUBLIC)
    inner class Handler : CoreHandler {
        override fun handle(request: Request) {
            core.vertx().createHttpClient()
                .request(HttpMethod.POST, PORT, GRAPHQL_URL, GRAPHQL_URI)
                .handler { response ->
                    if (response.statusCode() < 300) {
                        response.bodyHandler(request::write)
                    } else {
                        val error = Error("${response.statusCode()}: ${response.statusMessage()}")
                        core.logger(javaClass).onError(error)
                        request.error(error)
                    }
                }.end(request.data().toBuffer())
        }
    }
    companion object {
        private const val PORT = 8547;
        private const val GRAPHQL_URL = "localhost"
        private const val GRAPHQL_URI = "/graphql"
        const val PIPE = "/home/robdu/.ethereum/testnet/geth.ipc"
    }
}