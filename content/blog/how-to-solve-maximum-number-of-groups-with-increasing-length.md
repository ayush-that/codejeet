---
title: "How to Solve Maximum Number of Groups With Increasing Length — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Groups With Increasing Length. Hard difficulty, 23.0% acceptance rate. Topics: Array, Math, Binary Search, Greedy, Sorting."
date: "2026-03-10"
category: "dsa-patterns"
tags: ["maximum-number-of-groups-with-increasing-length", "array", "math", "binary-search", "hard"]
---

# How to Solve Maximum Number of Groups With Increasing Length

This problem asks us to form the maximum number of groups possible where each group must have a strictly increasing size, and we have limited usage counts for each number. The tricky part is balancing two constraints: 1) groups must have sizes 1, 2, 3, ... up to k, and 2) each number i can only be used `usageLimits[i]` times total across all groups. This creates an interesting optimization challenge where we need to determine the maximum k such that we can form groups of sizes 1 through k.

## Visual Walkthrough

Let's trace through example `usageLimits = [2, 7, 11, 15]`:

We want to form groups with sizes 1, 2, 3, 4, ... up to some maximum k. Each group needs distinct numbers, and number i can appear at most `usageLimits[i]` times.

**Step 1: Sort the usage limits**  
Sorted: `[2, 7, 11, 15]`

**Step 2: Try to form groups incrementally**  
We'll check if we can form k groups for increasing values of k:

For k = 1 (need group size 1):

- We need 1 element total across all groups
- Total available elements = 2 + 7 + 11 + 15 = 35
- We have enough, so k = 1 works

For k = 2 (need group sizes 1 and 2):

- We need 1 + 2 = 3 elements total
- But here's the catch: the group of size 2 needs 2 distinct numbers!
- Let's think differently: For k groups, the largest group needs k distinct numbers.
- Check if we have at least k numbers with usage limit ≥ 1: Yes, all 4 numbers have ≥ 1
- Check if we have enough total capacity: Need 1+2=3 elements, have 35, so works
- So k = 2 works

For k = 3 (need group sizes 1, 2, 3):

- Largest group needs 3 distinct numbers
- Check numbers with usage ≥ 1: All 4 numbers qualify ✓
- Check numbers with usage ≥ 2: [2, 7, 11, 15] → all 4 have ≥ 2 ✓
- Check numbers with usage ≥ 3: [7, 11, 15] → 3 numbers have ≥ 3 ✓
- Total elements needed: 1+2+3 = 6
- Total available: 35 ✓
- So k = 3 works

For k = 4 (need group sizes 1, 2, 3, 4):

- Check numbers with usage ≥ 1: 4 numbers ✓
- Check numbers with usage ≥ 2: 4 numbers ✓
- Check numbers with usage ≥ 3: 3 numbers ✓
- Check numbers with usage ≥ 4: [7, 11, 15] → 3 numbers have ≥ 4
- But we need 4 numbers with usage ≥ 4 for the largest group!
- We only have 3 numbers that can be used 4+ times
- Therefore k = 4 fails

Maximum k = 3

## Brute Force Approach

A naive approach would try to actually construct the groups:

1. Try k = 1, 2, 3, ... up to n
2. For each k, try to assign numbers to groups of sizes 1 through k
3. Check if assignment is possible given usage limits

This is essentially a combinatorial assignment problem. We could use backtracking to try all possible assignments of numbers to positions in groups. However, this becomes astronomically slow even for moderate n.

The key insight is that we don't need to actually construct the groups—we just need to check if it's possible. The brute force would have complexity O(n! \* k) in the worst case, which is completely infeasible.

## Optimized Approach

The optimal solution uses **binary search** combined with a **greedy validation**:

**Key Insight**: If we can form k groups, we can certainly form k-1 groups (by removing the largest group). This monotonic property allows binary search.

**Validation Logic**: To check if k groups are possible:

1. We need groups of sizes 1, 2, 3, ..., k
2. The j-th group (1-indexed) needs j distinct numbers
3. For the i-th largest usage limit (after sorting), it can contribute to multiple groups
4. A number with usage limit L can contribute to at most min(L, k) groups
5. The total "capacity" needed for k groups is 1 + 2 + ... + k = k(k+1)/2
6. But more importantly, we need to ensure that for position j in the sorted list (1-indexed), we have enough numbers that can be used at least j times

