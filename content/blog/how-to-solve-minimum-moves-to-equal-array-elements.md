---
title: "How to Solve Minimum Moves to Equal Array Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Equal Array Elements. Medium difficulty, 58.5% acceptance rate. Topics: Array, Math."
date: "2028-08-10"
category: "dsa-patterns"
tags: ["minimum-moves-to-equal-array-elements", "array", "math", "medium"]
---

# How to Solve Minimum Moves to Equal Array Elements

This problem asks us to find the minimum number of moves needed to make all elements in an array equal, where each move allows us to increment `n-1` elements by 1. What makes this problem interesting is that it appears to require simulation at first glance, but actually has a clever mathematical insight that reduces it to a simple calculation. The key is recognizing that incrementing `n-1` elements is equivalent to decrementing 1 element.

## Visual Walkthrough

Let's trace through the example `[1, 2, 3]` to build intuition:

**Initial state:** [1, 2, 3]

**Move 1:** Instead of thinking "increment 2 elements by 1", think "decrement 1 element by 1". If we decrement the largest element (3) by 1, we get [1, 2, 2]

**Move 2:** Decrement the largest element (2) by 1, we get [1, 1, 2]

**Move 3:** Decrement the largest element (2) by 1, we get [1, 1, 1]

**Total moves:** 3

Notice that each move effectively reduces the gap between the largest element and the others. The insight: making all elements equal to the minimum value is optimal. Each element `nums[i]` needs `nums[i] - min(nums)` moves to reach the minimum value. Since we can only decrement one element per move, the total moves equals the sum of differences between each element and the minimum.

For `[1, 2, 3]`:

- Element 1: 1 - 1 = 0 moves needed
- Element 2: 2 - 1 = 1 move needed
- Element 3: 3 - 1 = 2 moves needed
  **Total:** 0 + 1 + 2 = 3 moves

## Brute Force Approach

A naive approach would be to simulate the process step by step:

1. Find the maximum element
2. Increment all elements except the maximum
3. Repeat until all elements are equal

This approach fails because:

- Time complexity is O(k × n) where k is the number of moves, which can be extremely large
- For an array like `[1, 1000000]`, we'd need 999999 moves
- Each move requires O(n) operations, making this O(n²) in worst case

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(k * n) where k can be huge | Space: O(1)
def minMoves_brute(nums):
    moves = 0
    n = len(nums)

    while True:
        # Check if all elements are equal
        if len(set(nums)) == 1:
            break

        # Find the maximum element
        max_val = max(nums)
        max_idx = nums.index(max_val)

        # Increment all elements except the maximum
        for i in range(n):
            if i != max_idx:
                nums[i] += 1

        moves += 1

    return moves
```

```javascript
// Time: O(k * n) where k can be huge | Space: O(1)
function minMovesBrute(nums) {
  let moves = 0;
  const n = nums.length;

  while (true) {
    // Check if all elements are equal
    if (new Set(nums).size === 1) break;

    // Find the maximum element
    let maxVal = Math.max(...nums);
    let maxIdx = nums.indexOf(maxVal);

    // Increment all elements except the maximum
    for (let i = 0; i < n; i++) {
      if (i !== maxIdx) {
        nums[i]++;
      }
    }

    moves++;
  }

  return moves;
}
```

```java
// Time: O(k * n) where k can be huge | Space: O(1)
public int minMovesBrute(int[] nums) {
    int moves = 0;
    int n = nums.length;

    while (true) {
        // Check if all elements are equal
        boolean allEqual = true;
        for (int i = 1; i < n; i++) {
            if (nums[i] != nums[0]) {
                allEqual = false;
                break;
            }
        }
        if (allEqual) break;

        // Find the maximum element
        int maxIdx = 0;
        for (int i = 1; i < n; i++) {
            if (nums[i] > nums[maxIdx]) {
                maxIdx = i;
            }
        }

        // Increment all elements except the maximum
        for (int i = 0; i < n; i++) {
            if (i != maxIdx) {
                nums[i]++;
            }
        }

        moves++;
    }

    return moves;
}
```

</div>

## Optimized Approach

The key insight is that incrementing `n-1` elements by 1 is mathematically equivalent to decrementing 1 element by 1. Think about it: if we increment all elements except one, the relative differences between elements remain the same as if we had decremented that one element.

This transforms the problem: instead of trying to raise all elements to some common value, we're trying to lower all elements to the minimum value. Each element `nums[i]` needs `nums[i] - min(nums)` decrements to reach the minimum.

Therefore, the solution is simply:

1. Find the minimum element in the array
2. Sum the differences between each element and the minimum
3. Return that sum

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minMoves(nums):
    """
    Calculate minimum moves to make all array elements equal.

    The key insight: incrementing n-1 elements by 1 is equivalent
    to decrementing 1 element by 1. Therefore, we need to find
    how many decrements are needed to make all elements equal to
    the minimum element.

    Args:
        nums: List of integers

    Returns:
        Minimum number of moves required
    """
    # Step 1: Find the minimum element in the array
    # We need this as our target value since we're effectively
    # decrementing elements down to the minimum
    min_val = min(nums)

    # Step 2: Calculate total moves needed
    # For each element, calculate how many decrements it needs
    # to reach the minimum value, and sum them up
    moves = 0
    for num in nums:
        moves += num - min_val

    return moves

# Alternative one-liner using sum and min
def minMoves_concise(nums):
    return sum(nums) - min(nums) * len(nums)
```

