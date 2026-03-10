---
title: "How to Solve RLE Iterator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode RLE Iterator. Medium difficulty, 59.2% acceptance rate. Topics: Array, Design, Counting, Iterator."
date: "2027-09-10"
category: "dsa-patterns"
tags: ["rle-iterator", "array", "design", "counting", "medium"]
---

# How to Solve RLE Iterator

The RLE Iterator problem asks us to design an iterator that sequentially returns elements from a run-length encoded array. The challenge is that we need to efficiently handle repeated calls to `next(n)` where `n` can be any positive integer, and we must skip over exhausted runs while maintaining our position in the encoding. What makes this interesting is that we're not decoding the entire array (which could be huge), but instead simulating traversal through the compressed representation.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `encoding = [3, 8, 0, 9, 2, 5]` and we create an iterator with it.

The encoding represents: `[8, 8, 8, 5, 5]` (since 0,9 means zero 9's, so we skip it).

Now let's call `next()` operations:

1. **Initial state**: Current position at index 0 (count=3, value=8)
2. **next(2)**: We need 2 elements. The current run has 3 eights available. We take 2 of them, leaving 1 eight in this run. Returns `8`.
3. **next(1)**: We need 1 element. The current run still has 1 eight left. We take it, exhausting this run. Move to next valid run (skip index 2,3 since count=0). Now at index 4 (count=2, value=5). Returns `8`.
4. **next(1)**: We need 1 element. Current run has 2 fives available. We take 1, leaving 1 five. Returns `5`.
5. **next(2)**: We need 2 elements. Current run has only 1 five left. We take it, exhausting this run. No more runs left. Returns `-1`.

The key insight: we need to track our current position in the encoding and how many elements are left in the current run. When a run is exhausted, we skip to the next one (and skip any runs with zero count).

## Brute Force Approach

A naive approach would be to fully decode the entire RLE array into an expanded list, then implement a simple iterator over it:

1. Decode the entire encoding into a flat list
2. Keep an index pointer into this list
3. For `next(n)`, check if index + n exceeds the list length
4. If not, return the element at index + n - 1 and advance the index by n
5. If it exceeds, return -1 and don't advance

**Why this fails**: The problem states that `encoding.length` can be up to 1000, but the decoded array could be enormous (if we have large counts). For example, `[1000000, 1]` would require creating a list with 1 million elements, which is both memory-intensive and slow to initialize. The constraints require us to work directly with the compressed representation.

## Optimized Approach

The optimal solution works directly with the compressed encoding without expanding it. The key insight is that we only need to track:

1. **Current index** in the encoding array (pointing to a count)
2. **Remaining count** for the current run

When we call `next(n)`:

- We start consuming from the current run
- If the current run doesn't have enough elements, we move to the next run and continue consuming
- We skip any runs with zero count
- If we exhaust all runs before getting n elements, return -1
- Otherwise, return the value from the last run we touched

This approach is efficient because:

- We never expand the full array
- Each `next()` call processes at most O(k) runs where k is the number of runs
- Memory usage is O(1) beyond the input storage

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(k) per next() call where k is number of runs
# Space: O(1) additional space
class RLEIterator:
    def __init__(self, encoding: List[int]):
        # Store the encoding
        self.encoding = encoding
        # Current index in encoding (points to a count)
        self.index = 0
        # Remaining count for current run
        self.remaining = 0 if len(encoding) == 0 else encoding[0]

    def next(self, n: int) -> int:
        # We need to consume n elements
        while n > 0 and self.index < len(self.encoding):
            # If current run has enough elements
            if self.remaining >= n:
                # Consume n elements from current run
                self.remaining -= n
                # Return the value of current run
                return self.encoding[self.index + 1]
            else:
                # Current run doesn't have enough
                # Consume all remaining elements in this run
                n -= self.remaining
                # Move to next run (skip by 2 since encoding is pairs)
                self.index += 2
                # If there's a next run, update remaining
                if self.index < len(self.encoding):
                    self.remaining = self.encoding[self.index]
                else:
                    self.remaining = 0

        # If we exit loop without returning, we don't have enough elements
        return -1
```

```javascript
// Time: O(k) per next() call where k is number of runs
// Space: O(1) additional space
class RLEIterator {
  constructor(encoding) {
    // Store the encoding
    this.encoding = encoding;
    // Current index in encoding (points to a count)
    this.index = 0;
    // Remaining count for current run
    this.remaining = encoding.length === 0 ? 0 : encoding[0];
  }

  next(n) {
    // We need to consume n elements
    while (n > 0 && this.index < this.encoding.length) {
      // If current run has enough elements
      if (this.remaining >= n) {
        // Consume n elements from current run
        this.remaining -= n;
        // Return the value of current run
        return this.encoding[this.index + 1];
      } else {
        // Current run doesn't have enough
        // Consume all remaining elements in this run
        n -= this.remaining;
        // Move to next run (skip by 2 since encoding is pairs)
        this.index += 2;
        // If there's a next run, update remaining
        if (this.index < this.encoding.length) {
          this.remaining = this.encoding[this.index];
        } else {
          this.remaining = 0;
        }
      }
    }

    // If we exit loop without returning, we don't have enough elements
    return -1;
  }
}
```

```java
// Time: O(k) per next() call where k is number of runs
// Space: O(1) additional space
class RLEIterator {
    private int[] encoding;
    private int index;
    private int remaining;

    public RLEIterator(int[] encoding) {
        // Store the encoding
        this.encoding = encoding;
        // Current index in encoding (points to a count)
        this.index = 0;
        // Remaining count for current run
        this.remaining = encoding.length == 0 ? 0 : encoding[0];
    }

    public int next(int n) {
        // We need to consume n elements
        while (n > 0 && index < encoding.length) {
            // If current run has enough elements
            if (remaining >= n) {
                // Consume n elements from current run
                remaining -= n;
                // Return the value of current run
                return encoding[index + 1];
            } else {
                // Current run doesn't have enough
                // Consume all remaining elements in this run
                n -= remaining;
                // Move to next run (skip by 2 since encoding is pairs)
                index += 2;
                // If there's a next run, update remaining
                if (index < encoding.length) {
                    remaining = encoding[index];
                } else {
                    remaining = 0;
                }
            }
        }

        // If we exit loop without returning, we don't have enough elements
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Constructor: O(1) - just stores references and initializes pointers
- `next(n)`: O(k) in the worst case, where k is the number of runs (encoding.length/2)
  - In the worst case, we might traverse through all runs if n is very large
  - However, each run is visited at most once across all `next()` calls
  - Amortized analysis shows O(1) per element returned

**Space Complexity:**

- O(1) additional space beyond the input storage
- We only store: current index, remaining count, and a reference to the encoding
- No expansion of the compressed data

## Common Mistakes

1. **Not handling zero-count runs properly**: Some implementations forget that runs with count=0 should be skipped entirely. If you don't skip them, you might return values that shouldn't exist.

2. **Incorrect index arithmetic**: Since encoding stores pairs (count, value), you need to increment by 2 when moving to the next run. A common error is incrementing by 1 and getting out of sync.

3. **Forgetting to update remaining when moving to a new run**: After exhausting a run, you must check if there's another run and update the remaining count. Missing this leads to using stale remaining values.

4. **Not handling the case where n consumes exactly the remaining count**: When `n == remaining`, you should return the current value and move to the next run on the subsequent call. Some implementations fail to move to the next run in this boundary case.

## When You'll See This Pattern

This "compressed traversal" pattern appears in several problems where you need to iterate over data without fully expanding it:

1. **284. Peeking Iterator** - Similar iterator design pattern but with peek functionality
2. **341. Flatten Nested List Iterator** - Traversing nested structure without fully flattening
3. **900. RLE Iterator** - The exact same problem
4. **157. Read N Characters Given Read4** - Reading from a stream in chunks without buffering everything

The core technique is maintaining state (current position, remaining count) and processing data incrementally rather than all at once. This is essential for handling large or streaming data efficiently.

## Key Takeaways

1. **Work with compressed representations directly**: When data is compressed (like RLE), you can often process it without decompressing, saving both time and memory.

2. **Maintain minimal state for iteration**: For iterator problems, you typically only need to track your current position and any auxiliary state (like remaining count in current run).

3. **Handle boundary conditions carefully**: Zero-count runs, exact consumption of runs, and end-of-data conditions are where most bugs occur. Test these edge cases explicitly.

[Practice this problem on CodeJeet](/problem/rle-iterator)
