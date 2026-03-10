---
title: "How to Solve Three Consecutive Odds — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Three Consecutive Odds. Easy difficulty, 69.3% acceptance rate. Topics: Array."
date: "2027-06-19"
category: "dsa-patterns"
tags: ["three-consecutive-odds", "array", "easy"]
---

# How to Solve Three Consecutive Odds

This problem asks us to determine whether an integer array contains three consecutive odd numbers. While conceptually straightforward, it tests your ability to handle array traversal, boundary conditions, and simple parity checks efficiently. The challenge lies in implementing a clean solution that handles edge cases correctly without overcomplicating the logic.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the array: `[1, 2, 3, 5, 7, 9]`

We need to check if there are three consecutive odd numbers anywhere in this array.

**Step-by-step process:**

1. Start at index 0: `1` is odd. We have 1 odd in a row.
2. Move to index 1: `2` is even. Reset our consecutive odd counter to 0.
3. Move to index 2: `3` is odd. We have 1 odd in a row.
4. Move to index 3: `5` is odd. We have 2 odds in a row.
5. Move to index 4: `7` is odd. We have 3 odds in a row! ✅

Since we found three consecutive odds (`3, 5, 7`), we can return `true` immediately. We don't need to check the rest of the array.

Now let's try an array without three consecutive odds: `[1, 3, 2, 5, 7]`

1. Index 0: `1` is odd → count = 1
2. Index 1: `3` is odd → count = 2
3. Index 2: `2` is even → count = 0 (reset)
4. Index 3: `5` is odd → count = 1
5. Index 4: `7` is odd → count = 2
6. End of array with count = 2 → return `false`

The key insight is that we can traverse the array once, maintaining a counter of consecutive odd numbers, and resetting it whenever we encounter an even number.

## Brute Force Approach

A naive approach might check every possible triple of consecutive elements in the array:

1. For each starting index `i` from 0 to `n-3`
2. Check if `arr[i]`, `arr[i+1]`, and `arr[i+2]` are all odd
3. If any triple satisfies this condition, return `true`
4. If we finish checking all triples without finding one, return `false`

While this approach would work correctly, it's not optimal because:

- It explicitly checks every possible triple even when we could stop early
- The logic for checking three elements at once is slightly more complex than necessary
- It requires careful handling of arrays with fewer than 3 elements

However, for this particular problem, the brute force approach actually has the same time complexity as the optimal solution (O(n)) since we must examine each element at least once in the worst case. The difference is in code clarity and the ability to short-circuit early.

## Optimal Solution

The optimal solution uses a single pass through the array with a counter. We iterate through each element, incrementing a counter when we see an odd number and resetting it to 0 when we see an even number. If the counter ever reaches 3, we can return `true` immediately. If we reach the end of the array without the counter reaching 3, we return `false`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def threeConsecutiveOdds(arr):
    """
    Check if there are three consecutive odd numbers in the array.

    Args:
        arr: List of integers to check

    Returns:
        True if three consecutive odds exist, False otherwise
    """
    consecutive_odds = 0  # Counter for consecutive odd numbers

    # Iterate through each number in the array
    for num in arr:
        # Check if the current number is odd
        if num % 2 == 1:
            # Increment the consecutive odds counter
            consecutive_odds += 1

            # If we've found 3 consecutive odds, return True immediately
            if consecutive_odds == 3:
                return True
        else:
            # Reset counter when we encounter an even number
            consecutive_odds = 0

    # If we finish the loop without finding 3 consecutive odds
    return False
