---
title: "How to Solve Shuffle an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shuffle an Array. Medium difficulty, 59.6% acceptance rate. Topics: Array, Math, Design, Randomized."
date: "2027-08-13"
category: "dsa-patterns"
tags: ["shuffle-an-array", "array", "math", "design", "medium"]
---

# How to Solve Shuffle an Array

This problem asks us to design an algorithm that can shuffle an array randomly, with every possible permutation being equally likely. What makes this problem interesting is that it tests your understanding of probability theory and your ability to implement a correct randomization algorithm. The challenge isn't just about shuffling—it's about ensuring the shuffle is truly random and unbiased.

## Visual Walkthrough

Let's walk through the Fisher-Yates shuffle algorithm (also known as the Knuth shuffle) with a concrete example. Suppose we have the array `[1, 2, 3, 4]`.

**Step 1:** Start with the last element (index 3). Pick a random index from 0 to 3 (inclusive). Let's say we randomly pick index 1. Swap elements at index 3 and index 1:

- Array becomes `[1, 4, 3, 2]`

**Step 2:** Move to the second-to-last element (index 2). Pick a random index from 0 to 2 (inclusive). Let's say we randomly pick index 0. Swap elements at index 2 and index 0:

- Array becomes `[3, 4, 1, 2]`

**Step 3:** Move to index 1. Pick a random index from 0 to 1 (inclusive). Let's say we randomly pick index 1 (itself). No change:

- Array remains `[3, 4, 1, 2]`

**Step 4:** Index 0 only has itself to swap with, so we're done.

The key insight is that at each step, we're choosing uniformly from the remaining unshuffled elements, which guarantees that every permutation is equally likely.

## Brute Force Approach

A naive approach might be to generate all possible permutations of the array, then randomly select one. While this would produce a uniformly random shuffle, it's extremely inefficient:

1. Generate all n! permutations (exponential time)
2. Randomly pick one permutation

The space complexity would be O(n × n!) to store all permutations, and the time complexity would be O(n!) just to generate them. For an array of just 10 elements, that's 3.6 million permutations!

Another incorrect approach some candidates try is to repeatedly swap random pairs of elements. While this might look random, it doesn't guarantee uniform distribution. Some permutations would be more likely than others, which violates the problem requirements.

## Optimized Approach

The optimal solution uses the **Fisher-Yates shuffle algorithm**, which runs in O(n) time and O(1) space (or O(n) if we need to preserve the original array).

**Key Insight:** The algorithm works by iterating through the array from back to front. At each position `i`, we:

1. Generate a random index `j` between 0 and `i` (inclusive)
2. Swap the elements at positions `i` and `j`

Why does this work? At each step, we're selecting uniformly from the elements that haven't been "fixed" yet. The element at position `i` after the swap becomes part of the shuffled suffix of the array. This process guarantees that every permutation has exactly 1/n! probability.

**Why from back to front?** We could also go from front to back, but the standard implementation goes backward because it's slightly simpler—we always pick from the unshuffled portion at the beginning of the array.

## Optimal Solution

<div class="code-group">

```python
import random
from typing import List

class Solution:
    """
    Time Complexity:
    - __init__: O(n) for copying the array
    - reset: O(n) for copying the array
    - shuffle: O(n) for the Fisher-Yates algorithm

    Space Complexity: O(n) for storing the original array
    """

    def __init__(self, nums: List[int]):
        # Store the original array for reset functionality
        self.original = nums.copy()
        # Keep a working array for shuffling
        self.array = nums.copy()

    def reset(self) -> List[int]:
        """
        Reset the array to its original configuration.
        We need to copy the original array to avoid modifying it.
        """
        self.array = self.original.copy()
        return self.array

    def shuffle(self) -> List[int]:
        """
        Returns a random shuffling of the array using Fisher-Yates algorithm.
        The algorithm guarantees uniform random permutation.
        """
        # Fisher-Yates shuffle: iterate from last to first element
        for i in range(len(self.array) - 1, 0, -1):
            # Generate a random index between 0 and i (inclusive)
            j = random.randint(0, i)
            # Swap elements at positions i and j
            self.array[i], self.array[j] = self.array[j], self.array[i]

        return self.array
```

