---
title: "How to Solve LFU Cache — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode LFU Cache. Hard difficulty, 48.6% acceptance rate. Topics: Hash Table, Linked List, Design, Doubly-Linked List."
date: "2027-09-09"
category: "dsa-patterns"
tags: ["lfu-cache", "hash-table", "linked-list", "design", "hard"]
---

# How to Solve LFU Cache

Designing an LFU (Least Frequently Used) cache is a classic hard problem that tests your ability to combine multiple data structures to achieve efficient operations. Unlike LRU Cache which only tracks recency, LFU tracks frequency of use, making it more complex to implement efficiently. The challenge lies in maintaining O(1) time complexity for both `get` and `put` operations while correctly tracking frequency counts and evicting the least frequently used item when the cache is full.

## Visual Walkthrough

Let's trace through an example with capacity = 2:

```
cache = LFUCache(2)
cache.put(1, 10)  # Cache: {1:10} (freq=1)
cache.put(2, 20)  # Cache: {1:10, 2:20} (both freq=1)
cache.get(1)      # Returns 10, key 1 freq=2, key 2 freq=1
cache.put(3, 30)  # Cache full! Evict key 2 (freq=1 vs key 1 freq=2)
                  # Cache: {1:10, 3:30} (key 1 freq=2, key 3 freq=1)
cache.get(2)      # Returns -1 (key 2 was evicted)
cache.get(3)      # Returns 30, key 3 freq=2
cache.put(4, 40)  # Cache full! Both keys have freq=2
                  # Need tie-breaker: evict LRU among freq=2 keys
                  # Key 1 was accessed earlier than key 3
                  # Cache: {3:30, 4:40} (key 3 freq=2, key 4 freq=1)
```

The tricky part: when multiple keys have the same frequency, we need to evict the least recently used among them. This requires maintaining both frequency tracking and recency ordering within each frequency level.

## Brute Force Approach

A naive approach would store key-value pairs and track access counts:

1. Store key-value pairs in a dictionary
2. Track frequency counts in another dictionary
3. On `get()`: increment frequency count for the key
4. On `put()` when cache is full: scan all keys to find the one with minimum frequency, and if there's a tie, find the least recently used among them

The brute force `put()` operation would be O(n) because we need to scan all keys to find the minimum frequency key. For a cache with capacity n, this makes operations too slow for large caches.

```python
# Brute force approach - O(n) put operations
class LFUCacheNaive:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}  # key -> value
        self.freq = {}   # key -> frequency count
        self.time = {}   # key -> timestamp
        self.timer = 0   # global timer

    def get(self, key):
        if key not in self.cache:
            return -1
        self.freq[key] += 1
        self.time[key] = self.timer
        self.timer += 1
        return self.cache[key]

    def put(self, key, value):
        if self.capacity <= 0:
            return

        if key in self.cache:
            self.cache[key] = value
            self.freq[key] += 1
            self.time[key] = self.timer
            self.timer += 1
            return

        if len(self.cache) >= self.capacity:
            # O(n) scan to find key to evict
            min_freq = min(self.freq.values())
            candidates = [k for k in self.freq if self.freq[k] == min_freq]
            # Find LRU among candidates
            lru_key = min(candidates, key=lambda k: self.time[k])
            del self.cache[lru_key]
            del self.freq[lru_key]
            del self.time[lru_key]

        self.cache[key] = value
        self.freq[key] = 1
        self.time[key] = self.timer
        self.timer += 1
```

The problem: finding the minimum frequency key requires O(n) scanning, which is unacceptable for a cache that needs O(1) operations.

## Optimized Approach

The key insight is that we need three interconnected data structures:

1. **Key-Value Store**: A hash map from keys to values (and metadata)
2. **Frequency Buckets**: A hash map from frequencies to doubly linked lists of keys with that frequency
3. **Key-to-Node Mapping**: A hash map from keys to their node in the frequency list

The doubly linked list at each frequency level maintains LRU order for tie-breaking. When we need to evict, we:

1. Find the minimum frequency (tracked separately)
2. Remove the LRU node from that frequency's list
3. If the list becomes empty, remove the frequency bucket

When a key is accessed:

1. Remove it from its current frequency list
2. Increment its frequency
3. Add it to the front of the new frequency's list (most recent)

This gives us O(1) operations for all cache operations.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) for both get and put | Space: O(capacity)
class Node:
    """Doubly linked list node to store keys at the same frequency"""
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.freq = 1  # Frequency count for this key
        self.prev = None
        self.next = None

