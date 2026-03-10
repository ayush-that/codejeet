---
title: "How to Solve Race Car — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Race Car. Hard difficulty, 44.6% acceptance rate. Topics: Dynamic Programming."
date: "2027-05-12"
category: "dsa-patterns"
tags: ["race-car", "dynamic-programming", "hard"]
---

# How to Solve Race Car

You need to reach a target position on an infinite number line starting from position 0 with speed +1. You can only accelerate (which moves you forward by your current speed and doubles your speed) or reverse (which changes direction without moving, setting speed to ±1 based on your new direction). The challenge is finding the minimum number of instructions to reach exactly the target position. This problem is tricky because the optimal sequence isn't obvious — sometimes you need to overshoot and come back, and the exponential growth of speed makes brute force search intractable.

## Visual Walkthrough

Let's trace through target = 3 to build intuition:

**Initial state:** position = 0, speed = 1

**Option 1: Try accelerating straight there**

- Instruction 1: 'A' → position = 0 + 1 = 1, speed = 2
- Instruction 2: 'A' → position = 1 + 2 = 3, speed = 4 → reached target!

So with just 2 'A's we reach position 3. But what if the target is 6?

**Target = 6:**

- 'A' → pos=1, speed=2
- 'A' → pos=3, speed=4
- 'A' → pos=7, speed=8 → overshot!

Now we're at position 7, past the target 6. We need to reverse:

- 'R' → pos=7, speed=-1 (direction reversed)
- 'A' → pos=6, speed=-2 → reached!

Total: 5 instructions (AAA R A). But is this optimal? Maybe we could reverse earlier. This shows the core challenge: deciding when to reverse and in which direction.

## Brute Force Approach

A naive approach would explore all possible instruction sequences using BFS. Each state is (position, speed), and from each state we have 2 moves: 'A' or 'R'. We'd explore until we reach the target.

Why this fails:

1. **Infinite state space**: Positions extend infinitely in both directions
2. **Exponential blowup**: Each state branches to 2 new states → O(2^n) where n is instruction count
3. **No bounds**: Without clever pruning, BFS would explore millions of states even for moderate targets

Even with memoization, the state space is too large because position values can be huge. We need a smarter approach that leverages the structure of the problem.

## Optimized Approach

The key insight: **We should think in terms of distance traveled rather than absolute position**. Since we start at 0, the target is just a distance to cover.

**Observation 1**: When we accelerate k times consecutively, we travel: 1 + 2 + 4 + ... + 2^(k-1) = 2^k - 1 positions. So after k 'A's, we're at position 2^k - 1 with speed 2^k.

**Observation 2**: There are three main scenarios:

1. **Exactly reachable**: If target = 2^n - 1 for some n, we can just accelerate n times
2. **Overshoot and return**: Go past target (2^n - 1 > target), reverse, then approach from the other side
3. **Reverse before reaching**: Go to 2^(n-1) - 1, reverse, go back some distance, reverse again, then continue toward target

**Dynamic Programming formulation**: Let dp[t] = minimum instructions to reach position t. For each t, we consider:

- Find smallest n where 2^n - 1 >= t (overshoot case)
- Option A: Go to 2^n - 1, reverse, solve for remaining distance: n + 1 + dp[(2^n - 1) - t]
- Option B: Go to 2^(n-1) - 1, reverse, go back m steps (0 ≤ m < n-1), reverse again, then continue to t

The second option handles cases where it's better to reverse before reaching the overshoot point. We try all possible m values to find the minimum.

## Optimal Solution

We use dynamic programming with memoization. The recurrence considers both overshooting and reversing early strategies.

<div class="code-group">

```python
# Time: O(T log T) where T is target | Space: O(T)
class Solution:
    def racecar(self, target: int) -> int:
        # dp[t] stores minimum instructions to reach position t
        dp = [0] * (target + 1)

        for t in range(1, target + 1):
            # Find n such that 2^n - 1 >= t
            n = t.bit_length()  # Smallest n where 2^n > t

            # Case 1: Exact match - we can reach t with n 'A's
            if (1 << n) - 1 == t:
                dp[t] = n
                continue

            # Case 2: Overshoot then reverse
            # Go to 2^n - 1 (past target), reverse once, then solve remaining distance
            # Instructions: n 'A's + 1 'R' + dp[overshoot - t]
            overshoot = (1 << n) - 1
            dp[t] = n + 1 + dp[overshoot - t]

            # Case 3: Reverse before reaching overshoot point
            # Go to 2^(n-1) - 1, reverse, go back m 'A's, reverse again, then continue to t
            # We try all possible m values from 0 to n-2
            for m in range(n - 1):
                # Position after first reverse: 2^(n-1) - 1
                # After going back m 'A's: 2^(n-1) - 1 - (2^m - 1) = 2^(n-1) - 2^m
                # Remaining distance to target: t - (2^(n-1) - 2^m)
                come_back = (1 << (n - 1)) - 1
                distance_back = (1 << m) - 1
                remaining = t - (come_back - distance_back)

                # Total instructions:
                # (n-1) 'A's + 1 'R' + m 'A's + 1 'R' + dp[remaining]
                dp[t] = min(dp[t], n + m + 1 + 1 + dp[remaining])

        return dp[target]
```

