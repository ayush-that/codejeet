---
title: "How to Solve Find Consecutive Integers from a Data Stream — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Consecutive Integers from a Data Stream. Medium difficulty, 50.8% acceptance rate. Topics: Hash Table, Design, Queue, Counting, Data Stream."
date: "2029-01-14"
category: "dsa-patterns"
tags: ["find-consecutive-integers-from-a-data-stream", "hash-table", "design", "queue", "medium"]
---

# How to Solve Find Consecutive Integers from a Data Stream

This problem asks you to design a data structure that tracks a stream of integers and determines whether the last `k` integers are all equal to a given `value`. The challenge lies in efficiently checking this condition as new numbers arrive in real-time, without repeatedly scanning the last `k` elements. This is a classic data stream problem that tests your ability to maintain state incrementally.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we create a `DataStream` with `value = 5` and `k = 3`.

**Initialization**: `value = 5`, `k = 3`, count = 0 (no numbers processed yet)

**Stream events**:

1. `consec(5)` arrives
   - Last number is 5, which matches our target value
   - Increment count: count = 1
   - Check if count ≥ k? 1 ≥ 3? No → return `false`
2. `consec(5)` arrives
   - Last number is 5 (matches)
   - Increment count: count = 2
   - Check: 2 ≥ 3? No → return `false`
3. `consec(5)` arrives
   - Last number is 5 (matches)
   - Increment count: count = 3
   - Check: 3 ≥ 3? Yes → return `true`
     (Now the last 3 numbers are all 5)

4. `consec(2)` arrives
   - Last number is 2 (does NOT match target value 5)
   - Reset count to 0 (the streak is broken)
   - Check: 0 ≥ 3? No → return `false`

5. `consec(5)` arrives
   - Last number is 5 (matches)
   - Increment count: count = 1
   - Check: 1 ≥ 3? No → return `false`

The key insight: we don't need to store all the numbers or repeatedly check the last k elements. We just need to track how many consecutive matching values we've seen ending at the current position.

## Brute Force Approach

A naive approach would store all incoming numbers and, for each call to `consec`, check the last `k` elements (if they exist) to see if they all equal `value`.

**Why this fails**:

- **Time Complexity**: Each `consec` call would take O(k) time to check the last k elements
- **Space Complexity**: We'd store all elements from the stream, using O(n) space where n is the total stream length
- **Inefficiency**: We're doing redundant work by re-checking elements we've already examined

While this would technically work for small k, it doesn't scale well and misses the opportunity for optimization that interviewers expect.

## Optimized Approach

The optimal solution uses a **counter-based approach** with a clever reset mechanism:

1. **Maintain a counter** that tracks how many consecutive `value` elements we've seen ending at the current position
2. **When a matching value arrives**: increment the counter
3. **When a non-matching value arrives**: reset the counter to 0 (the streak is broken)
4. **Check condition**: return `true` if counter ≥ k, otherwise `false`

**Why this works**:

- We only care about whether the last k elements match `value`
- If we see any element ≠ `value`, the condition becomes impossible until we see k consecutive matching values again
- The counter tells us the length of the current matching streak
- When counter ≥ k, we know the last k elements (and possibly more) all match `value`

**Edge case handling**: What if k is 0? The problem states k ≥ 1, but good code handles edge cases. If k=0, we'd always return true since "last 0 elements" is vacuously true.

## Optimal Solution

Here's the complete implementation using the counter-based approach:

<div class="code-group">

```python
class DataStream:
    """
    Time Complexity:
    - __init__: O(1)
    - consec: O(1) per call

    Space Complexity: O(1) - we only store a few integers
    """

    def __init__(self, value: int, k: int):
        """
        Initialize the DataStream with target value and window size k.

        Args:
            value: The target value to check against
            k: The number of consecutive values needed
        """
        self.value = value  # Target value we're looking for
        self.k = k          # Required consecutive count
        self.count = 0      # Current streak of matching values

    def consec(self, num: int) -> bool:
        """
        Process a new number from the stream and check condition.

        Args:
            num: The new number from the stream

        Returns:
            True if last k numbers are all equal to value, False otherwise
        """
        # If the new number matches our target value
        if num == self.value:
            # Increment the streak counter
            self.count += 1
        else:
            # Streak is broken, reset counter to 0
            self.count = 0

        # Return true if we have at least k consecutive matches
        # Note: We use >= because count could be > k if we have a longer streak
        return self.count >= self.k
```

