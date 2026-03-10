---
title: "How to Solve Minimum Moves to Equal Array Elements II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Equal Array Elements II. Medium difficulty, 61.5% acceptance rate. Topics: Array, Math, Sorting."
date: "2028-07-22"
category: "dsa-patterns"
tags: ["minimum-moves-to-equal-array-elements-ii", "array", "math", "sorting", "medium"]
---

# How to Solve Minimum Moves to Equal Array Elements II

This problem asks us to find the minimum total number of moves needed to make all elements in an array equal, where each move can increment or decrement a single element by 1. What makes this problem interesting is that the optimal target value isn't obvious—it's not the average (like in the similar "Minimum Moves to Equal Array Elements" problem), and brute force checking every possible target is too slow. The key insight is recognizing that the median minimizes the sum of absolute deviations.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 9, 10]`.

If we try different target values:

- **Target = 1**: Moves = (1-1) + (2-1) + (9-1) + (10-1) = 0 + 1 + 8 + 9 = 18
- **Target = 2**: Moves = (2-1) + (2-2) + (9-2) + (10-2) = 1 + 0 + 7 + 8 = 16
- **Target = 5**: Moves = (5-1) + (5-2) + (9-5) + (10-5) = 4 + 3 + 4 + 5 = 16
- **Target = 6**: Moves = (6-1) + (6-2) + (9-6) + (10-6) = 5 + 4 + 3 + 4 = 16
- **Target = 9**: Moves = (9-1) + (9-2) + (9-9) + (10-9) = 8 + 7 + 0 + 1 = 16
- **Target = 10**: Moves = (10-1) + (10-2) + (10-9) + (10-10) = 9 + 8 + 1 + 0 = 18

Notice something interesting: targets between 2 and 9 (inclusive) all give 16 moves. The minimum is 16, and any value between the two middle elements (2 and 9) works. For an even-length array, any target between the two middle values gives the same minimum moves.

Now let's try an odd-length example: `nums = [1, 10, 2, 9, 3]` (sorted: `[1, 2, 3, 9, 10]`)

- **Target = 3** (the median): Moves = (3-1) + (3-2) + (3-3) + (9-3) + (10-3) = 2 + 1 + 0 + 6 + 7 = 16
- **Target = 4**: Moves = (4-1) + (4-2) + (4-3) + (9-4) + (10-4) = 3 + 2 + 1 + 5 + 6 = 17
- **Target = 2**: Moves = (2-1) + (2-2) + (3-2) + (9-2) + (10-2) = 1 + 0 + 1 + 7 + 8 = 17

For odd-length arrays, only the median gives the minimum moves.

This pattern reveals the key insight: **the median minimizes the sum of absolute differences**.

## Brute Force Approach

A naive approach would be to try every possible integer between the minimum and maximum values in the array as a target, calculate the total moves for each target, and return the minimum.

<div class="code-group">

```python
# Time: O(n * range) where range = max(nums) - min(nums) | Space: O(1)
def minMoves2_brute(nums):
    if not nums:
        return 0

    min_val, max_val = min(nums), max(nums)
    min_moves = float('inf')

    # Try every possible target value
    for target in range(min_val, max_val + 1):
        total_moves = 0
        for num in nums:
            total_moves += abs(num - target)

        min_moves = min(min_moves, total_moves)

    return min_moves
```

```javascript
// Time: O(n * range) where range = max(nums) - min(nums) | Space: O(1)
function minMoves2Brute(nums) {
  if (nums.length === 0) return 0;

  const minVal = Math.min(...nums);
  const maxVal = Math.max(...nums);
  let minMoves = Infinity;

  // Try every possible target value
  for (let target = minVal; target <= maxVal; target++) {
    let totalMoves = 0;
    for (let num of nums) {
      totalMoves += Math.abs(num - target);
    }

    minMoves = Math.min(minMoves, totalMoves);
  }

  return minMoves;
}
```

```java
// Time: O(n * range) where range = max(nums) - min(nums) | Space: O(1)
public int minMoves2Brute(int[] nums) {
    if (nums.length == 0) return 0;

    int minVal = Integer.MAX_VALUE;
    int maxVal = Integer.MIN_VALUE;

    // Find min and max values
    for (int num : nums) {
        minVal = Math.min(minVal, num);
        maxVal = Math.max(maxVal, num);
    }

    int minMoves = Integer.MAX_VALUE;

    // Try every possible target value
    for (int target = minVal; target <= maxVal; target++) {
        int totalMoves = 0;
        for (int num : nums) {
            totalMoves += Math.abs(num - target);
        }

        minMoves = Math.min(minMoves, totalMoves);
    }

    return minMoves;
}
```

</div>

**Why this is insufficient:** The time complexity is O(n × range), where range = max(nums) - min(nums). In the worst case (e.g., `nums = [1, 1000000]`), this becomes O(n × 10⁶), which is far too slow for typical constraints. We need a solution that doesn't depend on the range of values.

## Optimized Approach

The key mathematical insight is that the **median** minimizes the sum of absolute deviations. Here's why:

1. **For odd-length arrays**: The median is the middle element when sorted. If we move the target away from the median, we increase distances to more elements than we decrease distances to.

2. **For even-length arrays**: Any value between the two middle elements (inclusive) gives the same minimum sum. This is because moving within this range changes distances in a balanced way.

3. **Proof intuition**: Consider two points on a number line. The sum of distances to both is minimized at any point between them. Extend this reasoning to n points, and you'll find the median is optimal.

The algorithm becomes:

1. Sort the array to find the median
2. Calculate the sum of absolute differences between each element and the median

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) due to sorting | Space: O(1) or O(n) depending on sort implementation
def minMoves2(nums):
    """
    Find minimum moves to make all array elements equal.
    Each move increments or decrements an element by 1.

    Approach: Sort and use median as target value.
    The median minimizes the sum of absolute differences.
    """
    # Step 1: Sort the array to easily find the median
    nums.sort()

    # Step 2: Find the median
    # For odd length: middle element
    # For even length: either middle element works (we'll use left middle)
    n = len(nums)
    median = nums[n // 2]

    # Step 3: Calculate total moves needed
    # Sum of absolute differences between each element and median
    total_moves = 0
    for num in nums:
        total_moves += abs(num - median)

    return total_moves
```

