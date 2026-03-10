---
title: "How to Solve Constrained Subsequence Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Constrained Subsequence Sum. Hard difficulty, 56.4% acceptance rate. Topics: Array, Dynamic Programming, Queue, Sliding Window, Heap (Priority Queue)."
date: "2027-08-13"
category: "dsa-patterns"
tags: ["constrained-subsequence-sum", "array", "dynamic-programming", "queue", "hard"]
---

# How to Solve Constrained Subsequence Sum

This problem asks us to find the maximum sum of a non-empty subsequence where consecutive elements in the subsequence must be within `k` indices of each other in the original array. What makes this tricky is that we're dealing with subsequences (not subarrays), so we can skip elements, but we still have a constraint on how far apart consecutive chosen elements can be. This creates an interesting dynamic programming problem with a sliding window maximum optimization.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [10, 2, -10, 5, 20]`, `k = 2`

We want to build our solution incrementally. At each position `i`, we need to consider:

1. Starting a new subsequence with just `nums[i]`
2. Extending an existing subsequence from some previous position `j` where `i - j ≤ k`

Let's walk through step by step:

**i = 0 (nums[0] = 10)**

- Only option: start new subsequence with 10
- Best sum ending at index 0: 10

**i = 1 (nums[1] = 2)**

- Option 1: Start new with 2
- Option 2: Extend from index 0 (1-0=1 ≤ k): 10 + 2 = 12
- Best: max(2, 12) = 12

**i = 2 (nums[2] = -10)**

- Can extend from indices 0 or 1 (both within k=2)
- From index 0: 10 + (-10) = 0
- From index 1: 12 + (-10) = 2
- Start new: -10
- Best: max(0, 2, -10) = 2

**i = 3 (nums[3] = 5)**

- Can extend from indices 1 or 2 (3-1=2 ≤ k, 3-2=1 ≤ k)
- From index 1: 12 + 5 = 17
- From index 2: 2 + 5 = 7
- Start new: 5
- Best: max(17, 7, 5) = 17

**i = 4 (nums[4] = 20)**

- Can extend from indices 2 or 3 (4-2=2 ≤ k, 4-3=1 ≤ k)
- From index 2: 2 + 20 = 22
- From index 3: 17 + 20 = 37
- Start new: 20
- Best: max(22, 37, 20) = 37

The maximum sum is 37 (from subsequence 10, 2, 5, 20).

Notice the pattern: at each step, we need the maximum dp value from the previous k indices.

## Brute Force Approach

The brute force approach would be to consider all valid subsequences. For each element, we have two choices: include it or not, but with the constraint that if we include it, we can only extend from elements within the last k positions.

A naive dynamic programming solution would be:

- Let `dp[i]` = maximum sum ending at index i
- `dp[i] = nums[i] + max(0, max(dp[j]) for j in [i-k, i-1])`
- Answer = `max(dp)`

The problem is in the inner loop: for each i, we check up to k previous positions. This gives us O(nk) time complexity, which is too slow when k can be up to n (making it O(n²)).

```python
# Brute force - too slow for large inputs
def constrainedSubsetSum(nums, k):
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]

    for i in range(1, n):
        # Check all previous positions within k
        best_prev = 0
        for j in range(max(0, i-k), i):
            best_prev = max(best_prev, dp[j])
        dp[i] = nums[i] + max(0, best_prev)

    return max(dp)
```

This solution is correct but inefficient. We need to optimize finding the maximum dp value in the sliding window of size k.

## Optimized Approach

The key insight is that we need to efficiently find the maximum value in a sliding window of the last k dp values. This is a classic "sliding window maximum" problem that can be solved with a monotonic deque (double-ended queue).

Here's the step-by-step reasoning:

1. **Dynamic Programming State**: `dp[i]` represents the maximum sum of a subsequence ending at index i (and including nums[i]).

2. **Transition**: `dp[i] = nums[i] + max(0, max(dp[j]) for j in [i-k, i-1])`
   - We can either start a new subsequence with just nums[i] (if all previous dp values are negative)
   - Or extend the best subsequence from the last k positions

3. **Optimization**: Instead of checking all k previous positions for each i, we maintain a deque that stores indices of dp values in decreasing order. This allows us to:
   - Get the maximum dp value in O(1) time (front of deque)
   - Remove indices that are out of the window (i - index > k)
   - Maintain the decreasing order by removing smaller dp values from the back

4. **Why a decreasing deque works**:
   - If we have a new dp value that's larger than previous ones, the smaller ones will never be the maximum in future windows
   - We only need to keep candidates that could become the maximum in future windows

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - each element enters and leaves deque at most once
# Space: O(n) for dp array, O(k) for deque
def constrainedSubsetSum(nums, k):
    n = len(nums)
    # dp[i] stores maximum sum ending at index i
    dp = [0] * n
    dp[0] = nums[0]

    # Use deque to store indices of dp values in decreasing order
    # This allows O(1) access to max value in sliding window
    from collections import deque
    dq = deque([0])  # Start with index 0

    max_sum = dp[0]

    for i in range(1, n):
        # Remove indices that are out of window (more than k away)
        while dq and i - dq[0] > k:
            dq.popleft()

        # dp[i] = nums[i] + max(0, best previous dp in window)
        # If no valid previous or all negative, we can start fresh
        best_prev = dp[dq[0]] if dq else 0
        dp[i] = nums[i] + max(0, best_prev)

        # Update max_sum
        max_sum = max(max_sum, dp[i])

        # Maintain decreasing order in deque
        # Remove indices from back while their dp values are <= current dp[i]
        while dq and dp[dq[-1]] <= dp[i]:
            dq.pop()

        # Add current index to deque
        dq.append(i)

    return max_sum
