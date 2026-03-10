---
title: "How to Solve Minimize the Difference Between Target and Chosen Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize the Difference Between Target and Chosen Elements. Medium difficulty, 36.7% acceptance rate. Topics: Array, Dynamic Programming, Matrix."
date: "2028-12-15"
category: "dsa-patterns"
tags:
  [
    "minimize-the-difference-between-target-and-chosen-elements",
    "array",
    "dynamic-programming",
    "matrix",
    "medium",
  ]
---

# How to Solve Minimize the Difference Between Target and Chosen Elements

You're given an `m x n` matrix where you must pick exactly one element from each row, aiming to make the sum of your chosen elements as close as possible to a given target. The challenge is that you need to consider all possible combinations across rows, which grows exponentially with the number of rows. This problem is interesting because it looks like a simple selection problem but requires dynamic programming to avoid exponential time complexity.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

```
mat = [[1,2,3],
       [4,5,6],
       [7,8,9]]
target = 13
```

We need to pick one number from each row. Let's think about possible sums:

- From row 0: we can pick 1, 2, or 3
- From row 1: we can pick 4, 5, or 6
- From row 2: we can pick 7, 8, or 9

The brute force approach would check all 3 × 3 × 3 = 27 combinations. But we can be smarter. Let's build sums progressively:

**Step 1:** After row 0, possible sums are {1, 2, 3}

**Step 2:** After row 1, we combine with row 0 sums:

- From sum 1: {1+4=5, 1+5=6, 1+6=7}
- From sum 2: {2+4=6, 2+5=7, 2+6=8}
- From sum 3: {3+4=7, 3+5=8, 3+6=9}

Unique sums after row 1: {5, 6, 7, 8, 9}

**Step 3:** After row 2, we combine with row 1 sums:

- From sum 5: {5+7=12, 5+8=13, 5+9=14}
- From sum 6: {6+7=13, 6+8=14, 6+9=15}
- From sum 7: {7+7=14, 7+8=15, 7+9=16}
- From sum 8: {8+7=15, 8+8=16, 8+9=17}
- From sum 9: {9+7=16, 9+8=17, 9+9=18}

All possible final sums: {12, 13, 14, 15, 16, 17, 18}

The target is 13, and we have exactly 13 in our possible sums! So the minimum absolute difference is 0.

Notice that at each step, we only need to track unique sums. This is the key insight that leads to our dynamic programming solution.

## Brute Force Approach

The most straightforward solution is to generate all possible combinations by picking one element from each row, calculate each sum, and find the one with minimum absolute difference from the target.

For an `m x n` matrix, there are `n^m` possible combinations. Even for modest inputs (like 10 rows with 10 elements each), that's 10 billion combinations - clearly infeasible.

Here's what the brute force code would look like:

<div class="code-group">

```python
# Time: O(n^m) | Space: O(m) for recursion depth
def brute_force(mat, target):
    m, n = len(mat), len(mat[0])
    min_diff = float('inf')

    def backtrack(row, current_sum):
        nonlocal min_diff

        if row == m:
            # Reached the last row, check the difference
            min_diff = min(min_diff, abs(current_sum - target))
            return

        # Try each element in the current row
        for col in range(n):
            backtrack(row + 1, current_sum + mat[row][col])

    backtrack(0, 0)
    return min_diff
```

```javascript
// Time: O(n^m) | Space: O(m) for recursion depth
function bruteForce(mat, target) {
  const m = mat.length,
    n = mat[0].length;
  let minDiff = Infinity;

  function backtrack(row, currentSum) {
    if (row === m) {
      // Reached the last row, check the difference
      minDiff = Math.min(minDiff, Math.abs(currentSum - target));
      return;
    }

    // Try each element in the current row
    for (let col = 0; col < n; col++) {
      backtrack(row + 1, currentSum + mat[row][col]);
    }
  }

  backtrack(0, 0);
  return minDiff;
}
```

```java
// Time: O(n^m) | Space: O(m) for recursion depth
public int bruteForce(int[][] mat, int target) {
    int m = mat.length, n = mat[0].length;
    int[] minDiff = {Integer.MAX_VALUE};

    backtrack(mat, target, 0, 0, minDiff);
    return minDiff[0];
}

private void backtrack(int[][] mat, int target, int row, int currentSum, int[] minDiff) {
    if (row == mat.length) {
        // Reached the last row, check the difference
        minDiff[0] = Math.min(minDiff[0], Math.abs(currentSum - target));
        return;
    }

    // Try each element in the current row
    for (int col = 0; col < mat[0].length; col++) {
        backtrack(mat, target, row + 1, currentSum + mat[row][col], minDiff);
    }
}
```

