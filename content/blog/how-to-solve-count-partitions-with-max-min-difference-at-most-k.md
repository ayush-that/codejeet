---
title: "How to Solve Count Partitions With Max-Min Difference at Most K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Partitions With Max-Min Difference at Most K. Medium difficulty, 58.8% acceptance rate. Topics: Array, Dynamic Programming, Queue, Sliding Window, Prefix Sum."
date: "2028-03-15"
category: "dsa-patterns"
tags:
  [
    "count-partitions-with-max-min-difference-at-most-k",
    "array",
    "dynamic-programming",
    "queue",
    "medium",
  ]
---

# How to Solve Count Partitions With Max-Min Difference at Most K

You need to count how many ways to split an array into contiguous segments where each segment's maximum-minimum difference ≤ k. The challenge is that segments can be any length, and the number of partitions grows exponentially—so we need an efficient way to count valid partitions without enumerating them all.

## Visual Walkthrough

Let's trace through `nums = [3, 1, 4, 2]` with `k = 2`. We want to count partitions where each segment's max-min ≤ 2.

**Step 1: Start from the end**
We'll work backwards because it's easier to think about: "How many valid partitions start at position i?"

- Position 3 (value 2): Single element [2], max-min=0 ≤ 2 → valid. So 1 way starting at index 3.

**Step 2: Position 2 (value 4)**
We can make segments starting here:

- [4] alone: valid (0 ≤ 2) → 1 way
- [4,2]: max=4, min=2, diff=2 ≤ 2 → valid. This gives us all partitions starting at position 2: we can take just [4], or [4,2] followed by any valid partitions starting at position 3. Wait—that's the key: if [4,2] is valid, then partitions starting at 2 = partitions starting at 3 (for the [4,2] case) + partitions starting at 3 (for the [4] case)? Let's think differently.

Actually, better approach: For each starting index i, we find the furthest j where [i..j] is valid. Then ALL segments i..j, i..j-1, ..., i..i are valid! So partitions starting at i = sum of partitions starting at i+1 through j+1.

**Step 3: Apply to our example**

- i=3: Only [2] valid → partitions[3] = partitions[4] = 1 (base case)
- i=2: Check segments starting at 2:
  - [4] valid (diff=0)
  - [4,2] valid (diff=2)
    Can't extend past index 3. So j=3.
    partitions[2] = partitions[3] + partitions[4] = 1 + 1 = 2
    (Meaning: from index 2, we can do [4] then partitions from 3, OR [4,2] then partitions from 4)

- i=1 (value 1):
  - [1] valid
  - [1,4] diff=3 > 2 → invalid! So j=1 only.
    partitions[1] = partitions[2] = 2

- i=0 (value 3):
  - [3] valid
  - [3,1] diff=2 valid
  - [3,1,4] max=4, min=1, diff=3 > 2 → invalid
    So j=1.
    partitions[0] = partitions[1] + partitions[2] = 2 + 2 = 4

Total partitions = partitions[0] = 4.

Let's list them to verify:

1. [3], [1], [4], [2]
2. [3], [1], [4,2]
3. [3,1], [4], [2]
4. [3,1], [4,2]

All segments have max-min ≤ 2. ✓

## Brute Force Approach

A naive solution would try all possible cut points between elements. For n elements, there are n-1 possible cut positions, leading to 2^(n-1) possible partitions. For each partition, we'd need to check all segments, which is O(n) per partition. Total: O(n \* 2^n), which is far too slow for n up to 10^5.

Even with memoization, if we try all segments starting at each position, we still need to check each segment's validity by finding its max/min. Without optimization, that's O(n^3) with naive checking or O(n^2) with prefix min/max arrays—still too slow.

## Optimized Approach

The key insight is **monotonic queues + dynamic programming**:

1. **Dynamic Programming State**: Let `dp[i]` = number of valid partitions of the subarray starting at index i.
   - Base case: `dp[n] = 1` (empty suffix has 1 partition: the empty partition)
   - We want `dp[0]`

2. **Transition**: If we know the furthest index `j` where `nums[i..j]` is valid (max-min ≤ k), then:

   ```
   dp[i] = dp[i+1] + dp[i+2] + ... + dp[j+1]
   ```

   Why? Because we can make segments of length 1, 2, ..., (j-i+1) all starting at i, and each is followed by valid partitions of the remaining suffix.

