package se.idainfront.robdu

class Launcher
const val MTS_INDEX = "mts_message"
const val GRAPHQL_API = "ethereum.graphql"
const val BLOCK_MINED = "block.mined"

fun main(args: Array<String>) {
 com.codingchili.core.context.LaunchContext(*args).start()
}