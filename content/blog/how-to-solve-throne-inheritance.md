---
title: "How to Solve Throne Inheritance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Throne Inheritance. Medium difficulty, 66.9% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Design."
date: "2029-06-22"
category: "dsa-patterns"
tags: ["throne-inheritance", "hash-table", "tree", "depth-first-search", "medium"]
---

## How to Solve Throne Inheritance

This problem asks us to model a royal family tree where people can be born, die, and have their inheritance order calculated at any time. The tricky part is that inheritance follows a specific rule: when someone dies, they're removed from the inheritance order, but the overall order remains based on depth-first traversal of the family tree. This is essentially a tree traversal problem disguised as a system design challenge.

## Visual Walkthrough

Let's trace through a small example to build intuition:

1. **Initialization**: King "king" is born.
   - Inheritance order: ["king"]

2. **Births**:
   - `birth("king", "andy")` → Andy is first child of king
   - `birth("king", "bob")` → Bob is second child
   - `birth("king", "catherine")` → Catherine is third child
   - `birth("andy", "matthew")` → Matthew is child of Andy
   - `birth("bob", "alex")` → Alex is child of Bob

   Family tree:

   ```
        king
       /  |  \
    andy bob catherine
      |    |
   matthew alex
   ```

3. **Inheritance**:
   - `getInheritanceOrder()` returns DFS order: ["king", "andy", "matthew", "bob", "alex", "catherine"]

