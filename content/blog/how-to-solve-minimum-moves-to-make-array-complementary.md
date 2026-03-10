---
title: "How to Solve Minimum Moves to Make Array Complementary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Make Array Complementary. Medium difficulty, 43.3% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2026-03-24"
category: "dsa-patterns"
tags: ["minimum-moves-to-make-array-complementary", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Minimum Moves to Make Array Complementary

You're given an even-length array `nums` and a `limit`. You can change any element to any value between 1 and `limit`. Your goal is to make the array "complementary" — meaning each pair `nums[i] + nums[n-1-i]` equals the same target sum — using the minimum number of moves.

What makes this problem tricky is that you need to find the optimal target sum that minimizes moves across all pairs simultaneously. A naive approach would try every possible target sum (from 2 to 2×limit) and calculate moves for each, but that's O(n×limit) — too slow. The clever solution uses difference arrays to track how many moves each target sum requires in O(1) per pair.

## Visual Walkthrough

Let's trace through `nums = [1,2,4,3]`, `limit = 4`. We have two pairs: (1,3) and (2,4).

For each pair (a,b), we want to know: for each possible target sum T, how many moves do we need?

**Pair (1,3):**

- Current sum = 4
- If T = 4: sum already matches → 0 moves
- If T = 3 or 5: we can change one number → 1 move  
  Example: T=3, change 1→2 (1→2) or 3→2 (3→2)
- If T = 2 or 6: need to change both numbers → 2 moves
- If T < 2 or T > 6: impossible (can't reach with limit=4)

**Pair (2,4):**

- Current sum = 6
- If T = 6: 0 moves
- If T = 5 or 7: 1 move
- If T = 4 or 8: 2 moves
- If T < 4 or T > 8: impossible

Now combine both pairs. For each T, add moves from both pairs:

- T=4: 0 (from pair1) + 2 (from pair2) = 2 moves
- T=5: 1 + 1 = 2 moves
- T=6: 2 + 0 = 2 moves

Minimum is 2 moves at T=4,5, or 6.

The key insight: instead of checking every T for every pair, we can track ranges of T values that need the same number of moves using a difference array.

## Brute Force Approach

The brute force solution tries every possible target sum T from 2 to 2×limit. For each T, it calculates moves needed for each pair and sums them up. Finally, it returns the minimum total moves.

<div class="code-group">

```python
# Time: O(n × limit) | Space: O(1)
def minMoves(nums, limit):
    n = len(nums)
    min_moves = float('inf')

    # Try every possible target sum
    for target in range(2, 2 * limit + 1):
        total_moves = 0

        # Check each pair
        for i in range(n // 2):
            a, b = nums[i], nums[n - 1 - i]
            current_sum = a + b

            if current_sum == target:
                # Already matches target
                moves = 0
            elif (max(a, b) + limit >= target and
                  min(a, b) + 1 <= target):
                # Can change one number to reach target
                moves = 1
            else:
                # Need to change both numbers
                moves = 2

            total_moves += moves

        min_moves = min(min_moves, total_moves)

    return min_moves
```

```javascript
// Time: O(n × limit) | Space: O(1)
function minMoves(nums, limit) {
  const n = nums.length;
  let minMoves = Infinity;

  // Try every possible target sum
  for (let target = 2; target <= 2 * limit; target++) {
    let totalMoves = 0;

    // Check each pair
    for (let i = 0; i < n / 2; i++) {
      const a = nums[i];
      const b = nums[n - 1 - i];
      const currentSum = a + b;

      if (currentSum === target) {
        // Already matches target
        totalMoves += 0;
      } else if (Math.max(a, b) + limit >= target && Math.min(a, b) + 1 <= target) {
        // Can change one number to reach target
        totalMoves += 1;
      } else {
        // Need to change both numbers
        totalMoves += 2;
      }
    }

    minMoves = Math.min(minMoves, totalMoves);
  }

  return minMoves;
}
```

```java
// Time: O(n × limit) | Space: O(1)
public int minMoves(int[] nums, int limit) {
    int n = nums.length;
    int minMoves = Integer.MAX_VALUE;

    // Try every possible target sum
    for (int target = 2; target <= 2 * limit; target++) {
        int totalMoves = 0;

        // Check each pair
        for (int i = 0; i < n / 2; i++) {
            int a = nums[i];
            int b = nums[n - 1 - i];
            int currentSum = a + b;

            if (currentSum == target) {
                // Already matches target
                totalMoves += 0;
            } else if (Math.max(a, b) + limit >= target &&
                      Math.min(a, b) + 1 <= target) {
                // Can change one number to reach target
                totalMoves += 1;
            } else {
                // Need to change both numbers
                totalMoves += 2;
            }
        }

        minMoves = Math.min(minMoves, totalMoves);
    }

    return minMoves;
}
```

</div>

**Why it's too slow:** With `n` up to 10⁵ and `limit` up to 10⁵, trying every target (2×limit possibilities) for every pair (n/2 pairs) gives O(n×limit) operations — up to 10¹⁰, which is far too slow.

## Optimized Approach

The key insight is that for each pair (a,b), we can categorize target sums T into ranges:

1. **0 moves needed:** Only when T = a + b (exact match)
2. **1 move needed:** When T is in [min(a,b)+1, max(a,b)+limit], excluding a+b
3. **2 moves needed:** All other reachable T values

We can use a **difference array** (or prefix sum array) to efficiently track how many moves each target sum requires. For each pair:

- Add 2 to all T (default cost)
- Subtract 1 from the 1-move range (T in [min+1, max+limit])
- Subtract another 1 at T = a+b (0 moves instead of 1)

After processing all pairs, we compute prefix sums to get actual move counts for each T and find the minimum.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + limit) | Space: O(limit)
def minMoves(nums, limit):
    n = len(nums)

    # diff[0..2*limit+2] - we use 2*limit+2 size for safety
    diff = [0] * (2 * limit + 3)

    for i in range(n // 2):
        a, b = nums[i], nums[n - 1 - i]

        # Start with assumption: need 2 moves for all targets
        # We'll subtract from ranges where fewer moves are needed

        # Range for 1 move: [min(a,b)+1, max(a,b)+limit]
        left = min(a, b) + 1
        right = max(a, b) + limit

        # Subtract 1 from this range (instead of 2 moves)
        diff[left] -= 1
        diff[right + 1] += 1

        # For exact sum a+b, subtract another 1 (0 moves instead of 1)
        exact_sum = a + b
        diff[exact_sum] -= 1
        diff[exact_sum + 1] += 1

    # Initial value: 2 moves per pair for all targets
    current = 2 * (n // 2)
    min_moves = float('inf')

    # Compute prefix sum to get actual move counts
    for target in range(2, 2 * limit + 1):
        current += diff[target]
        min_moves = min(min_moves, current)

    return min_moves
```

```javascript
// Time: O(n + limit) | Space: O(limit)
function minMoves(nums, limit) {
  const n = nums.length;

  // diff[0..2*limit+2] - we use 2*limit+2 size for safety
  const diff = new Array(2 * limit + 3).fill(0);

  for (let i = 0; i < n / 2; i++) {
    const a = nums[i];
    const b = nums[n - 1 - i];

    // Start with assumption: need 2 moves for all targets
    // We'll subtract from ranges where fewer moves are needed

    // Range for 1 move: [min(a,b)+1, max(a,b)+limit]
    const left = Math.min(a, b) + 1;
    const right = Math.max(a, b) + limit;

    // Subtract 1 from this range (instead of 2 moves)
    diff[left] -= 1;
    diff[right + 1] += 1;

    // For exact sum a+b, subtract another 1 (0 moves instead of 1)
    const exactSum = a + b;
    diff[exactSum] -= 1;
    diff[exactSum + 1] += 1;
  }

  // Initial value: 2 moves per pair for all targets
  let current = 2 * (n / 2);
  let minMoves = Infinity;

  // Compute prefix sum to get actual move counts
  for (let target = 2; target <= 2 * limit; target++) {
    current += diff[target];
    minMoves = Math.min(minMoves, current);
  }

  return minMoves;
}
```

```java
// Time: O(n + limit) | Space: O(limit)
public int minMoves(int[] nums, int limit) {
    int n = nums.length;

    // diff[0..2*limit+2] - we use 2*limit+2 size for safety
    int[] diff = new int[2 * limit + 3];

    for (int i = 0; i < n / 2; i++) {
        int a = nums[i];
        int b = nums[n - 1 - i];

        // Start with assumption: need 2 moves for all targets
        // We'll subtract from ranges where fewer moves are needed

        // Range for 1 move: [min(a,b)+1, max(a,b)+limit]
        int left = Math.min(a, b) + 1;
        int right = Math.max(a, b) + limit;

        // Subtract 1 from this range (instead of 2 moves)
        diff[left] -= 1;
        diff[right + 1] += 1;

        // For exact sum a+b, subtract another 1 (0 moves instead of 1)
        int exactSum = a + b;
        diff[exactSum] -= 1;
        diff[exactSum + 1] += 1;
    }

    // Initial value: 2 moves per pair for all targets
    int current = 2 * (n / 2);
    int minMoves = Integer.MAX_VALUE;

    // Compute prefix sum to get actual move counts
    for (int target = 2; target <= 2 * limit; target++) {
        current += diff[target];
        minMoves = Math.min(minMoves, current);
    }

    return minMoves;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + limit)**

- We process each of the n/2 pairs once: O(n)
- For each pair, we do O(1) updates to the difference array
- Finally, we iterate through 2×limit target sums: O(limit)
- Total: O(n + limit)

**Space Complexity: O(limit)**

- We maintain a difference array of size 2×limit+3
- No other data structures scale with input size

## Common Mistakes

1. **Forgetting to handle the exact sum case separately:** The range [min+1, max+limit] includes a+b, but a+b needs 0 moves, not 1. You need to subtract an extra 1 at T = a+b.

2. **Off-by-one errors with array indices:** The difference array needs to be size 2×limit+3, not 2×limit+1, because we access index right+1 where right can be 2×limit.

3. **Incorrect range boundaries for 1-move case:** The range should be [min(a,b)+1, max(a,b)+limit], not [2, 2×limit]. If min(a,b)=1, you can't reach T=2 with 1 move (would need to change both).

4. **Starting prefix sum from wrong initial value:** The initial value should be 2×(n/2) because we assume 2 moves per pair for all targets, then subtract based on the difference array.

## When You'll See This Pattern

The difference array/prefix sum technique appears in problems where you need to apply range updates efficiently:

1. **Zero Array Transformation II (Medium)** - Similar range update problem using difference arrays
2. **Zero Array Transformation III (Medium)** - Another variation with range operations
3. **Corporate Flight Bookings (Medium)** - Track seat bookings with range updates
4. **Range Addition (Medium)** - Direct application of difference arrays

The pattern: when you need to apply "add value to all elements in range [l, r]" many times, difference arrays let you do each update in O(1) instead of O(r-l+1).

## Key Takeaways

1. **Difference arrays transform O(range) updates into O(1):** Instead of iterating through a range to update values, mark the start (+value) and end+1 (-value), then compute prefix sums.

2. **Think in terms of contribution ranges:** For each element/pair, determine which final values/answers it contributes to and how much.

3. **When brute force checks all X for all Y:** If you're checking all possible answers (X) against all inputs (Y), consider whether each input's contribution to answers follows a pattern (constant, linear, piecewise).

Related problems: [Zero Array Transformation II](/problem/zero-array-transformation-ii), [Zero Array Transformation III](/problem/zero-array-transformation-iii)