class DoublyLinkedList:
    """Doubly linked list to maintain LRU order for keys with same frequency"""
    def __init__(self):
        self.head = Node(0, 0)  # Dummy head
        self.tail = Node(0, 0)  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
        self.size = 0

    def add_to_front(self, node):
        """Add node right after dummy head (most recent position)"""
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        self.size += 1

    def remove_node(self, node):
        """Remove a specific node from the list"""
        node.prev.next = node.next
        node.next.prev = node.prev
        self.size -= 1

    def remove_last(self):
        """Remove and return the node before dummy tail (least recent)"""
        if self.size == 0:
            return None
        last_node = self.tail.prev
        self.remove_node(last_node)
        return last_node

class LFUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.min_freq = 0  # Track minimum frequency for quick eviction
        self.key_map = {}  # key -> Node
        self.freq_map = {}  # frequency -> DoublyLinkedList

    def _update_node(self, node):
        """Helper to update a node's frequency and position"""
        freq = node.freq
        # Remove node from its current frequency list
        self.freq_map[freq].remove_node(node)

        # If this frequency list becomes empty and it was the min frequency
        if self.freq_map[freq].size == 0:
            del self.freq_map[freq]
            if freq == self.min_freq:
                self.min_freq += 1

        # Increment node's frequency
        node.freq += 1
        freq = node.freq

        # Add node to new frequency list (create if doesn't exist)
        if freq not in self.freq_map:
            self.freq_map[freq] = DoublyLinkedList()
        self.freq_map[freq].add_to_front(node)

    def get(self, key: int) -> int:
        if key not in self.key_map:
            return -1

        node = self.key_map[key]
        self._update_node(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if self.capacity == 0:
            return

        if key in self.key_map:
            # Key exists, update value and frequency
            node = self.key_map[key]
            node.val = value
            self._update_node(node)
        else:
            # New key
            if len(self.key_map) >= self.capacity:
                # Cache full, need to evict
                min_list = self.freq_map[self.min_freq]
                evict_node = min_list.remove_last()
                del self.key_map[evict_node.key]

            # Create new node with frequency 1
            new_node = Node(key, value)
            self.key_map[key] = new_node

            # Add to frequency 1 list (create if doesn't exist)
            if 1 not in self.freq_map:
                self.freq_map[1] = DoublyLinkedList()
            self.freq_map[1].add_to_front(new_node)

            # Reset min frequency to 1 for new node
            self.min_freq = 1
```

```javascript
// Time: O(1) for both get and put | Space: O(capacity)
class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.freq = 1;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = new Node(0, 0); // Dummy head
    this.tail = new Node(0, 0); // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }

  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
    this.size++;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.size--;
  }

  removeLast() {
    if (this.size === 0) return null;
    const lastNode = this.tail.prev;
    this.removeNode(lastNode);
    return lastNode;
  }
}

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.minFreq = 0;
    this.keyMap = new Map(); // key -> Node
    this.freqMap = new Map(); // frequency -> DoublyLinkedList
  }

  _updateNode(node) {
    const freq = node.freq;
    // Remove from current frequency list
    this.freqMap.get(freq).removeNode(node);

    // If list becomes empty and it was min frequency
    if (this.freqMap.get(freq).size === 0) {
      this.freqMap.delete(freq);
      if (freq === this.minFreq) {
        this.minFreq++;
      }
    }

    // Increment frequency
    node.freq++;
    const newFreq = node.freq;

    // Add to new frequency list
    if (!this.freqMap.has(newFreq)) {
      this.freqMap.set(newFreq, new DoublyLinkedList());
    }
    this.freqMap.get(newFreq).addToFront(node);
  }

  get(key) {
    if (!this.keyMap.has(key)) return -1;

    const node = this.keyMap.get(key);
    this._updateNode(node);
    return node.val;
  }

  put(key, value) {
    if (this.capacity === 0) return;

    if (this.keyMap.has(key)) {
      // Update existing key
      const node = this.keyMap.get(key);
      node.val = value;
      this._updateNode(node);
    } else {
      // New key
      if (this.keyMap.size >= this.capacity) {
        // Evict least frequently used (and LRU if tie)
        const minList = this.freqMap.get(this.minFreq);
        const evictNode = minList.removeLast();
        this.keyMap.delete(evictNode.key);
      }

      // Create new node
      const newNode = new Node(key, value);
      this.keyMap.set(key, newNode);

      // Add to frequency 1 list
      if (!this.freqMap.has(1)) {
        this.freqMap.set(1, new DoublyLinkedList());
      }
      this.freqMap.get(1).addToFront(newNode);

      // Reset min frequency to 1
      this.minFreq = 1;
    }
  }
}
```

```java
// Time: O(1) for both get and put | Space: O(capacity)
class Node {
    int key, val, freq;
    Node prev, next;

