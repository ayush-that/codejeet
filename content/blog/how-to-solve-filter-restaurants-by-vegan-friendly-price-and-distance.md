---
title: "How to Solve Filter Restaurants by Vegan-Friendly, Price and Distance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Filter Restaurants by Vegan-Friendly, Price and Distance. Medium difficulty, 64.1% acceptance rate. Topics: Array, Sorting."
date: "2029-01-02"
category: "dsa-patterns"
tags: ["filter-restaurants-by-vegan-friendly-price-and-distance", "array", "sorting", "medium"]
---

## How to Solve Filter Restaurants by Vegan-Friendly, Price and Distance

You’re given a list of restaurants, each with an ID, rating, vegan-friendly flag, price, and distance. Your task is to filter the restaurants based on three criteria (vegan-friendly, max price, max distance), then return the remaining restaurant IDs sorted by rating (highest first), and by ID (highest first) if ratings are tied. The tricky part is that the vegan-friendly filter is optional—if it’s false, you ignore that filter entirely—and you must handle the sorting order correctly.

---

## Visual Walkthrough

Let’s walk through a concrete example:

**Input:**

```
restaurants = [
    [1, 4, 1, 40, 10],
    [2, 8, 0, 50, 5],
    [3, 8, 1, 30, 4],
    [4, 10, 0, 10, 3],
    [5, 1, 1, 15, 1]
]
veganFriendly = 1
maxPrice = 50
maxDistance = 10
```

**Step 1 – Apply filters:**

- Restaurant 1: veganFriendly=1 (✅), price=40 ≤ 50 (✅), distance=10 ≤ 10 (✅) → keep
- Restaurant 2: veganFriendly=0 (❌ fails vegan filter) → discard
- Restaurant 3: veganFriendly=1 (✅), price=30 ≤ 50 (✅), distance=4 ≤ 10 (✅) → keep
- Restaurant 4: veganFriendly=0 (❌ fails vegan filter) → discard
- Restaurant 5: veganFriendly=1 (✅), price=15 ≤ 50 (✅), distance=1 ≤ 10 (✅) → keep

**Step 2 – Sort remaining restaurants:**
We keep IDs [1, 3, 5] with ratings [4, 8, 1].
Sort by rating descending:

- Rating 8 → ID 3
- Rating 4 → ID 1
- Rating 1 → ID 5

**Step 3 – Tie-breaking:**
No ties here, so final order is [3, 1, 5].

**Output:** `[3, 1, 5]`

---

## Brute Force Approach

A brute force approach would be:

1. Create an empty result list.
2. Iterate through each restaurant.
3. Check all three filter conditions manually.
4. If it passes, add it to the result.
5. After filtering, sort the result using a custom comparator that sorts by rating descending, then ID descending.

This is actually **optimal** in terms of time complexity\*\* because we must examine every restaurant at least once (O(n)) and sorting takes O(n log n). There’s no way to avoid O(n log n) in the worst case because we need the sorted order.

However, the “brute force” thinking here is more about **how** we implement the filtering and sorting. A naive candidate might:

- Apply filters incorrectly (e.g., forgetting that veganFriendly=0 means ignore the vegan filter).
- Sort incorrectly (e.g., sorting by rating ascending, or not handling ties properly).
- Try to pre-sort before filtering (wasteful if many items are filtered out).

The brute force logic is straightforward, but the challenge is in the details.

---

## Optimized Approach

The key insight is that we can **filter and sort in a single pass** by:

1. **Filtering first**: Iterate through restaurants, apply the three conditions (with special handling for veganFriendly=0), and collect valid restaurants.
2. **Sorting with a custom key**: Use a stable sort with a composite key: (-rating, -id). Sorting by negative rating gives descending order; negative ID breaks ties descending.

Why this works:

- Filtering is O(n) and necessary.
- Sorting is O(m log m) where m ≤ n (number of restaurants that pass filters).
- We can’t do better than O(n log n) worst case because output must be sorted.

