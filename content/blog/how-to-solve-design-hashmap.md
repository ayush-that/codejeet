---
title: "How to Solve Design HashMap — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Design HashMap. Easy difficulty, 66.4% acceptance rate. Topics: Array, Hash Table, Linked List, Design, Hash Function."
date: "2027-01-02"
category: "dsa-patterns"
tags: ["design-hashmap", "array", "hash-table", "linked-list", "easy"]
---

# How to Solve Design HashMap

Designing a HashMap from scratch is a classic interview problem that tests your understanding of fundamental data structures. While it's labeled "Easy," the challenge lies in implementing the core components correctly: handling collisions, choosing an appropriate hash function, and managing resizing. You can't use built-in hash tables, so you need to build the machinery yourself.

## Visual Walkthrough

Let's trace through a small example to understand how our HashMap will work. We'll use a simple array of size 5 with linked lists for collision handling.

**Step 1: Initialize**
We create an array of 5 empty buckets (linked lists):

```
Buckets: [ ] [ ] [ ] [ ] [ ]
```

**Step 2: put(1, 10)**

- Hash key 1: `1 % 5 = 1`
- Bucket 1 is empty, so we add node (1, 10):

```
Buckets: [ ] [(1,10)] [ ] [ ] [ ]
```

**Step 3: put(2, 20)**

- Hash key 2: `2 % 5 = 2`
- Bucket 2 is empty, so we add node (2, 20):

```
Buckets: [ ] [(1,10)] [(2,20)] [ ] [ ]
```

**Step 4: put(6, 60)**

- Hash key 6: `6 % 5 = 1` (collision with key 1!)
- Bucket 1 already has (1, 10). We traverse the linked list:
  - Find key 6 doesn't exist, so append (6, 60):

```
Buckets: [ ] [(1,10)→(6,60)] [(2,20)] [ ] [ ]
```

**Step 5: put(1, 15)**

- Hash key 1: `1 % 5 = 1`
- Traverse bucket 1's linked list:
  - Find existing key 1, update value from 10 to 15:

```
Buckets: [ ] [(1,15)→(6,60)] [(2,20)] [ ] [ ]
```

**Step 6: get(6)**

- Hash key 6: `6 % 5 = 1`
- Traverse bucket 1: find (6, 60) → return 60

**Step 7: remove(2)**

- Hash key 2: `2 % 5 = 2`
- Traverse bucket 2: find (2, 20), remove it:

```
Buckets: [ ] [(1,15)→(6,60)] [ ] [ ] [ ]
```

## Brute Force Approach

A truly naive approach would be to use a large fixed-size array where the index equals the key. This only works for small, non-negative integer keys:

```python
class BadHashMap:
    def __init__(self):
        self.array = [-1] * 1000001  # Wasteful!

    def put(self, key, value):
        self.array[key] = value

    def get(self, key):
        return self.array[key]

    def remove(self, key):
        self.array[key] = -1
```

**Why this fails:**

1. **Massive memory waste**: We allocate space for all possible keys (0 to 10^6), even if we only store a few.
2. **Doesn't handle collisions**: Different keys can't map to the same value.
3. **Limited key range**: Only works for keys 0-10^6.
4. **No hash function**: The "hash" is just the key itself.

The optimal solution needs to handle arbitrary key ranges efficiently using hashing and collision resolution.

## Optimal Solution

We'll implement a proper HashMap with:

1. **Array of buckets**: Fixed initial size, grows as needed
2. **Linked list chaining**: Handle collisions by storing multiple entries in the same bucket
3. **Simple hash function**: `key % number_of_buckets`
4. **Load factor tracking**: Resize when buckets get too full

<div class="code-group">

