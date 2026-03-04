---
title: "Iterator Interview Questions: Patterns and Strategies"
description: "Master Iterator problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-02"
category: "dsa-patterns"
tags: ["iterator", "dsa", "interview prep"]
---

Iterator questions test your ability to traverse and manipulate data streams without random access. They appear frequently because they combine core data structure knowledge with real-world constraints, like processing data from a network stream or a massive file that can't fit in memory. Mastering iterators demonstrates you can think sequentially and handle state—a key skill for systems design and API development.

## Common Patterns

Recognizing these patterns turns complex problems into manageable templates.

### 1. Two-Iterator Chase (Slow/Fast or Lead/Lag)

This pattern uses two pointers moving at different speeds within the same iterable. It's the foundation for detecting cycles (Floyd's Tortoise and Hare) or finding a midpoint.

<div class="code-group">

```python
def find_midpoint(iterable):
    slow = iter(iterable)
    fast = iter(iterable)
    try:
        while True:
            next(slow)          # Move slow by 1
            next(fast)          # Move fast by 1
            next(fast)          # Move fast by 2
    except StopIteration:
        # Fast reached the end, slow is at midpoint
        return slow.current if hasattr(slow, 'current') else None
# Note: For demonstration. Real implementation often uses indices for lists.
```

```javascript
function* findMidpoint(iterable) {
  let slow = iterable[Symbol.iterator]();
  let fast = iterable[Symbol.iterator]();
  while (true) {
    let slowResult = slow.next();
    let fastResult = fast.next();
    if (fastResult.done) return slowResult.value;
    fastResult = fast.next();
    if (fastResult.done) return slowResult.value;
  }
}
```

```java
// Using Iterator for generic collections
public static <T> T findMidpoint(List<T> list) {
    Iterator<T> slow = list.iterator();
    Iterator<T> fast = list.iterator();
    T midpoint = null;
    while (fast.hasNext()) {
        midpoint = slow.next();
        fast.next();
        if (!fast.hasNext()) break;
        fast.next();
    }
    return midpoint;
}
```

</div>

### 2. Interleaving Iterators (Zigzag)

This pattern involves alternating values from multiple iterators, commonly seen in problems like "Zigzag Iterator" or merging sorted streams.

<div class="code-group">

```python
class ZigzagIterator:
    def __init__(self, v1, v2):
        self.iterators = [iter(v1), iter(v2)]
        self.current = 0

    def next(self):
        while self.iterators:
            try:
                value = next(self.iterators[self.current])
                self.current = (self.current + 1) % len(self.iterators)
                return value
            except StopIteration:
                del self.iterators[self.current]
                if self.iterators:
                    self.current %= len(self.iterators)
        raise StopIteration

    def has_next(self):
        return any(it is not None for it in self.iterators)
```

```javascript
class ZigzagIterator {
  constructor(v1, v2) {
    this.iterators = [v1[Symbol.iterator](), v2[Symbol.iterator]()];
    this.current = 0;
  }
  next() {
    while (this.iterators.length > 0) {
      const it = this.iterators[this.current];
      const result = it.next();
      if (!result.done) {
        this.current = (this.current + 1) % this.iterators.length;
        return result.value;
      } else {
        this.iterators.splice(this.current, 1);
        if (this.iterators.length > 0) {
          this.current %= this.iterators.length;
        }
      }
    }
    return undefined;
  }
  hasNext() {
    return this.iterators.some((it) => !it.next().done);
  }
}
```

```java
public class ZigzagIterator {
    private List<Iterator<Integer>> iterators;
    private int current;

    public ZigzagIterator(List<Integer> v1, List<Integer> v2) {
        iterators = new ArrayList<>();
        iterators.add(v1.iterator());
        iterators.add(v2.iterator());
        current = 0;
    }

    public int next() {
        if (!hasNext()) throw new NoSuchElementException();
        int value = iterators.get(current).next();
        current = (current + 1) % iterators.size();
        return value;
    }

    public boolean hasNext() {
        while (!iterators.isEmpty()) {
            if (iterators.get(current).hasNext()) {
                return true;
            } else {
                iterators.remove(current);
                if (!iterators.isEmpty()) {
                    current %= iterators.size();
                }
            }
        }
        return false;
    }
}
```

</div>

### 3. Peeking Iterator

This pattern requires looking at the next element without advancing the iterator. The key is to cache the peeked value.

### 4. Flattening Nested Structures

This involves recursively processing iterators within iterators (e.g., flattening a 2D vector or a nested list). The solution typically uses a stack to manage iterator state.

## Difficulty Breakdown

The data shows a 100% concentration on **Medium** difficulty questions. This split is telling:

- **Easy (0%):** Basic iterator use (e.g., simple `for` loops) is too fundamental to be a standalone interview question.
- **Medium (100%):** This is the sweet spot. Problems here require you to _implement_ or _compose_ iterators (Peeking Iterator, Zigzag Iterator, Flatten Nested List Iterator). They test design, state management, and clean API boundaries.
- **Hard (0%):** Pure iterator logic rarely reaches "Hard" on its own. When it does, it's typically nested within a more complex algorithm (e.g., iterator for a BST in constant space).

This distribution means you should focus your practice on **designing iterator classes** and **managing multiple iterators**, not just using them.

## Which Companies Ask Iterator

Top tech companies frequently ask these questions because they mirror internal challenges with data pipelines and large-scale processing.

- [Google](/company/google) – Tests system design fundamentals.
- [Meta](/company/meta) – Common for handling social graph data streams.
- [Apple](/company/apple) – Relevant for OS and framework API design.
- [Amazon](/company/amazon) – Core for processing e-commerce and log streams.
- [LinkedIn](/company/linkedin) – Used in feed generation and data aggregation.

## Study Tips

1.  **Implement Core Patterns from Scratch:** Don't just solve problems. Manually implement a `PeekingIterator`, a `ZigzagIterator`, and a `FlatteningIterator`. This builds muscle memory for state management.
2.  **Draw the State Transitions:** Before coding, sketch the iterators, their positions, and the `next()`/`hasNext()` logic. A small diagram prevents off-by-one errors.
3.  **Practice in Multiple Languages:** Ensure you can implement an iterator in your interview language of choice. Know the interface (`Iterator` in Java, `__next__` in Python, `next()` in JavaScript).
4.  **Connect to Real Systems:** When you solve a problem, think of a real use case (e.g., a Zigzag Iterator could model a round-robin load balancer fetching from multiple data sources). This helps in discussions.

[Practice all Iterator questions on CodeJeet](/topic/iterator)
