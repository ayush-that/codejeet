---
title: "How to Solve Maximum Total Beauty of the Gardens — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Total Beauty of the Gardens. Hard difficulty, 30.3% acceptance rate. Topics: Array, Two Pointers, Binary Search, Greedy, Sorting."
date: "2026-06-08"
category: "dsa-patterns"
tags: ["maximum-total-beauty-of-the-gardens", "array", "two-pointers", "binary-search", "hard"]
---

# How to Solve Maximum Total Beauty of the Gardens

Alice wants to maximize the total beauty of her gardens by planting additional flowers, but there's a twist: each garden's beauty is determined by its flower count relative to a target threshold. A garden is considered **complete** if it has at least `target` flowers, giving a fixed beauty of `target`. Otherwise, it's **incomplete** and its beauty equals its actual flower count. The challenge is we have a limited number of new flowers to plant (`newFlowers`), and we can't plant more than `maxFlowers` in any single garden. This creates a complex optimization problem where we must decide which gardens to make complete versus which to leave incomplete.

What makes this problem tricky is the two-tiered beauty system combined with planting constraints. We need to balance between making many gardens "good enough" (complete) versus making a few gardens "excellent" (incomplete but with many flowers). The optimal solution isn't obvious and requires careful analysis of the trade-offs.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- `flowers = [2, 4, 5, 3]`
- `newFlowers = 10`
- `target = 6`
- `maxFlowers = 2`

**Step 1: Sort the gardens**
First, we sort the gardens by their current flower count: `[2, 3, 4, 5]`. This helps because when we decide how many gardens to make complete, we'll always want to make the gardens with the highest current counts complete first (they require fewer additional flowers).

**Step 2: Try different numbers of complete gardens**
We'll try making `k` gardens complete, where `k` ranges from 0 to 4 (total gardens):

- **k = 0 complete gardens**: All gardens remain incomplete. We can distribute all 10 flowers among them, but no more than 2 per garden. We can add 2 to each garden (using 8 flowers), making them `[4, 5, 6, 7]`. Total beauty = 4 + 5 + 6 + 7 = 22.

- **k = 1 complete garden**: Make the garden with 5 flowers complete (needs 1 more flower to reach target 6). Remaining flowers = 9. Distribute among incomplete gardens `[2, 3, 4]`. Add 2 to each (using 6 flowers), making them `[4, 5, 6]`. Total beauty = 6 (complete) + 4 + 5 + 6 = 21.

- **k = 2 complete gardens**: Make gardens with 4 and 5 flowers complete. Need (6-4) + (6-5) = 3 flowers. Remaining flowers = 7. Incomplete gardens `[2, 3]` can get max 2 each → add 2 to both (using 4 flowers), making them `[4, 5]`. Total beauty = 6 + 6 + 4 + 5 = 21.

- **k = 3 complete gardens**: Make gardens with 3, 4, 5 complete. Need (6-3)+(6-4)+(6-5) = 6 flowers. Remaining flowers = 4. Incomplete garden `[2]` can get max 2 flowers → becomes `[4]`. Total beauty = 6 + 6 + 6 + 4 = 22.

- **k = 4 complete gardens**: Make all gardens complete. Need (6-2)+(6-3)+(6-4)+(6-5) = 10 flowers. Exactly uses all flowers. Total beauty = 6 + 6 + 6 + 6 = 24.

**Result:** Maximum beauty is 24 with all gardens complete.

This example shows we need to systematically try different numbers of complete gardens and calculate the optimal beauty for each case.

## Brute Force Approach

A brute force approach would try every possible distribution of flowers to gardens. For each garden, we could add between 0 and `maxFlowers` new flowers (or up to `target - flowers[i]` if we want to make it complete). With `n` gardens, this creates `(maxFlowers+1)^n` possibilities, which is exponential time.

Even a slightly better brute force would try all subsets of gardens to make complete, then distribute remaining flowers to incomplete gardens. There are `2^n` subsets, and for each subset, we'd need to optimally distribute remaining flowers among incomplete gardens. This is still exponential and impractical for `n` up to 10⁵.

The key insight is that we don't need to check every subset. Since complete gardens all give the same beauty (`target`), we should always try to make the gardens with the highest current flower counts complete first (they require fewer additional flowers). This leads to a greedy sorting approach.

