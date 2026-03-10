---
title: "How to Solve Flatten Nested List Iterator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flatten Nested List Iterator. Medium difficulty, 65.6% acceptance rate. Topics: Stack, Tree, Depth-First Search, Design, Queue."
date: "2027-04-20"
category: "dsa-patterns"
tags: ["flatten-nested-list-iterator", "stack", "tree", "depth-first-search", "medium"]
---

# How to Solve Flatten Nested List Iterator

You're given a nested list where each element can be either an integer or another nested list. Your task is to build an iterator that returns all integers in order from left to right. The challenge is that you need to handle arbitrary levels of nesting efficiently, without pre-flattening the entire structure if possible.

## Visual Walkthrough

Let's trace through `[[1,1],2,[1,1]]` step by step:

1. **Initialization**: We start with the outer list containing three elements: `[1,1]`, `2`, and `[1,1]`
2. **First call to `next()`**: We need to return the first integer. The first element `[1,1]` is a list, so we must go inside it to find the first integer `1`
3. **Second call to `next()`**: We're still inside the first nested list `[1,1]`. The next integer in this list is the second `1`
4. **Third call to `next()`**: We've exhausted the first nested list, so we move to the second element of the outer list, which is integer `2`
5. **Fourth call to `next()`**: We move to the third element `[1,1]` and return the first `1`
6. **Fifth call to `next()`**: We return the second `1` from the last nested list

The key insight is that we need to "unwind" nested lists as we encounter them, maintaining our position so we can continue where we left off.

## Brute Force Approach

The most straightforward approach is to pre-flatten the entire nested structure during initialization:

1. Write a recursive DFS function that traverses the nested list
2. Whenever you encounter an integer, add it to a flat list
3. Whenever you encounter a list, recursively process it
4. Store all integers in order in a simple list
5. Use an index pointer to implement `next()` and `hasNext()`

**Why this isn't optimal**: While this approach works and is easy to implement, it violates the spirit of an iterator. Iterators should be lazy - they should process elements on-demand rather than all at once. If you have a deeply nested structure with millions of elements but only need the first few, pre-flattening wastes time and memory.

## Optimized Approach

The optimal solution uses a stack to lazily flatten the nested structure. Here's the key insight:

1. **Store lists in reverse order on the stack**: When we push a nested list onto the stack, we reverse it so the first element is on top. This lets us use the stack's LIFO property to process elements in the correct left-to-right order.

2. **Process during `hasNext()`**: The clever part is that we do the flattening work in `hasNext()` rather than `next()`. This ensures we're always ready to return an integer when `next()` is called.

3. **Algorithm steps**:
   - During initialization, push all elements of the input list onto the stack in reverse order
   - In `hasNext()`: While the stack isn't empty and the top isn't an integer, pop it, get the list, and push its elements onto the stack in reverse order
   - Continue until the top is an integer or the stack is empty
   - `next()` simply pops and returns the top integer (which we know exists because `hasNext()` prepared it)

This approach is lazy - we only flatten as much as needed to get to the next integer.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) amortized for next() and hasNext() | Space: O(n) worst case
# NestedInteger class is predefined (interface)
# """
# class NestedInteger:
#     def isInteger(self) -> bool:
#         pass
#     def getInteger(self) -> int:
#         pass
#     def getList(self) -> List['NestedInteger']:
#         pass
# """

class NestedIterator:
    def __init__(self, nestedList: [NestedInteger]):
        # Initialize stack with all elements from nestedList
        # We push them in reverse order so the first element ends up on top
        self.stack = []
        for i in range(len(nestedList) - 1, -1, -1):
            self.stack.append(nestedList[i])

    def next(self) -> int:
        # hasNext() ensures the top of stack is always an integer
        # Simply pop and return it
        return self.stack.pop().getInteger()

    def hasNext(self) -> bool:
        # Keep processing until we find an integer or stack is empty
        while self.stack:
            top = self.stack[-1]  # Peek at top without popping

            if top.isInteger():
                # Top is an integer - we're ready for next()
                return True

            # Top is a list - we need to flatten it
            top_list = self.stack.pop().getList()

            # Push elements from this list onto stack in reverse order
            # This ensures leftmost elements end up on top
            for i in range(len(top_list) - 1, -1, -1):
                self.stack.append(top_list[i])

        # Stack is empty - no more elements
        return False
```

```javascript
// Time: O(1) amortized for next() and hasNext() | Space: O(n) worst case
// NestedInteger class is predefined (interface)
// /**
//  * // This is the interface that allows for creating nested lists.
//  * // You should not implement it, or speculate about its implementation
//  * function NestedInteger() {
//  *
//  *     Return true if this NestedInteger holds a single integer, rather than a nested list.
//  *     @return {boolean}
//  *     this.isInteger = function() {
//  *         ...
//  *     };
//  *
//  *     Return the single integer that this NestedInteger holds, if it holds a single integer
//  *     Return null if this NestedInteger holds a nested list
//  *     @return {integer}
//  *     this.getInteger = function() {
//  *         ...
//  *     };
//  *
//  *     Return the nested list that this NestedInteger holds, if it holds a nested list
//  *     Return null if this NestedInteger holds a single integer
//  *     @return {NestedInteger[]}
//  *     this.getList = function() {
//  *         ...
//  *     };
//  * };
//  */

/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function (nestedList) {
  // Initialize stack with elements in reverse order
  // This puts the first element on top of the stack
  this.stack = [];
  for (let i = nestedList.length - 1; i >= 0; i--) {
    this.stack.push(nestedList[i]);
  }
};

