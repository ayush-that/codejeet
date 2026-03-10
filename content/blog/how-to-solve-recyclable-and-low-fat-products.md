---
title: "How to Solve Recyclable and Low Fat Products — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Recyclable and Low Fat Products. Easy difficulty, 88.7% acceptance rate. Topics: Database."
date: "2026-05-06"
category: "dsa-patterns"
tags: ["recyclable-and-low-fat-products", "database", "easy"]
---

# How to Solve Recyclable and Low Fat Products

This problem asks us to find product IDs from a database table where products are both low fat and recyclable. While it's a straightforward SQL filtering exercise, it's interesting because it tests your understanding of basic SQL syntax, boolean logic in WHERE clauses, and how to handle enum/categorical data. The "trick" is recognizing that you need to filter on two independent conditions simultaneously.

## Visual Walkthrough

Let's walk through a concrete example. Suppose our `Products` table contains this data:

| product_id | low_fats | recyclable |
| ---------- | -------- | ---------- |
| 1          | Y        | N          |
| 2          | Y        | Y          |
| 3          | N        | Y          |
| 4          | N        | N          |
| 5          | Y        | Y          |

We're looking for products that are **both** low fat (`low_fats = 'Y'`) **and** recyclable (`recyclable = 'Y'`).

Let's examine each row:

- **Product 1**: Low fat = Yes, Recyclable = No → ❌ Fails (not recyclable)
- **Product 2**: Low fat = Yes, Recyclable = Yes → ✅ Passes (both conditions met)
- **Product 3**: Low fat = No, Recyclable = Yes → ❌ Fails (not low fat)
- **Product 4**: Low fat = No, Recyclable = No → ❌ Fails (neither condition)
- **Product 5**: Low fat = Yes, Recyclable = Yes → ✅ Passes (both conditions met)

So our result should be: `[2, 5]`

The SQL logic is simple: we need a `WHERE` clause that checks both conditions using the `AND` operator.

## Brute Force Approach

For database problems, there's rarely a "brute force" in the algorithmic sense, but there are inefficient or incorrect approaches beginners might try:

1. **Using OR instead of AND**: A common mistake is writing `WHERE low_fats = 'Y' OR recyclable = 'Y'`, which would return products that are EITHER low fat OR recyclable (or both). This would incorrectly include products 1 and 3 in our example.

2. **Two separate queries**: Some might try to solve this with two queries and then find the intersection, like:

   ```sql
   SELECT product_id FROM Products WHERE low_fats = 'Y'
   INTERSECT
   SELECT product_id FROM Products WHERE recyclable = 'Y'
   ```

   While this works, it's unnecessarily complex for such a simple filtering operation.

3. **Not considering data types**: The problem specifies `low_fats` and `recyclable` are `enum` types. While we compare them to string literals ('Y'/'N'), it's important to know that enums are stored efficiently and comparisons are fast.

The optimal approach is a single query with a properly constructed `WHERE` clause using `AND`.

## Optimal Solution

The solution is straightforward: select `product_id` from the `Products` table where both conditions are true. We use the `AND` operator to combine the conditions.

<div class="code-group">

```sql
-- Time: O(n) where n = number of rows in table
-- Space: O(k) where k = number of rows matching criteria
SELECT product_id
FROM Products
WHERE low_fats = 'Y' AND recyclable = 'Y';
-- Step 1: FROM Products - specifies the table to query from
-- Step 2: WHERE clause filters rows where BOTH conditions are true
--         low_fats = 'Y' checks if product is low fat
--         recyclable = 'Y' checks if product is recyclable
--         AND ensures both must be true for the row to be included
-- Step 3: SELECT product_id - returns only the product_id column for matching rows
```

</div>

That's the complete solution! For completeness, here are equivalent solutions in different database systems (though the SQL is standard):

<div class="code-group">

```python
# This is a SQL problem, but if we were implementing the logic in Python:
# Time: O(n) | Space: O(k) where k = number of matching products
def find_products(products):
    """
    products: list of tuples [(product_id, low_fats, recyclable), ...]
    Returns: list of product_ids that are both low fat and recyclable
    """
    result = []
    for product_id, low_fats, recyclable in products:
        # Check both conditions using AND
        if low_fats == 'Y' and recyclable == 'Y':
            result.append(product_id)
    return result
    # Step 1: Initialize empty result list
    # Step 2: Iterate through each product
    # Step 3: Check if both low_fats and recyclable are 'Y'
    # Step 4: If yes, add product_id to result
    # Step 5: Return all matching product_ids
```

