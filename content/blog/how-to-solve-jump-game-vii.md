---
title: "How to Solve Jump Game VII — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Jump Game VII. Medium difficulty, 26.4% acceptance rate. Topics: String, Dynamic Programming, Sliding Window, Prefix Sum."
date: "2028-03-02"
category: "dsa-patterns"
tags: ["jump-game-vii", "string", "dynamic-programming", "sliding-window", "medium"]
---

# How to Solve Jump Game VII

You're given a binary string where you start at index 0 and can jump forward between `minJump` and `maxJump` positions, but only to indices containing '0'. The challenge is determining if you can reach the last index. What makes this tricky is that a naive BFS/DFS would be O(n²) in worst case, and the jump range constraint requires careful optimization.

## Visual Walkthrough

Let's trace through `s = "011010"`, `minJump = 2`, `maxJump = 3`:

1. **Start at index 0** (must be '0', which it is)
2. **From index 0**, you can jump to indices where:
   - `0 + 2 ≤ j ≤ min(0 + 3, 5)` → `2 ≤ j ≤ 3`
   - Indices 2 and 3 must be '0'
   - Index 2 is '1' ❌, Index 3 is '0' ✅
   - So you can reach index 3

3. **From index 3**, you can jump to:
   - `3 + 2 ≤ j ≤ min(3 + 3, 5)` → `5 ≤ j ≤ 5`
   - Index 5 must be '0'
   - Index 5 is '0' ✅
   - So you can reach the last index!

The path is: 0 → 3 → 5. Notice we skipped index 1 entirely because it wasn't in any valid jump range from index 0.

## Brute Force Approach

A naive approach would be BFS or DFS: from each reachable index `i`, try all jumps to indices `j` where `i + minJump ≤ j ≤ min(i + maxJump, n-1)` and `s[j] == '0'`. We'd mark visited indices to avoid cycles.

**Why this fails:** In worst case, each index could have up to `maxJump - minJump + 1` possible jumps. With `n` indices, this becomes O(n × (maxJump-minJump)), which is effectively O(n²) when the jump range is large. For `n = 10^5`, this is far too slow.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) - TOO SLOW for constraints
def canReach_brute(s, minJump, maxJump):
    n = len(s)
    if s[0] != '0' or s[-1] != '0':
        return False

    visited = [False] * n
    visited[0] = True
    queue = [0]

    while queue:
        i = queue.pop(0)
        # Try all possible jumps from i
        for j in range(i + minJump, min(i + maxJump, n - 1) + 1):
            if not visited[j] and s[j] == '0':
                if j == n - 1:
                    return True
                visited[j] = True
                queue.append(j)

    return False
```

```javascript
// Time: O(n²) | Space: O(n) - TOO SLOW for constraints
function canReachBrute(s, minJump, maxJump) {
  const n = s.length;
  if (s[0] !== "0" || s[n - 1] !== "0") return false;

  const visited = new Array(n).fill(false);
  visited[0] = true;
  const queue = [0];

  while (queue.length > 0) {
    const i = queue.shift();
    // Try all possible jumps from i
    const max = Math.min(i + maxJump, n - 1);
    for (let j = i + minJump; j <= max; j++) {
      if (!visited[j] && s[j] === "0") {
        if (j === n - 1) return true;
        visited[j] = true;
        queue.push(j);
      }
    }
  }

  return false;
}
```

```java
// Time: O(n²) | Space: O(n) - TOO SLOW for constraints
public boolean canReachBrute(String s, int minJump, int maxJump) {
    int n = s.length();
    if (s.charAt(0) != '0' || s.charAt(n - 1) != '0') return false;

    boolean[] visited = new boolean[n];
    visited[0] = true;
    Queue<Integer> queue = new LinkedList<>();
    queue.offer(0);

    while (!queue.isEmpty()) {
        int i = queue.poll();
        // Try all possible jumps from i
        int max = Math.min(i + maxJump, n - 1);
        for (int j = i + minJump; j <= max; j++) {
            if (!visited[j] && s.charAt(j) == '0') {
                if (j == n - 1) return true;
                visited[j] = true;
                queue.offer(j);
            }
        }
    }

    return false;
}
```

</div>

## Optimized Approach

The key insight: we don't need to check each jump individually. Instead, we can maintain a sliding window of reachable indices using **prefix sums**.

**Reasoning step-by-step:**

1. We know index 0 is reachable (if it's '0')
2. For any index `i` to be reachable:
   - `s[i]` must be '0'
   - There must be at least one reachable index `j` where `i - maxJump ≤ j ≤ i - minJump`
3. We can track reachability using a DP array where `dp[i] = 1` if index `i` is reachable
4. Instead of checking all possible `j` for each `i` (which is O(n²)), we can use a prefix sum array `pre` where `pre[i]` = number of reachable indices in `[0, i]`
5. Then for index `i`, we can check if there's any reachable index in the window `[i-maxJump, i-minJump]` by checking if `pre[i-minJump] - pre[i-maxJump-1] > 0`
6. This gives us O(1) window checks instead of O(window size)

**Why prefix sums work:** They let us answer "how many reachable indices are in range [L, R]?" in O(1) time after O(n) preprocessing.

## Optimal Solution

Here's the optimized solution using DP with prefix sums:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def canReach(s, minJump, maxJump):
    n = len(s)

    # Edge case: first or last position not '0'
    if s[0] != '0' or s[-1] != '0':
        return False

    # dp[i] = 1 if index i is reachable, 0 otherwise
    dp = [0] * n
    dp[0] = 1  # Starting position is reachable

    # pre[i] = prefix sum of dp[0..i]
    pre = [0] * n
    pre[0] = 1  # Only index 0 is reachable initially

    for i in range(1, n):
        # Check if current position has '0'
        if s[i] == '0':
            # Calculate the window of indices that could jump to i
            left = i - maxJump
            right = i - minJump

            # Only check if right >= 0 (valid window exists)
            if right >= 0:
                # Get prefix sum for left-1 (or 0 if left <= 0)
                left_sum = pre[left - 1] if left > 0 else 0
                # Get prefix sum for right
                right_sum = pre[right]

                # If there's at least one reachable index in window
                if right_sum - left_sum > 0:
                    dp[i] = 1

        # Update prefix sum
        pre[i] = pre[i - 1] + dp[i]

    return dp[n - 1] == 1
```