The optimization is in **clean, readable code** and **correct handling of edge cases**, not in asymptotic complexity.

---

## Optimal Solution

Here’s the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) - sorting dominates
# Space: O(n) - storing filtered restaurants
def filterRestaurants(restaurants, veganFriendly, maxPrice, maxDistance):
    """
    Filters restaurants based on given criteria and returns sorted IDs.

    Args:
        restaurants: List of [id, rating, veganFriendly, price, distance]
        veganFriendly: 1 = must be vegan-friendly, 0 = ignore vegan filter
        maxPrice: maximum price allowed
        maxDistance: maximum distance allowed

    Returns:
        List of restaurant IDs sorted by rating (desc) then ID (desc)
    """
    filtered = []

    # Step 1: Filter restaurants based on criteria
    for r in restaurants:
        id_, rating, vegan, price, distance = r

        # Check vegan filter: if veganFriendly=1, restaurant must be vegan-friendly
        if veganFriendly == 1 and vegan == 0:
            continue  # Skip non-vegan when vegan filter is on

        # Check price and distance filters
        if price <= maxPrice and distance <= maxDistance:
            # All filters passed, add to filtered list
            filtered.append((id_, rating))

    # Step 2: Sort filtered restaurants
    # Sort by rating descending, then ID descending
    # Using -rating for descending order without custom comparator
    filtered.sort(key=lambda x: (-x[1], -x[0]))

    # Step 3: Extract just the IDs in sorted order
    return [id_ for id_, _ in filtered]
```

```javascript
// Time: O(n log n) - sorting dominates
// Space: O(n) - storing filtered restaurants
function filterRestaurants(restaurants, veganFriendly, maxPrice, maxDistance) {
  /**
   * Filters restaurants based on given criteria and returns sorted IDs.
   *
   * @param {number[][]} restaurants - [id, rating, veganFriendly, price, distance]
   * @param {number} veganFriendly - 1 = must be vegan-friendly, 0 = ignore vegan filter
   * @param {number} maxPrice - maximum price allowed
   * @param {number} maxDistance - maximum distance allowed
   * @return {number[]} - Restaurant IDs sorted by rating (desc) then ID (desc)
   */
  const filtered = [];

  // Step 1: Filter restaurants based on criteria
  for (const r of restaurants) {
    const [id, rating, vegan, price, distance] = r;

    // Check vegan filter: if veganFriendly=1, restaurant must be vegan-friendly
    if (veganFriendly === 1 && vegan === 0) {
      continue; // Skip non-vegan when vegan filter is on
    }

    // Check price and distance filters
    if (price <= maxPrice && distance <= maxDistance) {
      // All filters passed, add to filtered list
      filtered.push([id, rating]);
    }
  }

  // Step 2: Sort filtered restaurants
  // Sort by rating descending, then ID descending
  filtered.sort((a, b) => {
    if (a[1] !== b[1]) {
      return b[1] - a[1]; // Higher rating first
    }
    return b[0] - a[0]; // Higher ID first if ratings tie
  });

  // Step 3: Extract just the IDs in sorted order
  return filtered.map((item) => item[0]);
}
```

```java
// Time: O(n log n) - sorting dominates
// Space: O(n) - storing filtered restaurants
import java.util.*;

