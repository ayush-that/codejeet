---
title: "How to Solve Linked List Random Node — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Linked List Random Node. Medium difficulty, 64.7% acceptance rate. Topics: Linked List, Math, Reservoir Sampling, Randomized."
date: "2028-02-09"
category: "dsa-patterns"
tags: ["linked-list-random-node", "linked-list", "math", "reservoir-sampling", "medium"]
---

# How to Solve Linked List Random Node

This problem asks us to design a system that can return a random node from a singly linked list, where each node has equal probability of being selected. The challenge is that we don't know the list's length in advance, and we need to make this selection efficiently with each call to `getRandom()`.

## Visual Walkthrough

Let's trace through a small example: `[1 → 3 → 5 → 7]`

**First call to getRandom():**

- We start at node 1: probability of selecting it = 1/1 = 100%
- Move to node 3: probability of replacing current selection = 1/2 = 50%
  - If we replace, current selection becomes 3 (50% chance)
  - If we don't replace, current selection stays 1 (50% chance)
- Move to node 5: probability of replacing current selection = 1/3 ≈ 33.3%
  - Current selection could be 1, 3, or 5 with equal probability
- Move to node 7: probability of replacing current selection = 1/4 = 25%
  - Now each node has exactly 1/4 = 25% chance

**Second call to getRandom():**
We repeat the same process from the beginning, giving each node equal probability again.

The key insight is that as we traverse the list, we give each new node a decreasing probability of replacing our current selection, which mathematically ensures uniform distribution.

## Brute Force Approach

The most straightforward approach would be:

1. Traverse the entire linked list to count its length `n`
2. Generate a random number between 1 and `n`
3. Traverse the list again to find the node at that position

While this works, it requires O(n) time for each `getRandom()` call and O(1) space. The problem becomes: what if we need to call `getRandom()` many times? Each call would require two traversals.

A naive candidate might try to store all values in an array during initialization, then randomly pick from the array. This gives O(1) time for `getRandom()` but requires O(n) space. While this is actually a valid approach, the more interesting (and space-efficient) solution uses reservoir sampling.

## Optimized Approach

The optimal solution uses **Reservoir Sampling**, specifically Algorithm R, which allows us to select a random element from a stream of unknown length with uniform probability using only O(1) space.

**Key Insight:** When we see the k-th node (1-indexed), we replace our current selection with it with probability 1/k. This ensures that after processing n nodes, each node has probability 1/n of being selected.

**Proof Sketch:**

- For the first node: probability = 1/1 = 1
- For the second node: probability it's selected = 1/2
  - Probability first node stays selected = 1 × (1 - 1/2) = 1/2
- For the k-th node: probability it's selected = 1/k
  - Probability any previous node stays selected = (previous probability) × (1 - 1/k) = 1/(k-1) × (k-1)/k = 1/k

Thus, after processing all n nodes, each node has probability exactly 1/n.

## Optimal Solution

Here's the implementation using reservoir sampling:

<div class="code-group">

```python
# Time: O(n) for getRandom() | Space: O(1)
class Solution:
    def __init__(self, head: Optional[ListNode]):
        # Store the head pointer to traverse the list
        self.head = head

    def getRandom(self) -> int:
        # Initialize: we'll traverse from head, count nodes, and track selection
        current = self.head
        selected_value = 0
        count = 0

        # Traverse the entire linked list
        while current:
            count += 1
            # For the k-th node, replace selection with probability 1/k
            # randint(1, count) returns random integer in [1, count]
            # It equals count with probability 1/count
            if random.randint(1, count) == count:
                selected_value = current.val
            current = current.next

        return selected_value
```

```javascript
// Time: O(n) for getRandom() | Space: O(1)
class Solution {
  /**
   * @param {ListNode} head
   */
  constructor(head) {
    // Store the head pointer to traverse the list
    this.head = head;
  }

  /**
   * @return {number}
   */
  getRandom() {
    let current = this.head;
    let selectedValue = 0;
    let count = 0;

    // Traverse the entire linked list
    while (current) {
      count++;
      // For the k-th node, replace selection with probability 1/k
      // Math.random() returns value in [0, 1)
      // Math.floor(Math.random() * count) returns integer in [0, count-1]
      // It equals 0 with probability 1/count
      if (Math.floor(Math.random() * count) === 0) {
        selectedValue = current.val;
      }
      current = current.next;
    }

    return selectedValue;
  }
}
```

```java
// Time: O(n) for getRandom() | Space: O(1)
class Solution {
    private ListNode head;
    private Random random;

    // Constructor: initialize with head and Random object
    public Solution(ListNode head) {
        this.head = head;
        this.random = new Random();
    }

    public int getRandom() {
        ListNode current = head;
        int selectedValue = 0;
        int count = 0;

        // Traverse the entire linked list
        while (current != null) {
            count++;
            // For the k-th node, replace selection with probability 1/k
            // random.nextInt(count) returns integer in [0, count-1]
            // It equals 0 with probability 1/count
            if (random.nextInt(count) == 0) {
                selectedValue = current.val;
            }
            current = current.next;
        }

        return selectedValue;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `getRandom()`: O(n) where n is the length of the linked list. We must traverse the entire list once to ensure uniform probability.
- `__init__()` / constructor: O(1), we just store the head pointer.

**Space Complexity:** O(1) for all operations. We only use a few variables regardless of list size.

**Trade-off Consideration:** If `getRandom()` is called frequently, the array-based solution (store values in array during initialization, then randomly index into it) would be better: O(n) initialization time, O(1) for `getRandom()`, and O(n) space. The reservoir sampling approach is optimal when memory is constrained or when we're dealing with a data stream.

## Common Mistakes

1. **Not resetting traversal for each call:** Some candidates try to maintain state between calls, but you must start from the head each time to ensure proper probabilities.

2. **Off-by-one errors in probability calculation:** Using `randint(0, count)` instead of `randint(1, count)` or misunderstanding the range. Remember: for the k-th node, probability should be exactly 1/k.

3. **Forgetting to handle empty list:** While the problem guarantees at least one node, in real interviews you should check for edge cases. Always ask: "Can the list be empty?"

4. **Using fixed-size random range:** Some candidates generate a random number once and use modulo, but this doesn't give uniform distribution when list length is unknown during traversal.

## When You'll See This Pattern

Reservoir sampling appears in problems where you need to randomly select from a data stream of unknown size:

1. **Random Pick Index (LeetCode 398)** - Exactly the same pattern but with arrays instead of linked lists. You're given an array and need to randomly return an index of a target value.

2. **Linked List Random Node variations** - Any problem requiring random selection from a data structure where you can't or don't want to store all elements.

3. **Online sampling problems** - When data arrives as a stream and you need to maintain a random sample without storing everything.

The pattern is: maintain a candidate and replace it with each new element with decreasing probability (1/k for the k-th element).

## Key Takeaways

1. **Reservoir sampling (Algorithm R)** allows uniform random selection from a stream of unknown length using O(1) space.

2. **Probability trick:** When you see the k-th element, replace your current selection with probability 1/k. This ensures all elements have equal probability after processing the entire stream.

3. **Trade-off awareness:** Consider whether to optimize for time (store in array) or space (use reservoir sampling) based on problem constraints and expected usage patterns.

Related problems: [Random Pick Index](/problem/random-pick-index)
