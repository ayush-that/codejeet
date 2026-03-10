---
title: "How to Solve Frog Jump II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Frog Jump II. Medium difficulty, 62.4% acceptance rate. Topics: Array, Binary Search, Greedy."
date: "2028-12-25"
category: "dsa-patterns"
tags: ["frog-jump-ii", "array", "binary-search", "greedy", "medium"]
---

# How to Solve Frog Jump II

The Frog Jump II problem asks us to find the **minimum maximum jump distance** for a frog traveling from the first stone to the last stone and back again, visiting each stone at most once. The stones are sorted in strictly increasing order. What makes this problem interesting is that it's not about finding a path, but about minimizing the worst jump in a round trip where the frog must visit all stones in some order. This is essentially an optimization problem disguised as a path-finding challenge.

## Visual Walkthrough

Let's walk through a concrete example: `stones = [0, 2, 5, 6, 7]`

The frog starts at stone 0 and must reach stone 7 (the last stone), then return to stone 0, visiting each stone at most once. We need to minimize the **maximum jump distance** during this round trip.

Think about the optimal strategy: The frog wants to avoid large jumps. One effective approach is to skip stones strategically. For example:

- Going forward: 0 → 2 → 5 → 7 (jumps: 2, 3, 2)
- Returning: 7 → 6 → 0 (jumps: 1, 6)

The maximum jump here is 6 (from stone 6 back to stone 0). Can we do better?

What if we skip stone 6 on the way forward?

- Going forward: 0 → 2 → 7 (jumps: 2, 5)
- Returning: 7 → 6 → 5 → 0 (jumps: 1, 1, 5)

Now the maximum jump is 5. Even better!

The key insight: To minimize the maximum jump, we should skip stones in a way that breaks up large gaps. In fact, the optimal strategy is to **skip every other stone** on both the forward and return trips, which distributes the largest gaps across multiple jumps.

For our example with stones [0, 2, 5, 6, 7]:

- The gaps are: 2, 3, 1, 1
- If we skip stones strategically, the worst jump will be the maximum of either:
  - Consecutive gaps when we skip a stone (like 2+3=5 or 3+1=4)
  - Or individual gaps we can't avoid

By checking all possibilities, we find the minimum maximum jump is 5.

## Brute Force Approach

A brute force approach would try all possible sequences of stones for the forward trip (from first to last stone) and then determine the necessary return path. However, this is extremely inefficient:

1. For n stones, there are 2^(n-2) possible subsets of intermediate stones to visit on the forward trip (we must include first and last stones)
2. For each forward path, we need to compute the return path using the remaining stones
3. We'd track the maximum jump for each complete round trip

This leads to O(2^n) time complexity, which is infeasible for n up to 10^5 as in the problem constraints.

Even a dynamic programming approach that tries to track all possible states would be too slow because we need to consider both the forward and return paths and which stones have been visited.

## Optimized Approach

The key insight is that we don't need to try all possible paths. We can think about this problem differently:

1. The frog makes a round trip, so every stone (except possibly the endpoints) will be visited exactly once
2. The optimal strategy is to skip stones in a regular pattern to break up large gaps
3. Specifically, the worst jump will come from either:
   - Two consecutive gaps added together (when we skip a stone)
   - The largest individual gap we can't avoid

More formally: For stones at positions `stones[i]`, the gaps are `gaps[i] = stones[i+1] - stones[i]`. When the frog skips stone `i+1`, it jumps from stone `i` to stone `i+2`, covering distance `gaps[i] + gaps[i+1]`.

The optimal solution minimizes the maximum of:

- All these combined gaps (from skipping stones)
- Any particularly large individual gaps that must be taken

Through analysis, we find that the answer is simply the maximum of every other gap sum. That is:

```
answer = max(gaps[0] + gaps[1], gaps[1] + gaps[2], gaps[2] + gaps[3], ...)
```

But wait, we need to be careful about the endpoints and the return trip pattern.

Actually, the correct insight is: The minimum possible maximum jump is the maximum of the sums of every **second** gap. Why? Because in an optimal path, the frog will skip stones in a pattern that avoids taking two large gaps consecutively. The worst case will be when it has to take two gaps back-to-back (skipping the stone between them).

Let's test this on our example [0, 2, 5, 6, 7]:

- Gaps: [2, 3, 1, 1]
- Sum of every second gap starting from index 0: 2+1=3, 3+1=4 → max=4
- Sum of every second gap starting from index 1: 3+1=4 → max=4

But we know the answer should be 5! So this isn't quite right.

The correct formula is: We need to consider skipping stones, but we also must account for the fact that the frog makes a round trip. The optimal strategy is actually to skip every other stone on both legs of the journey. This means the worst jump will be the maximum of:

1. The largest gap when we don't skip (but we can often avoid the very largest gaps by skipping)
2. The sum of two consecutive gaps when we do skip

Through careful analysis (or solving for small cases), we discover that the answer is simply:

```
answer = max(stones[2] - stones[0], stones[3] - stones[1], ..., stones[n-1] - stones[n-3])
```

In other words, the maximum difference between stones that are two indices apart.

Why does this work? Because in an optimal path, the frog will alternate between taking single steps and double steps (skipping stones). The double steps create jumps of length `stones[i+2] - stones[i]`, and we want to minimize the largest of these.

## Optimal Solution

The optimal solution is surprisingly simple: We need to find the maximum distance between stones that are two positions apart in the sorted array. This works because:

1. The frog can plan its route to always take either single jumps or double jumps
2. By alternating single and double jumps appropriately, we can ensure no jump exceeds the maximum two-stone distance
3. We can't do better than this maximum because at some point, the frog will need to make a jump covering at least this distance

