package se.idainfront.robdu

import com.codingchili.core.context.CoreContext
import com.codingchili.core.listener.*
import com.codingchili.core.listener.transport.Connection
import com.codingchili.core.listener.transport.WebsocketListener
import com.codingchili.core.protocol.*
import io.vertx.core.json.JsonObject

/** Client interface over websocket. */
class WebsocketService : CoreService {
    val connections: HashSet<Connection> = HashSet()
    lateinit var core: CoreContext

    override fun init(core: CoreContext) {
        this.core = core;
        core.listener {
            WebsocketListener().handler(Handler()).settings(
                ListenerSettings()
                    .setSecure(false)
                    .setBinaryWebsockets(false)
            )
        }
        busListener()
    }

    private fun busListener() {
        core.bus().consumer<JsonObject>(BLOCK_MINED) { block ->
            connections.forEach { connection -> connection.write(block.body()) }
        }
    }

    @Address("ethereum.broker")
    @Roles(RoleMap.PUBLIC)
    inner class Handler : CoreHandler {
        private val protocol: Protocol<Request> = Protocol(this)

        @Api
        fun subscribe(request: Request) {
            request.connection().onCloseHandler { connections.remove(request.connection()) }
            connections.add(request.connection())
            request.accept()
        }

        @Api
        fun unsubscribe(request: Request) {
            connections.remove(request.connection())
            request.accept()
        }

        @Api
        fun query(request: Request) {
            core.bus().request<JsonObject>(GRAPHQL_API, request.data()) { response ->
                request.result(response.map { enrichQuery(it.body()) })
            }
        }

        override fun handle(request: Request) {
            core.logger(javaClass).event("ws.msg").send(request.data().encode())
            protocol.process(request)
        }
    }
}