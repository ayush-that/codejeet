---
title: "How to Solve Fair Candy Swap — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Fair Candy Swap. Easy difficulty, 64.6% acceptance rate. Topics: Array, Hash Table, Binary Search, Sorting."
date: "2026-06-12"
category: "dsa-patterns"
tags: ["fair-candy-swap", "array", "hash-table", "binary-search", "easy"]
---

# How to Solve Fair Candy Swap

Alice and Bob want to exchange exactly one candy box each so that after the swap, they both have the same total number of candies. This problem is interesting because it requires finding a specific pair of values that balances two sums—a common pattern in interview problems that tests your ability to transform constraints into mathematical relationships and efficiently search for solutions.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose:

- Alice's boxes: `[1, 2]` (total = 3)
- Bob's boxes: `[2, 3]` (total = 5)

Currently, Alice has 3 candies and Bob has 5. The difference is 2 candies. For them to have equal totals after swapping one box each, we need to find boxes `a` from Alice and `b` from Bob such that:

**After swap:**

- Alice's new total = 3 - a + b
- Bob's new total = 5 - b + a

We want these equal: `3 - a + b = 5 - b + a`

Let's simplify this equation:

```
3 - a + b = 5 - b + a
3 - a + b - 5 + b - a = 0
(3 - 5) + (b - a) + (b - a) = 0
-2 + 2(b - a) = 0
2(b - a) = 2
b - a = 1
```

So we need to find a pair where Bob's box has exactly 1 more candy than Alice's box.

Let's check possible swaps:

- Alice gives 1, Bob gives 2: `b - a = 2 - 1 = 1` ✓ Works!
- Alice gives 1, Bob gives 3: `b - a = 3 - 1 = 2` ✗
- Alice gives 2, Bob gives 2: `b - a = 2 - 2 = 0` ✗
- Alice gives 2, Bob gives 3: `b - a = 3 - 2 = 1` ✓ Also works!

Both `[1, 2]` and `[2, 3]` are valid swaps. The problem guarantees exactly one answer exists, so we can return either.

The key insight: **We need to find `a` from Alice and `b` from Bob such that `b = a + diff/2`, where `diff = sum(Bob) - sum(Alice)`.**

## Brute Force Approach

The most straightforward solution is to try every possible pair of boxes. For each box Alice could give, check each box Bob could give, calculate the new totals, and see if they match.

**Why this is insufficient:**

- Time complexity: O(n × m) where n = Alice's boxes, m = Bob's boxes
- For maximum constraints (10^4 boxes each), this could be 100 million operations
- While technically acceptable for the given constraints, it's inefficient and shows poor problem-solving skills

The brute force works but misses the mathematical insight that lets us solve it in O(n + m) time.

## Optimal Solution

The optimal approach uses the mathematical relationship we derived. Let:

- `sumA` = total candies Alice has
- `sumB` = total candies Bob has
- `targetDiff = (sumB - sumA) / 2`

We need to find `a` from Alice and `b` from Bob such that:

```
b = a + targetDiff
```

**Algorithm:**

1. Calculate total candies for Alice and Bob
2. Compute `targetDiff = (sumB - sumA) / 2`
3. Put Bob's boxes in a hash set for O(1) lookups
4. For each box `a` in Alice's boxes, check if `a + targetDiff` exists in Bob's set
5. If found, return `[a, a + targetDiff]`

<div class="code-group">

```python
# Time: O(n + m) | Space: O(m) where n = len(aliceSizes), m = len(bobSizes)
def fairCandySwap(aliceSizes, bobSizes):
    # Step 1: Calculate total candies for both
    sum_alice = sum(aliceSizes)
    sum_bob = sum(bobSizes)

    # Step 2: Compute the difference we need to balance
    # We want: sum_alice - a + b = sum_bob - b + a
    # Rearranged: b - a = (sum_bob - sum_alice) / 2
    target_diff = (sum_bob - sum_alice) // 2

    # Step 3: Create a set of Bob's candy boxes for O(1) lookups
    bob_set = set(bobSizes)

    # Step 4: For each of Alice's boxes, check if the needed box exists in Bob's set
    for a in aliceSizes:
        # The box Bob needs to give is exactly (a + target_diff)
        b_needed = a + target_diff
        if b_needed in bob_set:
            # Found a valid swap
            return [a, b_needed]

    # The problem guarantees a solution exists, so we shouldn't reach here
    return []
```

