---
title: "How to Solve Maximum Points You Can Obtain from Cards — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Points You Can Obtain from Cards. Medium difficulty, 57.3% acceptance rate. Topics: Array, Sliding Window, Prefix Sum."
date: "2027-05-10"
category: "dsa-patterns"
tags:
  ["maximum-points-you-can-obtain-from-cards", "array", "sliding-window", "prefix-sum", "medium"]
---

# How to Solve Maximum Points You Can Obtain from Cards

You can take exactly `k` cards from either end of an array, and your goal is to maximize the sum of points from those cards. The challenge is that you can't simply take the largest individual cards—you must consider that taking from one end might block access to cards on the other end. This creates a trade-off that requires careful optimization.

## Visual Walkthrough

Let's walk through an example: `cardPoints = [1, 2, 3, 4, 5, 6, 1]`, `k = 3`.

We need to take 3 cards total. All possible combinations of taking from left and right:

1. **Take 3 from left**: `[1, 2, 3]` → sum = 6
2. **Take 2 from left, 1 from right**: `[1, 2, 1]` → sum = 4
3. **Take 1 from left, 2 from right**: `[1, 6, 1]` → sum = 8
4. **Take 3 from right**: `[6, 1, 1]` → sum = 8

The maximum is 8. Notice something interesting: when we take cards, the cards we **don't** take form a contiguous subarray in the middle. For example:

- Taking 3 from left means we don't take `[4, 5, 6, 1]` (4 cards)
- Taking 2 left, 1 right means we don't take `[3, 4, 5, 6]` (4 cards)
- Taking 1 left, 2 right means we don't take `[2, 3, 4, 5]` (4 cards)
- Taking 3 from right means we don't take `[1, 2, 3, 4]` (4 cards)

The cards we don't take always form a contiguous subarray of length `n - k`. This is the key insight!

## Brute Force Approach

A naive approach would be to try all possible combinations of taking cards from left and right. For each possible number of cards taken from the left (from 0 to k), we could:

1. Take `leftCount` cards from the beginning
2. Take `k - leftCount` cards from the end
3. Calculate the sum
4. Track the maximum

This requires calculating sums repeatedly, leading to O(k²) time complexity if we recalculate sums naively, or O(k) if we use prefix sums. However, even O(k) is not optimal when we realize the problem can be solved in O(n) time.

The brute force would look like this (with prefix sums to avoid O(k²)):

<div class="code-group">

```python
# Time: O(k) | Space: O(1)
def maxScoreBruteForce(cardPoints, k):
    n = len(cardPoints)
    max_score = 0

    # Try all possible splits: i cards from left, k-i from right
    for i in range(k + 1):
        left_sum = sum(cardPoints[:i]) if i > 0 else 0
        right_sum = sum(cardPoints[n-(k-i):]) if k-i > 0 else 0
        max_score = max(max_score, left_sum + right_sum)

    return max_score
```

```javascript
// Time: O(k) | Space: O(1)
function maxScoreBruteForce(cardPoints, k) {
  const n = cardPoints.length;
  let maxScore = 0;

  // Try all possible splits: i cards from left, k-i from right
  for (let i = 0; i <= k; i++) {
    let leftSum = 0;
    for (let j = 0; j < i; j++) {
      leftSum += cardPoints[j];
    }

    let rightSum = 0;
    for (let j = n - (k - i); j < n; j++) {
      rightSum += cardPoints[j];
    }

    maxScore = Math.max(maxScore, leftSum + rightSum);
  }

  return maxScore;
}
```

```java
// Time: O(k²) in worst case | Space: O(1)
public int maxScoreBruteForce(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int maxScore = 0;

    // Try all possible splits: i cards from left, k-i from right
    for (int i = 0; i <= k; i++) {
        int leftSum = 0;
        for (int j = 0; j < i; j++) {
            leftSum += cardPoints[j];
        }

        int rightSum = 0;
        for (int j = n - (k - i); j < n; j++) {
            rightSum += cardPoints[j];
        }

        maxScore = Math.max(maxScore, leftSum + rightSum);
    }

    return maxScore;
}
```

</div>

This approach is O(k²) in the worst case (when k ≈ n/2) because we're repeatedly summing subarrays. We can optimize it to O(k) using prefix sums, but there's an even better O(n) approach.

## Optimized Approach

The key insight is that instead of focusing on which cards we **take**, we can focus on which cards we **don't take**. Since we must take exactly `k` cards, we leave `n - k` cards in a contiguous subarray in the middle.

Therefore:

- Total sum of all cards is constant
- Maximizing the sum of cards we take = Minimizing the sum of cards we leave
- The cards we leave form a contiguous subarray of length `n - k`

This transforms the problem into: **Find the minimum sum of any contiguous subarray of length `n - k`**.

We can solve this efficiently using a sliding window:

1. Calculate the total sum of all cards
2. Calculate the sum of the first `n - k` cards (initial window)
3. Slide the window from left to right, updating the window sum
4. Track the minimum window sum
5. The answer is `total_sum - min_window_sum`

## Optimal Solution

Here's the complete solution using the sliding window approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxScore(cardPoints, k):
    """
    Calculate maximum score by taking k cards from either end.

    Approach: Instead of maximizing taken cards, minimize the
    n-k cards left in the middle (contiguous subarray).
    """
    n = len(cardPoints)

    # If we can take all cards, return total sum
    if k >= n:
        return sum(cardPoints)

    # Total sum of all cards
    total_sum = sum(cardPoints)

    # Length of subarray we're NOT taking (cards left in middle)
    window_size = n - k

    # Calculate sum of first window (first 'window_size' cards)
    current_window_sum = sum(cardPoints[:window_size])
    min_window_sum = current_window_sum

    # Slide the window from left to right
    for i in range(window_size, n):
        # Remove leftmost element of previous window
        # Add new element to the right
        current_window_sum = current_window_sum - cardPoints[i - window_size] + cardPoints[i]

        # Update minimum window sum
        min_window_sum = min(min_window_sum, current_window_sum)

    # Maximum score = total sum - minimum sum of cards we leave
    return total_sum - min_window_sum