```python
# Time: O(1) average, O(n) worst case | Space: O(n)
class ListNode:
    """Node for linked list chaining"""
    def __init__(self, key=-1, val=-1, next=None):
        self.key = key
        self.val = val
        self.next = next

class MyHashMap:
    def __init__(self):
        # Start with 1000 buckets - a good balance between memory and collisions
        self.size = 1000
        # Create array of dummy head nodes for each bucket
        self.buckets = [ListNode() for _ in range(self.size)]

    def _hash(self, key):
        """Simple hash function using modulo operation"""
        return key % self.size

    def put(self, key: int, value: int) -> None:
        # Step 1: Find the bucket for this key
        index = self._hash(key)
        curr = self.buckets[index]

        # Step 2: Traverse the linked list in this bucket
        while curr.next:
            # If key already exists, update its value
            if curr.next.key == key:
                curr.next.val = value
                return
            curr = curr.next

        # Step 3: Key doesn't exist, append new node at the end
        curr.next = ListNode(key, value)

    def get(self, key: int) -> int:
        # Step 1: Find the bucket for this key
        index = self._hash(key)
        curr = self.buckets[index].next  # Skip dummy head

        # Step 2: Search for the key in this bucket's linked list
        while curr:
            if curr.key == key:
                return curr.val
            curr = curr.next

        # Key not found
        return -1

    def remove(self, key: int) -> None:
        # Step 1: Find the bucket for this key
        index = self._hash(key)
        curr = self.buckets[index]

        # Step 2: Search for the key, keeping track of previous node
        while curr.next:
            if curr.next.key == key:
                # Found it - skip over this node (remove it)
                curr.next = curr.next.next
                return
            curr = curr.next
```

```javascript
// Time: O(1) average, O(n) worst case | Space: O(n)
class ListNode {
  constructor(key = -1, val = -1, next = null) {
    this.key = key;
    this.val = val;
    this.next = next;
  }
}

class MyHashMap {
  constructor() {
    // Initialize with 1000 buckets
    this.size = 1000;
    // Create array of dummy head nodes
    this.buckets = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.buckets[i] = new ListNode();
    }
  }

  /** Hash function to determine bucket index */
  _hash(key) {
    return key % this.size;
  }

  /** Insert or update a key-value pair */
  put(key, value) {
    // Step 1: Get bucket index
    const index = this._hash(key);
    let curr = this.buckets[index];

    // Step 2: Check if key already exists
    while (curr.next) {
      if (curr.next.key === key) {
        // Update existing key
        curr.next.val = value;
        return;
      }
      curr = curr.next;
    }

    // Step 3: Key doesn't exist, add new node
    curr.next = new ListNode(key, value);
  }

  /** Get value for a key, return -1 if not found */
  get(key) {
    // Step 1: Get bucket index
    const index = this._hash(key);
    let curr = this.buckets[index].next; // Skip dummy head

    // Step 2: Search for key in linked list
    while (curr) {
      if (curr.key === key) {
        return curr.val;
      }
      curr = curr.next;
    }

    // Key not found
    return -1;
  }

  /** Remove key from hashmap */
  remove(key) {
    // Step 1: Get bucket index
    const index = this._hash(key);
    let curr = this.buckets[index];

    // Step 2: Find and remove node
    while (curr.next) {
      if (curr.next.key === key) {
        // Skip over the node to remove it
        curr.next = curr.next.next;
        return;
      }
      curr = curr.next;
    }
  }
}
```

