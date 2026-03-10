---
title: "How to Solve LRU Cache — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode LRU Cache. Medium difficulty, 46.8% acceptance rate. Topics: Hash Table, Linked List, Design, Doubly-Linked List."
date: "2026-04-24"
category: "dsa-patterns"
tags: ["lru-cache", "hash-table", "linked-list", "design", "medium"]
---

# How to Solve LRU Cache

Designing an LRU (Least Recently Used) cache is a classic system design and coding interview problem that tests your ability to combine multiple data structures effectively. The challenge is creating a cache that supports O(1) operations for both `get` and `put` while maintaining the LRU eviction policy. What makes this tricky is that no single standard data structure provides all the needed operations efficiently—you need to combine a hash map for fast lookups with a linked list for tracking usage order.

## Visual Walkthrough

Let's trace through an example with capacity = 2:

```
cache = LRUCache(2)
cache.put(1, 10)  # Cache: {1=10}, Most recent: 1
cache.put(2, 20)  # Cache: {1=10, 2=20}, Most recent: 2
cache.get(1)      # Returns 10, Cache: {2=20, 1=10}, Most recent: 1
cache.put(3, 30)  # Evicts key 2 (least recently used), Cache: {1=10, 3=30}, Most recent: 3
cache.get(2)      # Returns -1 (not found)
cache.put(4, 40)  # Evicts key 1 (least recently used), Cache: {3=30, 4=40}, Most recent: 4
```

The key insight: every time we access a key (via `get` or `put`), it becomes "most recently used." When we need to evict, we remove the "least recently used" item. We need to track this ordering efficiently.

## Brute Force Approach

A naive approach might use:

- A dictionary for O(1) lookups
- A list or array to track usage order

For `get(key)`:

1. Check if key exists in dictionary
2. If found, remove it from the list and append to end (O(n) for list removal)
3. Return value

For `put(key, value)`:

1. If key exists, update value and move to end of list (O(n))
2. If key doesn't exist:
   - If at capacity, remove first item from list and from dictionary (O(n))
   - Add new key to dictionary and append to list

The problem: list operations are O(n) because removing an element from the middle requires shifting elements. With n operations, this becomes O(n²), which is too slow for large caches.

## Optimized Approach

The key insight is that we need O(1) operations for:

1. **Lookup** → Hash map (dictionary)
2. **Removing from middle** → Doubly linked list (remove node by updating neighbors)
3. **Adding to end** → Doubly linked list with tail pointer
4. **Moving to front** → Remove from current position, add to head

We combine:

- A hash map that maps keys to nodes in the doubly linked list
- A doubly linked list where:
  - Head = most recently used
  - Tail = least recently used
  - Each node stores key-value pair

Operations:

- `get(key)`: Look up node in hash map, move it to head (remove + add to head)
- `put(key, value)`:
  - If key exists: update value, move to head
  - If key doesn't exist:
    - Create new node, add to head
    - If at capacity: remove tail node, remove from hash map

This gives us O(1) for all operations.

## Optimal Solution

<div class="code-group">

