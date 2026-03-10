---
title: "How to Solve Guess Number Higher or Lower — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Guess Number Higher or Lower. Easy difficulty, 57.2% acceptance rate. Topics: Binary Search, Interactive."
date: "2026-10-21"
category: "dsa-patterns"
tags: ["guess-number-higher-or-lower", "binary-search", "interactive", "easy"]
---

# How to Solve Guess Number Higher or Lower

This is a classic interactive guessing game where you need to find a secret number between 1 and `n` using only "higher" or "lower" feedback. What makes this problem interesting is that it's essentially a binary search problem disguised as a game - you can't see the array, but you're searching through a sorted range of numbers. The challenge lies in implementing the binary search correctly without getting tripped up by the interactive nature or off-by-one errors.

## Visual Walkthrough

Let's trace through an example where `n = 10` and the secret number is `6`. The game provides a `guess(num)` function that returns:

- `-1` if your guess is higher than the secret number
- `1` if your guess is lower than the secret number
- `0` if your guess is correct

**Step 1:** Initialize search range: `left = 1`, `right = 10`
**Step 2:** Calculate midpoint: `mid = (1 + 10) // 2 = 5`
**Step 3:** Call `guess(5)` → returns `1` (secret is higher than 5)
**Step 4:** Update `left = mid + 1 = 6` (search in upper half)
**Step 5:** Calculate new midpoint: `mid = (6 + 10) // 2 = 8`
**Step 6:** Call `guess(8)` → returns `-1` (secret is lower than 8)
**Step 7:** Update `right = mid - 1 = 7` (search in lower half)
**Step 8:** Calculate new midpoint: `mid = (6 + 7) // 2 = 6`
**Step 9:** Call `guess(6)` → returns `0` (correct!)

We found the secret number in just 3 guesses instead of potentially 10 with linear search.

## Brute Force Approach

The most straightforward approach would be to try every number from 1 to `n` sequentially:

1. Start with `guess = 1`
2. Call the API with `guess`
3. If result is `0`, return `guess`
4. Otherwise, increment `guess` and repeat

While this would eventually find the number, it's highly inefficient with a time complexity of O(n). For `n = 2^31 - 1` (the maximum constraint), this could take billions of guesses! The problem explicitly asks for an efficient solution, and binary search reduces this to O(log n) time.

## Optimal Solution

The optimal solution uses binary search. Since the numbers from 1 to `n` are sorted, and we get feedback telling us whether to go higher or lower, we can repeatedly halve our search space. This is exactly how binary search works.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def guessNumber(n: int) -> int:
    """
    Find the secret number between 1 and n using binary search.

    Args:
        n: The upper bound of the search range (1 to n)

    Returns:
        The secret number that was picked
    """
    left, right = 1, n

    while left <= right:
        # Calculate midpoint - using this formula prevents integer overflow
        mid = left + (right - left) // 2

        # Get feedback from the guess API
        result = guess(mid)

        if result == 0:
            # Found the secret number
            return mid
        elif result == -1:
            # Secret number is lower than our guess
            # Search in the left half (exclude mid since we know it's wrong)
            right = mid - 1
        else:  # result == 1
            # Secret number is higher than our guess
            # Search in the right half (exclude mid since we know it's wrong)
            left = mid + 1

    # In theory, we should always find the number before exiting the loop
    # This return is just for safety
    return -1
