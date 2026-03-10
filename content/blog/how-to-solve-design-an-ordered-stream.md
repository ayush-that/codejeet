---
title: "How to Solve Design an Ordered Stream — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Design an Ordered Stream. Easy difficulty, 82.6% acceptance rate. Topics: Array, Hash Table, Design, Data Stream."
date: "2027-04-22"
category: "dsa-patterns"
tags: ["design-an-ordered-stream", "array", "hash-table", "design", "easy"]
---

# How to Solve Design an Ordered Stream

This problem asks us to design a data structure that receives `(idKey, value)` pairs in random order and returns chunks of values in increasing ID order. The tricky part is that we need to return values _as soon as they become available in sequence_ - not all at once. This simulates a real streaming scenario where data arrives out-of-order but must be processed in-order.

## Visual Walkthrough

Let's trace through an example with `n = 5`:

1. We initialize an OrderedStream with capacity 5: `[None, None, None, None, None]` (indices 0-4, but IDs are 1-based)
2. `insert(3, "cc")` → ID 3 arrives, but we need ID 1 first. Return `[]`
3. `insert(1, "aa")` → ID 1 arrives! Check what's next:
   - Index 1 has "aa" → add to chunk
   - Index 2 is None → stop
   - Return `["aa"]`
4. `insert(2, "bb")` → ID 2 arrives! Check what's next:
   - Index 2 has "bb" → add to chunk
   - Index 3 has "cc" (from earlier) → add to chunk
   - Index 4 is None → stop
   - Return `["bb", "cc"]`
5. `insert(5, "ee")` → ID 5 arrives, but we need ID 4 first. Return `[]`
6. `insert(4, "dd")` → ID 4 arrives! Check what's next:
   - Index 4 has "dd" → add to chunk
   - Index 5 has "ee" → add to chunk
   - Index 6 is out of bounds → stop
   - Return `["dd", "ee"]`

The key insight: we maintain a pointer to the next expected ID. When we insert an ID, if it matches our pointer, we collect all consecutive values starting from that position.

## Brute Force Approach

A naive approach might store all incoming pairs and sort them each time we need to return values. However, this would be inefficient:

```python
class OrderedStream:
    def __init__(self, n: int):
        self.data = []
        self.n = n

    def insert(self, idKey: int, value: str):
        # Add the new pair
        self.data.append((idKey, value))

        # Sort by ID each time (O(n log n))
        self.data.sort(key=lambda x: x[0])

        # Find the longest prefix starting from ID 1
        result = []
        expected = 1
        for idKey, value in self.data:
            if idKey == expected:
                result.append(value)
                expected += 1
            else:
                break
        return result
```

**Why this fails:**

- Sorting every insertion is O(n log n) time
- We're not leveraging the fact that IDs are unique and in range [1, n]
- We're checking from the beginning each time instead of remembering where we left off

## Optimal Solution

The optimal solution uses a fixed-size array and a pointer. Since IDs are in [1, n], we can use array indices directly. The pointer tracks the next expected ID.

<div class="code-group">

```python
# Time: O(n) total for all operations (each element processed once)
# Space: O(n) for the storage array
class OrderedStream:
    def __init__(self, n: int):
        # Create array of size n+1 (1-indexed for simplicity)
        # Index 0 will be unused since IDs start at 1
        self.stream = [None] * (n + 1)
        # Pointer to the next expected ID (starts at 1)
        self.ptr = 1
        self.n = n

    def insert(self, idKey: int, value: str):
        # Store the value at its correct position
        self.stream[idKey] = value

        # If this ID isn't what we're waiting for, return empty list
        if idKey != self.ptr:
            return []

        # Otherwise, collect consecutive values starting from ptr
        result = []
        # While we're within bounds and have a value at current position
        while self.ptr <= self.n and self.stream[self.ptr] is not None:
            result.append(self.stream[self.ptr])
            self.ptr += 1  # Move pointer to next expected ID

        return result
```