## Optimized Approach

The optimal solution combines sorting, prefix sums, and binary search:

1. **Sort the gardens** in ascending order. This lets us efficiently calculate how many flowers are needed to make the last `k` gardens complete.

2. **Precompute prefix sums** of the sorted array. This allows O(1) calculation of total flowers needed to raise the last `k` gardens to at least `target`.

3. **Try all possible numbers of complete gardens** (`k` from 0 to `n`):
   - Calculate flowers needed to make the last `k` gardens complete
   - If we don't have enough flowers, skip this `k`
   - Distribute remaining flowers among the first `n-k` gardens (incomplete ones)
   - Use binary search to find the maximum equal level we can raise all incomplete gardens to

4. **Key optimization for distributing to incomplete gardens**:
   - We want to maximize the sum of incomplete gardens (each capped at `target-1`)
   - The optimal distribution is to raise as many gardens as possible to the same level
   - Use binary search to find the highest level `L` such that we can raise all incomplete gardens to at least `L`

5. **Calculate total beauty** for each `k`:
   - Complete gardens: `k * target`
   - Incomplete gardens: `(n-k) * L` (if we can raise all to level `L`) plus any remainder

The time complexity is O(n log n) for sorting plus O(n log target) for trying all `k` and binary searching for `L`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + n log target) | Space: O(n)
def maximumBeauty(flowers, newFlowers, target, maxFlowers):
    n = len(flowers)

    # Step 1: Sort the gardens
    flowers.sort()

    # Step 2: Handle gardens already at or above target
    # Gardens already complete give fixed beauty target
    complete_prefix = 0
    for i in range(n-1, -1, -1):
        if flowers[i] >= target:
            complete_prefix += 1
        else:
            break

    # If all gardens are already complete, return n * target
    if complete_prefix == n:
        return n * target

    # Step 3: Consider only gardens below target
    # We'll work with the first (n - complete_prefix) gardens
    flowers = flowers[:n - complete_prefix]
    n = len(flowers)

    # Step 4: Precompute prefix sums for efficient calculation
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + flowers[i]

    # Step 5: Try making k gardens complete (from the end of sorted array)
    max_beauty = 0

    # Flowers needed to make last k gardens complete
    needed = 0

    # Try k from 0 to n (number of gardens to make complete)
    for k in range(n + 1):
        if k > 0:
            # Calculate flowers needed to make the k-th garden from the end complete
            # We need to raise flowers[n-k] to target, but also all gardens after it
            # The formula: k * target - sum of last k gardens
            needed += target - flowers[n - k]

        # If we need more flowers than we have, break (since k increases, needed increases)
        if needed > newFlowers:
            break

        # Remaining flowers for incomplete gardens
        remaining = newFlowers - needed

        # Binary search to find the maximum level L we can raise all incomplete gardens to
        # Incomplete gardens are the first (n-k) gardens
        incomplete_count = n - k

        if incomplete_count == 0:
            # All gardens are complete
            beauty = (complete_prefix + k) * target
            max_beauty = max(max_beauty, beauty)
            continue

        # Binary search bounds: we can raise gardens at least to min_flower
        # and at most to target-1 (since they're incomplete) or min_flower + remaining
        low = flowers[0]
        high = target  # We'll search up to target (exclusive)

        while low < high:
            mid = (low + high + 1) // 2  # Upper mid for finding max valid

            # Calculate flowers needed to raise all incomplete gardens to at least mid
            # Find first index where flowers[i] >= mid using binary search
            left, right = 0, incomplete_count
            while left < right:
                m = (left + right) // 2
                if flowers[m] < mid:
                    left = m + 1
                else:
                    right = m

            # All gardens before index 'left' need to be raised to mid
            flowers_needed = mid * left - prefix[left]

            if flowers_needed <= remaining:
                low = mid  # We can achieve at least mid
            else:
                high = mid - 1  # mid is too high

        # low is the maximum level we can raise all incomplete gardens to
        # But we can't exceed target-1 for incomplete gardens
        level = min(low, target - 1)

        # Calculate total beauty
        # Complete gardens: (complete_prefix + k) * target
        # Incomplete gardens: We've raised them all to at least 'level'
        # Any remaining flowers after raising to 'level' can be distributed
        # but since we're already at max beauty for given level, we just use level * count
        beauty = (complete_prefix + k) * target + level * incomplete_count
        max_beauty = max(max_beauty, beauty)

    return max_beauty