```

```javascript
// Time: O(log n) | Space: O(1)
function guessNumber(n) {
  /**
   * Find the secret number between 1 and n using binary search.
   *
   * @param {number} n - The upper bound of the search range (1 to n)
   * @return {number} The secret number that was picked
   */
  let left = 1;
  let right = n;

  while (left <= right) {
    // Calculate midpoint - using this formula prevents integer overflow
    const mid = Math.floor(left + (right - left) / 2);

    // Get feedback from the guess API
    const result = guess(mid);

    if (result === 0) {
      // Found the secret number
      return mid;
    } else if (result === -1) {
      // Secret number is lower than our guess
      // Search in the left half (exclude mid since we know it's wrong)
      right = mid - 1;
    } else {
      // result === 1
      // Secret number is higher than our guess
      // Search in the right half (exclude mid since we know it's wrong)
      left = mid + 1;
    }
  }

  // In theory, we should always find the number before exiting the loop
  // This return is just for safety
  return -1;
}
```

```java
// Time: O(log n) | Space: O(1)
public class Solution extends GuessGame {
    public int guessNumber(int n) {
        /**
         * Find the secret number between 1 and n using binary search.
         *
         * @param n The upper bound of the search range (1 to n)
         * @return The secret number that was picked
         */
        int left = 1;
        int right = n;

        while (left <= right) {
            // Calculate midpoint - using this formula prevents integer overflow
            int mid = left + (right - left) / 2;

            // Get feedback from the guess API
            int result = guess(mid);

            if (result == 0) {
                // Found the secret number
                return mid;
            } else if (result == -1) {
                // Secret number is lower than our guess
                // Search in the left half (exclude mid since we know it's wrong)
                right = mid - 1;
            } else {  // result == 1
                // Secret number is higher than our guess
                // Search in the right half (exclude mid since we know it's wrong)
                left = mid + 1;
            }
        }

        // In theory, we should always find the number before exiting the loop
        // This return is just for safety
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each iteration of the while loop halves the search space
- Starting with n elements, after k iterations we have n/(2^k) elements remaining
- The loop stops when n/(2^k) ≤ 1, which means k ≈ log₂(n)
- Even for the maximum n = 2^31 - 1, we need at most 31 guesses

**Space Complexity:** O(1)

- We only use a constant amount of extra space (variables for `left`, `right`, `mid`, and `result`)
- No additional data structures are created that scale with input size

## Common Mistakes

1. **Infinite loops from incorrect boundary updates**: Forgetting to add/subtract 1 when updating `left` or `right` can cause the same `mid` to be calculated repeatedly. Always remember: if `guess(mid)` returns -1, the secret is lower, so set `right = mid - 1`. If it returns 1, set `left = mid + 1`.

2. **Integer overflow when calculating midpoint**: Using `(left + right) // 2` can overflow when `left` and `right` are large (close to 2^31). The safe formula is `left + (right - left) // 2`.

3. **Incorrect loop condition**: Using `while (left < right)` instead of `while (left <= right)` can miss the case where the secret number is at the boundary. With `<=`, the loop continues until the search space is empty.

4. **Not handling the API return values correctly**: The problem specifies that `guess()` returns -1 if num is higher than the pick, 1 if num is lower than the pick, and 0 if equal. Mixing up these return values (thinking -1 means "go lower" instead of "your guess is too high") is a common logical error.

## When You'll See This Pattern

This binary search pattern appears whenever you need to find an element in a sorted range or when you can make decisions that eliminate half the search space:

1. **First Bad Version** - Almost identical problem structure. Instead of guessing a number, you're finding the first bad version in a sorted sequence of good then bad versions.

2. **Search in Rotated Sorted Array** - A more complex variation where the array is rotated, but you can still use modified binary search by checking which half is properly sorted.

3. **Find Peak Element** - Uses binary search on conditions rather than exact values, similar to how we use the `guess()` API feedback here.

4. **Capacity To Ship Packages Within D Days** - Uses binary search on the answer space (the capacity) rather than an explicit array.

## Key Takeaways

1. **Binary search works on any monotonic function, not just arrays**: Even though we don't have an explicit array here, the numbers 1 to n are implicitly sorted, and the `guess()` function gives us the comparison feedback needed for binary search.

2. **The midpoint calculation matters**: Always use `left + (right - left) // 2` instead of `(left + right) // 2` to avoid integer overflow in languages with fixed integer sizes.

3. **Interactive problems often hide standard algorithms**: Don't be fooled by the game-like presentation - recognize that this is fundamentally a search problem with comparison feedback, which screams "binary search."

Related problems: [First Bad Version](/problem/first-bad-version), [Guess Number Higher or Lower II](/problem/guess-number-higher-or-lower-ii), [Find K Closest Elements](/problem/find-k-closest-elements)
