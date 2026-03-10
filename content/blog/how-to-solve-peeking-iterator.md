---
title: "How to Solve Peeking Iterator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Peeking Iterator. Medium difficulty, 61.3% acceptance rate. Topics: Array, Design, Iterator."
date: "2028-05-01"
category: "dsa-patterns"
tags: ["peeking-iterator", "array", "design", "iterator", "medium"]
---

# How to Solve Peeking Iterator

The Peeking Iterator problem asks you to design an iterator that supports peeking at the next element without advancing the iterator. The challenge is that you're given a standard iterator that only has `hasNext()` and `next()` methods, and you need to add a `peek()` operation that returns the next element without consuming it. What makes this interesting is that you need to maintain the iterator's state correctly while adding this new functionality.

## Visual Walkthrough

Let's trace through an example to understand the problem better. Suppose we have an iterator over the array `[1, 2, 3]`:

1. **Initialization**: We create a `PeekingIterator` with the iterator over `[1, 2, 3]`
2. **First peek()**: Should return `1` without advancing the iterator
3. **First next()**: Should return `1` and advance to position 2
4. **Second peek()**: Should return `2` without advancing
5. **Second next()**: Should return `2` and advance to position 3
6. **hasNext()**: Should return `true` (we still have `3`)
7. **Third peek()**: Should return `3` without advancing
8. **Third next()**: Should return `3` and advance past the end
9. **hasNext()**: Should return `false`

The key insight is that when someone calls `peek()`, we need to "look ahead" at the next value but not actually consume it. This means we need to store this peeked value somewhere so that when `next()` is called, we can return it without calling the underlying iterator's `next()` method again.

## Brute Force Approach

A naive approach might try to modify the original iterator or create a copy of all elements. For example:

1. Convert the iterator to a list during initialization
2. Track the current index
3. Implement `peek()` by looking at the next index
4. Implement `next()` by incrementing the index

While this would work, it has significant drawbacks:

- **Memory inefficiency**: We store all elements upfront, even if we only need a few
- **Violates iterator semantics**: Real iterators are lazy and only process elements as needed
- **Can't handle infinite iterators**: Some iterators generate values on-the-fly

This approach misses the point of the problem, which is to wrap an existing iterator while preserving its lazy evaluation properties.

## Optimized Approach

The optimal solution uses a simple but clever technique: **caching the next element**. Here's the step-by-step reasoning:

1. **The core challenge**: We need to know what the next element is for `peek()`, but we can't call `next()` on the underlying iterator because that would consume it.

2. **Key insight**: We can "pre-fetch" the next element and store it. When someone calls:
   - `peek()`: Return the cached element
   - `next()`: Return the cached element, then fetch and cache the next one
   - `hasNext()`: Check if we have a cached element

3. **State management**: We need to track:
   - The cached next element (if any)
   - Whether we've reached the end of the iterator

4. **Initialization strategy**: When the `PeekingIterator` is created, we immediately fetch and cache the first element (if it exists). This gives us a head start.

5. **Edge cases**: We need to handle:
   - Empty iterators (nothing to cache)
   - Calling `peek()` when there are no more elements
   - Calling `next()` when there are no more elements

This approach is efficient because:

- It only stores one extra element at a time (O(1) space)
- It preserves the lazy evaluation of the original iterator
- Each operation is O(1) time

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(1) for all operations | Space: O(1)
class PeekingIterator:
    def __init__(self, iterator):
        """
        Initialize your data structure here.

        Args:
            iterator: An iterator object that supports hasNext() and next()
        """
        self.iterator = iterator  # Store the original iterator
        self.next_val = None      # Cache for the next element
        self.has_next = False     # Flag indicating if we have a cached element

        # Pre-fetch the first element during initialization
        if self.iterator.hasNext():
            self.next_val = self.iterator.next()
            self.has_next = True

    def peek(self):
        """
        Returns the next element in the iteration without advancing the iterator.
        """
        if not self.has_next:
            raise StopIteration("No more elements")
        return self.next_val

    def next(self):
        """
        Returns the next element in the iteration and advances the iterator.
        """
        if not self.has_next:
            raise StopIteration("No more elements")

        # Return the cached value
        result = self.next_val

        # Fetch and cache the next element (if any)
        if self.iterator.hasNext():
            self.next_val = self.iterator.next()
            self.has_next = True
        else:
            self.next_val = None
            self.has_next = False

        return result

    def hasNext(self):
        """
        Returns true if the iteration has more elements.
        """
        return self.has_next
```

```javascript
// Time: O(1) for all operations | Space: O(1)
/**
 * // This is the Iterator's API interface.
 * // You should not implement it, or speculate about its implementation.
 * function Iterator() {
 *    @return {boolean}
 *    this.hasNext = function() { // ... };
 *
 *    @return {integer}
 *    this.next = function() { // ... };
 * };
 */

/**
 * @param {Iterator} iterator
 */
var PeekingIterator = function (iterator) {
  this.iterator = iterator; // Store the original iterator
  this.nextVal = null; // Cache for the next element
  this.hasNextFlag = false; // Flag indicating if we have a cached element

  // Pre-fetch the first element during initialization
  if (this.iterator.hasNext()) {
    this.nextVal = this.iterator.next();
    this.hasNextFlag = true;
  }
};

/**
 * @return {number}
 */
