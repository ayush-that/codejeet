---
title: "How to Solve Sorting Three Groups — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sorting Three Groups. Medium difficulty, 42.9% acceptance rate. Topics: Array, Binary Search, Dynamic Programming."
date: "2029-07-16"
category: "dsa-patterns"
tags: ["sorting-three-groups", "array", "binary-search", "dynamic-programming", "medium"]
---

# How to Solve Sorting Three Groups

You're given an array where each element is 1, 2, or 3, and you need to make it non-decreasing by removing elements (not rearranging them). The challenge is finding the minimum removals needed. What makes this interesting is that while the values are limited to just three numbers, the optimal solution isn't obvious—you can't simply sort the array since you can only remove elements, not rearrange them.

## Visual Walkthrough

Let's trace through an example: `nums = [2, 1, 3, 2, 1]`

We want the final array to be non-decreasing after removing some elements. Since we can only remove (not rearrange), the remaining elements must appear in their original order. Think of it as finding the longest non-decreasing subsequence (LNDS) where values are only 1, 2, or 3.

For `[2, 1, 3, 2, 1]`:

- One possible non-decreasing subsequence: `[2, 3]` (remove indices 1, 3, 4)
- Another: `[1, 2]` (remove indices 0, 2, 4)
- Another: `[1, 3]` (remove indices 0, 1, 3)
- The longest: `[1, 2]` or `[1, 3]` or `[2, 3]` all have length 2

Since the original array has 5 elements, if the longest non-decreasing subsequence has length 2, we need to remove 5 - 2 = 3 elements.

But wait—there's a catch! Because values are only 1, 2, or 3, any valid non-decreasing sequence will have a specific pattern: it can start with some 1's, then some 2's, then some 3's. So we're looking for the longest subsequence that follows this "1, then 2, then 3" pattern.

Let's find it systematically:

1. The subsequence could be all 1's: `[1, 1]` (indices 1 and 4) → length 2
2. All 2's: `[2, 2]` (indices 0 and 3) → length 2
3. All 3's: `[3]` → length 1
4. 1's then 2's: `[1, 2]` (indices 1 and 3) → length 2
5. 1's then 3's: `[1, 3]` (indices 1 and 2) → length 2
6. 2's then 3's: `[2, 3]` (indices 0 and 2) → length 2
7. 1's then 2's then 3's: `[1, 2]` or `[1, 3]` (no complete 1-2-3 sequence)

The maximum length is 2, so minimum removals = 5 - 2 = 3.

## Brute Force Approach

A naive approach would be to try all possible subsequences and check if they're non-decreasing. For each element, we either include it or don't, giving us 2^n possibilities. For each subsequence, we'd check if it's non-decreasing and follows the 1→2→3 pattern.

The brute force code would look like this:

<div class="code-group">

```python
# Brute force - too slow for n > 20
def minimumOperations(nums):
    n = len(nums)
    min_removals = n  # worst case: remove everything

    # Try all 2^n subsequences
    for mask in range(1 << n):
        subsequence = []
        removals = 0

        # Build subsequence based on mask bits
        for i in range(n):
            if mask & (1 << i):
                subsequence.append(nums[i])
            else:
                removals += 1

        # Check if subsequence is valid (non-decreasing and only 1,2,3)
        valid = True
        for i in range(1, len(subsequence)):
            if subsequence[i] < subsequence[i-1]:
                valid = False
                break

        if valid:
            min_removals = min(min_removals, removals)

    return min_removals
```

```javascript
// Brute force - exponential time
function minimumOperations(nums) {
  const n = nums.length;
  let minRemovals = n; // worst case: remove all

  // Try all 2^n subsequences
  for (let mask = 0; mask < 1 << n; mask++) {
    const subsequence = [];
    let removals = 0;

    // Build subsequence based on mask bits
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subsequence.push(nums[i]);
      } else {
        removals++;
      }
    }

    // Check if subsequence is non-decreasing
    let valid = true;
    for (let i = 1; i < subsequence.length; i++) {
      if (subsequence[i] < subsequence[i - 1]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      minRemovals = Math.min(minRemovals, removals);
    }
  }

  return minRemovals;
}
```

