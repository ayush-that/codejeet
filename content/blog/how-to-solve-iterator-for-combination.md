---
title: "How to Solve Iterator for Combination — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Iterator for Combination. Medium difficulty, 72.7% acceptance rate. Topics: String, Backtracking, Design, Iterator."
date: "2027-10-28"
category: "dsa-patterns"
tags: ["iterator-for-combination", "string", "backtracking", "design", "medium"]
---

# How to Solve Iterator for Combination

You need to design an iterator that generates all combinations of length `k` from a sorted string of unique characters. The challenge is generating combinations in lexicographic order while maintaining efficient memory usage and supporting `next()` and `hasNext()` operations. What makes this interesting is balancing precomputation versus on-the-fly generation — you can't just generate all combinations upfront if `k` is large, but you need to efficiently find the "next" combination each time.

## Visual Walkthrough

Let's trace through `CombinationIterator("abc", 2)`:

**Initial state:** All length-2 combinations in lexicographic order:

1. "ab"
2. "ac"
3. "bc"

**Operations:**

- `hasNext()` → returns `true` (we have "ab" available)
- `next()` → returns "ab", moves to "ac"
- `hasNext()` → returns `true` (we have "ac" available)
- `next()` → returns "ac", moves to "bc"
- `hasNext()` → returns `true` (we have "bc" available)
- `next()` → returns "bc"
- `hasNext()` → returns `false` (no more combinations)

The tricky part is efficiently moving from one combination to the next. For example, after "ab", the next combination "ac" replaces the last character with the next available letter. After "ac", we can't just increment the last character (no letter after 'c'), so we need to backtrack: from "ac" to "bc" involves moving the first character from 'a' to 'b' and finding the smallest valid second character after 'b', which is 'c'.

## Brute Force Approach

A naive approach would precompute ALL combinations upfront using backtracking, store them in an array, and iterate through that array. While simple, this has a major flaw: the number of combinations is C(n, k) = n!/(k!(n-k)!), which grows exponentially. For n=15, k=7, that's 6,435 combinations — manageable. But for n=26, k=13, that's over 10 million combinations, consuming significant memory.

**Why this fails:** The problem constraints don't specify limits, so we should design for the worst case. Precomputing all combinations violates the spirit of an iterator, which should generate values on-demand. Also, the initialization would be O(C(n, k)) time, which could be prohibitively slow for large n and k.

## Optimized Approach

The key insight is that we can generate combinations **on-the-fly** using an index-based approach. We maintain an array of indices representing positions in the original string. For combination length k, we keep k indices: `indices[0] < indices[1] < ... < indices[k-1]`.

**How to get the next combination:**

1. Start from the rightmost index and try to increment it
2. If an index can't be incremented (it would go out of bounds or violate ordering), move left
3. Once we find an index we can increment, reset all indices to its right to the smallest valid values
4. Convert the indices to characters to form the combination

**Example with "abcde", k=3:**

- Current indices: [0,1,2] → "abc"
- Increment rightmost: [0,1,3] → "abd"
- Increment rightmost: [0,1,4] → "abe"
- Can't increment 4 (max is 4), move left: increment 1 to 2, reset right: [0,2,3] → "acd"

This approach uses O(k) space regardless of how many combinations exist, and `next()`/`hasNext()` run in O(k) time worst-case.

## Optimal Solution

We implement the index-based approach with careful boundary checking. The initialization sets up the first valid combination (indices 0 through k-1). Each call to `next()` generates the current combination, then updates indices to prepare for the next call.

<div class="code-group">

```python
# Time: O(k) for next() and hasNext(), O(k) for initialization
# Space: O(k) for storing indices
class CombinationIterator:
    def __init__(self, characters: str, combinationLength: int):
        # Store the original characters and combination length
        self.chars = characters
        self.k = combinationLength
        self.n = len(characters)

        # Initialize indices for the first combination: [0, 1, 2, ..., k-1]
        self.indices = list(range(self.k))

        # Flag to indicate if we have more combinations
        # We start with at least one combination if k <= n
        self.has_next = self.k <= self.n

    def next(self) -> str:
        # Build the current combination from indices
        result = ''.join(self.chars[i] for i in self.indices)

        # Find the rightmost index that can be incremented
        i = self.k - 1
        while i >= 0 and self.indices[i] == self.n - self.k + i:
            i -= 1

        if i >= 0:
            # Increment the found index
            self.indices[i] += 1
            # Reset all indices to the right to consecutive values
            for j in range(i + 1, self.k):
                self.indices[j] = self.indices[j-1] + 1
        else:
            # No more combinations available
            self.has_next = False

        return result

    def hasNext(self) -> bool:
        return self.has_next
```

