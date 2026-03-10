---
title: "How to Solve Copy List with Random Pointer — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Copy List with Random Pointer. Medium difficulty, 62.4% acceptance rate. Topics: Hash Table, Linked List."
date: "2026-06-07"
category: "dsa-patterns"
tags: ["copy-list-with-random-pointer", "hash-table", "linked-list", "medium"]
---

# How to Solve Copy List with Random Pointer

This problem asks us to create a deep copy of a linked list where each node has both a `next` pointer and a `random` pointer that can point to any node in the list or be `null`. The challenge is that when copying, we need to correctly map the random pointers from the original nodes to their corresponding copies, which requires tracking relationships between original and copied nodes.

## Visual Walkthrough

Let's trace through a simple example to build intuition. Suppose we have this linked list:

```
Original: 1 → 2 → 3 → null
Random pointers:
1.random → 3
2.random → 1
3.random → 2
```

**Step 1: Create copies interleaved with originals**
We insert a copy of each node right after its original:

```
1 → 1' → 2 → 2' → 3 → 3' → null
```

**Step 2: Set random pointers for copies**
For each original node `orig`, its copy `orig.next` should have:

- `orig.next.random = orig.random.next` (if `orig.random` exists)
  This works because `orig.random.next` is the copy of whatever `orig.random` points to.

**Step 3: Separate the lists**
We extract the copied nodes into their own list while restoring the original list:

```
Original: 1 → 2 → 3 → null
Copy: 1' → 2' → 3' → null
```

This visual approach shows why we need to track the relationship between original and copied nodes.

## Brute Force Approach

The most straightforward approach is to:

1. First create all new nodes in a first pass, storing them in an array or list
2. In a second pass, set the `next` pointers by following the original list order
3. In a third pass, set the `random` pointers by searching for each original node's random pointer in the original list, finding its index, then pointing the copy's random to the copy at that same index

The problem with this approach is step 3: for each node, we need to find where its random pointer points in the original list. This requires O(n) search per node, making the overall time complexity O(n²). While this works for small lists, it's inefficient for the typical interview constraints.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for the copy list
def copyRandomListBrute(head):
    if not head:
        return None

    # Step 1: Create all new nodes and store in list
    nodes = []
    curr = head
    while curr:
        nodes.append(Node(curr.val))
        curr = curr.next

    # Step 2: Set next pointers
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]

    # Step 3: Set random pointers (the expensive part)
    curr = head
    for i in range(len(nodes)):
        if curr.random:
            # Find index of random node in original list
            target = curr.random
            search = head
            index = 0
            while search != target:
                search = search.next
                index += 1
            # Point copy's random to copy at that index
            nodes[i].random = nodes[index]
        curr = curr.next

    return nodes[0]
```

```javascript
// Time: O(n²) | Space: O(n)
function copyRandomListBrute(head) {
  if (!head) return null;

  // Step 1: Create all new nodes
  const nodes = [];
  let curr = head;
  while (curr) {
    nodes.push(new Node(curr.val));
    curr = curr.next;
  }

  // Step 2: Set next pointers
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }

  // Step 3: Set random pointers (O(n²) part)
  curr = head;
  for (let i = 0; i < nodes.length; i++) {
    if (curr.random) {
      // Find index of random node
      let target = curr.random;
      let search = head;
      let index = 0;
      while (search !== target) {
        search = search.next;
        index++;
      }
      nodes[i].random = nodes[index];
    }
    curr = curr.next;
  }

  return nodes[0];
}
```

```java
// Time: O(n²) | Space: O(n)
public Node copyRandomListBrute(Node head) {
    if (head == null) return null;

    // Step 1: Create all new nodes
    List<Node> nodes = new ArrayList<>();
    Node curr = head;
    while (curr != null) {
        nodes.add(new Node(curr.val));
        curr = curr.next;
    }

    // Step 2: Set next pointers
    for (int i = 0; i < nodes.size() - 1; i++) {
        nodes.get(i).next = nodes.get(i + 1);
    }

    // Step 3: Set random pointers (expensive O(n²) search)
    curr = head;
    for (int i = 0; i < nodes.size(); i++) {
        if (curr.random != null) {
            // Find index of random node
            Node target = curr.random;
            Node search = head;
            int index = 0;
            while (search != target) {
                search = search.next;
                index++;
            }
            nodes.get(i).random = nodes.get(index);
        }
        curr = curr.next;
    }

    return nodes.get(0);
}
```

</div>

## Optimized Approach

The key insight is that we need an efficient way to map original nodes to their copies. This is a classic "mapping" problem, and we have two main approaches:

**Approach 1: Hash Map (Most Intuitive)**
We can use a hash map to store the mapping from original nodes to their copies. This allows O(1) lookup when setting random pointers.

**Approach 2: Interleaving Nodes (Constant Space)**
We can modify the original list by inserting copies between originals, use the structure itself to map originals to copies, then separate the lists. This achieves O(1) extra space (excluding the space needed for the copy itself).

The hash map approach is usually preferred in interviews because it's clearer and less error-prone. The interleaving approach is impressive but has more edge cases to handle.

## Optimal Solution

Here's the hash map approach, which is the most commonly expected solution:

<div class="code-group">

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""

# Time: O(n) | Space: O(n) for the hash map
class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None

        # Step 1: Create a hash map to map original nodes to their copies
        # We initialize it with None → None mapping for edge cases
        node_map = {None: None}

        # First pass: Create all new nodes and store in hash map
        # We don't set pointers yet, just create the nodes
        current = head
        while current:
            # Create a new node with the same value
            node_map[current] = Node(current.val)
            current = current.next

        # Second pass: Set next and random pointers using the hash map
        current = head
        while current:
            # Get the copy of the current node
            copy = node_map[current]

            # Set the copy's next pointer to the copy of current's next
            # If current.next is None, node_map[None] = None
            copy.next = node_map[current.next]

            # Set the copy's random pointer to the copy of current's random
            # If current.random is None, node_map[None] = None
            copy.random = node_map[current.random]

            current = current.next

        # Return the copy of the head node
        return node_map[head]
```