PeekingIterator.prototype.peek = function () {
  if (!this.hasNextFlag) {
    throw new Error("No more elements");
  }
  return this.nextVal;
};

/**
 * @return {number}
 */
PeekingIterator.prototype.next = function () {
  if (!this.hasNextFlag) {
    throw new Error("No more elements");
  }

  // Return the cached value
  const result = this.nextVal;

  // Fetch and cache the next element (if any)
  if (this.iterator.hasNext()) {
    this.nextVal = this.iterator.next();
    this.hasNextFlag = true;
  } else {
    this.nextVal = null;
    this.hasNextFlag = false;
  }

  return result;
};

/**
 * @return {boolean}
 */
PeekingIterator.prototype.hasNext = function () {
  return this.hasNextFlag;
};
```

```java
// Time: O(1) for all operations | Space: O(1)
// Java Iterator interface reference:
// https://docs.oracle.com/javase/8/docs/api/java/util/Iterator.html

class PeekingIterator implements Iterator<Integer> {
    private Iterator<Integer> iterator;  // Store the original iterator
    private Integer nextVal;             // Cache for the next element
    private boolean hasNextFlag;         // Flag indicating if we have a cached element

    public PeekingIterator(Iterator<Integer> iterator) {
        // Initialize any member here
        this.iterator = iterator;

        // Pre-fetch the first element during initialization
        if (this.iterator.hasNext()) {
            this.nextVal = this.iterator.next();
            this.hasNextFlag = true;
        } else {
            this.hasNextFlag = false;
        }
    }

    // Returns the next element in the iteration without advancing the iterator.
    public Integer peek() {
        if (!hasNextFlag) {
            throw new NoSuchElementException();
        }
        return nextVal;
    }

    // hasNext() and next() should behave the same as in the Iterator interface.
    // Override them if needed.
    @Override
    public Integer next() {
        if (!hasNextFlag) {
            throw new NoSuchElementException();
        }

        // Return the cached value
        Integer result = nextVal;

        // Fetch and cache the next element (if any)
        if (iterator.hasNext()) {
            nextVal = iterator.next();
            hasNextFlag = true;
        } else {
            nextVal = null;
            hasNextFlag = false;
        }

        return result;
    }

    @Override
    public boolean hasNext() {
        return hasNextFlag;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(1) for all operations

- `peek()`: Simply returns the cached value
- `next()`: Returns the cached value and fetches the next one (single operation)
- `hasNext()`: Returns a boolean flag
- Each operation involves at most one call to the underlying iterator's methods

**Space Complexity**: O(1) additional space

- We only store three extra variables: the cached value, a boolean flag, and a reference to the original iterator
- No additional data structures that grow with input size
- The original iterator's space usage is not counted as part of our solution's complexity

## Common Mistakes

1. **Forgetting to pre-fetch during initialization**: Some candidates only fetch the next element when `peek()` is first called. This causes issues because the first call to `next()` would then need special handling. Always fetch the first element during construction.

2. **Not handling empty iterators**: If the original iterator is empty, we should set our `hasNextFlag` to `false` and `nextVal` to `null`/`None`. Failing to do this will cause null pointer errors.

3. **Incorrect state updates in `next()`**: After returning the cached value, you must:
   - Check if the underlying iterator has more elements
   - If yes, fetch and cache the next element
   - If no, update flags to indicate we're at the end
     Forgetting any of these steps will break subsequent calls.

4. **Returning the wrong value from `peek()`**: `peek()` should return the cached value WITHOUT calling the underlying iterator's `next()` method. Some candidates mistakenly call `next()` on the underlying iterator, which consumes the element.

## When You'll See This Pattern

The "cached next element" pattern appears in several iterator-related problems:

1. **Binary Search Tree Iterator (LeetCode 173)**: Similar to peeking iterator, but for BST traversal. You need to implement an iterator that returns elements in ascending order. The solution often involves caching the next element during initialization or after each `next()` call.

2. **Flatten 2D Vector (LeetCode 251)**: When flattening a 2D vector, you need to handle empty sub-arrays efficiently. The caching pattern helps you skip empty arrays and always have the next valid element ready.

3. **Zigzag Iterator (LeetCode 281)**: For alternating between multiple iterators, you need to know which iterator has the next element. Caching helps determine where to get the next value from without prematurely advancing any iterator.

The common theme is **lazy evaluation with lookahead** - you want to know what's coming next without actually consuming it yet.

## Key Takeaways

1. **The caching pattern is powerful for iterator wrappers**: When you need to add functionality to an iterator (like peeking), cache the next element. This gives you O(1) access to it without consuming it.

2. **Always handle initialization and state transitions carefully**: The trickiest parts are:
   - What to do during construction (pre-fetch!)
   - How to update state after `next()` is called
   - How to handle the end of the iterator gracefully

3. **Think about what information you need to answer each query**: For `peek()`, you need the next element. For `hasNext()`, you need to know if there's a cached element. For `next()`, you need the cached element and then need to fetch the next one.

This pattern teaches you how to extend existing interfaces while preserving their semantics and efficiency - a common requirement in software design.

Related problems: [Binary Search Tree Iterator](/problem/binary-search-tree-iterator), [Flatten 2D Vector](/problem/flatten-2d-vector), [Zigzag Iterator](/problem/zigzag-iterator)
