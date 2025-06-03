class LocalGameShop {
    static readonly BOARD_GAME = "Board Game";
    static readonly BOOSTER_PACK = "Booster Pack";
    static readonly BOOSTER_PACK_2 = "Booster Pack 2";
    static readonly BOOSTER_PACK_DISPLAY = "Booster Pack Display (30 packs)";
    static readonly MINIATURE = "Miniature";
    static readonly MINIATURE_PAINT = "Miniature Paint";
    static readonly MINIATURE_PAINT_PROMO_PACK = "2 Miniatures + Paint Pack";

    static readonly BOARD_GAME_P = 50.0;
    static readonly BOOSTER_PACK_P = 5.0;
    static readonly BOOSTER_PACK_2_P = 5.0;
    static readonly MINIATURE_P = 30.0;
    static readonly MINIATURE_PAINT_P = 10.0;

    stock: Map<string, number>;
    name: string;
    balance: number;

    constructor(stock: Map<string, number> = new Map(), name: string, balance: number) {
        this.stock = stock;
        this.name = name;
        this.balance = balance;
    }

    getPrice(item: string, quantity: number, discount: boolean, restock: boolean = false): number {
        let price: number;
        let currentStock: number;

        if (item === LocalGameShop.BOARD_GAME) {
            price = LocalGameShop.BOARD_GAME_P;
        } else if (item === LocalGameShop.BOOSTER_PACK) price = LocalGameShop.BOOSTER_PACK_P;
        else if (item === LocalGameShop.BOOSTER_PACK_2) price = LocalGameShop.BOOSTER_PACK_2_P;
        else if (item === LocalGameShop.BOOSTER_PACK_DISPLAY) {
            price = 30 * LocalGameShop.BOOSTER_PACK_P;
        }
        else if (item === LocalGameShop.MINIATURE) {
            price = LocalGameShop.MINIATURE_P;
        }
        else if (item === LocalGameShop.MINIATURE_PAINT) price = LocalGameShop.MINIATURE_PAINT_P;
        else if (item === LocalGameShop.MINIATURE_PAINT_PROMO_PACK) {
            price = LocalGameShop.MINIATURE_PAINT_P + 2 * LocalGameShop.MINIATURE_P - 5;
        } else throw new Error(`Item ${item} is not available in stock`);

        if (quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
        currentStock = this.stock.get(item) ?? 0;

        if (!restock && quantity > currentStock) {
            throw new Error(`Not enough stock for item: ${item}. Available: ${currentStock}, Requested: ${quantity}`);
        }
        if (discount) {
            if (item === LocalGameShop.BOARD_GAME) {
                price *= 0.9;
            } else if (item === LocalGameShop.BOOSTER_PACK_2) {
                price *= 0.95;
            } else if (item === LocalGameShop.MINIATURE) {
                price *= 0.85;
            } else price = price // No discount for other items
        }

        return price * quantity;
    }

    sell(item: string, quantity: number, discount: boolean = false): void {
        if (!this.stock.has(item)) {
            throw new Error(`Item ${item} is not available in stock`);
        }
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
        const currentStock = this.stock.get(item) ?? 0;
        if (quantity > currentStock) {
            throw new Error(`Not enough stock for item: ${item}. Available: ${currentStock}, Requested: ${quantity}`);
        }
        const cost = this.getPrice(item, quantity, discount);
        this.stock.set(item, currentStock - quantity);
        this.balance += cost;
    }

    restock(item: string, quantity: number): void {
        if (quantity <= 0)
            throw new Error("Quantity must be greater than zero");
        const currentStock = this.stock.get(item) ?? 0;
        const cost = this.getPrice(item, quantity, false, true) * 0.7; // Assuming restock cost is 70% of the retail price
        this.stock.set(item, currentStock + quantity);
        this.balance -= cost;
    }
}

const localGameShop = new LocalGameShop(new Map(), "My Local Game Shop", 1000.0);
localGameShop.stock.set(LocalGameShop.BOARD_GAME, 100);
localGameShop.stock.set(LocalGameShop.BOOSTER_PACK, 50);
localGameShop.stock.set(LocalGameShop.BOOSTER_PACK_2, 30);
localGameShop.stock.set(LocalGameShop.BOOSTER_PACK_DISPLAY, 1);
localGameShop.stock.set(LocalGameShop.MINIATURE, 200);
localGameShop.stock.set(LocalGameShop.MINIATURE_PAINT, 100);
localGameShop.stock.set(LocalGameShop.MINIATURE_PAINT_PROMO_PACK, 100);

try {
    console.log("Cost of 2 Board Games: " + localGameShop.getPrice(LocalGameShop.BOARD_GAME, 2, false));

    localGameShop.sell(LocalGameShop.BOOSTER_PACK, 30);
    console.log("Quantity of Booster in stock: " + localGameShop.stock.get(LocalGameShop.BOOSTER_PACK));
    console.log("Store balance after sale: " + localGameShop.balance);

    localGameShop.restock(LocalGameShop.BOOSTER_PACK, 100);
    console.log("Quantity of Booster in stock after restock: " + localGameShop.stock.get(LocalGameShop.BOOSTER_PACK));
    console.log("Store balance after restock: " + localGameShop.balance);

    localGameShop.sell(LocalGameShop.MINIATURE_PAINT_PROMO_PACK, 10, true);
    console.log("Store balance after selling Miniature Paint Promo Pack: " + localGameShop.balance);
} catch (e: any) {
    console.log(e.message);
}