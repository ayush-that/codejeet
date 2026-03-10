---
title: "How to Solve Maximum Tastiness of Candy Basket — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Tastiness of Candy Basket. Medium difficulty, 67.9% acceptance rate. Topics: Array, Binary Search, Greedy, Sorting."
date: "2028-12-10"
category: "dsa-patterns"
tags: ["maximum-tastiness-of-candy-basket", "array", "binary-search", "greedy", "medium"]
---

# How to Solve Maximum Tastiness of Candy Basket

You're given an array of candy prices and need to select `k` distinct candies to maximize the minimum price difference between any two selected candies. This problem is interesting because it combines sorting, greedy selection, and binary search on the answer—a pattern that appears in many optimization problems where we need to maximize a minimum value.

## Visual Walkthrough

Let's walk through an example: `price = [13, 5, 1, 8, 21, 2]`, `k = 3`.

**Step 1: Understanding the goal**
We need to pick 3 candies such that the smallest difference between any two selected prices is as large as possible. If we pick prices [1, 2, 5], the differences are 1, 3, and 4, so the minimum is 1. If we pick [5, 13, 21], the differences are 8, 8, and 16, so the minimum is 8—much better!

**Step 2: Sorting first**
Notice that to maximize differences, we want to spread out our selections. Let's sort the prices: `[1, 2, 5, 8, 13, 21]`.

**Step 3: Binary search on the answer**
What's the maximum possible minimum difference? The smallest difference we could have is 0 (if we pick two identical prices, but they must be distinct candies, so actually at least 1). The largest possible is `max(price) - min(price) = 20`.

We can test if a minimum difference `mid = 10` is achievable:

- Start with the smallest price: 1
- Find next price ≥ 1 + 10 = 11 → 13
- Find next price ≥ 13 + 10 = 23 → none
  We only found 2 candies (1 and 13), but we need 3. So `mid = 10` is too large.

Test `mid = 5`:

- Start with 1
- Find next price ≥ 1 + 5 = 6 → 8
- Find next price ≥ 8 + 5 = 13 → 13
  We found 3 candies (1, 8, 13) with all differences ≥ 5. So `mid = 5` is achievable.

**Step 4: Finding the maximum**
We continue binary search between 5 and 10 to find the maximum achievable minimum difference. The answer turns out to be 8 (selecting 1, 13, 21 or 5, 13, 21).

## Brute Force Approach

A naive approach would be to try all possible combinations of `k` candies from `n` candies. For each combination:

1. Calculate all pairwise differences
2. Find the minimum difference
3. Track the maximum of these minimum differences

The number of combinations is C(n, k), which grows factorially. Even for moderate n=50 and k=25, this is about 1.26×10¹⁴ combinations—completely infeasible.

```python
# Brute force - DO NOT USE in interview
from itertools import combinations

def maximumTastiness_brute(price, k):
    max_tastiness = 0
    for combo in combinations(price, k):
        min_diff = float('inf')
        # Compare all pairs in the combination
        for i in range(len(combo)):
            for j in range(i + 1, len(combo)):
                diff = abs(combo[i] - combo[j])
                min_diff = min(min_diff, diff)
        max_tastiness = max(max_tastiness, min_diff)
    return max_tastiness
```

This approach has O(C(n, k) × k²) time complexity, which is exponential and unacceptable for the constraints (n up to 10⁵).

## Optimized Approach

The key insight is that we can **binary search on the answer** (the minimum difference) and use a **greedy algorithm** to check if a candidate minimum difference is achievable.

**Why binary search works:**

- If we can achieve minimum difference `d`, we can definitely achieve any smaller difference
- If we cannot achieve `d`, we cannot achieve any larger difference
- This monotonic property allows binary search

**How to check if difference `d` is achievable:**

1. Sort the prices (so we can greedily select the next valid candy)
2. Start with the smallest price
3. For each selected candy, the next candy must be at least `d` greater than the current one
4. If we can select at least `k` candies following this rule, `d` is achievable

**Why greedy works:**
By always picking the smallest available candy that satisfies the difference constraint, we maximize our chances of picking enough candies. If we skip a smaller valid candy for a larger one, we might not find enough candies later.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + n log M) where M = max(price) - min(price)
# Space: O(1) or O(n) depending on sorting implementation
def maximumTastiness(price, k):
    # Step 1: Sort the prices to enable greedy selection
    price.sort()

    # Step 2: Define binary search bounds
    # Minimum possible difference is 1 (since prices are positive integers)
    # Maximum possible difference is between smallest and largest price
    left, right = 0, price[-1] - price[0]

    # Step 3: Binary search for the maximum achievable minimum difference
    while left < right:
        # Use mid = (left + right + 1) // 2 to avoid infinite loop
        mid = (left + right + 1) // 2

        # Step 4: Check if we can select k candies with minimum difference >= mid
        if can_select(price, k, mid):
            # If mid is achievable, try for larger differences
            left = mid
        else:
            # If mid is not achievable, try smaller differences
            right = mid - 1

    return left

def can_select(price, k, min_diff):
    # Greedy selection: count how many candies we can pick
    count = 1  # We always pick the first (smallest) candy
    last_price = price[0]

    for i in range(1, len(price)):
        # If current candy is at least min_diff greater than last selected candy
        if price[i] - last_price >= min_diff:
            count += 1
            last_price = price[i]

            # Early exit: if we've found k candies, we're done
            if count >= k:
                return True

    return count >= k