```

```javascript
// Time: O(n) - each element enters and leaves deque at most once
// Space: O(n) for dp array, O(k) for deque
function constrainedSubsetSum(nums, k) {
  const n = nums.length;
  // dp[i] stores maximum sum ending at index i
  const dp = new Array(n);
  dp[0] = nums[0];

  // Use deque to store indices of dp values in decreasing order
  const dq = [0]; // Start with index 0

  let maxSum = dp[0];

  for (let i = 1; i < n; i++) {
    // Remove indices that are out of window (more than k away)
    while (dq.length > 0 && i - dq[0] > k) {
      dq.shift();
    }

    // dp[i] = nums[i] + max(0, best previous dp in window)
    const bestPrev = dq.length > 0 ? dp[dq[0]] : 0;
    dp[i] = nums[i] + Math.max(0, bestPrev);

    // Update maxSum
    maxSum = Math.max(maxSum, dp[i]);

    // Maintain decreasing order in deque
    // Remove indices from back while their dp values are <= current dp[i]
    while (dq.length > 0 && dp[dq[dq.length - 1]] <= dp[i]) {
      dq.pop();
    }

    // Add current index to deque
    dq.push(i);
  }

  return maxSum;
}
```

```java
// Time: O(n) - each element enters and leaves deque at most once
// Space: O(n) for dp array, O(k) for deque
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int constrainedSubsetSum(int[] nums, int k) {
        int n = nums.length;
        // dp[i] stores maximum sum ending at index i
        int[] dp = new int[n];
        dp[0] = nums[0];

        // Use deque to store indices of dp values in decreasing order
        Deque<Integer> dq = new ArrayDeque<>();
        dq.offerLast(0); // Start with index 0

        int maxSum = dp[0];

        for (int i = 1; i < n; i++) {
            // Remove indices that are out of window (more than k away)
            while (!dq.isEmpty() && i - dq.peekFirst() > k) {
                dq.pollFirst();
            }

            // dp[i] = nums[i] + max(0, best previous dp in window)
            int bestPrev = dq.isEmpty() ? 0 : dp[dq.peekFirst()];
            dp[i] = nums[i] + Math.max(0, bestPrev);

            // Update maxSum
            maxSum = Math.max(maxSum, dp[i]);

            // Maintain decreasing order in deque
            // Remove indices from back while their dp values are <= current dp[i]
            while (!dq.isEmpty() && dp[dq.peekLast()] <= dp[i]) {
                dq.pollLast();
            }

            // Add current index to deque
            dq.offerLast(i);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element exactly once
- Each element enters the deque once and leaves at most once
- The while loops for maintaining the deque run in amortized O(1) time per element

**Space Complexity: O(n)**

- We store the dp array of size n: O(n)
- The deque stores at most k+1 indices: O(k)
- Overall: O(n) for the dp array dominates when n > k

## Common Mistakes

1. **Forgetting to handle negative numbers correctly**: The problem allows starting a fresh subsequence if all previous options are negative. Make sure to use `max(0, best_prev)` in the dp transition.

2. **Incorrect window boundaries**: The constraint is `j - i ≤ k`, which means we can look back up to k positions. A common off-by-one error is using `< k` instead of `≤ k`.

3. **Not maintaining decreasing order in deque**: If you just use the deque as a regular queue and scan for maximum each time, you're back to O(nk) complexity. The decreasing order maintenance is crucial for O(n) time.

4. **Storing values instead of indices in deque**: You need indices to check if elements are still in the window (distance ≤ k). If you store only values, you lose track of their positions.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Dynamic Programming with State Optimization**: Similar to "House Robber" problems where you have constraints on which elements you can choose.
2. **Sliding Window Maximum**: The core optimization uses the same technique as "Sliding Window Maximum" (LeetCode 239).

Related problems that use similar techniques:

- **Sliding Window Maximum (LeetCode 239)**: Direct application of the monotonic deque pattern.
- **Maximum Sum Circular Subarray (LeetCode 918)**: Uses similar DP with constraints.
- **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)**: DP with state transitions based on time constraints.

## Key Takeaways

1. **When you need maximum/minimum in a sliding window, think monotonic deque**: This pattern gives you O(1) access to the extremum while maintaining the window efficiently.

2. **DP + sliding window is powerful for constrained sequence problems**: Many problems that involve choosing elements with distance constraints can be solved with this combination.

3. **Always consider starting fresh**: In subsequence problems, remember that you can always start a new sequence at any position, especially when previous options are unfavorable (negative sums in this case).

Related problems: [Maximum Element-Sum of a Complete Subset of Indices](/problem/maximum-element-sum-of-a-complete-subset-of-indices)