/**
 * @this NestedIterator
 * @returns {boolean}
 */
NestedIterator.prototype.hasNext = function () {
  // Process stack until we find an integer or stack is empty
  while (this.stack.length > 0) {
    const top = this.stack[this.stack.length - 1]; // Peek at top

    if (top.isInteger()) {
      // Top is an integer - ready for next()
      return true;
    }

    // Top is a list - flatten it
    const topList = this.stack.pop().getList();

    // Push elements from this list in reverse order
    for (let i = topList.length - 1; i >= 0; i--) {
      this.stack.push(topList[i]);
    }
  }

  // Stack is empty - no more elements
  return false;
};

/**
 * @this NestedIterator
 * @returns {integer}
 */
NestedIterator.prototype.next = function () {
  // hasNext() ensures top of stack is an integer
  // Simply pop and return it
  return this.stack.pop().getInteger();
};
```

```java
// Time: O(1) amortized for next() and hasNext() | Space: O(n) worst case
// NestedInteger class is predefined (interface)
// /**
//  * // This is the interface that allows for creating nested lists.
//  * // You should not implement it, or speculate about its implementation
//  * public interface NestedInteger {
//  *
//  *     // @return true if this NestedInteger holds a single integer, rather than a nested list.
//  *     public boolean isInteger();
//  *
//  *     // @return the single integer that this NestedInteger holds, if it holds a single integer
//  *     // Return null if this NestedInteger holds a nested list
//  *     public Integer getInteger();
//  *
//  *     // @return the nested list that this NestedInteger holds, if it holds a nested list
//  *     // Return null if this NestedInteger holds a single integer
//  *     public List<NestedInteger> getList();
//  * }
//  */

import java.util.*;

public class NestedIterator implements Iterator<Integer> {
    private Deque<NestedInteger> stack;

    public NestedIterator(List<NestedInteger> nestedList) {
        // Initialize stack with elements in reverse order
        // Using ArrayDeque for stack operations
        stack = new ArrayDeque<>();
        for (int i = nestedList.size() - 1; i >= 0; i--) {
            stack.push(nestedList.get(i));
        }
    }

    @Override
    public Integer next() {
        // hasNext() ensures top of stack is an integer
        // Simply pop and return it
        return stack.pop().getInteger();
    }

    @Override
    public boolean hasNext() {
        // Process stack until we find an integer or stack is empty
        while (!stack.isEmpty()) {
            NestedInteger top = stack.peek(); // Look at top without removing

            if (top.isInteger()) {
                // Top is an integer - ready for next()
                return true;
            }

            // Top is a list - flatten it
            List<NestedInteger> topList = stack.pop().getList();

            // Push elements from this list in reverse order
            for (int i = topList.size() - 1; i >= 0; i--) {
                stack.push(topList.get(i));
            }
        }

        // Stack is empty - no more elements
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- **Constructor**: O(n) where n is the number of elements in the initial list (we push them all onto the stack)
- **`next()`**: O(1) - just pops from stack
- **`hasNext()`**: O(1) amortized - while it has a while loop, each element is pushed and popped exactly once over all calls

**Space Complexity**: O(n) in the worst case, where n is the total number of nested integers plus lists. In the worst case (deeply nested structure), the stack could contain all elements at once. However, this is still better than pre-flattening because we only store the "active" path through the nested structure.

## Common Mistakes

1. **Pre-flattening everything in the constructor**: This violates the iterator pattern's lazy evaluation principle. While it might pass basic tests, interviewers will expect you to recognize and avoid this approach.

2. **Forgetting to reverse the order when pushing onto stack**: If you push `[1,2,3]` onto the stack as `1,2,3`, they'll come out as `3,2,1`. Always push in reverse order to maintain left-to-right traversal.

3. **Implementing flattening logic in `next()` instead of `hasNext()`**: This leads to awkward code where you might need to call `hasNext()` before `next()`, or handle the case where `next()` is called when there are no more elements. The clean pattern is to prepare the next integer in `hasNext()`.

4. **Not handling empty lists correctly**: Empty nested lists `[]` should be skipped entirely. Make sure your while loop in `hasNext()` continues processing until it finds an integer or exhausts the stack.

## When You'll See This Pattern

This "lazy flattening with a stack" pattern appears whenever you need to traverse nested or hierarchical structures on-demand:

1. **Flatten 2D Vector (LeetCode 251)**: Similar concept but with a 2D array instead of nested lists. You maintain pointers to the current row and column.

2. **Binary Search Tree Iterator (LeetCode 173)**: Uses a stack to perform iterative in-order traversal, yielding elements one by one.

3. **Mini Parser (LeetCode 385)**: The inverse problem - given a serialized string, construct the nested structure. Uses a stack to track nesting levels.

4. **Nested List Weight Sum (LeetCode 339)**: Requires traversal of the same nested structure but with depth-aware processing.

## Key Takeaways

1. **Use stacks for depth-first traversal of nested structures**: When you need to "dig into" nested elements and remember where to continue, a stack naturally matches the recursion pattern without actual recursion.

2. **Lazy evaluation is key for iterators**: Process elements only when needed. This is more memory-efficient and follows the iterator design pattern correctly.

3. **Reverse order when pushing onto stack**: To process elements left-to-right using a LIFO structure, push them in reverse order so the first element ends up on top.

Related problems: [Flatten 2D Vector](/problem/flatten-2d-vector), [Zigzag Iterator](/problem/zigzag-iterator), [Mini Parser](/problem/mini-parser)
