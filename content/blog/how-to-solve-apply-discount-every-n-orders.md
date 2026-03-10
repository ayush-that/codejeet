---
title: "How to Solve Apply Discount Every n Orders — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Discount Every n Orders. Medium difficulty, 65.4% acceptance rate. Topics: Array, Hash Table, Design."
date: "2029-05-19"
category: "dsa-patterns"
tags: ["apply-discount-every-n-orders", "array", "hash-table", "design", "medium"]
---

## Problem Restatement

We need to design a supermarket checkout system that tracks product prices and applies a discount every `n` orders. The challenge is efficiently handling price lookups for products and applying percentage discounts to entire orders at specific intervals. The interesting part is combining real-time price management with periodic discount logic in a way that scales for many customers.

## Visual Walkthrough

Let's trace through a small example:

**Initialization:**

- `products = [1, 2, 3]`
- `prices = [100, 200, 300]`
- `Cashier(3, [1,2,3], [100,200,300])` creates price mapping: {1:100, 2:200, 3:300}
- Discount every `n = 3` orders, discount = 50% (0.5)

**Order 1:**

- `getBill([1,2], [1,2])` → Product 1: 1 × $100 = $100, Product 2: 2 × $200 = $400
- Total = $500, order count = 1 (not divisible by 3) → No discount → Return 500

**Order 2:**

- `getBill([3,2], [2,1])` → Product 3: 2 × $300 = $600, Product 2: 1 × $200 = $200
- Total = $800, order count = 2 (not divisible by 3) → No discount → Return 800

**Order 3:**

- `getBill([1,3], [3,1])` → Product 1: 3 × $100 = $300, Product 3: 1 × $300 = $300
- Total = $600, order count = 3 (divisible by 3!) → Apply 50% discount: 600 × 0.5 = 300 → Return 300

**Order 4:**

- Reset counter, start next cycle. Total = $400, order count = 1 → No discount → Return 400

## Brute Force Approach

A naive approach would be to store products and prices as parallel arrays and search linearly for each product during billing:

1. For each product in the bill, scan through the `products` array to find its index
2. Use that index to get the price from `prices` array
3. Calculate total and apply discount if needed

**Why this fails:**

- Each price lookup takes O(m) time where m = number of products
- For a bill with k items, this becomes O(k × m) per order
- With thousands of products and frequent orders, this becomes prohibitively slow
- The problem requires O(1) price lookups to handle large-scale operations efficiently

## Optimized Approach

The key insight is that we need **constant-time price lookups** for products. This immediately suggests using a hash map (dictionary) to map product IDs to their prices.

**Step-by-step reasoning:**

1. **Initialization phase:** Build a hash map from product IDs to prices. This gives us O(1) lookups during billing.
2. **Billing phase:** For each product in the bill, look up its price in the hash map, multiply by quantity, and accumulate the total.
3. **Discount logic:** Maintain an order counter. When `counter % n == 0`, apply the discount percentage to the total bill.
4. **Important detail:** The discount applies to the **entire bill amount**, not individual items.

**Why this works:**

- Hash map lookups are O(1) average case, making billing O(k) where k = items in the bill
- The discount check is O(1) with simple modulo arithmetic
- We avoid expensive linear searches during each billing operation

## Optimal Solution

<div class="code-group">

```python
class Cashier:
    # Time: O(1) per getBill call, O(p) initialization where p = number of products
    # Space: O(p) for price mapping, O(1) additional space per instance

    def __init__(self, n: int, discount: int, products: List[int], prices: List[int]):
        """
        Initialize the cashier system.

        Args:
            n: Apply discount every n orders
            discount: Percentage discount (e.g., 50 means 50% off)
            products: List of product IDs
            prices: Corresponding prices for each product
        """
        self.n = n  # Discount frequency
        self.discount = discount  # Discount percentage
        self.order_count = 0  # Track number of orders processed

        # Create hash map for O(1) price lookups
        # Key insight: Map product ID directly to price
        self.price_map = {}
        for product_id, price in zip(products, prices):
            self.price_map[product_id] = price

    def getBill(self, product: List[int], amount: List[int]) -> float:
        """
        Calculate bill for current order with possible discount.

        Args:
            product: List of product IDs in the order
            amount: Corresponding quantities for each product

        Returns:
            Total bill amount after applying discount if applicable
        """
        self.order_count += 1  # Increment order counter
        total = 0.0

        # Calculate total by looking up each product's price
        # Using zip to iterate through products and amounts together
        for product_id, quantity in zip(product, amount):
            # O(1) price lookup using hash map
            price = self.price_map[product_id]
            total += price * quantity

        # Apply discount if this is the nth order
        # Important: Check divisibility AFTER incrementing counter
        if self.order_count % self.n == 0:
            # Convert discount percentage to multiplier
            # e.g., 50% discount means pay only 50% of total
            discount_multiplier = (100 - self.discount) / 100.0
            total *= discount_multiplier

        return total
```