```javascript
// Time: O(n) | Space: O(1)
function minMoves(nums) {
  /**
   * Calculate minimum moves to make all array elements equal.
   *
   * The key insight: incrementing n-1 elements by 1 is equivalent
   * to decrementing 1 element by 1. Therefore, we need to find
   * how many decrements are needed to make all elements equal to
   * the minimum element.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Minimum number of moves required
   */

  // Step 1: Find the minimum element in the array
  // We need this as our target value since we're effectively
  // decrementing elements down to the minimum
  let minVal = Math.min(...nums);

  // Step 2: Calculate total moves needed
  // For each element, calculate how many decrements it needs
  // to reach the minimum value, and sum them up
  let moves = 0;
  for (let num of nums) {
    moves += num - minVal;
  }

  return moves;
}

// Alternative one-liner using reduce and Math.min
function minMovesConcise(nums) {
  const minVal = Math.min(...nums);
  return nums.reduce((sum, num) => sum + (num - minVal), 0);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minMoves(int[] nums) {
        /**
         * Calculate minimum moves to make all array elements equal.
         *
         * The key insight: incrementing n-1 elements by 1 is equivalent
         * to decrementing 1 element by 1. Therefore, we need to find
         * how many decrements are needed to make all elements equal to
         * the minimum element.
         *
         * @param nums Array of integers
         * @return Minimum number of moves required
         */

        // Step 1: Find the minimum element in the array
        // We need this as our target value since we're effectively
        // decrementing elements down to the minimum
        int minVal = Integer.MAX_VALUE;
        for (int num : nums) {
            if (num < minVal) {
                minVal = num;
            }
        }

        // Step 2: Calculate total moves needed
        // For each element, calculate how many decrements it needs
        // to reach the minimum value, and sum them up
        int moves = 0;
        for (int num : nums) {
            moves += num - minVal;
        }

        return moves;
    }

    // Alternative using sum and min calculation
    public int minMovesConcise(int[] nums) {
        int minVal = Integer.MAX_VALUE;
        int sum = 0;

        for (int num : nums) {
            if (num < minVal) {
                minVal = num;
            }
            sum += num;
        }

        return sum - minVal * nums.length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We need to iterate through the array once to find the minimum element: O(n)
- We need to iterate through the array again to calculate the sum of differences: O(n)
- Combined: O(n) + O(n) = O(n)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables like `min_val`, `moves`, and loop counters
- No additional data structures that grow with input size

## Common Mistakes

1. **Trying to simulate the process:** This is the most common mistake. Candidates often try to actually perform the moves step by step, which leads to time limit exceeded errors for large arrays or large values.

2. **Incorrect mathematical formula:** Some candidates try to use `max(nums) - min(nums)` or other simple formulas without understanding that we need the sum of differences, not just the maximum difference.

3. **Integer overflow:** When dealing with large arrays or large values, the sum of differences can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python).

4. **Forgetting edge cases:**
   - Single element array: should return 0
   - Already equal elements: should return 0
   - Empty array: problem states size n, but good to handle gracefully

5. **Confusing with Minimum Moves to Equal Array Elements II:** This is a different problem where you can increment or decrement any element by 1. Don't apply the median-based solution from that problem to this one.

## When You'll See This Pattern

This problem teaches the pattern of **transforming operations** to find a simpler equivalent formulation. Instead of working with the operation as given (increment n-1 elements), we find an equivalent operation (decrement 1 element) that's easier to reason about.

Similar problems that use operation transformation:

1. **Minimum Moves to Equal Array Elements II** (Medium): Here you can increment or decrement any element by 1. The optimal target is the median, not the minimum.

2. **Bulb Switcher** (Medium): Instead of simulating bulb toggles, recognize that bulbs are toggled when their position is divisible by the round number, leading to a square root solution.

3. **Water and Jug Problem** (Medium): Instead of simulating pours, use number theory (GCD) to determine if the target is achievable.

4. **Pour Water Between Buckets to Make Water Levels Equal** (Medium): Similar transformation thinking about moving water between buckets.

## Key Takeaways

1. **Look for mathematical equivalences:** When an operation seems complicated, see if there's an equivalent operation that's easier to work with. Incrementing n-1 elements = decrementing 1 element.

2. **Think in terms of relative differences:** Instead of focusing on absolute values, consider what needs to change relative to a target (usually the minimum or median).

3. **Avoid simulation when possible:** If a problem asks for a count of operations, there's often a direct mathematical formula rather than needing to simulate each step.

Related problems: [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii), [Maximum Running Time of N Computers](/problem/maximum-running-time-of-n-computers), [Pour Water Between Buckets to Make Water Levels Equal](/problem/pour-water-between-buckets-to-make-water-levels-equal)
