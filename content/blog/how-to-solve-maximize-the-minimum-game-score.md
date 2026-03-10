---
title: "How to Solve Maximize the Minimum Game Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize the Minimum Game Score. Hard difficulty, 26.0% acceptance rate. Topics: Array, Binary Search, Greedy."
date: "2026-09-15"
category: "dsa-patterns"
tags: ["maximize-the-minimum-game-score", "array", "binary-search", "greedy", "hard"]
---

# How to Solve "Maximize the Minimum Game Score"

This problem presents a challenging optimization scenario: you have an array of points and need to distribute `m` operations to maximize the minimum value in a separate game score array. The twist is that each operation can only affect scores in a contiguous segment starting from your current position. This creates a dependency between operations that makes brute force exploration impossible for large inputs. The key insight is recognizing that we can test candidate minimum values efficiently using binary search combined with a greedy validation approach.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose `points = [2, 5, 3, 1]` and `m = 3`. We start before the array (index -1) and can only move right, adding points to game scores as we go.

**Understanding the operation**: When we're at position `i` (starting from -1), we can choose any `j > i` and add `points[j]` to `gameScore[j]`. This means we can only affect scores to our right, and we can only add to each position once per operation.

**Goal**: We want to maximize the minimum value in `gameScore` after exactly `m` operations.

Let's try a candidate minimum value of `3`. Can we achieve a minimum score of at least 3 for all positions?

1. Start at index -1
2. Position 0 has points[0] = 2. To reach at least 3, we need to add at least 1 more point. But we can only add points[0] = 2 when we're at index -1. So we need to use one operation here, adding 2 to gameScore[0] → now 2.
3. We're now at index 0. Position 0 still needs 1 more point, but we can't go backward. So minimum 3 is impossible starting this way.

Let's try a different approach with candidate minimum 2:

1. Start at index -1
2. Position 0 needs at least 2. Use 1 operation at j=0: add 2 → gameScore[0] = 2
3. Now at index 0. Position 1 has points[1] = 5, already above 2, so skip.
4. Position 2 has points[2] = 3, already above 2, so skip.
5. Position 3 has points[3] = 1, needs at least 1 more. Use operation at j=3: add 1 → gameScore[3] = 1
6. Still at index 0 (we jumped to j=3). Position 3 now has 1, needs 1 more. Use another operation at j=3: add 1 → gameScore[3] = 2
7. We've used 3 operations total (m=3) and all game scores ≥ 2.

So minimum value 2 is achievable. We need to find the maximum such achievable minimum.

## Brute Force Approach

A naive approach would try to explore all possible sequences of `m` operations. At each step, we could choose any position to our right to add points to. The number of possible sequences grows exponentially with `m` and `n`, making this approach infeasible even for moderately sized inputs.

For example, with `n=10` and `m=10`, we have roughly `10^10` possibilities to explore. Even with pruning, the state space is too large.

What makes this problem tractable is the observation that if we can achieve a minimum value `x`, then we can also achieve any minimum value less than `x`. This monotonic property allows us to use binary search to find the maximum achievable minimum.

## Optimized Approach

The optimal solution combines binary search with greedy validation:

1. **Binary Search on Answer**: We search for the maximum achievable minimum score. If we can achieve minimum `mid`, we try higher values. If not, we try lower values.

2. **Greedy Validation**: For a candidate minimum `minScore`, we check if it's possible to achieve it with exactly `m` operations:
   - Traverse from left to right
   - For each position `i`, if the current accumulated score is less than `minScore`, we need to add enough operations at this position to reach `minScore`
   - Since we can only add `points[i]` per operation, we calculate how many operations needed: `ceil((minScore - currentScore) / points[i])`
   - Each operation at position `i` moves us to position `i`, so we can continue adding at the same position if needed
   - Keep track of total operations used

3. **Key Insight**: We must use exactly `m` operations, not just at most `m`. This affects our binary search condition.

The greedy validation works because:

- We process positions left to right
- Deficits must be filled at the current position (we can't go back)
- It's optimal to fill deficits as early as possible to avoid wasting operations

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * log(maxScore)) where maxScore is the maximum possible minimum value
# Space: O(1)
def maximizeMinimumScore(points, m):
    """
    Returns the maximum possible minimum value in gameScore after exactly m operations.

    Args:
        points: List of integers representing points available at each position
        m: Integer, number of operations allowed

    Returns:
        Integer, the maximum achievable minimum score
    """
    # Helper function to check if we can achieve at least 'minScore' as minimum
    def canAchieve(minScore):
        """
        Check if it's possible to have all positions with score >= minScore
        using exactly m operations.
        """
        operationsUsed = 0
        currentScore = 0

        for i in range(len(points)):
            # If current position already meets minScore, we can skip it
            # but we still need to account for operations if we're at this position
            if currentScore >= minScore:
                # We're at position i, so we need to use an operation here
                # but we can add 0 to current position (by choosing j = i)
                # This still counts as an operation
                operationsUsed += 1
                # Stay at current position i
                continue

            # Current position doesn't meet minScore, need to add operations
            # Calculate how many operations needed at this position
            deficit = minScore - currentScore
            # Each operation adds points[i] to gameScore[i]
            opsNeeded = (deficit + points[i] - 1) // points[i]  # Ceiling division

            operationsUsed += opsNeeded
            if operationsUsed > m:
                return False

            # After opsNeeded operations at position i, we're at position i
            # Update currentScore to what we achieved at this position
            currentScore += opsNeeded * points[i]

            # If we still have more operations than needed for minScore,
            # we can use remaining operations to boost currentScore
            # This might help subsequent positions

        # We must use exactly m operations
        # If we used less than m, we need to use remaining operations
        # We can always use extra operations by staying at the last position
        return operationsUsed <= m

    # Binary search for the maximum achievable minimum score
    # Lower bound: 0 (minimum possible score)
    # Upper bound: max(points) * m (if we use all operations on one position)
    left, right = 0, max(points) * m
    answer = 0

    while left <= right:
        mid = left + (right - left) // 2

        if canAchieve(mid):
            # mid is achievable, try for higher minimum
            answer = mid
            left = mid + 1
        else:
            # mid is not achievable, try lower minimum
            right = mid - 1

    return answer
```

```javascript
// Time: O(n * log(maxScore)) where maxScore is the maximum possible minimum value
// Space: O(1)
function maximizeMinimumScore(points, m) {
  /**
   * Returns the maximum possible minimum value in gameScore after exactly m operations.
   *
   * @param {number[]} points - Array of integers representing points available at each position
   * @param {number} m - Number of operations allowed
   * @return {number} The maximum achievable minimum score
   */

  // Helper function to check if we can achieve at least 'minScore' as minimum
  const canAchieve = (minScore) => {
    /**
     * Check if it's possible to have all positions with score >= minScore
     * using exactly m operations.
     */
    let operationsUsed = 0;
    let currentScore = 0;

    for (let i = 0; i < points.length; i++) {
      // If current position already meets minScore, we still need to use an operation
      if (currentScore >= minScore) {
        // Use an operation at current position (adding 0)
        operationsUsed++;
        continue;
      }

      // Current position doesn't meet minScore, need to add operations
      // Calculate how many operations needed at this position
      const deficit = minScore - currentScore;
      // Ceiling division: Math.ceil(deficit / points[i])
      const opsNeeded = Math.ceil(deficit / points[i]);

      operationsUsed += opsNeeded;
      if (operationsUsed > m) {
        return false;
      }

      // Update currentScore to what we achieved at this position
      currentScore += opsNeeded * points[i];
    }

    // We must use exactly m operations
    // If we used less than m, we can use remaining operations at the last position
    return operationsUsed <= m;
  };

  // Binary search for the maximum achievable minimum score
  // Lower bound: 0 (minimum possible score)
  // Upper bound: max(points) * m (if we use all operations on one position)
  let left = 0;
  let right = Math.max(...points) * m;
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (canAchieve(mid)) {
      // mid is achievable, try for higher minimum
      answer = mid;
      left = mid + 1;
    } else {
      // mid is not achievable, try lower minimum
      right = mid - 1;
    }
  }

  return answer;
}
```

```java
// Time: O(n * log(maxScore)) where maxScore is the maximum possible minimum value
// Space: O(1)
class Solution {
    /**
     * Returns the maximum possible minimum value in gameScore after exactly m operations.
     *
     * @param points Array of integers representing points available at each position
     * @param m Number of operations allowed
     * @return The maximum achievable minimum score
     */
    public int maximizeMinimumScore(int[] points, int m) {
        // Helper function to check if we can achieve at least 'minScore' as minimum
        // Using a private method for cleaner code
        return binarySearchMaxMin(points, m);
    }