```python
class Node:
    """Doubly linked list node to store key-value pairs"""
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    """
    LRU Cache implementation using hash map + doubly linked list
    Time: O(1) for both get and put
    Space: O(capacity) for storing nodes and hash map
    """

    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # Maps key -> Node

        # Dummy head and tail nodes to simplify edge cases
        self.head = Node()  # Most recently used
        self.tail = Node()  # Least recently used

        # Connect head and tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove_node(self, node: Node) -> None:
        """Remove a node from its current position in the list"""
        prev_node = node.prev
        next_node = node.next

        # Bypass the node to be removed
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add_to_head(self, node: Node) -> None:
        """Add node right after head (most recently used position)"""
        # Connect node to head's current next
        node.next = self.head.next
        node.prev = self.head

        # Update head's next and the next node's prev
        self.head.next.prev = node
        self.head.next = node

    def _move_to_head(self, node: Node) -> None:
        """Move an existing node to the head (most recently used)"""
        self._remove_node(node)
        self._add_to_head(node)

    def _pop_tail(self) -> Node:
        """Remove and return the tail node (least recently used)"""
        lru_node = self.tail.prev
        self._remove_node(lru_node)
        return lru_node

    def get(self, key: int) -> int:
        """
        Get the value for key if it exists, otherwise return -1
        If key exists, move it to most recently used position
        """
        if key not in self.cache:
            return -1

        node = self.cache[key]
        self._move_to_head(node)  # Mark as recently used
        return node.value

    def put(self, key: int, value: int) -> None:
        """
        Put key-value pair into cache
        If key exists, update value and move to head
        If at capacity, evict least recently used item
        """
        if key in self.cache:
            # Update existing key
            node = self.cache[key]
            node.value = value
            self._move_to_head(node)
        else:
            # Create new node
            new_node = Node(key, value)

            # Add to cache and list
            self.cache[key] = new_node
            self._add_to_head(new_node)

            # Check capacity
            if len(self.cache) > self.capacity:
                # Evict least recently used
                lru_node = self._pop_tail()
                del self.cache[lru_node.key]
```

```javascript
class Node {
  /**
   * Doubly linked list node to store key-value pairs
   * @param {number} key
   * @param {number} value
   */
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  /**
   * LRU Cache implementation using hash map + doubly linked list
   * Time: O(1) for both get and put
   * Space: O(capacity) for storing nodes and hash map
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Maps key -> Node

    // Dummy head and tail nodes to simplify edge cases
    this.head = new Node(); // Most recently used
    this.tail = new Node(); // Least recently used

    // Connect head and tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Remove a node from its current position in the list
   * @param {Node} node
   */
  _removeNode(node) {
    const prevNode = node.prev;
    const nextNode = node.next;

    // Bypass the node to be removed
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  /**
   * Add node right after head (most recently used position)
   * @param {Node} node
   */
  _addToHead(node) {
    // Connect node to head's current next
    node.next = this.head.next;
    node.prev = this.head;

    // Update head's next and the next node's prev
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * Move an existing node to the head (most recently used)
   * @param {Node} node
   */
  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }

  /**
   * Remove and return the tail node (least recently used)
   * @returns {Node}
   */
  _popTail() {
    const lruNode = this.tail.prev;
    this._removeNode(lruNode);
    return lruNode;
  }

  /**
   * Get the value for key if it exists, otherwise return -1
   * If key exists, move it to most recently used position
   * @param {number} key
   * @returns {number}
   */
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    const node = this.cache.get(key);
    this._moveToHead(node); // Mark as recently used
    return node.value;
  }

  /**
   * Put key-value pair into cache
   * If key exists, update value and move to head
   * If at capacity, evict least recently used item
   * @param {number} key
   * @param {number} value
   */
  put(key, value) {
    if (this.cache.has(key)) {
      // Update existing key
      const node = this.cache.get(key);
      node.value = value;
      this._moveToHead(node);
    } else {
      // Create new node
      const newNode = new Node(key, value);

      // Add to cache and list
      this.cache.set(key, newNode);
      this._addToHead(newNode);

      // Check capacity
      if (this.cache.size > this.capacity) {
        // Evict least recently used
        const lruNode = this._popTail();
        this.cache.delete(lruNode.key);
      }
    }
  }
}
```

