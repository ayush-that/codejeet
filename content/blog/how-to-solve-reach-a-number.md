---
title: "How to Solve Reach a Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reach a Number. Medium difficulty, 44.6% acceptance rate. Topics: Math, Binary Search."
date: "2028-01-26"
category: "dsa-patterns"
tags: ["reach-a-number", "math", "binary-search", "medium"]
---

# How to Solve Reach a Number

You're at position 0 on an infinite number line, and you want to reach a target position. On your i-th move, you must move exactly i steps, but you can choose left or right. The challenge is finding the minimum number of moves needed to reach the target exactly. What makes this tricky is that you can't just move toward the target each time—sometimes you need to overshoot and use backward moves to adjust.

## Visual Walkthrough

Let's trace through `target = 3`:

**Move 1:** Move right 1 step → position 1  
**Move 2:** Move right 2 steps → position 3 ✓

We reached the target in 2 moves. That was straightforward. Now try `target = 2`:

**Move 1:** Right 1 → position 1  
**Move 2:** Right 2 → position 3 (overshoot by 1)  
**Move 3:** We need to move 3 steps. If we go left 3 → position 0 (too far). Right 3 → position 6 (farther). Neither works.

Let's try a different approach:  
**Move 1:** Right 1 → position 1  
**Move 2:** Left 2 → position -1  
**Move 3:** Right 3 → position 2 ✓

We reached the target in 3 moves. Notice we had to go past the target and then adjust. The key insight: we're looking for the smallest k where the sum 1+2+...+k reaches at least the target, and the difference between that sum and the target is even. Why even? Because flipping a move from right to left changes your position by 2×i (you subtract i instead of adding i), so you can only adjust by even amounts.

## Brute Force Approach

A naive approach would try all combinations of left/right for each move until finding the target. For k moves, there are 2^k possibilities. We could use BFS or DFS to explore states:

```
Start at position 0, move = 1
At each step: try position + move and position - move
Stop when we reach target
```

But this is exponential time—completely impractical for large targets. Even for target=10^9, we'd need to explore billions of states. The brute force fails because it doesn't leverage the mathematical structure of the problem.

## Optimized Approach

The optimal solution uses mathematical reasoning:

1. **First, ignore direction** — Since we can move left or right, we only care about the absolute distance. Let `target = abs(target)`.

2. **Find the smallest k where sum ≥ target** — Keep adding moves until the total sum S = 1+2+...+k is at least the target.

3. **Check the difference** — Let `diff = S - target`. If `diff` is even, we're done! Why? Because we can flip some move(s) from right to left. Flipping move i changes the sum by 2i (subtracting i instead of adding i), so we can adjust by any even number up to 2S.

4. **If diff is odd** — We need to make it even. Adding another move changes the parity of S:
   - If k+1 is odd, S increases by an odd number → diff changes from odd to even
   - If k+2 is odd, S increases by an even number → diff stays odd, then adding k+2 (odd) makes it even
     So we might need 1 or 2 more moves to get an even difference.

Example with `target = 5`:

- k=1: S=1 < 5
- k=2: S=3 < 5
- k=3: S=6 ≥ 5, diff=1 (odd) → need more moves
- k=4: S=10, diff=5 (odd) → still odd
- k=5: S=15, diff=10 (even) ✓ → answer is 5

## Optimal Solution

<div class="code-group">

```python
# Time: O(√target) - We increment k until sum reaches target
# Space: O(1) - Only using a few variables
def reachNumber(target: int) -> int:
    # Step 1: Work with absolute value since direction doesn't matter
    target = abs(target)

    k = 0
    total = 0

    # Step 2: Find smallest k where total >= target
    # Keep adding moves until we reach or pass the target
    while total < target:
        k += 1
        total += k

    # Step 3: Adjust until difference is even
    # The difference must be even so we can flip moves to adjust
    while (total - target) % 2 != 0:
        k += 1
        total += k

    return k
```

```javascript
// Time: O(√target) - We increment k until sum reaches target
// Space: O(1) - Only using a few variables
function reachNumber(target) {
  // Step 1: Work with absolute value since direction doesn't matter
  target = Math.abs(target);

  let k = 0;
  let total = 0;

  // Step 2: Find smallest k where total >= target
  // Keep adding moves until we reach or pass the target
  while (total < target) {
    k++;
    total += k;
  }

  // Step 3: Adjust until difference is even
  // The difference must be even so we can flip moves to adjust
  while ((total - target) % 2 !== 0) {
    k++;
    total += k;
  }

  return k;
}
```

```java
// Time: O(√target) - We increment k until sum reaches target
// Space: O(1) - Only using a few variables
class Solution {
    public int reachNumber(int target) {
        // Step 1: Work with absolute value since direction doesn't matter
        target = Math.abs(target);

        int k = 0;
        int total = 0;

        // Step 2: Find smallest k where total >= target
        // Keep adding moves until we reach or pass the target
        while (total < target) {
            k++;
            total += k;
        }

        // Step 3: Adjust until difference is even
        // The difference must be even so we can flip moves to adjust
        while ((total - target) % 2 != 0) {
            k++;
            total += k;
        }

        return k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(√target)  
Why? The sum 1+2+...+k = k(k+1)/2. We need this to be ≥ target, so k ≈ √(2×target). The while loops run until k reaches this value.

**Space Complexity:** O(1)  
We only use a constant amount of extra space for variables `k`, `total`, and `target`.

## Common Mistakes

1. **Not taking absolute value first** — The problem allows negative targets, but mathematically it's symmetric. If you don't convert to absolute value, you'll get wrong answers or infinite loops.

2. **Trying to backtrack or use BFS/DFS** — This leads to exponential time complexity. The problem looks like it could be solved with search, but the mathematical approach is necessary for efficiency.

3. **Incorrect parity check** — Some candidates check if `target % 2 == 0` instead of checking if `(sum - target) % 2 == 0`. The parity of the target itself doesn't matter; what matters is whether the overshoot is even.

4. **Off-by-one in the loop** — Starting with `k = 1` instead of `k = 0` can cause issues. The cleanest approach is to increment first, then add to total.

## When You'll See This Pattern

This "summation with parity adjustment" pattern appears in problems where:

1. You have sequential operations with increasing costs/sizes
2. You need to reach an exact value
3. You can make adjustments by flipping signs or directions

Related problems:

- **Number of Ways to Reach a Position After Exactly k Steps** — Similar concept of reaching a target with left/right moves, though that one uses combinatorics
- **Minimum Operations to Reduce X to Zero** — Finding complementary sums that reach a target
- **Koko Eating Bananas** — Binary search on the number of operations needed

## Key Takeaways

1. **Look for mathematical properties** — When operations have regular patterns (like increasing by 1 each time), there's often a formula-based solution rather than a search-based one.

2. **Parity matters** — When you can flip signs/directions, the difference between your current position and target often needs to be even for adjustments to work.

3. **Simplify symmetric problems** — If left/right or positive/negative are symmetric, work with absolute values to reduce complexity.

Related problems: [Number of Ways to Reach a Position After Exactly k Steps](/problem/number-of-ways-to-reach-a-position-after-exactly-k-steps)
