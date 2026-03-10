---
title: "How to Solve Taking Maximum Energy From the Mystic Dungeon — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Taking Maximum Energy From the Mystic Dungeon. Medium difficulty, 61.0% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-10-26"
category: "dsa-patterns"
tags: ["taking-maximum-energy-from-the-mystic-dungeon", "array", "prefix-sum", "medium"]
---

# How to Solve Taking Maximum Energy From the Mystic Dungeon

You're given an array of integers representing energy values from magicians, and after taking energy from magician `i`, you must jump exactly `k` positions forward. Starting from any position, you collect energy along your path until you exit the array. The goal is to find the maximum total energy you can obtain. The twist is that you can start from any position, and negative values mean you lose energy, making this a path optimization problem.

What makes this problem interesting is that it's not about finding a contiguous subarray sum—it's about summing elements in a "strided" pattern where you jump by `k` each time. This creates multiple independent chains of elements that you need to evaluate separately.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have `energy = [2, -3, 5, 1, -6, 4]` and `k = 2`.

The key insight is that when you jump by `k`, you create separate chains of elements:

- Chain starting at index 0: 2 → 5 → -6 (indices 0, 2, 4)
- Chain starting at index 1: -3 → 1 → 4 (indices 1, 3, 5)

For each starting position, we need to calculate the sum along its chain:

- Starting at index 0: 2 + 5 + (-6) = 1
- Starting at index 1: (-3) + 1 + 4 = 2
- Starting at index 2: 5 + (-6) = -1
- Starting at index 3: 1 + 4 = 5
- Starting at index 4: -6 = -6
- Starting at index 5: 4 = 4

The maximum is 5 (starting at index 3). Notice that chains starting later in the array have fewer elements since we stop when we exit bounds.

The pattern becomes clear: for each starting index `i`, we sum `energy[i] + energy[i+k] + energy[i+2k] + ...` until we exceed the array bounds. We need to find the maximum of all such sums.

## Brute Force Approach

The brute force solution is straightforward: for each possible starting index `i` from `0` to `n-1`, calculate the sum of the chain starting at `i` by repeatedly adding `k` to the index until we go out of bounds.

<div class="code-group">

```python
# Time: O(n²) in worst case | Space: O(1)
def maximumEnergy(energy, k):
    n = len(energy)
    max_energy = float('-inf')

    # Try every possible starting position
    for i in range(n):
        current_sum = 0
        j = i

        # Follow the chain starting at i
        while j < n:
            current_sum += energy[j]
            j += k  # Jump k positions forward

        # Update maximum if this chain gives more energy
        if current_sum > max_energy:
            max_energy = current_sum

    return max_energy
```

```javascript
// Time: O(n²) in worst case | Space: O(1)
function maximumEnergy(energy, k) {
  const n = energy.length;
  let maxEnergy = -Infinity;

  // Try every possible starting position
  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    let j = i;

    // Follow the chain starting at i
    while (j < n) {
      currentSum += energy[j];
      j += k; // Jump k positions forward
    }

    // Update maximum if this chain gives more energy
    if (currentSum > maxEnergy) {
      maxEnergy = currentSum;
    }
  }

  return maxEnergy;
}
```

```java
// Time: O(n²) in worst case | Space: O(1)
public int maximumEnergy(int[] energy, int k) {
    int n = energy.length;
    int maxEnergy = Integer.MIN_VALUE;

    // Try every possible starting position
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        int j = i;

        // Follow the chain starting at i
        while (j < n) {
            currentSum += energy[j];
            j += k;  // Jump k positions forward
        }

        // Update maximum if this chain gives more energy
        if (currentSum > maxEnergy) {
            maxEnergy = currentSum;
        }
    }

    return maxEnergy;
}
```

</div>

**Why this is inefficient:** In the worst case when `k = 1`, each chain has length `n-i`, and we're summing overlapping chains repeatedly. The total work becomes approximately `n + (n-1) + (n-2) + ... + 1 = O(n²)`, which is too slow for large `n` (up to 10⁵ in typical constraints).

## Optimized Approach

The key insight is that we can compute these chain sums efficiently using **reverse traversal with dynamic programming**. Instead of starting from the beginning of each chain and moving forward, we start from the end of the array and work backwards.

For each index `i`, the optimal chain sum starting at `i` is:

- Just `energy[i]` if `i + k` is out of bounds (end of chain)
- `energy[i] + dp[i+k]` if `i + k` is within bounds, where `dp[i+k]` is the optimal sum starting at `i+k`

This works because if we're at position `i`, the best we can do is take the current energy plus the best we can get starting from the next position in our chain (`i+k`).

We compute these values from right to left because each position depends on a future position (`i+k`). By the time we reach index `i`, we've already computed `dp[i+k]`.

## Optimal Solution