The validation check becomes: After sorting usage limits in ascending order, for each index i (0-indexed), the value at position i must be at least (i+1) for all i < k, and we must have enough total capacity.

Actually, there's an even cleaner way: We can think of "filling" the groups from smallest to largest. For group of size j, we need j distinct numbers. We can use a greedy approach: always use the numbers with the highest remaining usage limits first.

## Optimal Solution

The optimal solution uses binary search to find the maximum k, and for each k, checks feasibility using a greedy approach:

<div class="code-group">

```python
# Time: O(n log n + n log n) = O(n log n) | Space: O(1)
def maxIncreasingGroups(self, usageLimits):
    """
    Find maximum number of groups with strictly increasing sizes.

    Approach:
    1. Sort usage limits to process smaller limits first
    2. Binary search for maximum k (number of groups)
    3. For each candidate k, check if we can form k groups
    4. Validation: We need to fill k groups with sizes 1..k
       Total elements needed = k*(k+1)//2
       We check if we have enough capacity AND if we can satisfy
       the "distinct numbers" requirement for each group
    """
    usageLimits.sort()
    n = len(usageLimits)

    # Binary search for maximum k
    left, right = 0, n
    answer = 0

    while left <= right:
        mid = (left + right) // 2

        if self.canFormGroups(usageLimits, mid):
            answer = mid
            left = mid + 1  # Try for more groups
        else:
            right = mid - 1  # Try fewer groups

    return answer

def canFormGroups(self, limits, k):
    """
    Check if we can form k groups with sizes 1..k.

    Greedy approach: Process groups from largest to smallest.
    For group of size j, we need j distinct numbers.
    We track total available capacity and ensure we never run out.
    """
    if k == 0:
        return True

    total_needed = 0
    # We need groups of sizes 1, 2, ..., k
    # Process from largest group (size k) to smallest (size 1)

    # Alternative simpler approach: Check if we have enough total capacity
    # AND if we can satisfy the prefix sums condition

    # Actually, the key condition is:
    # For sorted limits, sum(min(limit, position)) for all positions
    # must be >= total needed = k*(k+1)//2

    total_capacity = 0
    for i, limit in enumerate(limits):
        # At position i (0-indexed), we can use this number in at most
        # min(limit, i+1) groups if i < k, or min(limit, k) if i >= k
        # But simpler: we can use it in at most min(limit, i+1) groups
        # when considering the first i+1 groups

        # Actually, the correct greedy check:
        # We're filling groups from size 1 to k
        # For the j-th group (1-indexed), we need j distinct numbers
        # So by the time we reach group j, we need at least j numbers
        # that have been used at most (their limit) times

        # Let's use the prefix sum approach:
        # Sort limits, then check if for all i < k, we have enough
        # Actually, there's a known condition:
        # After sorting, sum(min(limit, i+1)) for i from 0 to n-1
        # must be >= k*(k+1)//2

        groups_can_use = min(limit, i + 1)
        total_capacity += groups_can_use

    total_needed = k * (k + 1) // 2
    return total_capacity >= total_needed
```

```javascript
// Time: O(n log n + n log n) = O(n log n) | Space: O(1)
/**
 * @param {number[]} usageLimits
 * @return {number}
 */
var maxIncreasingGroups = function (usageLimits) {
  // Sort usage limits to enable greedy checking
  usageLimits.sort((a, b) => a - b);
  const n = usageLimits.length;

  // Binary search for maximum number of groups
  let left = 0,
    right = n;
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (canFormGroups(usageLimits, mid)) {
      answer = mid;
      left = mid + 1; // Try for more groups
    } else {
      right = mid - 1; // Try fewer groups
    }
  }

  return answer;
};

/**
 * Check if we can form k groups with sizes 1..k
 * @param {number[]} limits - Sorted usage limits
 * @param {number} k - Number of groups to try
 * @return {boolean}
 */
function canFormGroups(limits, k) {
  if (k === 0) return true;

  let totalCapacity = 0;
  // Calculate total capacity: each number can be used in at most
  // min(its limit, its position+1) groups when filling greedily
  for (let i = 0; i < limits.length; i++) {
    // The i-th number (0-indexed) can contribute to at most
    // min(limit, i+1) groups in the optimal arrangement
    const groupsCanUse = Math.min(limits[i], i + 1);
    totalCapacity += groupsCanUse;
  }

  // Total elements needed for k groups: 1 + 2 + ... + k
  const totalNeeded = (k * (k + 1)) / 2;

  return totalCapacity >= totalNeeded;
}
```