```javascript
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

// Time: O(n) | Space: O(n)
var copyRandomList = function (head) {
  if (!head) return null;

  // Step 1: Create a map to store original → copy mappings
  // Initialize with null → null for edge cases
  const nodeMap = new Map();
  nodeMap.set(null, null);

  // First pass: Create all new nodes and store in map
  let current = head;
  while (current) {
    // Create a new node with the same value
    nodeMap.set(current, new Node(current.val));
    current = current.next;
  }

  // Second pass: Set next and random pointers using the map
  current = head;
  while (current) {
    // Get the copy of the current node
    const copy = nodeMap.get(current);

    // Set the copy's next pointer to the copy of current's next
    copy.next = nodeMap.get(current.next);

    // Set the copy's random pointer to the copy of current's random
    copy.random = nodeMap.get(current.random);

    current = current.next;
  }

  // Return the copy of the head node
  return nodeMap.get(head);
};
```

```java
/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/

// Time: O(n) | Space: O(n)
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;

        // Step 1: Create a hash map to store original → copy mappings
        // We'll handle null mappings separately
        Map<Node, Node> nodeMap = new HashMap<>();

        // First pass: Create all new nodes and store in map
        Node current = head;
        while (current != null) {
            // Create a new node with the same value
            nodeMap.put(current, new Node(current.val));
            current = current.next;
        }

        // Second pass: Set next and random pointers using the map
        current = head;
        while (current != null) {
            // Get the copy of the current node
            Node copy = nodeMap.get(current);

            // Set the copy's next pointer to the copy of current's next
            // get() returns null if key doesn't exist, which handles null next
            copy.next = nodeMap.get(current.next);

            // Set the copy's random pointer to the copy of current's random
            copy.random = nodeMap.get(current.random);

            current = current.next;
        }

        // Return the copy of the head node
        return nodeMap.get(head);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the list: one to create all nodes and store them in the hash map, and another to set the pointers.
- Each pass visits each node exactly once, so we have O(n) + O(n) = O(n) operations.
- Hash map operations (insert and lookup) are O(1) on average.

**Space Complexity: O(n)**

- The hash map stores n entries (one for each original node mapping to its copy).
- The copy itself requires O(n) space, but this is output space and typically not counted. The extra space we care about is the O(n) for the hash map.
- If we used the interleaving approach, we could achieve O(1) extra space (excluding the output), but the hash map approach is more readable and commonly accepted.

## Common Mistakes

1. **Not handling null random pointers**: When a node's random pointer is `null`, you need to map it to `null` in the copy. Many candidates forget this edge case. In our solution, we handle it by either initializing the map with `null → null` or relying on the hash map's `get()` method returning `null` for missing keys.

2. **Creating a circular reference**: When using the interleaving approach, it's easy to create infinite loops if you don't carefully separate the lists. Always test with lists where random pointers create cycles.

3. **Modifying the original list**: The problem asks for a deep copy, which means the original list should remain unchanged. Some approaches (like interleaving) temporarily modify the original list, which might be acceptable but should be mentioned to the interviewer.

4. **Using the wrong data structure for mapping**: Some candidates try to use an array and index-based mapping, but this only works if nodes have unique values or some other identifier. The hash map approach is more robust because it uses object references as keys.

## When You'll See This Pattern

This "node mapping" pattern appears whenever you need to create a copy of a graph-like structure where nodes have references to other nodes. The hash map technique is versatile and applies to:

1. **Clone Graph (LeetCode 133)**: Similar problem but with a graph instead of a linked list. You use the same hash map approach to map original nodes to copies.

2. **Copy List with Random Pointer (this problem)**: The classic example.

3. **Clone Binary Tree with Random Pointer (LeetCode 1485)**: A tree version of the same problem, where each node has a random pointer that can point to any node in the tree.

4. **Clone N-ary Tree (LeetCode 1490)**: Similar pattern for copying trees with multiple children per node.

The core insight is always the same: when copying a structure with references between nodes, use a hash map to track the mapping from originals to copies so you can correctly reconstruct those references in the copy.

## Key Takeaways

1. **Hash maps are perfect for tracking relationships between original and copied nodes** when you need O(1) lookups to set up pointers in the copy.

2. **Two-pass approach is common**: First pass creates all nodes and stores them in the map, second pass sets up all the connections using the map.

3. **Always handle null pointers explicitly**, especially for random pointers that might be null. Initialize your map with `null → null` or ensure your map access handles missing keys gracefully.

4. **This pattern extends beyond linked lists** to any graph-like structure (trees, graphs) where nodes reference other nodes.

Related problems: [Clone Graph](/problem/clone-graph), [Clone Binary Tree With Random Pointer](/problem/clone-binary-tree-with-random-pointer), [Clone N-ary Tree](/problem/clone-n-ary-tree)
