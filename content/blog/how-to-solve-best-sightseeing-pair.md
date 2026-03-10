---
title: "How to Solve Best Sightseeing Pair — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Best Sightseeing Pair. Medium difficulty, 62.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-08-02"
category: "dsa-patterns"
tags: ["best-sightseeing-pair", "array", "dynamic-programming", "medium"]
---

# How to Solve Best Sightseeing Pair

This problem asks us to find the maximum score of a sightseeing pair where the score is calculated as `values[i] + values[j] + i - j` for `i < j`. What makes this problem interesting is that we need to consider both the values at each index AND their positions, but we can't simply check all pairs because that would be too slow for large arrays. The challenge is finding a way to track the best possible "left" element as we iterate through the array.

## Visual Walkthrough

Let's trace through a concrete example: `values = [8, 1, 5, 2, 6]`

We want to find the maximum value of `values[i] + values[j] + i - j` where `i < j`.

Let's think about this step by step. When we're at index `j`, we need to find the best `i` from all previous indices. The score formula can be rearranged as:

```
score = (values[i] + i) + (values[j] - j)
```

This is the key insight! For a given `j`, `values[j] - j` is fixed. So to maximize the score for this `j`, we need to maximize `values[i] + i` among all `i < j`.

Let's walk through our example:

**Initialization:**

- `max_score = 0` (minimum possible score since all values are positive)
- `best_left = values[0] + 0 = 8 + 0 = 8` (best `values[i] + i` so far)

**j = 1:**

- Current left candidate: `values[0] + 0 = 8`
- Current score: `best_left + (values[1] - 1) = 8 + (1 - 1) = 8`
- `max_score = max(0, 8) = 8`
- Update `best_left = max(8, values[1] + 1) = max(8, 1 + 1) = 8`

**j = 2:**

- Current left candidate: `best_left = 8`
- Current score: `8 + (values[2] - 2) = 8 + (5 - 2) = 11`
- `max_score = max(8, 11) = 11`
- Update `best_left = max(8, values[2] + 2) = max(8, 5 + 2) = 8`

**j = 3:**

- Current left candidate: `best_left = 8`
- Current score: `8 + (values[3] - 3) = 8 + (2 - 3) = 7`
- `max_score = max(11, 7) = 11`
- Update `best_left = max(8, values[3] + 3) = max(8, 2 + 3) = 8`

**j = 4:**

- Current left candidate: `best_left = 8`
- Current score: `8 + (values[4] - 4) = 8 + (6 - 4) = 10`
- `max_score = max(11, 10) = 11`
- Update `best_left = max(8, values[4] + 4) = max(8, 6 + 4) = 10`

The maximum score is 11, which comes from the pair (i=0, j=2): `8 + 5 + 0 - 2 = 11`.

## Brute Force Approach

The most straightforward solution is to check every possible pair (i, j) where i < j:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxScoreSightseeingPair(values):
    n = len(values)
    max_score = 0

    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            score = values[i] + values[j] + i - j
            max_score = max(max_score, score)

    return max_score
```

```javascript
// Time: O(n²) | Space: O(1)
function maxScoreSightseeingPair(values) {
  let maxScore = 0;
  const n = values.length;

  // Check every possible pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const score = values[i] + values[j] + i - j;
      maxScore = Math.max(maxScore, score);
    }
  }

  return maxScore;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxScoreSightseeingPair(int[] values) {
    int maxScore = 0;
    int n = values.length;

    // Check every possible pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int score = values[i] + values[j] + i - j;
            maxScore = Math.max(maxScore, score);
        }
    }

    return maxScore;
}
```

</div>

This approach is simple but inefficient. For an array of size n, we check n(n-1)/2 pairs, resulting in O(n²) time complexity. This is too slow for large inputs (n up to 5×10⁴ would require ~1.25 billion operations).

## Optimized Approach

The key insight is that we can rewrite the score formula:

```
score(i, j) = values[i] + values[j] + i - j
            = (values[i] + i) + (values[j] - j)
```

For a fixed `j`, the term `(values[j] - j)` is constant. So to maximize the score for this `j`, we need to maximize `(values[i] + i)` among all `i < j`.

This leads to a one-pass solution:

1. Initialize `best_left = values[0] + 0` (the best `values[i] + i` we've seen so far)
2. Initialize `max_score = 0`
3. For each `j` from 1 to n-1:
   - Calculate current score: `best_left + (values[j] - j)`
   - Update `max_score` if this score is better
   - Update `best_left = max(best_left, values[j] + j)` for future iterations

This works because as we move through the array, we always have access to the best possible left partner for the current right element.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxScoreSightseeingPair(values):
    """
    Find the maximum score of a sightseeing pair.
    Score formula: values[i] + values[j] + i - j for i < j

    Key insight: score = (values[i] + i) + (values[j] - j)
    For each j, we need the maximum (values[i] + i) for i < j
    """
    n = len(values)

    # Edge case: array must have at least 2 elements
    if n < 2:
        return 0

    # Initialize with the first element as the best left candidate
    # best_left tracks the maximum (values[i] + i) seen so far
    best_left = values[0] + 0

    # Initialize max_score
    max_score = 0

    # Iterate through the array starting from index 1
    for j in range(1, n):
        # Calculate score using the best left candidate found so far
        current_score = best_left + (values[j] - j)

        # Update maximum score if current score is better
        max_score = max(max_score, current_score)

        # Update best_left for future iterations
        # We compare current best_left with (values[j] + j)
        # because j will be a potential i for future j's
        best_left = max(best_left, values[j] + j)

    return max_score
```