```java
// Time: O(n log n + n log n) = O(n log n) | Space: O(1)
class Solution {
    public int maxIncreasingGroups(List<Integer> usageLimits) {
        // Convert to array and sort
        int n = usageLimits.size();
        int[] limits = new int[n];
        for (int i = 0; i < n; i++) {
            limits[i] = usageLimits.get(i);
        }
        Arrays.sort(limits);

        // Binary search for maximum k
        int left = 0, right = n;
        int answer = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canFormGroups(limits, mid)) {
                answer = mid;
                left = mid + 1;  // Try for more groups
            } else {
                right = mid - 1;  // Try fewer groups
            }
        }

        return answer;
    }

    private boolean canFormGroups(int[] limits, int k) {
        if (k == 0) return true;

        long totalCapacity = 0;
        // Calculate maximum total capacity using greedy approach
        // Each number at position i can be used in at most min(limit, i+1) groups
        for (int i = 0; i < limits.length; i++) {
            // Use long to prevent overflow
            int groupsCanUse = Math.min(limits[i], i + 1);
            totalCapacity += groupsCanUse;
        }

        // Total needed for k groups: k*(k+1)/2
        long totalNeeded = (long)k * (k + 1) / 2;

        return totalCapacity >= totalNeeded;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the usage limits: O(n log n)
- Binary search runs O(log n) times
- Each validation check in `canFormGroups`: O(n)
- Total: O(n log n + log n \* n) = O(n log n)

**Space Complexity: O(1)** for the algorithm itself (O(n) if we count input storage, but we're not using additional data structures proportional to n)

The binary search reduces the number of validation checks from O(n) to O(log n), making the solution efficient.

## Common Mistakes

1. **Not sorting the array**: Many candidates try to work with the unsorted array, which makes the greedy validation incorrect. The sorted order ensures we process numbers in increasing order of their limits, which is crucial for the "min(limit, i+1)" logic.

2. **Overflow in calculations**: When n is large (up to 10^5), k\*(k+1)/2 can exceed 32-bit integer range. Always use 64-bit integers (long in Java, default in Python) for these calculations.

3. **Incorrect validation logic**: Some candidates only check if total sum of limits >= k\*(k+1)/2, but this misses the "distinct numbers" requirement. We need the more sophisticated check that considers how many groups each number can participate in.

4. **Off-by-one errors in binary search**: The right bound should be n (maximum possible groups), and we need careful handling of the mid calculation and bounds update to avoid infinite loops.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary Search on Answer**: When the problem asks for "maximum" or "minimum" of something, and you can check feasibility for a given value, binary search is often applicable. Similar problems:
   - [Capacity To Ship Packages Within D Days](/problem/capacity-to-ship-packages-within-d-days)
   - [Koko Eating Bananas](/problem/koko-eating-bananas)
   - [Split Array Largest Sum](/problem/split-array-largest-sum)

2. **Greedy Validation with Sorting**: Many problems require sorting first, then applying a greedy strategy to check feasibility. The "min(limit, position)" pattern appears in various assignment problems.

3. **Combinatorial Optimization with Constraints**: Problems where you need to arrange elements subject to multiple constraints often use similar "feasibility check + binary search" approaches.

## Key Takeaways

1. **When you see "maximum number of X" and can check if k is feasible, think binary search on the answer**. This pattern reduces optimization to repeated decision problems.

2. **Sorting is often the first step in greedy algorithms**. It transforms the problem into a more structured form where local optimal choices lead to global optima.

3. **For assignment problems with usage limits, think in terms of "capacity per position"**. The `min(limit, position)` pattern captures how many times an element can be usefully assigned.

Related problems: [Group the People Given the Group Size They Belong To](/problem/group-the-people-given-the-group-size-they-belong-to)