4. **Death**:
   - `death("bob")` → Bob dies but remains in tree
   - `getInheritanceOrder()` now returns: ["king", "andy", "matthew", "alex", "catherine"]
   - Notice: Bob is skipped, but Alex (Bob's child) remains in order

The key insight: **Inheritance order is always a DFS traversal of the living members**. When someone dies, we don't remove them from the tree structure (since their children might still be alive), we just skip them during traversal.

## Brute Force Approach

A naive approach might be to rebuild the inheritance list from scratch every time `getInheritanceOrder()` is called:

1. Store parent-child relationships in a list or simple dictionary
2. On each `getInheritanceOrder()` call:
   - Perform DFS from the king
   - Collect all living people in DFS order
   - Return the list

**Why this is inefficient:**

- Every `getInheritanceOrder()` call requires O(n) time where n is total people (living + dead)
- If `getInheritanceOrder()` is called frequently (k times), time becomes O(kn)
- We're not leveraging the fact that the tree structure changes slowly (only on births/deaths)

**What makes this problem interesting:** We need a data structure that supports:

- Fast addition of children (births)
- Fast marking of deaths (but not removal from structure)
- Efficient generation of inheritance order

## Optimized Approach

The optimal solution uses a **tree structure with adjacency lists** and **DFS with pruning**:

1. **Data Structure Choice**:
   - Use a hash map to store parent → list of children (adjacency list representation)
   - Use a set to track dead people for O(1) death checks
   - This gives us O(1) birth operations and O(1) death operations

2. **Key Insight**:
   - Inheritance order is simply DFS traversal skipping dead nodes
   - We don't need to modify the tree when someone dies
   - We can perform DFS once per `getInheritanceOrder()` call, checking each node against the death set

3. **DFS Implementation Details**:
   - Start DFS from the king
   - For each node, if alive, add to result
   - Recursively visit all children in order
   - This maintains the "oldest child first" inheritance rule automatically

4. **Why This Works**:
   - Births: O(1) to add child to parent's list
   - Deaths: O(1) to add to death set
   - Inheritance: O(n) where n is living people (we only traverse living nodes in DFS)

## Optimal Solution

<div class="code-group">

```python
class ThroneInheritance:
    # Time:
    # - __init__: O(1)
    # - birth: O(1)
    # - death: O(1)
    # - getInheritanceOrder: O(n) where n is number of living people
    # Space: O(n) for storing tree and death set

    def __init__(self, kingName: str):
        # Initialize with the king as root of the family tree
        self.king = kingName
        # Adjacency list: parent -> list of children
        self.tree = {kingName: []}
        # Set to track deceased family members for O(1) lookup
        self.dead = set()

    def birth(self, parentName: str, childName: str) -> None:
        # Add child to parent's list of children
        # If parent doesn't exist in tree yet (shouldn't happen per constraints), initialize
        if parentName not in self.tree:
            self.tree[parentName] = []
        self.tree[parentName].append(childName)
        # Initialize empty children list for the new child
        self.tree[childName] = []

    def death(self, name: str) -> None:
        # Mark person as deceased by adding to death set
        # We don't remove them from the tree structure since their children might still inherit
        self.dead.add(name)

    def getInheritanceOrder(self) -> List[str]:
        # Perform DFS starting from king, skipping deceased members
        order = []

        def dfs(person):
            # Only add to order if person is alive
            if person not in self.dead:
                order.append(person)
            # Recursively visit all children in birth order
            for child in self.tree[person]:
                dfs(child)

        # Start DFS from the king
        dfs(self.king)
        return order
```

```javascript
class ThroneInheritance {
  // Time:
  // - constructor: O(1)
  // - birth: O(1)
  // - death: O(1)
  // - getInheritanceOrder: O(n) where n is number of living people
  // Space: O(n) for storing tree and death set

  constructor(kingName) {
    // Store the king as root of family tree
    this.king = kingName;
    // Map to store parent-child relationships
    this.tree = new Map();
    // Initialize with king having empty children array
    this.tree.set(kingName, []);
    // Set to track deceased family members
    this.dead = new Set();
  }

  birth(parentName, childName) {
    // Add child to parent's children list
    if (!this.tree.has(parentName)) {
      this.tree.set(parentName, []);
    }
    this.tree.get(parentName).push(childName);
    // Initialize empty children array for new child
    this.tree.set(childName, []);
  }

  death(name) {
    // Mark person as deceased
    this.dead.add(name);
  }

  getInheritanceOrder() {
    const order = [];

    // Helper function for DFS traversal
    const dfs = (person) => {
      // Add to inheritance order only if alive
      if (!this.dead.has(person)) {
        order.push(person);
      }
      // Visit all children in birth order
      const children = this.tree.get(person) || [];
      for (const child of children) {
        dfs(child);
      }
    };

    // Start DFS from the king
    dfs(this.king);
    return order;
  }
}
```

```java
class ThroneInheritance {
    // Time:
    // - ThroneInheritance: O(1)
    // - birth: O(1)
    // - death: O(1)
    // - getInheritanceOrder: O(n) where n is number of living people
    // Space: O(n) for storing tree and death set

    private String king;
    private Map<String, List<String>> tree;
    private Set<String> dead;

    public ThroneInheritance(String kingName) {
        // Initialize with king as root
        this.king = kingName;
        this.tree = new HashMap<>();
        // Start with king having empty children list
        this.tree.put(kingName, new ArrayList<>());
        this.dead = new HashSet<>();
    }

    public void birth(String parentName, String childName) {
        // Add child to parent's children list
        tree.putIfAbsent(parentName, new ArrayList<>());
        tree.get(parentName).add(childName);
        // Initialize empty children list for new child
        tree.put(childName, new ArrayList<>());
    }

    public void death(String name) {
        // Mark person as deceased
        dead.add(name);
    }

    public List<String> getInheritanceOrder() {
        List<String> order = new ArrayList<>();
        // Perform DFS starting from king
        dfs(king, order);
        return order;
    }

    private void dfs(String person, List<String> order) {
        // Add to inheritance order only if alive
        if (!dead.contains(person)) {
            order.add(person);
        }
        // Visit all children in birth order
        for (String child : tree.getOrDefault(person, new ArrayList<>())) {
            dfs(child, order);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `birth(parentName, childName)`: O(1) - just append to parent's children list
- `death(name)`: O(1) - add to hash set
- `getInheritanceOrder()`: O(n) where n is the number of living people - we perform DFS visiting each living person once

**Space Complexity:** O(m) where m is total people (living + dead)

- The tree stores all parent-child relationships: O(m)
- The death set stores all deceased people: O(m) in worst case
- DFS recursion stack: O(h) where h is tree height, but this is dominated by O(m)

## Common Mistakes

1. **Rebuilding the entire inheritance list on every operation**: Some candidates try to maintain a cached inheritance list and update it on every birth/death. This leads to O(n) updates instead of O(1) for births/deaths.

2. **Removing dead people from the tree**: If you remove a deceased person from the tree structure, you lose access to their children. Remember: dead people don't inherit, but their children still can.

3. **Forgetting to initialize children lists for new people**: When a child is born, you need to initialize their empty children list in the tree structure, otherwise DFS will fail when trying to access it.

4. **Using BFS instead of DFS**: Inheritance follows depth-first order (oldest child and their descendants before younger siblings). BFS would give wrong order.

## When You'll See This Pattern

This pattern of **tree representation with adjacency lists + DFS traversal with state checking** appears in several problems:

1. **Operations on Tree (LeetCode 1993)**: Similar tree operations with additional constraints like locking nodes. Both require efficient tree traversal and state tracking.

2. **Design In-Memory File System (LeetCode 588)**: Uses similar tree structure to represent directory hierarchy with DFS for listing contents.

3. **Serialize and Deserialize N-ary Tree (LeetCode 428)**: Requires understanding tree traversal orders similar to inheritance order here.

The core pattern is: when you need to maintain hierarchical relationships with frequent queries about traversal order, use adjacency lists + DFS.

## Key Takeaways

1. **Tree problems often use adjacency lists** when you need efficient child lookups and the tree structure changes dynamically.

2. **Separate structure from state**: Keep the tree structure intact even when nodes become "inactive" (like death here), and filter during traversal.

3. **DFS is natural for inheritance/lineage problems**: Many real-world hierarchical systems (family trees, file systems, organizational charts) use depth-first ordering.

**Related problems:** [Operations on Tree](/problem/operations-on-tree)
