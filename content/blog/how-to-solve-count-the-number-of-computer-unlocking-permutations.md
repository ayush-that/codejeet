---
title: "How to Solve Count the Number of Computer Unlocking Permutations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Computer Unlocking Permutations. Medium difficulty, 59.0% acceptance rate. Topics: Array, Math, Brainteaser, Combinatorics."
date: "2027-08-01"
category: "dsa-patterns"
tags:
  ["count-the-number-of-computer-unlocking-permutations", "array", "math", "brainteaser", "medium"]
---

# How to Solve Count the Number of Computer Unlocking Permutations

You’re given an array `complexity` where each element represents the password complexity of a locked computer. Computer 0 is already unlocked, and you can only unlock a computer if its password complexity is **strictly greater** than the complexity of the **most recently unlocked computer**. The challenge is to count how many possible orders (permutations) you could unlock all computers, given this constraint. What makes this problem interesting is that it looks like a permutation problem, but the unlocking constraint turns it into a combinatorial counting problem that can be solved with a clever mathematical insight.

## Visual Walkthrough

Let’s walk through a small example to build intuition. Suppose `complexity = [1, 3, 2]`. Computer 0 (complexity 1) is already unlocked. We have computers 1 (complexity 3) and 2 (complexity 2) left to unlock.

**Step 1:** Start with computer 0 unlocked. The "current max complexity" is 1.

**Step 2:** Choose the next computer to unlock. We have two choices:

- **Option A:** Unlock computer 1 (complexity 3). Since 3 > 1, this is valid. Now current max = 3. Only computer 2 (complexity 2) remains. But 2 is NOT > 3, so we cannot unlock it. This path fails.
- **Option B:** Unlock computer 2 (complexity 2). Since 2 > 1, this is valid. Now current max = 2. Only computer 1 (complexity 3) remains. 3 > 2, so we can unlock it. This path succeeds.

**Result:** Only 1 valid unlocking order: [0, 2, 1].

Now let’s try `complexity = [2, 1, 3]`. Computer 0 (complexity 2) is unlocked. Current max = 2. Remaining: computer 1 (complexity 1) and computer 2 (complexity 3).

**Step 2 choices:**

- Unlock computer 1: 1 is NOT > 2 → invalid.
- Unlock computer 2: 3 > 2 → valid. Current max = 3. Remaining: computer 1 (complexity 1). 1 is NOT > 3 → invalid.

**Result:** 0 valid orders. This shows that if the smallest remaining complexity isn’t greater than the current max, we might have zero valid sequences.

The key observation: At each step, we can only choose computers whose complexity is **greater than the current maximum**. Once we choose one, the current maximum updates, potentially allowing more computers to become eligible.

## Brute Force Approach

A naive approach would be to generate all permutations of the remaining `n-1` computers (since computer 0 is fixed at the start), then simulate the unlocking process for each permutation, checking if the complexity constraint holds at every step.

**Why this fails:**

- There are `(n-1)!` permutations to check.
- For `n = 10`, that’s 362,880 permutations — maybe borderline acceptable.
- For `n = 20`, that’s about 2.4×10¹⁸ permutations — completely impossible.
- Even with pruning (skipping invalid prefixes), the worst case is still factorial time.

The brute force teaches us that we need a way to count valid sequences without enumerating them. This is a strong hint that the solution involves combinatorics or dynamic programming.

## Optimized Approach

The breakthrough insight comes from sorting and thinking about available choices at each step.

**Key observations:**

1. The unlocking constraint depends only on comparing with the **current maximum complexity**.
2. Once a computer is unlocked, its complexity becomes the new maximum if it’s larger than the previous maximum.
3. Therefore, at any point, the set of "unlockable" computers are those with complexity **greater than the current maximum**.

Let’s sort the complexities (but remember we need to track original indices since computer 0 is fixed at the start). Actually, we don’t need original indices for counting — we just need to know how many computers are available at each step.

