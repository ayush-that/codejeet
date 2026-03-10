---
title: "How to Solve Insert Delete GetRandom O(1) - Duplicates allowed — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Insert Delete GetRandom O(1) - Duplicates allowed. Hard difficulty, 36.4% acceptance rate. Topics: Array, Hash Table, Math, Design, Randomized."
date: "2026-03-14"
category: "dsa-patterns"
tags: ["insert-delete-getrandom-o1-duplicates-allowed", "array", "hash-table", "math", "hard"]
---

# How to Solve Insert Delete GetRandom O(1) - Duplicates Allowed

This problem asks us to design a data structure that supports inserting, removing, and retrieving random elements—all in average O(1) time—while allowing duplicate values. The challenge is that we need to maintain constant-time random access while efficiently tracking multiple occurrences of the same value. The standard approach for the non-duplicate version (using an array and hash map) breaks down when duplicates are allowed because a value can map to multiple indices.

## Visual Walkthrough

Let's trace through operations with a concrete example:

1. **Initialize**: `RandomizedCollection()`
   - We'll have an empty array and an empty hash map

2. **Insert 1**: `insert(1)`
   - Add 1 to array: `[1]`
   - Add index 0 to hash map for value 1: `{1: {0}}`
   - Return true (since 1 wasn't present before)

3. **Insert 1**: `insert(1)`
   - Add 1 to array: `[1, 1]`
   - Add index 1 to hash map for value 1: `{1: {0, 1}}`
   - Return false (since 1 was already present)

4. **Insert 2**: `insert(2)`
   - Add 2 to array: `[1, 1, 2]`
   - Add index 2 to hash map for value 2: `{1: {0, 1}, 2: {2}}`
   - Return true

5. **GetRandom**: `getRandom()`
   - Generate random index between 0 and 2
   - Return element at that index

6. **Remove 1**: `remove(1)`
   - Find indices of 1: `{0, 1}`
   - Pick one index (say 0)
   - Swap element at index 0 with last element (2 at index 2)
   - Array becomes: `[2, 1, 1]`
   - Update hash map:
     - Remove index 0 from value 1's set
     - Update value 2's index from 2 to 0
   - Remove last element (now 1 at index 2)
   - Array becomes: `[2, 1]`
   - Return true (successfully removed)

The key insight is that we use a hash map where each value maps to a set of indices, and we always remove from the end of the array to maintain O(1) removal.

## Brute Force Approach

A naive approach would use only an array:

- **Insert**: Simply append to the array → O(1)
- **Remove**: Search through the array to find the element, then shift all subsequent elements → O(n)
- **GetRandom**: Generate random index and return element → O(1)

The problem is the O(n) removal. Another naive approach might use a hash map with counters:

- **Insert**: Increment counter for the value → O(1)
- **Remove**: Decrement counter → O(1)
- **GetRandom**: But how do we get a random element with proper probability distribution? We'd need to reconstruct the multiset from the counters, which takes O(n) time.

The brute force fails because we need both O(1) random access (which arrays provide) and O(1) removal (which requires knowing exactly where each element is).

## Optimized Approach

The optimal solution combines three key insights:

1. **Array for random access**: We store all elements in an array for O(1) random access by index.

2. **Hash map with sets for tracking duplicates**: Each value maps to a set of indices where that value appears in the array. This allows us to find any occurrence of a value in O(1) average time.

3. **Swap-and-pop for removal**: When removing an element, we:
   - Find one of its indices from the hash map
   - Swap it with the last element in the array
   - Update the hash map for both swapped elements
   - Remove the last element (now the element we want to delete)

This maintains array contiguity while achieving O(1) average time for all operations.

The tricky part is managing the index updates correctly when swapping:

- When we swap element A (to be removed) with element B (last element), we need to:
  1. Remove A's old index from its set
  2. Remove B's old index (last position) from its set
  3. Add B's new index (A's old position) to its set

## Optimal Solution

<div class="code-group">

