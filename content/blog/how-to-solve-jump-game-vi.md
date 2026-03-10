---
title: "How to Solve Jump Game VI — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Jump Game VI. Medium difficulty, 46.4% acceptance rate. Topics: Array, Dynamic Programming, Queue, Heap (Priority Queue), Monotonic Queue."
date: "2027-01-06"
category: "dsa-patterns"
tags: ["jump-game-vi", "array", "dynamic-programming", "queue", "medium"]
---

# How to Solve Jump Game VI

You're given an array `nums` and an integer `k`. Starting at index 0, you can jump up to `k` steps forward on each move. Your goal is to reach the last index while maximizing the sum of the numbers you land on. This problem is tricky because it looks like a simple dynamic programming problem at first, but the naive DP solution is too slow (O(nk)). The key insight is recognizing that we need to efficiently find the maximum value in a sliding window of previous DP results.

## Visual Walkthrough

Let's trace through a small example: `nums = [1,-1,-2,4,-7,3]`, `k = 2`

We want to reach index 5 with maximum score. Let's think step by step:

1. **Start at index 0**: Score = 1 (we must start here)
2. **From index 0**, we can jump to indices 1 or 2:
   - To reach index 1: Score = 1 + (-1) = 0
   - To reach index 2: Score = 1 + (-2) = -1
3. **From index 1** (score 0), we can jump to indices 2 or 3:
   - To reach index 2: max(0 + (-2), -1) = -1 (we already had -1 from index 0)
   - To reach index 3: 0 + 4 = 4
4. **From index 2** (score -1), we can jump to indices 3 or 4:
   - To reach index 3: max(-1 + 4, 4) = 4 (4 from index 1 is better)
   - To reach index 4: -1 + (-7) = -8
5. **From index 3** (score 4), we can jump to indices 4 or 5:
   - To reach index 4: max(4 + (-7), -8) = -3
   - To reach index 5: 4 + 3 = 7
6. **From index 4** (score -3), we can jump to index 5:
   - To reach index 5: max(-3 + 3, 7) = 7 (7 from index 3 is better)

The maximum score to reach index 5 is 7, achieved by jumping: 0 → 1 → 3 → 5

Notice the pattern: to compute the score for position `i`, we need the maximum score from the previous `k` positions (i-k to i-1). This is where the optimization challenge comes in.

## Brute Force Approach

The straightforward dynamic programming solution would be:

1. Create a DP array where `dp[i]` = maximum score to reach index `i`
2. Initialize `dp[0] = nums[0]`
3. For each position `i` from 1 to n-1:
   - Look at all positions `j` from `max(0, i-k)` to `i-1`
   - `dp[i] = nums[i] + max(dp[j])` for all valid `j`
4. Return `dp[n-1]`

The problem? This takes O(nk) time. If `k` is close to `n`, this becomes O(n²), which is too slow for the constraints (n up to 10⁵).

<div class="code-group">

```python
# Time: O(nk) | Space: O(n) - TOO SLOW for large inputs
def maxResult(nums, k):
    n = len(nums)
    dp = [float('-inf')] * n
    dp[0] = nums[0]

    for i in range(1, n):
        # Check all positions we could have jumped from
        for j in range(max(0, i - k), i):
            dp[i] = max(dp[i], dp[j] + nums[i])

    return dp[n-1]
```

```javascript
// Time: O(nk) | Space: O(n) - TOO SLOW for large inputs
function maxResult(nums, k) {
  const n = nums.length;
  const dp = new Array(n).fill(-Infinity);
  dp[0] = nums[0];

  for (let i = 1; i < n; i++) {
    // Check all positions we could have jumped from
    for (let j = Math.max(0, i - k); j < i; j++) {
      dp[i] = Math.max(dp[i], dp[j] + nums[i]);
    }
  }

  return dp[n - 1];
}
```

```java
// Time: O(nk) | Space: O(n) - TOO SLOW for large inputs
public int maxResult(int[] nums, int k) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, Integer.MIN_VALUE);
    dp[0] = nums[0];

    for (int i = 1; i < n; i++) {
        // Check all positions we could have jumped from
        for (int j = Math.max(0, i - k); j < i; j++) {
            dp[i] = Math.max(dp[i], dp[j] + nums[i]);
        }
    }

    return dp[n - 1];
}
```

</div>

## Optimized Approach

The key insight is that we need to efficiently find the maximum value in a sliding window of size `k`. For each position `i`, we need the maximum `dp` value from positions `i-k` to `i-1`.

This is exactly the **Sliding Window Maximum** problem! We can solve it using:

1. **Monotonic Deque**: Maintain a decreasing deque where the front always has the maximum value
2. **Priority Queue/Heap**: Keep a max-heap of (value, index) pairs

The deque approach is more efficient (O(n) vs O(n log n)) because:

- We only add/remove each element once
- We maintain elements in decreasing order
- We remove elements that are out of the window from the front
- We remove smaller elements from the back before adding new ones

## Optimal Solution

Here's the optimal solution using a monotonic deque:

<div class="code-group">

