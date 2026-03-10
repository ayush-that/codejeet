---
title: "How to Solve Delete Duplicate Folders in System — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Delete Duplicate Folders in System. Hard difficulty, 77.7% acceptance rate. Topics: Array, Hash Table, String, Trie, Hash Function."
date: "2028-02-13"
category: "dsa-patterns"
tags: ["delete-duplicate-folders-in-system", "array", "hash-table", "string", "hard"]
---

# How to Solve Delete Duplicate Folders in System

This problem asks us to identify and remove duplicate folder structures in a file system. Given a list of absolute paths, we need to return the remaining folder structure after deleting all folders that have identical subtree structures elsewhere in the system. What makes this problem challenging is that we're not just looking for duplicate folder names, but duplicate folder hierarchies - entire subtrees that are structurally identical. This is similar to finding duplicate subtrees in a tree structure, but applied to a file system.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
paths = [
    ["a"],
    ["a","b"],
    ["a","b","x"],
    ["a","b","y"],
    ["c"],
    ["c","b"],
    ["c","b","x"],
    ["c","b","y"],
    ["d"],
    ["d","b"],
    ["d","b","x"],
    ["d","b","y"],
    ["e"],
    ["e","f"]
]
```

**Step-by-step reasoning:**

1. **Build the tree structure:**
   - Root has children: `a`, `c`, `d`, `e`
   - `a` has child `b`
   - `b` has children `x` and `y`
   - `c` has child `b` (with same structure as above)
   - `d` has child `b` (with same structure as above)
   - `e` has child `f`

2. **Identify duplicate subtrees:**
   - The subtree rooted at `b` under `a`, `c`, and `d` are identical
   - Each has children `x` and `y`
   - Since these are duplicates, all `b` folders under `a`, `c`, and `d` should be deleted

3. **Result after deletion:**
   - We keep: `a`, `c`, `d`, `e`, `e/f`
   - We delete: all `b` folders and their children since they're duplicates

**Key insight:** We need a way to represent each subtree uniquely so we can compare them. A serialization/hashing approach works well here.

## Brute Force Approach

A naive approach would be to compare every folder's subtree with every other folder's subtree. For each folder, we would:

1. Collect all paths in its subtree
2. Compare this set of paths with every other folder's subtree
3. Mark for deletion if an identical subtree exists elsewhere

**Why this fails:**

- Time complexity would be O(n² × m) where n is number of folders and m is average subtree size
- With 10⁵ paths, this becomes completely infeasible
- We need a way to identify duplicates without pairwise comparisons

The brute force approach doesn't scale because we're repeatedly traversing the same subtrees and doing expensive comparisons.

## Optimized Approach

The key insight is to use **tree serialization with hashing**, similar to the "Find Duplicate Subtrees" problem. Here's the step-by-step reasoning:

1. **Build a trie/tree structure** from the paths
   - Each node represents a folder
   - Children are stored in sorted order for consistent serialization

2. **Post-order traversal to serialize each subtree**
   - We serialize from the bottom up (post-order)
   - Serialization format: `folder_name(child1_serialization)(child2_serialization)...`
   - This creates a unique string representation for each subtree

3. **Use a hash map to track duplicate serializations**
   - Map from serialization string to list of nodes with that serialization
   - If a serialization appears more than once, all those nodes are duplicates

4. **Mark duplicate nodes for deletion**
   - For each duplicate serialization, mark all corresponding nodes
   - Don't delete the root of a duplicate if its parent is also duplicate

5. **Reconstruct the result**
   - Traverse the tree, skipping marked nodes
   - Build paths for the remaining structure

**Why this works:**

- Serialization gives us a unique fingerprint for each subtree
- Post-order ensures children are serialized before parents
- Hash map gives us O(1) duplicate detection
- Time complexity becomes O(N) where N is total characters in all paths

## Optimal Solution

<div class="code-group">

```python
# Time: O(N) where N is total characters in all paths
# Space: O(N) for the trie and serialization storage
class Node:
    def __init__(self, name):
        self.name = name
        self.children = {}
        self.deleted = False