```javascript
class DataStream {
  /**
   * Time Complexity:
   * - constructor: O(1)
   * - consec: O(1) per call
   *
   * Space Complexity: O(1) - only a few variables stored
   */

  /**
   * Initialize the DataStream with target value and window size k.
   * @param {number} value - The target value to check against
   * @param {number} k - The number of consecutive values needed
   */
  constructor(value, k) {
    this.value = value; // Target value we're looking for
    this.k = k; // Required consecutive count
    this.count = 0; // Current streak of matching values
  }

  /**
   * Process a new number from the stream and check condition.
   * @param {number} num - The new number from the stream
   * @return {boolean} True if last k numbers are all equal to value
   */
  consec(num) {
    // If the new number matches our target value
    if (num === this.value) {
      // Increment the streak counter
      this.count++;
    } else {
      // Streak is broken, reset counter to 0
      this.count = 0;
    }

    // Return true if we have at least k consecutive matches
    // Note: We use >= because count could be > k with longer streak
    return this.count >= this.k;
  }
}
```

```java
class DataStream {
    /**
     * Time Complexity:
     * - Constructor: O(1)
     * - consec: O(1) per call
     *
     * Space Complexity: O(1) - only a few variables stored
     */

    private int value;  // Target value we're looking for
    private int k;      // Required consecutive count
    private int count;  // Current streak of matching values

    /**
     * Initialize the DataStream with target value and window size k.
     * @param value The target value to check against
     * @param k The number of consecutive values needed
     */
    public DataStream(int value, int k) {
        this.value = value;
        this.k = k;
        this.count = 0;  // Initialize streak counter
    }

    /**
     * Process a new number from the stream and check condition.
     * @param num The new number from the stream
     * @return True if last k numbers are all equal to value, False otherwise
     */
    public boolean consec(int num) {
        // If the new number matches our target value
        if (num == this.value) {
            // Increment the streak counter
            this.count++;
        } else {
            // Streak is broken, reset counter to 0
            this.count = 0;
        }

        // Return true if we have at least k consecutive matches
        // Note: We use >= because count could be > k with longer streak
        return this.count >= this.k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- `__init__` / constructor: O(1) - just initializing variables
- `consec`: O(1) per call - we only do a comparison, increment/reset, and return check

**Space Complexity**: O(1) - we only store three integers (`value`, `k`, and `count`), regardless of stream length

This is optimal because we must at least look at each new number (O(1) per number), and we use minimal constant space.

## Common Mistakes

1. **Storing the entire stream**: Some candidates use a queue or array to store all incoming numbers, then check the last k each time. This wastes O(n) space and O(k) time per operation.

2. **Forgetting to reset counter on mismatch**: The most common logical error is only incrementing the counter but not resetting it when a non-matching value appears. This causes false positives later.

3. **Using == instead of >= for the final check**: If you check `count == k`, you'll only return `true` exactly when the counter hits k, but not when it exceeds k. For example, after seeing k+1 consecutive matching values, you should still return `true`.

4. **Not handling the first k-1 elements correctly**: Some implementations might try to check the condition before processing k elements. Our solution correctly returns `false` during the first k-1 matching values because `count < k`.

## When You'll See This Pattern

This **sliding window with counter** pattern appears in many stream processing problems:

1. **Moving Average from Data Stream (LeetCode 346)**: Similar concept of maintaining a window of last k elements, but here you need the actual values to compute average.

2. **Number of Zero-Filled Subarrays (LeetCode 2348)**: When you see a zero, you increment a counter; when you see a non-zero, you reset it. The total count accumulates similarly.

3. **Max Consecutive Ones (LeetCode 485)**: Exactly the same pattern - maintain a counter of consecutive 1s, reset on 0, track the maximum.

4. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses a similar "reset when duplicate found" logic, though with more complex data structures.

The core idea is maintaining state about recent elements without storing all of them, which is crucial for stream processing where data is infinite or very large.

## Key Takeaways

1. **For stream processing problems, think about what minimal state you need to maintain** to answer queries without storing all data. Often a counter or accumulator is sufficient.

2. **The "reset on condition break" pattern** is powerful for consecutive element problems. When continuity matters more than individual values, track streaks.

3. **Test edge cases**: empty streams, k=1, all matching values, no matching values, alternating patterns. The counter approach elegantly handles all of these.

This problem teaches elegant state management for streaming data - a valuable skill for real-world systems processing high-volume data streams.

Related problems: [Number of Zero-Filled Subarrays](/problem/number-of-zero-filled-subarrays)
