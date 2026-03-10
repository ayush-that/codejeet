---
title: "How to Solve All O`one Data Structure — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode All O`one Data Structure. Hard difficulty, 44.2% acceptance rate. Topics: Hash Table, Linked List, Design, Doubly-Linked List."
date: "2028-10-02"
category: "dsa-patterns"
tags: ["all-oone-data-structure", "hash-table", "linked-list", "design", "hard"]
---

# How to Solve All O`one Data Structure

Designing a data structure that maintains string counts while supporting efficient retrieval of minimum and maximum frequency strings is a classic hard design problem. What makes this tricky is that we need O(1) operations for increment, decrement, and retrieval of min/max frequencies, which requires carefully combining multiple data structures.

## Visual Walkthrough

Let's trace through operations to build intuition:

```
AllOne obj = new AllOne()
obj.inc("hello")     // hello:1
obj.inc("hello")     // hello:2
obj.inc("world")     // world:1, hello:2
obj.inc("world")     // world:2, hello:2
obj.inc("world")     // world:3, hello:2
```

After these operations:

- "world" has count 3 (max)
- "hello" has count 2
- "world" has count 1 (min)

Now let's see what happens when we decrement:

```
obj.dec("world")     // world:2, hello:2
obj.dec("world")     // world:1, hello:2
obj.dec("world")     // world:0 (removed), hello:2
```

The challenge is maintaining O(1) access to min and max counts as we add/remove strings and change frequencies.

## Brute Force Approach

A naive approach would use a simple hash map to store counts:

- `HashMap<String, Integer>` to store key → count mappings
- To get max/min: iterate through all entries to find max/min count

<div class="code-group">

```python
class AllOne:
    def __init__(self):
        self.counts = {}

    def inc(self, key: str) -> None:
        self.counts[key] = self.counts.get(key, 0) + 1

    def dec(self, key: str) -> None:
        if key in self.counts:
            self.counts[key] -= 1
            if self.counts[key] == 0:
                del self.counts[key]

    def getMaxKey(self) -> str:
        if not self.counts:
            return ""
        return max(self.counts.items(), key=lambda x: x[1])[0]

    def getMinKey(self) -> str:
        if not self.counts:
            return ""
        return min(self.counts.items(), key=lambda x: x[1])[0]
```

```javascript
class AllOne {
  constructor() {
    this.counts = new Map();
  }

  inc(key) {
    this.counts.set(key, (this.counts.get(key) || 0) + 1);
  }

  dec(key) {
    if (!this.counts.has(key)) return;
    const count = this.counts.get(key) - 1;
    if (count === 0) {
      this.counts.delete(key);
    } else {
      this.counts.set(key, count);
    }
  }

  getMaxKey() {
    if (this.counts.size === 0) return "";
    let maxKey = "";
    let maxCount = -1;
    for (const [key, count] of this.counts) {
      if (count > maxCount) {
        maxCount = count;
        maxKey = key;
      }
    }
    return maxKey;
  }

  getMinKey() {
    if (this.counts.size === 0) return "";
    let minKey = "";
    let minCount = Infinity;
    for (const [key, count] of this.counts) {
      if (count < minCount) {
        minCount = count;
        minKey = key;
      }
    }
    return minKey;
  }
}
```

```java
class AllOne {
    private Map<String, Integer> counts;

    public AllOne() {
        counts = new HashMap<>();
    }

    public void inc(String key) {
        counts.put(key, counts.getOrDefault(key, 0) + 1);
    }

    public void dec(String key) {
        if (!counts.containsKey(key)) return;
        int newCount = counts.get(key) - 1;
        if (newCount == 0) {
            counts.remove(key);
        } else {
            counts.put(key, newCount);
        }
    }

    public String getMaxKey() {
        if (counts.isEmpty()) return "";
        return Collections.max(counts.entrySet(),
            Map.Entry.comparingByValue()).getKey();
    }

    public String getMinKey() {
        if (counts.isEmpty()) return "";
        return Collections.min(counts.entrySet(),
            Map.Entry.comparingByValue()).getKey();
    }
}
```

</div>

**Why this fails:** `getMaxKey()` and `getMinKey()` are O(n) operations where n is the number of unique keys. The problem requires these to be O(1). We need a smarter data structure.

## Optimized Approach

The key insight is that we need:

1. **O(1) access** to a key's current count → Use a hash map
2. **O(1) access** to min and max frequencies → Use a doubly linked list where each node represents a frequency and contains all keys with that frequency
3. **O(1) movement** of keys between frequencies → Use hash map to store key → node references