```javascript
// Time: O(n) | Space: O(n)
function canReach(s, minJump, maxJump) {
  const n = s.length;

  // Edge case: first or last position not '0'
  if (s[0] !== "0" || s[n - 1] !== "0") return false;

  // dp[i] = 1 if index i is reachable, 0 otherwise
  const dp = new Array(n).fill(0);
  dp[0] = 1; // Starting position is reachable

  // pre[i] = prefix sum of dp[0..i]
  const pre = new Array(n).fill(0);
  pre[0] = 1; // Only index 0 is reachable initially

  for (let i = 1; i < n; i++) {
    // Check if current position has '0'
    if (s[i] === "0") {
      // Calculate the window of indices that could jump to i
      const left = i - maxJump;
      const right = i - minJump;

      // Only check if right >= 0 (valid window exists)
      if (right >= 0) {
        // Get prefix sum for left-1 (or 0 if left <= 0)
        const leftSum = left > 0 ? pre[left - 1] : 0;
        // Get prefix sum for right
        const rightSum = pre[right];

        // If there's at least one reachable index in window
        if (rightSum - leftSum > 0) {
          dp[i] = 1;
        }
      }
    }

    // Update prefix sum
    pre[i] = pre[i - 1] + dp[i];
  }

  return dp[n - 1] === 1;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean canReach(String s, int minJump, int maxJump) {
    int n = s.length();

    // Edge case: first or last position not '0'
    if (s.charAt(0) != '0' || s.charAt(n - 1) != '0') return false;

    // dp[i] = 1 if index i is reachable, 0 otherwise
    int[] dp = new int[n];
    dp[0] = 1;  // Starting position is reachable

    // pre[i] = prefix sum of dp[0..i]
    int[] pre = new int[n];
    pre[0] = 1;  // Only index 0 is reachable initially

    for (int i = 1; i < n; i++) {
        // Check if current position has '0'
        if (s.charAt(i) == '0') {
            // Calculate the window of indices that could jump to i
            int left = i - maxJump;
            int right = i - minJump;

            // Only check if right >= 0 (valid window exists)
            if (right >= 0) {
                // Get prefix sum for left-1 (or 0 if left <= 0)
                int leftSum = left > 0 ? pre[left - 1] : 0;
                // Get prefix sum for right
                int rightSum = pre[right];

                // If there's at least one reachable index in window
                if (rightSum - leftSum > 0) {
                    dp[i] = 1;
                }
            }
        }

        // Update prefix sum
        pre[i] = pre[i - 1] + dp[i];
    }

    return dp[n - 1] == 1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once (n iterations)
- Each iteration does O(1) work: checking conditions and updating prefix sums
- The prefix sum trick eliminates the need to check each possible jump individually

**Space Complexity: O(n)**

- We use two arrays of size n: `dp` and `pre`
- This could be optimized to O(1) by reusing arrays or using a sliding window sum, but O(n) is acceptable for clarity

## Common Mistakes

1. **Forgetting to check `s[0] == '0'`**: The problem states you start at index 0 which is equal to '0', but some inputs might violate this. Always validate.

2. **Off-by-one errors with window boundaries**: When calculating `left = i - maxJump` and `right = i - minJump`, remember these are indices that could jump TO `i`, not FROM `i`. Getting this reversed is a common mistake.

3. **Not handling negative left bound correctly**: When `left < 0`, we should treat it as 0 in the prefix sum calculation. The solution handles this with `left > 0 ? pre[left-1] : 0`.

4. **Checking windows that don't exist yet**: For early indices where `i - minJump < 0`, there's no valid window, so we skip the check. This is handled by `if right >= 0`.

## When You'll See This Pattern

The prefix sum + sliding window pattern appears in problems where you need to answer range queries efficiently:

1. **Subarray Sum Equals K** (LeetCode 560): Uses prefix sums to find subarrays summing to k in O(n) time.

2. **Maximum Sum of Two Non-Overlapping Subarrays** (LeetCode 1031): Combines prefix sums with sliding windows to find optimal subarrays.

3. **Number of Substrings Containing All Three Characters** (LeetCode 1358): Uses sliding window with character counts to track substrings.

The key insight is recognizing when you need to repeatedly answer "how many X are in range [L, R]?" questions—prefix sums turn O(n) range queries into O(1) lookups.

## Key Takeaways

1. **Prefix sums optimize range queries**: When you need to repeatedly check if something exists in a range, prefix sums can reduce O(range size) checks to O(1).

2. **Think in reverse for jump problems**: Instead of "where can I jump from i?", ask "what indices could jump to i?" This perspective often reveals optimization opportunities.

3. **Validate constraints early**: Always check edge cases like invalid starting/ending positions before running the main algorithm.

Related problems: [Jump Game II](/problem/jump-game-ii), [Jump Game](/problem/jump-game), [Jump Game III](/problem/jump-game-iii)
