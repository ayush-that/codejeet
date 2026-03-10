---
title: "How to Solve Jump Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Jump Game. Medium difficulty, 40.5% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2026-03-27"
category: "dsa-patterns"
tags: ["jump-game", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Jump Game

You're given an array where each element tells you the maximum number of steps you can jump forward from that position. Starting at index 0, you need to determine if you can reach the last index. The challenge is that you don't need to take the maximum jump at each position—you can take any number of steps up to that maximum—which makes this a classic reachability problem with an elegant greedy solution.

## Visual Walkthrough

Let's trace through `nums = [2, 3, 1, 1, 4]` step by step:

1. **Start at index 0** with value 2. From here, we can reach indices 1 or 2.
2. **At index 1** with value 3. This is powerful! From index 1, we can reach indices 2, 3, or 4.
3. Since index 4 is the last index, we can already see a path exists: 0 → 1 → 4.

Now let's try a failing example: `nums = [3, 2, 1, 0, 4]`

1. **Start at index 0** with value 3. We can reach indices 1, 2, or 3.
2. **At index 1** with value 2. We can reach indices 2 or 3.
3. **At index 2** with value 1. We can only reach index 3.
4. **At index 3** with value 0. We're stuck! We can't move forward from here.
5. Since we can't reach index 4, this returns false.

The key insight: we don't need to track every possible path. We just need to know the farthest index we can reach at any point.

## Brute Force Approach

A naive approach would be to explore all possible jumps using recursion or BFS. At each position `i`, we could try every jump length from 1 to `nums[i]` and recursively check if we can reach the end from those positions.

This brute force solution has exponential time complexity—O(2ⁿ) in the worst case—because at each position we might branch into multiple recursive calls. For example, with `nums = [n, n-1, n-2, ..., 1]`, each position gives us many options to explore.

Even with memoization (DP), we'd get O(n²) time complexity, which is better but still not optimal. The DP approach would check for each position `i` whether any position `j` (where `j < i`) can reach `i`. While this works, we can do better with a greedy approach.

## Optimized Approach

The optimal solution uses a **greedy** approach with a single pass through the array. Here's the key insight:

**Maintain a variable `max_reach` that tracks the farthest index we can reach so far.** At each step:

1. If our current index exceeds `max_reach`, we're stuck and can't proceed
2. Otherwise, update `max_reach` to be the maximum of its current value and `i + nums[i]`
3. If at any point `max_reach >= last_index`, we know we can reach the end

Why does this work? Because if we can reach index `i`, then we can definitely reach all indices up to `max_reach`. We're essentially maintaining a "reachability frontier" that expands as we process each index within our current reach.

Think of it like this: we have a fuel tank (`max_reach`) that tells us how far we can go. At each station (index), we can refuel (update `max_reach`). If we ever run out of fuel before reaching the destination, we fail.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canJump(nums):
    """
    Determines if we can reach the last index of the array.

    Args:
        nums: List[int] - array where nums[i] represents maximum jump length from position i

    Returns:
        bool: True if last index is reachable, False otherwise
    """
    n = len(nums)
    max_reach = 0  # Tracks the farthest index we can reach so far

    # Iterate through each index in the array
    for i in range(n):
        # If current index is beyond our maximum reachable index, we're stuck
        if i > max_reach:
            return False

        # Update the farthest index we can reach from current position
        # i + nums[i] is the farthest index reachable from position i
        max_reach = max(max_reach, i + nums[i])

        # Early exit: if we can already reach or pass the last index
        if max_reach >= n - 1:
            return True

    # We've processed all indices and can reach the end
    return True
```

```javascript
// Time: O(n) | Space: O(1)
function canJump(nums) {
  /**
   * Determines if we can reach the last index of the array.
   *
   * @param {number[]} nums - array where nums[i] represents maximum jump length from position i
   * @return {boolean} - True if last index is reachable, False otherwise
   */
  const n = nums.length;
  let maxReach = 0; // Tracks the farthest index we can reach so far

  // Iterate through each index in the array
  for (let i = 0; i < n; i++) {
    // If current index is beyond our maximum reachable index, we're stuck
    if (i > maxReach) {
      return false;
    }

    // Update the farthest index we can reach from current position
    // i + nums[i] is the farthest index reachable from position i
    maxReach = Math.max(maxReach, i + nums[i]);

    // Early exit: if we can already reach or pass the last index
    if (maxReach >= n - 1) {
      return true;
    }
  }

  // We've processed all indices and can reach the end
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean canJump(int[] nums) {
        /**
         * Determines if we can reach the last index of the array.
         *
         * @param nums - array where nums[i] represents maximum jump length from position i
         * @return true if last index is reachable, false otherwise
         */
        int n = nums.length;
        int maxReach = 0;  // Tracks the farthest index we can reach so far

        // Iterate through each index in the array
        for (int i = 0; i < n; i++) {
            // If current index is beyond our maximum reachable index, we're stuck
            if (i > maxReach) {
                return false;
            }

            // Update the farthest index we can reach from current position
            // i + nums[i] is the farthest index reachable from position i
            maxReach = Math.max(maxReach, i + nums[i]);

            // Early exit: if we can already reach or pass the last index
            if (maxReach >= n - 1) {
                return true;
            }
        }

        // We've processed all indices and can reach the end
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations at each index
- The early exit condition doesn't change the worst-case complexity but improves average-case performance

**Space Complexity: O(1)**

- We only use a few integer variables (`max_reach`, loop counter, array length`)
- No additional data structures are needed

## Common Mistakes

1. **Starting max_reach at nums[0] instead of 0**: If you initialize `max_reach = nums[0]`, you'll fail on empty arrays or arrays with single elements. Starting at 0 is safer and handles edge cases better.

2. **Forgetting the `i > max_reach` check**: This is crucial! Without it, you might continue processing indices you can't actually reach, leading to incorrect updates of `max_reach`.

3. **Using the wrong comparison in the early exit**: Some candidates check `max_reach == n - 1` instead of `max_reach >= n - 1`. If we can jump beyond the last index, we've still successfully reached it.

4. **Overcomplicating with DP or BFS**: While these approaches work, they're suboptimal. The greedy O(n) solution is what interviewers expect for this problem.

## When You'll See This Pattern

This "maximum reach" or "greedy reachability" pattern appears in several related problems:

1. **Jump Game II** (LeetCode 45): Instead of just checking if we can reach the end, we need to find the minimum number of jumps. The solution uses a similar greedy approach but tracks jumps in segments.

2. **Jump Game III** (LeetCode 1306): Here you can jump forward or backward, and zeros are obstacles. This becomes a graph traversal problem (BFS/DFS) rather than a greedy one.

3. **Gas Station** (LeetCode 134): Similar cumulative reasoning—tracking whether you have enough "fuel" to complete a circuit.

4. **Maximum Subarray** (LeetCode 53): While different, it shares the "keep track of a running maximum" pattern.

The key is recognizing when you can make decisions greedily based on a running maximum or minimum, rather than needing to explore all possibilities.

## Key Takeaways

1. **Greedy can beat DP**: For reachability problems where you only care about "can I get there?" not "how did I get there?", a greedy approach with O(n) time and O(1) space often exists.

2. **Track the frontier**: Instead of tracking all possible paths, track the farthest point you can reach. If you can reach index `i`, you can reach all indices before it.

3. **Early validation is key**: Check `i > max_reach` at each step to ensure you haven't gotten stuck. This is the equivalent of checking if you have enough "fuel" to continue.

Remember: In coding interviews, always start by explaining the brute force approach, then optimize. For Jump Game, mention that you could use DP with O(n²) time, but the greedy O(n) solution is optimal.

Related problems: [Jump Game II](/problem/jump-game-ii), [Jump Game III](/problem/jump-game-iii), [Jump Game VII](/problem/jump-game-vii)