**Better insight:** Imagine we’ve already unlocked some computers. The current maximum is the highest complexity among unlocked computers. The remaining computers are those we haven’t unlocked yet. Among them, only those with complexity > current max are eligible.

But there’s an even cleaner way: Sort all complexities. Computer 0’s complexity is at some position in this sorted list. All computers with complexity less than or equal to computer 0’s complexity can **only** be unlocked if they come before any computer with higher complexity in the unlocking sequence.

Actually, the most elegant approach: Sort the complexities of computers 1 through n-1 (all except computer 0). At each step, count how many remaining computers have complexity greater than current max. Choose one of them, update current max, and repeat.

**Mathematical formulation:** Let’s sort the complexities of computers 1..n-1. Start with current max = complexity[0]. For i from 0 to n-2 (iterating through sorted complexities), at each step, count how many of the remaining computers have complexity > current max. If that count is `k`, then we have `k` choices for the next computer. Multiply these choices together to get the total count.

Wait — there’s a subtlety: When we choose a computer, its complexity becomes the new current max. So the available choices change dynamically.

**Final insight:** Sort all complexities. The answer is the product of `(number of elements greater than current max)` at each step, but we need to track how the current max evolves. Actually, since we always choose a computer with complexity > current max, the current max is always increasing. And in sorted order, once we pass a certain threshold, all remaining computers are greater.

Here’s the algorithm that works:

1. Sort the complexities of computers 1 through n-1.
2. Initialize `current_max = complexity[0]`, `result = 1`, and `available = 0`.
3. For each complexity in the sorted list:
   - If this complexity > current_max: increment `available` (this computer is eligible)
   - Multiply `result` by `available` (choose one of the available computers)
   - Decrement `available` (we used one computer)
   - Update `current_max` to max(current_max, this complexity)

Why does this work? Because when we process in sorted order, all computers with complexity ≤ current_max are not eligible. As we encounter complexities > current_max, they become available. At each step, we have `available` choices, we choose one, and the rest remain available for future steps.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) excluding input storage
def countUnlockingOrders(complexity):
    """
    Counts the number of valid orders to unlock all computers.

    Args:
        complexity: List[int] - password complexities for computers 0..n-1

    Returns:
        int: Number of valid unlocking orders modulo 10^9+7
    """
    MOD = 10**9 + 7
    n = len(complexity)

    # Computer 0 is already unlocked, so we only consider computers 1..n-1
    # Extract and sort complexities of computers 1 through n-1
    remaining = sorted(complexity[1:])

    current_max = complexity[0]  # Complexity of the already unlocked computer
    result = 1
    available = 0  # Count of computers currently available to unlock

    # Process remaining computers in sorted order
    for comp in remaining:
        # If this computer's complexity is greater than current max,
        # it becomes available for unlocking
        if comp > current_max:
            available += 1

        # We must choose one computer to unlock next from the available ones
        # If no computers are available (available == 0), then result becomes 0
        result = (result * available) % MOD

        # After choosing one computer, we have one less available
        available -= 1

        # Update current_max to include this computer's complexity
        # Since we process in sorted order and only choose comp > current_max,
        # current_max becomes comp (which is > previous current_max)
        current_max = max(current_max, comp)

    return result
```

```javascript
// Time: O(n log n) | Space: O(n) for the sorted array
/**
 * Counts the number of valid orders to unlock all computers.
 * @param {number[]} complexity - Password complexities for computers 0..n-1
 * @return {number} - Number of valid unlocking orders modulo 10^9+7
 */
