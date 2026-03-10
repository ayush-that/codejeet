---
title: "How to Solve Distribute Candies — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Distribute Candies. Easy difficulty, 70.8% acceptance rate. Topics: Array, Hash Table."
date: "2027-08-10"
category: "dsa-patterns"
tags: ["distribute-candies", "array", "hash-table", "easy"]
---

# How to Solve Distribute Candies

Alice has `n` candies of various types, and she can only eat `n/2` of them. She wants to maximize the number of different candy types she eats. The challenge is balancing between eating as many unique types as possible while respecting the quantity limit. This problem is interesting because it combines counting unique elements with a simple constraint—a common pattern in array problems.

## Visual Walkthrough

Let's trace through an example: `candyType = [1, 1, 2, 2, 3, 3]` where `n = 6`.

**Step 1:** Count unique candy types.  
We have types: 1, 2, and 3 → 3 unique types.

**Step 2:** Determine Alice's eating limit.  
She can eat `n/2 = 6/2 = 3` candies.

**Step 3:** Compare unique types vs. limit.

- If Alice tries to eat all unique types (3 types), she needs 3 candies.
- Her limit is exactly 3 candies.
- She can eat **3** different types.

Now try `candyType = [1, 1, 2, 3]` where `n = 4`.

**Step 1:** Unique types: 1, 2, 3 → 3 unique types.

**Step 2:** Limit: `4/2 = 2` candies.

**Step 3:** Compare:

- Alice wants 3 different types, but she can only eat 2 candies total.
- She can eat at most **2** different types (e.g., type 1 and type 2).

The answer is always the **minimum** of:

1. Number of unique candy types (max diversity possible)
2. `n/2` (quantity limit)

## Brute Force Approach

A naive approach might try to generate all possible subsets of `n/2` candies, count unique types in each subset, and track the maximum. However, with `n` up to 10⁴, the number of subsets is astronomical (C(n, n/2)), making this completely infeasible.

Even simpler brute force: sort the array and count unique types by scanning. This is actually reasonable with O(n log n) time, but we can do better with O(n) time using a hash set.

## Optimal Solution

The optimal solution uses a hash set to count unique candy types in O(n) time, then returns the minimum of unique count and `n/2`. The reasoning: Alice can eat at most `n/2` candies, and she can't eat more unique types than actually exist.

<div class="code-group">

```python
# Time: O(n) - we iterate through candyType once
# Space: O(n) - in worst case, all candies are unique and stored in set
def distributeCandies(candyType):
    """
    Returns the maximum number of different types of candies Alice can eat.

    Args:
        candyType: List of integers where each integer represents a candy type

    Returns:
        Integer representing maximum unique types Alice can eat
    """
    # Step 1: Count unique candy types using a set
    # Sets automatically remove duplicates, giving us unique types
    unique_types = set(candyType)

    # Step 2: Calculate Alice's eating limit (n/2)
    # Since n is always even, integer division works fine
    limit = len(candyType) // 2

    # Step 3: Return the minimum of unique types and limit
    # Alice can't eat more types than exist, nor more than her limit
    return min(len(unique_types), limit)
```

```javascript
// Time: O(n) - we iterate through candyType once
// Space: O(n) - in worst case, all candies are unique and stored in set
function distributeCandies(candyType) {
  /**
   * Returns the maximum number of different types of candies Alice can eat.
   *
   * @param {number[]} candyType - Array where each element represents a candy type
   * @return {number} Maximum unique types Alice can eat
   */

  // Step 1: Count unique candy types using a Set
  // Set objects store unique values, automatically removing duplicates
  const uniqueTypes = new Set(candyType);

  // Step 2: Calculate Alice's eating limit (n/2)
  // Since n is always even, we can use integer division
  const limit = candyType.length / 2;

  // Step 3: Return the minimum of unique types and limit
  // Math.min ensures we respect both constraints
  return Math.min(uniqueTypes.size, limit);
}
```

```java
// Time: O(n) - we iterate through candyType once
// Space: O(n) - in worst case, all candies are unique and stored in set
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int distributeCandies(int[] candyType) {
        /**
         * Returns the maximum number of different types of candies Alice can eat.
         *
         * @param candyType Array where each element represents a candy type
         * @return Maximum unique types Alice can eat
         */

        // Step 1: Count unique candy types using a HashSet
        // HashSet stores only unique elements, automatically handling duplicates
        Set<Integer> uniqueTypes = new HashSet<>();
        for (int candy : candyType) {
            uniqueTypes.add(candy);
        }

        // Step 2: Calculate Alice's eating limit (n/2)
        // Since n is always even, integer division works correctly
        int limit = candyType.length / 2;

        // Step 3: Return the minimum of unique types and limit
        // Alice is constrained by both available types and quantity limit
        return Math.min(uniqueTypes.size(), limit);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the `candyType` array once to build the set.
- Set operations (add/contains) are O(1) on average.
- The `min()` operation is O(1).

**Space Complexity: O(n)**

- In the worst case, all candies are unique, so the set stores all `n` elements.
- Best case: all candies are the same type → O(1) space.
- Average case depends on distribution of candy types.

## Common Mistakes

1. **Forgetting to use `min()` and returning only unique count**  
   If there are 100 unique types but `n=2`, Alice can only eat 1 type (n/2 = 1). Always return `min(unique_count, n/2)`.

2. **Using array instead of hash set for counting**  
   Some candidates try to create a frequency array, but candy types can be large integers or negative. A hash set is the right choice because we only need to know if a type exists, not how many.

3. **Incorrect integer division**  
   In languages like Java or Python 2, ensure you're using integer division correctly. The problem guarantees `n` is even, so `n/2` is always an integer.

4. **Overcomplicating with sorting**  
   While sorting works (O(n log n) time), it's suboptimal. The hash set solution is simpler and faster for this specific problem.

## When You'll See This Pattern

This "minimum of unique count vs. limit" pattern appears in problems where you need to maximize diversity subject to a quantity constraint:

1. **Intersection of Two Arrays** (LeetCode 349) - Find common elements between two arrays, similar to counting unique values.
2. **Contains Duplicate** (LeetCode 217) - Uses hash sets to detect duplicates, the same technique we use here to count unique elements.
3. **Maximum Number of Words You Can Type** (LeetCode 1935) - Similar constraint of working within limits while counting unique valid items.

The core technique—using a hash set to count/distinguish unique elements—is fundamental to many array problems.

## Key Takeaways

- **Hash sets are perfect for counting/distinguishing unique elements** with O(1) operations.
- **Always consider both constraints**: what's theoretically possible (unique types) vs. what's practically allowed (n/2 limit).
- **The `min()` operation elegantly handles the trade-off** between diversity desire and quantity limitation.

Related problems: [Minimum Number of Operations to Satisfy Conditions](/problem/minimum-number-of-operations-to-satisfy-conditions), [Check if Grid Satisfies Conditions](/problem/check-if-grid-satisfies-conditions)
