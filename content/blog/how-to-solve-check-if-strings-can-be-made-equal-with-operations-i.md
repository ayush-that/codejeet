---
title: "How to Solve Check if Strings Can be Made Equal With Operations I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Strings Can be Made Equal With Operations I. Easy difficulty, 47.8% acceptance rate. Topics: String."
date: "2028-09-18"
category: "dsa-patterns"
tags: ["check-if-strings-can-be-made-equal-with-operations-i", "string", "easy"]
---

# How to Solve "Check if Strings Can be Made Equal With Operations I"

This problem asks whether two 4-character strings can be made equal by repeatedly swapping characters that are exactly 2 positions apart. What makes this interesting is that the constraint of swapping only indices with distance 2 creates a specific pattern of connectivity between positions that isn't immediately obvious. You need to recognize which positions can communicate with each other through these swaps.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s1 = "abcd"` and `s2 = "cbad"`.

**Step 1: Understanding the operation**
We can swap characters at positions `i` and `j` where `j - i = 2`. For a 4-character string:

- Position 0 can swap with position 2 (0 ↔ 2)
- Position 1 can swap with position 3 (1 ↔ 3)
- Position 2 can swap with position 0 (2 ↔ 0, same as above)
- Position 3 can swap with position 1 (3 ↔ 1, same as above)

This creates two independent groups:

- Group 1: Positions 0 and 2 can swap with each other
- Group 2: Positions 1 and 3 can swap with each other

**Step 2: Analyzing our example**
`s1 = "abcd"` → positions: 0='a', 1='b', 2='c', 3='d'
`s2 = "cbad"` → positions: 0='c', 1='b', 2='a', 3='d'

Let's check each group separately:

**Group 1 (positions 0 and 2):**

- In s1: we have 'a' and 'c'
- In s2: we need 'c' and 'a'
- Can we rearrange 'a','c' to get 'c','a'? Yes, by swapping them!

**Group 2 (positions 1 and 3):**

- In s1: we have 'b' and 'd'
- In s2: we need 'b' and 'd'
- They already match, no swaps needed

Since both groups can be rearranged to match, the strings can be made equal.

**Step 3: Another example**
`s1 = "abcd"`, `s2 = "abdc"`

Group 1 (positions 0,2): 'a','c' vs 'a','c' ✓
Group 2 (positions 1,3): 'b','d' vs 'b','d' ✓
Wait, that should work... but s2 is "abdc" not "abcd". Let me check carefully:

Actually, s2 = "abdc" means:

- Position 0: 'a' ✓
- Position 1: 'b' ✓
- Position 2: 'd' ✗ (should be 'c')
- Position 3: 'c' ✗ (should be 'd')

Group 1 (positions 0,2): 'a','c' vs 'a','d' → 'a','c' cannot become 'a','d'
Group 2 (positions 1,3): 'b','d' vs 'b','c' → 'b','d' cannot become 'b','c'

So these strings cannot be made equal.

## Brute Force Approach

A naive approach might try to simulate all possible sequences of swaps. Since we can perform unlimited swaps, we could:

1. Generate all reachable strings from s1 using the allowed swaps
2. Check if s2 is in that set

However, this is inefficient because:

- For a 4-character string, there are 4! = 24 possible permutations
- But not all are reachable due to the swap constraints
- The brute force would need to explore a state space that could cycle infinitely
- We'd need careful cycle detection

Even for this small problem, the brute force is unnecessarily complex. The key insight is that positions form two independent groups, and within each group, we can rearrange characters freely through swaps.

## Optimal Solution

The optimal solution recognizes that positions 0 and 2 form one connected component, and positions 1 and 3 form another. Within each component, we can achieve any permutation of the characters through repeated swaps. Therefore, s1 can be transformed into s2 if and only if:

1. The multiset of characters at positions {0,2} in s1 equals the multiset at positions {0,2} in s2
2. The multiset of characters at positions {1,3} in s1 equals the multiset at positions {1,3} in s2

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def canBeEqual(self, s1: str, s2: str) -> bool:
    """
    Check if s1 can be transformed into s2 using swaps at distance 2.

    The key insight: positions form two independent groups:
    - Group 1: positions 0 and 2 (can swap with each other)
    - Group 2: positions 1 and 3 (can swap with each other)

    Within each group, we can achieve any permutation through swaps.
    So we just need to check if the character multisets match for each group.
    """
    # Check group 1 (positions 0 and 2)
    # We need the same two characters in both strings at these positions
    group1_s1 = sorted([s1[0], s1[2]])
    group1_s2 = sorted([s2[0], s2[2]])

    # Check group 2 (positions 1 and 3)
    group2_s1 = sorted([s1[1], s1[3]])
    group2_s2 = sorted([s2[1], s2[3]])

    # Both groups must match for the transformation to be possible
    return group1_s1 == group1_s2 and group2_s1 == group2_s2
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Check if s1 can be transformed into s2 using swaps at distance 2.
 *
 * Positions form two independent groups:
 * - Group 1: positions 0 and 2 (can swap with each other)
 * - Group 2: positions 1 and 3 (can swap with each other)
 *
 * Within each group, any permutation is achievable through swaps.
 * We just need to check if character multisets match for each group.
 */