function countUnlockingOrders(complexity) {
  const MOD = 1_000_000_007;
  const n = complexity.length;

  // Computer 0 is already unlocked, sort the rest
  const remaining = complexity.slice(1).sort((a, b) => a - b);

  let currentMax = complexity[0]; // Complexity of computer 0
  let result = 1;
  let available = 0; // Count of computers currently available to unlock

  // Process in increasing order of complexity
  for (const comp of remaining) {
    // If this computer can be unlocked (complexity > current max),
    // it becomes available
    if (comp > currentMax) {
      available++;
    }

    // Choose one computer from the available ones
    // If no computers are available, result becomes 0
    result = (result * available) % MOD;

    // We've used one available computer
    available--;

    // Update the current maximum complexity
    currentMax = Math.max(currentMax, comp);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for the sorted array
import java.util.Arrays;

class Solution {
    public int countUnlockingOrders(int[] complexity) {
        final int MOD = 1_000_000_007;
        int n = complexity.length;

        // Extract complexities of computers 1 through n-1
        int[] remaining = new int[n - 1];
        System.arraycopy(complexity, 1, remaining, 0, n - 1);

        // Sort in ascending order
        Arrays.sort(remaining);

        int currentMax = complexity[0];  // Computer 0 is already unlocked
        long result = 1;  // Use long to avoid overflow during multiplication
        int available = 0;  // Count of computers currently available to unlock

        for (int comp : remaining) {
            // If this computer's complexity exceeds current max, it's available
            if (comp > currentMax) {
                available++;
            }

            // Choose one computer from the available ones
            // If available == 0, result becomes 0
            result = (result * available) % MOD;

            // We've used one available computer
            available--;

            // Update current maximum complexity
            currentMax = Math.max(currentMax, comp);
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the `n-1` remaining computers takes O(n log n) time.
- The single pass through the sorted array takes O(n) time.
- Dominated by the sorting step.

**Space Complexity:** O(n) in most languages

- We need to store the sorted array of remaining computers.
- In Python, `sorted()` creates a new list.
- In Java/JavaScript, we create a new array for the remaining computers.
- Could be optimized to O(1) additional space by sorting in-place and ignoring computer 0, but that would modify input.

## Common Mistakes

1. **Not handling the modulo operation correctly:** The result can grow extremely large (factorial-sized), so we must apply modulo 10⁹+7 after each multiplication, not just at the end. Forgetting this causes integer overflow.

2. **Incorrectly initializing `available`:** Some candidates start with `available = 0` and wonder why they get 0 as the result. The key is that we increment `available` when we encounter a complexity > current_max BEFORE using it in the multiplication.

3. **Forgetting that computer 0 is fixed:** The problem states computer 0 is already unlocked, so it's always first in the sequence. Some candidates try to include it in permutations, which is wrong.

4. **Not sorting the complexities:** The algorithm relies on processing computers in increasing order of complexity. Without sorting, we can't efficiently track how many computers are available at each step.

## When You'll See This Pattern

This problem combines **sorting** with **combinatorial counting**, where the number of choices at each step depends on some running condition (here, the current maximum).

Similar problems:

1. **Clumsy Factorial (LeetCode 1006)** - Also involves mathematical computation with constraints at each step.
2. **Count Number of Teams (LeetCode 1395)** - Counting valid sequences based on increasing/decreasing constraints.
3. **Number of Ways to Reorder Array to Get Same BST (LeetCode 1569)** - More advanced combinatorial counting where choices depend on binary search tree constraints.

The core pattern: When you need to count sequences/orders satisfying constraints, and the constraints compare each element with some running state (max, min, etc.), consider sorting and counting available choices at each step.

## Key Takeaways

1. **Sorting transforms ordering constraints into simpler counting problems.** By processing in sorted order, we can track how many elements satisfy the "greater than current max" condition at each step.

2. **Combinatorial counting often involves multiplying choices.** If at step i you have kᵢ valid choices, and choices are independent across steps, the total is the product of all kᵢ.

3. **Fixed starting points simplify permutation problems.** When one element is fixed (like computer 0), you're counting permutations of n-1 elements with constraints relative to that fixed element.

Related problems: [Clumsy Factorial](/problem/clumsy-factorial)
