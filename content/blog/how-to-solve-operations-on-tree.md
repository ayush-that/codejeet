---
title: "How to Solve Operations on Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Operations on Tree. Medium difficulty, 45.0% acceptance rate. Topics: Array, Hash Table, Tree, Depth-First Search, Breadth-First Search."
date: "2029-08-20"
category: "dsa-patterns"
tags: ["operations-on-tree", "array", "hash-table", "tree", "medium"]
---

# How to Solve Operations on Tree

This problem asks you to design a data structure that manages locking operations on a tree. Each node can be locked or unlocked, but with constraints: you can only lock a node if all its descendants AND ancestors are unlocked, and you can only unlock a node you previously locked. What makes this tricky is efficiently checking both ancestors and descendants while supporting multiple operations — a naive approach would be too slow for large trees.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have `parent = [-1, 0, 0, 1, 1, 2, 2]` (a tree with 7 nodes):

```
        0
       / \
      1   2
     / \ / \
    3  4 5  6
```

**Initial State**: All nodes unlocked.

**Operation 1**: `lock(3, 1)` - User 1 wants to lock node 3

- Check ancestors: Node 3 → 1 → 0 (all unlocked ✓)
- Check descendants: Node 3 has no children (✓)
- Result: Success, node 3 is now locked by user 1

**Operation 2**: `lock(1, 2)` - User 2 wants to lock node 1

- Check ancestors: Node 1 → 0 (unlocked ✓)
- Check descendants: Node 1 has children 3 and 4
- Node 3 is locked (✗) - fails immediately
- Result: False, cannot lock because descendant is locked

**Operation 3**: `upgrade(0, 1)` - User 1 wants to upgrade node 0

- Check if node 0 is unlocked (✓)
- Check if node 0 has at least one locked descendant (✓ - node 3)
- Check if all locked descendants are locked by the same user (✓ - only user 1)
- Check ancestors: Node 0 is root, no ancestors (✓)
- Check descendants: Need to ensure we can lock all descendants
- Result: Success, unlocks node 3, locks node 0

The key challenge is performing these checks efficiently without traversing the entire subtree repeatedly.

## Brute Force Approach

A naive approach would store the lock state and user for each node, then traverse the tree for every operation:

- **lock(node, user)**: Traverse up to root to check ancestors, traverse down to all descendants
- **unlock(node, user)**: Just check if node is locked by this user
- **upgrade(node, user)**: Traverse down to find locked descendants, check they're all same user, then traverse up/down for final checks

**Why this fails**: Each operation could take O(n) time where n is number of nodes. With m operations, this becomes O(mn), which is too slow for constraints like n ≤ 2000 and thousands of operations.

<div class="code-group">

```python
# Brute Force Solution - Too Slow
class LockingTree:
    def __init__(self, parent):
        self.parent = parent
        self.n = len(parent)
        self.locked_by = [-1] * self.n  # -1 means unlocked

    def lock(self, num, user):
        # Check ancestors
        curr = num
        while curr != -1:
            if self.locked_by[curr] != -1:
                return False
            curr = self.parent[curr]

        # Check descendants via DFS
        stack = [num]
        while stack:
            node = stack.pop()
            if node != num and self.locked_by[node] != -1:
                return False
            # Add children
            for i in range(self.n):
                if self.parent[i] == node:
                    stack.append(i)

        self.locked_by[num] = user
        return True

    def unlock(self, num, user):
        if self.locked_by[num] == user:
            self.locked_by[num] = -1
            return True
        return False

    def upgrade(self, num, user):
        # Check if node is unlocked
        if self.locked_by[num] != -1:
            return False

        # Check at least one locked descendant
        locked_descendants = []
        stack = [num]
        while stack:
            node = stack.pop()
            if node != num and self.locked_by[node] != -1:
                locked_descendants.append(node)
            # Add children
            for i in range(self.n):
                if self.parent[i] == node:
                    stack.append(i)

        if not locked_descendants:
            return False

        # Check all locked descendants have same user
        first_user = self.locked_by[locked_descendants[0]]
        for node in locked_descendants:
            if self.locked_by[node] != first_user:
                return False

        # Check ancestors
        curr = self.parent[num]
        while curr != -1:
            if self.locked_by[curr] != -1:
                return False
            curr = self.parent[curr]

        # Unlock all descendants
        stack = [num]
        while stack:
            node = stack.pop()
            if node != num:
                self.locked_by[node] = -1
            # Add children
            for i in range(self.n):
                if self.parent[i] == node:
                    stack.append(i)

        # Lock the node
        self.locked_by[num] = user
        return True
```