```python
import random
from collections import defaultdict

class RandomizedCollection:
    """
    Time Complexity:
        - insert: O(1) average
        - remove: O(1) average
        - getRandom: O(1)
    Space Complexity: O(n) where n is total number of elements
    """

    def __init__(self):
        # Array to store all elements for O(1) random access
        self.nums = []
        # Hash map: value -> set of indices where value appears in nums
        self.index_map = defaultdict(set)

    def insert(self, val: int) -> bool:
        """
        Inserts a value to the collection.
        Returns true if the collection did not already contain the value.
        """
        # Add value to the end of array
        self.nums.append(val)
        # Add the new index to the value's index set
        self.index_map[val].add(len(self.nums) - 1)
        # Return true if this was the first occurrence of val
        return len(self.index_map[val]) == 1

    def remove(self, val: int) -> bool:
        """
        Removes a value from the collection.
        Returns true if the collection contained the value.
        """
        if val not in self.index_map or not self.index_map[val]:
            return False  # Value not in collection

        # Get one index where val appears (pop from set for O(1) removal)
        remove_idx = self.index_map[val].pop()
        last_val = self.nums[-1]

        # Swap the element to remove with the last element
        self.nums[remove_idx] = last_val

        # Update index_map for the last_val:
        # 1. Remove the old index (last position) of last_val
        # 2. Add the new index (remove_idx) for last_val
        self.index_map[last_val].add(remove_idx)
        self.index_map[last_val].discard(len(self.nums) - 1)

        # Remove the last element from array
        self.nums.pop()

        # Clean up index_map if val has no more occurrences
        if not self.index_map[val]:
            del self.index_map[val]

        return True

    def getRandom(self) -> int:
        """
        Returns a random element from the collection.
        Each element has equal probability of being returned.
        """
        return random.choice(self.nums)
```

```javascript
class RandomizedCollection {
  /**
   * Time Complexity:
   *   - insert: O(1) average
   *   - remove: O(1) average
   *   - getRandom: O(1)
   * Space Complexity: O(n) where n is total number of elements
   */
  constructor() {
    // Array to store all elements for O(1) random access
    this.nums = [];
    // Map: value -> Set of indices where value appears in nums
    this.indexMap = new Map();
  }

  /**
   * Inserts a value to the collection.
   * @param {number} val
   * @return {boolean} true if collection did not already contain val
   */
  insert(val) {
    // Add value to the end of array
    this.nums.push(val);

    // Get or create the index set for this value
    if (!this.indexMap.has(val)) {
      this.indexMap.set(val, new Set());
    }
    const indexSet = this.indexMap.get(val);

    // Add the new index to the value's index set
    indexSet.add(this.nums.length - 1);

    // Return true if this was the first occurrence of val
    return indexSet.size === 1;
  }

  /**
   * Removes a value from the collection.
   * @param {number} val
   * @return {boolean} true if collection contained val
   */
  remove(val) {
    if (!this.indexMap.has(val) || this.indexMap.get(val).size === 0) {
      return false; // Value not in collection
    }

    const indexSet = this.indexMap.get(val);
    // Get one index where val appears (using iterator for O(1) access)
    const removeIdx = indexSet.values().next().value;
    indexSet.delete(removeIdx);

    const lastVal = this.nums[this.nums.length - 1];

    // Swap the element to remove with the last element
    this.nums[removeIdx] = lastVal;

    // Update indexMap for the lastVal
    const lastValSet = this.indexMap.get(lastVal);
    if (lastValSet) {
      // Remove the old index (last position) of lastVal
      lastValSet.delete(this.nums.length - 1);
      // Add the new index (removeIdx) for lastVal
      lastValSet.add(removeIdx);
    }

    // Remove the last element from array
    this.nums.pop();

    // Clean up indexMap if val has no more occurrences
    if (indexSet.size === 0) {
      this.indexMap.delete(val);
    }

    return true;
  }

  /**
   * Returns a random element from the collection.
   * @return {number}
   */
  getRandom() {
    const randomIndex = Math.floor(Math.random() * this.nums.length);
    return this.nums[randomIndex];
  }
}
```

