---
title: "How to Solve Jump Game IX — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Jump Game IX. Medium difficulty, 23.8% acceptance rate. Topics: Array, Dynamic Programming."
date: "2030-01-24"
category: "dsa-patterns"
tags: ["jump-game-ix", "array", "dynamic-programming", "medium"]
---

# How to Solve Jump Game IX

This problem asks us to determine, for each index in an array, whether we can reach the end of the array through a series of constrained jumps. The tricky part is that jump direction determines the value comparison: you can only jump forward to smaller values or backward to larger values. This creates a complex dependency between positions that requires careful analysis.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 1, 4, 2]`. We want to know for each index if we can reach the last index (index 3).

**Index 0 (value 3):**

- Can jump forward to index 1 (value 1) since 1 < 3 ✓
- From index 1, can jump forward to index 2 (value 4) since 4 > 1? No, forward jumps require smaller values
- From index 1, can jump backward to index 0 (value 3) since 3 > 1? Yes, but that's a cycle
- Can jump forward to index 3 (value 2) since 2 < 3 ✓
- **Result:** Can reach index 3 directly

**Index 1 (value 1):**

- Can jump forward to index 2 (value 4) since 4 > 1? No, forward jumps require smaller values
- Can jump forward to index 3 (value 2) since 2 > 1? No, same reason
- Can jump backward to index 0 (value 3) since 3 > 1 ✓
- From index 0, we already know we can reach index 3
- **Result:** Can reach index 3 through index 0

**Index 2 (value 4):**

- Can jump forward to index 3 (value 2) since 2 < 4 ✓
- **Result:** Can reach index 3 directly

**Index 3 (value 2):**

- Already at the end
- **Result:** Can reach index 3 (trivially)

So the answer would be `[True, True, True, True]`.

This manual tracing reveals the challenge: each position's reachability depends on other positions' reachability, creating a graph-like dependency. A naive recursive check would be exponential.

## Brute Force Approach

The most straightforward approach is to perform DFS from each index, exploring all possible jump paths until we either reach the end or exhaust all possibilities.

**Why this fails:**

1. **Exponential time complexity:** Each index can potentially jump to many other indices, leading to O(n!) worst-case time
2. **Redundant computation:** We recompute reachability for the same indices multiple times
3. **Cycles:** The jump rules allow cycles (jumping back and forth between indices), which could cause infinite recursion without proper cycle detection

Even with memoization, the brute force approach would be O(n²) in the worst case, which is too slow for typical constraints (n up to 10⁵).

## Optimized Approach

The key insight is that we can process indices in a specific order to break the circular dependencies. Notice that:

1. From any index `i`, if we can jump forward to some `j > i` where `nums[j] < nums[i]`, then `i`'s reachability depends on `j`'s reachability
2. Similarly, if we can jump backward to some `k < i` where `nums[k] > nums[i]`, then `i`'s reachability depends on `k`'s reachability

We can solve this using **dynamic programming with monotonic stacks**:

- Process indices from right to left for forward jumps (smaller values to the right)
- Process indices from left to right for backward jumps (larger values to the left)
- Use a stack to efficiently find the next index in each direction that satisfies the jump condition

**Step-by-step reasoning:**

1. Initialize `dp` array where `dp[i] = True` only if `i == n-1` (the last index is always reachable)
2. For forward jumps (rightward, to smaller values):
   - Process indices from right to left
   - Use a decreasing monotonic stack to find the next smaller element to the right
   - If we find such an element and it's reachable (`dp[j] == True`), then current index becomes reachable
3. For backward jumps (leftward, to larger values):
   - Process indices from left to right
   - Use an increasing monotonic stack to find the next larger element to the left
   - If we find such an element and it's reachable, then current index becomes reachable
4. Some indices might need both passes to become reachable, so we iterate until no changes occur

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def canReach(nums):
    """
    Determines for each index if the end of the array can be reached
    using the jump rules: forward to smaller values, backward to larger values.
    """
    n = len(nums)
    if n == 0:
        return []

    # dp[i] = True if we can reach the last index from index i
    dp = [False] * n
    dp[n-1] = True  # Last index is always reachable

    changed = True
    # We may need multiple passes because reachability can propagate
    # in both directions (forward then backward, or vice versa)
    while changed:
        changed = False

        # Pass 1: Check forward jumps (to smaller values on the right)
        stack = []
        for i in range(n-1, -1, -1):
            # While stack has elements and current value <= top of stack,
            # pop from stack (we want next smaller element)
            while stack and nums[i] <= nums[stack[-1]]:
                stack.pop()

            # If stack has an element, it's the next smaller to the right
            if stack and dp[stack[-1]]:
                if not dp[i]:  # Only update if not already True
                    dp[i] = True
                    changed = True

            # Push current index to stack
            stack.append(i)

        # Pass 2: Check backward jumps (to larger values on the left)
        stack = []
        for i in range(n):
            # While stack has elements and current value >= top of stack,
            # pop from stack (we want next larger element)
            while stack and nums[i] >= nums[stack[-1]]:
                stack.pop()

            # If stack has an element, it's the next larger to the left
            if stack and dp[stack[-1]]:
                if not dp[i]:  # Only update if not already True
                    dp[i] = True
                    changed = True

            # Push current index to stack
            stack.append(i)

    return dp
```