class Solution:
    def deleteDuplicateFolder(self, paths):
        # Step 1: Build the folder tree
        root = Node("")

        # Insert each path into the trie
        for path in paths:
            node = root
            for folder in path:
                if folder not in node.children:
                    node.children[folder] = Node(folder)
                node = node.children[folder]

        # Step 2: Serialize all subtrees and find duplicates
        serialization_map = {}

        def serialize(node):
            """Post-order traversal to serialize subtree rooted at node"""
            if not node.children:
                return node.name  # Leaf node

            # Serialize children first (post-order)
            child_serializations = []
            for child_name in sorted(node.children.keys()):
                child = node.children[child_name]
                child_serializations.append(serialize(child))

            # Create serialization: name(child1)(child2)...
            serialization = node.name + "(" + ")(".join(child_serializations) + ")"

            # Track this serialization for duplicate detection
            if serialization not in serialization_map:
                serialization_map[serialization] = []
            serialization_map[serialization].append(node)

            return serialization

        serialize(root)

        # Step 3: Mark duplicate nodes for deletion
        for nodes in serialization_map.values():
            if len(nodes) > 1:  # Duplicate found
                for node in nodes:
                    node.deleted = True

        # Step 4: Collect remaining paths
        result = []

        def collect_paths(node, current_path):
            """DFS to collect paths of non-deleted nodes"""
            if node.deleted:
                return  # Skip this entire subtree

            if node != root:  # Don't include root in paths
                current_path.append(node.name)
                result.append(current_path.copy())

            # Recursively process children
            for child_name in sorted(node.children.keys()):
                child = node.children[child_name]
                collect_paths(child, current_path)

            if node != root:
                current_path.pop()  # Backtrack

        collect_paths(root, [])
        return result
```

```javascript
// Time: O(N) where N is total characters in all paths
// Space: O(N) for the trie and serialization storage
class Node {
  constructor(name) {
    this.name = name;
    this.children = new Map();
    this.deleted = false;
  }
}

var deleteDuplicateFolder = function (paths) {
  // Step 1: Build the folder tree
  const root = new Node("");

  // Insert each path into the trie
  for (const path of paths) {
    let node = root;
    for (const folder of path) {
      if (!node.children.has(folder)) {
        node.children.set(folder, new Node(folder));
      }
      node = node.children.get(folder);
    }
  }

  // Step 2: Serialize all subtrees and find duplicates
  const serializationMap = new Map();

  function serialize(node) {
    // Post-order traversal to serialize subtree rooted at node
    if (node.children.size === 0) {
      return node.name; // Leaf node
    }

    // Serialize children first (post-order)
    const childSerializations = [];
    const sortedChildren = Array.from(node.children.keys()).sort();

    for (const childName of sortedChildren) {
      const child = node.children.get(childName);
      childSerializations.push(serialize(child));
    }

    // Create serialization: name(child1)(child2)...
    const serialization = node.name + "(" + childSerializations.join(")(") + ")";

    // Track this serialization for duplicate detection
    if (!serializationMap.has(serialization)) {
      serializationMap.set(serialization, []);
    }
    serializationMap.get(serialization).push(node);

    return serialization;
  }

  serialize(root);

  // Step 3: Mark duplicate nodes for deletion
  for (const nodes of serializationMap.values()) {
    if (nodes.length > 1) {
      // Duplicate found
      for (const node of nodes) {
        node.deleted = true;
      }
    }
  }

  // Step 4: Collect remaining paths
  const result = [];

  function collectPaths(node, currentPath) {
    // DFS to collect paths of non-deleted nodes
    if (node.deleted) {
      return; // Skip this entire subtree
    }

    if (node !== root) {
      // Don't include root in paths
      currentPath.push(node.name);
      result.push([...currentPath]); // Copy current path
    }

    // Recursively process children
    const sortedChildren = Array.from(node.children.keys()).sort();
    for (const childName of sortedChildren) {
      const child = node.children.get(childName);
      collectPaths(child, currentPath);
    }

    if (node !== root) {
      currentPath.pop(); // Backtrack
    }
  }

  collectPaths(root, []);
  return result;
};
```

```java
// Time: O(N) where N is total characters in all paths
// Space: O(N) for the trie and serialization storage
class Node {
    String name;
    TreeMap<String, Node> children;
    boolean deleted;

    Node(String name) {
        this.name = name;
        this.children = new TreeMap<>();
        this.deleted = false;
    }
}

