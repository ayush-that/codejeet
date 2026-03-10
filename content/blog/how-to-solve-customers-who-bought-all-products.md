---
title: "How to Solve Customers Who Bought All Products — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Customers Who Bought All Products. Medium difficulty, 63.7% acceptance rate. Topics: Database."
date: "2027-06-04"
category: "dsa-patterns"
tags: ["customers-who-bought-all-products", "database", "medium"]
---

# How to Find Customers Who Bought All Products

This problem asks us to identify customers who have purchased every product available in the database. The tricky part is that the `Customer` table contains duplicate purchase records, and we need to compare each customer's unique product purchases against the complete product catalog. This is essentially a "set containment" problem in SQL, where we need to find customers whose purchased product set contains all available products.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Product table (not given but implied):**

```
product_key
-----------
1
2
3
```

(There are 3 distinct products in total)

**Customer table:**

```
customer_id | product_key
----------- | -----------
1           | 1
1           | 2
1           | 3
2           | 1
2           | 2
3           | 1
3           | 1  ← duplicate purchase
3           | 2
```

**Step-by-step reasoning:**

1. First, we need to know how many distinct products exist. From the product catalog, we see there are 3 products (keys 1, 2, 3).

2. For customer 1: They purchased products 1, 2, and 3. That's all 3 products → they should be included.

3. For customer 2: They purchased only products 1 and 2. Missing product 3 → they should NOT be included.

4. For customer 3: They purchased products 1 (twice) and 2. Even though they made multiple purchases, they're still missing product 3 → they should NOT be included.

The key insight is that we need to:

1. Count how many distinct products each customer bought
2. Compare that count to the total number of distinct products available

## Brute Force Approach

A naive approach might try to check each customer against each product individually. One might think: "For each customer, check if they have a purchase record for every product." This could be implemented with nested queries or multiple joins.

However, this approach has several problems:

1. It would be extremely inefficient with O(n × m) complexity where n is number of customers and m is number of products
2. It doesn't handle duplicates well
3. The SQL would be complex and hard to maintain

The brute force approach fails because it doesn't leverage the mathematical insight that if a customer has purchased X distinct products, and there are exactly X products total, then they must have purchased all products.

## Optimized Approach

The key insight is that this is a **set comparison problem**. Instead of checking each product individually for each customer, we can:

1. **Count total distinct products** - This gives us our target number
2. **Count distinct products per customer** - This tells us how many unique products each customer bought
3. **Compare the two counts** - If they match, the customer bought all products

This works because:

- If a customer bought ALL products, they must have purchased at least one of each distinct product
- The number of distinct products they purchased must equal the total number of distinct products
- Duplicate purchases don't affect the distinct count, which handles the "may contain duplicates" condition perfectly

We need to use `COUNT(DISTINCT ...)` to handle duplicates correctly. The solution becomes a simple aggregation with filtering using `HAVING` clause.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```sql
-- Time: O(n) where n is number of rows in Customer table
-- Space: O(m) where m is number of distinct customers
SELECT customer_id
FROM Customer
GROUP BY customer_id
-- For each customer, count how many distinct products they bought
HAVING COUNT(DISTINCT product_key) = (
    -- Compare against the total number of distinct products available
    SELECT COUNT(DISTINCT product_key)
    FROM Customer
)
```

```python
# Note: Since this is a SQL problem, Python/Java/JS solutions would typically
# involve database queries. However, if we were to implement the logic in code:

# Time: O(n + m) where n is total purchases, m is distinct customers
# Space: O(p + c) where p is distinct products, c is customer-product mappings
def find_customers_with_all_products(customer_data, all_products):
    """
    customer_data: list of tuples [(customer_id, product_key), ...]
    all_products: set of all available product keys
    """
    from collections import defaultdict

    # Step 1: Build a dictionary mapping customer_id to set of purchased products
    customer_products = defaultdict(set)

    for customer_id, product_key in customer_data:
        customer_products[customer_id].add(product_key)

    # Step 2: Get total number of distinct products
    total_products_count = len(all_products)

    # Step 3: Find customers whose distinct product count equals total products
    result = []
    for customer_id, products in customer_products.items():
        if len(products) == total_products_count:
            result.append(customer_id)

    return result
```

