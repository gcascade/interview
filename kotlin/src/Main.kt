class LocalGameShop(val stock: MutableMap<String, Int> = mutableMapOf(), val name: String, var balance: Double) {

    companion object {
        const val BOARD_GAME = "Board Game"
        const val BOOSTER_PACK = "Booster Pack"
        const val BOOSTER_PACK_2 = "Booster Pack 2"
        const val BOOSTER_PACK_DISPLAY = "Booster Pack Display (30 packs)"
        const val MINIATURE = "Miniature"
        const val MINIATURE_PAINT = "Miniature Paint"
        const val MINIATURE_PAINT_PROMO_PACK = "2 Miniatures + Paint Pack"

        const val BOARD_GAME_P=50.0
        const val BOOSTER_PACK_P=5.0
        const val BOOSTER_PACK_2_P=5.0
        const val MINIATURE_P = 30.0
        const val MINIATURE_PAINT_P=10.0
    }

    fun getPrice(item: String, quantity: Int, discount: Boolean, restock: Boolean = false): Double {
        var price: Double
        var currentStock: Int

        if (item.equals(BOARD_GAME)) {
            price = BOARD_GAME_P
        } else if (item.equals(BOOSTER_PACK)) price = BOOSTER_PACK_P
        else if (item.equals(BOOSTER_PACK_2)) price = BOOSTER_PACK_2_P
        else if (item.equals(BOOSTER_PACK_DISPLAY)) {
            price = 30 * BOOSTER_PACK_P
        }
        else if (item.equals(MINIATURE))
        {
            price = MINIATURE_P
        }
        else if (item.equals(MINIATURE_PAINT)) price = MINIATURE_PAINT_P
        else if (item.equals(MINIATURE_PAINT_PROMO_PACK)) {
            price = MINIATURE_PAINT_P + 2 * MINIATURE_P - 5
        }
        else throw IllegalArgumentException("Item " + item + " is not available in stock")

        if (quantity <= 0) {
            throw IllegalArgumentException("Quantity must be greater than zero")
        }
        currentStock = stock.getOrDefault(item, 0)

        if (!restock && quantity > currentStock) {
            throw IllegalArgumentException("Not enough stock for item: $item. Available: $currentStock, Requested: $quantity")
        }
        if (discount) {
            if (item.equals(BOARD_GAME)) {
                price *= 0.9
            } else if (item.equals(BOOSTER_PACK_2)) {
                price *= 0.95
            } else if (item.equals(MINIATURE)) {
                price *= 0.85
            } else price = price // No discount for other items
        }

        return price * quantity
    }

    fun sell(item: String, quantity: Int, discount: Boolean = false): Unit {
        if (!stock.contains(item)) {
            throw IllegalArgumentException("Item " + item + " is not available in stock")
        }

        if (quantity <= 0) {
            throw IllegalArgumentException("Quantity must be greater than zero")
        }
        val currentStock = stock[item] ?: 0

        if (quantity > currentStock) {
            throw IllegalArgumentException("Not enough stock for item: $item. Available: $currentStock, Requested: $quantity")
        }
        val cost = getPrice(item, quantity, discount)
        stock.put(item, currentStock - quantity)
        balance += cost
    }

    fun restock(item: String, quantity: Int) {
        if (quantity <= 0)
            throw IllegalArgumentException("Quantity must be greater than zero")
        val currentStock = stock.getOrDefault(item, 0)
        val cost = getPrice(item, quantity, false, true) * 0.7 // Assuming restock cost is 70% of the retail price
        stock[item] = currentStock + quantity
        balance -= cost
    }
}

fun main() {
    val localGameShop = LocalGameShop(mutableMapOf(),"My Local Game Shop", 1000.0)
    localGameShop.stock.put(LocalGameShop.BOARD_GAME, 100)
    localGameShop.stock.put(LocalGameShop.BOOSTER_PACK, 50)
    localGameShop.stock.put(LocalGameShop.BOOSTER_PACK_2, 30)
    localGameShop.stock.put(LocalGameShop.BOOSTER_PACK_DISPLAY, 1)
    localGameShop.stock.put(LocalGameShop.MINIATURE, 200)
    localGameShop.stock.put(LocalGameShop.MINIATURE_PAINT, 100)
    localGameShop.stock.put(LocalGameShop.MINIATURE_PAINT_PROMO_PACK, 100)

    try {
        println("Cost of 2 Board Games: " + localGameShop.getPrice(LocalGameShop.BOARD_GAME, 2, false))

        localGameShop.sell(LocalGameShop.BOOSTER_PACK, 30)
        println("Quantity of Booster in stock: " + localGameShop.stock[LocalGameShop.BOOSTER_PACK])
        println("Store balance after sale: " + localGameShop.balance)

        localGameShop.restock(LocalGameShop.BOOSTER_PACK, 100)
        println("Quantity of Booster in stock after restock: " + localGameShop.stock[LocalGameShop.BOOSTER_PACK])
        println("Store balance after restock: " + localGameShop.balance)

        localGameShop.sell(LocalGameShop.MINIATURE_PAINT_PROMO_PACK, 10, true)
        println("Store balance after selling Miniature Paint Promo Pack: " + localGameShop.balance)
    } catch (e: IllegalArgumentException) {
        println(e.message)
    }
}