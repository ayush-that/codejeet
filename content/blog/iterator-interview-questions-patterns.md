---
title: "Iterator Interview Questions: Patterns and Strategies"
description: "Master Iterator problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-06-23"
category: "dsa-patterns"
tags: ["iterator", "dsa", "interview prep"]
---

# Iterator Interview Questions: Patterns and Strategies

If you’ve ever been asked to design an iterator for a nested list, flatten a 2D vector, or traverse a BST in-order without recursion, you’ve encountered one of the most deceptively simple topics in coding interviews. Iterators seem trivial—until they’re not. The moment an interviewer asks you to implement `PeekingIterator` (LeetCode #284) or `ZigzagIterator` (LeetCode #281), candidates who only understand basic loops often freeze. These problems test your ability to manage state, handle edge cases, and design clean APIs—skills that directly translate to real-world systems design.

What makes iterator questions particularly interesting is their dual nature: they’re simultaneously about data structure design and algorithm implementation. A classic example that catches candidates off guard is `Flatten Nested List Iterator` (LeetCode #341). At first glance, it seems like a simple recursion problem. But when you realize you need to implement `hasNext()` and `next()` with proper lazy evaluation and stack management, the complexity reveals itself. Interviewers love these problems because they separate engineers who understand interfaces from those who just memorize algorithms.

## Common Patterns

### 1. The Stack-Based Flattening Pattern

This pattern appears when you need to iterate over nested structures. Instead of flattening everything upfront (which could be memory-inefficient), you use a stack to lazily process elements.

**LeetCode problems:** #341 (Flatten Nested List Iterator), #173 (Binary Search Tree Iterator)

**Intuition:** Think of this as depth-first traversal with pause/resume capability. You push elements onto a stack in reverse order so you can pop them in the correct sequence. The key insight is that `hasNext()` should prepare the next element, not just check if one exists.

<div class="code-group">

```python
class NestedIterator:
    def __init__(self, nestedList):
        # Initialize stack with all elements in reverse order
        self.stack = []
        for i in range(len(nestedList)-1, -1, -1):
            self.stack.append(nestedList[i])

    def next(self) -> int:
        # hasNext() ensures top is always an integer
        return self.stack.pop().getInteger()

    def hasNext(self) -> bool:
        # Process stack until top is integer or empty
        while self.stack:
            top = self.stack[-1]
            if top.isInteger():
                return True
            # If it's a list, flatten it
            self.stack.pop()
            nested = top.getList()
            for i in range(len(nested)-1, -1, -1):
                self.stack.append(nested[i])
        return False

# Time: O(1) amortized for next() and hasNext()
# Space: O(N) worst case where N is total elements
```

```javascript
class NestedIterator {
  constructor(nestedList) {
    this.stack = [];
    // Push in reverse to maintain order when popping
    for (let i = nestedList.length - 1; i >= 0; i--) {
      this.stack.push(nestedList[i]);
    }
  }

  hasNext() {
    while (this.stack.length > 0) {
      const top = this.stack[this.stack.length - 1];
      if (top.isInteger()) {
        return true;
      }
      // Flatten the list
      this.stack.pop();
      const list = top.getList();
      for (let i = list.length - 1; i >= 0; i--) {
        this.stack.push(list[i]);
      }
    }
    return false;
  }

  next() {
    return this.stack.pop().getInteger();
  }
}

// Time: O(1) amortized | Space: O(N)
```

```java
public class NestedIterator implements Iterator<Integer> {
    private Deque<NestedInteger> stack;

    public NestedIterator(List<NestedInteger> nestedList) {
        stack = new ArrayDeque<>();
        // Add in reverse order
        for (int i = nestedList.size() - 1; i >= 0; i--) {
            stack.push(nestedList.get(i));
        }
    }

    @Override
    public Integer next() {
        return stack.pop().getInteger();
    }

    @Override
    public boolean hasNext() {
        while (!stack.isEmpty()) {
            NestedInteger top = stack.peek();
            if (top.isInteger()) {
                return true;
            }
            stack.pop();
            List<NestedInteger> list = top.getList();
            for (int i = list.size() - 1; i >= 0; i--) {
                stack.push(list.get(i));
            }
        }
        return false;
    }
}

// Time: O(1) amortized | Space: O(N)
```

</div>

### 2. The Two-Pointer Alternation Pattern

Used when you need to iterate over multiple sequences in a specific alternating pattern, like zigzag traversal.

**LeetCode problems:** #281 (Zigzag Iterator), #1762 (Buildings With an Ocean View)

**Intuition:** Maintain pointers to current positions in each sequence and a mechanism to decide which sequence to take from next. For zigzag, you can use a queue of iterators or simple index arithmetic.

### 3. The Peeking Iterator Pattern

When you need to look at the next element without consuming it, you need to cache it.

**LeetCode problems:** #284 (Peeking Iterator), #251 (Flatten 2D Vector)

**Intuition:** Store the next value in advance. When `peek()` is called, return the cached value. When `next()` is called, return the cached value and fetch the next one. This pattern teaches you about iterator state management.

<div class="code-group">

```python
class PeekingIterator:
    def __init__(self, iterator):
        self.iterator = iterator
        self._next = iterator.next() if iterator.hasNext() else None

    def peek(self):
        return self._next

    def next(self):
        result = self._next
        self._next = self.iterator.next() if self.iterator.hasNext() else None
        return result

    def hasNext(self):
        return self._next is not None

# Time: O(1) for all operations
# Space: O(1) extra space
```

```javascript
class PeekingIterator {
  constructor(iterator) {
    this.iterator = iterator;
    this.nextVal = iterator.hasNext() ? iterator.next() : null;
  }

  peek() {
    return this.nextVal;
  }

  next() {
    const result = this.nextVal;
    this.nextVal = this.iterator.hasNext() ? this.iterator.next() : null;
    return result;
  }

  hasNext() {
    return this.nextVal !== null;
  }
}

// Time: O(1) | Space: O(1)
```

```java
class PeekingIterator implements Iterator<Integer> {
    private Iterator<Integer> iterator;
    private Integer next;

    public PeekingIterator(Iterator<Integer> iterator) {
        this.iterator = iterator;
        if (iterator.hasNext()) {
            next = iterator.next();
        }
    }

    public Integer peek() {
        return next;
    }

    @Override
    public Integer next() {
        Integer result = next;
        next = iterator.hasNext() ? iterator.next() : null;
        return result;
    }

    @Override
    public boolean hasNext() {
        return next != null;
    }
}

// Time: O(1) | Space: O(1)
```

</div>

## When to Use Iterator vs Alternatives

Recognizing when a problem needs an iterator implementation versus other approaches is crucial. Here's your decision framework:

**Use an iterator when:**

1. **Lazy evaluation is required** – The data is too large to process all at once (like streaming data)
2. **You need to expose a traversal API** – Other code needs to control the iteration pace
3. **The data structure is complex** – Nested structures, trees, or graphs where traversal logic should be encapsulated
4. **You need `peek()` functionality** – Looking ahead without consuming

**Use alternatives when:**

- **Simple array/list traversal** – Just use a for-loop
- **You need random access** – Iterators are sequential by nature
- **Memory isn't a concern** – If you can afford to flatten everything upfront, do it (simpler code)

**Iterator vs BFS/DFS:** BFS and DFS are traversal algorithms; iterators are interfaces to access elements. You often use BFS/DFS inside an iterator implementation (like in BST Iterator).

**Iterator vs direct recursion:** Recursion is simpler for complete traversal but doesn't give you pause/resume capability. Use iterators when you need to interleave traversal with other operations.

## Edge Cases and Gotchas

1. **Empty nested structures:** `[[], [1, 2]]` – Your iterator should skip the empty inner list and return 1, then 2. Test with multiple consecutive empty lists.

2. **`hasNext()` called multiple times:** Ensure it's idempotent (calling it twice without `next()` should return the same value). Don't advance state in `hasNext()` unless necessary.

3. **`next()` without `hasNext()`:** Some implementations require calling `hasNext()` before `next()`, but robust iterators should handle this gracefully. Document your assumptions.

4. **Concurrent modification:** While not usually tested in interviews, be aware that modifying the underlying collection while iterating can cause issues. Mention this if relevant.

<div class="code-group">

```python
# Common mistake: advancing in hasNext()
def hasNext(self):
    if self.stack:
        top = self.stack[-1]
        if top.isInteger():
            return True
        # WRONG: This modifies state
        self.stack.pop()
        # ... flattening logic
    return False

# Correct: hasNext() should be idempotent
def hasNext(self):
    # Process until we find integer or exhaust stack
    while self.stack and not self.stack[-1].isInteger():
        top = self.stack.pop()
        # ... flatten
    return bool(self.stack)
```

```javascript
// Edge case: handling null/undefined in peek()
peek() {
    if (this.nextVal === undefined) {
        throw new Error("No more elements");
    }
    return this.nextVal;
}

// Better: use null sentinel and clear documentation
```

```java
// Edge case: calling next() when hasNext() returns false
@Override
public Integer next() {
    if (!hasNext()) {
        throw new NoSuchElementException();
    }
    // ... rest of implementation
}
```

</div>

## Difficulty Breakdown

The data shows 100% medium difficulty problems for iterator questions. This is telling: interviewers use iterator problems to assess intermediate-to-advanced skills. You won't find many "easy" iterator problems because the concept inherently involves multiple moving parts.

**What this means for your preparation:**

- Focus on medium problems first—they're the sweet spot for interviews
- Don't waste time searching for easy warm-ups; start directly with patterns
- Hard problems in this category usually combine iterators with other complex data structures

## Which Companies Ask Iterator Questions

**Google** (/company/google) – Loves nested structure iterators and custom data structure design. Expect problems like Flatten Nested List Iterator.

**Meta** (/company/meta) – Often asks iterator questions in relation to tree traversals and system design. BST Iterator variations are common.

**Apple** (/company/apple) – Prefers clean API design and edge case handling. Peeking Iterator and 2D Vector problems appear frequently.

**Amazon** (/company/amazon) – Focuses on practical applications and memory efficiency. They might ask you to optimize an existing iterator implementation.

**LinkedIn** (/company/linkedin) – Often combines iterators with real-world scenarios like merging multiple feeds or streams.

Each company has a slightly different style, but all value the same core skills: clean interface design, state management, and edge case consideration.

## Study Tips

1. **Implement from scratch, then compare:** Don't just read solutions. Implement each iterator pattern from memory, then compare with optimal solutions. The gap between your first attempt and the optimal solution is where learning happens.

2. **Practice in this order:**
   - Start with Peeking Iterator (#284) to understand state management
   - Move to Flatten 2D Vector (#251) for basic 2D traversal
   - Tackle BST Iterator (#173) for tree traversal without recursion
   - Solve Flatten Nested List Iterator (#341) for the stack pattern
   - Finish with Zigzag Iterator (#281) for multiple sequence management

3. **Draw the state transitions:** Before coding, draw diagrams showing how your stack/queue/pointers change with each `next()` and `hasNext()` call. This prevents off-by-one errors.

4. **Test with these four cases:**
   - Empty input
   - Single element
   - Deeply nested structures
   - Alternating calls to `hasNext()` without `next()`

Remember: iterator questions test design thinking as much as coding skill. Interviewers want to see that you can create clean, robust APIs that handle real-world complexities.

[Practice all Iterator questions on CodeJeet](/topic/iterator)
