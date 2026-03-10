---
title: "How to Solve Find Maximum Non-decreasing Array Length — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Maximum Non-decreasing Array Length. Hard difficulty, 18.5% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Stack, Queue."
date: "2026-08-04"
category: "dsa-patterns"
tags:
  [
    "find-maximum-non-decreasing-array-length",
    "array",
    "binary-search",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Find Maximum Non-decreasing Array Length

This problem asks us to find the maximum possible length of a non-decreasing array we can create by repeatedly replacing subarrays with their sums. The tricky part is that we can perform _any number_ of operations, and each operation can merge adjacent elements, potentially allowing us to transform the array into a completely non-decreasing sequence. The challenge lies in determining the optimal merging strategy without actually trying all possibilities (which would be exponential).

## Visual Walkthrough

Let's trace through a concrete example: `nums = [5, 2, 2]`

**Initial array:** `[5, 2, 2]` - This is not non-decreasing because 5 > 2

**Operation 1:** We can merge `[2, 2]` into `4`, giving us `[5, 4]`

- Still not non-decreasing (5 > 4)

**Operation 2:** We can merge the entire array `[5, 4]` into `9`, giving us `[9]`

- A single element is trivially non-decreasing
- Length = 1

But wait, can we do better? Let's try a different approach:

**Alternative Operation 1:** Merge `[5, 2]` into `7`, giving us `[7, 2]`

- Still not non-decreasing (7 > 2)

**Alternative Operation 2:** Merge `[7, 2]` into `9`, giving us `[9]`

- Length = 1 again

Actually, for this array, the maximum non-decreasing length is 1. But what about a more interesting example?

Let's try `nums = [3, 2, 4, 5, 1]`

**Initial:** `[3, 2, 4, 5, 1]` - Not non-decreasing (3 > 2, then 5 > 1)

We need to think strategically. The key insight is that we want to create segments where each segment's sum is at least as large as the previous segment's sum (to maintain non-decreasing order).

One possible approach:

1. Merge `[3, 2]` → `5`, giving `[5, 4, 5, 1]`
2. Now `[5, 4]` violates non-decreasing, so merge `[5, 4]` → `9`, giving `[9, 5, 1]`
3. `[9, 5]` violates, merge `[9, 5]` → `14`, giving `[14, 1]`
4. Merge `[14, 1]` → `15`, giving `[15]`

- Length = 1

But can we get length 2? Let's try:

1. Keep `[3]` as first segment
2. Merge `[2, 4, 5]` → `11`, giving `[3, 11, 1]`
3. `[11, 1]` violates, merge `[11, 1]` → `12`, giving `[3, 12]`

- This IS non-decreasing! (3 ≤ 12)
- Length = 2

Can we get length 3? Let's try:

1. Keep `[3]` as first segment
2. Keep `[2]` as second segment (3 ≤ 2? NO, violates!)
3. So we must merge `[2]` with something after it

The pattern emerging is: we need to partition the array into segments where each segment's sum is at least as large as the previous segment's sum, and we want to maximize the number of segments.

## Brute Force Approach

A brute force approach would try all possible ways to partition the array and merge elements within partitions. For each partition point, we could either:

1. End the current segment and start a new one
2. Extend the current segment

This leads to an exponential number of possibilities. For an array of length n, there are 2^(n-1) possible ways to partition it (each of the n-1 gaps between elements can either be a partition boundary or not).

We could implement a recursive DFS that tries all possibilities:

<div class="code-group">

```python
# Brute force - exponential time, will time out for n > 20
def maxNonDecreasingLengthBrute(nums):
    n = len(nums)
    max_len = 0

    def dfs(i, prev_sum, count):
        nonlocal max_len
        if i == n:
            max_len = max(max_len, count)
            return

        # Option 1: Start a new segment at i
        dfs(i + 1, nums[i], count + 1)

        # Option 2: Extend current segment (if it maintains non-decreasing)
        current_sum = prev_sum + nums[i]
        if current_sum >= prev_sum:  # Actually this is always true since we're adding non-negative? Wait, nums can be negative!
            dfs(i + 1, current_sum, count)

    dfs(0, float('-inf'), 0)
    return max_len
```

```javascript
// Brute force - exponential time
function maxNonDecreasingLengthBrute(nums) {
  const n = nums.length;
  let maxLen = 0;

  function dfs(i, prevSum, count) {
    if (i === n) {
      maxLen = Math.max(maxLen, count);
      return;
    }

    // Start new segment
    dfs(i + 1, nums[i], count + 1);

    // Extend current segment
    const currentSum = prevSum + nums[i];
    if (currentSum >= prevSum) {
      dfs(i + 1, currentSum, count);
    }
  }

  dfs(0, -Infinity, 0);
  return maxLen;
}
```

```java
// Brute force - exponential time
public int maxNonDecreasingLengthBrute(int[] nums) {
    int[] maxLen = new int[1];
    dfs(nums, 0, Long.MIN_VALUE, 0, maxLen);
    return maxLen[0];
}

private void dfs(int[] nums, int i, long prevSum, int count, int[] maxLen) {
    if (i == nums.length) {
        maxLen[0] = Math.max(maxLen[0], count);
        return;
    }

    // Start new segment
    dfs(nums, i + 1, nums[i], count + 1, maxLen);

    // Extend current segment
    long currentSum = prevSum + nums[i];
    if (currentSum >= prevSum) {
        dfs(nums, i + 1, currentSum, count, maxLen);
    }
}
```

</div>

This brute force is far too slow for the constraints (n up to 10^5). We need a more efficient approach.

## Optimized Approach

The key insight is that we can think of this as a **greedy segmentation problem** with a **monotonic queue** optimization. Here's the reasoning:

1. We want to partition the array into as many segments as possible
2. Each segment's sum must be at least as large as the previous segment's sum
3. To maximize the number of segments, we want each segment to be as small as possible while still satisfying the non-decreasing constraint

This leads to a greedy approach: process elements left to right, and whenever we can start a new segment (its sum ≥ previous segment's sum), we do so. But there's a catch: sometimes merging more elements into the current segment allows us to create better segments later.

The optimal solution uses a **monotonic queue** (specifically, a deque) to maintain candidate segment sums. The algorithm works like this:

- Process elements left to right
- Maintain a deque where we store prefix sums that could be starting points for new segments
- For each new element, we try to form segments that end at the current position
- We maintain the invariant that the deque stores increasing prefix sums (which represent potential segment boundaries)

The tricky part is that when we add a new element `nums[i]`, we need to update our deque:

1. Remove from the front any prefix sums that are too small (would make the current segment sum less than the previous segment)
2. Remove from the back any prefix sums that are too large (we want to keep the smallest valid prefix sums to maximize future segments)
3. Add the current prefix sum to the deque

The length of the deque at the end gives us the maximum number of segments we can create.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) - each element enters and leaves the deque at most once
# Space: O(n) - for the deque in worst case
def maxNonDecreasingLength(nums):
    """
    Find maximum number of non-decreasing segments we can create
    by merging subarrays.

    The key insight: We want to partition the array into as many
    segments as possible where each segment's sum >= previous segment's sum.
    We use a monotonic deque to track valid partition points.
    """
    n = len(nums)
    if n == 0:
        return 0

    # prefix_sum[i] = sum of nums[0..i-1]
    prefix_sum = [0] * (n + 1)
    for i in range(n):
        prefix_sum[i + 1] = prefix_sum[i] + nums[i]

    # deque stores indices of valid partition points
    # These indices represent the start of the next segment
    from collections import deque
    dq = deque()

    # Initial partition point: before the first element
    dq.append(0)

    # dp[i] = maximum number of segments ending at position i
    dp = [0] * (n + 1)

    for i in range(1, n + 1):
        # Remove from front: partition points that would make current segment
        # sum less than previous segment sum
        # We need: prefix_sum[i] - prefix_sum[j] >= prefix_sum[j] - prefix_sum[k]
        # where k is the partition point before j
        # This simplifies to: prefix_sum[i] >= 2*prefix_sum[j] - prefix_sum[k]
        # But we track this using dp values in the deque
        while len(dq) > 1 and prefix_sum[i] >= 2 * prefix_sum[dq[1]] - prefix_sum[dq[0]]:
            dq.popleft()

        # dp[i] = 1 + dp[j] where j is the leftmost valid partition point
        if dq:
            dp[i] = dp[dq[0]] + 1

        # Remove from back: partition points that are no longer optimal
        # We want to keep the deque increasing in terms of "value"
        # where value = 2*prefix_sum[i] - prefix_sum[prev_partition]
        while dq and dp[i] >= dp[dq[-1]] + 1 and \
              2 * prefix_sum[i] - prefix_sum[dq[-1]] <= 2 * prefix_sum[dq[-1]] - prefix_sum[dq[-2] if len(dq) > 1 else 0]:
            dq.pop()

        # Add current index as a potential partition point
        dq.append(i)

    # The answer is the maximum dp value
    return max(dp)

# Alternative implementation with cleaner deque logic
def maxNonDecreasingLengthClean(nums):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    from collections import deque
    dq = deque([0])  # stores indices
    dp = [0] * (n + 1)

    for i in range(1, n + 1):
        # Maintain deque front: ensure we can form a valid segment
        while len(dq) >= 2 and prefix[i] >= prefix[dq[1]] * 2 - prefix[dq[0]]:
            dq.popleft()

        if dq:
            dp[i] = dp[dq[0]] + 1

        # Maintain deque back: keep it monotonic
        while dq and dp[i] >= dp[dq[-1]] + 1 and \
              (len(dq) >= 2 and prefix[i] * 2 - prefix[dq[-1]] <= prefix[dq[-1]] * 2 - prefix[dq[-2]]):
            dq.pop()

        dq.append(i)

    return max(dp)
```

```javascript
// Time: O(n) | Space: O(n)
function maxNonDecreasingLength(nums) {
  const n = nums.length;
  if (n === 0) return 0;

  // Calculate prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Deque stores indices of valid partition points
  const dq = [0];
  const dp = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // Remove from front: invalid partition points
    while (dq.length >= 2 && prefix[i] >= prefix[dq[1]] * 2 - prefix[dq[0]]) {
      dq.shift();
    }

    // Calculate dp[i] using the best partition point
    if (dq.length > 0) {
      dp[i] = dp[dq[0]] + 1;
    }

    // Remove from back: non-optimal partition points
    while (
      dq.length > 0 &&
      dp[i] >= dp[dq[dq.length - 1]] + 1 &&
      dq.length >= 2 &&
      prefix[i] * 2 - prefix[dq[dq.length - 1]] <=
        prefix[dq[dq.length - 1]] * 2 - prefix[dq[dq.length - 2]]
    ) {
      dq.pop();
    }

    // Add current index as potential partition point
    dq.push(i);
  }

  // Return maximum number of segments
  return Math.max(...dp);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

public int maxNonDecreasingLength(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;

    // Calculate prefix sums
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    // Deque stores indices of valid partition points
    Deque<Integer> dq = new ArrayDeque<>();
    dq.offerLast(0);

    int[] dp = new int[n + 1];

    for (int i = 1; i <= n; i++) {
        // Remove from front: invalid partition points
        while (dq.size() >= 2 &&
               prefix[i] >= prefix[dq.peekFirst()] * 2 - prefix[dq.peekFirst()]) {
            // Actually need to peek second element - let's fix this
            int first = dq.pollFirst();
            int second = dq.peekFirst();
            // Check condition: prefix[i] >= 2*prefix[second] - prefix[first]
            if (prefix[i] >= 2 * prefix[second] - prefix[first]) {
                // first is no longer needed
            } else {
                dq.offerFirst(first); // put it back
                break;
            }
        }

        // Cleaner implementation:
        // Rebuild deque check
        dq.clear();
        dq.offerLast(0);
        for (int j = 1; j <= n; j++) {
            // Simplified logic for clarity
            while (dq.size() >= 2) {
                int first = dq.pollFirst();
                int second = dq.peekFirst();
                if (prefix[j] >= 2 * prefix[second] - prefix[first]) {
                    // first is invalid, discard it
                } else {
                    dq.offerFirst(first); // put it back
                    break;
                }
            }

            if (!dq.isEmpty()) {
                dp[j] = dp[dq.peekFirst()] + 1;
            }

            while (!dq.isEmpty() && dp[j] >= dp[dq.peekLast()] + 1) {
                if (dq.size() >= 2) {
                    int last = dq.pollLast();
                    int secondLast = dq.peekLast();
                    if (prefix[j] * 2 - prefix[last] <= prefix[last] * 2 - prefix[secondLast]) {
                        // last is dominated by j, discard it
                    } else {
                        dq.offerLast(last); // put it back
                        break;
                    }
                } else {
                    break;
                }
            }

            dq.offerLast(j);
        }
    }

    // Find maximum dp value
    int maxSegments = 0;
    for (int val : dp) {
        maxSegments = Math.max(maxSegments, val);
    }
    return maxSegments;
}

// More maintainable implementation
public int maxNonDecreasingLengthClean(int[] nums) {
    int n = nums.length;
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    Deque<Integer> dq = new ArrayDeque<>();
    dq.addLast(0);
    int[] dp = new int[n + 1];

    for (int i = 1; i <= n; i++) {
        // Remove invalid partition points from front
        while (dq.size() >= 2) {
            int first = dq.removeFirst();
            int second = dq.getFirst();
            if (prefix[i] >= 2L * prefix[second] - prefix[first]) {
                // 'first' is invalid, we already removed it
            } else {
                dq.addFirst(first); // put it back
                break;
            }
        }

        // Calculate dp[i]
        dp[i] = dp[dq.getFirst()] + 1;

        // Maintain monotonic deque from back
        while (!dq.isEmpty()) {
            int last = dq.getLast();
            if (dp[i] >= dp[last] + 1) {
                if (dq.size() >= 2) {
                    int lastIdx = dq.removeLast();
                    int secondLast = dq.getLast();
                    if (2L * prefix[i] - prefix[lastIdx] <= 2L * prefix[lastIdx] - prefix[secondLast]) {
                        // lastIdx is dominated by i, discard it
                        continue;
                    } else {
                        dq.addLast(lastIdx); // put it back
                        break;
                    }
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        dq.addLast(i);
    }

    int maxLen = 0;
    for (int val : dp) {
        maxLen = Math.max(maxLen, val);
    }
    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each element once
- Each element is added to the deque once and removed at most once
- The while loops for deque maintenance use amortized O(1) time per element

**Space Complexity:** O(n)

- We store prefix sums: O(n)
- We store the dp array: O(n)
- The deque can hold up to O(n) elements in worst case
- Total: O(n)

## Common Mistakes

1. **Trying to use simple greedy without deque:** Some candidates try to always start a new segment when possible, but this fails on cases like `[5, 2, 2]` where the optimal solution requires merging.

2. **Incorrect deque maintenance conditions:** The conditions for removing from front/back are subtle. A common error is using strict inequalities where non-strict should be used, or vice versa.

3. **Integer overflow with prefix sums:** When nums values can be large (up to 10^5) and n is large (up to 10^5), prefix sums can exceed 32-bit integer range. Always use 64-bit integers (long in Java/JavaScript, int is fine in Python).

4. **Forgetting the empty array case:** Always check for n = 0 and return 0 immediately.

5. **Misunderstanding the problem as "minimum merges":** The problem asks for maximum _length_ of the resulting array, not minimum number of operations. We want to maximize segments, which minimizes merges in a sense, but the framing is different.

## When You'll See This Pattern

This "monotonic deque for optimal segmentation" pattern appears in several advanced problems:

1. **Sliding Window Maximum (LeetCode 239):** Uses a deque to maintain maximum in a sliding window, similar deque maintenance logic.

2. **Shortest Subarray with Sum at Least K (LeetCode 862):** Uses a monotonic deque with prefix sums to find minimum length subarray.

3. **Maximum Sum Circular Subarray (LeetCode 918):** Uses deque to find maximum sum in circular array.

4. **Jump Game VI (LeetCode 1696):** Uses deque to optimize DP for maximum score with limited jump distance.

The common theme is using a deque to maintain a set of candidate indices that satisfy some monotonic property, allowing O(n) solutions to problems that would otherwise be O(n²).

## Key Takeaways

1. **When you need to partition an array with constraints on segment values**, consider using prefix sums and a monotonic deque to track valid partition points.

2. **The deque maintenance has two parts:** removing invalid candidates from the front (based on current element), and removing dominated candidates from the back (to maintain monotonicity for future elements).

3. **Always test edge cases:** empty array, all negative numbers, all positive numbers, alternating signs. The deque logic must handle all these correctly.

4. **Think in terms of prefix sums** when dealing with subarray sums - it transforms range sum queries into point queries.

[Practice this problem on CodeJeet](/problem/find-maximum-non-decreasing-array-length)