Here's the implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxJump(stones):
    """
    Calculate the minimum possible maximum jump distance for a frog
    making a round trip from first to last stone and back.

    The key insight is that the optimal strategy involves skipping stones
    in a pattern that minimizes the largest jump. The answer is simply
    the maximum distance between stones that are two indices apart.
    """
    n = len(stones)

    # If there are only 2 stones, the frog must jump between them twice
    # (forward and back), so the maximum jump is just the distance between them
    if n == 2:
        return stones[1] - stones[0]

    max_jump = 0

    # Check all jumps that skip exactly one stone
    # These represent potential "double jumps" the frog might need to make
    for i in range(2, n):
        # stones[i] - stones[i-2] is the distance if we skip stone i-1
        current_jump = stones[i] - stones[i - 2]
        max_jump = max(max_jump, current_jump)

    return max_jump
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate the minimum possible maximum jump distance for a frog
 * making a round trip from first to last stone and back.
 *
 * The key insight is that the optimal strategy involves skipping stones
 * in a pattern that minimizes the largest jump. The answer is simply
 * the maximum distance between stones that are two indices apart.
 */
function maxJump(stones) {
  const n = stones.length;

  // If there are only 2 stones, the frog must jump between them twice
  // (forward and back), so the maximum jump is just the distance between them
  if (n === 2) {
    return stones[1] - stones[0];
  }

  let maxJump = 0;

  // Check all jumps that skip exactly one stone
  // These represent potential "double jumps" the frog might need to make
  for (let i = 2; i < n; i++) {
    // stones[i] - stones[i-2] is the distance if we skip stone i-1
    const currentJump = stones[i] - stones[i - 2];
    maxJump = Math.max(maxJump, currentJump);
  }

  return maxJump;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Calculate the minimum possible maximum jump distance for a frog
     * making a round trip from first to last stone and back.
     *
     * The key insight is that the optimal strategy involves skipping stones
     * in a pattern that minimizes the largest jump. The answer is simply
     * the maximum distance between stones that are two indices apart.
     */
    public int maxJump(int[] stones) {
        int n = stones.length;

        // If there are only 2 stones, the frog must jump between them twice
        // (forward and back), so the maximum jump is just the distance between them
        if (n == 2) {
            return stones[1] - stones[0];
        }

        int maxJump = 0;

        // Check all jumps that skip exactly one stone
        // These represent potential "double jumps" the frog might need to make
        for (int i = 2; i < n; i++) {
            // stones[i] - stones[i-2] is the distance if we skip stone i-1
            int currentJump = stones[i] - stones[i - 2];
            maxJump = Math.max(maxJump, currentJump);
        }

        return maxJump;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the stones array once, checking each set of three consecutive stones (i, i-1, i-2)
- Each iteration does constant work: one subtraction and one max comparison
- With n stones, we make n-2 iterations → O(n)

**Space Complexity:** O(1)

- We only use a few integer variables (max_jump, loop counter)
- No additional data structures that grow with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Overcomplicating with pathfinding algorithms:** Candidates often try to use BFS/DFS or Dijkstra's algorithm to find the optimal path. This misses the key insight that the problem has a simple mathematical solution. Remember: when a problem seems complex, look for patterns in small examples.

2. **Forgetting the round trip requirement:** Some solutions only consider the forward journey from first to last stone. The frog must return to the first stone, which affects which stones can be skipped and when.

3. **Incorrect handling of small cases:** With only 2 stones, the frog jumps from stone 0 to stone 1 and back, so the maximum jump is simply the distance between them. With 3 stones [0, a, b], the optimal path is 0→b→a→0 or 0→a→b→0, and the maximum jump is max(b, b-a, a) which equals max(b, b-a). Our formula handles this correctly as max(stones[2]-stones[0]) = b.

4. **Off-by-one errors in the loop:** The loop should start at i=2 to access stones[i-2] safely. Starting at i=0 or i=1 would cause index errors or incorrect calculations.

## When You'll See This Pattern

This problem uses a **greedy optimization** pattern where we minimize a maximum value. Similar problems include:

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Binary search for the minimum capacity that allows shipping within D days. Like Frog Jump II, it's about minimizing a maximum (capacity per day vs. jump distance).

2. **Split Array Largest Sum (LeetCode 410)** - Minimize the largest sum among m subarrays. Again, we're minimizing a maximum value, often solved with binary search or dynamic programming.

3. **Minimize Maximum of Array (LeetCode 2439)** - Directly about minimizing the maximum value in an array through operations.

The pattern to recognize: When you need to **minimize the maximum** of something (jump distance, daily capacity, subarray sum), think about whether you can determine the answer through direct calculation (like here) or binary search (if you can test whether a candidate value works).

## Key Takeaways

1. **Min-max optimization problems often have simpler solutions than they appear.** Before implementing complex algorithms, test small cases to look for patterns. Here, the pattern was that the answer is simply the maximum distance between stones two indices apart.

2. **Round trip constraints can be counterintuitive.** The frog visiting stones at most once doesn't mean it visits all stones—it can skip stones strategically to minimize the worst jump. Thinking about what must happen (skipping stones creates double jumps) led to the solution.

3. **When stones/points are sorted, adjacent differences (gaps) often hold the key.** Many array problems become simpler when you consider differences between consecutive elements rather than the elements themselves.

Related problems: [Climbing Stairs](/problem/climbing-stairs), [Koko Eating Bananas](/problem/koko-eating-bananas)