    Node(int key, int val) {
        this.key = key;
        this.val = val;
        this.freq = 1;
    }
}

class DoublyLinkedList {
    Node head, tail;
    int size;

    DoublyLinkedList() {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
        size = 0;
    }

    void addToFront(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
        size++;
    }

    void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        size--;
    }

    Node removeLast() {
        if (size == 0) return null;
        Node lastNode = tail.prev;
        removeNode(lastNode);
        return lastNode;
    }
}

class LFUCache {
    private int capacity;
    private int minFreq;
    private Map<Integer, Node> keyMap;
    private Map<Integer, DoublyLinkedList> freqMap;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyMap = new HashMap<>();
        this.freqMap = new HashMap<>();
    }

    private void updateNode(Node node) {
        int freq = node.freq;
        // Remove from current frequency list
        freqMap.get(freq).removeNode(node);

        // If list becomes empty and it was min frequency
        if (freqMap.get(freq).size == 0) {
            freqMap.remove(freq);
            if (freq == minFreq) {
                minFreq++;
            }
        }

        // Increment frequency
        node.freq++;
        freq = node.freq;

        // Add to new frequency list
        freqMap.putIfAbsent(freq, new DoublyLinkedList());
        freqMap.get(freq).addToFront(node);
    }

    public int get(int key) {
        if (!keyMap.containsKey(key)) {
            return -1;
        }

        Node node = keyMap.get(key);
        updateNode(node);
        return node.val;
    }

    public void put(int key, int value) {
        if (capacity == 0) return;

        if (keyMap.containsKey(key)) {
            // Update existing key
            Node node = keyMap.get(key);
            node.val = value;
            updateNode(node);
        } else {
            // New key
            if (keyMap.size() >= capacity) {
                // Evict least frequently used
                DoublyLinkedList minList = freqMap.get(minFreq);
                Node evictNode = minList.removeLast();
                keyMap.remove(evictNode.key);
            }

            // Create new node
            Node newNode = new Node(key, value);
            keyMap.put(key, newNode);

            // Add to frequency 1 list
            freqMap.putIfAbsent(1, new DoublyLinkedList());
            freqMap.get(1).addToFront(newNode);

            // Reset min frequency to 1
            minFreq = 1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)** for both `get` and `put` operations

- All hash map operations (get, put, delete) are O(1) average case
- Doubly linked list operations (add to front, remove node) are O(1)
- Finding minimum frequency is O(1) since we track it separately

**Space Complexity: O(capacity)**

- We store at most `capacity` nodes in the key map
- Each node appears in exactly one frequency list
- We maintain frequency lists, but total nodes across all lists = capacity
- Additional O(1) space for tracking minFreq and dummy nodes

## Common Mistakes

1. **Not handling tie-breaking correctly**: When multiple keys have the same minimum frequency, you must evict the least recently used among them. Some candidates only track frequency without maintaining LRU order within each frequency level.

2. **Forgetting to update minFreq when a frequency list becomes empty**: When you remove the last node from the current minFreq list, minFreq should increase. Failing to do this means you'll try to access an empty list during eviction.

3. **Not handling capacity = 0 edge case**: The problem allows capacity to be 0, in which case all operations should do nothing. Many candidates forget this special case.

4. **Incorrect node removal/insertion in doubly linked list**: When moving a node between frequency lists, you must properly update both the old list and the new list. Common errors include not updating list sizes or not handling the prev/next pointers correctly.

## When You'll See This Pattern

This combination of hash maps and doubly linked lists appears in several cache design problems:

1. **LRU Cache (LeetCode 146)**: Simpler version that only tracks recency using a single doubly linked list and hash map.

2. **All O(1) Data Structure (LeetCode 432)**: Similar structure but tracks counts of strings instead of cache entries.

3. **Design In-Memory File System (LeetCode 588)**: While not exactly the same, it requires similar hierarchical data structure design thinking.

The pattern is: when you need O(1) access with ordering constraints, consider hash maps for direct access and linked lists for maintaining order.

## Key Takeaways

1. **Combine data structures for complex constraints**: When a problem requires multiple ordering constraints (frequency + recency), you often need multiple interconnected data structures.

2. **Use frequency buckets with LRU ordering**: For LFU, the optimal approach uses frequency → doubly linked list mapping, where each list maintains LRU order for tie-breaking.

3. **Track minimum frequency separately**: Maintaining a `minFreq` variable avoids scanning all frequencies during eviction, keeping operations O(1).

Related problems: [LRU Cache](/problem/lru-cache), [Design In-Memory File System](/problem/design-in-memory-file-system)