```javascript
// Time: O(k) for next() and hasNext(), O(k) for initialization
// Space: O(k) for storing indices
class CombinationIterator {
  constructor(characters, combinationLength) {
    // Store the original characters and combination length
    this.chars = characters;
    this.k = combinationLength;
    this.n = characters.length;

    // Initialize indices for the first combination: [0, 1, 2, ..., k-1]
    this.indices = Array.from({ length: this.k }, (_, i) => i);

    // Flag to indicate if we have more combinations
    // We start with at least one combination if k <= n
    this.hasNextFlag = this.k <= this.n;
  }

  next() {
    // Build the current combination from indices
    let result = "";
    for (let i = 0; i < this.k; i++) {
      result += this.chars[this.indices[i]];
    }

    // Find the rightmost index that can be incremented
    let i = this.k - 1;
    while (i >= 0 && this.indices[i] === this.n - this.k + i) {
      i--;
    }

    if (i >= 0) {
      // Increment the found index
      this.indices[i]++;
      // Reset all indices to the right to consecutive values
      for (let j = i + 1; j < this.k; j++) {
        this.indices[j] = this.indices[j - 1] + 1;
      }
    } else {
      // No more combinations available
      this.hasNextFlag = false;
    }

    return result;
  }

  hasNext() {
    return this.hasNextFlag;
  }
}
```

```java
// Time: O(k) for next() and hasNext(), O(k) for initialization
// Space: O(k) for storing indices
class CombinationIterator {
    private String chars;
    private int k, n;
    private int[] indices;
    private boolean hasNextFlag;

    public CombinationIterator(String characters, int combinationLength) {
        // Store the original characters and combination length
        this.chars = characters;
        this.k = combinationLength;
        this.n = characters.length();

        // Initialize indices for the first combination: [0, 1, 2, ..., k-1]
        this.indices = new int[k];
        for (int i = 0; i < k; i++) {
            indices[i] = i;
        }

        // Flag to indicate if we have more combinations
        // We start with at least one combination if k <= n
        this.hasNextFlag = k <= n;
    }

    public String next() {
        // Build the current combination from indices
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < k; i++) {
            result.append(chars.charAt(indices[i]));
        }

        // Find the rightmost index that can be incremented
        int i = k - 1;
        while (i >= 0 && indices[i] == n - k + i) {
            i--;
        }

        if (i >= 0) {
            // Increment the found index
            indices[i]++;
            // Reset all indices to the right to consecutive values
            for (int j = i + 1; j < k; j++) {
                indices[j] = indices[j-1] + 1;
            }
        } else {
            // No more combinations available
            hasNextFlag = false;
        }

        return result.toString();
    }

    public boolean hasNext() {
        return hasNextFlag;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization:** O(k) to create the initial indices array
- **`next()`:** O(k) in the worst case when we need to backtrack through all indices. Building the string takes O(k), and updating indices takes O(k) in worst case.
- **`hasNext()`:** O(1) since we maintain a flag

**Space Complexity:** O(k) for storing the indices array. This is optimal since we need to track k positions regardless of approach.

The total time for generating all combinations is O(C(n,k) \* k), which is optimal since we need to output each character of each combination.

## Common Mistakes

1. **Precomputing all combinations:** As discussed, this uses O(C(n,k)) memory which can be enormous. Always consider the worst case (n=26, k=13 gives ~10M combinations).

2. **Incorrect index boundary check:** The condition `indices[i] == n - k + i` is crucial. Each index at position i has a maximum value of `n - k + i`. For example, with n=5, k=3: index[2] max is 4 (5-3+2), index[1] max is 3 (5-3+1), index[0] max is 2 (5-3+0).

3. **Forgetting to reset indices after incrementing:** When you increment `indices[i]`, all indices `i+1` through `k-1` must be reset to `indices[i]+1, indices[i]+2, ...` to maintain the smallest lexicographic combination.

4. **Not handling k > n or k = 0:** The problem states characters are distinct and sorted, but doesn't guarantee k ≤ n. Our solution handles this with `has_next = self.k <= self.n`.

## When You'll See This Pattern

This index-based generation technique appears in several combinatorial problems:

1. **Combinations (LeetCode 77)** - Generate all combinations of k numbers from 1 to n. The same index approach works, though that problem typically asks for all combinations at once rather than an iterator.

2. **Next Permutation (LeetCode 31)** - Finding the next lexicographic permutation uses similar logic: find the rightmost element that can be increased, then rearrange the suffix to be the smallest possible.

3. **Subsets (LeetCode 78)** - While subsets include all sizes, the pattern of systematically generating combinatorial objects using indices is similar.

The core pattern is **systematic enumeration using position pointers** — maintaining pointers to current positions and carefully advancing them to cover all possibilities in order.

## Key Takeaways

1. **Iterators should generate on-demand:** Avoid precomputing all results unless absolutely necessary. Design iterators to use minimal memory and compute values as needed.

2. **Index manipulation is powerful for combinations:** Representing a combination as k indices into the original array allows efficient next-value computation through careful incrementing and resetting.

3. **Lexicographic order often means right-to-left processing:** When generating next combination/permutation in order, typically work from the rightmost position backward to find the first position that can be increased.

[Practice this problem on CodeJeet](/problem/iterator-for-combination)