```java
// Brute force - O(2^n) time
public int minimumOperations(int[] nums) {
    int n = nums.length;
    int minRemovals = n; // worst case: remove all elements

    // Try all 2^n subsequences
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subsequence = new ArrayList<>();
        int removals = 0;

        // Build subsequence based on mask bits
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                subsequence.add(nums[i]);
            } else {
                removals++;
            }
        }

        // Check if subsequence is non-decreasing
        boolean valid = true;
        for (int i = 1; i < subsequence.size(); i++) {
            if (subsequence.get(i) < subsequence.get(i-1)) {
                valid = false;
                break;
            }
        }

        if (valid) {
            minRemovals = Math.min(minRemovals, removals);
        }
    }

    return minRemovals;
}
```

</div>

This brute force approach has O(2^n) time complexity, which is far too slow for n up to 10^5 (typical constraints). We need a more efficient approach.

## Optimized Approach

The key insight is that because values are only 1, 2, or 3, any valid non-decreasing subsequence must follow a specific pattern: it can be:

1. All 1's
2. All 2's
3. All 3's
4. Some 1's followed by some 2's
5. Some 1's followed by some 3's
6. Some 2's followed by some 3's
7. Some 1's followed by some 2's followed by some 3's

So we can think of this as finding the longest subsequence that matches one of these 7 patterns. But there's an even better way: dynamic programming.

Let `dp[i][v]` represent the length of the longest valid subsequence ending at position `i` with value `v` (where v is 1, 2, or 3). The recurrence relation is:

- `dp[i][1] = 1 + dp[i-1][1]` if `nums[i] == 1` (can only extend sequence of 1's)
- `dp[i][2] = 1 + max(dp[i-1][1], dp[i-1][2])` if `nums[i] == 2` (can extend sequence of 1's or 2's)
- `dp[i][3] = 1 + max(dp[i-1][1], dp[i-1][2], dp[i-1][3])` if `nums[i] == 3` (can extend any sequence)

But actually, we can simplify further! Since we're looking for the longest valid subsequence in the entire array (not ending at a specific position), we can maintain just three values:

- `ones`: longest subsequence of all 1's
- `twos`: longest subsequence ending with 2 (could be all 2's or 1's then 2's)
- `threes`: longest subsequence ending with 3 (could be all 3's, 1's then 3's, 2's then 3's, or 1's then 2's then 3's)

As we process each number:

- If it's 1: can only extend the `ones` sequence
- If it's 2: can extend either `ones` or `twos` (take the max)
- If it's 3: can extend `ones`, `twos`, or `threes` (take the max)

The answer is `n - max(ones, twos, threes)`.

## Optimal Solution

Here's the efficient O(n) time, O(1) space solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumOperations(nums):
    """
    Find minimum removals to make array non-decreasing.
    Since values are only 1,2,3, any valid non-decreasing
    subsequence must follow pattern: 1...1, 2...2, 3...3,
    or 1...1 then 2...2, or 1...1 then 3...3, or 2...2 then 3...3,
    or 1...1 then 2...2 then 3...3.
    """
    # Track longest subsequence ending with each value
    ones = twos = threes = 0

    for num in nums:
        if num == 1:
            # 1 can only extend subsequence of ones
            ones += 1
        elif num == 2:
            # 2 can extend subsequence of ones or twos
            # (pattern: all 2's, or 1's then 2's)
            twos = max(ones, twos) + 1
        else:  # num == 3
            # 3 can extend subsequence of ones, twos, or threes
            # (pattern: all 3's, 1's then 3's, 2's then 3's, or 1's then 2's then 3's)
            threes = max(ones, twos, threes) + 1

    # Longest valid non-decreasing subsequence
    longest = max(ones, twos, threes)

    # Minimum removals = total elements - longest valid subsequence
    return len(nums) - longest
```

```javascript
// Time: O(n) | Space: O(1)
function minimumOperations(nums) {
  /**
   * Find minimum removals to make array non-decreasing.
   * We track the longest subsequence ending with each value (1,2,3).
   */
  let ones = 0,
    twos = 0,
    threes = 0;

  for (const num of nums) {
    if (num === 1) {
      // 1 can only extend subsequence of ones
      ones++;
    } else if (num === 2) {
      // 2 can extend subsequence of ones or twos
      // Take the maximum because we want the longest possible
      twos = Math.max(ones, twos) + 1;
    } else {
      // num === 3
      // 3 can extend subsequence of ones, twos, or threes
      threes = Math.max(ones, twos, threes) + 1;
    }
  }

  // Longest valid non-decreasing subsequence
  const longest = Math.max(ones, twos, threes);

  // Minimum removals = total - longest valid subsequence
  return nums.length - longest;
}
```

```java
// Time: O(n) | Space: O(1)
public int minimumOperations(int[] nums) {
    /**
     * Track longest subsequence ending with each value.
     * ones: longest subsequence of all 1's
     * twos: longest subsequence ending with 2 (could be all 2's or 1's then 2's)
     * threes: longest subsequence ending with 3 (could be all 3's, 1's then 3's,
     *         2's then 3's, or 1's then 2's then 3's)
     */
    int ones = 0, twos = 0, threes = 0;

    for (int num : nums) {
        if (num == 1) {
            // 1 can only extend subsequence of ones
            ones++;
        } else if (num == 2) {
            // 2 can extend subsequence of ones or twos
            // We take max because we want the longest possible sequence
            twos = Math.max(ones, twos) + 1;
        } else { // num == 3
            // 3 can extend subsequence of ones, twos, or threes
            threes = Math.max(Math.max(ones, twos), threes) + 1;
        }
    }

    // Longest valid non-decreasing subsequence
    int longest = Math.max(Math.max(ones, twos), threes);

    // Minimum removals = total elements - longest valid subsequence
    return nums.length - longest;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time operations for each element.
- The operations are simple comparisons and max calculations.

**Space Complexity:** O(1)

- We only use three integer variables (`ones`, `twos`, `threes`) regardless of input size.
- No additional data structures that scale with input size.

## Common Mistakes

1. **Trying to actually sort or rearrange elements**: Remember, you can only remove elements, not rearrange them. The remaining elements must stay in their original order. This is a subsequence problem, not a sorting problem.

2. **Overcomplicating with full LIS algorithm**: While this is essentially finding the Longest Non-Decreasing Subsequence (LNDS), the standard O(n²) or O(n log n) LIS algorithms are overkill. The constraint that values are only 1, 2, or 3 allows for the O(n) solution.

3. **Incorrect update order for the three counters**: When updating `twos`, you must use the current value of `ones` (not updated in this iteration). Similarly for `threes`, use current values of `ones` and `twos`. The updates happen independently based on the original values.

4. **Forgetting that 2 can extend a sequence of 1's**: Some candidates think 2 can only follow 2, but actually 2 can follow 1 in a valid non-decreasing sequence. That's why `twos = max(ones, twos) + 1` when we see a 2.

## When You'll See This Pattern

This problem uses a **state machine DP** pattern where we track the best result for each possible "state" (ending with 1, 2, or 3). Similar patterns appear in:

1. **Longest Increasing Subsequence (LeetCode 300)** - The classic problem, though usually solved with binary search for O(n log n). This problem is a special case with limited values.

2. **Wiggle Subsequence (LeetCode 376)** - Another subsequence problem where you track two states: ending with an up wiggle or down wiggle.

3. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)** - Uses state machine DP to track whether you're holding stock or not.

4. **House Robber (LeetCode 198)** - While simpler, it uses a similar idea of tracking two states: rob current house or skip it.

The key insight is recognizing when you can reduce a seemingly complex problem to tracking a small number of states due to constraints in the problem.

## Key Takeaways

1. **Constraints simplify problems**: When values are limited (here only 1, 2, 3), look for ways to exploit that limitation for better algorithms. Instead of O(n²) or O(n log n) LIS, we get O(n).

2. **Think in terms of valid patterns**: For non-decreasing sequences with limited values, enumerate the possible patterns. Here there are only 7 possible patterns for any valid subsequence.

3. **State machine DP is powerful**: When you need to track different "types" of subsequences or paths, maintaining counters for each type can lead to efficient solutions. The state transitions (how each new element affects each counter) are the key to the algorithm.

[Practice this problem on CodeJeet](/problem/sorting-three-groups)