3. **Finding j efficiently**: We need to find, for each i, the maximum j where `max(nums[i..j]) - min(nums[i..j]) ≤ k`.
   - Use two **monotonic deques**: one for max (decreasing), one for min (increasing)
   - As we extend j, maintain current max/min via deques
   - When `max-min > k`, we need to move i forward until valid again
   - Actually, we'll use a sliding window: for each i, find the largest j where window [i..j] is valid

4. **Optimizing the sum**: We need `dp[i] = sum(dp[i+1..j+1])`. Maintaining this sum efficiently:
   - Compute dp from right to left
   - Maintain a running sum of dp values in the current window
   - When we move i left, add dp[i] to running sum
   - When j moves right, add dp[j+1] to running sum
   - When i moves (in sliding window), subtract dp[i+1] from sum

This gives us O(n) time with O(n) space.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countPartitions(nums, k):
    n = len(nums)
    MOD = 10**9 + 7

    # dp[i] = number of valid partitions starting at index i
    dp = [0] * (n + 1)
    dp[n] = 1  # Base case: empty suffix has 1 partition

    # Monotonic deques for max (decreasing) and min (increasing)
    max_deque = collections.deque()  # stores indices, values decreasing
    min_deque = collections.deque()  # stores indices, values increasing

    # Running sum of dp values in current window: sum(dp[i+1..j+1])
    running_sum = 0

    # Two pointers: i is left boundary of current segment, j is right boundary
    # We process from right to left
    j = n - 1
    for i in range(n - 1, -1, -1):
        # Add nums[i] to deques, maintaining monotonic properties
        while max_deque and nums[max_deque[-1]] <= nums[i]:
            max_deque.pop()
        max_deque.append(i)

        while min_deque and nums[min_deque[-1]] >= nums[i]:
            min_deque.pop()
        min_deque.append(i)

        # Extend j to the right while window [i..j] is valid
        while j >= i and nums[max_deque[0]] - nums[min_deque[0]] > k:
            # Remove j from deques if it's at the front
            if max_deque[0] == j:
                max_deque.popleft()
            if min_deque[0] == j:
                min_deque.popleft()

            # Remove dp[j+1] from running sum as j moves left
            running_sum = (running_sum - dp[j + 1]) % MOD
            j -= 1

        # Now window [i..j] is valid
        # Add dp[j+1] to running sum (for the new i position)
        running_sum = (running_sum + dp[j + 1]) % MOD

        # dp[i] = sum of dp[i+1] through dp[j+1]
        dp[i] = running_sum

        # Remove dp[i+1] from running sum for next iteration
        # (since next i will be i-1, and window will shift)
        running_sum = (running_sum - dp[i + 1]) % MOD

    return dp[0] % MOD