```javascript
// Time: O(n + m) | Space: O(m) where n = aliceSizes.length, m = bobSizes.length
function fairCandySwap(aliceSizes, bobSizes) {
  // Step 1: Calculate total candies for both
  let sumAlice = aliceSizes.reduce((a, b) => a + b, 0);
  let sumBob = bobSizes.reduce((a, b) => a + b, 0);

  // Step 2: Compute the difference we need to balance
  // We want: sumAlice - a + b = sumBob - b + a
  // Rearranged: b - a = (sumBob - sumAlice) / 2
  let targetDiff = (sumBob - sumAlice) / 2;

  // Step 3: Create a Set of Bob's candy boxes for O(1) lookups
  let bobSet = new Set(bobSizes);

  // Step 4: For each of Alice's boxes, check if the needed box exists in Bob's set
  for (let a of aliceSizes) {
    // The box Bob needs to give is exactly (a + targetDiff)
    let bNeeded = a + targetDiff;
    if (bobSet.has(bNeeded)) {
      // Found a valid swap
      return [a, bNeeded];
    }
  }

  // The problem guarantees a solution exists, so we shouldn't reach here
  return [];
}
```

```java
// Time: O(n + m) | Space: O(m) where n = aliceSizes.length, m = bobSizes.length
public int[] fairCandySwap(int[] aliceSizes, int[] bobSizes) {
    // Step 1: Calculate total candies for both
    int sumAlice = 0, sumBob = 0;
    for (int candies : aliceSizes) sumAlice += candies;
    for (int candies : bobSizes) sumBob += candies;

    // Step 2: Compute the difference we need to balance
    // We want: sumAlice - a + b = sumBob - b + a
    // Rearranged: b - a = (sumBob - sumAlice) / 2
    int targetDiff = (sumBob - sumAlice) / 2;

    // Step 3: Create a HashSet of Bob's candy boxes for O(1) lookups
    Set<Integer> bobSet = new HashSet<>();
    for (int candies : bobSizes) bobSet.add(candies);

    // Step 4: For each of Alice's boxes, check if the needed box exists in Bob's set
    for (int a : aliceSizes) {
        // The box Bob needs to give is exactly (a + targetDiff)
        int bNeeded = a + targetDiff;
        if (bobSet.contains(bNeeded)) {
            // Found a valid swap
            return new int[]{a, bNeeded};
        }
    }

    // The problem guarantees a solution exists, so we shouldn't reach here
    return new int[0];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Calculating sums: O(n) for Alice + O(m) for Bob = O(n + m)
- Building Bob's hash set: O(m)
- Iterating through Alice's boxes: O(n)
- Each lookup in the hash set: O(1) average case
- Total: O(n + m + m + n) = O(2(n + m)) = O(n + m)

**Space Complexity: O(m)**

- We store Bob's boxes in a hash set: O(m)
- The input arrays are given, so we don't count them
- A few integer variables for sums and differences: O(1)

## Common Mistakes

1. **Integer division issues**: When computing `(sumB - sumA) / 2`, ensure you're working with integers correctly. In Python, use `//` for integer division. In Java/JavaScript, the difference will always be even (guaranteed by the problem), so regular division works.

2. **Forgetting to use a hash set**: Some candidates try to search Bob's array linearly for each of Alice's boxes, resulting in O(n × m) time. Always ask yourself: "Can I optimize lookups?" When you need to check if something exists, a hash set is usually the answer.

3. **Misunderstanding the equation**: The most common conceptual error is setting up the wrong equation. Remember:
   - After swap: Alice has `sumA - a + b`, Bob has `sumB - b + a`
   - Set them equal: `sumA - a + b = sumB - b + a`
   - Simplify to: `b - a = (sumB - sumA) / 2`

4. **Returning the wrong order**: The problem expects `[alice_box, bob_box]` in that specific order. It's easy to accidentally return them swapped.

## When You'll See This Pattern

This problem uses the **"complement search"** pattern: given a target relationship, transform it into searching for complements in a collection.

Related problems:

1. **Two Sum (LeetCode #1)**: Find two numbers that add up to a target. Similar to finding `b = a + targetDiff`.
2. **Find Pair With Given Difference (similar)**: Given an array and a number k, find a pair with difference k. Exactly our `b - a = targetDiff`.
3. **Partition Equal Subset Sum (LeetCode #416)**: More complex but uses similar balancing concepts.

The core technique: **Transform the problem constraint into a mathematical relationship, then use efficient data structures (hash sets) to find matching pairs.**

## Key Takeaways

1. **Mathematical reformulation is powerful**: Many array problems become much easier when you derive the mathematical relationship between elements. Always write down the equations before coding.

2. **Hash sets enable O(1) lookups**: When you need to repeatedly check if values exist in a collection, convert it to a hash set. This transforms O(n) searches into O(1) lookups.

3. **Understand the problem guarantees**: This problem guarantees the difference `(sumB - sumA)` is even and a solution exists. This informs our implementation—we don't need extra validation code.

[Practice this problem on CodeJeet](/problem/fair-candy-swap)
