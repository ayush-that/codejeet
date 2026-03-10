---
title: "How to Solve Minimum Moves to Equal Array Elements III — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Equal Array Elements III. Easy difficulty, 81.3% acceptance rate. Topics: Array, Math."
date: "2029-01-22"
category: "dsa-patterns"
tags: ["minimum-moves-to-equal-array-elements-iii", "array", "math", "easy"]
---

# How to Solve Minimum Moves to Equal Array Elements III

This problem asks us to find the minimum number of moves needed to make all elements in an array equal, where each move consists of incrementing any element by 1. While it seems straightforward, the key insight is recognizing that we don't need to guess what the final equal value should be—it's mathematically determined by the array's minimum element.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 2, 1, 5]`.

**Step 1: Find the minimum element**
Looking at the array, the minimum value is 1 (at index 2).

**Step 2: Calculate moves needed for each element**
We need to make all elements equal to some value. If we choose the minimum value (1) as our target, we'd need to decrease some elements, which isn't allowed (we can only increase). So we need to increase elements to reach a common value.

Actually, think about it this way: The only operation allowed is increasing elements. This means the final equal value must be at least as large as the current maximum element. But wait—if we make all elements equal to the maximum, we'll need many moves. There's a better approach.

Let me reconsider: Since we can only increase elements, the final equal value must be at least the current maximum. But actually, we can choose any value ≥ the current maximum. However, to minimize moves, we want the smallest possible final value. That would be... the current maximum itself!

But that doesn't seem right either. Let me test with our example `[3, 2, 1, 5]`:

- Current maximum is 5
- To make all elements equal to 5:
  - 3 needs 2 moves (3→4→5)
  - 2 needs 3 moves (2→3→4→5)
  - 1 needs 4 moves (1→2→3→4→5)
  - 5 needs 0 moves
  - Total: 2 + 3 + 4 + 0 = 9 moves

But is there a better target? Let's try making all elements equal to 4:

