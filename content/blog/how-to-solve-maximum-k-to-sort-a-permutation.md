---
title: "How to Solve Maximum K to Sort a Permutation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum K to Sort a Permutation. Medium difficulty, 37.2% acceptance rate. Topics: Array, Bit Manipulation."
date: "2029-03-16"
category: "dsa-patterns"
tags: ["maximum-k-to-sort-a-permutation", "array", "bit-manipulation", "medium"]
---

# How to Solve Maximum K to Sort a Permutation

This problem asks us to find the **maximum** non-negative integer `k` such that we can sort a permutation of `[0..n-1]` by repeatedly swapping elements whose bitwise AND equals `k`. The twist is that `k` isn't given — we need to find the largest value that makes sorting possible. What makes this tricky is connecting bitwise operations with sorting constraints: we need to understand which elements can be swapped with which others for a given `k`, and whether those swaps allow us to reach the sorted state.

## Visual Walkthrough

Let's trace through example `nums = [3, 2, 1, 0]` (n=4) to build intuition.

**Step 1: Understanding the swap condition**
We can only swap elements at indices `i` and `j` if `nums[i] & nums[j] == k`. This means the bitwise AND of the **values** (not indices) must equal exactly `k`.

**Step 2: Thinking about connectivity**
For a given `k`, we can think of a graph where:

- Nodes are indices 0..n-1
- An edge exists between indices `i` and `j` if `nums[i] & nums[j] == k`

We can sort the array if every element can reach its correct position through a series of swaps. In graph terms: for each index `i`, the value `nums[i]` must be in the same **connected component** as the value `i` (since in sorted array, index `i` should contain value `i`).

**Step 3: Trying different k values**
Let's check if k=3 works:

- Values: [3, 2, 1, 0]
- Check edges: 3&2=2 (≠3), 3&1=1 (≠3), 3&0=0 (≠3), 2&1=0 (≠3), 2&0=0 (≠3), 1&0=0 (≠3)
- No edges exist! So we can't make any swaps. Array stays [3,2,1,0] ≠ sorted.

What about k=2?

- Check edges: 3&2=2 (✓), 3&1=1 (≠2), 3&0=0 (≠2), 2&1=0 (≠2), 2&0=0 (≠2), 1&0=0 (≠2)
- Only edge: between value 3 and 2
- Graph components: {3,2}, {1}, {0}
- Value 3 needs to go to index 3, value 2 to index 2
- But 3 and 2 are in same component, so they can swap with each other
- However, 1 and 0 are isolated and can't move
- Can't sort: k=2 fails

What about k=1?

- Check edges: 3&2=2 (≠1), 3&1=1 (✓), 3&0=0 (≠1), 2&1=0 (≠1), 2&0=0 (≠1), 1&0=0 (≠1)
- Only edge: between value 3 and 1
- Components: {3,1}, {2}, {0}
- Still can't sort (2 and 0 isolated)

What about k=0?

- Check edges: 3&2=2 (≠0), 3&1=1 (≠0), 3&0=0 (✓), 2&1=0 (✓), 2&0=0 (✓), 1&0=0 (✓)
- Many edges! Components: {3,2,1,0} (all connected)
- Since all values are connected, we can rearrange them arbitrarily
- We can sort to [0,1,2,3]
- k=0 works!

Maximum k that works is 0 for this example.

## Brute Force Approach

A naive approach would be to try every possible `k` from large to small, and for each `k`, check if we can sort the array. How do we check for a given `k`?

1. Build a graph where nodes are indices 0..n-1
2. Add edge between `i` and `j` if `nums[i] & nums[j] == k`
3. Find connected components (using DFS or Union-Find)
4. Check if for every index `i`, the value `nums[i]` is in the same component as value `i`

The brute force would try all `k` from `n-1` down to 0 (since maximum possible AND of two numbers < n is < n). For each `k`, building the graph takes O(n²) to check all pairs, and checking components takes O(n). Total: O(n³) worst case.

This is too slow for n up to 10⁵. We need a better way to determine the maximum `k` without checking every value individually.

## Optimized Approach

The key insight is that **we don't need to test every k value**. Instead, we can think about which bits must be preserved in `k`.

**Observation 1:** If two values `a` and `b` need to be swapped (directly or indirectly), then `k` must be a subset of `a & b` (all bits set in `k` must also be set in `a & b`).

**Observation 2:** For sorting to be possible, every value must be able to reach its target position. This creates constraints: for each index `i`, the value `nums[i]` and the value `i` must be in the same connected component.

**Observation 3:** Instead of fixing `k` and checking connectivity, we can think about which bits can be set in `k`. A bit can be set in `k` only if, for every pair of values that need to be connected, that bit is set in their AND.

**Optimal strategy:**

1. Start with `k` having all bits set (maximum possible)
2. For each index `i`, if `nums[i] ≠ i`, then values `nums[i]` and `i` must be connectable
3. This means `k` must be a subset of `nums[i] & i` (all bits in `k` must be in the AND)
4. So we take the bitwise AND of all `(nums[i] & i)` for positions where `nums[i] ≠ i`
5. If `nums[i] = i`, no constraint is added (element already in correct position)

**Why this works:**

- We need the largest `k` that allows all necessary connections
- For any two values that need to be connected, `k` must be ≤ their AND
- Taking AND of all constraints gives the maximum `k` that satisfies all constraints
- If `k` has a bit set that isn't in some required AND, that pair can't be connected