```javascript
// Time: O(n) | Space: O(n)
function canReach(nums) {
  /**
   * Determines for each index if the end of the array can be reached
   * using the jump rules: forward to smaller values, backward to larger values.
   */
  const n = nums.length;
  if (n === 0) return [];

  // dp[i] = true if we can reach the last index from index i
  const dp = new Array(n).fill(false);
  dp[n - 1] = true; // Last index is always reachable

  let changed = true;
  // We may need multiple passes because reachability can propagate
  // in both directions (forward then backward, or vice versa)
  while (changed) {
    changed = false;

    // Pass 1: Check forward jumps (to smaller values on the right)
    const stack1 = [];
    for (let i = n - 1; i >= 0; i--) {
      // While stack has elements and current value <= top of stack,
      // pop from stack (we want next smaller element)
      while (stack1.length > 0 && nums[i] <= nums[stack1[stack1.length - 1]]) {
        stack1.pop();
      }

      // If stack has an element, it's the next smaller to the right
      if (stack1.length > 0 && dp[stack1[stack1.length - 1]]) {
        if (!dp[i]) {
          // Only update if not already true
          dp[i] = true;
          changed = true;
        }
      }

      // Push current index to stack
      stack1.push(i);
    }

    // Pass 2: Check backward jumps (to larger values on the left)
    const stack2 = [];
    for (let i = 0; i < n; i++) {
      // While stack has elements and current value >= top of stack,
      // pop from stack (we want next larger element)
      while (stack2.length > 0 && nums[i] >= nums[stack2[stack2.length - 1]]) {
        stack2.pop();
      }

      // If stack has an element, it's the next larger to the left
      if (stack2.length > 0 && dp[stack2[stack2.length - 1]]) {
        if (!dp[i]) {
          // Only update if not already true
          dp[i] = true;
          changed = true;
        }
      }

      // Push current index to stack
      stack2.push(i);
    }
  }

  return dp;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public List<Boolean> canReach(int[] nums) {
        /**
         * Determines for each index if the end of the array can be reached
         * using the jump rules: forward to smaller values, backward to larger values.
         */
        int n = nums.length;
        List<Boolean> result = new ArrayList<>();
        if (n == 0) return result;

        // dp[i] = true if we can reach the last index from index i
        boolean[] dp = new boolean[n];
        dp[n-1] = true;  // Last index is always reachable

        boolean changed = true;
        // We may need multiple passes because reachability can propagate
        // in both directions (forward then backward, or vice versa)
        while (changed) {
            changed = false;

            // Pass 1: Check forward jumps (to smaller values on the right)
            Deque<Integer> stack1 = new ArrayDeque<>();
            for (int i = n - 1; i >= 0; i--) {
                // While stack has elements and current value <= top of stack,
                // pop from stack (we want next smaller element)
                while (!stack1.isEmpty() && nums[i] <= nums[stack1.peek()]) {
                    stack1.pop();
                }

                // If stack has an element, it's the next smaller to the right
                if (!stack1.isEmpty() && dp[stack1.peek()]) {
                    if (!dp[i]) {  // Only update if not already true
                        dp[i] = true;
                        changed = true;
                    }
                }

                // Push current index to stack
                stack1.push(i);
            }

            // Pass 2: Check backward jumps (to larger values on the left)
            Deque<Integer> stack2 = new ArrayDeque<>();
            for (int i = 0; i < n; i++) {
                // While stack has elements and current value >= top of stack,
                // pop from stack (we want next larger element)
                while (!stack2.isEmpty() && nums[i] >= nums[stack2.peek()]) {
                    stack2.pop();
                }

                // If stack has an element, it's the next larger to the left
                if (!stack2.isEmpty() && dp[stack2.peek()]) {
                    if (!dp[i]) {  // Only update if not already true
                        dp[i] = true;
                        changed = true;
                    }
                }

                // Push current index to stack
                stack2.push(i);
            }
        }

        // Convert boolean array to List<Boolean>
        for (boolean val : dp) {
            result.add(val);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each index is processed exactly twice per pass (once in forward pass, once in backward pass)
- Each index is pushed and popped from the stacks at most once
- The while loop typically converges in 1-2 passes for most inputs
- Overall linear time in the size of the input array

**Space Complexity: O(n)**

- We store the `dp` array of size n
- We use two stacks that collectively store at most n elements
- No recursion stack overhead

## Common Mistakes

1. **Infinite loop detection:** Forgetting that jumps can create cycles and not implementing proper termination conditions. The solution uses a `changed` flag to ensure we stop when no more updates occur.

2. **Wrong stack comparison direction:** Mixing up when to use `<=` vs `>=` in stack comparisons. Remember: for forward jumps (rightward), we want the next smaller element, so we pop while `current >= stack.top()`. For backward jumps (leftward), we want the next larger element, so we pop while `current <= stack.top()`.

3. **Single pass assumption:** Trying to solve in one pass when reachability might need to propagate in both directions. Some indices become reachable only after processing both directions, hence the need for multiple passes.

4. **Not starting from the end:** The problem asks if we can reach the last index, so we should work backward from that known reachable point. Starting from arbitrary positions makes the logic much more complex.

## When You'll See This Pattern

This problem combines **monotonic stacks** with **reachability propagation**, a pattern seen in:

1. **Jump Game II (LeetCode 45):** Similar reachability problem but with simpler jump rules
2. **Next Greater Element (LeetCode 496):** Uses monotonic stacks to find next larger/smaller elements
3. **Trapping Rain Water (LeetCode 42):** Uses similar two-pass processing with monotonic elements
4. **Largest Rectangle in Histogram (LeetCode 84):** Classic monotonic stack problem for finding boundaries

The key insight is recognizing when you need to find the "next element satisfying some condition" efficiently, which is where monotonic stacks excel.

## Key Takeaways

1. **Monotonic stacks efficiently find next greater/smaller elements:** When you need to find the next element to the left or right that satisfies a comparison condition, consider using a monotonic stack for O(n) time.

2. **Reachability problems often work backward from the goal:** Starting from the known reachable state (the end) and propagating backward is often more efficient than exploring forward from each starting point.

3. **Some DP problems need multiple passes:** When dependencies can form cycles or propagate in multiple directions, a single pass might not be sufficient. Using a convergence loop (while changes occur) can handle these cases.

[Practice this problem on CodeJeet](/problem/jump-game-ix)
