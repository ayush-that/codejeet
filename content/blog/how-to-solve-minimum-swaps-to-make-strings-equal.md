---
title: "How to Solve Minimum Swaps to Make Strings Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Swaps to Make Strings Equal. Medium difficulty, 65.3% acceptance rate. Topics: Math, String, Greedy."
date: "2028-07-14"
category: "dsa-patterns"
tags: ["minimum-swaps-to-make-strings-equal", "math", "string", "greedy", "medium"]
---

# How to Solve Minimum Swaps to Make Strings Equal

You have two strings containing only 'x' and 'y' characters, and you can swap characters between the strings to make them equal. The challenge is finding the minimum number of swaps needed. What makes this problem interesting is that it looks like a string manipulation problem, but the optimal solution is actually a mathematical counting problem in disguise.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider:

```
s1 = "xxyyxyxyxx"
s2 = "xyyxyxxxyx"
```

We want to make s1 equal to s2. Let's compare character by character:

1. Compare positions where characters differ:
   - Position 0: s1[0]='x', s2[0]='x' → same ✓
   - Position 1: s1[1]='x', s2[1]='y' → different! This is an "x-y" pair (x in s1, y in s2)
   - Position 2: s1[2]='y', s2[2]='y' → same ✓
   - Position 3: s1[3]='y', s2[3]='x' → different! This is a "y-x" pair (y in s1, x in s2)
   - Position 4: s1[4]='x', s2[4]='y' → different! Another "x-y" pair
   - Position 5: s1[5]='y', s2[5]='x' → different! Another "y-x" pair
   - Position 6: s1[6]='x', s2[6]='x' → same ✓
   - Position 7: s1[7]='y', s2[7]='x' → different! Another "y-x" pair
   - Position 8: s1[8]='x', s2[8]='y' → different! Another "x-y" pair
   - Position 9: s1[9]='x', s2[9]='x' → same ✓

2. Count the mismatches:
   - "x-y" pairs (x in s1, y in s2): positions 1, 4, 8 → count = 3
   - "y-x" pairs (y in s1, x in s2): positions 3, 5, 7 → count = 3

3. How do we fix these mismatches?
   - If we have an "x-y" pair and a "y-x" pair, we can swap them with ONE swap!
     Example: Swap s1[1]='x' with s2[3]='x' → both positions become 'x'
   - If we have two "x-y" pairs, we need TWO swaps:
     Example: Swap s1[1]='x' with s2[4]='y' → now we have "y-y" and "x-x", then swap again
   - Same logic applies to two "y-x" pairs

4. Calculate minimum swaps:
   - We have 3 "x-y" and 3 "y-x" pairs
   - First, pair up "x-y" with "y-x": min(3, 3) = 3 pairs → 3 swaps
   - Remaining mismatches: 3-3 = 0 "x-y", 3-3 = 0 "y-x" → no more swaps needed
   - Total: 3 swaps

This example shows the core insight: we need to count the two types of mismatches and use them efficiently.

## Brute Force Approach

A naive approach might try to simulate all possible swaps, but that's clearly infeasible. Another brute force idea would be to try all possible pairings of mismatches, but with n positions, there are O(n²) possible swaps to consider, and we'd need to track which swaps fix which positions.

The real issue with brute force is that it doesn't leverage the mathematical structure of the problem. We're not actually trying different sequences of swaps - we're looking for a formula based on the counts of mismatches.

Even if we tried a greedy approach that always makes the best immediate swap, we'd still need to figure out what "best" means. Should we prioritize fixing two mismatches at once? Should we look for swaps that create new matches? Without the counting insight, we'd be stuck in trial and error.

## Optimized Approach

The key insight is that we only care about positions where s1[i] ≠ s2[i]. At these positions, there are exactly two possibilities:

1. s1[i] = 'x' and s2[i] = 'y' → call this type "xy"
2. s1[i] = 'y' and s2[i] = 'x' → call this type "yx"

Now, consider how swaps work:

- If we swap an "xy" position with a "yx" position (swap s1[i] from the "xy" with s2[j] from the "yx"), we fix BOTH positions with ONE swap!
- If we swap two "xy" positions (swap s1[i] from one "xy" with s2[j] from another "xy"), we create two positions where both strings have 'y'. We then need a second swap to fix them. So two "xy" positions require TWO swaps.
- Same logic applies to two "yx" positions.

Therefore, the optimal strategy is:

1. First, pair up as many "xy" with "yx" as possible (each pair costs 1 swap)
2. For the remaining mismatches (all of the same type), we need 2 swaps for each pair

There's one more subtlety: if the total number of mismatches is odd, it's impossible to make the strings equal. Why? Because each swap affects two positions, so we can only fix an even number of mismatches.

So the algorithm becomes:

1. Count "xy" and "yx" mismatches
2. If (xy + yx) is odd → return -1 (impossible)
3. Otherwise:
   - Pairs of different types: swaps = min(xy, yx)
   - Remaining same-type pairs: each pair needs 2 swaps
   - Total = min(xy, yx) + 2 \* ((max(xy, yx) - min(xy, yx)) // 2)

Wait, that last part simplifies! Since xy + yx is even, if xy and yx are both odd or both even, then max(xy, yx) - min(xy, yx) is even. Actually, we can simplify further:

- If xy and yx are both even: answer = (xy + yx) / 2
- If xy and yx are both odd: answer = (xy + yx) / 2 + 1

But there's an even cleaner formula: answer = (xy + 1) // 2 + (yx + 1) // 2
Let's test this:

- If xy=3, yx=3: (3+1)//2 + (3+1)//2 = 2 + 2 = 4? That's wrong, we want 3.
- Actually, the correct formula is: answer = xy//2 + yx//2 + 2\*(xy%2)

Let me derive this properly. The optimal approach is:

1. Swap "xy" with "yx" pairs: each uses 1 swap and fixes 2 mismatches
2. If there's one "xy" and one "yx" left (both counts are odd), we need 2 swaps

So: answer = min(xy, yx) + 2 \* ((max(xy, yx) - min(xy, yx)) // 2)
But if xy and yx are both odd, then max-min is even, so this gives min + (max-min) = max
Actually, that's not right either. Let's work through examples:

- xy=3, yx=3: min=3, max-min=0 → answer=3 ✓
- xy=4, yx=2: min=2, max-min=2 → answer=2+2=4 ✓
- xy=5, yx=1: min=1, max-min=4 → answer=1+4=5? But we need 3 swaps!

Ah, here's the issue: when we have xy=5, yx=1:

- First, pair 1 "xy" with 1 "yx": 1 swap, fixes 2 mismatches
- Remaining: 4 "xy", 0 "yx"
- 4 "xy" means 2 pairs of "xy", each pair needs 2 swaps: 4 swaps
- Total: 1 + 4 = 5 swaps ✓

Actually, the formula min(xy, yx) + 2 \* ((max(xy, yx) - min(xy, yx)) // 2) works, but we need to be careful with integer division. The cleanest implementation is to use the parity observation.

## Optimal Solution

The cleanest implementation counts the mismatches and uses a simple formula based on their parity:

1. Count positions where s1[i]='x' and s2[i]='y' (call this xy)
2. Count positions where s1[i]='y' and s2[i]='x' (call this yx)
3. If (xy + yx) is odd, return -1 (impossible)
4. Otherwise, return xy//2 + yx//2 + (xy % 2) \* 2

Why does this work?

- xy//2: pairs of "xy" positions (each pair needs 2 swaps, but we're counting swaps, not pairs)
- yx//2: pairs of "yx" positions
- xy % 2: if xy is odd, we have one leftover "xy"
- But wait, if xy is odd, then yx must also be odd (since sum is even), so we have one leftover "yx" too
- These two leftovers form a pair that needs 2 swaps, not 1
- Actually, the formula should be: xy//2 + yx//2 + 2\*(xy%2)

Let me verify:

- xy=3, yx=3: 3//2 + 3//2 + 2\*(3%2) = 1 + 1 + 2 = 4 ✗ (should be 3)
- Hmm, that's not right either.

Actually, the correct reasoning is simpler: each pair of same-type mismatches needs 2 swaps, and a pair of different-type mismatches needs 1 swap. So:

- We can fix min(xy, yx) pairs with 1 swap each
- The remaining are all the same type: (max(xy, yx) - min(xy, yx)) mismatches
- These come in pairs, each pair needs 2 swaps
- So total = min(xy, yx) + 2 \* ((max(xy, yx) - min(xy, yx)) // 2)

But since xy + yx is even, max(xy, yx) - min(xy, yx) is even, so the division is exact.

Here's the implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumSwap(s1: str, s2: str) -> int:
    """
    Calculate minimum swaps to make s1 equal to s2.

    The key insight is to count two types of mismatches:
    1. Positions where s1 has 'x' and s2 has 'y' (xy_count)
    2. Positions where s1 has 'y' and s2 has 'x' (yx_count)

    Each pair of different-type mismatches can be fixed with 1 swap.
    Each pair of same-type mismatches requires 2 swaps.
    """
    xy_count = 0  # count of positions where s1[i]='x', s2[i]='y'
    yx_count = 0  # count of positions where s1[i]='y', s2[i]='x'

    # Count the mismatches
    for i in range(len(s1)):
        if s1[i] != s2[i]:
            if s1[i] == 'x':  # s1 has 'x', s2 has 'y'
                xy_count += 1
            else:  # s1 has 'y', s2 has 'x'
                yx_count += 1

    # If total mismatches is odd, impossible to fix
    # Because each swap fixes 2 positions (or 0 if swapping matching chars)
    if (xy_count + yx_count) % 2 == 1:
        return -1

    # Calculate minimum swaps:
    # 1. Pair up different types: each pair costs 1 swap
    # 2. Remaining same types: each pair costs 2 swaps
    # Formula: min(xy, yx) gives number of different-type pairs
    # Then (max(xy, yx) - min(xy, yx)) gives remaining mismatches (all same type)
    # These come in pairs, each pair needs 2 swaps
    return min(xy_count, yx_count) + 2 * ((max(xy_count, yx_count) - min(xy_count, yx_count)) // 2)
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate minimum swaps to make s1 equal to s2.
 *
 * Count two types of mismatches:
 * 1. Positions where s1 has 'x' and s2 has 'y' (xyCount)
 * 2. Positions where s1 has 'y' and s2 has 'x' (yxCount)
 *
 * Different-type mismatches can be fixed with 1 swap per pair.
 * Same-type mismatches require 2 swaps per pair.
 */
function minimumSwap(s1, s2) {
  let xyCount = 0; // s1[i]='x', s2[i]='y'
  let yxCount = 0; // s1[i]='y', s2[i]='x'

  // Count mismatches
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      if (s1[i] === "x") {
        xyCount++;
      } else {
        yxCount++;
      }
    }
  }

  // If total mismatches is odd, impossible
  if ((xyCount + yxCount) % 2 === 1) {
    return -1;
  }

  // Calculate minimum swaps
  // Pair different types first (1 swap each)
  // Then pair same types (2 swaps per pair)
  const minCount = Math.min(xyCount, yxCount);
  const maxCount = Math.max(xyCount, yxCount);
  return minCount + 2 * Math.floor((maxCount - minCount) / 2);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumSwap(String s1, String s2) {
        int xyCount = 0;  // positions where s1[i]='x', s2[i]='y'
        int yxCount = 0;  // positions where s1[i]='y', s2[i]='x'

        // Count the two types of mismatches
        for (int i = 0; i < s1.length(); i++) {
            char c1 = s1.charAt(i);
            char c2 = s2.charAt(i);

            if (c1 != c2) {
                if (c1 == 'x') {
                    xyCount++;
                } else {
                    yxCount++;
                }
            }
        }

        // If total mismatches is odd, impossible to make equal
        if ((xyCount + yxCount) % 2 == 1) {
            return -1;
        }

        // Calculate minimum swaps:
        // 1. Swap different-type pairs (costs 1 swap per pair)
        // 2. Swap same-type pairs (costs 2 swaps per pair)
        int minCount = Math.min(xyCount, yxCount);
        int maxCount = Math.max(xyCount, yxCount);
        return minCount + 2 * ((maxCount - minCount) / 2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the strings. We make a single pass through both strings to count the mismatches, then perform constant-time calculations.

**Space Complexity:** O(1). We only use a few integer variables to store counts, regardless of input size.

The key observation is that we don't need to track which specific positions are mismatched - we only need the counts of the two types of mismatches. This reduces what seems like a complex combinatorial problem to simple arithmetic.

## Common Mistakes

1. **Forgetting to check if solution exists**: Candidates often jump straight into calculating swaps without checking if `(xy_count + yx_count) % 2 == 1`. If the total number of mismatches is odd, it's impossible to make the strings equal because each swap affects an even number of positions.

2. **Overcomplicating with actual swaps**: Some candidates try to simulate the swapping process or use BFS/DFS to find the minimum swaps. This leads to exponential time complexity. The problem is meant to be solved mathematically, not through simulation.

3. **Incorrect pairing logic**: A common error is to think that all mismatches can be fixed with 1 swap each, or that pairs of same-type mismatches need 1 swap. Remember: different-type pairs need 1 swap, same-type pairs need 2 swaps.

4. **Off-by-one in the formula**: The formula `min(xy, yx) + 2 * ((max(xy, yx) - min(xy, yx)) // 2)` works because `max - min` is always even when the sum is even. Some candidates try `(xy + yx) // 2` which doesn't account for the different costs of same-type vs different-type pairs.

## When You'll See This Pattern

This problem teaches the pattern of **reducing a seemingly complex problem to counting and parity**. Similar patterns appear in:

1. **Minimum Domino Rotations For Equal Row** (LeetCode 1007): You need to make all values in a row equal by rotating dominoes. Like our problem, it reduces to counting how many of each value appear in each position.

2. **Determine if Two Strings Are Close** (LeetCode 1657): You need to determine if you can transform one string to another using certain operations. The solution involves counting character frequencies and checking parity conditions.

3. **Minimum Number of Swaps to Make the String Balanced** (LeetCode 1963): You need to make a bracket sequence balanced with minimum swaps. The optimal solution counts mismatches and uses a formula similar to our problem.

The common thread is identifying what truly matters (counts, parities) rather than getting bogged down in the details of individual operations.

## Key Takeaways

1. **Look for mathematical structure**: When a problem involves operations like swaps, rotations, or replacements, check if you can reduce it to counting and arithmetic rather than simulating the operations.

2. **Parity is powerful**: Many problems become simpler when you consider whether counts are even or odd. If operations have symmetric effects (like swaps affecting two positions), parity arguments often provide key insights.

3. **Simplify the state space**: Instead of tracking which specific positions are wrong, often you only need to know how many positions have each type of error. This reduces exponential state spaces to polynomial or even constant size.

Related problems: [Determine if Two Strings Are Close](/problem/determine-if-two-strings-are-close), [Make Number of Distinct Characters Equal](/problem/make-number-of-distinct-characters-equal)