```javascript
// Brute Force Solution - Too Slow
class LockingTree {
  constructor(parent) {
    this.parent = parent;
    this.n = parent.length;
    this.lockedBy = new Array(this.n).fill(-1); // -1 means unlocked
  }

  lock(num, user) {
    // Check ancestors
    let curr = num;
    while (curr !== -1) {
      if (this.lockedBy[curr] !== -1) return false;
      curr = this.parent[curr];
    }

    // Check descendants via DFS
    const stack = [num];
    while (stack.length) {
      const node = stack.pop();
      if (node !== num && this.lockedBy[node] !== -1) return false;
      // Add children
      for (let i = 0; i < this.n; i++) {
        if (this.parent[i] === node) stack.push(i);
      }
    }

    this.lockedBy[num] = user;
    return true;
  }

  unlock(num, user) {
    if (this.lockedBy[num] === user) {
      this.lockedBy[num] = -1;
      return true;
    }
    return false;
  }

  upgrade(num, user) {
    // Check if node is unlocked
    if (this.lockedBy[num] !== -1) return false;

    // Check at least one locked descendant
    const lockedDescendants = [];
    const stack = [num];
    while (stack.length) {
      const node = stack.pop();
      if (node !== num && this.lockedBy[node] !== -1) {
        lockedDescendants.push(node);
      }
      // Add children
      for (let i = 0; i < this.n; i++) {
        if (this.parent[i] === node) stack.push(i);
      }
    }

    if (lockedDescendants.length === 0) return false;

    // Check all locked descendants have same user
    const firstUser = this.lockedBy[lockedDescendants[0]];
    for (const node of lockedDescendants) {
      if (this.lockedBy[node] !== firstUser) return false;
    }

    // Check ancestors
    let curr = this.parent[num];
    while (curr !== -1) {
      if (this.lockedBy[curr] !== -1) return false;
      curr = this.parent[curr];
    }

    // Unlock all descendants
    const unlockStack = [num];
    while (unlockStack.length) {
      const node = unlockStack.pop();
      if (node !== num) this.lockedBy[node] = -1;
      // Add children
      for (let i = 0; i < this.n; i++) {
        if (this.parent[i] === node) unlockStack.push(i);
      }
    }

    // Lock the node
    this.lockedBy[num] = user;
    return true;
  }
}
```

```java
// Brute Force Solution - Too Slow
class LockingTree {
    private int[] parent;
    private int[] lockedBy;
    private int n;

    public LockingTree(int[] parent) {
        this.parent = parent;
        this.n = parent.length;
        this.lockedBy = new int[n];
        Arrays.fill(lockedBy, -1); // -1 means unlocked
    }

    public boolean lock(int num, int user) {
        // Check ancestors
        int curr = num;
        while (curr != -1) {
            if (lockedBy[curr] != -1) return false;
            curr = parent[curr];
        }

        // Check descendants via DFS
        Stack<Integer> stack = new Stack<>();
        stack.push(num);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (node != num && lockedBy[node] != -1) return false;
            // Add children
            for (int i = 0; i < n; i++) {
                if (parent[i] == node) stack.push(i);
            }
        }

        lockedBy[num] = user;
        return true;
    }

    public boolean unlock(int num, int user) {
        if (lockedBy[num] == user) {
            lockedBy[num] = -1;
            return true;
        }
        return false;
    }

    public boolean upgrade(int num, int user) {
        // Check if node is unlocked
        if (lockedBy[num] != -1) return false;

        // Check at least one locked descendant
        List<Integer> lockedDescendants = new ArrayList<>();
        Stack<Integer> stack = new Stack<>();
        stack.push(num);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (node != num && lockedBy[node] != -1) {
                lockedDescendants.add(node);
            }
            // Add children
            for (int i = 0; i < n; i++) {
                if (parent[i] == node) stack.push(i);
            }
        }

        if (lockedDescendants.isEmpty()) return false;

        // Check all locked descendants have same user
        int firstUser = lockedBy[lockedDescendants.get(0)];
        for (int node : lockedDescendants) {
            if (lockedBy[node] != firstUser) return false;
        }

        // Check ancestors
        int curr = parent[num];
        while (curr != -1) {
            if (lockedBy[curr] != -1) return false;
            curr = parent[curr];
        }

        // Unlock all descendants
        Stack<Integer> unlockStack = new Stack<>();
        unlockStack.push(num);
        while (!unlockStack.isEmpty()) {
            int node = unlockStack.pop();
            if (node != num) lockedBy[node] = -1;
            // Add children
            for (int i = 0; i < n; i++) {
                if (parent[i] == node) unlockStack.push(i);
            }
        }

        // Lock the node
        lockedBy[num] = user;
        return true;
    }
}
```

