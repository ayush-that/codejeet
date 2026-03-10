---
title: "How to Solve Most Beautiful Item for Each Query — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Beautiful Item for Each Query. Medium difficulty, 62.1% acceptance rate. Topics: Array, Binary Search, Sorting."
date: "2026-12-27"
category: "dsa-patterns"
tags: ["most-beautiful-item-for-each-query", "array", "binary-search", "sorting", "medium"]
---

# How to Solve Most Beautiful Item for Each Query

You're given items with prices and beauty values, and queries representing maximum prices. For each query, you need to find the maximum beauty among items priced at or below that query's price. The challenge is that queries need to be answered efficiently—a brute force check for each query would be too slow for large inputs.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
items = [[1,2],[3,2],[5,6],[10,4],[7,8]]
queries = [1,5,10,2]
```

**Step 1: Sort items by price**

```
Sorted items: [[1,2],[3,2],[5,6],[7,8],[10,4]]
```

**Step 2: Preprocess maximum beauty up to each price**
We want to know, for any price point, what's the maximum beauty we've seen so far:

- At price 1: max beauty = 2
- At price 3: max beauty = max(2, 2) = 2
- At price 5: max beauty = max(2, 6) = 6
- At price 7: max beauty = max(6, 8) = 8
- At price 10: max beauty = max(8, 4) = 8

So our preprocessed array becomes:

```
prices = [1, 3, 5, 7, 10]
max_beauty = [2, 2, 6, 8, 8]
```

**Step 3: Answer each query using binary search**

- Query 1: Find rightmost price ≤ 1 → price 1 → max beauty = 2
- Query 5: Find rightmost price ≤ 5 → price 5 → max beauty = 6
- Query 10: Find rightmost price ≤ 10 → price 10 → max beauty = 8
- Query 2: Find rightmost price ≤ 2 → price 1 → max beauty = 2

**Output:** `[2, 6, 8, 2]`

The key insight: by sorting items and tracking cumulative maximum beauty, we can answer any query in O(log n) time using binary search.

## Brute Force Approach

The most straightforward approach is to check every item for every query:

For each query price `q`, iterate through all items and find the maximum beauty among items with price ≤ `q`.

**Why this fails:**

- Time complexity: O(m × n) where m = number of queries, n = number of items
- With constraints up to 10⁵ items and 10⁵ queries, this becomes 10¹⁰ operations
- At 10⁸ operations per second (typical), this would take ~100 seconds—far too slow

<div class="code-group">

```python
# Time: O(m × n) | Space: O(1) excluding output
def maximumBeauty(items, queries):
    result = []
    for q in queries:
        max_beauty = 0
        for price, beauty in items:
            if price <= q:
                max_beauty = max(max_beauty, beauty)
        result.append(max_beauty)
    return result