```javascript
// Time: O(T log T) where T is target | Space: O(T)
var racecar = function (target) {
  // dp[t] stores minimum instructions to reach position t
  const dp = new Array(target + 1).fill(0);

  for (let t = 1; t <= target; t++) {
    // Find n such that 2^n - 1 >= t
    const n = Math.ceil(Math.log2(t + 1));

    // Case 1: Exact match - we can reach t with n 'A's
    if (Math.pow(2, n) - 1 === t) {
      dp[t] = n;
      continue;
    }

    // Case 2: Overshoot then reverse
    // Go to 2^n - 1 (past target), reverse once, then solve remaining distance
    const overshoot = Math.pow(2, n) - 1;
    dp[t] = n + 1 + dp[overshoot - t];

    // Case 3: Reverse before reaching overshoot point
    // Go to 2^(n-1) - 1, reverse, go back m 'A's, reverse again, then continue to t
    for (let m = 0; m < n - 1; m++) {
      const comeBack = Math.pow(2, n - 1) - 1;
      const distanceBack = Math.pow(2, m) - 1;
      const remaining = t - (comeBack - distanceBack);

      // Total instructions:
      // (n-1) 'A's + 1 'R' + m 'A's + 1 'R' + dp[remaining]
      dp[t] = Math.min(dp[t], n + m + 1 + 1 + dp[remaining]);
    }
  }

  return dp[target];
};
```

```java
// Time: O(T log T) where T is target | Space: O(T)
class Solution {
    public int racecar(int target) {
        // dp[t] stores minimum instructions to reach position t
        int[] dp = new int[target + 1];

        for (int t = 1; t <= target; t++) {
            // Find n such that 2^n - 1 >= t
            int n = 32 - Integer.numberOfLeadingZeros(t);

            // Case 1: Exact match - we can reach t with n 'A's
            if ((1 << n) - 1 == t) {
                dp[t] = n;
                continue;
            }

            // Case 2: Overshoot then reverse
            // Go to 2^n - 1 (past target), reverse once, then solve remaining distance
            int overshoot = (1 << n) - 1;
            dp[t] = n + 1 + dp[overshoot - t];

            // Case 3: Reverse before reaching overshoot point
            // Go to 2^(n-1) - 1, reverse, go back m 'A's, reverse again, then continue to t
            for (int m = 0; m < n - 1; m++) {
                int comeBack = (1 << (n - 1)) - 1;
                int distanceBack = (1 << m) - 1;
                int remaining = t - (comeBack - distanceBack);

                // Total instructions:
                // (n-1) 'A's + 1 'R' + m 'A's + 1 'R' + dp[remaining]
                dp[t] = Math.min(dp[t], n + m + 1 + 1 + dp[remaining]);
            }
        }

        return dp[target];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(T log T) where T is the target value. For each position t from 1 to T, we:

1. Calculate n in O(1) using bit operations
2. Iterate m from 0 to n-2, where n ≈ log₂(t)

Since n grows logarithmically with t, the inner loop runs O(log t) times. Summing over all t gives O(T log T).

**Space Complexity**: O(T) for the dp array storing results for all positions up to target.

## Common Mistakes

1. **Forgetting the "reverse early" case**: Many candidates only consider overshooting and reversing, missing cases where it's optimal to reverse before reaching the overshoot point. Always test with target = 5 (optimal: AA R A R AA = 7 instructions, not AA R R A = 8).

2. **Incorrect bit_length calculation**: Using `int(math.log2(t))` can give floating-point precision issues. Use integer bit operations instead: `t.bit_length()` in Python, `32 - Integer.numberOfLeadingZeros(t)` in Java.

3. **Not handling exact powers of two minus one**: When target = 2^n - 1, we can reach it directly with n 'A's. Missing this special case adds unnecessary reversals.

4. **Infinite recursion in memoization**: If you implement DFS with memoization instead of DP, ensure you have proper base cases to avoid infinite cycles (like accelerating, reversing, accelerating back to original position).

## When You'll See This Pattern

This problem combines **dynamic programming** with **bit manipulation** and **mathematical optimization**. Similar patterns appear in:

1. **Perfect Squares (LeetCode 279)**: Finding minimum number of perfect squares that sum to n. Like Race Car, it involves finding optimal combinations of "building blocks" (squares vs. acceleration sequences).

2. **Integer Replacement (LeetCode 397)**: Minimum operations to reduce n to 1 using specific operations. Both problems involve making optimal decisions between different operation types.

3. **Minimum Operations to Reduce X to Zero (LeetCode 1658)**: Finding optimal prefix/suffix combinations, similar to how Race Car considers forward/backward movements.

The core pattern: When you have operations with exponential effects (like doubling speed), look for ways to leverage mathematical properties rather than brute-force search.

## Key Takeaways

1. **Exponential sequences create structure**: When acceleration doubles speed, positions become 2^n - 1. Recognizing this lets you reason about reachable positions mathematically rather than simulating every move.

2. **DP with multiple decision points**: Some DP problems require considering different "strategies" at each step (overshoot vs. reverse early). Don't assume a single greedy choice works.

3. **Bit operations optimize calculations**: When dealing with powers of two, use bit shifts and bit_length instead of expensive exponent calculations.

[Practice this problem on CodeJeet](/problem/race-car)