</div>

## Optimized Approach

The key insight is that we need O(1) or O(log n) operations, not O(n). We can achieve this by:

1. **Precomputing children lists** so we don't scan the entire parent array to find children
2. **Tracking locked status efficiently**:
   - Store `lockedBy[node]` for O(1) lock/unlock checks
   - For ancestor checks: just walk up the parent chain (O(depth) which is O(n) worst case but acceptable)
   - For descendant checks in `upgrade()`: use DFS on precomputed children
   - For `lock()` descendant check: we actually don't need to check descendants! The constraint only mentions ancestors for locking.

Wait — let's re-examine the problem statement carefully. For `lock()`, we need:

- All ancestors must be unlocked ✓
- The node itself must be unlocked ✓
- **No constraint about descendants!** This is a common misunderstanding.

So the optimized approach becomes:

1. Precompute adjacency list of children for efficient DFS
2. `lock()`: Check ancestors by walking parent chain
3. `unlock()`: Simple O(1) check
4. `upgrade()`:
   - Check node is unlocked
   - DFS to find locked descendants and check they're all same user
   - Check ancestors
   - DFS to unlock all descendants
   - Lock the node

## Optimal Solution

Here's the efficient implementation:

<div class="code-group">

```python
# Optimal Solution
# Time:
#   - Constructor: O(n) to build children adjacency list
#   - lock/unlock: O(h) where h is height of tree (worst case O(n))
#   - upgrade: O(n) in worst case (need to traverse all descendants)
# Space: O(n) for storing children adjacency list and lock states

class LockingTree:
    def __init__(self, parent):
        self.parent = parent
        self.n = len(parent)
        # Build children adjacency list for efficient descendant traversal
        self.children = [[] for _ in range(self.n)]
        for i in range(1, self.n):  # Skip root (0) since it has no parent
            self.children[parent[i]].append(i)
        # Track lock state: -1 means unlocked, otherwise user id
        self.locked_by = [-1] * self.n

    def lock(self, num, user):
        """Lock node if all ancestors are unlocked"""
        # Check if node is already locked
        if self.locked_by[num] != -1:
            return False

        # Check all ancestors are unlocked by walking up parent chain
        curr = self.parent[num]
        while curr != -1:
            if self.locked_by[curr] != -1:
                return False
            curr = self.parent[curr]

        # Lock the node
        self.locked_by[num] = user
        return True

    def unlock(self, num, user):
        """Unlock node if locked by the same user"""
        if self.locked_by[num] == user:
            self.locked_by[num] = -1
            return True
        return False

    def upgrade(self, num, user):
        """Upgrade node if:
        1. Node is unlocked
        2. Has at least one locked descendant
        3. All locked descendants are locked by the same user
        4. All ancestors are unlocked
        Then unlock all descendants and lock this node
        """
        # Condition 1: Node must be unlocked
        if self.locked_by[num] != -1:
            return False

        # Condition 2 & 3: Find locked descendants and check they're all same user
        locked_descendants = []
        target_user = None

        # DFS to find all locked descendants
        stack = [num]
        while stack:
            node = stack.pop()
            # Skip the node itself (we're checking descendants)
            if node != num and self.locked_by[node] != -1:
                locked_descendants.append(node)
                if target_user is None:
                    target_user = self.locked_by[node]
                elif self.locked_by[node] != target_user:
                    # Found descendant locked by different user
                    return False
            # Add children to stack
            for child in self.children[node]:
                stack.append(child)

        # Must have at least one locked descendant
        if not locked_descendants:
            return False

        # Condition 4: Check all ancestors are unlocked
        curr = self.parent[num]
        while curr != -1:
            if self.locked_by[curr] != -1:
                return False
            curr = self.parent[curr]

        # Unlock all descendants (including the ones we found)
        # We need to unlock ALL descendants, not just the locked ones
        stack = [num]
        while stack:
            node = stack.pop()
            if node != num:
                self.locked_by[node] = -1
            # Add children
            for child in self.children[node]:
                stack.append(child)

        # Finally, lock the current node
        self.locked_by[num] = user
        return True
```

