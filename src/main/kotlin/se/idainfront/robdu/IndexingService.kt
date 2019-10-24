package se.idainfront.robdu

import com.codingchili.core.context.CoreContext
import com.codingchili.core.listener.CoreService
import com.codingchili.core.storage.*
import io.vertx.core.Future
import io.vertx.core.json.JsonObject
import java.time.LocalDateTime

/** Indexes "gMTS" messages in ElasticSearch. */
class IndexingService : CoreService {
    private lateinit var core: CoreContext
    private lateinit var storage: AsyncStorage<MessageInfo>

    override fun init(core: CoreContext) {
        this.core = core
    }

    override fun start(start: Future<Void>) {
        StorageLoader<MessageInfo>(core)
            .withDB(MTS_INDEX)
            .withValue(MessageInfo::class.java)
            .withPlugin(ElasticMap::class.java)
            .build { storage ->
                if (storage.succeeded()) {
                    this.storage = storage.result()
                    listenBlocks()
                    start.complete();
                } else {
                    start.fail(storage.cause())
                }
            }
    }

    private fun listenBlocks() {
        core.bus().consumer<JsonObject>(BLOCK_MINED) { block ->
            storage.put(MessageInfo(block.body())) {}
        }
    }

    class MessageInfo(json: JsonObject) : JsonObject(), Storable {
        init {
            this.mergeIn(json)
        }
        override fun getId(): String {
            return getString("hash")
        }
    }
}