```

```javascript
// Time: O(m × n) | Space: O(1) excluding output
function maximumBeauty(items, queries) {
  const result = [];
  for (const q of queries) {
    let maxBeauty = 0;
    for (const [price, beauty] of items) {
      if (price <= q) {
        maxBeauty = Math.max(maxBeauty, beauty);
      }
    }
    result.push(maxBeauty);
  }
  return result;
}
```

```java
// Time: O(m × n) | Space: O(1) excluding output
public int[] maximumBeauty(int[][] items, int[] queries) {
    int[] result = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        int maxBeauty = 0;
        for (int[] item : items) {
            if (item[0] <= queries[i]) {
                maxBeauty = Math.max(maxBeauty, item[1]);
            }
        }
        result[i] = maxBeauty;
    }
    return result;
}
```

</div>

## Optimized Approach

The optimization requires two key insights:

1. **Sorting enables binary search**: If we sort items by price, we can use binary search to find items with price ≤ query in O(log n) time instead of O(n).

2. **Cumulative maximum beauty**: After sorting by price, we need to ensure that for any price point, we know the maximum beauty among all items with price ≤ that point. This is crucial because:
   - Items with lower prices might have higher beauty
   - We want the maximum beauty _up to_ each price, not just at that exact price

**Step-by-step reasoning:**

1. Sort items by price (ascending)
2. Create an array of cumulative maximum beauty:
   - For each position i, store the maximum beauty from items[0] to items[i]
   - This ensures max_beauty[i] represents the best beauty for any price ≤ prices[i]
3. For each query:
   - Use binary search to find the rightmost item with price ≤ query
   - If found, use the corresponding cumulative maximum beauty
   - If not found (all items are more expensive), beauty = 0

**Why this works:**

- Sorting: O(n log n) one-time cost
- Cumulative max: O(n) one-time cost
- Each query: O(log n) via binary search
- Total: O((n + m) log n) which is efficient for 10⁵ items/queries

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + m) log n) | Space: O(n)
def maximumBeauty(items, queries):
    # Step 1: Sort items by price in ascending order
    # This allows us to use binary search later
    items.sort(key=lambda x: x[0])

    n = len(items)
    prices = [0] * n
    max_beauty_up_to = [0] * n

    # Step 2: Build arrays for prices and cumulative maximum beauty
    # For each position i, we store the maximum beauty seen so far
    # This handles cases where cheaper items might have higher beauty
    current_max = 0
    for i in range(n):
        price, beauty = items[i]
        prices[i] = price
        current_max = max(current_max, beauty)
        max_beauty_up_to[i] = current_max

    # Step 3: Answer each query using binary search
    result = []
    for q in queries:
        # Binary search to find rightmost price <= q
        left, right = 0, n - 1
        idx = -1  # Will store the index of rightmost valid price

        while left <= right:
            mid = left + (right - left) // 2
            if prices[mid] <= q:
                idx = mid  # This price is valid, but check if we can go further right
                left = mid + 1
            else:
                right = mid - 1

        # If we found a valid price, use its cumulative max beauty
        # Otherwise, no item is affordable (beauty = 0)
        if idx != -1:
            result.append(max_beauty_up_to[idx])
        else:
            result.append(0)

    return result
```

```javascript
// Time: O((n + m) log n) | Space: O(n)
function maximumBeauty(items, queries) {
  // Step 1: Sort items by price in ascending order
  items.sort((a, b) => a[0] - b[0]);

  const n = items.length;
  const prices = new Array(n);
  const maxBeautyUpTo = new Array(n);

  // Step 2: Build arrays for prices and cumulative maximum beauty
  let currentMax = 0;
  for (let i = 0; i < n; i++) {
    const [price, beauty] = items[i];
    prices[i] = price;
    currentMax = Math.max(currentMax, beauty);
    maxBeautyUpTo[i] = currentMax;
  }

  // Step 3: Answer each query using binary search
  const result = [];
  for (const q of queries) {
    // Binary search to find rightmost price <= q
    let left = 0,
      right = n - 1;
    let idx = -1; // Will store the index of rightmost valid price

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);
      if (prices[mid] <= q) {
        idx = mid; // This price is valid, but check if we can go further right
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // If we found a valid price, use its cumulative max beauty
    // Otherwise, no item is affordable (beauty = 0)
    if (idx !== -1) {
      result.push(maxBeautyUpTo[idx]);
    } else {
      result.push(0);
    }
  }

  return result;
}
```