```javascript
// Optimal Solution
// Time:
//   - Constructor: O(n) to build children adjacency list
//   - lock/unlock: O(h) where h is height of tree (worst case O(n))
//   - upgrade: O(n) in worst case (need to traverse all descendants)
// Space: O(n) for storing children adjacency list and lock states

class LockingTree {
  constructor(parent) {
    this.parent = parent;
    this.n = parent.length;
    // Build children adjacency list for efficient descendant traversal
    this.children = Array.from({ length: this.n }, () => []);
    for (let i = 1; i < this.n; i++) {
      // Skip root (0) since it has no parent
      this.children[parent[i]].push(i);
    }
    // Track lock state: -1 means unlocked, otherwise user id
    this.lockedBy = new Array(this.n).fill(-1);
  }

  lock(num, user) {
    // Check if node is already locked
    if (this.lockedBy[num] !== -1) return false;

    // Check all ancestors are unlocked
    let curr = this.parent[num];
    while (curr !== -1) {
      if (this.lockedBy[curr] !== -1) return false;
      curr = this.parent[curr];
    }

    // Lock the node
    this.lockedBy[num] = user;
    return true;
  }

  unlock(num, user) {
    if (this.lockedBy[num] === user) {
      this.lockedBy[num] = -1;
      return true;
    }
    return false;
  }

  upgrade(num, user) {
    // Condition 1: Node must be unlocked
    if (this.lockedBy[num] !== -1) return false;

    // Condition 2 & 3: Find locked descendants
    const lockedDescendants = [];
    let targetUser = null;

    // DFS to find locked descendants
    const stack = [num];
    while (stack.length) {
      const node = stack.pop();
      if (node !== num && this.lockedBy[node] !== -1) {
        lockedDescendants.push(node);
        if (targetUser === null) {
          targetUser = this.lockedBy[node];
        } else if (this.lockedBy[node] !== targetUser) {
          // Different user found
          return false;
        }
      }
      // Add children
      for (const child of this.children[node]) {
        stack.push(child);
      }
    }

    // Must have at least one locked descendant
    if (lockedDescendants.length === 0) return false;

    // Condition 4: Check ancestors
    let curr = this.parent[num];
    while (curr !== -1) {
      if (this.lockedBy[curr] !== -1) return false;
      curr = this.parent[curr];
    }

    // Unlock all descendants
    const unlockStack = [num];
    while (unlockStack.length) {
      const node = unlockStack.pop();
      if (node !== num) this.lockedBy[node] = -1;
      // Add children
      for (const child of this.children[node]) {
        unlockStack.push(child);
      }
    }

    // Lock the current node
    this.lockedBy[num] = user;
    return true;
  }
}
```

