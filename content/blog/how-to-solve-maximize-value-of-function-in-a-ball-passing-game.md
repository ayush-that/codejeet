---
title: "How to Solve Maximize Value of Function in a Ball Passing Game — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Value of Function in a Ball Passing Game. Hard difficulty, 30.4% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation."
date: "2026-08-08"
category: "dsa-patterns"
tags:
  [
    "maximize-value-of-function-in-a-ball-passing-game",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Maximize Value of Function in a Ball Passing Game

You're given an array `receiver` where `receiver[i]` indicates which player receives the ball from player `i`, and an integer `k` representing the total number of passes. You need to choose a starting player that maximizes the sum of player indices visited during the game. The challenge is that `k` can be up to 10¹⁰, making simulation impossible—we need a smarter approach.

## Visual Walkthrough

Let's trace through a small example: `receiver = [1, 2, 0]` and `k = 3`.

If we start at player 0:

- Pass 1: 0 → receiver[0] = 1 (sum = 0)
- Pass 2: 1 → receiver[1] = 2 (sum = 0 + 1 = 1)
- Pass 3: 2 → receiver[2] = 0 (sum = 1 + 2 = 3)
  Total sum = 3

If we start at player 1:

- Pass 1: 1 → 2 (sum = 1)
- Pass 2: 2 → 0 (sum = 1 + 2 = 3)
- Pass 3: 0 → 1 (sum = 3 + 0 = 3)
  Total sum = 3

If we start at player 2:

- Pass 1: 2 → 0 (sum = 2)
- Pass 2: 0 → 1 (sum = 2 + 0 = 2)
- Pass 3: 1 → 2 (sum = 2 + 1 = 3)
  Total sum = 3

All starting positions give sum 3. But what if `k = 5`? Starting at 0:

- Pass 1: 0 → 1 (sum = 0)
- Pass 2: 1 → 2 (sum = 1)
- Pass 3: 2 → 0 (sum = 3)
- Pass 4: 0 → 1 (sum = 3)
- Pass 5: 1 → 2 (sum = 4)
  Total sum = 4

The pattern repeats every 3 passes. This repetition is key—we can't simulate up to 10¹⁰ passes, but we can use binary lifting to jump through passes in logarithmic time.

## Brute Force Approach

The naive solution would be: for each possible starting player `i`, simulate `k` passes by following the `receiver` chain, summing player indices along the way. Keep track of the maximum sum.

<div class="code-group">

```python
# Time: O(n * k) | Space: O(1)
def brute_force(receiver, k):
    n = len(receiver)
    max_sum = 0

    for start in range(n):
        current = start
        total = 0

        for _ in range(k):
            total += current
            current = receiver[current]

        max_sum = max(max_sum, total)

    return max_sum
```

```javascript
// Time: O(n * k) | Space: O(1)
function bruteForce(receiver, k) {
  const n = receiver.length;
  let maxSum = 0;

  for (let start = 0; start < n; start++) {
    let current = start;
    let total = 0;

    for (let i = 0; i < k; i++) {
      total += current;
      current = receiver[current];
    }

    maxSum = Math.max(maxSum, total);
  }

  return maxSum;
}
```

```java
// Time: O(n * k) | Space: O(1)
public long bruteForce(int[] receiver, long k) {
    int n = receiver.length;
    long maxSum = 0;

    for (int start = 0; start < n; start++) {
        int current = start;
        long total = 0;

        for (long i = 0; i < k; i++) {
            total += current;
            current = receiver[current];
        }

        maxSum = Math.max(maxSum, total);
    }

    return maxSum;
}
```

</div>

**Why this fails:** With `n` up to 10⁵ and `k` up to 10¹⁰, this would take up to 10¹⁵ operations—far too slow. We need to handle large `k` efficiently.

## Optimized Approach

The key insight is that the ball passing forms a functional graph (each node has exactly one outgoing edge). After enough passes, the ball will enter a cycle. We need to efficiently compute:

1. Where we end up after `k` passes from any starting position
2. The sum of indices visited along the way

We can use **binary lifting** (also called "jump pointers" or "doubling technique"):

- Precompute `jump[p][i]` = where we end up after 2^p passes starting from player `i`
- Precompute `sum[p][i]` = sum of indices visited during those 2^p passes

Then for any `k`, we can break it down into powers of 2. For example, if `k = 13` (binary 1101), we use jumps of size 8, 4, and 1.

**Step-by-step reasoning:**

1. Determine the maximum power needed: `max_power = floor(log2(k))`
2. Precompute jumps and sums for all powers up to `max_power`
3. For each starting player, decompose `k` into binary and accumulate jumps/sums
4. Track the maximum sum across all starting positions

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * logk) | Space: O(n * logk)
def getMaxFunctionValue(receiver, k):
    n = len(receiver)

    # Find the maximum power of 2 needed (floor(log2(k)))
    max_power = k.bit_length()  # Number of bits needed to represent k

    # jump[p][i] = position after 2^p moves starting from i
    # sum[p][i] = sum of indices during those 2^p moves
    jump = [[0] * n for _ in range(max_power)]
    path_sum = [[0] * n for _ in range(max_power)]

    # Base case: 2^0 = 1 move
    for i in range(n):
        jump[0][i] = receiver[i]
        path_sum[0][i] = i  # We add the starting index before the move

    # Precompute jumps and sums for powers of 2
    for p in range(1, max_power):
        for i in range(n):
            # Jump 2^(p-1) from i, then another 2^(p-1) from there
            mid = jump[p-1][i]
            jump[p][i] = jump[p-1][mid]
            # Sum = sum of first half + sum of second half
            path_sum[p][i] = path_sum[p-1][i] + path_sum[p-1][mid]

    max_total = 0

    # Try each possible starting position
    for start in range(n):
        current_pos = start
        total = start  # Start by adding the starting player's index

        # Decompose k into powers of 2
        remaining_k = k
        power = 0

        while remaining_k > 0:
            if remaining_k & 1:  # If current bit is set
                # Add sum for 2^power moves from current position
                total += path_sum[power][current_pos]
                # Jump 2^power moves
                current_pos = jump[power][current_pos]

            remaining_k >>= 1  # Move to next bit
            power += 1

        max_total = max(max_total, total)

    return max_total