Here's the optimized solution using reverse traversal:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumEnergy(energy, k):
    n = len(energy)
    # dp[i] will store the maximum energy obtainable starting from index i
    dp = [0] * n

    # Initialize the last element (base case)
    dp[n-1] = energy[n-1]

    # Traverse from second last element to first
    for i in range(n-2, -1, -1):
        # If jumping k positions from i stays within bounds
        if i + k < n:
            # Best we can do is take current energy plus best from i+k
            dp[i] = energy[i] + dp[i + k]
        else:
            # Can't jump further, so just take current energy
            dp[i] = energy[i]

    # The answer is the maximum value in dp array
    # (we can start from any position)
    return max(dp)
```

```javascript
// Time: O(n) | Space: O(n)
function maximumEnergy(energy, k) {
  const n = energy.length;
  // dp[i] will store the maximum energy obtainable starting from index i
  const dp = new Array(n);

  // Initialize the last element (base case)
  dp[n - 1] = energy[n - 1];

  // Traverse from second last element to first
  for (let i = n - 2; i >= 0; i--) {
    // If jumping k positions from i stays within bounds
    if (i + k < n) {
      // Best we can do is take current energy plus best from i+k
      dp[i] = energy[i] + dp[i + k];
    } else {
      // Can't jump further, so just take current energy
      dp[i] = energy[i];
    }
  }

  // The answer is the maximum value in dp array
  // (we can start from any position)
  return Math.max(...dp);
}
```

```java
// Time: O(n) | Space: O(n)
public int maximumEnergy(int[] energy, int k) {
    int n = energy.length;
    // dp[i] will store the maximum energy obtainable starting from index i
    int[] dp = new int[n];

    // Initialize the last element (base case)
    dp[n-1] = energy[n-1];

    // Traverse from second last element to first
    for (int i = n - 2; i >= 0; i--) {
        // If jumping k positions from i stays within bounds
        if (i + k < n) {
            // Best we can do is take current energy plus best from i+k
            dp[i] = energy[i] + dp[i + k];
        } else {
            // Can't jump further, so just take current energy
            dp[i] = energy[i];
        }
    }

    // The answer is the maximum value in dp array
    // (we can start from any position)
    int maxEnergy = Integer.MIN_VALUE;
    for (int val : dp) {
        if (val > maxEnergy) {
            maxEnergy = val;
        }
    }
    return maxEnergy;
}
```

</div>

**Why this works:** We're essentially computing the suffix sums for each chain in reverse order. When we're at index `i`, we already know the optimal result starting from `i+k`, so we can make an optimal decision at `i`.

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the array from right to left (n iterations)
- Each iteration does constant work: one array access, one addition, and one comparison
- Finding the maximum in the dp array takes O(n) time, but this can be done during the reverse pass or in a separate pass

**Space Complexity:** O(n)

- We need to store the dp array of size n
- We could optimize to O(1) space by reusing the input array if allowed, but typically we don't modify input

## Common Mistakes

1. **Starting traversal from the beginning instead of the end:** If you traverse left to right, you won't have computed `dp[i+k]` yet when you need it at position `i`. The dependency goes forward, so computation must go backward.

2. **Forgetting that you can start from any position:** Some candidates only consider starting from index 0 or indices where `i % k == 0`. Remember, you can start anywhere, and the optimal might be in the middle of a chain.

3. **Incorrect handling of the base case:** When `i + k >= n`, you should just take `energy[i]`, not 0. The last element in any chain contributes its full value.

4. **Using greedy approach instead of DP:** You might think to always continue if the next value is positive, but negative values can be worth taking if they lead to even larger positive values later in the chain. The DP approach correctly handles this by considering the entire remaining chain.

## When You'll See This Pattern

This "reverse traversal with dependency on future states" pattern appears in several optimization problems:

1. **House Robber (LeetCode 198):** Similar DP where you can't rob adjacent houses and need to decide whether to rob current house based on optimal future states.

2. **Jump Game (LeetCode 55):** Determining if you can reach the end by jumping up to certain distances—often solved with DP from right to left.

3. **Maximum Subarray (LeetCode 53):** While typically solved with Kadane's algorithm, it can also be viewed as a DP problem where each position depends on whether to extend the previous subarray or start fresh.

The core idea is recognizing when a problem has optimal substructure (optimal solution can be constructed from optimal solutions of subproblems) and overlapping subproblems, making it suitable for dynamic programming.

## Key Takeaways

1. **When you need to make a sequence of decisions with a fixed jump pattern, consider reverse DP.** If each decision depends on future states, compute from the end backward.

2. **Look for independent chains or subsequences.** When jumps create separate sequences (like all indices congruent modulo k), you can often process them independently, though the reverse DP handles all chains simultaneously.

3. **The ability to start anywhere means checking all possibilities.** Don't assume you must start at a "special" position—the maximum could come from any starting point.

[Practice this problem on CodeJeet](/problem/taking-maximum-energy-from-the-mystic-dungeon)