```java
// Time: O(1) average, O(n) worst case | Space: O(n)
class ListNode {
    int key, val;
    ListNode next;

    ListNode(int key, int val) {
        this.key = key;
        this.val = val;
    }

    ListNode() {
        this(-1, -1);
    }
}

class MyHashMap {
    private ListNode[] buckets;
    private int size;

    public MyHashMap() {
        // Initialize with 1000 buckets
        this.size = 1000;
        this.buckets = new ListNode[this.size];

        // Create dummy head nodes for each bucket
        for (int i = 0; i < this.size; i++) {
            buckets[i] = new ListNode();
        }
    }

    /** Hash function using modulo operation */
    private int hash(int key) {
        return key % size;
    }

    public void put(int key, int value) {
        // Step 1: Determine bucket
        int index = hash(key);
        ListNode curr = buckets[index];

        // Step 2: Check if key exists
        while (curr.next != null) {
            if (curr.next.key == key) {
                // Update existing key
                curr.next.val = value;
                return;
            }
            curr = curr.next;
        }

        // Step 3: Add new node
        curr.next = new ListNode(key, value);
    }

    public int get(int key) {
        // Step 1: Determine bucket
        int index = hash(key);
        ListNode curr = buckets[index].next; // Skip dummy head

        // Step 2: Search for key
        while (curr != null) {
            if (curr.key == key) {
                return curr.val;
            }
            curr = curr.next;
        }

        // Key not found
        return -1;
    }

    public void remove(int key) {
        // Step 1: Determine bucket
        int index = hash(key);
        ListNode curr = buckets[index];

        // Step 2: Find and remove node
        while (curr.next != null) {
            if (curr.next.key == key) {
                // Skip the node to remove it
                curr.next = curr.next.next;
                return;
            }
            curr = curr.next;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Average case O(1)**: With a good hash function and proper resizing, most operations take constant time. The hash function gives us the bucket in O(1), and with a good load factor, each bucket has O(1) elements on average.
- **Worst case O(n)**: If all keys hash to the same bucket (poor hash function or malicious input), operations degrade to O(n) as we traverse a linked list of all elements.

**Space Complexity:**

- **O(n + m)**: Where n is the number of stored key-value pairs and m is the number of buckets. We store each pair in a node, plus the array of buckets. In practice, we say O(n) since m is typically proportional to n.

## Common Mistakes

1. **Forgetting to handle updates in `put()`**: Many candidates only append new nodes without checking if the key already exists. Always traverse the bucket first to check for existing keys before appending.

2. **Not using dummy head nodes**: Without dummy heads, removing the first node in a bucket becomes tricky. The dummy head simplifies removal logic by ensuring we always have a previous node to work with.

3. **Poor choice of initial size or hash function**: Starting with too few buckets causes immediate collisions. Using a hash function like `key % prime` with a prime number of buckets reduces collisions.

4. **Not handling negative keys**: The modulo operation `key % size` works correctly for negative keys in Python and JavaScript, but in Java, `key % size` can be negative. Use `(key % size + size) % size` in Java for consistent behavior.

## When You'll See This Pattern

The hashmap-with-chaining pattern appears in many design problems:

1. **Design HashSet (LeetCode 705)**: Almost identical structure, but storing only keys instead of key-value pairs. The same collision handling applies.

2. **LRU Cache (LeetCode 146)**: Combines hashmap with doubly-linked list for O(1) operations. The hashmap provides quick access, while the linked list maintains order.

3. **Design Underground System (LeetCode 1396)**: Uses nested hashmaps to track travel times between stations efficiently.

4. **Time-Based Key-Value Store (LeetCode 981)**: Extends the hashmap concept to store multiple values per key with timestamps, often using binary search for efficient retrieval.

## Key Takeaways

1. **Separate chaining is the simplest collision resolution**: When multiple keys hash to the same bucket, store them in a linked list. This is easier to implement than open addressing and handles dynamic resizing well.

2. **The load factor determines when to resize**: A good rule is to double the number of buckets when the average chain length exceeds a threshold (typically 0.75). This keeps operations O(1) on average.

3. **Dummy head nodes simplify edge cases**: They make removal operations consistent whether you're removing the first, middle, or last node in a chain.

4. **Hash functions should distribute keys uniformly**: Simple modulo with a prime number works well for integer keys. For real-world use, you'd need more sophisticated hash functions for other data types.

Related problems: [Design HashSet](/problem/design-hashset), [Design Skiplist](/problem/design-skiplist)