```javascript
// Time: O(n log n) due to sorting | Space: O(1) or O(n) depending on sort implementation
function minMoves2(nums) {
  /**
   * Find minimum moves to make all array elements equal.
   * Each move increments or decrements an element by 1.
   *
   * Approach: Sort and use median as target value.
   * The median minimizes the sum of absolute differences.
   */

  // Step 1: Sort the array to easily find the median
  nums.sort((a, b) => a - b); // Numeric sort is crucial!

  // Step 2: Find the median
  // For odd length: middle element
  // For even length: either middle element works (we'll use left middle)
  const n = nums.length;
  const median = nums[Math.floor(n / 2)];

  // Step 3: Calculate total moves needed
  // Sum of absolute differences between each element and median
  let totalMoves = 0;
  for (let num of nums) {
    totalMoves += Math.abs(num - median);
  }

  return totalMoves;
}
```

```java
// Time: O(n log n) due to sorting | Space: O(1) or O(n) depending on sort implementation
public int minMoves2(int[] nums) {
    /**
     * Find minimum moves to make all array elements equal.
     * Each move increments or decrements an element by 1.
     *
     * Approach: Sort and use median as target value.
     * The median minimizes the sum of absolute differences.
     */

    // Step 1: Sort the array to easily find the median
    Arrays.sort(nums);

    // Step 2: Find the median
    // For odd length: middle element
    // For even length: either middle element works (we'll use left middle)
    int n = nums.length;
    int median = nums[n / 2];

    // Step 3: Calculate total moves needed
    // Sum of absolute differences between each element and median
    int totalMoves = 0;
    for (int num : nums) {
        totalMoves += Math.abs(num - median);
    }

    return totalMoves;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time using comparison-based sorts
- Finding the median is O(1) after sorting
- Calculating the sum of absolute differences is O(n)
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(1) or O(n)**

- If using an in-place sort (like quicksort): O(1) additional space
- If using a sort that requires extra space (like mergesort): O(n)
- The rest of the algorithm uses O(1) additional space

**Alternative O(n) approach**: We could use the QuickSelect algorithm to find the median in O(n) average time, but with O(n²) worst case. In practice, sorting is simpler and sufficient for interviews.

## Common Mistakes

1. **Using the mean instead of the median**: This is the most common mistake. Candidates familiar with the similar "Minimum Moves to Equal Array Elements" problem (which uses mean) might incorrectly apply the same logic here. Remember: for absolute differences, use median; for relative differences (increments only), use mean.

2. **Forgetting to sort in JavaScript**: `array.sort()` in JavaScript sorts lexicographically by default. Without `(a, b) => a - b`, `[1, 10, 2]` becomes `[1, 10, 2]` instead of `[1, 2, 10]`.

3. **Integer overflow**: While the problem states the answer fits in a 32-bit integer, intermediate calculations might overflow. Use 64-bit integers if available, or be mindful of this constraint.

4. **Handling even-length arrays incorrectly**: For arrays with even length, any value between the two middle elements gives the same minimum. Some candidates overcomplicate by averaging the two middle values, but simply using `nums[n//2]` works fine.

## When You'll See This Pattern

This "median minimizes absolute differences" pattern appears in several optimization problems:

1. **Best Meeting Point (LeetCode 296)**: Given a 2D grid of houses, find the meeting point that minimizes total travel distance (Manhattan distance). Solution: Find median of x-coordinates and median of y-coordinates separately.

2. **Minimum Operations to Make a Uni-Value Grid (LeetCode 2033)**: Similar 2D generalization where you need to make all grid cells equal with minimum operations.

3. **Sliding Window Median (LeetCode 480)**: Maintaining median efficiently for sliding windows uses similar median properties.

The pattern also appears in statistics (median absolute deviation), facility location problems (minimizing travel distance to a central point), and data compression.

## Key Takeaways

1. **Median minimizes absolute differences**: When you need to minimize the sum of absolute deviations from a target value, the median is always optimal. This is a fundamental statistical property worth memorizing.

2. **Distinguish between mean and median problems**:
   - Use **mean** when operations are unidirectional (only increments, like "Minimum Moves to Equal Array Elements")
   - Use **median** when operations are bidirectional (increments and decrements, like this problem)

3. **Sorting often reveals structure**: Many array optimization problems become tractable after sorting. When stuck, ask: "What if the array were sorted?"

Related problems: [Best Meeting Point](/problem/best-meeting-point), [Minimum Moves to Equal Array Elements](/problem/minimum-moves-to-equal-array-elements), [Minimum Operations to Make a Uni-Value Grid](/problem/minimum-operations-to-make-a-uni-value-grid)