class Solution {
    public List<List<String>> deleteDuplicateFolder(List<List<String>> paths) {
        // Step 1: Build the folder tree
        Node root = new Node("");

        // Insert each path into the trie
        for (List<String> path : paths) {
            Node node = root;
            for (String folder : path) {
                node.children.putIfAbsent(folder, new Node(folder));
                node = node.children.get(folder);
            }
        }

        // Step 2: Serialize all subtrees and find duplicates
        Map<String, List<Node>> serializationMap = new HashMap<>();

        String serialize(Node node) {
            // Post-order traversal to serialize subtree rooted at node
            if (node.children.isEmpty()) {
                return node.name;  // Leaf node
            }

            // Serialize children first (post-order)
            StringBuilder sb = new StringBuilder();
            sb.append(node.name).append("(");

            boolean first = true;
            for (Node child : node.children.values()) {
                if (!first) {
                    sb.append(")(");
                }
                sb.append(serialize(child));
                first = false;
            }

            sb.append(")");
            String serialization = sb.toString();

            // Track this serialization for duplicate detection
            serializationMap.computeIfAbsent(serialization, k -> new ArrayList<>())
                           .add(node);

            return serialization;
        }

        serialize(root);

        // Step 3: Mark duplicate nodes for deletion
        for (List<Node> nodes : serializationMap.values()) {
            if (nodes.size() > 1) {  // Duplicate found
                for (Node node : nodes) {
                    node.deleted = true;
                }
            }
        }

        // Step 4: Collect remaining paths
        List<List<String>> result = new ArrayList<>();
        List<String> currentPath = new ArrayList<>();

        void collectPaths(Node node) {
            // DFS to collect paths of non-deleted nodes
            if (node.deleted) {
                return;  // Skip this entire subtree
            }

            if (node != root) {  // Don't include root in paths
                currentPath.add(node.name);
                result.add(new ArrayList<>(currentPath));
            }

            // Recursively process children
            for (Node child : node.children.values()) {
                collectPaths(child);
            }

            if (node != root) {
                currentPath.remove(currentPath.size() - 1);  // Backtrack
            }
        }

        collectPaths(root);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N)**

- Building the trie: O(N) where N is total characters across all paths
- Serialization traversal: O(N) - each node visited once
- Duplicate marking: O(D) where D is number of duplicate groups
- Result collection: O(R) where R is characters in result paths
- Overall: O(N) since all operations are linear in input size

**Space Complexity: O(N)**

- Trie storage: O(N) for all nodes
- Serialization storage: O(N) for serialization strings
- Recursion stack: O(H) where H is maximum depth
- Result storage: O(R) for output
- Overall: O(N) dominated by trie and serialization storage

## Common Mistakes

1. **Not sorting children before serialization**
   - If children aren't processed in consistent order, identical subtrees might get different serializations
   - Always sort child names to ensure consistent serialization

2. **Forgetting to handle empty folders (leaves) differently**
   - Leaf nodes should serialize to just their name, not `name()`
   - This ensures different leaf folders aren't considered duplicates

3. **Incorrect duplicate marking logic**
   - Marking a node as deleted should exclude its entire subtree
   - But be careful not to double-delete if parent is already deleted
   - The post-order approach naturally handles this

4. **Not using a proper trie structure**
   - Using lists or arrays for children makes lookup inefficient
   - A hash map or tree map provides O(1) or O(log n) child access

## When You'll See This Pattern

This problem uses **tree serialization with hashing**, a pattern that appears in several tree comparison problems:

1. **Find Duplicate Subtrees (LeetCode 652)**
   - Almost identical pattern: serialize binary trees, track serializations in hash map
   - Same core insight: serialization provides unique fingerprint for subtree comparison

2. **Find Duplicate File in System (LeetCode 609)**
   - Similar concept of grouping by content hash
   - Instead of tree structure, files are grouped by content

3. **Serialize and Deserialize N-ary Tree (LeetCode 428)**
   - Uses similar serialization techniques
   - Understanding tree serialization helps with this pattern

The key insight across these problems is that complex structures can be compared efficiently by converting them to a canonical string or hash representation.

## Key Takeaways

1. **Tree serialization is powerful for subtree comparison**
   - Converting trees to strings enables O(1) comparison via hashing
   - Post-order traversal ensures children are serialized before parents

2. **Consistent ordering matters**
   - Always process children in sorted order for consistent serialization
   - This ensures identical structures get identical serializations

3. **Hash maps enable efficient duplicate detection**
   - Instead of O(n²) pairwise comparisons, use hash map for O(1) lookups
   - This pattern transforms quadratic problems into linear ones

Related problems: [Find Duplicate File in System](/problem/find-duplicate-file-in-system), [Find Duplicate Subtrees](/problem/find-duplicate-subtrees)