</div>

The brute force approach is exponential and will time out for even moderately sized inputs. We need a more efficient approach.

## Optimized Approach

The key insight is that we don't need to track every possible combination - we only need to track unique sums at each step. However, the number of unique sums could still be large. We need two optimizations:

1. **Dynamic Programming with Sets**: At each row, we maintain a set of all possible sums we can achieve up to that row. This eliminates duplicate sums.

2. **Pruning**: If the number of possible sums grows too large, we can prune sums that are far from the target. Specifically, we only need to keep sums within a reasonable range around the target, since sums that are too high or too low won't help us get close to the target.

The pruning strategy works like this:

- At each step, we find the minimum and maximum possible sums we could achieve
- We only need to consider sums that could potentially help us reach the target
- For sums that are too high (greater than target + current_min_difference) or too low, we can discard them

This approach transforms an exponential problem into one that's polynomial in the number of rows and the range of possible sums.

## Optimal Solution

Here's the complete optimal solution using dynamic programming with pruning:

<div class="code-group">

```python
# Time: O(m * n * min(target, max_sum)) | Space: O(min(target, max_sum))
def minimizeTheDifference(mat, target):
    """
    Minimize the absolute difference between target and sum of chosen elements.
    We pick exactly one element from each row.
    """
    m, n = len(mat), len(mat[0])

    # Start with only 0 as a possible sum (before picking from any row)
    possible_sums = {0}

    # Process each row
    for row in range(m):
        # Get unique elements from current row to avoid duplicates
        row_elements = sorted(set(mat[row]))

        # New set for sums after including current row
        new_sums = set()
        current_max = max(possible_sums)

        # For each existing sum, try adding each element from current row
        for current_sum in possible_sums:
            for element in row_elements:
                new_sum = current_sum + element

                # Pruning: if new_sum is already greater than target + current_best,
                # and we're not at the last row, we might skip it
                # But we need to be careful - we can't skip entirely because
                # we need to consider all possibilities for future rows
                new_sums.add(new_sum)

        # Advanced pruning: if we have too many sums, keep only the ones
        # closest to target. This is crucial for performance.
        if len(new_sums) > target:
            # Keep only sums up to target (plus a buffer for future rows)
            # We sort and take the smallest ones since larger ones are less useful
            possible_sums = set(sorted(new_sums)[:target+1])
        else:
            possible_sums = new_sums

    # Find the sum with minimum absolute difference from target
    min_diff = float('inf')
    for s in possible_sums:
        min_diff = min(min_diff, abs(s - target))

    return min_diff
```

```javascript
// Time: O(m * n * min(target, max_sum)) | Space: O(min(target, max_sum))
function minimizeTheDifference(mat, target) {
  /**
   * Minimize the absolute difference between target and sum of chosen elements.
   * We pick exactly one element from each row.
   */
  const m = mat.length,
    n = mat[0].length;

  // Start with only 0 as a possible sum (before picking from any row)
  let possibleSums = new Set([0]);

  // Process each row
  for (let row = 0; row < m; row++) {
    // Get unique elements from current row to avoid duplicates
    const rowElements = [...new Set(mat[row])].sort((a, b) => a - b);

    // New set for sums after including current row
    const newSums = new Set();

    // For each existing sum, try adding each element from current row
    for (const currentSum of possibleSums) {
      for (const element of rowElements) {
        const newSum = currentSum + element;
        newSums.add(newSum);
      }
    }

    // Advanced pruning: if we have too many sums, keep only the ones
    // closest to target. This is crucial for performance.
    if (newSums.size > target) {
      // Convert to array, sort, and keep only smallest sums
      const sortedSums = Array.from(newSums).sort((a, b) => a - b);
      // Keep sums up to target (plus a buffer)
      possibleSums = new Set(sortedSums.slice(0, target + 1));
    } else {
      possibleSums = newSums;
    }
  }

  // Find the sum with minimum absolute difference from target
  let minDiff = Infinity;
  for (const s of possibleSums) {
    minDiff = Math.min(minDiff, Math.abs(s - target));
  }

  return minDiff;
}
```

