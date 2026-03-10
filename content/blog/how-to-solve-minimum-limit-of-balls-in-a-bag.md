---
title: "How to Solve Minimum Limit of Balls in a Bag — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Limit of Balls in a Bag. Medium difficulty, 66.5% acceptance rate. Topics: Array, Binary Search."
date: "2026-09-03"
category: "dsa-patterns"
tags: ["minimum-limit-of-balls-in-a-bag", "array", "binary-search", "medium"]
---

# How to Solve Minimum Limit of Balls in a Bag

You're given bags with different numbers of balls and a limit on how many times you can split bags. Your goal is to find the smallest possible maximum number of balls in any bag after performing at most `maxOperations` splits. The tricky part is that you need to minimize the maximum bag size while respecting the operation limit — this creates a tradeoff where smaller maximums require more operations.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [9]`, `maxOperations = 2`. We want to find the smallest possible maximum bag size.

**Initial state:** One bag with 9 balls.

**If we try maximum size = 5:**

- Bag with 9 balls needs to be split so no bag exceeds 5 balls
- To split 9 into bags ≤ 5, we need at least 2 operations:
  - Operation 1: Split 9 → 5 + 4
  - Operation 2: Split 5 → 3 + 2 (or similar)
- But wait! We can be smarter: 9 → 5 + 4 only needs 1 operation, and both resulting bags (5 and 4) are ≤ 5. So we only need 1 operation, not 2.
- Actually, let's calculate properly: For a bag with `x` balls and target maximum `m`, the minimum operations needed is `ceil(x/m) - 1`. For 9 with m=5: ceil(9/5)=2, minus 1 = 1 operation. ✓

**If we try maximum size = 4:**

- For bag with 9 balls: ceil(9/4)=3, minus 1 = 2 operations
- We have exactly 2 operations available, so m=4 works ✓

**If we try maximum size = 3:**

- For bag with 9 balls: ceil(9/3)=3, minus 1 = 2 operations
- m=3 also works with 2 operations ✓

**If we try maximum size = 2:**

- For bag with 9 balls: ceil(9/2)=5, minus 1 = 4 operations
- We only have 2 operations, so m=2 doesn't work ✗

**If we try maximum size = 1:**

- For bag with 9 balls: ceil(9/1)=9, minus 1 = 8 operations
- Doesn't work ✗

The smallest maximum that works is 3. So answer = 3.

## Brute Force Approach

A naive approach would be to try every possible maximum size from 1 up to the maximum value in `nums`, checking if we can achieve it within `maxOperations`. For each candidate maximum `m`, we calculate the total operations needed:

For each bag with `x` balls:

- If `x ≤ m`: No operations needed
- If `x > m`: We need to split it into multiple bags all ≤ m
- Minimum splits needed = `ceil(x/m) - 1`

Sum these operations across all bags. If total ≤ maxOperations, `m` works.

**Why this is too slow:**

- Maximum value in `nums` can be up to 10^9
- Checking each value from 1 to 10^9 would take O(10^9 \* n) operations
- With n up to 10^5, this is impossibly slow (up to 10^14 operations)

Even if we only check up to the actual maximum in the array (which could still be 10^9), it's still too slow.

## Optimized Approach

The key insight is that we can use **binary search** on the answer! Notice these properties:

1. **Monotonicity:** If we can achieve maximum size `m` with ≤ maxOperations, then we can definitely achieve any larger maximum size (since larger maximums require fewer or equal operations). Conversely, if we cannot achieve `m`, then we cannot achieve any smaller maximum size either.

2. **Search space:** The answer must be between 1 and `max(nums)` (inclusive).

3. **Feasibility check:** For any candidate `m`, we can compute the required operations in O(n) time using the formula above.

This gives us a perfect setup for binary search:

- Left boundary: 1 (smallest possible maximum)
- Right boundary: max(nums) (largest possible maximum, no operations needed)
- Check mid point: Can we achieve maximum ≤ mid with ≤ maxOperations?
- Adjust search boundaries based on the check

**Step-by-step reasoning:**

1. We're searching for the minimum feasible maximum bag size
2. For any candidate `m`, calculate total operations needed
3. If operations ≤ maxOperations, `m` is feasible → try smaller values (move right boundary left)
4. If operations > maxOperations, `m` is not feasible → try larger values (move left boundary right)
5. Continue until we find the smallest feasible `m`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(max(nums))) | Space: O(1)
def minimumSize(nums, maxOperations):
    """
    Find the minimum possible maximum number of balls in any bag
    after performing at most maxOperations splits.

    Args:
        nums: List of integers representing balls in each bag
        maxOperations: Maximum number of split operations allowed

    Returns:
        Minimum possible maximum bag size
    """
    # Binary search boundaries
    left, right = 1, max(nums)
    result = right  # Initialize with worst case (no operations)

    while left <= right:
        mid = (left + right) // 2

        # Calculate total operations needed for this candidate maximum
        total_ops = 0
        for num in nums:
            if num > mid:
                # For a bag with 'num' balls and target maximum 'mid',
                # we need ceil(num/mid) - 1 operations
                # Using integer math: (num + mid - 1) // mid gives ceil(num/mid)
                total_ops += (num + mid - 1) // mid - 1

        # Check if this candidate is feasible
        if total_ops <= maxOperations:
            # mid is feasible, try for smaller maximum
            result = mid
            right = mid - 1
        else:
            # mid is not feasible, need larger maximum
            left = mid + 1

    return result