```python
# Time: O(n) | Space: O(k) - Each element enters and leaves deque at most once
def maxResult(nums, k):
    n = len(nums)
    # dp[i] stores maximum score to reach index i
    dp = [0] * n
    dp[0] = nums[0]

    # Deque stores indices of dp array in decreasing order of dp values
    # The front of deque always has the maximum dp value in current window
    from collections import deque
    dq = deque()
    dq.append(0)  # Start with index 0

    for i in range(1, n):
        # Remove indices that are out of range (more than k steps behind)
        while dq and dq[0] < i - k:
            dq.popleft()

        # dp[i] = nums[i] + best score from reachable positions
        dp[i] = nums[i] + dp[dq[0]]

        # Maintain decreasing order in deque
        # Remove indices from back whose dp values are <= dp[i]
        # This ensures front always has maximum
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()

        # Add current index to deque
        dq.append(i)

    return dp[n-1]
```

```javascript
// Time: O(n) | Space: O(k) - Each element enters and leaves deque at most once
function maxResult(nums, k) {
  const n = nums.length;
  // dp[i] stores maximum score to reach index i
  const dp = new Array(n).fill(0);
  dp[0] = nums[0];

  // Deque stores indices of dp array in decreasing order of dp values
  // The front of deque always has the maximum dp value in current window
  const dq = [0]; // Start with index 0

  for (let i = 1; i < n; i++) {
    // Remove indices that are out of range (more than k steps behind)
    while (dq.length > 0 && dq[0] < i - k) {
      dq.shift();
    }

    // dp[i] = nums[i] + best score from reachable positions
    dp[i] = nums[i] + dp[dq[0]];

    // Maintain decreasing order in deque
    // Remove indices from back whose dp values are <= dp[i]
    // This ensures front always has maximum
    while (dq.length > 0 && dp[dq[dq.length - 1]] <= dp[i]) {
      dq.pop();
    }

    // Add current index to deque
    dq.push(i);
  }

  return dp[n - 1];
}
```

```java
// Time: O(n) | Space: O(k) - Each element enters and leaves deque at most once
public int maxResult(int[] nums, int k) {
    int n = nums.length;
    // dp[i] stores maximum score to reach index i
    int[] dp = new int[n];
    dp[0] = nums[0];

    // Deque stores indices of dp array in decreasing order of dp values
    // The front of deque always has the maximum dp value in current window
    Deque<Integer> dq = new ArrayDeque<>();
    dq.offerLast(0);  // Start with index 0

    for (int i = 1; i < n; i++) {
        // Remove indices that are out of range (more than k steps behind)
        while (!dq.isEmpty() && dq.peekFirst() < i - k) {
            dq.pollFirst();
        }

        // dp[i] = nums[i] + best score from reachable positions
        dp[i] = nums[i] + dp[dq.peekFirst()];

        // Maintain decreasing order in deque
        // Remove indices from back whose dp values are <= dp[i]
        // This ensures front always has maximum
        while (!dq.isEmpty() && dp[dq.peekLast()] <= dp[i]) {
            dq.pollLast();
        }

        // Add current index to deque
        dq.offerLast(i);
    }

    return dp[n - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element exactly once
- Each element is added to the deque once and removed at most once
- The while loops for maintaining the deque might seem like O(n²), but they're amortized O(1) per element

**Space Complexity: O(k)**

- The deque stores at most k+1 indices (window size + 1)
- The dp array uses O(n) space, but we could optimize to O(k) by only storing the last k values

## Common Mistakes

1. **Forgetting to handle the case when deque becomes empty**: Always check `dq` is not empty before accessing `dq[0]`/`dq.peekFirst()`. In our solution, this never happens because we always add the current index to the deque.

2. **Incorrect window boundaries**: Using `i - k` instead of `i - k` for the lower bound. Remember: we can jump from `i-k` to `i-1`, so indices less than `i-k` are invalid.

3. **Not maintaining decreasing order properly**: The key insight is we remove elements from the back that are ≤ current dp[i], not just <. If we have equal values, we want to keep the newer one since it will stay in the window longer.

4. **Using a heap without checking if top element is in window**: If using a max-heap approach, you must check if the top element's index is within the valid range. You might need to pop elements until you find one in range.

## When You'll See This Pattern

This "sliding window maximum" pattern appears in problems where you need to efficiently track the best value in a moving window:

1. **Sliding Window Maximum (Hard)**: Direct application of the monotonic deque technique.
2. **Jump Game VII (Medium)**: Similar jumping constraints but with boolean reachability instead of maximizing scores.
3. **Shortest Subarray with Sum at Least K (Hard)**: Uses monotonic deque to maintain prefix sums.
4. **Maximum Sum of Distinct Subarrays With Length K (Medium)**: Another sliding window problem with constraints.

The pattern to recognize: when you need to find maximum/minimum in a sliding window and naive approaches would be O(nk) or O(n²).

## Key Takeaways

1. **Monotonic deque is perfect for sliding window maximum/minimum problems**: It gives O(n) time by ensuring each element is processed at most twice (added once, removed once).

2. **Recognize when DP needs optimization**: If your DP transition looks like `dp[i] = f(nums[i]) + max(dp[i-k..i-1])`, you likely need a sliding window maximum data structure.

3. **Maintain both value and index in deque**: We store indices in the deque but compare their corresponding dp values. This lets us check if an element is still in the window (by index) while maintaining order by value.

Related problems: [Sliding Window Maximum](/problem/sliding-window-maximum), [Jump Game VII](/problem/jump-game-vii), [Jump Game VIII](/problem/jump-game-viii)
