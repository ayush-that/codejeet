---
title: "How to Solve Random Flip Matrix — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Random Flip Matrix. Medium difficulty, 45.4% acceptance rate. Topics: Hash Table, Math, Reservoir Sampling, Randomized."
date: "2029-05-03"
category: "dsa-patterns"
tags: ["random-flip-matrix", "hash-table", "math", "reservoir-sampling", "medium"]
---

# How to Solve Random Flip Matrix

You're given an `m x n` binary matrix initially filled with zeros. You need to design an algorithm that randomly selects a zero cell, flips it to one, and returns its coordinates. The tricky part: every zero cell must have equal probability of being chosen each time, and you need to do this efficiently even after many flips.

The challenge is that as you flip more cells, the number of zeros decreases, but you still need to maintain uniform randomness without scanning the entire matrix each time. This is essentially a reservoir sampling problem where the "reservoir" shrinks over time.

## Visual Walkthrough

Let's trace through a 2×3 matrix (m=2, n=3) step by step:

**Initial state:** All 6 cells are zeros.

```
Indices: (0,0) (0,1) (0,2)
         (1,0) (1,1) (1,2)
```

**First flip:** We have 6 zeros. Generate random number between 0-5. Say we get 3. We need to map 3 to a coordinate:

- Row = 3 // 3 = 1
- Col = 3 % 3 = 0
  So we flip (1,0) to 1.

**Second flip:** Now we have 5 zeros left. Generate random number between 0-4. Say we get 2:

- Row = 2 // 3 = 0
- Col = 2 % 3 = 2
  Flip (0,2) to 1.

**Third flip:** 4 zeros left. Random number 0-3. Say we get 3:

- Row = 3 // 3 = 1
- Col = 3 % 3 = 0
  But wait! (1,0) is already flipped! This is the problem: we can't just use the original mapping because some positions are already taken.

The key insight: we need to maintain a mapping from random indices to actual available positions, updating it as positions get filled.

## Brute Force Approach

The most straightforward approach is to:

1. Collect all zero positions into a list
2. Randomly pick one
3. Remove it from the list (or mark it as flipped)

This works, but it's inefficient. For an m×n matrix:

- **Space:** O(m×n) to store all positions
- **Time:** O(m×n) to initialize, O(1) to pick, but O(n) to remove from list if using array

The real problem comes when we need to remove elements. If we use an array, removal is O(n). If we use a set, we can't randomly sample efficiently. After k flips, we'd have spent O(k²) time in total.

Here's what the brute force might look like:

```python
class SolutionBruteForce:
    def __init__(self, m: int, n: int):
        self.m = m
        self.n = n
        self.zeros = [(i, j) for i in range(m) for j in range(n)]

    def flip(self):
        import random
        idx = random.randint(0, len(self.zeros) - 1)
        chosen = self.zeros[idx]
        # Remove the chosen element - O(n) operation!
        self.zeros[idx] = self.zeros[-1]
        self.zeros.pop()
        return chosen

    def reset(self):
        self.zeros = [(i, j) for i in range(self.m) for j in range(self.n)]
```

This becomes problematic for large matrices (like 10,000×10,000 with 100 million cells) where even storing all positions is impossible.

## Optimized Approach

The optimal solution uses a **hash map with virtual indexing**. Here's the key insight:

1. Instead of storing all positions, we treat the matrix as a linear array of size `total = m × n`
2. We maintain a mapping from "virtual index" to "actual index"
3. When we pick a random index `r` between 0 and `remaining-1`, we check:
   - If `r` is in our map, it means this position was previously chosen and swapped
   - We use the mapped value as the actual position
   - Otherwise, `r` itself is the actual position
4. We then map the last position (`remaining-1`) to whatever `r` now points to
5. Decrement `remaining` to shrink our virtual array

This is essentially the **Fisher-Yates shuffle algorithm** applied incrementally. We're maintaining a partial shuffle of the indices, where the first `remaining` positions represent the unflipped cells.

**Why this works:**

- Each flip operation is O(1) on average (hash map operations)
- We only store mappings for cells that have been flipped
- The probability distribution remains uniform because we're effectively doing reservoir sampling

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
import random

class Solution:
    def __init__(self, m: int, n: int):
        """
        Initialize the RandomFlipMatrix.

        Args:
            m: Number of rows in the matrix
            n: Number of columns in the matrix
        """
        self.m = m
        self.n = n
        self.total = m * n  # Total number of cells
        self.remaining = self.total  # Number of zeros remaining
        # Map from virtual index to actual index
        # When we pick index i, if i is in map, use map[i] as actual position
        # Otherwise, i itself is the actual position
        self.map = {}

    def flip(self):
        """
        Randomly flip a zero to one and return its coordinates.

        Returns:
            List[int]: [row, column] of the flipped cell
        """
        # Generate random index from 0 to remaining-1
        rand_idx = random.randint(0, self.remaining - 1)

        # Get the actual index: if rand_idx was swapped before, use the mapped value
        # Otherwise, use rand_idx itself
        actual_idx = self.map.get(rand_idx, rand_idx)

        # Swap: map the last element (remaining-1) to whatever actual_idx points to
        # This ensures we don't pick the same position twice
        last_idx = self.remaining - 1
        self.map[rand_idx] = self.map.get(last_idx, last_idx)

        # Decrease remaining count
        self.remaining -= 1

        # Convert linear index to 2D coordinates
        row = actual_idx // self.n
        col = actual_idx % self.n

        return [row, col]

    def reset(self):
        """
        Reset all cells to zero.
        """
        self.remaining = self.total
        self.map.clear()  # Clear all mappings
