---
title: "How to Solve Zero Array Transformation II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Zero Array Transformation II. Medium difficulty, 43.6% acceptance rate. Topics: Array, Binary Search, Prefix Sum."
date: "2026-12-11"
category: "dsa-patterns"
tags: ["zero-array-transformation-ii", "array", "binary-search", "prefix-sum", "medium"]
---

# How to Solve Zero Array Transformation II

This problem asks us to determine if we can transform an array to all zeros by applying range decrement operations, where each query allows us to decrement values in a range by at most a certain amount. The challenge lies in efficiently tracking cumulative decrements across overlapping ranges without repeatedly modifying the array for each query.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
nums = [3, 2, 4]
queries = [[0, 1, 2], [1, 2, 3], [0, 2, 1]]
```

We need to determine if we can make `nums` all zeros using these queries.

**Step-by-step reasoning:**

1. **Initial state:** `nums = [3, 2, 4]`
2. **Query 1:** `[0, 1, 2]` - Can decrement indices 0-1 by up to 2 each
   - We need to decide how much to use from this query
   - Index 0 needs 3, index 1 needs 2
   - We can use up to 2 at each index
   - Let's use 2 at index 0 and 2 at index 1
   - Remaining: `nums = [1, 0, 4]`
   - Query 1 has no remaining value (used all 2 at both positions)

3. **Query 2:** `[1, 2, 3]` - Can decrement indices 1-2 by up to 3 each
   - Index 1 is already 0, no need
   - Index 2 needs 4, we can use up to 3
   - Use 3 at index 2
   - Remaining: `nums = [1, 0, 1]`
   - Query 2 has 3 remaining for index 1 (unused), 0 for index 2

4. **Query 3:** `[0, 2, 1]` - Can decrement indices 0-2 by up to 1 each
   - Index 0 needs 1, index 2 needs 1
   - We can use 1 at each
   - Use 1 at index 0 and 1 at index 2
   - Remaining: `nums = [0, 0, 0]` ✓

The key insight: we need to process queries in order, and at each index, we need to know how much decrement is available from queries that cover that index. This suggests we need an efficient way to track cumulative available decrements.

## Brute Force Approach

The most straightforward approach is to simulate the process:

1. For each query in order
2. For each index in the query's range
3. Decrement as much as possible (up to the query's value and the current array value)
4. Check if we can zero out the array

However, this is too slow because:

- We have up to 10⁵ queries
- Each query can cover up to 10⁵ indices
- This leads to O(n × q) operations, which is 10¹⁰ - far too slow

**What makes this tricky:** We can't just greedily use each query's full value at every index because:

1. Different indices need different amounts
2. Later queries might be needed for earlier indices
3. We need to process queries in the given order

## Optimized Approach

The key insight is to use **prefix sums with binary search**:

1. **Observation:** For each index `i`, we need to know:
   - How much total decrement is available from queries that cover index `i`
   - But we can only use queries in order
2. **Binary search on the answer:** Instead of asking "can we do it?", we ask "can we do it with the first `k` queries?" This transforms the problem into a decision problem we can solve efficiently.

3. **Efficient checking:** For a given `k` (number of queries to use), we can:
   - Use a difference array to track cumulative decrements from the first `k` queries
   - For each index, check if the total available decrement ≥ the value at that index
   - This check runs in O(n + k) time using prefix sums

4. **Why binary search works:**
   - If we can achieve the goal with `k` queries, we can certainly do it with `k+1` queries
   - This monotonic property allows binary search on the number of queries needed

## Optimal Solution

The solution uses binary search to find the minimum number of queries needed, and for each candidate `k`, uses a difference array to efficiently check feasibility.

<div class="code-group">

```python
# Time: O((n + q) * log q) where n = len(nums), q = len(queries)
# Space: O(n) for the difference array
def minZeroArray(nums, queries):
    n = len(nums)
    q = len(queries)

    # Helper function to check if we can zero the array using first k queries
    def can_zero_with_k_queries(k):
        # Create a difference array to track cumulative decrements
        diff = [0] * (n + 1)  # n+1 to handle range updates easily

        # Apply the first k queries
        for i in range(k):
            l, r, val = queries[i]
            diff[l] += val
            diff[r + 1] -= val  # +1 because we want to stop the effect after r

        # Calculate prefix sums to get actual decrements at each position
        current_decrement = 0
        for i in range(n):
            current_decrement += diff[i]
            # If available decrement is less than what's needed at this index, fail
            if current_decrement < nums[i]:
                return False

        return True

    # Binary search for the minimum number of queries needed
    left, right = 0, q

    # Edge case: if array is already all zeros, we need 0 queries
    if all(x == 0 for x in nums):
        return 0

    # If even all queries can't zero the array, return -1
    if not can_zero_with_k_queries(q):
        return -1

    # Perform binary search
    while left < right:
        mid = (left + right) // 2
        if can_zero_with_k_queries(mid):
            right = mid  # Try with fewer queries
        else:
            left = mid + 1  # Need more queries

    return left