```java
// Optimal Solution
// Time:
//   - Constructor: O(n) to build children adjacency list
//   - lock/unlock: O(h) where h is height of tree (worst case O(n))
//   - upgrade: O(n) in worst case (need to traverse all descendants)
// Space: O(n) for storing children adjacency list and lock states

class LockingTree {
    private int[] parent;
    private List<Integer>[] children;
    private int[] lockedBy;
    private int n;

    public LockingTree(int[] parent) {
        this.parent = parent;
        this.n = parent.length;
        // Build children adjacency list
        this.children = new List[n];
        for (int i = 0; i < n; i++) {
            children[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {  // Skip root (0)
            children[parent[i]].add(i);
        }
        // Initialize lock states
        this.lockedBy = new int[n];
        Arrays.fill(lockedBy, -1); // -1 means unlocked
    }

    public boolean lock(int num, int user) {
        // Check if already locked
        if (lockedBy[num] != -1) return false;

        // Check ancestors
        int curr = parent[num];
        while (curr != -1) {
            if (lockedBy[curr] != -1) return false;
            curr = parent[curr];
        }

        lockedBy[num] = user;
        return true;
    }

    public boolean unlock(int num, int user) {
        if (lockedBy[num] == user) {
            lockedBy[num] = -1;
            return true;
        }
        return false;
    }

    public boolean upgrade(int num, int user) {
        // Condition 1: Node must be unlocked
        if (lockedBy[num] != -1) return false;

        // Condition 2 & 3: Find locked descendants
        List<Integer> lockedDescendants = new ArrayList<>();
        Integer targetUser = null;

        // DFS to find locked descendants
        Stack<Integer> stack = new Stack<>();
        stack.push(num);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (node != num && lockedBy[node] != -1) {
                lockedDescendants.add(node);
                if (targetUser == null) {
                    targetUser = lockedBy[node];
                } else if (lockedBy[node] != targetUser) {
                    return false; // Different user found
                }
            }
            // Add children
            for (int child : children[node]) {
                stack.push(child);
            }
        }

        // Must have at least one locked descendant
        if (lockedDescendants.isEmpty()) return false;

        // Condition 4: Check ancestors
        int curr = parent[num];
        while (curr != -1) {
            if (lockedBy[curr] != -1) return false;
            curr = parent[curr];
        }

        // Unlock all descendants
        Stack<Integer> unlockStack = new Stack<>();
        unlockStack.push(num);
        while (!unlockStack.isEmpty()) {
            int node = unlockStack.pop();
            if (node != num) lockedBy[node] = -1;
            // Add children
            for (int child : children[node]) {
                unlockStack.push(child);
            }
        }

        // Lock the current node
        lockedBy[num] = user;
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor**: O(n) - We iterate through the parent array once to build the children adjacency list.
- **lock()**: O(h) where h is the height of the tree. In worst case (skewed tree), h = n, so O(n).
- **unlock()**: O(1) - Simple array access and comparison.
- **upgrade()**: O(n) in worst case - We might need to traverse all descendants twice (once to find locked descendants, once to unlock them).

**Space Complexity:** O(n)

- O(n) for the children adjacency list (each node appears once as a child)
- O(n) for the lockedBy array
- O(n) for DFS stack in worst case (skewed tree)

## Common Mistakes

1. **Checking descendants in lock()**: The problem only requires checking ancestors for lock(), not descendants. Many candidates waste time checking descendants unnecessarily.

2. **Not precomputing children**: Scanning the entire parent array to find children for each operation gives O(n²) time complexity. Always precompute the adjacency list in the constructor.

3. **Forgetting to check ALL conditions for upgrade()**: The upgrade operation has 4 conditions that must ALL be satisfied. Missing any one (like checking that all locked descendants have the same user) will cause failures.

4. **Not unlocking ALL descendants in upgrade()**: The problem says "unlock all descendants" not just the locked ones. Some candidates only unlock the descendants they found were locked, which is incorrect.

## When You'll See This Pattern

This problem combines tree traversal with state management, a common pattern in system design and game development problems:

1. **Throne Inheritance (LeetCode 1600)**: Similar tree structure with specific traversal rules for inheritance order. Both require efficient tree navigation and state tracking.

2. **Design In-Memory File System (LeetCode 588)**: Tree-like structure (directory tree) with operations that need to traverse parents and children efficiently.

3. **Design Search Autocomplete System (LeetCode 642)**: While not a tree, it uses similar prefix traversal concepts in a trie data structure.

The core pattern is: when you need to frequently traverse relationships (parent/child) and check/update states, precompute the adjacency relationships and use DFS/BFS for traversal.

## Key Takeaways

1. **Always precompute relationships**: When given a parent array, immediately build a children adjacency list in the constructor. This transforms O(n) child-finding operations into O(1) lookups.

2. **Read constraints carefully**: The lock() operation only checks ancestors, not descendants. Misreading this leads to unnecessary complexity.

3. **DFS is your friend for tree operations**: When you need to process all descendants, DFS with a stack (or recursion) is the natural choice. Remember to handle the base case of not processing the starting node itself when looking for descendants.

4. **Break complex operations into clear conditions**: For upgrade(), explicitly check each condition separately. This makes the code more readable and debuggable.

Related problems: [Throne Inheritance](/problem/throne-inheritance)