```

```javascript
class Solution {
  /**
   * @param {number} m
   * @param {number} n
   */
  constructor(m, n) {
    this.m = m;
    this.n = n;
    this.total = m * n; // Total number of cells
    this.remaining = this.total; // Number of zeros remaining
    // Map from virtual index to actual index
    this.map = new Map();
  }

  /**
   * @return {number[]}
   */
  flip() {
    // Generate random index from 0 to remaining-1
    const randIdx = Math.floor(Math.random() * this.remaining);

    // Get actual index: if randIdx was swapped before, use mapped value
    // Otherwise, use randIdx itself
    const actualIdx = this.map.get(randIdx) ?? randIdx;

    // Swap: map the last element (remaining-1) to whatever actualIdx points to
    const lastIdx = this.remaining - 1;
    this.map.set(randIdx, this.map.get(lastIdx) ?? lastIdx);

    // Decrease remaining count
    this.remaining--;

    // Convert linear index to 2D coordinates
    const row = Math.floor(actualIdx / this.n);
    const col = actualIdx % this.n;

    return [row, col];
  }

  /**
   * @return {void}
   */
  reset() {
    this.remaining = this.total;
    this.map.clear(); // Clear all mappings
  }
}
```

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

class Solution {
    private int m;
    private int n;
    private int total;
    private int remaining;
    private Map<Integer, Integer> map;
    private Random random;

    public Solution(int m, int n) {
        this.m = m;
        this.n = n;
        this.total = m * n;
        this.remaining = total;
        this.map = new HashMap<>();
        this.random = new Random();
    }

    public int[] flip() {
        // Generate random index from 0 to remaining-1
        int randIdx = random.nextInt(remaining);

        // Get actual index: if randIdx was swapped before, use mapped value
        // Otherwise, use randIdx itself
        int actualIdx = map.getOrDefault(randIdx, randIdx);

        // Swap: map the last element (remaining-1) to whatever actualIdx points to
        int lastIdx = remaining - 1;
        map.put(randIdx, map.getOrDefault(lastIdx, lastIdx));

        // Decrease remaining count
        remaining--;

        // Convert linear index to 2D coordinates
        int row = actualIdx / n;
        int col = actualIdx % n;

        return new int[]{row, col};
    }

    public void reset() {
        remaining = total;
        map.clear();  // Clear all mappings
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `__init__` / `constructor`: O(1) - just initialization
- `flip()`: O(1) average case - hash map operations are O(1) on average
- `reset()`: O(k) where k is number of flipped cells (to clear the map), or O(1) if we just reset counters and let old mappings be overwritten

**Space Complexity:**

- O(k) where k is the number of flipped cells - we only store mappings for cells that have been flipped
- In worst case (all cells flipped), O(m×n), but this is still better than brute force which would store all positions upfront

The key advantage: we only use memory proportional to the number of flips performed, not the total matrix size.

## Common Mistakes

1. **Forgetting to update the mapping for the swapped element**: When you pick index `r` and swap it with the last element, you must update the mapping for `r` to point to whatever the last element maps to. Otherwise, you lose track of where the last element went.

2. **Using the wrong random range**: You must generate random numbers between 0 and `remaining-1` (inclusive), not between 0 and `total-1`. As `remaining` decreases, so does your sampling pool.

3. **Not handling the case where the last element is already mapped**: When swapping, you need to check if `remaining-1` is already in the map. Use `map.get(lastIdx, lastIdx)` or equivalent to handle both cases.

4. **Inefficient reset implementation**: Don't recreate the entire matrix or list of zeros. Just reset the counter and clear the map. The old mappings will be overwritten as needed.

## When You'll See This Pattern

This virtual indexing with hash map technique appears in several randomization and sampling problems:

1. **Random Pick with Blacklist (LeetCode 710)**: Similar concept where you have a blacklist of indices you can't pick, and you need to map "virtual" indices to "actual" valid indices.

2. **Shuffle an Array (LeetCode 384)**: The Fisher-Yates shuffle algorithm uses similar swapping logic, though it shuffles the entire array at once rather than incrementally.

3. **Insert Delete GetRandom O(1) (LeetCode 380)**: Uses a similar combination of hash map and array to achieve O(1) random access while supporting deletion.

The core pattern: when you need to sample from a shrinking set without scanning, maintain a mapping between "virtual" positions (which are contiguous) and "actual" positions (which may have gaps).

## Key Takeaways

1. **Virtual indexing is powerful for sampling from shrinking sets**: By maintaining a mapping between contiguous virtual indices and actual positions, you can sample uniformly in O(1) time without scanning.

2. **Fisher-Yates shuffle can be applied incrementally**: You don't need to shuffle the entire array upfront. You can maintain a partial shuffle where the first `k` elements represent the sampled portion.

3. **Hash maps enable O(1) remapping**: The key to making this work efficiently is using a hash map to track which indices have been swapped and where they now point.

[Practice this problem on CodeJeet](/problem/random-flip-matrix)