**Edge case:** What if all elements are already in correct position? Then there are no constraints, so we can use any `k`. The maximum is all bits set, which for numbers 0..n-1 is the largest power of 2 ≤ n, minus 1.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumK(nums):
    """
    Find maximum k such that array can be sorted using swaps
    where swap condition is nums[i] & nums[j] == k.

    Args:
        nums: List[int] - permutation of [0..n-1]

    Returns:
        int - maximum k value
    """
    n = len(nums)
    # Start with all bits set (maximum possible k)
    # For numbers 0..n-1, max value is n-1
    k = (1 << (n.bit_length())) - 1

    # For each position, add constraint if element is misplaced
    for i in range(n):
        if nums[i] != i:
            # nums[i] and i must be connectable
            # k must be a subset of (nums[i] & i)
            k &= (nums[i] & i)

    # If all elements are already sorted (k unchanged from max),
    # we need to handle this special case
    if k == (1 << (n.bit_length())) - 1:
        # All elements in correct position
        # Maximum k is the largest number with all bits set
        # that can appear as AND of two numbers < n
        # This is simply n-1 if n is power of 2, else next power of 2 minus 1
        # But actually, we can use any k ≤ n-1
        # The maximum is n-1
        return n - 1

    return k
```

```javascript
// Time: O(n) | Space: O(1)
function maximumK(nums) {
  /**
   * Find maximum k such that array can be sorted using swaps
   * where swap condition is nums[i] & nums[j] == k.
   *
   * @param {number[]} nums - permutation of [0..n-1]
   * @return {number} - maximum k value
   */
  const n = nums.length;

  // Start with all bits set (maximum possible k)
  // For JavaScript, we need to handle up to 32 bits
  // But since numbers are 0..n-1, we can use a large mask
  let k = (1 << 32) - 1; // All 32 bits set

  // For each position, add constraint if element is misplaced
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i) {
      // nums[i] and i must be connectable
      // k must be a subset of (nums[i] & i)
      k &= nums[i] & i;
    }
  }

  // If all elements are already sorted (k unchanged from initial max),
  // we need to handle this special case
  if (k === (1 << 32) - 1) {
    // All elements in correct position
    // Maximum k is n-1
    return n - 1;
  }

  return k;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int maximumK(int[] nums) {
        /**
         * Find maximum k such that array can be sorted using swaps
         * where swap condition is nums[i] & nums[j] == k.
         *
         * @param nums - permutation of [0..n-1]
         * @return maximum k value
         */
        int n = nums.length;

        // Start with all bits set (maximum possible k)
        // Use -1 which has all 32 bits set to 1 in two's complement
        int k = -1;

        // For each position, add constraint if element is misplaced
        for (int i = 0; i < n; i++) {
            if (nums[i] != i) {
                // nums[i] and i must be connectable
                // k must be a subset of (nums[i] & i)
                k &= (nums[i] & i);
            }
        }

        // If all elements are already sorted (k unchanged from -1),
        // we need to handle this special case
        if (k == -1) {
            // All elements in correct position
            // Maximum k is n-1
            return n - 1;
        }

        return k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations (comparisons and bitwise AND) for each element.
- No nested loops, no graph construction.

**Space Complexity: O(1)**

- We use only a few integer variables regardless of input size.
- No additional data structures that scale with input.

The optimization comes from recognizing that we don't need to:

1. Try every possible k value
2. Build and traverse graphs for each k
3. Check all pairs of elements

Instead, we derive constraints directly from the required connections and combine them using bitwise AND.

## Common Mistakes

1. **Checking k in descending order without optimization**: Candidates might try k from n-1 down to 0, checking connectivity for each. This is O(n³) and times out for large n. Always look for mathematical insights before implementing brute force.

2. **Misunderstanding the swap condition**: The condition uses values `nums[i] & nums[j]`, not indices `i & j`. This is a common reading error. Always re-read the problem statement carefully.

3. **Forgetting the already-sorted case**: When all elements are in correct position, our algorithm would return -1 (all bits set) if we use -1 as initial k. But -1 might be > n-1. We need to return n-1 instead. Handle this edge case explicitly.

4. **Incorrect bit manipulation**: Using wrong initial value for k (like 0 instead of all bits set). Starting with 0 would give result 0 always. We need to start with all bits set and remove bits that can't be in k.

## When You'll See This Pattern

This problem combines **bit manipulation** with **connectivity constraints**, a pattern seen in:

1. **"Similar String Groups" (LeetCode 839)**: Groups strings that are similar (can be transformed via swaps). Like our problem, it's about connectivity under certain operations.

2. **"Number of Provinces" (LeetCode 547)**: Finding connected components in a graph, though here the graph edges depend on bitwise conditions.

3. **"Bitwise AND of Numbers Range" (LeetCode 201)**: Uses similar bitwise reasoning about common bits across a range.

The core pattern is: when you need to find a maximum/minimum parameter that allows certain connections or transformations, think about what constraints each requirement imposes, then combine them (often with AND for maximum, OR for minimum).

## Key Takeaways

1. **Bitwise constraints combine with AND**: When multiple pairs must satisfy `a & b == k`, the maximum `k` is the AND of all `(a & b)` for required connections. Each constraint removes bits that can't be in `k`.

2. **Connectivity can be checked via constraints**: Instead of building actual graphs for each k, we can often derive necessary conditions directly from the problem requirements.

3. **Special cases matter**: Always check edge cases like already-sorted array, empty array, or single element. These often break the general logic.

[Practice this problem on CodeJeet](/problem/maximum-k-to-sort-a-permutation)