- 3 needs 1 move
- 2 needs 2 moves
- 1 needs 3 moves
- 5 needs -1 moves (impossible—we can't decrease!)

So we can't choose a target smaller than the maximum. What about 6?

- 3 needs 3 moves
- 2 needs 4 moves
- 1 needs 5 moves
- 5 needs 1 move
- Total: 13 moves (worse than 9)

So the optimal target is indeed the maximum value. But wait—let me check the math more carefully. For `[1, 2, 3]`:

- Maximum is 3
- Moves needed: (3-1) + (3-2) + (3-3) = 2 + 1 + 0 = 3

But actually, there's an even simpler way to think about this. Instead of finding the maximum and calculating differences, we can think in terms of the minimum element. Since we can only increase elements, every element must eventually reach at least the current maximum. But actually, the optimal approach is to realize that making all elements equal to the current maximum minimizes moves.

Let me formalize: For each element `nums[i]`, the number of moves needed to reach the maximum value `max_val` is `max_val - nums[i]`. The total moves is the sum of these differences for all elements.

But actually, there's an equivalent formulation: Instead of thinking about reaching the maximum, think about how many increments we need. Each increment brings some element closer to equality. When all elements are equal, they'll all be at the maximum of the original array (since we can't decrease any element below its original value).

So the solution is simply: `sum(max_val - nums[i]) for all i`, which equals `n * max_val - sum(nums)`.

Wait, let me test this with `[3, 2, 1, 5]`:

- Maximum is 5, n = 4, sum = 3+2+1+5 = 11
- Total moves = 4×5 - 11 = 20 - 11 = 9 ✓

But actually, I made an error in my earlier calculation! The formula should be `sum(nums) - n * min_val`. Let me check why...

Actually, let's think differently. If we can only increase elements, then the minimum element never needs to be increased (it might stay as is or be increased to match others). But all other elements need to be increased to reach at least the minimum. Hmm, that doesn't work because if we make everything equal to the minimum, we'd need to decrease some elements.

Let me reconsider the operation: We can only increase. So if we want all elements to be equal to some value `x`, then `x` must be ≥ every element's current value (otherwise we'd need to decrease some elements). The smallest such `x` is the maximum element. So we should make all elements equal to the maximum.

Thus: moves = Σ(max_val - nums[i]) = n×max_val - Σ(nums)

But actually, there's a known trick for this problem. The correct insight is: We need to increase all elements except the maximum to reach the maximum value. So we sum the differences between each element and the maximum.

Let me verify with another example: `[1, 1, 1, 5]`

- Maximum is 5
- Moves = (5-1)+(5-1)+(5-1)+(5-5) = 4+4+4+0 = 12
- Using formula: n=4, max=5, sum=8 → 4×5-8=20-8=12 ✓

Actually, I just realized there's an even simpler way: Since we're adding the same total number of increments regardless of which elements we increment, and since we need to add enough increments to make all elements equal to the maximum, the answer is simply the sum of differences from the maximum.

## Brute Force Approach

A naive approach would be to try every possible target value from the minimum to some upper bound, calculate the moves needed for each target, and take the minimum. However, this is inefficient because:

1. We don't know what the upper bound should be
2. Even if we bound it (say, to the maximum + some range), checking each possible value would be O(k×n) where k is the range size
3. We can see mathematically that the optimal target is exactly the maximum element, so checking other values is unnecessary

The brute force would look something like this (inefficient):

<div class="code-group">

```python
# Brute force - trying all possible targets
# Time: O(n × (max_val - min_val)) - Very inefficient for large ranges!
# Space: O(1)
def minMoves_brute(nums):
    if not nums:
        return 0

    min_val = min(nums)
    max_val = max(nums)

    min_moves = float('inf')

    # Try every possible target from min_val to max_val
    for target in range(min_val, max_val + 1):
        moves = 0
        for num in nums:
            if num < target:
                moves += target - num
            # If num > target, we can't decrease it, so this target is invalid
            elif num > target:
                moves = float('inf')
                break

        if moves < min_moves:
            min_moves = moves

    return min_moves
```

```javascript
// Brute force - trying all possible targets
// Time: O(n × (max_val - min_val)) - Very inefficient for large ranges!
// Space: O(1)
function minMovesBrute(nums) {
  if (nums.length === 0) return 0;

  let minVal = Math.min(...nums);
  let maxVal = Math.max(...nums);
  let minMoves = Infinity;

  // Try every possible target from minVal to maxVal
  for (let target = minVal; target <= maxVal; target++) {
    let moves = 0;
    let valid = true;

    for (let num of nums) {
      if (num < target) {
        moves += target - num;
      } else if (num > target) {
        // Can't decrease elements, so this target is invalid
        valid = false;
        break;
      }
    }

    if (valid && moves < minMoves) {
      minMoves = moves;
    }
  }

  return minMoves;
}
```

```java
// Brute force - trying all possible targets
// Time: O(n × (max_val - min_val)) - Very inefficient for large ranges!
// Space: O(1)
public int minMovesBrute(int[] nums) {
    if (nums.length == 0) return 0;

    int minVal = Integer.MAX_VALUE;
    int maxVal = Integer.MIN_VALUE;

    for (int num : nums) {
        minVal = Math.min(minVal, num);
        maxVal = Math.max(maxVal, num);
    }

    int minMoves = Integer.MAX_VALUE;

    // Try every possible target from minVal to maxVal
    for (int target = minVal; target <= maxVal; target++) {
        int moves = 0;
        boolean valid = true;

        for (int num : nums) {
            if (num < target) {
                moves += target - num;
            } else if (num > target) {
                // Can't decrease elements, so this target is invalid
                valid = false;
                break;
            }
        }

        if (valid && moves < minMoves) {
            minMoves = moves;
        }
    }

    return minMoves;
}
```

</div>

This brute force approach is too slow because if the array has a wide range of values (e.g., `[1, 1000000]`), we'd need to check about a million possible targets.

## Optimal Solution

The key insight is that since we can only increase elements, the final equal value must be at least the maximum element in the array. To minimize moves, we should choose the smallest possible final value, which is exactly the maximum element itself.

Therefore, for each element `nums[i]`, we need `max_val - nums[i]` moves to reach the maximum. The total moves is the sum of these differences.

Mathematically: `total_moves = Σ(max_val - nums[i]) = n × max_val - Σ(nums[i])`

This gives us an O(n) solution: find the maximum, find the sum, then compute the result.

<div class="code-group">

```python
# Optimal solution
# Time: O(n) - We make two passes through the array
# Space: O(1) - We only use a few variables
def minMoves(nums):
    # Edge case: empty array requires 0 moves
    if not nums:
        return 0

    # Step 1: Find the maximum value in the array
    # We need this because we can only increase elements,
    # so all elements must reach at least this value
    max_val = nums[0]
    for num in nums:
        if num > max_val:
            max_val = num

    # Step 2: Calculate total moves needed
    # For each element, we need (max_val - num) moves
    # Summing this gives total moves
    total_moves = 0
    for num in nums:
        total_moves += max_val - num

    return total_moves

# Alternative one-pass implementation
# Time: O(n) | Space: O(1)
def minMoves_optimized(nums):
    if not nums:
        return 0

    max_val = nums[0]
    total = 0

    # Single pass: track both max and sum
    for num in nums:
        if num > max_val:
            max_val = num
        total += num

    # Calculate result using formula: n * max_val - total
    return len(nums) * max_val - total
```

```javascript
// Optimal solution
// Time: O(n) - We make two passes through the array
// Space: O(1) - We only use a few variables
function minMoves(nums) {
  // Edge case: empty array requires 0 moves
  if (nums.length === 0) return 0;

  // Step 1: Find the maximum value in the array
  // We need this because we can only increase elements,
  // so all elements must reach at least this value
  let maxVal = nums[0];
  for (let num of nums) {
    if (num > maxVal) {
      maxVal = num;
    }
  }

  // Step 2: Calculate total moves needed
  // For each element, we need (maxVal - num) moves
  // Summing this gives total moves
  let totalMoves = 0;
  for (let num of nums) {
    totalMoves += maxVal - num;
  }

  return totalMoves;
}

// Alternative one-pass implementation
// Time: O(n) | Space: O(1)
function minMovesOptimized(nums) {
  if (nums.length === 0) return 0;

  let maxVal = nums[0];
  let total = 0;

  // Single pass: track both max and sum
  for (let num of nums) {
    if (num > maxVal) {
      maxVal = num;
    }
    total += num;
  }

  // Calculate result using formula: n * maxVal - total
  return nums.length * maxVal - total;
}
```

```java
// Optimal solution
// Time: O(n) - We make two passes through the array
// Space: O(1) - We only use a few variables
public int minMoves(int[] nums) {
    // Edge case: empty array requires 0 moves
    if (nums.length == 0) return 0;

    // Step 1: Find the maximum value in the array
    // We need this because we can only increase elements,
    // so all elements must reach at least this value
    int maxVal = nums[0];
    for (int num : nums) {
        if (num > maxVal) {
            maxVal = num;
        }
    }

    // Step 2: Calculate total moves needed
    // For each element, we need (maxVal - num) moves
    // Summing this gives total moves
    int totalMoves = 0;
    for (int num : nums) {
        totalMoves += maxVal - num;
    }

    return totalMoves;
}

// Alternative one-pass implementation
// Time: O(n) | Space: O(1)
public int minMovesOptimized(int[] nums) {
    if (nums.length == 0) return 0;

    int maxVal = nums[0];
    long total = 0; // Use long to avoid overflow for large arrays

    // Single pass: track both max and sum
    for (int num : nums) {
        if (num > maxVal) {
            maxVal = num;
        }
        total += num;
    }

    // Calculate result using formula: n * maxVal - total
    // Cast to int (problem constraints allow this)
    return (int)(nums.length * (long)maxVal - total);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to examine each element at least once to find the maximum value
- We also need to examine each element to compute the sum or calculate differences
- This gives us O(n) time, where n is the number of elements in the array
- The optimized version does this in a single pass, but it's still O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space regardless of input size
- We store variables for maximum value, sum/total moves, and loop counters
- No additional data structures are needed

## Common Mistakes

1. **Confusing with the "decrement" version of this problem**: There's a similar problem (Minimum Moves to Equal Array Elements) where you can increment OR decrement elements. In that problem, the optimal target is the median (or average). Candidates often mix up the two problems and try to find the average or median instead of recognizing that here we can only increase.

2. **Integer overflow**: When using the formula `n × max_val - sum(nums)`, both `n × max_val` and the sum can be large. In Java, using `int` might overflow. Always use `long` for intermediate calculations when dealing with potentially large numbers.

3. **Empty array edge case**: Forgetting to handle the case where `nums` is empty. While the problem might guarantee non-empty arrays, it's good practice to check.

4. **Unnecessary sorting**: Some candidates sort the array to find the maximum, which takes O(n log n) time. While this works, it's less efficient than the O(n) single-pass solution.

5. **Trying to optimize prematurely**: Some candidates try to find a "clever" one-liner without understanding why it works. It's better to explain the reasoning clearly: "We can only increase elements, so all elements must reach at least the current maximum. Therefore, we need to sum the differences from the maximum."

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification** for array transformation problems. Instead of simulating the process move by move, we derive a formula based on the constraints.

Related problems:

1. **Minimum Moves to Equal Array Elements** (LeetCode 453): The version where you can increment OR decrement elements. The solution involves finding the minimum element and summing differences from it.
2. **Minimum Moves to Equal Array Elements II** (LeetCode 462): Similar but with different operations. This one requires finding the median.
3. **Maximum Product of Three Numbers** (LeetCode 628): Another problem where mathematical insight (about sorting or tracking min/max values) leads to an optimal solution.

The core technique is recognizing when a problem that seems to require simulation can actually be solved with a simple mathematical formula derived from the operation constraints.

## Key Takeaways

1. **Read operation constraints carefully**: The fact that we can only increase (not decrease) elements is crucial. This immediately tells us the final value must be ≥ the current maximum.

2. **Look for mathematical shortcuts**: When operations have symmetric properties or constraints, there's often a formula that avoids simulating the process. Here, since every element needs to reach the maximum, we just sum the differences.

3. **Test with small examples**: When stuck, work through concrete examples step by step. This helps build intuition about why the maximum is the optimal target.

4. **Consider edge cases**: Always think about empty arrays, single-element arrays, arrays where all elements are already equal, and arrays with large values that might cause overflow.

[Practice this problem on CodeJeet](/problem/minimum-moves-to-equal-array-elements-iii)
