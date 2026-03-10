---
title: "How to Solve Random Pick with Blacklist — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Random Pick with Blacklist. Hard difficulty, 34.6% acceptance rate. Topics: Array, Hash Table, Math, Binary Search, Sorting."
date: "2028-07-10"
category: "dsa-patterns"
tags: ["random-pick-with-blacklist", "array", "hash-table", "math", "hard"]
---

# How to Solve Random Pick with Blacklist

You need to design a system that picks random numbers from 0 to n-1, excluding certain blacklisted numbers. The challenge is that n can be up to 10^9, making it impossible to store all valid numbers in memory, yet you must ensure each valid number has equal probability of being chosen.

## Visual Walkthrough

Let's trace through an example: `n = 8`, `blacklist = [0, 4, 7]`

**Valid numbers:** We need to pick from numbers 0-7, excluding 0, 4, and 7. So valid numbers are: {1, 2, 3, 5, 6}

**Key insight:** Instead of storing all valid numbers, we can map blacklisted numbers in the lower valid range to valid numbers in the upper range.

Here's how it works:

1. Total valid numbers = n - len(blacklist) = 8 - 3 = 5
2. We'll pick a random index from 0 to 4 (5 valid numbers)
3. But we need to translate this index to an actual number in 0-7

**Mapping strategy:**

- Sort blacklist: [0, 4, 7]
- Valid range for our random index: 0-4
- For each blacklisted number in 0-4, map it to a valid number in 5-7

**Step-by-step mapping:**

1. Blacklisted numbers in 0-4: 0 and 4
2. Valid numbers in 5-7: 5, 6 (7 is blacklisted, so skip it)
3. Create mappings:
   - Map 0 → 5 (first valid in upper range)
   - Map 4 → 6 (next valid in upper range)

Now when we pick a random index from 0-4:

- If we get 0 → check mapping: 0 maps to 5 → return 5
- If we get 1 → no mapping → return 1
- If we get 2 → no mapping → return 2
- If we get 3 → no mapping → return 3
- If we get 4 → check mapping: 4 maps to 6 → return 6

All valid numbers {1, 2, 3, 5, 6} have equal probability!

## Brute Force Approach

The naive solution would be to:

1. Create a list of all valid numbers (0 to n-1 excluding blacklist)
2. Pick a random index from this list

<div class="code-group">

```python
import random

class Solution:
    def __init__(self, n: int, blacklist: List[int]):
        # Store all valid numbers
        self.valid_nums = []
        black_set = set(blacklist)
        for i in range(n):
            if i not in black_set:
                self.valid_nums.append(i)

    def pick(self) -> int:
        # Pick random index from valid numbers
        return random.choice(self.valid_nums)
```

```javascript
class Solution {
  constructor(n, blacklist) {
    // Store all valid numbers
    this.validNums = [];
    const blackSet = new Set(blacklist);
    for (let i = 0; i < n; i++) {
      if (!blackSet.has(i)) {
        this.validNums.push(i);
      }
    }
  }

  pick() {
    // Pick random index from valid numbers
    const idx = Math.floor(Math.random() * this.validNums.length);
    return this.validNums[idx];
  }
}
```

```java
import java.util.*;

class Solution {
    private List<Integer> validNums;
    private Random rand;

    public Solution(int n, int[] blacklist) {
        // Store all valid numbers
        validNums = new ArrayList<>();
        rand = new Random();
        Set<Integer> blackSet = new HashSet<>();
        for (int num : blacklist) {
            blackSet.add(num);
        }
        for (int i = 0; i < n; i++) {
            if (!blackSet.contains(i)) {
                validNums.add(i);
            }
        }
    }

    public int pick() {
        // Pick random index from valid numbers
        return validNums.get(rand.nextInt(validNums.size()));
    }
}
```

</div>

**Why this fails:** When n is up to 10^9, storing all valid numbers requires O(n) memory, which is impossible. The initialization would also take O(n) time, which is too slow.

## Optimized Approach

