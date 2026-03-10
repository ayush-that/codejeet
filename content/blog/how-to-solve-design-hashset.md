---
title: "How to Solve Design HashSet — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Design HashSet. Easy difficulty, 67.8% acceptance rate. Topics: Array, Hash Table, Linked List, Design, Hash Function."
date: "2027-04-02"
category: "dsa-patterns"
tags: ["design-hashset", "array", "hash-table", "linked-list", "easy"]
---

# How to Solve Design HashSet

Designing a HashSet from scratch is a classic interview problem that tests your understanding of fundamental data structures. While it's labeled "Easy," the challenge lies in implementing the core mechanics of hashing, collision resolution, and dynamic resizing without relying on built-in libraries. This problem is interesting because it reveals whether you truly understand how hash tables work under the hood, not just how to use them.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we create a `MyHashSet` with an initial capacity of 5 buckets (arrays). We'll use a simple hash function: `key % 5`.

**Step 1:** Initialize an empty HashSet with 5 buckets:

```
Bucket 0: []
Bucket 1: []
Bucket 2: []
Bucket 3: []
Bucket 4: []
```

**Step 2:** Add key 7. Hash = 7 % 5 = 2. Insert 7 into bucket 2:

```
Bucket 0: []
Bucket 1: []
Bucket 2: [7]
Bucket 3: []
Bucket 4: []
```

**Step 3:** Add key 12. Hash = 12 % 5 = 2. Collision! Both 7 and 12 map to bucket 2. We'll use chaining (linked list) to handle this:

```
Bucket 0: []
Bucket 1: []
Bucket 2: [7 → 12]
Bucket 3: []
Bucket 4: []
```

**Step 4:** Check if 12 exists (`contains(12)`). Hash = 12 % 5 = 2. Search bucket 2: find 7, then find 12 → return `true`.

**Step 5:** Remove key 7. Hash = 7 % 5 = 2. Search bucket 2: find 7 at the head, remove it:

```
Bucket 0: []
Bucket 1: []
Bucket 2: [12]
Bucket 3: []
Bucket 4: []
```

**Step 6:** Check if 7 exists (`contains(7)`). Hash = 7 % 5 = 2. Search bucket 2: find 12, no 7 → return `false`.

This example shows the core concepts: hashing to determine bucket index, chaining to handle collisions, and operations that work within each bucket.

## Brute Force Approach

A truly naive approach would be to use a simple array and scan it for every operation:

- **Add:** Check if key exists (O(n)), if not, append to array (O(1))
- **Contains:** Linear scan through array (O(n))
- **Remove:** Linear scan to find key, then shift all subsequent elements (O(n))

While this works for very small datasets, it becomes impractical for realistic use cases. The operations are O(n) time complexity, which is unacceptable for a data structure that should have average O(1) operations. A candidate might also consider using a sorted array with binary search (O(log n) operations), but that's still not the O(1) average case we want from a hash set.

The key insight is that we need to distribute keys across multiple buckets to reduce the search space for each operation.

## Optimal Solution

The optimal solution uses an array of buckets with chaining (linked lists) to handle collisions. We'll implement:

1. **Initialization:** Create an array of empty buckets
2. **Hash function:** Map keys to bucket indices
3. **Add operation:** Hash to find bucket, traverse chain to check for duplicates, add if not present
4. **Contains operation:** Hash to find bucket, traverse chain to find key
5. **Remove operation:** Hash to find bucket, traverse chain to find and remove key
6. **Dynamic resizing:** Optional but important for production-quality implementation

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
class MyHashSet:
    # Time: O(1) average, O(n) worst case | Space: O(n)

    def __init__(self):
        """
        Initialize your data structure here.
        We use an array of buckets, each bucket is a list (for chaining).
        We start with a small capacity and resize when load factor gets high.
        """
        self.capacity = 1000  # Initial number of buckets
        self.size = 0  # Number of elements in the set
        self.buckets = [[] for _ in range(self.capacity)]
        self.load_factor = 0.75  # When size/capacity exceeds this, we resize

    def _hash(self, key: int) -> int:
        """
        Simple hash function: key % capacity.
        This distributes keys evenly across buckets.
        """
        return key % self.capacity

    def _resize(self):
        """
        Double the capacity and rehash all existing elements.
        This keeps the chains short and operations efficient.
        """
        old_buckets = self.buckets
        self.capacity *= 2
        self.buckets = [[] for _ in range(self.capacity)]
        self.size = 0  # Will be recalculated during rehashing

        # Rehash all existing elements into new buckets
        for bucket in old_buckets:
            for key in bucket:
                self.add(key)  # Use add to rehash into new structure

    def add(self, key: int) -> None:
        """
        Inserts a key into the HashSet.
        1. Check if we need to resize
        2. Compute hash to find bucket index
        3. Check if key already exists in bucket
        4. Add if not present
        """
        # Check load factor and resize if necessary
        if self.size / self.capacity > self.load_factor:
            self._resize()

        index = self._hash(key)
        bucket = self.buckets[index]

        # Check if key already exists in the bucket
        for k in bucket:
            if k == key:
                return  # Key already exists, no need to add

        # Key doesn't exist, add it to the bucket
        bucket.append(key)
        self.size += 1

    def remove(self, key: int) -> None:
        """
        Removes a key from the HashSet.
        1. Compute hash to find bucket index
        2. Search for key in bucket
        3. Remove if found
        """
        index = self._hash(key)
        bucket = self.buckets[index]

        # Search for key in the bucket
        for i, k in enumerate(bucket):
            if k == key:
                # Found the key, remove it from the bucket
                bucket.pop(i)
                self.size -= 1
                return

    def contains(self, key: int) -> bool:
        """
        Returns true if this set contains the specified element.
        1. Compute hash to find bucket index
        2. Search for key in bucket
        3. Return True if found, False otherwise
        """
        index = self._hash(key)
        bucket = self.buckets[index]

        # Linear search in the bucket
        for k in bucket:
            if k == key:
                return True
        return False