```java
import java.util.HashMap;
import java.util.Map;

class Node {
    int key;
    int value;
    Node prev;
    Node next;

    public Node() {}

    public Node(int key, int value) {
        this.key = key;
        this.value = value;
    }
}

class LRUCache {
    /**
     * LRU Cache implementation using hash map + doubly linked list
     * Time: O(1) for both get and put
     * Space: O(capacity) for storing nodes and hash map
     */

    private Map<Integer, Node> cache;
    private int capacity;
    private Node head, tail;  // Dummy head and tail

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();

        // Initialize dummy head and tail nodes
        this.head = new Node();
        this.tail = new Node();

        // Connect head and tail
        head.next = tail;
        tail.prev = head;
    }

    /**
     * Remove a node from its current position in the list
     */
    private void removeNode(Node node) {
        Node prevNode = node.prev;
        Node nextNode = node.next;

        // Bypass the node to be removed
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
    }

    /**
     * Add node right after head (most recently used position)
     */
    private void addToHead(Node node) {
        // Connect node to head's current next
        node.next = head.next;
        node.prev = head;

        // Update head's next and the next node's prev
        head.next.prev = node;
        head.next = node;
    }

    /**
     * Move an existing node to the head (most recently used)
     */
    private void moveToHead(Node node) {
        removeNode(node);
        addToHead(node);
    }

    /**
     * Remove and return the tail node (least recently used)
     */
    private Node popTail() {
        Node lruNode = tail.prev;
        removeNode(lruNode);
        return lruNode;
    }

    public int get(int key) {
        if (!cache.containsKey(key)) {
            return -1;
        }

        Node node = cache.get(key);
        moveToHead(node);  // Mark as recently used
        return node.value;
    }

    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            // Update existing key
            Node node = cache.get(key);
            node.value = value;
            moveToHead(node);
        } else {
            // Create new node
            Node newNode = new Node(key, value);

            // Add to cache and list
            cache.put(key, newNode);
            addToHead(newNode);

            // Check capacity
            if (cache.size() > capacity) {
                // Evict least recently used
                Node lruNode = popTail();
                cache.remove(lruNode.key);
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1) for both `get` and `put`**

- `get(key)`: HashMap lookup (O(1)) + node removal/addition (O(1) with doubly linked list)
- `put(key, value)`: HashMap lookup (O(1)) + node operations (O(1))
- All linked list operations (add, remove, move) are O(1) because we have direct references to nodes

**Space Complexity: O(capacity)**

- HashMap stores up to `capacity` entries
- Doubly linked list stores up to `capacity` nodes
- Each node stores key, value, and two pointers (prev, next)

## Common Mistakes

1. **Not using dummy head/tail nodes**: Without dummy nodes, you need special cases for adding the first node, removing the last node, etc. Dummy nodes simplify the code by ensuring every real node has both prev and next nodes.

2. **Forgetting to update the hash map when moving nodes**: When you move a node to the head, you're not changing the key-value mapping, but if you evict a node, you must remove it from the hash map too.

3. **Incorrect capacity check**: Check `if len(cache) > capacity` AFTER adding the new node, not before. If capacity is 2 and you have 2 items, adding a third requires eviction.

4. **Not handling both `get` and `put` for "recently used"**: Both operations should mark a key as recently used. Candidates often forget to move nodes to head in the `put` method when updating an existing key.

## When You'll See This Pattern

The "hash map + doubly linked list" pattern appears whenever you need:

1. O(1) lookups (hash map)
2. O(1) insertions/deletions from arbitrary positions (doubly linked list)
3. Maintenance of some ordering (most recent, least recent, frequency, etc.)

Related problems:

- **LFU Cache (Hard)**: Similar to LRU but evicts least frequently used items. Requires tracking frequency counts in addition to recency.
- **Design In-Memory File System (Hard)**: Uses similar hierarchical structures with efficient traversal.
- **Design Compressed String Iterator (Easy)**: Simpler design problem but tests similar object-oriented design skills.

## Key Takeaways

1. **Combine data structures for complementary strengths**: No single data structure solves all problems. Hash maps give O(1) lookups but don't maintain order. Linked lists maintain order but have O(n) lookups. Together they give O(1) for everything.

2. **Dummy nodes simplify edge cases**: In linked list problems, dummy head/tail nodes eliminate special cases for empty lists, first/last element removal, etc.

3. **System design patterns translate to coding problems**: LRU cache is a real-world system design concept. Recognizing that you need O(1) operations guides you to the right data structure choices.

Related problems: [LFU Cache](/problem/lfu-cache), [Design In-Memory File System](/problem/design-in-memory-file-system), [Design Compressed String Iterator](/problem/design-compressed-string-iterator)