    private int binarySearchMaxMin(int[] points, int m) {
        // Find maximum points value for upper bound calculation
        int maxPoints = 0;
        for (int point : points) {
            maxPoints = Math.max(maxPoints, point);
        }

        // Binary search bounds
        long left = 0;
        long right = (long) maxPoints * m; // Use long to avoid overflow
        long answer = 0;

        while (left <= right) {
            long mid = left + (right - left) / 2;

            if (canAchieve(points, m, mid)) {
                // mid is achievable, try for higher minimum
                answer = mid;
                left = mid + 1;
            } else {
                // mid is not achievable, try lower minimum
                right = mid - 1;
            }
        }

        return (int) answer;
    }

    private boolean canAchieve(int[] points, int m, long minScore) {
        /**
         * Check if it's possible to have all positions with score >= minScore
         * using exactly m operations.
         */
        long operationsUsed = 0;
        long currentScore = 0;

        for (int i = 0; i < points.length; i++) {
            // If current position already meets minScore, we still need to use an operation
            if (currentScore >= minScore) {
                // Use an operation at current position (adding 0)
                operationsUsed++;
                continue;
            }

            // Current position doesn't meet minScore, need to add operations
            // Calculate how many operations needed at this position
            long deficit = minScore - currentScore;
            // Ceiling division: (deficit + points[i] - 1) / points[i]
            long opsNeeded = (deficit + points[i] - 1) / points[i];

            operationsUsed += opsNeeded;
            if (operationsUsed > m) {
                return false;
            }

            // Update currentScore to what we achieved at this position
            currentScore += opsNeeded * points[i];
        }

        // We must use exactly m operations
        // If we used less than m, we can use remaining operations at the last position
        return operationsUsed <= m;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log(maxScore))

- `n` is the length of the points array
- `maxScore` is the maximum possible minimum value, which is `max(points) * m`
- Binary search runs O(log(maxScore)) iterations
- Each iteration calls `canAchieve()` which runs in O(n) time
- Total: O(n log(maxScore))

**Space Complexity**: O(1)

- We only use a constant amount of extra space for variables
- The algorithms are in-place and don't use additional data structures

## Common Mistakes

1. **Not handling the "exactly m operations" requirement**: Some solutions check if we can achieve a minimum with at most m operations, but the problem requires exactly m operations. The difference is subtle but crucial - we can always waste extra operations by staying at the last position.

2. **Incorrect ceiling division**: When calculating how many operations are needed to reach the minimum score, we need ceiling division: `ceil(deficit / points[i])`. A common mistake is using integer division which floors the result.

3. **Overflow in upper bound calculation**: The upper bound for binary search is `max(points) * m`, which can be large (up to 10^5 \* 10^9 = 10^14). Using 32-bit integers can cause overflow. Always use 64-bit integers (long in Java/C++, long long in C).

4. **Forgetting that each position visit requires an operation**: Even if a position already meets the minimum score, we still need to "visit" it using an operation. This is because we start before the array and each move/operation consumes one of the m operations.

## When You'll See This Pattern

This "binary search on answer + greedy validation" pattern appears in many optimization problems where:

- You need to maximize/minimize a value subject to constraints
- There's a monotonic relationship (if value X is achievable, then all values < X are also achievable)
- Direct computation is difficult, but validation is easier

Related LeetCode problems:

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Similar pattern of binary searching for minimum capacity with greedy validation of days.
2. **Split Array Largest Sum (LeetCode 410)**: Binary search for minimum largest sum with greedy validation of splits.
3. **Koko Eating Bananas (LeetCode 875)**: Binary search for minimum eating speed with validation of time constraint.

## Key Takeaways

1. **When you need to maximize/minimize a value and direct computation is hard, consider binary search on the answer**. The key requirement is monotonicity - if X is achievable, then values on one side of X are also achievable.

2. **The validation function is often simpler than the optimization problem**. Break the problem into: 1) Can we achieve value X? 2) Use binary search to find the maximum/minimum X.

3. **Pay attention to exact vs. "at most" constraints**. The difference between "exactly m" and "at most m" operations changes how you handle leftover operations in the validation function.

[Practice this problem on CodeJeet](/problem/maximize-the-minimum-game-score)