```java
// Note: Since this is a SQL problem, Java solution would typically use JDBC.
// Here's the algorithmic equivalent:

// Time: O(n + m) where n is total purchases, m is distinct customers
// Space: O(p + c) where p is distinct products, c is customer-product mappings
import java.util.*;

public class Solution {
    public List<Integer> findCustomersWithAllProducts(int[][] customerData, Set<Integer> allProducts) {
        // Step 1: Map each customer to their unique purchased products
        Map<Integer, Set<Integer>> customerProducts = new HashMap<>();

        for (int[] purchase : customerData) {
            int customerId = purchase[0];
            int productKey = purchase[1];

            customerProducts.putIfAbsent(customerId, new HashSet<>());
            customerProducts.get(customerId).add(productKey);
        }

        // Step 2: Get total number of distinct products
        int totalProductsCount = allProducts.size();

        // Step 3: Find customers with all products
        List<Integer> result = new ArrayList<>();
        for (Map.Entry<Integer, Set<Integer>> entry : customerProducts.entrySet()) {
            if (entry.getValue().size() == totalProductsCount) {
                result.add(entry.getKey());
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- The SQL solution scans the Customer table twice: once for the main query and once for the subquery
- Each scan processes all rows in the table, so time complexity is linear in the number of rows
- The GROUP BY operation uses hashing which is O(n) on average

**Space Complexity: O(m + p)**

- `m`: Number of distinct customers (for grouping)
- `p`: Number of distinct products (for counting)
- The database needs to maintain hash tables for GROUP BY and for DISTINCT operations
- In practice, this is efficient as it only stores unique values, not all rows

## Common Mistakes

1. **Forgetting DISTINCT in COUNT()**:
   - Mistake: Using `COUNT(product_key)` instead of `COUNT(DISTINCT product_key)`
   - Result: Duplicate purchases inflate the count, causing incorrect results
   - Fix: Always use `DISTINCT` when counting products per customer

2. **Incorrect subquery placement**:
   - Mistake: Putting the total products count query in the WHERE clause instead of HAVING
   - Result: Syntax error or incorrect filtering
   - Fix: Remember: WHERE filters rows, HAVING filters groups. We need HAVING because we're filtering after aggregation.

3. **Assuming a separate Product table exists**:
   - Mistake: Joining with a Product table that isn't given in the problem
   - Result: Solution won't work if only Customer table is provided
   - Fix: Derive total products from the Customer table itself using `SELECT COUNT(DISTINCT product_key) FROM Customer`

4. **Not handling NULL values correctly**:
   - Mistake: The problem states customer_id is not NULL, but not checking product_key
   - Result: If product_key could be NULL, COUNT(DISTINCT) would ignore NULLs, which might be correct but worth noting
   - Fix: Be explicit about NULL handling if needed

## When You'll See This Pattern

This "set containment via counting" pattern appears in various database and algorithmic problems:

1. **LeetCode 569 - Employees Earning More Than Their Managers**:
   - Similar use of self-joins and comparisons
   - Teaches how to compare aggregated values within the same table

2. **LeetCode 183 - Customers Who Never Order**:
   - Another customer-analysis problem using NOT EXISTS or LEFT JOIN
   - Similar thought process but looking for absence rather than completeness

3. **LeetCode 182 - Duplicate Emails**:
   - Uses GROUP BY and HAVING with COUNT to find duplicates
   - Same aggregation pattern but with different filtering condition

4. **LeetCode 580 - Count Student Number in Departments**:
   - Involves counting and grouping across tables
   - Similar aggregation logic but with table joins

The core pattern is: when you need to find records that satisfy a condition based on aggregated/computed properties, think GROUP BY + HAVING.

## Key Takeaways

1. **Set problems in SQL often reduce to counting distinct elements**: When checking if one set contains another, compare counts of distinct elements after appropriate filtering.

2. **Know your SQL clause purposes**: WHERE filters rows before grouping, HAVING filters groups after aggregation. Use HAVING when your condition involves aggregate functions like COUNT(), SUM(), or AVG().

3. **Duplicates require DISTINCT**: When a problem mentions "may contain duplicates" and you need to count unique occurrences, always consider COUNT(DISTINCT column).

4. **Self-contained solutions are robust**: When possible, derive all necessary information from the given table(s) rather than assuming additional tables exist.

[Practice this problem on CodeJeet](/problem/customers-who-bought-all-products)