The key insight is that we don't need to store all valid numbers. We only need to:

1. Know how many valid numbers exist: `valid_count = n - len(blacklist)`
2. Map any blacklisted number in the "pickable range" (0 to valid_count-1) to a valid number outside this range

**Why this works:**

- We pick a random index `r` from 0 to `valid_count-1`
- If `r` is not blacklisted, we can return it directly
- If `r` is blacklisted, we need to map it to a valid number
- We only need to map blacklisted numbers in the range 0 to `valid_count-1`
- We map them to valid numbers in the range `valid_count` to `n-1`

**Step-by-step algorithm:**

1. Calculate `valid_count = n - len(blacklist)`
2. Create a set of blacklisted numbers for O(1) lookup
3. For each blacklisted number in 0 to `valid_count-1`:
   - Find the next available valid number starting from `valid_count`
   - Create a mapping from blacklisted number → valid number
4. To pick: generate random index in 0 to `valid_count-1`
   - If index is in mapping, return mapped value
   - Otherwise, return index itself

## Optimal Solution

<div class="code-group">

```python
import random
from typing import List

class Solution:
    def __init__(self, n: int, blacklist: List[int]):
        """
        Initialize the solution with total range n and blacklisted numbers.

        Time: O(b) where b = len(blacklist)
        Space: O(b) for the mapping and blacklist set
        """
        # Store the number of valid elements we can pick from
        self.valid_count = n - len(blacklist)

        # Convert blacklist to set for O(1) lookups
        black_set = set(blacklist)

        # Mapping from blacklisted numbers in [0, valid_count)
        # to valid numbers in [valid_count, n)
        self.mapping = {}

        # Start looking for replacement numbers from the end
        next_valid = n - 1

        # Only need to map blacklisted numbers in the pickable range
        for black_num in blacklist:
            # Skip if black_num is already outside our pickable range
            if black_num >= self.valid_count:
                continue

            # Find the next valid number from the end
            # Skip numbers that are blacklisted
            while next_valid in black_set:
                next_valid -= 1

            # Map the blacklisted number to a valid number
            self.mapping[black_num] = next_valid
            next_valid -= 1

    def pick(self) -> int:
        """
        Pick a random valid number with equal probability.

        Time: O(1) for random generation and hash map lookup
        Space: O(1) additional space
        """
        # Generate random index in [0, valid_count)
        rand_idx = random.randint(0, self.valid_count - 1)

        # If this index is blacklisted, return its mapped value
        # Otherwise, return the index itself (which is valid)
        return self.mapping.get(rand_idx, rand_idx)
```

```javascript
class Solution {
  /**
   * @param {number} n
   * @param {number[]} blacklist
   */
  constructor(n, blacklist) {
    // Store the number of valid elements we can pick from
    this.validCount = n - blacklist.length;

    // Convert blacklist to set for O(1) lookups
    const blackSet = new Set(blacklist);

    // Mapping from blacklisted numbers in [0, validCount)
    // to valid numbers in [validCount, n)
    this.mapping = new Map();

    // Start looking for replacement numbers from the end
    let nextValid = n - 1;

    // Only need to map blacklisted numbers in the pickable range
    for (const blackNum of blacklist) {
      // Skip if blackNum is already outside our pickable range
      if (blackNum >= this.validCount) {
        continue;
      }

      // Find the next valid number from the end
      // Skip numbers that are blacklisted
      while (blackSet.has(nextValid)) {
        nextValid--;
      }

      // Map the blacklisted number to a valid number
      this.mapping.set(blackNum, nextValid);
      nextValid--;
    }
  }

  /**
   * @return {number}
   */
  pick() {
    // Generate random index in [0, validCount)
    const randIdx = Math.floor(Math.random() * this.validCount);

    // If this index is blacklisted, return its mapped value
    // Otherwise, return the index itself (which is valid)
    return this.mapping.has(randIdx) ? this.mapping.get(randIdx) : randIdx;
  }
}
```

