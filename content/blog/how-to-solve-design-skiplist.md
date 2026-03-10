---
title: "How to Solve Design Skiplist — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Design Skiplist. Hard difficulty, 59.5% acceptance rate. Topics: Linked List, Design."
date: "2029-02-25"
category: "dsa-patterns"
tags: ["design-skiplist", "linked-list", "design", "hard"]
---

# How to Design a Skiplist

Designing a skiplist is a challenging problem that tests your understanding of probabilistic data structures and multi-level linked lists. Unlike balanced trees that require complex rotations, skiplists achieve O(log n) operations through randomization and multiple layers of linked lists. The tricky part is maintaining the multi-level structure correctly during insertions and deletions while ensuring proper connections between levels.

## Visual Walkthrough

Let's trace through building a skiplist with these operations: `add(3)`, `add(6)`, `add(7)`, `add(9)`, `search(6)`, `erase(6)`, `search(6)`.

**Step 1: Initialization**
We start with an empty skiplist containing just head nodes at each level. A skiplist has multiple levels (we'll use a max height of 4 for this example), with each level being a sorted linked list. The bottom level (level 0) contains all elements.

**Step 2: add(3)**
We flip a coin to determine how many levels 3 will appear in. Let's say it gets promoted to level 2. We create nodes for level 0, 1, and 2, linking them vertically. At each level, we find the insertion point (just before where 3 should go) and insert it.

**Step 3: add(6)**
6 gets promoted to level 1. We traverse from the top level, moving right while the next node exists and its value < 6. At each level where we'll insert 6, we remember the node just before the insertion point.

**Step 4: add(7)**
7 gets promoted to level 3 (all levels). This becomes our highest node so far.

**Step 5: add(9)**
9 gets promoted to level 0 only (bottom level).

**Step 6: search(6)**
Start at the top level (level 3). Move right while next node exists and its value ≤ 6. At level 3, 7 > 6, so go down to level 2. At level 2, 3 < 6, move right to null, go down to level 1. At level 1, find 6. Return true.

**Step 7: erase(6)**
Similar to search, but at each level where we find 6, we update the previous node's next pointer to skip over 6. We also need to clean up empty levels if needed.

**Step 8: search(6) after erase**
Traverse again, won't find 6. Return false.

The key insight is that higher levels act as "express lanes" that let us skip over many elements, giving us O(log n) performance on average.

## Brute Force Approach

A naive approach might use a single sorted linked list. This would give us:

- Search: O(n) - must traverse the entire list in worst case
- Add: O(n) - must find the correct position
- Erase: O(n) - must find the element first

The code would be simple but too slow for large datasets. Another brute force might use a balanced BST, but the problem specifically asks for a skiplist implementation.

The issue with a single linked list is the linear traversal time. We need a way to "skip" over elements to achieve logarithmic time complexity.

## Optimized Approach

The skiplist solves the linear time problem by adding multiple layers of linked lists. Here's the key reasoning:

1. **Multi-level structure**: Maintain several linked lists at different "heights". Level 0 contains all elements, level 1 contains roughly half the elements, level 2 contains roughly a quarter, and so on.

2. **Randomized height**: When adding a new element, we randomly determine how many levels it will appear in using coin flips. This randomization ensures balanced structure on average.

3. **Search path tracking**: For all operations, we traverse from the top level down, keeping track of the last node visited at each level that was less than our target value. This gives us the insertion points for add or the nodes to update for erase.

4. **Tower connections**: Nodes at higher levels have "down" pointers to their counterparts at lower levels, forming vertical "towers".

The algorithm for search/add/erase follows this pattern:

- Start at the topmost level head
- While current level ≥ 0:
  - Move right while next node exists and its value < target
  - If adding/erasing, record the current node at this level
  - Go down one level
- For search: check if the next node at level 0 equals target
- For add: insert new node at each level up to its random height
- For erase: remove node from each level where it appears

## Optimal Solution

<div class="code-group">

```python
import random
from typing import Optional

class Node:
    """Node class for skiplist with value and pointers to next and down nodes."""
    def __init__(self, val: int = -1):
        self.val = val
        self.next = None  # Pointer to next node at same level
        self.down = None  # Pointer to same node at lower level

class Skiplist:
    """
    Skiplist implementation with O(log n) average time complexity for search, add, and erase.
    Uses randomization to determine node heights for probabilistic balance.
    """

    def __init__(self):
        # Create initial head node for level 0
        self.head = Node()
        self.max_level = 0  # Track current maximum level
        self.level_prob = 0.5  # Probability for promoting to next level
        random.seed()  # Initialize random number generator

    def _find(self, target: int) -> list:
        """
        Find the predecessor nodes at each level where target would be inserted.
        Returns list of nodes where node.next.val >= target at each level.
        """
        predecessors = [None] * (self.max_level + 1)
        current = self.head

        # Traverse from top level down to level 0
        for level in range(self.max_level, -1, -1):
            # Move right while next node exists and its value < target
            while current.next and current.next.val < target:
                current = current.next
            # Record the predecessor at this level
            predecessors[level] = current
            # Move down to next level if possible
            if current.down:
                current = current.down

        return predecessors

    def search(self, target: int) -> bool:
        """
        Search for target in skiplist.
        Returns True if target exists, False otherwise.
        """
        current = self.head

        # Start from top level and work down
        for level in range(self.max_level, -1, -1):
            # Move right while next node exists and its value < target
            while current.next and current.next.val < target:
                current = current.next
            # Move down to next level
            if current.down:
                current = current.down

        # At level 0, check if next node equals target
        return current.next is not None and current.next.val == target

    def add(self, num: int) -> None:
        """
        Add num to skiplist. Determines random height for new node.
        """
        # Find predecessors at each level
        predecessors = self._find(num)

        # Determine height for new node using coin flips
        height = 0
        while random.random() < self.level_prob and height < 16:  # Cap height at 16
            height += 1

        # If height exceeds current max level, add new head levels
        while height > self.max_level:
            new_head = Node()
            new_head.down = self.head
            self.head = new_head
            self.max_level += 1
            # Extend predecessors list for new level
            predecessors.append(self.head)

        # Create new node tower from bottom up
        prev_node = None
        for level in range(height + 1):
            # Get predecessor at this level
            pred = predecessors[level] if level < len(predecessors) else self.head

            # Create new node for this level
            new_node = Node(num)
            new_node.next = pred.next
            pred.next = new_node

            # Link vertically to node at lower level
            if prev_node:
                prev_node.down = new_node

            # Update prev_node for next iteration (going up levels)
            prev_node = new_node

    def erase(self, num: int) -> bool:
        """
        Remove num from skiplist if it exists.
        Returns True if num was removed, False if not found.
        """
        # Find predecessors at each level
        predecessors = self._find(num)

        # Check if num exists at level 0
        if not predecessors[0].next or predecessors[0].next.val != num:
            return False

        # Remove num from all levels where it appears
        for level in range(self.max_level + 1):
            if level < len(predecessors) and predecessors[level].next and predecessors[level].next.val == num:
                # Skip over the node to remove it
                predecessors[level].next = predecessors[level].next.next

        # Clean up empty top levels (head nodes with no next)
        while self.max_level > 0 and self.head.next is None:
            self.head = self.head.down
            self.max_level -= 1

        return True
```

```javascript
class Node {
  /**
   * Node class for skiplist with value and pointers to next and down nodes.
   * @param {number} val - Value stored in node, default -1 for head nodes
   */
  constructor(val = -1) {
    this.val = val;
    this.next = null; // Pointer to next node at same level
    this.down = null; // Pointer to same node at lower level
  }
}

class Skiplist {
  /**
   * Skiplist implementation with O(log n) average time complexity.
   * Uses randomization to determine node heights for probabilistic balance.
   */
  constructor() {
    // Create initial head node for level 0
    this.head = new Node();
    this.maxLevel = 0; // Track current maximum level
    this.levelProb = 0.5; // Probability for promoting to next level
  }

  /**
   * Find the predecessor nodes at each level where target would be inserted.
   * @param {number} target - Value to search for
   * @returns {Node[]} Array of predecessor nodes at each level
   */
  _find(target) {
    const predecessors = new Array(this.maxLevel + 1).fill(null);
    let current = this.head;

    // Traverse from top level down to level 0
    for (let level = this.maxLevel; level >= 0; level--) {
      // Move right while next node exists and its value < target
      while (current.next && current.next.val < target) {
        current = current.next;
      }
      // Record the predecessor at this level
      predecessors[level] = current;
      // Move down to next level if possible
      if (current.down) {
        current = current.down;
      }
    }

    return predecessors;
  }

  /**
   * Search for target in skiplist.
   * @param {number} target - Value to search for
   * @returns {boolean} True if target exists, false otherwise
   */
  search(target) {
    let current = this.head;

    // Start from top level and work down
    for (let level = this.maxLevel; level >= 0; level--) {
      // Move right while next node exists and its value < target
      while (current.next && current.next.val < target) {
        current = current.next;
      }
      // Move down to next level
      if (current.down) {
        current = current.down;
      }
    }

    // At level 0, check if next node equals target
    return current.next !== null && current.next.val === target;
  }

  /**
   * Add num to skiplist. Determines random height for new node.
   * @param {number} num - Value to add
   */
  add(num) {
    // Find predecessors at each level
    const predecessors = this._find(num);

    // Determine height for new node using coin flips
    let height = 0;
    while (Math.random() < this.levelProb && height < 16) {
      // Cap height at 16
      height++;
    }

    // If height exceeds current max level, add new head levels
    while (height > this.maxLevel) {
      const newHead = new Node();
      newHead.down = this.head;
      this.head = newHead;
      this.maxLevel++;
      // Extend predecessors array for new level
      predecessors.push(this.head);
    }

    // Create new node tower from bottom up
    let prevNode = null;
    for (let level = 0; level <= height; level++) {
      // Get predecessor at this level
      const pred = level < predecessors.length ? predecessors[level] : this.head;

      // Create new node for this level
      const newNode = new Node(num);
      newNode.next = pred.next;
      pred.next = newNode;

      // Link vertically to node at lower level
      if (prevNode) {
        prevNode.down = newNode;
      }

      // Update prevNode for next iteration (going up levels)
      prevNode = newNode;
    }
  }

  /**
   * Remove num from skiplist if it exists.
   * @param {number} num - Value to remove
   * @returns {boolean} True if num was removed, false if not found
   */
  erase(num) {
    // Find predecessors at each level
    const predecessors = this._find(num);

    // Check if num exists at level 0
    if (!predecessors[0].next || predecessors[0].next.val !== num) {
      return false;
    }

    // Remove num from all levels where it appears
    for (let level = 0; level <= this.maxLevel; level++) {
      if (
        level < predecessors.length &&
        predecessors[level].next &&
        predecessors[level].next.val === num
      ) {
        // Skip over the node to remove it
        predecessors[level].next = predecessors[level].next.next;
      }
    }

    // Clean up empty top levels (head nodes with no next)
    while (this.maxLevel > 0 && this.head.next === null) {
      this.head = this.head.down;
      this.maxLevel--;
    }

    return true;
  }
}
```

```java
import java.util.Random;

class Node {
    int val;
    Node next;
    Node down;

    public Node() {
        this(-1);
    }

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.down = null;
    }
}

class Skiplist {
    private Node head;
    private int maxLevel;
    private final double LEVEL_PROB = 0.5;
    private Random random;

    /**
     * Skiplist implementation with O(log n) average time complexity.
     * Uses randomization to determine node heights for probabilistic balance.
     */
    public Skiplist() {
        // Create initial head node for level 0
        this.head = new Node();
        this.maxLevel = 0;
        this.random = new Random();
    }

    /**
     * Find the predecessor nodes at each level where target would be inserted.
     * @param target Value to search for
     * @return Array of predecessor nodes at each level
     */
    private Node[] find(int target) {
        Node[] predecessors = new Node[maxLevel + 1];
        Node current = head;

        // Traverse from top level down to level 0
        for (int level = maxLevel; level >= 0; level--) {
            // Move right while next node exists and its value < target
            while (current.next != null && current.next.val < target) {
                current = current.next;
            }
            // Record the predecessor at this level
            predecessors[level] = current;
            // Move down to next level if possible
            if (current.down != null) {
                current = current.down;
            }
        }

        return predecessors;
    }

    /**
     * Search for target in skiplist.
     * @param target Value to search for
     * @return True if target exists, false otherwise
     */
    public boolean search(int target) {
        Node current = head;

        // Start from top level and work down
        for (int level = maxLevel; level >= 0; level--) {
            // Move right while next node exists and its value < target
            while (current.next != null && current.next.val < target) {
                current = current.next;
            }
            // Move down to next level
            if (current.down != null) {
                current = current.down;
            }
        }

        // At level 0, check if next node equals target
        return current.next != null && current.next.val == target;
    }

    /**
     * Add num to skiplist. Determines random height for new node.
     * @param num Value to add
     */
    public void add(int num) {
        // Find predecessors at each level
        Node[] predecessors = find(num);

        // Determine height for new node using coin flips
        int height = 0;
        while (random.nextDouble() < LEVEL_PROB && height < 16) {  // Cap height at 16
            height++;
        }

        // If height exceeds current max level, add new head levels
        while (height > maxLevel) {
            Node newHead = new Node();
            newHead.down = head;
            head = newHead;
            maxLevel++;
            // Extend predecessors array for new level
            Node[] newPredecessors = new Node[maxLevel + 1];
            System.arraycopy(predecessors, 0, newPredecessors, 0, predecessors.length);
            newPredecessors[maxLevel] = head;
            predecessors = newPredecessors;
        }

        // Create new node tower from bottom up
        Node prevNode = null;
        for (int level = 0; level <= height; level++) {
            // Get predecessor at this level
            Node pred = level < predecessors.length ? predecessors[level] : head;

            // Create new node for this level
            Node newNode = new Node(num);
            newNode.next = pred.next;
            pred.next = newNode;

            // Link vertically to node at lower level
            if (prevNode != null) {
                prevNode.down = newNode;
            }

            // Update prevNode for next iteration (going up levels)
            prevNode = newNode;
        }
    }

    /**
     * Remove num from skiplist if it exists.
     * @param num Value to remove
     * @return True if num was removed, false if not found
     */
    public boolean erase(int num) {
        // Find predecessors at each level
        Node[] predecessors = find(num);

        // Check if num exists at level 0
        if (predecessors[0].next == null || predecessors[0].next.val != num) {
            return false;
        }

        // Remove num from all levels where it appears
        for (int level = 0; level <= maxLevel; level++) {
            if (level < predecessors.length &&
                predecessors[level].next != null &&
                predecessors[level].next.val == num) {
                // Skip over the node to remove it
                predecessors[level].next = predecessors[level].next.next;
            }
        }

        // Clean up empty top levels (head nodes with no next)
        while (maxLevel > 0 && head.next == null) {
            head = head.down;
            maxLevel--;
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `search`, `add`, `erase`: O(log n) average case, O(n) worst case
  - Each operation traverses from top level to bottom level
  - With proper randomization, we expect about log₂(n) levels
  - At each level, we traverse a constant number of nodes on average
  - Worst case occurs with poor randomization but is unlikely

**Space Complexity:**

- O(n) average case
  - Each element appears in multiple levels (1 + 1/2 + 1/4 + ... = 2 levels on average)
  - So approximately 2n nodes total
  - Head nodes add O(log n) additional space

The logarithmic time comes from the multi-level structure: higher levels let us skip exponentially more elements. The space tradeoff is reasonable as each element appears in about 2 levels on average.

## Common Mistakes

1. **Forgetting to update all levels in erase**: When removing a node, you must remove it from every level where it appears, not just level 0. Check each level and update the predecessor's next pointer.

2. **Incorrect predecessor tracking in `_find`**: The traversal must record nodes where `node.next.val >= target` at each level. A common error is recording the wrong node or not handling the descent correctly.

3. **Not cleaning up empty top levels**: After erasing nodes, higher levels might become empty (head node with no next). Failing to remove these levels wastes space and makes subsequent operations slower.

4. **Infinite loops in height randomization**: Always cap the maximum height (we use 16) to prevent excessively tall nodes that waste memory. Without a cap, in theory a node could get promoted indefinitely with very low probability.

5. **Building the tower top-down instead of bottom-up**: When adding a node, create the bottom level first, then link upward. Creating top-down makes it harder to maintain the vertical connections correctly.

## When You'll See This Pattern

The skiplist pattern appears in problems requiring ordered data structures with fast search, insertion, and deletion:

1. **Design Ordered Set/Map**: Problems like [Design Twitter](/problem/design-twitter) or news feed systems often need ordered data structures. While usually implemented with balanced trees, skiplists are a valid alternative.

2. **Range Queries**: Problems involving finding elements in a range benefit from skiplists' ordered nature and O(log n) operations.

3. **Database Indexing**: Skiplists are used in some database systems for maintaining indexes due to their simplicity compared to balanced trees.

The multi-level "express lane" concept appears in other algorithms too, like multi-level cache hierarchies or multi-resolution data structures in computational geometry.

## Key Takeaways

1. **Randomization can replace complex balancing**: While balanced trees use rotations, skiplists use simple randomization to achieve O(log n) performance on average. This tradeoff (probabilistic vs guaranteed bounds) is important in system design.

2. **Multi-level structures enable skipping**: Adding layers with exponentially sparser elements creates "express lanes" that skip over many elements, reducing traversal time from O(n) to O(log n).

3. **Track predecessors during traversal**: For insertion and deletion in linked structures, always keep track of the node before the insertion/deletion point at each level.

4. **Consider worst-case scenarios**: Even with randomization, implement safeguards like height caps and empty level cleanup to handle edge cases.

Related problems: [Design HashSet](/problem/design-hashset), [Design HashMap](/problem/design-hashmap), [Design Linked List](/problem/design-linked-list)
