---
title: "How to Solve Jump Game II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Jump Game II. Medium difficulty, 42.5% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2026-05-27"
category: "dsa-patterns"
tags: ["jump-game-ii", "array", "dynamic-programming", "greedy", "medium"]
---

# How to Solve Jump Game II

You're given an array where each element tells you the maximum jump length from that position. Starting at index 0, you need to find the **minimum number of jumps** to reach the last index. The challenge is that you can't just greedily jump as far as possible each time — sometimes taking a shorter jump now sets you up for better future jumps. This problem tests your ability to balance immediate gains with long-term strategy.

## Visual Walkthrough

Let's trace through `nums = [2, 3, 1, 1, 4]` step by step:

**Initial state:** Position = 0, Jumps = 0

- From index 0, we can jump up to 2 steps (to index 1 or 2)
- We need to decide: jump to index 1 or index 2?

**Key insight:** At each step, we should consider not just where we can jump now, but where that jump will let us reach in the _next_ jump.

**Step-by-step reasoning:**

1. Start at index 0 (value 2). Our current "reach" is index 2.
2. We explore indices 1-2 to see which gives us the farthest _next_ reach:
   - Index 1 (value 3) can reach index 1+3 = 4
   - Index 2 (value 1) can reach index 2+1 = 3
3. Best choice: jump to index 1 (gives future reach to index 4)
4. Jump count = 1, now at index 1
5. From index 1 (value 3), we can reach index 4 directly
6. Jump count = 2, reached the end

The optimal path is: 0 → 1 → 4 (2 jumps), not 0 → 2 → 3 → 4 (3 jumps).

## Brute Force Approach

A naive approach would try all possible jump sequences using recursion or BFS:

```python
def jump(nums):
    def dfs(position):
        if position >= len(nums) - 1:
            return 0
        min_jumps = float('inf')
        for jump_len in range(1, nums[position] + 1):
            if position + jump_len < len(nums):
                min_jumps = min(min_jumps, 1 + dfs(position + jump_len))
        return min_jumps
    return dfs(0)
```

**Why this fails:**

- Time complexity: O(n^n) in worst case (each position can jump to many others)
- Space complexity: O(n) for recursion stack
- With `nums = [n, n-1, n-2, ..., 1]`, we'd explore exponentially many paths

Even with memoization (DP), we'd get O(n²) time, which is still too slow for n up to 10⁴.

## Optimized Approach

The key insight is **BFS with greedy selection**: Think of each "level" as how far you can reach with `k` jumps. At each step, you want to jump to the position that maximizes your _next_ reach.

**Algorithm:**

1. Track three variables:
   - `jumps`: number of jumps taken so far
   - `current_end`: farthest index reachable with `jumps` jumps
   - `farthest`: farthest index we can reach from positions in current "level"
2. Iterate through the array (except last element)
3. For each position, update `farthest` to be `max(farthest, i + nums[i])`
4. When we reach `current_end`, it's time to take another jump:
   - Increment `jumps`
   - Set `current_end = farthest`
   - If `current_end` already reaches last index, we're done

**Why this works:** We're essentially doing a BFS where each "level" represents all positions reachable with the same number of jumps. By always choosing the position that gives maximum future reach at each level, we minimize total jumps.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def jump(nums):
    """
    Find minimum jumps to reach last index using greedy BFS approach.

    Args:
        nums: List of integers representing max jump length at each position

    Returns:
        Minimum number of jumps to reach last index
    """
    n = len(nums)

    # Edge case: if array has only one element, we're already at the end
    if n <= 1:
        return 0

    jumps = 0          # Number of jumps taken
    current_end = 0    # Farthest index reachable with current number of jumps
    farthest = 0       # Farthest index we can reach from current "level"

    # We don't need to process the last element since we're already there
    for i in range(n - 1):
        # Update the farthest point we can reach from current position
        farthest = max(farthest, i + nums[i])

        # If we've reached the end of current "jump level"
        if i == current_end:
            jumps += 1          # Take another jump
            current_end = farthest  # Update reach for next level

            # Early exit: if we can already reach the end
            if current_end >= n - 1:
                break

    return jumps
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Find minimum jumps to reach last index using greedy BFS approach.
 * @param {number[]} nums - Array where nums[i] = max jump length from position i
 * @return {number} Minimum number of jumps to reach last index
 */