```javascript
// Time: O(n) | Space: O(1)
function maxScoreSightseeingPair(values) {
  /**
   * Find the maximum score of a sightseeing pair.
   * Score formula: values[i] + values[j] + i - j for i < j
   *
   * Key insight: score = (values[i] + i) + (values[j] - j)
   * For each j, we need the maximum (values[i] + i) for i < j
   */
  const n = values.length;

  // Edge case: array must have at least 2 elements
  if (n < 2) {
    return 0;
  }

  // Initialize with the first element as the best left candidate
  // bestLeft tracks the maximum (values[i] + i) seen so far
  let bestLeft = values[0] + 0;

  // Initialize maxScore
  let maxScore = 0;

  // Iterate through the array starting from index 1
  for (let j = 1; j < n; j++) {
    // Calculate score using the best left candidate found so far
    const currentScore = bestLeft + (values[j] - j);

    // Update maximum score if current score is better
    maxScore = Math.max(maxScore, currentScore);

    // Update bestLeft for future iterations
    // We compare current bestLeft with (values[j] + j)
    // because j will be a potential i for future j's
    bestLeft = Math.max(bestLeft, values[j] + j);
  }

  return maxScore;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxScoreSightseeingPair(int[] values) {
    /**
     * Find the maximum score of a sightseeing pair.
     * Score formula: values[i] + values[j] + i - j for i < j
     *
     * Key insight: score = (values[i] + i) + (values[j] - j)
     * For each j, we need the maximum (values[i] + i) for i < j
     */
    int n = values.length;

    // Edge case: array must have at least 2 elements
    if (n < 2) {
        return 0;
    }

    // Initialize with the first element as the best left candidate
    // bestLeft tracks the maximum (values[i] + i) seen so far
    int bestLeft = values[0] + 0;

    // Initialize maxScore
    int maxScore = 0;

    // Iterate through the array starting from index 1
    for (int j = 1; j < n; j++) {
        // Calculate score using the best left candidate found so far
        int currentScore = bestLeft + (values[j] - j);

        // Update maximum score if current score is better
        maxScore = Math.max(maxScore, currentScore);

        // Update bestLeft for future iterations
        // We compare current bestLeft with (values[j] + j)
        // because j will be a potential i for future j's
        bestLeft = Math.max(bestLeft, values[j] + j);
    }

    return maxScore;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations at each step.
- This is optimal since we need to examine each element at least once.

**Space Complexity: O(1)**

- We only use a few variables (`best_left`, `max_score`, loop counter) regardless of input size.
- No additional data structures are needed.

## Common Mistakes

1. **Starting the loop at index 0 instead of 1**: Since we need `i < j`, when `j = 0`, there are no valid `i` values. Starting at `j = 1` ensures we always have at least one potential left partner.

2. **Forgetting to update `best_left` after calculating the score**: The update must happen after calculating the score for the current `j`. If we update before, we might incorrectly use the current element as its own left partner.

3. **Incorrect initialization of `best_left`**: It should be `values[0] + 0`, not just `values[0]`. The `+ i` part is crucial for the formula.

4. **Not handling small arrays**: For arrays with fewer than 2 elements, there are no valid pairs. The code should return 0 in this case.

## When You'll See This Pattern

This problem uses a **"keep track of best seen so far"** pattern, which appears in many optimization problems:

1. **Best Time to Buy and Sell Stock (LeetCode 121)**: Similar idea of tracking the minimum price seen so far as you iterate through prices.

2. **Maximum Subarray (LeetCode 53)**: Uses Kadane's algorithm which keeps track of the best subarray ending at each position.

3. **Maximum Product Subarray (LeetCode 152)**: Similar to maximum subarray but needs to track both minimum and maximum due to negative numbers.

The common theme is that instead of checking all pairs or subarrays (which would be O(n²)), we maintain some state as we iterate that lets us compute the answer in O(n) time.

## Key Takeaways

1. **Look for ways to separate variables**: When you see a formula like `values[i] + values[j] + i - j`, try to rearrange it to separate the `i` and `j` terms. This often reveals that one part depends only on the current element while the other depends on previous elements.

2. **Maintain the best candidate seen so far**: Many array optimization problems can be solved by keeping track of the best candidate for some criterion as you iterate through the array.

3. **Think about what information you need at each step**: For each position `j`, ask yourself: "What do I need to know about all previous positions to compute the answer involving `j`?" If the answer is "just one value" (like the maximum `values[i] + i`), you can probably solve it in O(n) time.

[Practice this problem on CodeJeet](/problem/best-sightseeing-pair)