**Data Structure Design:**

- `HashMap<String, Node>`: key → node reference (where the key currently lives)
- Doubly linked list of `Node` objects, each containing:
  - `count`: frequency value
  - `keys`: set of keys with this frequency
  - `prev`, `next`: pointers to adjacent nodes
- Maintain list in **sorted order** by frequency (ascending)

**Operations:**

- `inc(key)`: Move key from current node to node with `count+1` (create if doesn't exist)
- `dec(key)`: Move key from current node to node with `count-1` (create if doesn't exist, remove if count becomes 0)
- `getMaxKey()`: Return any key from tail node (highest frequency)
- `getMinKey()`: Return any key from head node (lowest frequency)

## Optimal Solution

Here's the complete implementation using hash map + doubly linked list:

<div class="code-group">

```python
# Time: O(1) for all operations | Space: O(n) where n is number of unique keys
class Node:
    def __init__(self, count):
        self.count = count           # Frequency value
        self.keys = set()           # Set of keys with this frequency
        self.prev = None
        self.next = None

class AllOne:
    def __init__(self):
        # Hash map: key -> node reference
        self.key_to_node = {}
        # Dummy head and tail for doubly linked list
        self.head = Node(0)         # Dummy head with count 0
        self.tail = Node(0)         # Dummy tail with count 0
        self.head.next = self.tail
        self.tail.prev = self.head

    def inc(self, key: str) -> None:
        if key in self.key_to_node:
            # Key exists, move it to next frequency node
            current_node = self.key_to_node[key]
            new_count = current_node.count + 1

            # Remove key from current node
            current_node.keys.remove(key)

            # Check if next node has the new count
            if current_node.next.count == new_count:
                # Next node has the right count, add key there
                next_node = current_node.next
                next_node.keys.add(key)
                self.key_to_node[key] = next_node
            else:
                # Create new node with new count
                new_node = Node(new_count)
                new_node.keys.add(key)
                self._insert_after(current_node, new_node)
                self.key_to_node[key] = new_node

            # Clean up current node if empty
            if not current_node.keys:
                self._remove_node(current_node)
        else:
            # Key doesn't exist, add to count=1 node
            if self.head.next.count == 1:
                # Node with count=1 exists
                first_node = self.head.next
                first_node.keys.add(key)
                self.key_to_node[key] = first_node
            else:
                # Create new node with count=1
                new_node = Node(1)
                new_node.keys.add(key)
                self._insert_after(self.head, new_node)
                self.key_to_node[key] = new_node

    def dec(self, key: str) -> None:
        if key not in self.key_to_node:
            return

        current_node = self.key_to_node[key]
        new_count = current_node.count - 1

        # Remove key from current node
        current_node.keys.remove(key)

        if new_count > 0:
            # Key still exists with reduced count
            if current_node.prev.count == new_count:
                # Previous node has the right count
                prev_node = current_node.prev
                prev_node.keys.add(key)
                self.key_to_node[key] = prev_node
            else:
                # Create new node with reduced count
                new_node = Node(new_count)
                new_node.keys.add(key)
                self._insert_after(current_node.prev, new_node)
                self.key_to_node[key] = new_node
        else:
            # Key count becomes 0, remove from hash map
            del self.key_to_node[key]

        # Clean up current node if empty
        if not current_node.keys:
            self._remove_node(current_node)

    def getMaxKey(self) -> str:
        # Tail is dummy, so check node before tail
        if self.tail.prev == self.head:
            return ""
        # Return any key from the max frequency node
        return next(iter(self.tail.prev.keys))

    def getMinKey(self) -> str:
        # Head is dummy, so check node after head
        if self.head.next == self.tail:
            return ""
        # Return any key from the min frequency node
        return next(iter(self.head.next.keys))

    # Helper: Insert new_node after target_node
    def _insert_after(self, target_node: Node, new_node: Node) -> None:
        new_node.prev = target_node
        new_node.next = target_node.next
        target_node.next.prev = new_node
        target_node.next = new_node

    # Helper: Remove node from linked list
    def _remove_node(self, node: Node) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev
```

```javascript
// Time: O(1) for all operations | Space: O(n) where n is number of unique keys
class Node {
  constructor(count) {
    this.count = count; // Frequency value
    this.keys = new Set(); // Set of keys with this frequency
    this.prev = null;
    this.next = null;
  }
}

class AllOne {
  constructor() {
    // Hash map: key -> node reference
    this.keyToNode = new Map();
    // Dummy head and tail for doubly linked list
    this.head = new Node(0); // Dummy head with count 0
    this.tail = new Node(0); // Dummy tail with count 0
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  inc(key) {
    if (this.keyToNode.has(key)) {
      // Key exists, move it to next frequency node
      const currentNode = this.keyToNode.get(key);
      const newCount = currentNode.count + 1;

      // Remove key from current node
      currentNode.keys.delete(key);

      // Check if next node has the new count
      if (currentNode.next.count === newCount) {
        // Next node has the right count, add key there
        const nextNode = currentNode.next;
        nextNode.keys.add(key);
        this.keyToNode.set(key, nextNode);
      } else {
        // Create new node with new count
        const newNode = new Node(newCount);
        newNode.keys.add(key);
        this._insertAfter(currentNode, newNode);
        this.keyToNode.set(key, newNode);
      }

      // Clean up current node if empty
      if (currentNode.keys.size === 0) {
        this._removeNode(currentNode);
      }
    } else {
      // Key doesn't exist, add to count=1 node
      if (this.head.next.count === 1) {
        // Node with count=1 exists
        const firstNode = this.head.next;
        firstNode.keys.add(key);
        this.keyToNode.set(key, firstNode);
      } else {
        // Create new node with count=1
        const newNode = new Node(1);
        newNode.keys.add(key);
        this._insertAfter(this.head, newNode);
        this.keyToNode.set(key, newNode);
      }
    }
  }

  dec(key) {
    if (!this.keyToNode.has(key)) return;

    const currentNode = this.keyToNode.get(key);
    const newCount = currentNode.count - 1;

    // Remove key from current node
    currentNode.keys.delete(key);

    if (newCount > 0) {
      // Key still exists with reduced count
      if (currentNode.prev.count === newCount) {
        // Previous node has the right count
        const prevNode = currentNode.prev;
        prevNode.keys.add(key);
        this.keyToNode.set(key, prevNode);
      } else {
        // Create new node with reduced count
        const newNode = new Node(newCount);
        newNode.keys.add(key);
        this._insertAfter(currentNode.prev, newNode);
        this.keyToNode.set(key, newNode);
      }
    } else {
      // Key count becomes 0, remove from hash map
      this.keyToNode.delete(key);
    }

    // Clean up current node if empty
    if (currentNode.keys.size === 0) {
      this._removeNode(currentNode);
    }
  }

  getMaxKey() {
    // Tail is dummy, so check node before tail
    if (this.tail.prev === this.head) return "";
    // Return any key from the max frequency node
    return this.tail.prev.keys.values().next().value;
  }

  getMinKey() {
    // Head is dummy, so check node after head
    if (this.head.next === this.tail) return "";
    // Return any key from the min frequency node
    return this.head.next.keys.values().next().value;
  }

  // Helper: Insert new_node after target_node
  _insertAfter(targetNode, newNode) {
    newNode.prev = targetNode;
    newNode.next = targetNode.next;
    targetNode.next.prev = newNode;
    targetNode.next = newNode;
  }

  // Helper: Remove node from linked list
  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
}
```

```java
// Time: O(1) for all operations | Space: O(n) where n is number of unique keys
class Node {
    int count;
    Set<String> keys;
    Node prev;
    Node next;

    public Node(int count) {
        this.count = count;
        this.keys = new HashSet<>();
        this.prev = null;
        this.next = null;
    }
}

class AllOne {
    private Map<String, Node> keyToNode;
    private Node head;
    private Node tail;

    public AllOne() {
        keyToNode = new HashMap<>();
        // Dummy head and tail nodes
        head = new Node(0);
        tail = new Node(0);
        head.next = tail;
        tail.prev = head;
    }

    public void inc(String key) {
        if (keyToNode.containsKey(key)) {
            // Key exists, move it to next frequency node
            Node currentNode = keyToNode.get(key);
            int newCount = currentNode.count + 1;

            // Remove key from current node
            currentNode.keys.remove(key);

            // Check if next node has the new count
            if (currentNode.next.count == newCount) {
                // Next node has the right count, add key there
                Node nextNode = currentNode.next;
                nextNode.keys.add(key);
                keyToNode.put(key, nextNode);
            } else {
                // Create new node with new count
                Node newNode = new Node(newCount);
                newNode.keys.add(key);
                insertAfter(currentNode, newNode);
                keyToNode.put(key, newNode);
            }

            // Clean up current node if empty
            if (currentNode.keys.isEmpty()) {
                removeNode(currentNode);
            }
        } else {
            // Key doesn't exist, add to count=1 node
            if (head.next.count == 1) {
                // Node with count=1 exists
                Node firstNode = head.next;
                firstNode.keys.add(key);
                keyToNode.put(key, firstNode);
            } else {
                // Create new node with count=1
                Node newNode = new Node(1);
                newNode.keys.add(key);
                insertAfter(head, newNode);
                keyToNode.put(key, newNode);
            }
        }
    }

    public void dec(String key) {
        if (!keyToNode.containsKey(key)) return;

        Node currentNode = keyToNode.get(key);
        int newCount = currentNode.count - 1;

        // Remove key from current node
        currentNode.keys.remove(key);

        if (newCount > 0) {
            // Key still exists with reduced count
            if (currentNode.prev.count == newCount) {
                // Previous node has the right count
                Node prevNode = currentNode.prev;
                prevNode.keys.add(key);
                keyToNode.put(key, prevNode);
            } else {
                // Create new node with reduced count
                Node newNode = new Node(newCount);
                newNode.keys.add(key);
                insertAfter(currentNode.prev, newNode);
                keyToNode.put(key, newNode);
            }
        } else {
            // Key count becomes 0, remove from hash map
            keyToNode.remove(key);
        }

        // Clean up current node if empty
        if (currentNode.keys.isEmpty()) {
            removeNode(currentNode);
        }
    }

    public String getMaxKey() {
        // Tail is dummy, so check node before tail
        if (tail.prev == head) return "";
        // Return any key from the max frequency node
        return tail.prev.keys.iterator().next();
    }

    public String getMinKey() {
        // Head is dummy, so check node after head
        if (head.next == tail) return "";
        // Return any key from the min frequency node
        return head.next.keys.iterator().next();
    }

    // Helper: Insert new_node after target_node
    private void insertAfter(Node targetNode, Node newNode) {
        newNode.prev = targetNode;
        newNode.next = targetNode.next;
        targetNode.next.prev = newNode;
        targetNode.next = newNode;
    }

    // Helper: Remove node from linked list
    private void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `inc(key)`: O(1) - Hash map lookup + linked list insertion/removal
- `dec(key)`: O(1) - Hash map lookup + linked list insertion/removal
- `getMaxKey()`: O(1) - Access tail's previous node
- `getMinKey()`: O(1) - Access head's next node

**Space Complexity:** O(n) where n is the number of unique keys. We store:

- Each key in the hash map: O(n)
- Each key in a node's set: O(n)
- Each frequency node in the linked list: O(m) where m ≤ n (distinct frequencies)

## Common Mistakes

1. **Not cleaning up empty nodes**: Forgetting to remove nodes when their key set becomes empty leads to memory leaks and incorrect min/max calculations. Always check if `node.keys` is empty after removing a key.

2. **Incorrect linked list ordering**: The list must be maintained in strictly increasing frequency order. When inserting a new node, ensure it's placed in the correct position relative to adjacent nodes' counts.

3. **Edge case handling for empty structure**: Forgetting to check if the structure is empty before calling `getMaxKey()` or `getMinKey()`. Always check if `head.next == tail` (or equivalent) before accessing nodes.

4. **Using single linked list instead of doubly linked list**: With singly linked list, you can't efficiently remove nodes or insert before a node, which are needed for O(1) `dec()` operations.

## When You'll See This Pattern

This hash map + doubly linked list pattern appears in problems requiring O(1) operations with ordering:

1. **LRU Cache (LeetCode 146)**: Similar structure but for access recency instead of frequency. Uses hash map + doubly linked list to maintain access order.

2. **LFU Cache (LeetCode 460)**: Almost identical to this problem! Maintains frequency counts for cache eviction.

3. **Design Twitter (LeetCode 355)**: While more complex, it uses similar composite data structures to maintain feeds with efficient operations.

The pattern is: **When you need O(1) operations on ordered elements, combine hash maps (for O(1) access) with linked lists (for O(1) insertion/removal)**.

## Key Takeaways

1. **Composite data structures solve complex requirements**: No single standard data structure provides all O(1) operations. Combining hash maps (random access) with linked lists (ordered maintenance) is a powerful pattern.

2. **Dummy nodes simplify edge cases**: Using dummy head and tail nodes eliminates special cases for empty lists or operations at boundaries.

3. **Frequency-based problems often use bucketization**: Grouping elements by frequency into "buckets" (nodes) allows efficient min/max retrieval and frequency updates.

[Practice this problem on CodeJeet](/problem/all-oone-data-structure)