```

```javascript
// Time: O(n * logk) | Space: O(n * logk)
function getMaxFunctionValue(receiver, k) {
  const n = receiver.length;

  // Find the maximum power of 2 needed
  const maxPower = Math.floor(Math.log2(k)) + 1;

  // Initialize jump and sum arrays
  const jump = Array.from({ length: maxPower }, () => new Array(n).fill(0));
  const pathSum = Array.from({ length: maxPower }, () => new Array(n).fill(0));

  // Base case: 2^0 = 1 move
  for (let i = 0; i < n; i++) {
    jump[0][i] = receiver[i];
    pathSum[0][i] = i; // Add starting index
  }

  // Precompute jumps and sums for powers of 2
  for (let p = 1; p < maxPower; p++) {
    for (let i = 0; i < n; i++) {
      const mid = jump[p - 1][i];
      jump[p][i] = jump[p - 1][mid];
      pathSum[p][i] = pathSum[p - 1][i] + pathSum[p - 1][mid];
    }
  }

  let maxTotal = 0;

  // Try each possible starting position
  for (let start = 0; start < n; start++) {
    let currentPos = start;
    let total = BigInt(start); // Use BigInt to handle large sums

    // Decompose k into powers of 2
    let remainingK = k;
    let power = 0;

    while (remainingK > 0) {
      if (remainingK & 1) {
        // If current bit is set
        total += BigInt(pathSum[power][currentPos]);
        currentPos = jump[power][currentPos];
      }

      remainingK >>= 1; // Move to next bit
      power++;
    }

    if (total > maxTotal) {
      maxTotal = Number(total);
    }
  }

  return maxTotal;
}
```

```java
// Time: O(n * logk) | Space: O(n * logk)
public long getMaxFunctionValue(int[] receiver, long k) {
    int n = receiver.length;

    // Find the maximum power of 2 needed
    int maxPower = 0;
    long temp = k;
    while (temp > 0) {
        maxPower++;
        temp >>= 1;
    }

    // jump[p][i] = position after 2^p moves
    // sum[p][i] = sum during those 2^p moves
    int[][] jump = new int[maxPower][n];
    long[][] pathSum = new long[maxPower][n];

    // Base case: 2^0 = 1 move
    for (int i = 0; i < n; i++) {
        jump[0][i] = receiver[i];
        pathSum[0][i] = i;  // Add starting index
    }

    // Precompute jumps and sums for powers of 2
    for (int p = 1; p < maxPower; p++) {
        for (int i = 0; i < n; i++) {
            int mid = jump[p-1][i];
            jump[p][i] = jump[p-1][mid];
            pathSum[p][i] = pathSum[p-1][i] + pathSum[p-1][mid];
        }
    }

    long maxTotal = 0;

    // Try each possible starting position
    for (int start = 0; start < n; start++) {
        int currentPos = start;
        long total = start;  // Start with the starting player's index

        // Decompose k into powers of 2
        long remainingK = k;
        int power = 0;

        while (remainingK > 0) {
            if ((remainingK & 1) == 1) {  // If current bit is set
                total += pathSum[power][currentPos];
                currentPos = jump[power][currentPos];
            }

            remainingK >>= 1;  // Move to next bit
            power++;
        }

        maxTotal = Math.max(maxTotal, total);
    }

    return maxTotal;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log k)