```

```javascript
// Time: O(1) average, O(n) worst case | Space: O(n)
class MyHashSet {
  constructor() {
    /**
     * Initialize your data structure here.
     * We use an array of buckets, each bucket is an array (for chaining).
     * We start with a small capacity and resize when load factor gets high.
     */
    this.capacity = 1000; // Initial number of buckets
    this.size = 0; // Number of elements in the set
    this.buckets = new Array(this.capacity);
    this.loadFactor = 0.75; // When size/capacity exceeds this, we resize

    // Initialize each bucket as an empty array
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }
  }

  /**
   * Simple hash function: key % capacity.
   * This distributes keys evenly across buckets.
   */
  _hash(key) {
    return key % this.capacity;
  }

  /**
   * Double the capacity and rehash all existing elements.
   * This keeps the chains short and operations efficient.
   */
  _resize() {
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = new Array(this.capacity);
    this.size = 0; // Will be recalculated during rehashing

    // Initialize new buckets
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }

    // Rehash all existing elements into new buckets
    for (const bucket of oldBuckets) {
      for (const key of bucket) {
        this.add(key); // Use add to rehash into new structure
      }
    }
  }

  /**
   * Inserts a key into the HashSet.
   * 1. Check if we need to resize
   * 2. Compute hash to find bucket index
   * 3. Check if key already exists in bucket
   * 4. Add if not present
   */
  add(key) {
    // Check load factor and resize if necessary
    if (this.size / this.capacity > this.loadFactor) {
      this._resize();
    }

    const index = this._hash(key);
    const bucket = this.buckets[index];

    // Check if key already exists in the bucket
    for (const k of bucket) {
      if (k === key) {
        return; // Key already exists, no need to add
      }
    }

    // Key doesn't exist, add it to the bucket
    bucket.push(key);
    this.size++;
  }

  /**
   * Removes a key from the HashSet.
   * 1. Compute hash to find bucket index
   * 2. Search for key in bucket
   * 3. Remove if found
   */
  remove(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];

    // Search for key in the bucket
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i] === key) {
        // Found the key, remove it from the bucket
        bucket.splice(i, 1);
        this.size--;
        return;
      }
    }
  }

  /**
   * Returns true if this set contains the specified element.
   * 1. Compute hash to find bucket index
   * 2. Search for key in bucket
   * 3. Return true if found, false otherwise
   */
  contains(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];

    // Linear search in the bucket
    for (const k of bucket) {
      if (k === key) {
        return true;
      }
    }
    return false;
  }
}
```

```java
// Time: O(1) average, O(n) worst case | Space: O(n)
class MyHashSet {
    private int capacity;
    private int size;
    private List<Integer>[] buckets;
    private final double LOAD_FACTOR = 0.75;

