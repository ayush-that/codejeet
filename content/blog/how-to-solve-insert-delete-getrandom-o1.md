---
title: "How to Solve Insert Delete GetRandom O(1) — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Insert Delete GetRandom O(1). Medium difficulty, 55.3% acceptance rate. Topics: Array, Hash Table, Math, Design, Randomized."
date: "2026-08-11"
category: "dsa-patterns"
tags: ["insert-delete-getrandom-o1", "array", "hash-table", "math", "medium"]
---

# How to Solve Insert Delete GetRandom O(1)

This problem asks us to design a data structure that supports insertion, deletion, and random element retrieval—all in constant O(1) average time. The challenge is that while hash tables give us O(1) insertion and deletion, they don't support random access. Arrays give us random access, but deletion from the middle is O(n). The clever solution combines both data structures to get the best of both worlds.

## Visual Walkthrough

Let's trace through operations step by step:

**Initial State:**

- Array: `[]`
- Hash Map: `{}`

**Operation 1:** `insert(10)`

- Check if 10 exists in hash map → No
- Append 10 to array → `[10]`
- Store index 0 in hash map → `{10: 0}`
- Return `true`

**Operation 2:** `insert(20)`

- Check if 20 exists → No
- Append 20 to array → `[10, 20]`
- Store index 1 in hash map → `{10: 0, 20: 1}`
- Return `true`

**Operation 3:** `insert(30)`

- Check if 30 exists → No
- Append 30 to array → `[10, 20, 30]`
- Store index 2 in hash map → `{10: 0, 20: 1, 30: 2}`
- Return `true`

**Operation 4:** `getRandom()`

- Generate random index between 0 and 2
- If random index = 1 → return `array[1]` = 20

**Operation 5:** `remove(20)`

- Check if 20 exists → Yes at index 1
- Find last element in array = 30 at index 2
- Move 30 to position 1 → `[10, 30, 30]`
- Update hash map: `30: 1` (was 2)
- Remove last element → `[10, 30]`
- Remove 20 from hash map → `{10: 0, 30: 1}`
- Return `true`

The key insight: when removing an element, we swap it with the last element and pop from the end to maintain O(1) deletion.

## Brute Force Approach

A naive approach might use:

1. **Array-only solution**: Insertion is O(1), getRandom is O(1), but removal requires searching the array (O(n)) and shifting elements (O(n)).
2. **HashSet-only solution**: Insertion and deletion are O(1), but getRandom requires converting to array (O(n)) or maintaining a separate list.

Here's what the array-only approach might look like:

```python
class RandomizedSet:
    def __init__(self):
        self.data = []

    def insert(self, val):
        if val in self.data:  # O(n) search
            return False
        self.data.append(val)  # O(1)
        return True

    def remove(self, val):
        if val not in self.data:  # O(n) search
            return False
        index = self.data.index(val)  # O(n) search
        # Shift all elements after index left by one
        for i in range(index, len(self.data)-1):
            self.data[i] = self.data[i+1]
        self.data.pop()  # Remove last (now duplicate)
        return True

    def getRandom(self):
        import random
        return random.choice(self.data)  # O(1)
```

**Why this fails:** The `remove` operation is O(n) because we need to find the element and shift all subsequent elements. The problem requires all operations to be O(1) on average.

## Optimized Approach

The optimal solution combines two data structures:

1. **Dynamic Array** (`list` in Python, `Array` in JavaScript, `ArrayList` in Java): Stores the actual values and supports O(1) random access and O(1) append/pop from end.
2. **Hash Map** (`dict` in Python, `Map` in JavaScript, `HashMap` in Java): Maps each value to its current index in the array.

**Key Insight:** To delete an element in O(1):

1. Look up its index in the hash map
2. Swap it with the last element in the array
3. Update the hash map entry for the swapped element
4. Remove the last element (now the target value)
5. Remove the target from the hash map

This works because:

- Array order doesn't matter for our operations
- Swapping with the last element lets us delete from the end in O(1)
- The hash map gives us O(1) access to any element's position

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) average for all operations | Space: O(n) where n is number of elements
import random

class RandomizedSet:
    def __init__(self):
        # Array to store the actual elements
        self.array = []
        # Hash map to store element -> index mapping
        self.hash_map = {}

    def insert(self, val: int) -> bool:
        # Check if value already exists
        if val in self.hash_map:
            return False

        # Append to end of array (O(1))
        self.array.append(val)
        # Store index in hash map (last position)
        self.hash_map[val] = len(self.array) - 1
        return True

    def remove(self, val: int) -> bool:
        # Check if value exists
        if val not in self.hash_map:
            return False

        # Get index of element to remove
        index_to_remove = self.hash_map[val]
        # Get last element in array
        last_element = self.array[-1]

        # Move last element to the position of element to remove
        self.array[index_to_remove] = last_element
        # Update hash map with new position of last element
        self.hash_map[last_element] = index_to_remove

        # Remove last element from array (now duplicate)
        self.array.pop()
        # Remove target value from hash map
        del self.hash_map[val]

        return True

    def getRandom(self) -> int:
        # Generate random index and return element at that index
        return random.choice(self.array)