```

```javascript
// Time: O(n) | Space: O(1)
function maxScore(cardPoints, k) {
  /**
   * Calculate maximum score by taking k cards from either end.
   *
   * Approach: Instead of maximizing taken cards, minimize the
   * n-k cards left in the middle (contiguous subarray).
   */
  const n = cardPoints.length;

  // If we can take all cards, return total sum
  if (k >= n) {
    return cardPoints.reduce((sum, val) => sum + val, 0);
  }

  // Total sum of all cards
  let totalSum = 0;
  for (let i = 0; i < n; i++) {
    totalSum += cardPoints[i];
  }

  // Length of subarray we're NOT taking (cards left in middle)
  const windowSize = n - k;

  // Calculate sum of first window (first 'windowSize' cards)
  let currentWindowSum = 0;
  for (let i = 0; i < windowSize; i++) {
    currentWindowSum += cardPoints[i];
  }
  let minWindowSum = currentWindowSum;

  // Slide the window from left to right
  for (let i = windowSize; i < n; i++) {
    // Remove leftmost element of previous window
    // Add new element to the right
    currentWindowSum = currentWindowSum - cardPoints[i - windowSize] + cardPoints[i];

    // Update minimum window sum
    minWindowSum = Math.min(minWindowSum, currentWindowSum);
  }

  // Maximum score = total sum - minimum sum of cards we leave
  return totalSum - minWindowSum;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxScore(int[] cardPoints, int k) {
    /**
     * Calculate maximum score by taking k cards from either end.
     *
     * Approach: Instead of maximizing taken cards, minimize the
     * n-k cards left in the middle (contiguous subarray).
     */
    int n = cardPoints.length;

    // If we can take all cards, return total sum
    if (k >= n) {
        int total = 0;
        for (int point : cardPoints) {
            total += point;
        }
        return total;
    }

    // Total sum of all cards
    int totalSum = 0;
    for (int i = 0; i < n; i++) {
        totalSum += cardPoints[i];
    }

    // Length of subarray we're NOT taking (cards left in middle)
    int windowSize = n - k;

    // Calculate sum of first window (first 'windowSize' cards)
    int currentWindowSum = 0;
    for (int i = 0; i < windowSize; i++) {
        currentWindowSum += cardPoints[i];
    }
    int minWindowSum = currentWindowSum;

    // Slide the window from left to right
    for (int i = windowSize; i < n; i++) {
        // Remove leftmost element of previous window
        // Add new element to the right
        currentWindowSum = currentWindowSum - cardPoints[i - windowSize] + cardPoints[i];

        // Update minimum window sum
        minWindowSum = Math.min(minWindowSum, currentWindowSum);
    }

    // Maximum score = total sum - minimum sum of cards we leave
    return totalSum - minWindowSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass to calculate the total sum: O(n)
- We make another pass with the sliding window: O(n)
- Total: O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures that scale with input

## Common Mistakes

1. **Not handling k ≥ n case**: When k is greater than or equal to the array length, we can take all cards. Some solutions crash or give incorrect results if this edge case isn't handled.

2. **Off-by-one errors in window sliding**: When updating `current_window_sum`, it's easy to mess up the indices. Remember: `i - window_size` gives the element leaving the window, and `i` gives the new element entering.

3. **Using the wrong window size**: The window should be of size `n - k` (cards we leave), not `k` (cards we take). This is the most common conceptual mistake.

4. **Initializing min_window_sum incorrectly**: It should be initialized to the sum of the first window, not 0 or a large number. If all numbers are positive, initializing to 0 would give wrong results.

## When You'll See This Pattern

The "minimize what you leave behind" transformation is powerful for problems where you make choices from the ends:

1. **Maximum Score from Performing Multiplication Operations (LeetCode 1770)**: Similar concept where you choose from either end, though more complex due to the multiplication operation.

2. **Removing Minimum and Maximum From Array (LeetCode 2091)**: You need to remove min and max elements by deleting from ends, requiring similar end-point reasoning.

3. **Minimum Recolors to Get K Consecutive Black Blocks (LeetCode 2379)**: Uses sliding window to find minimum operations in a contiguous subarray.

4. **Fruit Into Baskets (LeetCode 904)**: Classic sliding window problem with constraints on window contents.

## Key Takeaways

1. **Transform maximization to minimization**: When you need to maximize something by choosing from ends, consider what gets left behind. Maximizing chosen elements = minimizing unchosen elements when total is fixed.

2. **Sliding window for contiguous subarrays**: When you need to find the best contiguous subarray of fixed length, sliding window gives O(n) solution instead of O(n²).

3. **Fixed choices from ends often leave contiguous middle**: When you must take exactly k elements from the ends, the remaining n-k elements always form a contiguous block in the middle.

**Related problems:** [Maximum Score from Performing Multiplication Operations](/problem/maximum-score-from-performing-multiplication-operations), [Removing Minimum and Maximum From Array](/problem/removing-minimum-and-maximum-from-array), [Minimum Recolors to Get K Consecutive Black Blocks](/problem/minimum-recolors-to-get-k-consecutive-black-blocks)
