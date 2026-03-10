---
title: "How to Solve Earliest Second to Mark Indices I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Earliest Second to Mark Indices I. Medium difficulty, 36.5% acceptance rate. Topics: Array, Binary Search."
date: "2026-05-03"
category: "dsa-patterns"
tags: ["earliest-second-to-mark-indices-i", "array", "binary-search", "medium"]
---

# How to Solve Earliest Second to Mark Indices I

This problem asks us to find the earliest second when we can mark all indices of an array, given constraints on when we can mark each index and when we can reduce values. The tricky part is balancing two competing actions: reducing values at specific indices versus marking them, all within a strict time sequence.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `nums = [2, 1, 3]` (n = 3)
- `changeIndices = [2, 2, 2, 2, 3, 2, 3]` (m = 7)

We need to mark all 3 indices. Each index `i` requires `nums[i]` to be 0 before marking, and we can only mark index `i` at seconds when `changeIndices[s-1] == i`.

**Step-by-step reasoning:**

Second 1: `changeIndices[0] = 2`

- We can either reduce `nums[2]` from 3 to 2, or mark index 2 if `nums[2] == 0`
- Since `nums[2] = 3 ≠ 0`, we can only reduce it

Second 2: `changeIndices[1] = 2`

- Reduce `nums[2]` from 2 to 1

Second 3: `changeIndices[2] = 2`

- Reduce `nums[2]` from 1 to 0

Second 4: `changeIndices[3] = 2`

- Now `nums[2] = 0`, so we can mark index 2

Second 5: `changeIndices[4] = 3`

- Reduce `nums[3]` from 3 to 2

Second 6: `changeIndices[5] = 2`

- Index 2 is already marked, so we can reduce some other value
- Let's reduce `nums[1]` from 1 to 0

Second 7: `changeIndices[6] = 3`

- Reduce `nums[3]` from 2 to 1
- But wait, we haven't marked index 1 yet, and we're out of time!

We failed at second 7. Let's try a different strategy:

Second 1-3: Same as before (reduce index 2 to 0)
Second 4: Mark index 2
Second 5: Reduce index 3 from 3 to 2
Second 6: Reduce index 1 from 1 to 0
Second 7: Mark index 1 (but index 3 still isn't 0!)

We need to be smarter. The key insight: we need to plan backwards from marking opportunities.

## Brute Force Approach

A brute force approach would try all possible seconds from 1 to m and check if we can mark all indices by that second. For each candidate second, we would simulate the process:

1. Track remaining reductions needed for each index
2. At each second, decide whether to reduce or mark
3. Check if all indices get marked by the candidate second

The simulation would require trying all possible decision sequences at each second, leading to exponential time complexity. Even a greedy simulation (always mark when possible, otherwise reduce) might not find the optimal sequence, as we saw in our example.

**Why brute force fails:**

- Checking a single candidate second requires O(2^m) decisions in worst case
- Checking all m candidates gives O(m × 2^m), which is infeasible
- The greedy "mark as soon as possible" approach doesn't always work because we might need to save reduction opportunities for harder indices

## Optimized Approach

The key insight is that we can use **binary search** on the answer combined with **greedy validation**.

**Why binary search works:**

- If we can mark all indices by second X, we can certainly mark them by any later second Y > X
- If we cannot mark all indices by second X, we cannot mark them by any earlier second Y < X
- This monotonic property allows binary search

**The validation function (canMarkByTime):**
Given a candidate time `t`, we need to check if we can mark all indices within the first `t` seconds. We work backwards from `t` to 1:

1. Track the last occurrence of each index in `changeIndices[0:t]`
2. As we move backwards through time:
   - If current second is the last occurrence of some index `i`, we "reserve" this second for marking `i`
   - Otherwise, we accumulate "free time" that can be used for reduction
3. For each index `i`, we need `nums[i] + 1` total actions: `nums[i]` reductions + 1 marking
4. When we reach the marking second for index `i`, we check if we have accumulated enough free time for the required reductions

**Why backwards greedy works:**

- Working backwards ensures we use the latest possible marking opportunity for each index
- This leaves maximum free time before each marking for reductions
- The greedy allocation of free time to the most "expensive" indices first is optimal

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O((m + n) * log m) | Space: O(n)
def earliestSecondToMarkIndices(nums, changeIndices):
    n, m = len(nums), len(changeIndices)

    # Helper function to check if we can mark all indices by time 't'
    def canMarkByTime(t):
        # last_seen[i] stores the last occurrence (1-indexed) of index i+1 before time t
        last_seen = [-1] * n
        for s in range(t):
            idx = changeIndices[s] - 1  # Convert to 0-index
            last_seen[idx] = s + 1  # Store as 1-indexed second

        # If any index doesn't appear in first t seconds, impossible
        if any(last == -1 for last in last_seen):
            return False

        marked = 0  # Count of marked indices
        free_time = 0  # Accumulated free seconds for reductions

        # Process seconds in reverse order
        for s in range(t, 0, -1):
            idx = changeIndices[s-1] - 1  # Current index (0-indexed)

            # If this is the last occurrence of this index
            if last_seen[idx] == s:
                # We need to mark this index at second s
                if free_time >= nums[idx]:
                    # We have enough free time for reductions
                    free_time -= nums[idx]
                    marked += 1
                else:
                    # Not enough free time for required reductions
                    return False
            else:
                # This is not a marking second, so it's free time for reductions
                free_time += 1

        # Success if we marked all indices
        return marked == n

    # Binary search for the earliest second
    left, right = 1, m
    answer = -1

    while left <= right:
        mid = left + (right - left) // 2

        if canMarkByTime(mid):
            # Try to find earlier time
            answer = mid
            right = mid - 1
        else:
            # Need more time
            left = mid + 1

    return answer
```

```javascript
// Time: O((m + n) * log m) | Space: O(n)
function earliestSecondToMarkIndices(nums, changeIndices) {
  const n = nums.length,
    m = changeIndices.length;

  // Helper function to check if we can mark all indices by time 't'
  const canMarkByTime = (t) => {
    // lastSeen[i] stores the last occurrence (1-indexed) of index i+1 before time t
    const lastSeen = new Array(n).fill(-1);
    for (let s = 0; s < t; s++) {
      const idx = changeIndices[s] - 1; // Convert to 0-index
      lastSeen[idx] = s + 1; // Store as 1-indexed second
    }

    // If any index doesn't appear in first t seconds, impossible
    if (lastSeen.some((last) => last === -1)) {
      return false;
    }

    let marked = 0; // Count of marked indices
    let freeTime = 0; // Accumulated free seconds for reductions

    // Process seconds in reverse order
    for (let s = t; s >= 1; s--) {
      const idx = changeIndices[s - 1] - 1; // Current index (0-indexed)

      // If this is the last occurrence of this index
      if (lastSeen[idx] === s) {
        // We need to mark this index at second s
        if (freeTime >= nums[idx]) {
          // We have enough free time for reductions
          freeTime -= nums[idx];
          marked++;
        } else {
          // Not enough free time for required reductions
          return false;
        }
      } else {
        // This is not a marking second, so it's free time for reductions
        freeTime++;
      }
    }

    // Success if we marked all indices
    return marked === n;
  };

  // Binary search for the earliest second
  let left = 1,
    right = m;
  let answer = -1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (canMarkByTime(mid)) {
      // Try to find earlier time
      answer = mid;
      right = mid - 1;
    } else {
      // Need more time
      left = mid + 1;
    }
  }

  return answer;
}
```

```java
// Time: O((m + n) * log m) | Space: O(n)
class Solution {
    public int earliestSecondToMarkIndices(int[] nums, int[] changeIndices) {
        int n = nums.length, m = changeIndices.length;

        // Binary search for the earliest second
        int left = 1, right = m;
        int answer = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canMarkByTime(nums, changeIndices, mid)) {
                // Try to find earlier time
                answer = mid;
                right = mid - 1;
            } else {
                // Need more time
                left = mid + 1;
            }
        }

        return answer;
    }

    // Helper function to check if we can mark all indices by time 't'
    private boolean canMarkByTime(int[] nums, int[] changeIndices, int t) {
        int n = nums.length;
        // lastSeen[i] stores the last occurrence (1-indexed) of index i+1 before time t
        int[] lastSeen = new int[n];
        Arrays.fill(lastSeen, -1);

        for (int s = 0; s < t; s++) {
            int idx = changeIndices[s] - 1;  // Convert to 0-index
            lastSeen[idx] = s + 1;  // Store as 1-indexed second
        }

        // If any index doesn't appear in first t seconds, impossible
        for (int last : lastSeen) {
            if (last == -1) return false;
        }

        int marked = 0;  // Count of marked indices
        int freeTime = 0;  // Accumulated free seconds for reductions

        // Process seconds in reverse order
        for (int s = t; s >= 1; s--) {
            int idx = changeIndices[s - 1] - 1;  // Current index (0-indexed)

            // If this is the last occurrence of this index
            if (lastSeen[idx] == s) {
                // We need to mark this index at second s
                if (freeTime >= nums[idx]) {
                    // We have enough free time for reductions
                    freeTime -= nums[idx];
                    marked++;
                } else {
                    // Not enough free time for required reductions
                    return false;
                }
            } else {
                // This is not a marking second, so it's free time for reductions
                freeTime++;
            }
        }

        // Success if we marked all indices
        return marked == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O((m + n) × log m)**

- Binary search runs O(log m) times
- Each validation call `canMarkByTime` takes O(m + n):
  - O(m) to build `last_seen` array
  - O(m) to process seconds in reverse
  - O(n) to check if any index is missing
- Total: O((m + n) × log m)

**Space Complexity: O(n)**

- We need O(n) space for the `last_seen` array
- Other variables use O(1) additional space

## Common Mistakes

1. **1-indexing confusion**: Forgetting to convert between 1-indexed problem indices and 0-indexed array indices. Always subtract 1 when accessing arrays with problem indices.

2. **Forward greedy approach**: Trying to process seconds from 1 to t and mark as soon as possible. This doesn't work because it might use early reduction opportunities on easy indices, leaving insufficient time for hard ones.

3. **Missing the monotonic property**: Not recognizing that binary search applies. If you can mark by time X, you can definitely mark by any time Y > X (just ignore extra seconds).

4. **Incorrect reduction counting**: Forgetting that marking itself takes 1 second in addition to the `nums[i]` reduction seconds. Each index needs `nums[i] + 1` total seconds allocated.

## When You'll See This Pattern

This problem combines binary search with greedy validation, a pattern seen in many optimization problems:

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Binary search on shipping capacity with greedy validation of whether packages can be shipped within D days.

2. **Split Array Largest Sum (LeetCode 410)**: Binary search on the maximum subarray sum with greedy validation of whether the array can be split into k parts.

3. **Koko Eating Bananas (LeetCode 875)**: Binary search on eating speed with validation of whether Koko can finish all bananas within h hours.

The common theme: when you need to find the minimum/maximum value satisfying a condition, and validation of a candidate value can be done efficiently, binary search is often the solution.

## Key Takeaways

1. **Binary search on the answer** is powerful when you have a monotonic condition (if X works, then Y > X also works).

2. **Backwards greedy allocation** is often optimal for scheduling problems with deadlines. Process from the end to ensure you meet the tightest constraints first.

3. **Break complex problems into parts**: First design a validation function for a candidate solution, then use binary search to find the optimal solution.

[Practice this problem on CodeJeet](/problem/earliest-second-to-mark-indices-i)