```

```javascript
// Time: O(n) | Space: O(1)
function threeConsecutiveOdds(arr) {
  /**
   * Check if there are three consecutive odd numbers in the array.
   *
   * @param {number[]} arr - Array of integers to check
   * @return {boolean} True if three consecutive odds exist, False otherwise
   */
  let consecutiveOdds = 0; // Counter for consecutive odd numbers

  // Iterate through each number in the array
  for (let i = 0; i < arr.length; i++) {
    // Check if the current number is odd
    if (arr[i] % 2 === 1) {
      // Increment the consecutive odds counter
      consecutiveOdds++;

      // If we've found 3 consecutive odds, return true immediately
      if (consecutiveOdds === 3) {
        return true;
      }
    } else {
      // Reset counter when we encounter an even number
      consecutiveOdds = 0;
    }
  }

  // If we finish the loop without finding 3 consecutive odds
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean threeConsecutiveOdds(int[] arr) {
        /**
         * Check if there are three consecutive odd numbers in the array.
         *
         * @param arr Array of integers to check
         * @return True if three consecutive odds exist, False otherwise
         */
        int consecutiveOdds = 0;  // Counter for consecutive odd numbers

        // Iterate through each number in the array
        for (int num : arr) {
            // Check if the current number is odd
            if (num % 2 == 1) {
                // Increment the consecutive odds counter
                consecutiveOdds++;

                // If we've found 3 consecutive odds, return true immediately
                if (consecutiveOdds == 3) {
                    return true;
                }
            } else {
                // Reset counter when we encounter an even number
                consecutiveOdds = 0;
            }
        }

        // If we finish the loop without finding 3 consecutive odds
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, examining each element exactly once
- In the worst case, we examine all `n` elements (when there are no three consecutive odds)
- In the best case, we might find three consecutive odds early and return immediately
- The early return optimization doesn't change the worst-case asymptotic complexity but improves practical performance

**Space Complexity: O(1)**

- We only use a constant amount of extra space: the `consecutive_odds` counter
- No additional data structures that grow with input size
- This is optimal since we must at least examine each element

## Common Mistakes

1. **Off-by-one errors in index-based approaches**: When checking `arr[i]`, `arr[i+1]`, and `arr[i+2]`, candidates might loop up to `n-1` instead of `n-3`, causing index out of bounds errors.

2. **Incorrect odd number check**: Using `num % 2 != 0` works for positive numbers but can fail for negative odd numbers in some languages. The safest approach is `num % 2 == 1` or `Math.abs(num) % 2 == 1`.

3. **Forgetting to handle small arrays**: Arrays with fewer than 3 elements can never have three consecutive odds. Some solutions might try to access indices that don't exist. The counter-based approach handles this automatically.

4. **Not resetting the counter properly**: When encountering an even number, the counter must be reset to 0, not decremented. A sequence like `[1, 3, 2, 1, 3, 5]` would incorrectly return `true` if the counter is decremented instead of reset.

5. **Continuing to check after finding a match**: Some candidates continue iterating even after finding three consecutive odds. Always return immediately when `consecutive_odds == 3` for optimal performance.

## When You'll See This Pattern

This problem uses the **sliding window of fixed size** pattern, though in a simplified form where we only need to track the window size rather than its contents. Similar patterns appear in:

1. **Maximum Consecutive Ones** (LeetCode 485): Find the maximum number of consecutive 1s in a binary array. Instead of checking for exactly 3, you track the maximum count.

2. **Longest Consecutive Sequence** (LeetCode 128): Find the length of the longest consecutive elements sequence. This extends the concept to checking numerical continuity rather than just parity.

3. **Grumpy Bookstore Owner** (LeetCode 1052): Uses a sliding window to maximize satisfaction within a fixed window size, similar to how we're checking for a condition within a fixed window of 3 elements.

The core technique of maintaining a counter that increments when a condition is met and resets when it's not is fundamental to many array processing problems.

## Key Takeaways

1. **Single-pass with counter**: Many array problems can be solved with a single pass while maintaining a counter or state variable. This is often more efficient and cleaner than nested loops.

2. **Early termination**: When you find what you're looking for, return immediately. Don't waste time continuing to process the array.

3. **Reset logic matters**: Pay close attention to when and how you reset counters. In this case, we reset to 0 (not 1) when we encounter an even number because a single even number breaks the consecutive streak completely.

4. **Edge cases are important**: Always consider arrays with fewer than 3 elements, all even numbers, all odd numbers, and mixed patterns. The counter-based approach handles all these naturally.

[Practice this problem on CodeJeet](/problem/three-consecutive-odds)