- We precompute jumps and sums for log k powers (since we use powers of 2 up to the highest bit in k)
- For each power, we process all n players: O(n log k)
- Then for each starting player, we process log k bits: O(n log k)
- Total: O(n log k)

**Space Complexity:** O(n log k)

- We store jump and sum tables of size n × log k
- This is necessary for the binary lifting technique

## Common Mistakes

1. **Not handling large k:** Attempting to simulate passes linearly will timeout. Remember: when k is huge (up to 10¹⁰), think about logarithmic approaches like binary lifting.

2. **Off-by-one in sum calculation:** The sum should include the starting player's index. In our solution, we initialize `total = start` before processing jumps, then add sums from the precomputed tables which represent sums during jumps (not including the starting position).

3. **Incorrect power calculation:** The maximum power needed is floor(log₂(k)), not the value of k itself. Using `k.bit_length()` in Python or counting bits until k becomes 0 ensures we allocate the right amount of memory.

4. **Integer overflow:** The sum can exceed 32-bit integer limits. Use 64-bit integers (long in Java/C++, BigInt in JavaScript for very large values).

## When You'll See This Pattern

Binary lifting appears in problems where you need to:

- Traverse a functional graph (each node has exactly one outgoing edge) for many steps
- Answer queries about where you end up after k moves
- Compute aggregate values along paths of length k

Related problems:

1. **K-th Ancestor of a Tree Node (Hard)** - Uses binary lifting to find ancestors in logarithmic time
2. **Find the City With the Smallest Number of Neighbors at a Threshold Distance (Medium)** - Can be solved with a similar doubling technique for path queries
3. **Parallel Courses III (Hard)** - Uses topological sorting but similar concept of following dependencies

## Key Takeaways

1. **Binary lifting is your friend for large k:** When k is too large for linear simulation, consider breaking it into powers of 2. This reduces O(k) to O(log k).

2. **Functional graphs have predictable structure:** Each node has exactly one outgoing edge, guaranteeing eventual cycles. This structure enables efficient precomputation.

3. **Precompute powers of 2:** For problems with repeated identical operations, precomputing results for powers of 2 allows you to answer any k query by combining these precomputed results.

Related problems: [Jump Game VI](/problem/jump-game-vi)