```

```javascript
// Time: O((n + q) * log q) where n = nums.length, q = queries.length
// Space: O(n) for the difference array
function minZeroArray(nums, queries) {
  const n = nums.length;
  const q = queries.length;

  // Helper function to check if we can zero the array using first k queries
  const canZeroWithKQueries = (k) => {
    // Create a difference array to track cumulative decrements
    const diff = new Array(n + 1).fill(0); // n+1 to handle range updates easily

    // Apply the first k queries
    for (let i = 0; i < k; i++) {
      const [l, r, val] = queries[i];
      diff[l] += val;
      if (r + 1 < n) {
        diff[r + 1] -= val; // +1 because we want to stop the effect after r
      }
    }

    // Calculate prefix sums to get actual decrements at each position
    let currentDecrement = 0;
    for (let i = 0; i < n; i++) {
      currentDecrement += diff[i];
      // If available decrement is less than what's needed at this index, fail
      if (currentDecrement < nums[i]) {
        return false;
      }
    }

    return true;
  };

  // Edge case: if array is already all zeros, we need 0 queries
  if (nums.every((x) => x === 0)) {
    return 0;
  }

  // If even all queries can't zero the array, return -1
  if (!canZeroWithKQueries(q)) {
    return -1;
  }

  // Binary search for the minimum number of queries needed
  let left = 0,
    right = q;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canZeroWithKQueries(mid)) {
      right = mid; // Try with fewer queries
    } else {
      left = mid + 1; // Need more queries
    }
  }

  return left;
}
```

```java
// Time: O((n + q) * log q) where n = nums.length, q = queries.length
// Space: O(n) for the difference array
class Solution {
    public int minZeroArray(int[] nums, int[][] queries) {
        int n = nums.length;
        int q = queries.length;

        // Edge case: if array is already all zeros, we need 0 queries
        boolean allZero = true;
        for (int num : nums) {
            if (num != 0) {
                allZero = false;
                break;
            }
        }
        if (allZero) return 0;

        // Binary search for the minimum number of queries needed
        int left = 0, right = q;

        // If even all queries can't zero the array, return -1
        if (!canZeroWithKQueries(nums, queries, q)) {
            return -1;
        }

        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canZeroWithKQueries(nums, queries, mid)) {
                right = mid;  // Try with fewer queries
            } else {
                left = mid + 1;  // Need more queries
            }
        }

        return left;
    }

    // Helper function to check if we can zero the array using first k queries
    private boolean canZeroWithKQueries(int[] nums, int[][] queries, int k) {
        int n = nums.length;
        // Create a difference array to track cumulative decrements
        long[] diff = new long[n + 1];  // Use long to prevent overflow

        // Apply the first k queries
        for (int i = 0; i < k; i++) {
            int l = queries[i][0];
            int r = queries[i][1];
            int val = queries[i][2];
            diff[l] += val;
            if (r + 1 < n) {
                diff[r + 1] -= val;  // +1 because we want to stop the effect after r
            }
        }

        // Calculate prefix sums to get actual decrements at each position
        long currentDecrement = 0;
        for (int i = 0; i < n; i++) {
            currentDecrement += diff[i];
            // If available decrement is less than what's needed at this index, fail
            if (currentDecrement < nums[i]) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + q) × log q)

- Binary search runs O(log q) times
- Each feasibility check takes O(n + k) time, where k ≤ q
- In the worst case, each check takes O(n + q) time
- Total: O((n + q) × log q)

**Space Complexity:** O(n)

- We need O(n) space for the difference array
- The binary search uses O(1) extra space
- Total: O(n) additional space

## Common Mistakes

1. **Off-by-one errors in range updates:**
   - Forgetting to subtract at `r + 1` instead of `r`
   - Solution: Remember that `diff[l] += val` affects indices ≥ l, so we need `diff[r + 1] -= val` to stop the effect after r

2. **Not handling the "at most" constraint correctly:**
   - Trying to use the full query value at every index
   - Solution: The difference array naturally handles this because we're tracking available decrements, not forced decrements

3. **Integer overflow:**
   - Using `int` when cumulative decrements might exceed 2³¹ - 1
   - Solution: Use `long` (in Java) or check constraints carefully

4. **Forgetting edge cases:**
   - Array already all zeros (return 0 immediately)
   - Impossible case even with all queries (return -1)
   - Single element arrays
   - Solution: Test these cases explicitly

## When You'll See This Pattern

This problem combines two important patterns:

1. **Difference Array / Prefix Sum for Range Updates:**
   - Used when you need to apply many range updates efficiently
   - **Corporate Flight Bookings (1109):** Exactly the same pattern - booking seats on flights
   - **Range Addition (370):** Applying multiple range increments

2. **Binary Search on Answer:**
   - Used when you can efficiently check feasibility but not directly compute the answer
   - **Capacity To Ship Packages Within D Days (1011):** Binary search on shipping capacity
   - **Split Array Largest Sum (410):** Binary search on maximum subarray sum

The combination appears in problems where you need to find the minimum number of operations to achieve a goal, and each operation affects a range of elements.

## Key Takeaways

1. **Difference arrays transform O(range length) updates into O(1) operations:** Instead of updating each element in a range, update only the boundaries and compute prefix sums later.

2. **Binary search works on more than just sorted arrays:** When you have a monotonic property (if k works, then k+1 works), you can binary search for the minimum/maximum feasible value.

3. **Range update problems often follow this pattern:** If you see "apply operation to range [l, r]" with many operations, think difference array. If you also need to find the minimum number of operations, think binary search.

Related problems: [Corporate Flight Bookings](/problem/corporate-flight-bookings), [Minimum Moves to Make Array Complementary](/problem/minimum-moves-to-make-array-complementary), [Zero Array Transformation IV](/problem/zero-array-transformation-iv)