```

```javascript
// Time: O(n) | Space: O(n)
function countPartitions(nums, k) {
  const n = nums.length;
  const MOD = 1e9 + 7;

  // dp[i] = number of valid partitions starting at index i
  const dp = new Array(n + 1).fill(0);
  dp[n] = 1; // Base case: empty suffix has 1 partition

  // Monotonic deques for max (decreasing) and min (increasing)
  const maxDeque = []; // stores indices, values decreasing
  const minDeque = []; // stores indices, values increasing

  // Running sum of dp values in current window: sum(dp[i+1..j+1])
  let runningSum = 0;

  // Two pointers: i is left boundary, j is right boundary
  // Process from right to left
  let j = n - 1;
  for (let i = n - 1; i >= 0; i--) {
    // Add nums[i] to deques, maintaining monotonic properties
    while (maxDeque.length && nums[maxDeque[maxDeque.length - 1]] <= nums[i]) {
      maxDeque.pop();
    }
    maxDeque.push(i);

    while (minDeque.length && nums[minDeque[minDeque.length - 1]] >= nums[i]) {
      minDeque.pop();
    }
    minDeque.push(i);

    // Shrink window from right while invalid (max-min > k)
    while (j >= i && nums[maxDeque[0]] - nums[minDeque[0]] > k) {
      // Remove j from deques if it's at the front
      if (maxDeque[0] === j) {
        maxDeque.shift();
      }
      if (minDeque[0] === j) {
        minDeque.shift();
      }

      // Remove dp[j+1] from running sum as j moves left
      runningSum = (runningSum - dp[j + 1] + MOD) % MOD;
      j--;
    }

    // Now window [i..j] is valid
    // Add dp[j+1] to running sum
    runningSum = (runningSum + dp[j + 1]) % MOD;

    // dp[i] = sum of dp[i+1] through dp[j+1]
    dp[i] = runningSum;

    // Remove dp[i+1] from running sum for next iteration
    runningSum = (runningSum - dp[i + 1] + MOD) % MOD;
  }

  return dp[0] % MOD;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int countPartitions(int[] nums, int k) {
        int n = nums.length;
        int MOD = 1_000_000_007;

        // dp[i] = number of valid partitions starting at index i
        int[] dp = new int[n + 1];
        dp[n] = 1;  // Base case: empty suffix has 1 partition

        // Monotonic deques for max (decreasing) and min (increasing)
        Deque<Integer> maxDeque = new ArrayDeque<>();  // stores indices
        Deque<Integer> minDeque = new ArrayDeque<>();  // stores indices

        // Running sum of dp values in current window: sum(dp[i+1..j+1])
        long runningSum = 0;

        // Two pointers: i is left boundary, j is right boundary
        // Process from right to left
        int j = n - 1;
        for (int i = n - 1; i >= 0; i--) {
            // Add nums[i] to deques, maintaining monotonic properties
            while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[i]) {
                maxDeque.pollLast();
            }
            maxDeque.offerLast(i);

            while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[i]) {
                minDeque.pollLast();
            }
            minDeque.offerLast(i);

            // Shrink window from right while invalid (max-min > k)
            while (j >= i && nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > k) {
                // Remove j from deques if it's at the front
                if (maxDeque.peekFirst() == j) {
                    maxDeque.pollFirst();
                }
                if (minDeque.peekFirst() == j) {
                    minDeque.pollFirst();
                }

                // Remove dp[j+1] from running sum as j moves left
                runningSum = (runningSum - dp[j + 1] + MOD) % MOD;
                j--;
            }

            // Now window [i..j] is valid
            // Add dp[j+1] to running sum
            runningSum = (runningSum + dp[j + 1]) % MOD;

            // dp[i] = sum of dp[i+1] through dp[j+1]
            dp[i] = (int) runningSum;

            // Remove dp[i+1] from running sum for next iteration
            runningSum = (runningSum - dp[i + 1] + MOD) % MOD;
        }

        return dp[0] % MOD;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element once when adding to deques (O(1) amortized per element)
- Each element is removed from deques at most once
- The j pointer moves from n-1 to 0, total O(n) moves
- All other operations are O(1) per iteration

**Space Complexity: O(n)**

- dp array: O(n)
- Two deques: O(n) in worst case (when array is strictly increasing/decreasing)
- Other variables: O(1)

## Common Mistakes

1. **Forgetting modulo operations**: The number of partitions can be huge (exponential in n), so we need modulo 10^9+7. Candidates often compute correct values but forget modulo, causing integer overflow.

2. **Incorrect deque maintenance**: When maintaining max/min deques:
   - Max deque should be decreasing: while back ≤ current, pop back
   - Min deque should be increasing: while back ≥ current, pop back
     Mixing these up gives wrong max/min values.

3. **Off-by-one in dp indices**: The relationship `dp[i] = sum(dp[i+1..j+1])` has subtle indices:
   - `j+1` not `j` because after taking segment [i..j], the next segment starts at j+1
   - Base case `dp[n] = 1` not `dp[n-1] = 1`

4. **Not handling negative running sums in modulo**: When subtracting in modulo arithmetic, we need to add MOD before taking modulo to avoid negative values: `(a - b + MOD) % MOD`.

## When You'll See This Pattern

This **monotonic deque + sliding window + DP** pattern appears in problems where:

1. You need to maintain max/min in a sliding window
2. The window constraint involves max-min difference
3. You need to count valid partitions/subarrays

Related problems:

- **239. Sliding Window Maximum** - Uses monotonic deque for max in sliding window
- **1425. Constrained Subsequence Sum** - DP with deque optimization
- **1696. Jump Game VI** - Similar deque + DP structure
- **Number of Subarrays with Bounded Maximum** - Count subarrays where max ≤ threshold

## Key Takeaways

1. **Combine techniques**: This problem requires DP for counting, sliding window for segment validity, and monotonic deques for efficient max/min queries. Recognizing when to combine patterns is key.

2. **Right-to-left DP is natural for partition problems**: When counting partitions, it's often easier to think "how many ways to partition the suffix starting at i" rather than prefix ending at i.

3. **Maintain running sums for O(1) transitions**: Instead of recalculating `sum(dp[i+1..j+1])` each time (O(n)), maintain it as a running sum that updates in O(1) as window moves.

Related problems: [Number of Great Partitions](/problem/number-of-great-partitions)