function jump(nums) {
  const n = nums.length;

  // Edge case: if array has only one element, we're already at the end
  if (n <= 1) {
    return 0;
  }

  let jumps = 0; // Number of jumps taken
  let currentEnd = 0; // Farthest index reachable with current number of jumps
  let farthest = 0; // Farthest index we can reach from current "level"

  // We don't need to process the last element since we're already there
  for (let i = 0; i < n - 1; i++) {
    // Update the farthest point we can reach from current position
    farthest = Math.max(farthest, i + nums[i]);

    // If we've reached the end of current "jump level"
    if (i === currentEnd) {
      jumps++; // Take another jump
      currentEnd = farthest; // Update reach for next level

      // Early exit: if we can already reach the end
      if (currentEnd >= n - 1) {
        break;
      }
    }
  }

  return jumps;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Find minimum jumps to reach last index using greedy BFS approach.
     * @param nums Array where nums[i] = max jump length from position i
     * @return Minimum number of jumps to reach last index
     */
    public int jump(int[] nums) {
        int n = nums.length;

        // Edge case: if array has only one element, we're already at the end
        if (n <= 1) {
            return 0;
        }

        int jumps = 0;          // Number of jumps taken
        int currentEnd = 0;     // Farthest index reachable with current number of jumps
        int farthest = 0;       // Farthest index we can reach from current "level"

        // We don't need to process the last element since we're already there
        for (int i = 0; i < n - 1; i++) {
            // Update the farthest point we can reach from current position
            farthest = Math.max(farthest, i + nums[i]);

            // If we've reached the end of current "jump level"
            if (i == currentEnd) {
                jumps++;               // Take another jump
                currentEnd = farthest; // Update reach for next level

                // Early exit: if we can already reach the end
                if (currentEnd >= n - 1) {
                    break;
                }
            }
        }

        return jumps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once
- Each iteration does constant work (comparisons and updates)
- The early exit optimization doesn't change worst-case but helps average case

**Space Complexity: O(1)**

- We only use three integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Greedily jumping to the farthest position each time**
   - Example: `[2, 5, 1, 1, 1, 1]`
   - Greedy farthest-first: 0→2→3→4→5 (4 jumps)
   - Optimal: 0→1→5 (2 jumps)
   - **Fix:** Consider future reach, not just current jump distance

2. **Off-by-one errors with loop boundaries**
   - Looping `for i in range(n)` instead of `n-1` causes unnecessary checks
   - When `i == n-1`, we're already at destination
   - **Fix:** Remember we don't need to process the last element

3. **Forgetting the single-element edge case**
   - `nums = [0]` should return 0, not cause an error
   - **Fix:** Check `if len(nums) <= 1: return 0` at the start

4. **Incorrect initialization of `current_end`**
   - Starting with `current_end = nums[0]` instead of 0
   - This misses the case where we need to take the first jump
   - **Fix:** Initialize `current_end = 0` and let the loop handle first jump

## When You'll See This Pattern

This "greedy BFS" or "level-order greedy" pattern appears in problems where you need to minimize steps while having multiple choices at each step:

1. **Jump Game I** (LeetCode 55) - Simpler version asking if reaching the end is possible
   - Uses similar farthest-reach tracking but without counting jumps

2. **Minimum Number of Taps to Open to Water a Garden** (LeetCode 1326)
   - Same core idea: intervals represent reach, find minimum to cover range

3. **Video Stitching** (LeetCode 1024)
   - Almost identical structure: clips = jumps, need minimum to cover time

4. **Gas Station Problems** - Where you need to determine reachability with constraints

## Key Takeaways

1. **Think in levels for minimum path problems**: When you need the shortest number of steps in a graph where nodes have varying edge lengths, BFS with level tracking often works better than DFS.

2. **Greedy can be optimal with the right metric**: Instead of maximizing immediate gain (jump distance), maximize future potential (where you can reach after this jump).

3. **The loop boundary trick**: When processing arrays in a greedy manner, you often don't need to process the last element since you're checking if you _can reach_ it, not what you can do from it.

**Related problems:** [Jump Game](/problem/jump-game), [Jump Game III](/problem/jump-game-iii), [Jump Game VII](/problem/jump-game-vii)
