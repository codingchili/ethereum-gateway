package se.idainfront.robdu

import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import java.time.LocalDateTime
import kotlin.random.Random

val actors = listOf(
    "google",
    "facebook",
    "yahoo",
    "robin",
    "robin",
    "robin",
    "idainfront"
)
val products = listOf(
    "OrderConfirmation",
    "Ticket",
    "Login",
    "UpdateMsg",
    "ArchiveMsg",
    "Ping",
    "SomeRequest",
    "Ping",
    "Ping"
)
val plugins = listOf(
    "se.idainfront.beth.plugins.MeasureMeowLoudnessPlugin",
    "se.idainfront.beth.plugins.WaterThePlantsPlugin",
    "se.idainfront.beth.plugins.FeedTheCatPlugin"
)

fun enrichQuery(json: JsonObject): JsonObject {
    return if (json.containsKey("data") && json.getJsonObject("data").containsKey("block")) {
        enrichStream(
            json.getJsonObject("data")
                .getJsonObject("block")
        ).put("route", "query")
    } else {
        json.put("route", "query");
    }
}

// dev class to enrich data coming from the chain to make it appear more "real"
// the events are realtime sourced from chain, we just add a bit of message content
// as we don't yet have the whisper rpc call in the web3j library.
fun enrichStream(json: JsonObject): JsonObject {
    // always use same seed for the given block - to make searches return consistent mock data.
    val random = Random(json.getString("hash", "0x00").hashCode())
    json.put("product", products.random(random))
    json.put("senderText", actors.random(random))
    json.put("receiverText", actors.random(random))
    json.put("plugin", plugins.random(random))
    json.put("time", LocalDateTime.now().minusHours(2).toString()) // jenkins timezone correction.
    json.put("route", "stream")
    json.put("transactions", json.getJsonArray("transactions", JsonArray()).size())
    json.put(
        "payload",
        "{'message': 'hello iipax', urgent: ${listOf(true, false).random(random)}}}"
    )
    return json
}