```javascript
// This is a SQL problem, but if we were implementing the logic in JavaScript:
// Time: O(n) | Space: O(k) where k = number of matching products
function findProducts(products) {
  /**
   * products: array of objects [{product_id, low_fats, recyclable}, ...]
   * Returns: array of product_ids that are both low fat and recyclable
   */
  const result = [];
  for (const product of products) {
    // Check both conditions using AND (&&)
    if (product.low_fats === "Y" && product.recyclable === "Y") {
      result.push(product.product_id);
    }
  }
  return result;
  // Step 1: Initialize empty result array
  // Step 2: Iterate through each product object
  // Step 3: Check if both low_fats and recyclable are 'Y'
  // Step 4: If yes, add product_id to result
  // Step 5: Return all matching product_ids
}
```

```java
// This is a SQL problem, but if we were implementing the logic in Java:
// Time: O(n) | Space: O(k) where k = number of matching products
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<Integer> findProducts(List<Product> products) {
        /**
         * products: list of Product objects
         * Returns: list of product_ids that are both low fat and recyclable
         */
        List<Integer> result = new ArrayList<>();
        for (Product product : products) {
            // Check both conditions using AND (&&)
            if (product.low_fats.equals("Y") && product.recyclable.equals("Y")) {
                result.add(product.product_id);
            }
        }
        return result;
        // Step 1: Initialize empty result list
        // Step 2: Iterate through each Product object
        // Step 3: Check if both low_fats and recyclable are "Y"
        // Step 4: If yes, add product_id to result
        // Step 5: Return all matching product_ids
    }

    // Assuming a Product class exists:
    class Product {
        int product_id;
        String low_fats;
        String recyclable;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of rows in the `Products` table. The database must scan each row to check the WHERE conditions. In the worst case, it examines every row.

**Space Complexity:** O(k) where k is the number of rows that match both conditions. The result set stores the `product_id` for each matching product. In the worst case where all products match (k = n), space would be O(n).

**Why these complexities matter:**

- For large tables with millions of rows, a full table scan (O(n)) can be slow. In practice, databases use indexes to optimize such queries.
- If we had indexes on `low_fats` and `recyclable`, the database could use them to find matching rows faster than scanning the entire table.

## Common Mistakes

1. **Using OR instead of AND**: This is the most common mistake. `WHERE low_fats = 'Y' OR recyclable = 'Y'` returns products that satisfy EITHER condition, not BOTH. Always double-check your boolean logic.

2. **Forgetting single quotes around 'Y'**: Since `low_fats` and `recyclable` are enum/string types, you must compare them to string literals: `low_fats = 'Y'` not `low_fats = Y`. The latter would try to compare to a column named `Y` or cause a syntax error.

3. **Including unnecessary columns**: The problem asks only for `product_id`. Some candidates might write `SELECT *` or include other columns, which wastes resources and doesn't match the expected output format.

4. **Case sensitivity issues**: While the problem uses 'Y'/'N', in real databases, enum comparisons might be case-sensitive. If unsure, you could use `UPPER(low_fats) = 'Y'` or check the database documentation.

5. **Not considering NULL values**: Though not present in this problem, in real scenarios, columns might contain NULL. `NULL = 'Y'` evaluates to NULL (not true), so rows with NULL in either column won't match. If you need to handle NULLs, you'd use `IS NULL` comparisons.

## When You'll See This Pattern

This problem teaches fundamental SQL filtering patterns that appear in many database problems:

1. **Combining multiple conditions**: Problems like "Find Customers Who Never Order" (LeetCode 183) or "Employees Earning More Than Their Managers" (LeetCode 181) require filtering with multiple conditions, often using `AND`/`OR`.

2. **Basic SELECT-WHERE queries**: This is the foundation for almost all SQL problems. Once you master simple filtering, you can build up to joins, aggregations, and subqueries.

3. **Data categorization problems**: Similar patterns appear in problems where you need to categorize or filter data based on multiple attributes, like "Big Countries" (LeetCode 595) which asks for countries with area OR population above certain thresholds.

4. **Interview screening questions**: Many companies use simple SQL problems like this one as initial screening questions to ensure candidates have basic database knowledge before moving to more complex problems.

## Key Takeaways

1. **Master the WHERE clause**: The `WHERE` clause with `AND`/`OR` operators is fundamental to SQL. Practice constructing correct boolean logic for multiple conditions.

2. **Read the problem carefully**: The distinction between "AND" (both must be true) and "OR" (at least one must be true) is critical. Misreading this is the most common error.

3. **Start simple, then optimize**: For SQL problems, always write the simplest correct solution first (like our single SELECT statement). Only consider optimization (indexes, query restructuring) if needed for performance.

4. **Understand your data types**: Knowing whether you're comparing strings, numbers, or enums affects how you write comparisons (quotes for strings, no quotes for numbers).

[Practice this problem on CodeJeet](/problem/recyclable-and-low-fat-products)