```

```javascript
// Time: O(n * log(max(nums))) | Space: O(1)
function minimumSize(nums, maxOperations) {
  /**
   * Find the minimum possible maximum number of balls in any bag
   * after performing at most maxOperations splits.
   *
   * @param {number[]} nums - Array representing balls in each bag
   * @param {number} maxOperations - Maximum number of split operations allowed
   * @return {number} Minimum possible maximum bag size
   */

  // Binary search boundaries
  let left = 1;
  let right = Math.max(...nums);
  let result = right; // Initialize with worst case (no operations)

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // Calculate total operations needed for this candidate maximum
    let totalOps = 0;
    for (const num of nums) {
      if (num > mid) {
        // For a bag with 'num' balls and target maximum 'mid',
        // we need ceil(num/mid) - 1 operations
        // Using integer math: Math.ceil(num/mid) - 1
        totalOps += Math.ceil(num / mid) - 1;
      }
    }

    // Check if this candidate is feasible
    if (totalOps <= maxOperations) {
      // mid is feasible, try for smaller maximum
      result = mid;
      right = mid - 1;
    } else {
      // mid is not feasible, need larger maximum
      left = mid + 1;
    }
  }

  return result;
}
```

```java
// Time: O(n * log(max(nums))) | Space: O(1)
class Solution {
    public int minimumSize(int[] nums, int maxOperations) {
        /**
         * Find the minimum possible maximum number of balls in any bag
         * after performing at most maxOperations splits.
         *
         * @param nums Array representing balls in each bag
         * @param maxOperations Maximum number of split operations allowed
         * @return Minimum possible maximum bag size
         */

        // Binary search boundaries
        int left = 1;
        int right = 0;
        for (int num : nums) {
            right = Math.max(right, num);
        }
        int result = right;  // Initialize with worst case (no operations)

        while (left <= right) {
            int mid = left + (right - left) / 2;  // Avoid potential overflow

            // Calculate total operations needed for this candidate maximum
            long totalOps = 0;  // Use long to avoid integer overflow
            for (int num : nums) {
                if (num > mid) {
                    // For a bag with 'num' balls and target maximum 'mid',
                    // we need ceil(num/mid) - 1 operations
                    // Using integer math: (num + mid - 1) / mid gives ceil(num/mid)
                    totalOps += (num + mid - 1L) / mid - 1;
                }
            }

            // Check if this candidate is feasible
            if (totalOps <= maxOperations) {
                // mid is feasible, try for smaller maximum
                result = mid;
                right = mid - 1;
            } else {
                // mid is not feasible, need larger maximum
                left = mid + 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* log(max(nums)))

- Binary search runs O(log(max(nums))) iterations (worst case log(10^9) ≈ 30 iterations)
- Each iteration processes all n elements to calculate total operations
- Total: O(n \* log(max(nums)))

**Space Complexity:** O(1)

- We only use a few variables for binary search boundaries and operation counting
- No additional data structures proportional to input size

## Common Mistakes

1. **Incorrect operation calculation:** The formula is `ceil(x/m) - 1`, not `x/m - 1` or `floor(x/m)`. Using floor division gives wrong results when x is not divisible by m. For example, with x=9 and m=4: ceil(9/4)=3, minus 1 = 2 operations (correct), but floor(9/4)=2, minus 1 = 1 operation (incorrect).

2. **Binary search boundaries:** Starting with left=0 instead of left=1. Since we need positive balls in each bag (problem states "positive number of balls"), the minimum possible maximum is 1, not 0.

3. **Integer overflow in Java:** When calculating `(num + mid - 1) / mid`, if we use `int` for large values, the addition could overflow. Use `long` for intermediate calculations or write it as `(num - 1) / mid + 1` which avoids overflow.

4. **Forgetting to handle the case where no operations are needed:** If all bags already satisfy the candidate maximum (num ≤ mid), we need 0 operations, not negative operations. That's why we have the `if (num > mid)` check.

## When You'll See This Pattern

This "binary search on answer" pattern appears in problems where:

1. You need to minimize or maximize some value
2. There's a monotonic relationship: if value X works, then all values > X (or < X) also work
3. Checking feasibility for a given value is easier than directly finding the optimal value

**Related problems:**

1. **Maximum Candies Allocated to K Children (Medium):** Similar structure — distribute candies to maximize the minimum each child gets, using binary search on the possible candy amounts.
2. **Minimized Maximum of Products Distributed to Any Store (Medium):** Almost identical — minimize the maximum products per store given distribution constraints.
3. **Koko Eating Bananas (Medium):** Binary search on eating speed to finish bananas within h hours.
4. **Capacity To Ship Packages Within D Days (Medium):** Binary search on ship capacity to deliver all packages within D days.

## Key Takeaways

1. **Recognize binary search opportunities:** When you need to find a minimum/maximum value and checking feasibility is easier than finding the value directly, consider binary search on the answer space.

2. **Look for monotonicity:** The key property that enables binary search is that if value X is feasible, then all values on one side of X are also feasible. Always verify this property before applying binary search.

3. **Master the feasibility check:** The heart of these problems is designing an efficient O(n) or O(n log n) check for whether a candidate value works. Get this right, and the binary search framework is straightforward.

Related problems: [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children), [Minimized Maximum of Products Distributed to Any Store](/problem/minimized-maximum-of-products-distributed-to-any-store)