```

```javascript
// Time: O(1) average for all operations | Space: O(n) where n is number of elements

var RandomizedSet = function () {
  // Array to store the actual elements
  this.array = [];
  // Map to store element -> index mapping
  this.map = new Map();
};

RandomizedSet.prototype.insert = function (val) {
  // Check if value already exists
  if (this.map.has(val)) {
    return false;
  }

  // Append to end of array (O(1))
  this.array.push(val);
  // Store index in map (last position)
  this.map.set(val, this.array.length - 1);
  return true;
};

RandomizedSet.prototype.remove = function (val) {
  // Check if value exists
  if (!this.map.has(val)) {
    return false;
  }

  // Get index of element to remove
  const indexToRemove = this.map.get(val);
  // Get last element in array
  const lastElement = this.array[this.array.length - 1];

  // Move last element to the position of element to remove
  this.array[indexToRemove] = lastElement;
  // Update map with new position of last element
  this.map.set(lastElement, indexToRemove);

  // Remove last element from array (now duplicate)
  this.array.pop();
  // Remove target value from map
  this.map.delete(val);

  return true;
};

RandomizedSet.prototype.getRandom = function () {
  // Generate random index between 0 and array.length - 1
  const randomIndex = Math.floor(Math.random() * this.array.length);
  return this.array[randomIndex];
};
```

```java
// Time: O(1) average for all operations | Space: O(n) where n is number of elements
import java.util.*;

class RandomizedSet {
    private List<Integer> array;  // Stores elements
    private Map<Integer, Integer> map;  // Maps element -> index
    private Random rand;  // For random number generation

    public RandomizedSet() {
        array = new ArrayList<>();
        map = new HashMap<>();
        rand = new Random();
    }

    public boolean insert(int val) {
        // Check if value already exists
        if (map.containsKey(val)) {
            return false;
        }

        // Append to end of array (O(1))
        array.add(val);
        // Store index in map (last position)
        map.put(val, array.size() - 1);
        return true;
    }

    public boolean remove(int val) {
        // Check if value exists
        if (!map.containsKey(val)) {
            return false;
        }

        // Get index of element to remove
        int indexToRemove = map.get(val);
        // Get last element in array
        int lastElement = array.get(array.size() - 1);

        // Move last element to the position of element to remove
        array.set(indexToRemove, lastElement);
        // Update map with new position of last element
        map.put(lastElement, indexToRemove);

        // Remove last element from array (now duplicate)
        array.remove(array.size() - 1);
        // Remove target value from map
        map.remove(val);

        return true;
    }

    public int getRandom() {
        // Generate random index between 0 and array.size() - 1
        int randomIndex = rand.nextInt(array.size());
        return array.get(randomIndex);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `insert(val)`: O(1) average. Hash map lookup and insertion are O(1) average, array append is O(1) amortized.
- `remove(val)`: O(1) average. Hash map lookup, array swap, and array pop are all O(1).
- `getRandom()`: O(1). Random index generation and array access are O(1).

**Space Complexity:** O(n) where n is the number of elements stored. We maintain both an array and a hash map, each storing n elements.

## Common Mistakes

1. **Forgetting to update the hash map when swapping during removal**: After swapping the target with the last element, you must update the hash map entry for the swapped element. Otherwise, its index will be incorrect.

2. **Checking array instead of hash map for existence**: Some candidates check `if val in array` which is O(n). Always check the hash map for O(1) existence checks.

3. **Not handling the case where the element to remove is the last element**: When the element to remove is already at the end of the array, swapping it with itself and then popping works correctly, but some implementations might have edge cases here.

4. **Using a set instead of a map**: A set only tells you if an element exists, not where it is. You need the index for O(1) removal.

## When You'll See This Pattern

This "hash map + array" pattern appears in problems where you need both fast lookup by value and random access by index:

1. **LRU Cache (LeetCode 146)**: Uses hash map + doubly linked list for O(1) operations. Similar idea of combining data structures for different access patterns.

2. **LFU Cache (LeetCode 460)**: More complex version that tracks frequency counts, also uses multiple data structures.

3. **Design Twitter (LeetCode 355)**: Combines hash maps with lists/heaps to efficiently retrieve user feeds.

4. **Time Based Key-Value Store (LeetCode 981)**: Uses hash map + list of timestamped values for efficient time-based queries.

## Key Takeaways

1. **Combine complementary data structures**: When no single data structure provides all the operations you need in the required time complexity, consider combining two or more structures where each handles specific operations efficiently.

2. **Trade space for time**: The O(n) space complexity is acceptable to achieve O(1) time operations. This is a common trade-off in system design.

3. **Maintain consistency**: When using multiple data structures to represent the same data, any operation must update all structures to keep them synchronized.

Related problems: [Insert Delete GetRandom O(1) - Duplicates allowed](/problem/insert-delete-getrandom-o1-duplicates-allowed)
