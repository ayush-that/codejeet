---
title: "How to Solve Minimum Moves to Balance Circular Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Balance Circular Array. Medium difficulty, 40.2% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2029-11-03"
category: "dsa-patterns"
tags: ["minimum-moves-to-balance-circular-array", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Moves to Balance Circular Array

You're given a circular array where each element represents a person's balance. You can transfer exactly 1 unit of balance to an adjacent neighbor in one move. The goal is to make all balances non-negative using the minimum number of moves. The circular nature means the first and last elements are neighbors, which adds complexity to the problem.

What makes this problem interesting is that it looks like a simple balancing problem, but the circular constraint forces us to think about where to "break" the circle to solve it efficiently. The key insight is transforming this circular problem into a linear one.

## Visual Walkthrough

Let's trace through an example: `balance = [2, -3, 4, -1]`

**Step 1: Understanding the circular nature**

- Person 0 (balance 2) can give to person 3 (right neighbor) or person 1 (left neighbor)
- Person 3 (balance -1) can give to person 0 (right neighbor) or person 2 (left neighbor)
- This creates a cycle: 0 ↔ 1 ↔ 2 ↔ 3 ↔ 0

**Step 2: Understanding the moves**
Each move transfers exactly 1 unit. If person A has -3, they need to receive 3 units total. If person B has 4, they can give away up to 4 units.

**Step 3: One possible solution**
Let's try to balance manually:

1. Person 1 (-3) needs 3 units. Person 0 (2) can give 2 units → Person 1 now has -1, Person 0 has 0 (2 moves)
2. Person 1 still needs 1 unit. Person 2 (4) can give 1 unit → Person 1 now has 0, Person 2 has 3 (1 move)
3. Person 3 (-1) needs 1 unit. Person 2 (3) can give 1 unit → Person 3 now has 0, Person 2 has 2 (1 move)

Total moves: 2 + 1 + 1 = 4 moves

But is this optimal? Let's think differently...

**Step 4: The prefix sum insight**
If we look at cumulative sums starting from different points:

- Starting at index 0: [2, -1, 3, 2]
- Starting at index 1: [-3, 1, 0, 2]
- Starting at index 2: [4, 3, 2, 4]
- Starting at index 3: [-1, 1, 5, 4]

The minimum moves needed equals the maximum negative prefix sum (in absolute value) when we start from the optimal position. For the starting point that minimizes this maximum negative value, we get our answer.

## Brute Force Approach

A naive approach would be to try all possible sequences of transfers. For each person who needs balance, we could try getting it from left or right neighbors, creating a tree of possibilities. This would be exponential in time complexity.

Another brute force approach would be to try starting the balancing process from each position in the circle, then simulate the transfers. For each starting position, we would:

1. Create a linear array starting from that position
2. Iterate through, transferring balance from positive to negative neighbors
3. Count the moves

The problem with this approach is that it's O(n²) in the worst case, as for each of n starting positions, we might need O(n) operations to simulate the transfers. For n up to 10⁵ (typical LeetCode constraints), this would be far too slow.

## Optimized Approach

The key insight is that this problem is equivalent to finding the starting point in the circular array that minimizes the maximum cumulative deficit when we traverse the array linearly.

Here's the step-by-step reasoning:

1. **Transform the problem**: In a circular array, the minimum moves to make all balances non-negative equals the minimum over all starting positions of the maximum negative prefix sum (in absolute value).

2. **Why prefix sums work**: When we traverse the array linearly from a starting point, the prefix sum at position i tells us the net balance accumulated up to that point. If this becomes negative, it means we have a deficit that needs to be covered by transfers from earlier positions. The maximum negative value represents the worst deficit we encounter.

3. **The circular to linear trick**: For a circular problem, we can duplicate the array (append it to itself) and consider all windows of length n. The optimal starting point is where the maximum negative prefix sum in that window is minimized.

4. **Efficient computation**: We can use a monotonic deque (double-ended queue) to efficiently find the minimum of maximum negative prefix sums over all windows. This is similar to the sliding window minimum problem.

## Optimal Solution

The optimal solution uses a deque to find the starting position that minimizes the maximum negative prefix sum. Here's how it works:

1. Calculate prefix sums for the duplicated array (array + array)
2. Use a deque to maintain indices where the prefix sum is increasing
3. For each window of length n, the maximum negative prefix sum is the minimum prefix sum in that window
4. Track the minimum of these maximum negative values
5. The answer is the absolute value of this minimum (or 0 if it's non-negative)

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minMovesToBalance(balance):
    """
    Returns the minimum number of moves to make all balances non-negative.

    The key insight is that for a circular array, the minimum moves equals
    the minimum over all starting positions of the maximum negative prefix sum.
    We use a deque to efficiently find this minimum for all windows of length n.
    """
    n = len(balance)

    # Handle edge case
    if n == 0:
        return 0

    # Create prefix sums for the duplicated array [balance + balance]
    # This allows us to consider all possible starting points in the circle
    prefix = [0] * (2 * n + 1)
    for i in range(2 * n):
        # Calculate cumulative sum, wrapping around using modulo
        prefix[i + 1] = prefix[i] + balance[i % n]

    # Use a deque to maintain indices with increasing prefix sums
    # This helps us find the minimum prefix sum in each window efficiently
    from collections import deque
    dq = deque()

    # Initialize result to a large value
    result = float('inf')

    # Process each window of length n
    for i in range(2 * n):
        # Remove indices that are outside the current window
        # Window is [i - n + 1, i] (inclusive)
        while dq and dq[0] <= i - n:
            dq.popleft()

        # Remove indices from the back while their prefix sum is greater than current
        # This maintains increasing order of prefix sums in the deque
        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()

        # Add current index to deque
        dq.append(i)

        # Once we have processed at least n elements, we can calculate result
        # The minimum prefix sum in the window ending at i is prefix[dq[0]]
        if i >= n - 1:
            # The maximum negative prefix sum for this window is the minimum prefix sum
            min_prefix = prefix[dq[0]]
            # The deficit at the starting point is prefix[i - n + 1]
            # The maximum negative value is min_prefix - starting_prefix
            window_min = min_prefix - prefix[i - n + 1]
            result = min(result, window_min)

    # If result is non-negative, no moves needed
    # Otherwise, we need -result moves (convert negative to positive)
    return max(0, -result)
```

```javascript
// Time: O(n) | Space: O(n)
function minMovesToBalance(balance) {
  /**
   * Returns the minimum number of moves to make all balances non-negative.
   *
   * The key insight is that for a circular array, the minimum moves equals
   * the minimum over all starting positions of the maximum negative prefix sum.
   * We use a deque to efficiently find this minimum for all windows of length n.
   */
  const n = balance.length;

  // Handle edge case
  if (n === 0) {
    return 0;
  }

  // Create prefix sums for the duplicated array [balance + balance]
  // This allows us to consider all possible starting points in the circle
  const prefix = new Array(2 * n + 1).fill(0);
  for (let i = 0; i < 2 * n; i++) {
    // Calculate cumulative sum, wrapping around using modulo
    prefix[i + 1] = prefix[i] + balance[i % n];
  }

  // Use a deque (simulated with array) to maintain indices with increasing prefix sums
  // This helps us find the minimum prefix sum in each window efficiently
  const dq = [];

  // Initialize result to a large value
  let result = Infinity;

  // Process each window of length n
  for (let i = 0; i < 2 * n; i++) {
    // Remove indices that are outside the current window
    // Window is [i - n + 1, i] (inclusive)
    while (dq.length > 0 && dq[0] <= i - n) {
      dq.shift();
    }

    // Remove indices from the back while their prefix sum is greater than current
    // This maintains increasing order of prefix sums in the deque
    while (dq.length > 0 && prefix[dq[dq.length - 1]] >= prefix[i]) {
      dq.pop();
    }

    // Add current index to deque
    dq.push(i);

    // Once we have processed at least n elements, we can calculate result
    // The minimum prefix sum in the window ending at i is prefix[dq[0]]
    if (i >= n - 1) {
      // The maximum negative prefix sum for this window is the minimum prefix sum
      const minPrefix = prefix[dq[0]];
      // The deficit at the starting point is prefix[i - n + 1]
      // The maximum negative value is minPrefix - startingPrefix
      const windowMin = minPrefix - prefix[i - n + 1];
      result = Math.min(result, windowMin);
    }
  }

  // If result is non-negative, no moves needed
  // Otherwise, we need -result moves (convert negative to positive)
  return Math.max(0, -result);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int minMovesToBalance(int[] balance) {
        /**
         * Returns the minimum number of moves to make all balances non-negative.
         *
         * The key insight is that for a circular array, the minimum moves equals
         * the minimum over all starting positions of the maximum negative prefix sum.
         * We use a deque to efficiently find this minimum for all windows of length n.
         */
        int n = balance.length;

        // Handle edge case
        if (n == 0) {
            return 0;
        }

        // Create prefix sums for the duplicated array [balance + balance]
        // This allows us to consider all possible starting points in the circle
        long[] prefix = new long[2 * n + 1];
        for (int i = 0; i < 2 * n; i++) {
            // Calculate cumulative sum, wrapping around using modulo
            // Use long to prevent integer overflow
            prefix[i + 1] = prefix[i] + balance[i % n];
        }

        // Use a deque to maintain indices with increasing prefix sums
        // This helps us find the minimum prefix sum in each window efficiently
        Deque<Integer> dq = new ArrayDeque<>();

        // Initialize result to a large value
        long result = Long.MAX_VALUE;

        // Process each window of length n
        for (int i = 0; i < 2 * n; i++) {
            // Remove indices that are outside the current window
            // Window is [i - n + 1, i] (inclusive)
            while (!dq.isEmpty() && dq.peekFirst() <= i - n) {
                dq.pollFirst();
            }

            // Remove indices from the back while their prefix sum is greater than current
            // This maintains increasing order of prefix sums in the deque
            while (!dq.isEmpty() && prefix[dq.peekLast()] >= prefix[i]) {
                dq.pollLast();
            }

            // Add current index to deque
            dq.offerLast(i);

            // Once we have processed at least n elements, we can calculate result
            // The minimum prefix sum in the window ending at i is prefix[dq[0]]
            if (i >= n - 1) {
                // The maximum negative prefix sum for this window is the minimum prefix sum
                long minPrefix = prefix[dq.peekFirst()];
                // The deficit at the starting point is prefix[i - n + 1]
                // The maximum negative value is minPrefix - startingPrefix
                long windowMin = minPrefix - prefix[i - n + 1];
                result = Math.min(result, windowMin);
            }
        }

        // If result is non-negative, no moves needed
        // Otherwise, we need -result moves (convert negative to positive)
        return (int) Math.max(0, -result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We create a prefix sum array of size 2n+1: O(n)
- We process each element in the 2n array exactly once: O(n)
- Each element is added to and removed from the deque at most once: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Prefix sum array of size 2n+1: O(n)
- Deque can hold up to n elements: O(n)
- Total: O(n) + O(n) = O(n)

The linear time complexity is optimal because we need to examine each element at least once to determine the solution.

## Common Mistakes

1. **Forgetting the circular nature**: Trying to solve it as a linear array problem. The first and last elements are neighbors, so we need to consider transfers across the boundary. Always test with cases where the optimal solution involves wrapping around.

2. **Incorrect window calculation**: When using the deque approach, off-by-one errors in window boundaries are common. The window should be exactly n elements long, starting from position i-n+1 to i. Double-check your indices with small test cases.

3. **Integer overflow**: With large n and balance values, prefix sums can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python, BigInt if needed in JavaScript).

4. **Missing edge cases**:
   - Empty array (should return 0)
   - All non-negative balances (should return 0)
   - Single element array (can't transfer to anyone, so must already be non-negative)

## When You'll See This Pattern

This problem combines several important patterns:

1. **Circular array problems**: Many problems become easier when you duplicate the array to handle circularity. Similar to:
   - LeetCode 503: Next Greater Element II (circular array)
   - LeetCode 134: Gas Station (circular route with gas and cost)

2. **Sliding window minimum/maximum**: The deque technique for maintaining minimum/maximum in a sliding window appears in:
   - LeetCode 239: Sliding Window Maximum
   - LeetCode 1438: Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit

3. **Prefix sum optimization**: Using prefix sums to efficiently calculate window sums appears in:
   - LeetCode 560: Subarray Sum Equals K
   - LeetCode 325: Maximum Size Subarray Sum Equals k

## Key Takeaways

1. **Circular to linear transformation**: When dealing with circular arrays, a common trick is to duplicate the array. This lets you consider all possible starting points as contiguous windows in the duplicated array.

2. **Deque for sliding window optimizations**: When you need to maintain the minimum or maximum value in a sliding window, a deque (double-ended queue) provides O(1) amortized operations for both adding new elements and removing old ones.

3. **Prefix sums for balance problems**: Problems involving transfers, balances, or net differences often reduce to finding properties of prefix sums. The cumulative sum tells you the net effect up to any point.

[Practice this problem on CodeJeet](/problem/minimum-moves-to-balance-circular-array)