```java
import java.util.*;

class RandomizedCollection {
    /**
     * Time Complexity:
     *   - insert: O(1) average
     *   - remove: O(1) average
     *   - getRandom: O(1)
     * Space Complexity: O(n) where n is total number of elements
     */

    private List<Integer> nums;  // Array to store all elements
    private Map<Integer, Set<Integer>> indexMap;  // Value -> indices in nums
    private Random rand;

    public RandomizedCollection() {
        nums = new ArrayList<>();
        indexMap = new HashMap<>();
        rand = new Random();
    }

    public boolean insert(int val) {
        // Add value to the end of list
        nums.add(val);

        // Get or create the index set for this value
        Set<Integer> indices = indexMap.getOrDefault(val, new HashSet<>());

        // Add the new index to the value's index set
        indices.add(nums.size() - 1);
        indexMap.put(val, indices);

        // Return true if this was the first occurrence of val
        return indices.size() == 1;
    }

    public boolean remove(int val) {
        if (!indexMap.containsKey(val) || indexMap.get(val).isEmpty()) {
            return false;  // Value not in collection
        }

        Set<Integer> indices = indexMap.get(val);
        // Get one index where val appears
        int removeIdx = indices.iterator().next();
        indices.remove(removeIdx);

        int lastVal = nums.get(nums.size() - 1);

        // Swap the element to remove with the last element
        nums.set(removeIdx, lastVal);

        // Update indexMap for the lastVal
        Set<Integer> lastValIndices = indexMap.get(lastVal);
        if (lastValIndices != null) {
            // Remove the old index (last position) of lastVal
            lastValIndices.remove(nums.size() - 1);
            // Add the new index (removeIdx) for lastVal
            lastValIndices.add(removeIdx);
        }

        // Remove the last element from list
        nums.remove(nums.size() - 1);

        // Clean up indexMap if val has no more occurrences
        if (indices.isEmpty()) {
            indexMap.remove(val);
        }

        return true;
    }

    public int getRandom() {
        // Generate random index and return element at that index
        int randomIndex = rand.nextInt(nums.size());
        return nums.get(randomIndex);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `insert(val)`: O(1) average. Appending to array is O(1), adding to hash map set is O(1) average.
- `remove(val)`: O(1) average. Finding an index from the set is O(1), swapping elements is O(1), updating the hash map is O(1) average.
- `getRandom()`: O(1). Random index generation and array access are both O(1).

**Space Complexity:** O(n) where n is the total number of elements inserted. We store each element in the array and maintain indices in the hash map. Each index appears exactly once across all sets, so total space is proportional to n.

## Common Mistakes

1. **Forgetting to update indices when swapping**: When you swap the element to remove with the last element, you must update BOTH elements' indices in the hash map. A common mistake is only updating the element being removed.

2. **Using a list instead of a set for index storage**: If you use a list for storing indices, removing an index becomes O(n) instead of O(1). Always use a hash set for O(1) removal of arbitrary indices.

3. **Not handling the case where the removed element is the last element**: When the element to remove is already at the end of the array, the swap operation would be redundant but not wrong. However, you must be careful not to add duplicate indices when updating the hash map in this case.

4. **Incorrect random probability**: Using a hash map alone for getRandom() would not give equal probability to each occurrence of duplicate values. The array-based approach ensures each element (including duplicates) has equal probability of being selected.

## When You'll See This Pattern

This "array + hash map with indices" pattern appears in problems requiring O(1) access, insertion, and deletion while maintaining random access capability:

1. **Insert Delete GetRandom O(1)** (LeetCode 380): The simpler version without duplicates uses the same core idea but with a hash map storing single indices instead of sets.

2. **Design Twitter** (LeetCode 355): While more complex, it uses similar data structure combinations to achieve efficient operations across different access patterns.

3. **LFU Cache** (LeetCode 460): Uses multiple data structures (hash maps, doubly linked lists) to maintain O(1) operations for cache eviction policies.

The pattern is: when you need O(1) random access AND O(1) removal/insertion, consider combining an array (for random access) with a hash map (for tracking positions).

## Key Takeaways

1. **Combine complementary data structures**: Arrays provide O(1) random access but poor removal; hash maps provide O(1) lookup but no random access. Combining them gives you the best of both worlds.

2. **Swap-and-pop for O(1) removal**: When you need to remove an arbitrary element from an array while maintaining contiguity, swap it with the last element and pop from the end.

3. **Track all occurrences for duplicates**: When duplicates are allowed, each value needs to map to a collection of indices (preferably a hash set for O(1) operations).

Related problems: [Insert Delete GetRandom O(1)](/problem/insert-delete-getrandom-o1)