    /**
     * Initialize your data structure here.
     * We use an array of buckets, each bucket is a LinkedList (for chaining).
     * We start with a small capacity and resize when load factor gets high.
     */
    public MyHashSet() {
        this.capacity = 1000;  // Initial number of buckets
        this.size = 0;  // Number of elements in the set
        this.buckets = new LinkedList[capacity];

        // Initialize each bucket as an empty LinkedList
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new LinkedList<>();
        }
    }

    /**
     * Simple hash function: key % capacity.
     * This distributes keys evenly across buckets.
     */
    private int hash(int key) {
        return key % capacity;
    }

    /**
     * Double the capacity and rehash all existing elements.
     * This keeps the chains short and operations efficient.
     */
    private void resize() {
        List<Integer>[] oldBuckets = buckets;
        capacity *= 2;
        buckets = new LinkedList[capacity];
        size = 0;  // Will be recalculated during rehashing

        // Initialize new buckets
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new LinkedList<>();
        }

        // Rehash all existing elements into new buckets
        for (List<Integer> bucket : oldBuckets) {
            for (int key : bucket) {
                add(key);  // Use add to rehash into new structure
            }
        }
    }

    /**
     * Inserts a key into the HashSet.
     * 1. Check if we need to resize
     * 2. Compute hash to find bucket index
     * 3. Check if key already exists in bucket
     * 4. Add if not present
     */
    public void add(int key) {
        // Check load factor and resize if necessary
        if ((double) size / capacity > LOAD_FACTOR) {
            resize();
        }

        int index = hash(key);
        List<Integer> bucket = buckets[index];

        // Check if key already exists in the bucket
        for (int k : bucket) {
            if (k == key) {
                return;  // Key already exists, no need to add
            }
        }

        // Key doesn't exist, add it to the bucket
        bucket.add(key);
        size++;
    }

    /**
     * Removes a key from the HashSet.
     * 1. Compute hash to find bucket index
     * 2. Search for key in bucket
     * 3. Remove if found
     */
    public void remove(int key) {
        int index = hash(key);
        List<Integer> bucket = buckets[index];

        // Search for key in the bucket
        for (int i = 0; i < bucket.size(); i++) {
            if (bucket.get(i) == key) {
                // Found the key, remove it from the bucket
                bucket.remove(i);
                size--;
                return;
            }
        }
    }

    /**
     * Returns true if this set contains the specified element.
     * 1. Compute hash to find bucket index
     * 2. Search for key in bucket
     * 3. Return true if found, false otherwise
     */
    public boolean contains(int key) {
        int index = hash(key);
        List<Integer> bucket = buckets[index];

        // Linear search in the bucket
        for (int k : bucket) {
            if (k == key) {
                return true;
            }
        }
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Average case:** O(1) for add, remove, and contains operations. This assumes:
  1. A good hash function that distributes keys evenly
  2. Proper resizing to maintain short chains
  3. Load factor kept low (typically 0.75)
- **Worst case:** O(n) when all keys hash to the same bucket. This happens with poor hash function or adversarial inputs.

**Space Complexity:**

- O(n + m) where n is the number of elements and m is the number of buckets
- In practice, we maintain m proportional to n (through resizing), so it's O(n)
- Each element is stored once, plus overhead for bucket arrays and linked list nodes

The key to maintaining O(1) average time is keeping the load factor (n/m) low through resizing. When the load factor exceeds a threshold (typically 0.75), we double the capacity and rehash all elements.

## Common Mistakes

1. **Forgetting to handle collisions:** The most common mistake is assuming each key will map to a unique bucket. Always implement collision resolution (chaining or open addressing). Chaining with linked lists is simplest for interviews.

2. **Not implementing resizing:** While not strictly required for the basic LeetCode problem, interviewers appreciate candidates who mention or implement dynamic resizing. Without it, operations degrade to O(n) as the set grows.

3. **Using inefficient data structures for buckets:** Using arrays for buckets makes removal O(n) within the bucket. While acceptable for interviews, mentioning that linked lists would make removal O(1) within the bucket shows deeper understanding.

4. **Poor hash function design:** Using `key % capacity` only works well when capacity is prime. For production, you'd want a more sophisticated hash function. Mentioning this shows awareness of real-world considerations.

5. **Not checking for duplicates in add():** Simply appending to the bucket without checking leads to duplicate keys in the set, violating the HashSet contract.

## When You'll See This Pattern

The hash table pattern with chaining appears in many problems:

1. **Design HashMap (LeetCode 706):** Almost identical to HashSet but stores key-value pairs instead of just keys. The core hashing and collision resolution mechanics are the same.

2. **LRU Cache (LeetCode 146):** Combines hash table with doubly linked list for O(1) operations. The hash table provides quick access, while the linked list maintains order.

3. **Insert Delete GetRandom O(1) (LeetCode 380):** Uses a hash table for O(1) insert/delete combined with an array for O(1) random access. Shows how hash tables can be combined with other structures.

4. **Group Anagrams (LeetCode 49):** Uses hash tables to group strings by their sorted version or character count signature.

The pattern is: when you need O(1) average time for insert, delete, or lookup operations, consider a hash table. The trade-off is increased memory usage and non-deterministic worst-case performance.

## Key Takeaways

1. **Hash tables provide O(1) average-case operations** by distributing elements across buckets using a hash function. The worst case is O(n) when all elements collide.

2. **Collision resolution is essential.** Chaining (linked lists at each bucket) is simplest for interviews. Open addressing (probing for empty slots) is more cache-friendly but trickier to implement.

3. **Dynamic resizing maintains performance.** As the load factor (elements/buckets) increases, operations slow down. Doubling capacity and rehashing when load factor exceeds ~0.75 keeps operations O(1) amortized.

4. **Hash function quality matters.** A good hash function distributes keys uniformly across buckets. Simple modulo works for interviews, but production systems need more sophisticated functions.

Remember: The core idea is trading space for time. By using extra memory for buckets, we reduce the search space for each operation from O(n) to O(1) on average.

Related problems: [Design HashMap](/problem/design-hashmap), [Design Skiplist](/problem/design-skiplist)