```javascript
// Time: O(n) total for all operations (each element processed once)
// Space: O(n) for the storage array
class OrderedStream {
  constructor(n) {
    // Create array of size n+1 (1-indexed for simplicity)
    // Index 0 will be unused since IDs start at 1
    this.stream = new Array(n + 1);
    // Pointer to the next expected ID (starts at 1)
    this.ptr = 1;
    this.n = n;
  }

  insert(idKey, value) {
    // Store the value at its correct position
    this.stream[idKey] = value;

    // If this ID isn't what we're waiting for, return empty array
    if (idKey !== this.ptr) {
      return [];
    }

    // Otherwise, collect consecutive values starting from ptr
    const result = [];
    // While we're within bounds and have a value at current position
    while (this.ptr <= this.n && this.stream[this.ptr] !== undefined) {
      result.push(this.stream[this.ptr]);
      this.ptr++; // Move pointer to next expected ID
    }

    return result;
  }
}
```

```java
// Time: O(n) total for all operations (each element processed once)
// Space: O(n) for the storage array
class OrderedStream {
    private String[] stream;
    private int ptr;
    private int n;

    public OrderedStream(int n) {
        // Create array of size n+1 (1-indexed for simplicity)
        // Index 0 will be unused since IDs start at 1
        this.stream = new String[n + 1];
        // Pointer to the next expected ID (starts at 1)
        this.ptr = 1;
        this.n = n;
    }

    public List<String> insert(int idKey, String value) {
        // Store the value at its correct position
        stream[idKey] = value;

        // If this ID isn't what we're waiting for, return empty list
        if (idKey != ptr) {
            return new ArrayList<>();
        }

        // Otherwise, collect consecutive values starting from ptr
        List<String> result = new ArrayList<>();
        // While we're within bounds and have a value at current position
        while (ptr <= n && stream[ptr] != null) {
            result.add(stream[ptr]);
            ptr++;  // Move pointer to next expected ID
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor:** O(n) to initialize the array
- **Each insert() call:** O(k) where k is the number of consecutive values returned
- **Total across all inserts:** O(n) since each element is added to the result exactly once

**Space Complexity:** O(n) for the storage array

The key insight is that while individual insert operations might be O(n) in worst case (returning all remaining values), the _amortized_ cost is O(1) per element, and the total work across all operations is linear.

## Common Mistakes

1. **Off-by-one errors with array indices:** Since IDs start at 1, candidates often create an array of size `n` instead of `n+1`, leading to index-out-of-bounds errors. Always remember: if you want to use indices directly, you need `n+1` elements when IDs start at 1.

2. **Forgetting to update the pointer:** After collecting consecutive values, you must advance the pointer. A common bug is to return the chunk but keep the pointer at the same position, causing infinite loops on subsequent calls.

3. **Not checking bounds in the while loop:** The condition must be `ptr <= n AND stream[ptr] is not None`. Missing either check can cause index errors or infinite loops.

4. **Using a hashmap when array is better:** While a hashmap works, an array is more efficient here because:
   - IDs are guaranteed to be in [1, n]
   - Array access is O(1) with better cache locality
   - No hash collisions or rehashing overhead

## When You'll See This Pattern

This "ordered stream with pointer" pattern appears in problems where:

1. Data arrives out-of-order but must be processed in-order
2. You need to track the "longest prefix" or "next expected" element
3. IDs or indices are bounded and sequential

**Related problems:**

- **Longest Uploaded Prefix (Medium)** - Almost identical pattern! Track the longest prefix of uploaded videos. Uses a boolean array and pointer.
- **First Missing Positive (Hard)** - Uses array indices to track presence of numbers, though with more complex index manipulation.
- **Design Phone Directory (Medium)** - Manages allocation and release of numbers, often using a similar pointer approach for the next available number.

## Key Takeaways

1. **When IDs are bounded and sequential, use array indices directly** - This gives O(1) access and avoids hashmap overhead. The constraint "IDs between 1 and n" is a strong hint for array usage.

2. **The pointer technique efficiently tracks progress** - Instead of scanning from the beginning each time, maintain state about what you've already processed. This transforms O(n²) scanning into O(n) total work.

3. **Streaming problems often use incremental processing** - You don't need to store and sort everything; process what you can when it becomes available, and return immediately.

Related problems: [Longest Uploaded Prefix](/problem/longest-uploaded-prefix)