```javascript
/**
 * Time Complexity:
 * - constructor: O(n) for copying the array
 * - reset: O(n) for copying the array
 * - shuffle: O(n) for the Fisher-Yates algorithm
 *
 * Space Complexity: O(n) for storing the original array
 */

class Solution {
  /**
   * @param {number[]} nums
   */
  constructor(nums) {
    // Store the original array for reset functionality
    this.original = [...nums];
    // Keep a working array for shuffling
    this.array = [...nums];
  }

  /**
   * Resets the array to its original configuration and returns it.
   * @return {number[]}
   */
  reset() {
    // Copy the original array to avoid modifying it
    this.array = [...this.original];
    return this.array;
  }

  /**
   * Returns a random shuffling of the array.
   * Uses Fisher-Yates algorithm for uniform random permutation.
   * @return {number[]}
   */
  shuffle() {
    // Fisher-Yates shuffle: iterate from last to first element
    for (let i = this.array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at positions i and j
      [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    }

    return this.array;
  }
}
```

```java
import java.util.Random;

class Solution {
    private int[] original;
    private int[] array;
    private Random random;

    /**
     * Time Complexity:
     * - constructor: O(n) for copying the array
     * - reset: O(n) for copying the array
     * - shuffle: O(n) for the Fisher-Yates algorithm
     *
     * Space Complexity: O(n) for storing the original array
     */

    public Solution(int[] nums) {
        // Store the original array for reset functionality
        this.original = nums.clone();
        // Keep a working array for shuffling
        this.array = nums.clone();
        // Initialize random number generator
        this.random = new Random();
    }

    /** Resets the array to its original configuration and returns it. */
    public int[] reset() {
        // Copy the original array to avoid modifying it
        this.array = this.original.clone();
        return this.array;
    }

    /** Returns a random shuffling of the array. */
    public int[] shuffle() {
        // Fisher-Yates shuffle: iterate from last to first element
        for (int i = array.length - 1; i > 0; i--) {
            // Generate a random index between 0 and i (inclusive)
            int j = random.nextInt(i + 1);
            // Swap elements at positions i and j
            int temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `__init__` / constructor: O(n) to copy the input array
- `reset()`: O(n) to copy the original array
- `shuffle()`: O(n) for the Fisher-Yates algorithm (one pass through the array)

**Space Complexity:**

- O(n) to store the original array and working array
- The Fisher-Yates algorithm itself uses O(1) extra space for swapping, but we need O(n) to preserve the original array for the `reset()` operation

The O(n) time for shuffling is optimal because we need to touch every element at least once to shuffle the entire array.

## Common Mistakes

1. **Using the wrong random range:** A common mistake is using `random.randint(0, len(array)-1)` instead of `random.randint(0, i)`. This would make the shuffle non-uniform because elements could be swapped multiple times, creating bias toward certain permutations.

2. **Modifying the original array:** Forgetting to copy the original array in the constructor or reset method means subsequent calls to `reset()` won't return the true original array. Always use `.copy()` in Python, `[...array]` in JavaScript, or `.clone()` in Java.

3. **Shuffling forward incorrectly:** If implementing the forward version of Fisher-Yates (from i=0 to n-1), you must pick j from i to n-1, not 0 to n-1. Picking from the entire array creates bias.

4. **Using poor random number generation:** Some languages have `Math.random()` that returns a float between 0 (inclusive) and 1 (exclusive). When converting to an integer index, ensure you use `Math.floor(Math.random() * (i + 1))` not `Math.round()` which has edge case issues.

## When You'll See This Pattern

The Fisher-Yates shuffle pattern appears in problems requiring random sampling or permutation generation:

1. **Random Pick Index (LeetCode 398)** - Uses reservoir sampling, which shares the "pick uniformly from remaining elements" concept with Fisher-Yates.

2. **Random Pick with Weight (LeetCode 528)** - While not using Fisher-Yates directly, it deals with weighted random selection, another fundamental randomization concept.

3. **Generate Random Point in a Circle (LeetCode 478)** - Tests understanding of uniform random distribution in geometric contexts.

The core concept of "pick uniformly from remaining options" applies to many randomization problems beyond just array shuffling.

## Key Takeaways

1. **Fisher-Yates guarantees uniform randomness** by selecting each element's final position from the remaining unplaced elements. This is mathematically proven to generate all permutations with equal probability.

2. **Always copy arrays when preservation is needed** - In-place algorithms modify the original data, so if you need to reference or reset to the original state, make copies.

3. **Random number generation has subtle edge cases** - Pay close attention to inclusive/exclusive bounds when generating random indices. Off-by-one errors here can completely break the uniformity of your shuffle.

[Practice this problem on CodeJeet](/problem/shuffle-an-array)