```javascript
// Time: O(1) per getBill call, O(p) initialization where p = number of products
// Space: O(p) for price mapping, O(1) additional space per instance

class Cashier {
  /**
   * Initialize the cashier system.
   * @param {number} n - Apply discount every n orders
   * @param {number} discount - Percentage discount (e.g., 50 means 50% off)
   * @param {number[]} products - List of product IDs
   * @param {number[]} prices - Corresponding prices for each product
   */
  constructor(n, discount, products, prices) {
    this.n = n; // Discount frequency
    this.discount = discount; // Discount percentage
    this.orderCount = 0; // Track number of orders processed

    // Create hash map for O(1) price lookups
    // Using Map for cleaner API than plain object
    this.priceMap = new Map();
    for (let i = 0; i < products.length; i++) {
      this.priceMap.set(products[i], prices[i]);
    }
  }

  /**
   * Calculate bill for current order with possible discount.
   * @param {number[]} product - List of product IDs in the order
   * @param {number[]} amount - Corresponding quantities for each product
   * @return {number} Total bill amount after applying discount if applicable
   */
  getBill(product, amount) {
    this.orderCount++; // Increment order counter
    let total = 0;

    // Calculate total by looking up each product's price
    for (let i = 0; i < product.length; i++) {
      const productId = product[i];
      const quantity = amount[i];
      // O(1) price lookup using Map
      const price = this.priceMap.get(productId);
      total += price * quantity;
    }

    // Apply discount if this is the nth order
    // Important: Check divisibility AFTER incrementing counter
    if (this.orderCount % this.n === 0) {
      // Convert discount percentage to multiplier
      const discountMultiplier = (100 - this.discount) / 100;
      total *= discountMultiplier;
    }

    return total;
  }
}
```

```java
// Time: O(1) per getBill call, O(p) initialization where p = number of products
// Space: O(p) for price mapping, O(1) additional space per instance

class Cashier {
    private int n;  // Discount frequency
    private int discount;  // Discount percentage
    private int orderCount;  // Track number of orders processed
    private Map<Integer, Integer> priceMap;  // Product ID -> Price mapping

    /**
     * Initialize the cashier system.
     * @param n Apply discount every n orders
     * @param discount Percentage discount (e.g., 50 means 50% off)
     * @param products List of product IDs
     * @param prices Corresponding prices for each product
     */
    public Cashier(int n, int discount, int[] products, int[] prices) {
        this.n = n;
        this.discount = discount;
        this.orderCount = 0;

        // Create hash map for O(1) price lookups
        // HashMap provides average O(1) lookups
        this.priceMap = new HashMap<>();
        for (int i = 0; i < products.length; i++) {
            this.priceMap.put(products[i], prices[i]);
        }
    }

    /**
     * Calculate bill for current order with possible discount.
     * @param product List of product IDs in the order
     * @param amount Corresponding quantities for each product
     * @return Total bill amount after applying discount if applicable
     */
    public double getBill(int[] product, int[] amount) {
        this.orderCount++;  // Increment order counter
        double total = 0.0;

        // Calculate total by looking up each product's price
        for (int i = 0; i < product.length; i++) {
            int productId = product[i];
            int quantity = amount[i];
            // O(1) price lookup using HashMap
            int price = this.priceMap.get(productId);
            total += price * quantity;
        }

        // Apply discount if this is the nth order
        // Important: Check divisibility AFTER incrementing counter
        if (this.orderCount % this.n == 0) {
            // Convert discount percentage to multiplier
            double discountMultiplier = (100.0 - this.discount) / 100.0;
            total *= discountMultiplier;
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization (`__init__`/constructor):** O(p) where p = number of products. We need to build the hash map by iterating through all products once.
- **Billing (`getBill`):** O(k) where k = number of items in the current bill. Each product lookup is O(1) average case due to hash map, and we perform k lookups.

**Space Complexity:**

- **Overall:** O(p) for storing the price mapping in the hash map. Each product-price pair requires constant space.
- **Per call:** O(1) additional space beyond the stored mapping. We only use a few variables (total, counter, etc.).

## Common Mistakes

1. **Linear search during billing:** Searching through the products array for each item results in O(k × p) time per bill. Always use a hash map for O(1) lookups.

2. **Discount timing error:** Applying discount when `counter % n == 0` but incrementing counter AFTER the check. The first order should be count 1, not 0. Correct order: increment counter, then check `counter % n == 0`.

3. **Integer division for discount:** Using integer arithmetic like `total * (100 - discount) / 100` instead of floating point. This truncates fractional cents. Always use floating point: `total * (100.0 - discount) / 100.0`.

4. **Not handling empty bills:** While the problem guarantees non-empty inputs, in real interviews you might need to handle edge cases. Always consider what happens with empty product/amount arrays.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Hash Map for Fast Lookups:** Whenever you need to associate keys with values and perform frequent lookups, hash maps are the go-to solution. Similar problems:
   - **Two Sum:** Use hash map to store seen numbers for O(1) complement lookup
   - **LRU Cache:** Combine hash map with linked list for O(1) operations
   - **Design Underground System:** Use nested hash maps to track travel times

2. **Stateful Counters with Periodic Actions:** Problems that require actions every N occurrences:
   - **Logger Rate Limiter:** Track last timestamp for each message
   - **Design Hit Counter:** Count hits in time windows
   - **Moving Average from Data Stream:** Maintain running sum and count

## Key Takeaways

1. **Hash maps enable O(1) lookups:** When you need to find values by key repeatedly, precompute a mapping instead of searching linearly each time.

2. **Modulo arithmetic for periodic events:** Use `counter % n == 0` to trigger actions every nth occurrence. Remember to increment counter before checking.

3. **Design problems often combine simple concepts:** This problem isn't algorithmically complex but tests your ability to combine hash maps, counters, and arithmetic into a clean, efficient design.

Related problems: [Apply Discount to Prices](/problem/apply-discount-to-prices)