```java
// Time: O(m * n * min(target, max_sum)) | Space: O(min(target, max_sum))
public int minimizeTheDifference(int[][] mat, int target) {
    /**
     * Minimize the absolute difference between target and sum of chosen elements.
     * We pick exactly one element from each row.
     */
    int m = mat.length, n = mat[0].length;

    // Start with only 0 as a possible sum (before picking from any row)
    Set<Integer> possibleSums = new HashSet<>();
    possibleSums.add(0);

    // Process each row
    for (int row = 0; row < m; row++) {
        // Get unique elements from current row to avoid duplicates
        Set<Integer> rowElementsSet = new HashSet<>();
        for (int num : mat[row]) {
            rowElementsSet.add(num);
        }
        List<Integer> rowElements = new ArrayList<>(rowElementsSet);
        Collections.sort(rowElements);

        // New set for sums after including current row
        Set<Integer> newSums = new HashSet<>();

        // For each existing sum, try adding each element from current row
        for (int currentSum : possibleSums) {
            for (int element : rowElements) {
                newSums.add(currentSum + element);
            }
        }

        // Advanced pruning: if we have too many sums, keep only the ones
        // closest to target. This is crucial for performance.
        if (newSums.size() > target) {
            // Convert to list, sort, and keep only smallest sums
            List<Integer> sortedSums = new ArrayList<>(newSums);
            Collections.sort(sortedSums);
            // Keep sums up to target (plus a buffer)
            possibleSums = new HashSet<>();
            for (int i = 0; i <= target && i < sortedSums.size(); i++) {
                possibleSums.add(sortedSums.get(i));
            }
        } else {
            possibleSums = newSums;
        }
    }

    // Find the sum with minimum absolute difference from target
    int minDiff = Integer.MAX_VALUE;
    for (int s : possibleSums) {
        minDiff = Math.min(minDiff, Math.abs(s - target));
    }

    return minDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × min(target, max_sum))

- `m` is the number of rows
- `n` is the number of columns (elements per row)
- `min(target, max_sum)` represents the maximum number of unique sums we keep at each step due to pruning
- In the worst case without pruning, it would be O(m × n × max_sum) where max_sum is the maximum possible sum
- The pruning keeps this manageable by limiting the number of sums to roughly `target`

**Space Complexity:** O(min(target, max_sum))

- We store at most `target + 1` sums at any time due to pruning
- Without pruning, it could be O(max_sum) where max_sum is the maximum possible sum

The key to the efficiency is the pruning step. By only keeping sums up to `target` (plus a small buffer), we ensure the number of sums we track doesn't explode exponentially.

## Common Mistakes

1. **Not pruning enough sums**: Candidates often implement the DP with sets but forget to prune. This causes memory issues when sums grow too large. Always check if your set size exceeds a reasonable limit (like `target`) and prune by keeping only the smallest sums.

2. **Incorrect pruning logic**: Some candidates prune sums that are greater than `target`, but this is wrong because even if a sum exceeds `target`, adding negative numbers (if they existed) in future rows could bring it back down. That's why we keep sums up to `target` rather than discarding all sums above `target`.

3. **Forgetting to deduplicate row elements**: If a row has duplicate values, processing them multiple times wastes time. Always get unique elements from each row first.

4. **Not sorting row elements**: When pruning, we want to process smaller elements first because they're more likely to produce sums that stay within our pruning threshold. Sorting row elements helps with efficient pruning.

## When You'll See This Pattern

This problem uses a **bounded knapsack DP with pruning** pattern, which appears in several other LeetCode problems:

1. **Partition Equal Subset Sum (LeetCode 416)**: Similar DP approach where you track possible sums, but here you're trying to reach exactly half the total sum.

2. **Closest Subsequence Sum (LeetCode 1755)**: Also involves finding a sum closest to a target, but uses meet-in-the-middle technique for larger input sizes.

3. **Maximum Number of Points with Cost (LeetCode 1937)**: Uses similar row-by-row DP with optimization to avoid considering all previous states.

The core pattern is: when you need to combine elements from multiple groups (rows) to reach a target sum or minimize difference from a target, and the brute force would be exponential, consider DP with sets to track possible sums and prune aggressively.

## Key Takeaways

1. **DP with sets is powerful for sum problems**: When you need to track all possible sums from combining elements, using sets to eliminate duplicates is more efficient than arrays when sums can be sparse.

2. **Pruning is essential for performance**: Always monitor the size of your state space. If it grows beyond a reasonable limit (often related to the target value), prune by keeping only the most promising states.

3. **Row-by-row processing for matrix problems**: When you need to pick one element from each row, process rows sequentially, combining current possibilities with elements from the next row.

Related problems: [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Closest Subsequence Sum](/problem/closest-subsequence-sum), [Maximum Number of Points with Cost](/problem/maximum-number-of-points-with-cost)
