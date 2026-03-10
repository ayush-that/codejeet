---
title: "How to Solve Minimum Average of Smallest and Largest Elements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Average of Smallest and Largest Elements. Easy difficulty, 85.3% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2027-05-01"
category: "dsa-patterns"
tags:
  ["minimum-average-of-smallest-and-largest-elements", "array", "two-pointers", "sorting", "easy"]
---

# How to Solve Minimum Average of Smallest and Largest Elements

You're given an array of integers with an even length, and you need to repeatedly pair the smallest remaining element with the largest remaining element, calculate their average, and track the minimum average across all pairs. The challenge is that after each pairing, those elements are removed from consideration, so you can't just sort once and take fixed pairs—you need to pair extremes that shrink toward the middle.

What makes this problem interesting is that while sorting seems obvious, the optimal pairing strategy isn't immediately clear. Should you pair adjacent elements after sorting? Or should you pair extremes? A quick example shows that pairing the smallest with largest gives you averages that are "pulled" toward the middle values, and the minimum average will come from one of these extreme pairs.

## Visual Walkthrough

Let's trace through the example `nums = [4, 2, 1, 3]`:

1. **Initial array**: `[4, 2, 1, 3]`
2. **Sort it**: `[1, 2, 3, 4]` (makes finding min/max easy)
3. **First pairing**:
   - Smallest = 1 (left end)
   - Largest = 4 (right end)
   - Average = (1 + 4) / 2 = 2.5
   - Remove these, remaining: `[2, 3]`
4. **Second pairing**:
   - Smallest = 2 (new left end)
   - Largest = 3 (new right end)
   - Average = (2 + 3) / 2 = 2.5
5. **Track minimum**: Both averages are 2.5, so minimum = 2.5

But wait—what if we paired differently? Let's try pairing adjacent elements after sorting: (1,2) and (3,4). Averages would be 1.5 and 3.5, with minimum 1.5. That's actually smaller! So which is correct?

The problem specifically states: "Remove the **smallest** element and the **largest** element" each time. You don't get to choose—you must take the current global min and max. So the adjacent pairing approach violates the problem constraints. Our first walkthrough was correct.

Let's try another example: `nums = [7, 8, 3, 4, 15, 6]`

1. Sort: `[3, 4, 6, 7, 8, 15]`
2. Pair 1: (3, 15) → average = 9.0
3. Pair 2: (4, 8) → average = 6.0
4. Pair 3: (6, 7) → average = 6.5
5. Minimum average = min(9.0, 6.0, 6.5) = 6.0

Notice how the averages generally decrease then increase? The minimum tends to come from pairs near the middle of the sorted array, but we have to compute all pairs to be sure.

## Brute Force Approach

A truly brute force approach would be to simulate the exact process described:

1. Repeatedly scan the array to find current min and max
2. Calculate their average
3. Remove both elements (which requires shifting or marking)
4. Repeat until array is empty

This is inefficient because:

- Finding min/max in an unsorted array takes O(n) each time
- Removing elements from an array takes O(n) due to shifting
- With n/2 iterations, this becomes O(n²) time

Even if we sort first, we need to consider all possible pairing strategies that follow the "remove current min and max" rule. But here's the key insight: **after sorting, repeatedly pairing the smallest remaining with largest remaining is equivalent to pairing the i-th smallest with the (n-1-i)-th smallest for i = 0 to n/2-1**.

So the brute force would be to sort, then compute all these pair averages and track the minimum. That's actually optimal! The "brute force" misconception here is that candidates might think they need to simulate removal and resorting, but sorting once is sufficient.

## Optimal Solution

The optimal solution has three simple steps:

1. Sort the array in ascending order
2. Use two pointers (or a single index) to pair the smallest with largest, moving inward
3. Track the minimum average across all pairs