class Solution {
    public List<Integer> filterRestaurants(int[][] restaurants, int veganFriendly, int maxPrice, int maxDistance) {
        /**
         * Filters restaurants based on given criteria and returns sorted IDs.
         *
         * @param restaurants - [id, rating, veganFriendly, price, distance]
         * @param veganFriendly - 1 = must be vegan-friendly, 0 = ignore vegan filter
         * @param maxPrice - maximum price allowed
         * @param maxDistance - maximum distance allowed
         * @return List of restaurant IDs sorted by rating (desc) then ID (desc)
         */
        List<int[]> filtered = new ArrayList<>();

        // Step 1: Filter restaurants based on criteria
        for (int[] r : restaurants) {
            int id = r[0];
            int rating = r[1];
            int vegan = r[2];
            int price = r[3];
            int distance = r[4];

            // Check vegan filter: if veganFriendly=1, restaurant must be vegan-friendly
            if (veganFriendly == 1 && vegan == 0) {
                continue; // Skip non-vegan when vegan filter is on
            }

            // Check price and distance filters
            if (price <= maxPrice && distance <= maxDistance) {
                // All filters passed, add to filtered list
                filtered.add(new int[]{id, rating});
            }
        }

        // Step 2: Sort filtered restaurants
        // Sort by rating descending, then ID descending
        Collections.sort(filtered, (a, b) -> {
            if (a[1] != b[1]) {
                return b[1] - a[1]; // Higher rating first
            }
            return b[0] - a[0]; // Higher ID first if ratings tie
        });

        // Step 3: Extract just the IDs in sorted order
        List<Integer> result = new ArrayList<>();
        for (int[] item : filtered) {
            result.add(item[0]);
        }
        return result;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n log n)

- Filtering requires checking all n restaurants → O(n)
- Sorting m filtered restaurants → O(m log m), where m ≤ n
- In worst case, all restaurants pass filters (m = n) → O(n log n) dominates

**Space Complexity:** O(n)

- We store filtered restaurants in a separate list
- In worst case, all restaurants pass filters → O(n) space
- Sorting may use O(log n) additional space for the sort algorithm itself

---

## Common Mistakes

1. **Incorrect vegan filter handling**: When `veganFriendly = 0`, you should **ignore** the vegan filter entirely. A common mistake is to require `vegan == 0` when `veganFriendly = 0`. Actually, when `veganFriendly = 0`, both vegan and non-vegan restaurants should be considered.

2. **Wrong sorting order**: The problem asks for descending order by rating, then descending by ID. Candidates often:
   - Sort ascending instead of descending
   - Sort by ID ascending instead of descending for ties
   - Forget to handle ties at all

3. **Inefficient pre-sorting**: Sorting the entire array before filtering is wasteful if many items will be filtered out. Always filter first, then sort the smaller list.

4. **Forgetting edge cases**:
   - Empty input list
   - No restaurants pass filters (return empty list, not null)
   - All restaurants have the same rating (must sort by ID descending)

---

## When You'll See This Pattern

This problem combines **filtering** and **custom sorting**—a common pattern in real-world data processing tasks. You'll see similar patterns in:

1. **LeetCode 1333: Filter Restaurants by Vegan-Friendly, Price and Distance** (this problem)
2. **LeetCode 1366: Rank Teams by Votes** - Custom sorting based on multiple criteria
3. **LeetCode 937: Reorder Data in Log Files** - Filter logs by type, then custom sort
4. **LeetCode 179: Largest Number** - Custom comparator for string concatenation sorting

The core technique is: **filter → transform → sort with custom comparator**. This pattern appears whenever you need to process a collection of items based on multiple criteria and present them in a specific order.

---

## Key Takeaways

1. **Filter before sorting**: When you need to filter and sort data, always apply filters first to reduce the dataset, then sort what remains. This is more efficient than sorting everything first.

2. **Custom comparators are powerful**: Learn how to write custom sorting logic in your language of choice. For descending order, you can often use negative values (like `-rating`) or write explicit comparator functions.

3. **Read requirements carefully**: The vegan-friendly filter has special logic (`veganFriendly=0` means ignore it). Many interview problems have these subtle requirements that test attention to detail.

4. **Practice multi-criteria sorting**: Sorting by multiple fields (primary key, secondary key) is common in interview problems. Remember that ties are broken by the next criterion in your comparator.

---

[Practice this problem on CodeJeet](/problem/filter-restaurants-by-vegan-friendly-price-and-distance)