```java
import java.util.*;

class Solution {
    private int validCount;
    private Map<Integer, Integer> mapping;
    private Random rand;

    public Solution(int n, int[] blacklist) {
        // Store the number of valid elements we can pick from
        validCount = n - blacklist.length;

        // Convert blacklist to set for O(1) lookups
        Set<Integer> blackSet = new HashSet<>();
        for (int num : blacklist) {
            blackSet.add(num);
        }

        // Mapping from blacklisted numbers in [0, validCount)
        // to valid numbers in [validCount, n)
        mapping = new HashMap<>();
        rand = new Random();

        // Start looking for replacement numbers from the end
        int nextValid = n - 1;

        // Only need to map blacklisted numbers in the pickable range
        for (int blackNum : blacklist) {
            // Skip if blackNum is already outside our pickable range
            if (blackNum >= validCount) {
                continue;
            }

            // Find the next valid number from the end
            // Skip numbers that are blacklisted
            while (blackSet.contains(nextValid)) {
                nextValid--;
            }

            // Map the blacklisted number to a valid number
            mapping.put(blackNum, nextValid);
            nextValid--;
        }
    }

    public int pick() {
        // Generate random index in [0, validCount)
        int randIdx = rand.nextInt(validCount);

        // If this index is blacklisted, return its mapped value
        // Otherwise, return the index itself (which is valid)
        return mapping.getOrDefault(randIdx, randIdx);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization:** O(b) where b = length of blacklist. We process each blacklisted number once, and the while loop for finding next valid number processes each number at most once.
- **Pick operation:** O(1) for random generation and hash map lookup.

**Space Complexity:** O(b) for storing the blacklist set and the mapping. We store at most b entries in the mapping (one for each blacklisted number in the valid range).

## Common Mistakes

1. **Not handling large n:** Trying to store all valid numbers when n can be up to 10^9. This will cause memory limit exceeded errors.

2. **Incorrect mapping range:** Mapping ALL blacklisted numbers instead of only those in 0 to `valid_count-1`. Blacklisted numbers in `valid_count` to `n-1` don't need mapping since we never pick them.

3. **Forgetting to skip blacklisted numbers when finding replacements:** When looking for a valid number in the upper range to map to, you must skip numbers that are also blacklisted.

4. **Not using a set for blacklist lookup:** Using linear search to check if a number is blacklisted results in O(b) time per check, making initialization O(b²).

5. **Off-by-one errors with ranges:** The random index should be in `[0, valid_count-1]`, not `[0, n-1]`. Confusing these ranges leads to incorrect probabilities.

## When You'll See This Pattern

This "remapping" or "reindexing" pattern appears in problems where you need to:

1. Work with a sparse set of valid elements
2. Generate random elements with equal probability
3. Handle exclusions or constraints efficiently

**Related problems:**

- **Random Pick with Weight (Medium):** Similar concept of mapping random numbers to weighted indices using prefix sums.
- **Random Pick Index (Medium):** Picking random indices that match a target value from a stream.
- **Insert Delete GetRandom O(1) (Medium):** Maintaining a data structure that supports random access to valid elements.

The core technique of creating a compressed representation of valid elements is useful whenever the full range is too large to store but the number of invalid elements is manageable.

## Key Takeaways

1. **Think in terms of valid ranges, not individual elements:** When n is large but the number of exclusions is small, work with the size of the valid set rather than the elements themselves.

2. **Mapping is more efficient than filtering:** Instead of filtering out invalid elements, map the invalid ones in your working range to valid ones elsewhere.

3. **Probability preservation is key:** The trick to maintaining equal probability is ensuring each valid number corresponds to exactly one random index in 0 to `valid_count-1`.

4. **Hash maps enable O(1) remapping:** The mapping from blacklisted to valid numbers needs to be O(1) for the pick operation to be efficient.

Related problems: [Random Pick Index](/problem/random-pick-index), [Random Pick with Weight](/problem/random-pick-with-weight), [Find Unique Binary String](/problem/find-unique-binary-string)