Why does this work? After sorting, the smallest remaining element is always at the left end, and the largest is always at the right end. When we remove these two, the next smallest and largest are immediately adjacent to the removed positions. So we can just move our pointers inward.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def minimumAverage(nums):
    """
    Calculate the minimum average from pairing smallest and largest elements.

    Args:
        nums: List[int] - Array of integers with even length

    Returns:
        float - Minimum average across all pairs
    """
    # Step 1: Sort the array to easily access smallest and largest elements
    nums.sort()

    # Initialize minimum average to a large value
    min_avg = float('inf')

    # Step 2: Pair the i-th smallest with i-th largest
    # We only need to iterate through first half of array
    n = len(nums)
    for i in range(n // 2):
        # Current pair: nums[i] (smallest remaining) and nums[n-1-i] (largest remaining)
        current_avg = (nums[i] + nums[n - 1 - i]) / 2.0

        # Step 3: Update minimum average if current is smaller
        if current_avg < min_avg:
            min_avg = current_avg

    return min_avg
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function minimumAverage(nums) {
  /**
   * Calculate the minimum average from pairing smallest and largest elements.
   *
   * @param {number[]} nums - Array of integers with even length
   * @return {number} - Minimum average across all pairs
   */

  // Step 1: Sort the array to easily access smallest and largest elements
  nums.sort((a, b) => a - b); // Numeric sort, not lexicographic!

  // Initialize minimum average to a large value
  let minAvg = Infinity;

  // Step 2: Pair the i-th smallest with i-th largest
  const n = nums.length;
  for (let i = 0; i < n / 2; i++) {
    // Current pair: nums[i] (smallest remaining) and nums[n-1-i] (largest remaining)
    const currentAvg = (nums[i] + nums[n - 1 - i]) / 2;

    // Step 3: Update minimum average if current is smaller
    if (currentAvg < minAvg) {
      minAvg = currentAvg;
    }
  }

  return minAvg;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public double minimumAverage(int[] nums) {
    /**
     * Calculate the minimum average from pairing smallest and largest elements.
     *
     * @param nums - Array of integers with even length
     * @return - Minimum average across all pairs
     */

    // Step 1: Sort the array to easily access smallest and largest elements
    Arrays.sort(nums);

    // Initialize minimum average to a large value
    double minAvg = Double.MAX_VALUE;

    // Step 2: Pair the i-th smallest with i-th largest
    int n = nums.length;
    for (int i = 0; i < n / 2; i++) {
        // Current pair: nums[i] (smallest remaining) and nums[n-1-i] (largest remaining)
        double currentAvg = (nums[i] + nums[n - 1 - i]) / 2.0;

        // Step 3: Update minimum average if current is smaller
        if (currentAvg < minAvg) {
            minAvg = currentAvg;
        }
    }

    return minAvg;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting the array, which takes O(n log n) time with comparison-based sorts
- The subsequent loop runs n/2 times, which is O(n), but this is dominated by the sort
- Even with radix sort or other linear sorts for integers, we typically state O(n log n) as the general case

**Space Complexity: O(1) or O(n)**

- If the sort is in-place (like quicksort), space is O(1) for the algorithm itself (plus O(log n) recursion stack)
- If the sort requires extra space (like mergesort), it's O(n)
- Our variables use O(1) additional space regardless

## Common Mistakes

1. **Forgetting to sort numerically in JavaScript**: Using `nums.sort()` without a comparator function in JavaScript does lexicographic (string) sorting, so `[10, 2, 5]` becomes `[10, 2, 5]` (since "10" < "2" lexicographically). Always use `nums.sort((a, b) => a - b)`.

2. **Using integer division**: In languages like Java and Python 2, `(a + b) / 2` performs integer division if both operands are integers. This gives incorrect results like 2 instead of 2.5 for (3+2)/2. Always use floating point division: `/ 2.0` in Java, `/ 2.0` or `float()` in Python.

3. **Incorrect pairing strategy**: Some candidates try to pair adjacent elements after sorting (i.e., `(nums[0], nums[1])`, `(nums[2], nums[3])`), but this violates the problem's requirement to always pair current min with current max. The correct pairing is extremes moving inward.

4. **Not handling floating point precision**: While not critical for this problem, in some variations you might need to be careful with floating point comparisons. Use a small epsilon when comparing floats if precision matters.

## When You'll See This Pattern

This "pair extremes from sorted array" pattern appears in several problems:

1. **Number of Distinct Averages (LeetCode 2465)**: Almost identical to this problem, but instead of finding the minimum average, you count distinct averages. Same sorting and pairing approach.

2. **Array Partition I (LeetCode 561)**: "Given an array of 2n integers, group them into n pairs such that the sum of min(a_i, b_i) for all i is maximized." The optimal strategy is to sort and pair adjacent elements (not extremes), but the sorting insight is similar.

3. **Boats to Save People (LeetCode 881)**: "Each boat carries at most 2 people with weight limit. Minimize number of boats." The optimal approach is to sort weights and pair the heaviest with lightest if possible, otherwise heaviest alone—same two-pointer extremes pairing.

The core pattern is: **When you need to pair elements optimally, sorting often helps, and two pointers from both ends is common when pairing lightest with heaviest.**

## Key Takeaways

1. **Sorting transforms ordering problems into positioning problems**: Once sorted, finding "smallest remaining" and "largest remaining" becomes trivial—they're just at the ends of your current window.

2. **Two pointers moving inward efficiently simulates removal**: Instead of actually removing elements (which is expensive), use indices to represent the "remaining" portion of the sorted array.

3. **Read constraints carefully**: The requirement to pair current min with current max (not just any elements) dictates the pairing strategy. If the problem allowed any pairing, adjacent pairing after sorting might give different results.

Related problems: [Number of Distinct Averages](/problem/number-of-distinct-averages)