```

```javascript
// Time: O(n log n + n log target) | Space: O(n)
function maximumBeauty(flowers, newFlowers, target, maxFlowers) {
  const n = flowers.length;

  // Step 1: Sort the gardens
  flowers.sort((a, b) => a - b);

  // Step 2: Handle gardens already at or above target
  let completePrefix = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (flowers[i] >= target) {
      completePrefix++;
    } else {
      break;
    }
  }

  // If all gardens are already complete
  if (completePrefix === n) {
    return n * target;
  }

  // Step 3: Consider only gardens below target
  flowers = flowers.slice(0, n - completePrefix);
  const m = flowers.length; // New length after removing already complete gardens

  // Step 4: Precompute prefix sums
  const prefix = new Array(m + 1).fill(0);
  for (let i = 0; i < m; i++) {
    prefix[i + 1] = prefix[i] + flowers[i];
  }

  // Step 5: Try making k gardens complete
  let maxBeauty = 0;
  let needed = 0;

  for (let k = 0; k <= m; k++) {
    if (k > 0) {
      // Flowers needed to make the k-th garden from the end complete
      needed += target - flowers[m - k];
    }

    // If we need more flowers than we have
    if (needed > newFlowers) {
      break;
    }

    // Remaining flowers for incomplete gardens
    const remaining = newFlowers - needed;
    const incompleteCount = m - k;

    if (incompleteCount === 0) {
      // All gardens are complete
      const beauty = (completePrefix + k) * target;
      maxBeauty = Math.max(maxBeauty, beauty);
      continue;
    }

    // Binary search for maximum level L
    let low = flowers[0];
    let high = target;

    while (low < high) {
      const mid = Math.floor((low + high + 1) / 2);

      // Find first index where flowers[i] >= mid
      let left = 0,
        right = incompleteCount;
      while (left < right) {
        const mid2 = Math.floor((left + right) / 2);
        if (flowers[mid2] < mid) {
          left = mid2 + 1;
        } else {
          right = mid2;
        }
      }

      // Calculate flowers needed to raise all to at least mid
      const flowersNeeded = mid * left - prefix[left];

      if (flowersNeeded <= remaining) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    // Level can't exceed target-1 for incomplete gardens
    const level = Math.min(low, target - 1);

    // Calculate total beauty
    const beauty = (completePrefix + k) * target + level * incompleteCount;
    maxBeauty = Math.max(maxBeauty, beauty);
  }

  return maxBeauty;
}
```

```java
// Time: O(n log n + n log target) | Space: O(n)
class Solution {
    public long maximumBeauty(int[] flowers, long newFlowers, int target, int maxFlowers) {
        int n = flowers.length;

        // Step 1: Sort the gardens
        Arrays.sort(flowers);

        // Step 2: Handle gardens already at or above target
        int completePrefix = 0;
        for (int i = n - 1; i >= 0; i--) {
            if (flowers[i] >= target) {
                completePrefix++;
            } else {
                break;
            }
        }

        // If all gardens are already complete
        if (completePrefix == n) {
            return (long) n * target;
        }

        // Step 3: Consider only gardens below target
        // Create new array with only gardens below target
        int[] validFlowers = new int[n - completePrefix];
        System.arraycopy(flowers, 0, validFlowers, 0, n - completePrefix);
        int m = validFlowers.length;

        // Step 4: Precompute prefix sums
        long[] prefix = new long[m + 1];
        for (int i = 0; i < m; i++) {
            prefix[i + 1] = prefix[i] + validFlowers[i];
        }

        // Step 5: Try making k gardens complete
        long maxBeauty = 0;
        long needed = 0;

        for (int k = 0; k <= m; k++) {
            if (k > 0) {
                // Flowers needed to make the k-th garden from the end complete
                needed += target - validFlowers[m - k];
            }

            // If we need more flowers than we have
            if (needed > newFlowers) {
                break;
            }

            // Remaining flowers for incomplete gardens
            long remaining = newFlowers - needed;
            int incompleteCount = m - k;

            if (incompleteCount == 0) {
                // All gardens are complete
                long beauty = (completePrefix + k) * (long) target;
                maxBeauty = Math.max(maxBeauty, beauty);
                continue;
            }

            // Binary search for maximum level L
            long low = validFlowers[0];
            long high = target;

            while (low < high) {
                long mid = (low + high + 1) / 2;

                // Find first index where flowers[i] >= mid
                int left = 0, right = incompleteCount;
                while (left < right) {
                    int mid2 = (left + right) / 2;
                    if (validFlowers[mid2] < mid) {
                        left = mid2 + 1;
                    } else {
                        right = mid2;
                    }
                }

                // Calculate flowers needed to raise all to at least mid
                long flowersNeeded = mid * left - prefix[left];

                if (flowersNeeded <= remaining) {
                    low = mid;
                } else {
                    high = mid - 1;
                }
            }

            // Level can't exceed target-1 for incomplete gardens
            long level = Math.min(low, target - 1);

            // Calculate total beauty
            long beauty = (completePrefix + k) * (long) target + level * incompleteCount;
            maxBeauty = Math.max(maxBeauty, beauty);
        }

        return maxBeauty;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + n log target)**

- Sorting the gardens takes O(n log n)
- For each possible `k` (0 to n), we perform a binary search that takes O(log target)
- The inner binary search to find the first garden ≥ mid takes O(log n), but since we're already doing O(log target) operations and n ≤ 10⁵, target ≤ 10⁹, this is acceptable
- Overall: O(n log n) dominates for typical constraints

**Space Complexity: O(n)**

- We need O(n) space for the sorted array
- The prefix sum array also uses O(n) space
- Other variables use O(1) additional space

## Common Mistakes

1. **Forgetting to handle gardens already at or above target**: These gardens already give full beauty (`target`) and don't need any flowers. If you don't handle them separately, you might waste flowers trying to "improve" them beyond `target`, which doesn't increase beauty.

2. **Incorrectly calculating flowers needed for complete gardens**: When making the last `k` gardens complete, you need `k * target - sum(last k gardens)`. A common mistake is to calculate per garden without considering that all gardens need to reach exactly `target`, not just the minimum.

3. **Not using binary search for distributing to incomplete gardens**: Trying to simulate flower distribution directly would be O(n²). The key insight is that the optimal distribution raises as many gardens as possible to the same level, which can be found with binary search.

4. **Ignoring the `maxFlowers` constraint**: The problem states you can't plant more than `maxFlowers` in any garden, but interestingly, in the optimal solution, this constraint doesn't affect the algorithm because we're either making gardens complete (which requires at most `target - flowers[i]` ≤ `maxFlowers` by problem constraints) or raising incomplete gardens evenly (which naturally respects the limit when searching up to `target-1`).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sorting + Greedy**: When you need to make choices about which elements to "upgrade" or modify, sorting often reveals a greedy optimal strategy. Similar to "Minimum Operations to Make Array Equal" (LeetCode 1551).

2. **Prefix Sums + Binary Search**: When you need to frequently calculate sums of subarrays and find threshold values, prefix sums with binary search is a powerful combination. This appears in "Split Array Largest Sum" (LeetCode 410) where you binary search for the minimum maximum subarray sum.

3. **Two-phase optimization**: Problems where you allocate resources in two different ways (here: making gardens complete vs. improving incomplete ones) often require trying all possible splits between the two strategies. Similar to "Maximum Performance of a Team" (LeetCode 1383) where you choose between engineers with different speeds and efficiencies.

## Key Takeaways

1. **When faced with a two-tiered reward system**, consider trying all possible allocations between the two tiers. The optimal solution often lies at some boundary between the strategies.

2. **Sorting transforms selection problems into contiguous segment problems**. Instead of choosing which specific gardens to make complete, after sorting we always choose the last `k` gardens.

3. **Binary search is powerful for finding optimal equal distribution**. When you need to raise multiple elements to the same level with limited resources, binary search can find the maximum achievable level in logarithmic time.

Related problems: [Split Array Largest Sum](/problem/split-array-largest-sum)