```

```javascript
// Time: O(n log n + n log M) where M = max(price) - min(price)
// Space: O(1) or O(n) depending on sorting implementation
function maximumTastiness(price, k) {
  // Step 1: Sort the prices to enable greedy selection
  price.sort((a, b) => a - b);

  // Step 2: Define binary search bounds
  let left = 0;
  let right = price[price.length - 1] - price[0];

  // Step 3: Binary search for the maximum achievable minimum difference
  while (left < right) {
    // Use mid = Math.floor((left + right + 1) / 2) to avoid infinite loop
    const mid = Math.floor((left + right + 1) / 2);

    // Step 4: Check if we can select k candies with minimum difference >= mid
    if (canSelect(price, k, mid)) {
      // If mid is achievable, try for larger differences
      left = mid;
    } else {
      // If mid is not achievable, try smaller differences
      right = mid - 1;
    }
  }

  return left;
}

function canSelect(price, k, minDiff) {
  // Greedy selection: count how many candies we can pick
  let count = 1; // We always pick the first (smallest) candy
  let lastPrice = price[0];

  for (let i = 1; i < price.length; i++) {
    // If current candy is at least minDiff greater than last selected candy
    if (price[i] - lastPrice >= minDiff) {
      count++;
      lastPrice = price[i];

      // Early exit: if we've found k candies, we're done
      if (count >= k) {
        return true;
      }
    }
  }

  return count >= k;
}
```

```java
// Time: O(n log n + n log M) where M = max(price) - min(price)
// Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int maximumTastiness(int[] price, int k) {
        // Step 1: Sort the prices to enable greedy selection
        Arrays.sort(price);

        // Step 2: Define binary search bounds
        int left = 0;
        int right = price[price.length - 1] - price[0];

        // Step 3: Binary search for the maximum achievable minimum difference
        while (left < right) {
            // Use mid = (left + right + 1) / 2 to avoid infinite loop
            int mid = left + (right - left + 1) / 2;

            // Step 4: Check if we can select k candies with minimum difference >= mid
            if (canSelect(price, k, mid)) {
                // If mid is achievable, try for larger differences
                left = mid;
            } else {
                // If mid is not achievable, try smaller differences
                right = mid - 1;
            }
        }

        return left;
    }

    private boolean canSelect(int[] price, int k, int minDiff) {
        // Greedy selection: count how many candies we can pick
        int count = 1;  // We always pick the first (smallest) candy
        int lastPrice = price[0];

        for (int i = 1; i < price.length; i++) {
            // If current candy is at least minDiff greater than last selected candy
            if (price[i] - lastPrice >= minDiff) {
                count++;
                lastPrice = price[i];

                // Early exit: if we've found k candies, we're done
                if (count >= k) {
                    return true;
                }
            }
        }

        return count >= k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting: O(n log n)
- Binary search: O(log M) where M = max(price) - min(price)
- Each binary search check: O(n) for the greedy scan
- Total: O(n log n + n log M)

Since M ≤ 10⁹ (given constraints), log M ≤ 30, so the n log M term is effectively O(n). The dominant term is O(n log n) from sorting.

**Space Complexity:**

- Sorting typically uses O(log n) to O(n) space depending on implementation
- Our algorithm uses O(1) additional space
- Total: O(1) to O(n) depending on sorting algorithm

## Common Mistakes

1. **Forgetting to sort**: The greedy selection only works on sorted arrays. Without sorting, you can't guarantee that picking the smallest valid candy is optimal.

2. **Binary search infinite loop**: Using `mid = (left + right) // 2` instead of `(left + right + 1) // 2` can cause infinite loops when `left` and `right` differ by 1. Always test with small cases like `left=0, right=1`.

3. **Off-by-one in greedy selection**: Starting `count` at 0 instead of 1 (since we always pick the first candy) or comparing `count > k` instead of `count >= k`.

4. **Not using early exit**: In the `canSelect` function, you should return as soon as you find `k` candies. Continuing to scan the entire array adds unnecessary O(n) operations.

5. **Incorrect binary search bounds**: Setting `left = 1` instead of 0. While the minimum difference can't be 0 (candies must be distinct), 0 is a valid lower bound for binary search since we're searching for the maximum achievable value.

## When You'll See This Pattern

This "binary search on answer + greedy check" pattern appears in optimization problems where you need to:

- Maximize a minimum value
- Minimize a maximum value
- Find the largest/smallest value satisfying some constraint

**Related problems:**

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Binary search on the minimum ship capacity that can ship all packages within D days.
2. **Split Array Largest Sum (LeetCode 410)** - Binary search on the minimum largest sum when splitting array into m subarrays.
3. **Koko Eating Bananas (LeetCode 875)** - Binary search on the minimum eating speed to finish all bananas in h hours.

All these problems share the same structure: we binary search on the answer and use a greedy or simulation algorithm to check feasibility.

## Key Takeaways

1. **When you need to maximize a minimum (or minimize a maximum)**, consider binary search on the answer. The monotonic property (if x works, then anything ≤ x works) is key.

2. **Sorting enables greedy selection** when you need to pick elements with spacing constraints. After sorting, you can often pick elements in a way that maximizes/minimizes some property.

3. **The feasibility check function** is where the problem-specific logic lives. For this problem, it's a simple greedy scan; for others, it might involve simulation or more complex algorithms.

4. **Always test edge cases**: k=2 (just max difference), k=n (must pick all candies), duplicate prices (still need distinct candies).

Related problems: [Container With Most Water](/problem/container-with-most-water), [Sliding Window Maximum](/problem/sliding-window-maximum)