function canBeEqual(s1, s2) {
  // Check group 1 (positions 0 and 2)
  // Get characters at these positions and sort them for comparison
  const group1S1 = [s1[0], s1[2]].sort();
  const group1S2 = [s2[0], s2[2]].sort();

  // Check group 2 (positions 1 and 3)
  const group2S1 = [s1[1], s1[3]].sort();
  const group2S2 = [s2[1], s2[3]].sort();

  // Both groups must match
  return (
    group1S1[0] === group1S2[0] &&
    group1S1[1] === group1S2[1] &&
    group2S1[0] === group2S2[0] &&
    group2S1[1] === group2S2[1]
  );
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Check if s1 can be transformed into s2 using swaps at distance 2.
     *
     * The operation creates two independent groups:
     * - Group 1: positions 0 and 2 (can swap with each other)
     * - Group 2: positions 1 and 3 (can swap with each other)
     *
     * Within each group, any permutation is achievable.
     * We just need to check if character multisets match for each group.
     */
    public boolean canBeEqual(String s1, String s2) {
        // Check group 1 (positions 0 and 2)
        // Create arrays for the two characters in each group
        char[] group1S1 = {s1.charAt(0), s1.charAt(2)};
        char[] group1S2 = {s2.charAt(0), s2.charAt(2)};

        // Check group 2 (positions 1 and 3)
        char[] group2S1 = {s1.charAt(1), s1.charAt(3)};
        char[] group2S2 = {s2.charAt(1), s2.charAt(3)};

        // Sort the arrays to compare multisets
        Arrays.sort(group1S1);
        Arrays.sort(group1S2);
        Arrays.sort(group2S1);
        Arrays.sort(group2S2);

        // Both groups must match
        return Arrays.equals(group1S1, group1S2) &&
               Arrays.equals(group2S1, group2S2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We only access 4 fixed indices (0, 1, 2, 3)
- Sorting two pairs of characters takes constant time (sorting 2 elements is O(1))
- All comparisons are constant time operations

**Space Complexity:** O(1)

- We use a fixed amount of extra space (a few character variables or small arrays)
- No data structures that grow with input size

## Common Mistakes

1. **Assuming all permutations are reachable:** Some candidates think they can swap any two characters, but the constraint `j - i = 2` is strict. You can only swap positions that are exactly 2 apart.

2. **Checking character counts globally instead of per group:** Counting that s1 and s2 have the same overall character frequencies isn't enough. For example, `s1="abcd"` and `s2="badc"` have the same character counts, but cannot be made equal because 'a' and 'c' are in different groups.

3. **Forgetting that strings are exactly length 4:** The problem states both strings have length 4, but some candidates write generalized code that handles variable lengths. While not wrong, it's unnecessary complexity.

4. **Overcomplicating with BFS/DFS:** Some candidates try to simulate all possible swap sequences using graph search algorithms. This is overkill for such a small, constrained problem with a simple mathematical solution.

## When You'll See This Pattern

This problem teaches **connectivity in permutation groups** or **graph connectivity applied to string transformations**. Similar patterns appear in:

1. **"Buddy Strings" (LeetCode 859)** - Checking if two strings can be made equal with exactly one swap. Like our problem, it involves analyzing which character exchanges are possible.

2. **"Determine if Two Strings Are Close" (LeetCode 1657)** - Checking if strings can be transformed using specific operations. It also requires analyzing which transformations are possible given operation constraints.

3. **"Minimum Swaps to Make Strings Equal" (LeetCode 1247)** - Finding minimum swaps to make strings equal when only certain swaps are allowed. This extends our problem to finding optimal sequences rather than just feasibility.

The core pattern is: when operations have constraints, identify which positions/elements can interact with each other (form connected components), then check if the desired configuration is achievable within each component.

## Key Takeaways

1. **Constraint analysis is crucial:** When operations have restrictions, map out which elements can interact. Here, the `j - i = 2` constraint creates two independent groups of positions.

2. **Think in terms of equivalence classes:** Positions that can be swapped directly or indirectly form equivalence classes. Within each class, any permutation is achievable through swaps.

3. **Small constraints often hint at simple solutions:** When input size is fixed and small (like length 4 here), there's usually a mathematical insight rather than a complex algorithmic solution.

[Practice this problem on CodeJeet](/problem/check-if-strings-can-be-made-equal-with-operations-i)