```java
// Time: O((n + m) log n) | Space: O(n)
public int[] maximumBeauty(int[][] items, int[] queries) {
    // Step 1: Sort items by price in ascending order
    Arrays.sort(items, (a, b) -> Integer.compare(a[0], b[0]));

    int n = items.length;
    int[] prices = new int[n];
    int[] maxBeautyUpTo = new int[n];

    // Step 2: Build arrays for prices and cumulative maximum beauty
    int currentMax = 0;
    for (int i = 0; i < n; i++) {
        int price = items[i][0];
        int beauty = items[i][1];
        prices[i] = price;
        currentMax = Math.max(currentMax, beauty);
        maxBeautyUpTo[i] = currentMax;
    }

    // Step 3: Answer each query using binary search
    int[] result = new int[queries.length];
    for (int i = 0; i < queries.length; i++) {
        int q = queries[i];

        // Binary search to find rightmost price <= q
        int left = 0, right = n - 1;
        int idx = -1;  // Will store the index of rightmost valid price

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (prices[mid] <= q) {
                idx = mid;  // This price is valid, but check if we can go further right
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // If we found a valid price, use its cumulative max beauty
        // Otherwise, no item is affordable (beauty = 0)
        if (idx != -1) {
            result[i] = maxBeautyUpTo[idx];
        } else {
            result[i] = 0;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + m) log n)**

- Sorting items: O(n log n)
- Building cumulative max array: O(n)
- Processing m queries with binary search: O(m log n)
- Total: O((n + m) log n)

**Space Complexity: O(n)**

- We store two additional arrays of size n: prices and max_beauty_up_to
- The output array of size m is not counted in auxiliary space
- Sorting may use O(log n) or O(n) space depending on implementation

**Why this is optimal:**

- We must at least read all inputs: O(n + m)
- Binary search is the fastest way to find items by price in sorted data
- Any solution would need at least O(n log n) to sort or use a data structure that enables efficient querying

## Common Mistakes

1. **Forgetting to track cumulative maximum beauty**
   - Mistake: Just sorting and using binary search without tracking max beauty so far
   - Why it fails: Cheaper items might have lower beauty than more expensive ones
   - Fix: Always maintain `max_beauty_up_to[i] = max(beauty[0..i])`

2. **Using the wrong binary search variant**
   - Mistake: Finding first price ≤ query instead of last price ≤ query
   - Why it fails: We want all items up to the query price, not just one
   - Fix: Use "rightmost" binary search that continues searching right when `prices[mid] <= q`

3. **Not handling empty result case**
   - Mistake: Assuming binary search always finds a valid item
   - Why it fails: When query price < all item prices, no item is affordable
   - Fix: Check if `idx != -1` before accessing the array

4. **Inefficient query processing**
   - Mistake: Sorting queries or using two-pointer technique without considering all items
   - Why it fails: Queries aren't sorted in the problem, and two-pointer would be O(n + m) but requires sorting queries first
   - Fix: Stick with binary search per query unless you want to sort queries too (which adds O(m log m))

## When You'll See This Pattern

This "sort + cumulative max + binary search" pattern appears in many query optimization problems:

1. **Closest Room (Hard)** - Similar structure: sort rooms, preprocess, answer queries with binary search. The twist is finding the closest room ID rather than maximum value.

2. **Maximum Sum Queries (Hard)** - More complex version where you need to handle two dimensions and maintain a data structure for maximum values.

3. **Find Right Interval (Medium)** - Sort intervals by start point, then use binary search to find the right interval for each query.

4. **How Many Numbers Are Smaller Than the Current Number (Easy)** - Simpler version where you sort and use binary search to count items.

The core pattern: When you need to answer many queries about "maximum value where some condition ≤ threshold", sort by the condition, precompute cumulative maximums, and use binary search.

## Key Takeaways

1. **Sorting enables efficient querying**: When queries ask for items with values ≤ some threshold, sorting allows binary search in O(log n) time instead of linear search.

2. **Cumulative preprocessing is crucial**: For "maximum up to this point" queries, you must track the running maximum as you process sorted data. Don't assume values increase monotonically with the sort key.

3. **Rightmost binary search for "≤" queries**: When finding items with price ≤ query, you want the last valid item, not the first. Modify standard binary search to continue searching right when you find a valid item.

**Pattern recognition**: If a problem has (1) items with numeric attributes, (2) queries asking for maximum/minimum of another attribute subject to threshold constraints, and (3) many queries, think: sort + cumulative preprocess + binary search.

Related problems: [Closest Room](/problem/closest-room), [Find the Score of All Prefixes of an Array](/problem/find-the-score-of-all-prefixes-of-an-array), [Maximum Sum Queries](/problem/maximum-sum-queries)
