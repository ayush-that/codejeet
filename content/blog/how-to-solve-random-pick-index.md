---
title: "How to Solve Random Pick Index — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Random Pick Index. Medium difficulty, 65.0% acceptance rate. Topics: Hash Table, Math, Reservoir Sampling, Randomized."
date: "2028-01-02"
category: "dsa-patterns"
tags: ["random-pick-index", "hash-table", "math", "reservoir-sampling", "medium"]
---

# How to Solve Random Pick Index

This problem asks us to design a class that can randomly return an index of a given target number from an array that may contain duplicates. The challenge is that we need to return each valid index with **equal probability** while being efficient across multiple calls. What makes this interesting is the trade-off between preprocessing time and query time, and the clever reservoir sampling approach that solves it with minimal space.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [1, 2, 3, 3, 3]` and we call `pick(3)`.

The target `3` appears at indices 2, 3, and 4. We need to return one of these indices randomly, each with probability 1/3.

**Naive approach**: We could store all indices where `3` appears: `[2, 3, 4]`, then randomly pick one. This works but requires O(n) space to store indices for all possible targets.

**Reservoir sampling approach**: We can process the array once during the `pick()` call, maintaining a "reservoir" of size 1. As we encounter each occurrence of the target:

- First occurrence (index 2): Our reservoir has only this index, so we keep it (probability = 1)
- Second occurrence (index 3): We generate a random number between 0 and 1. With probability 1/2, we replace our reservoir with index 3
- Third occurrence (index 4): With probability 1/3, we replace our reservoir with index 4

This ensures each index has equal probability (1/3) of being in the reservoir at the end.

## Brute Force Approach

The most straightforward solution is to preprocess the entire array in the constructor, creating a hash map that maps each value to a list of its indices. Then `pick(target)` simply retrieves the list and returns a random element from it.

**Why this works**: It correctly returns a random index with equal probability for duplicates.

**Why it's not optimal**: While the query time is O(1), the space complexity is O(n) in the worst case (when all elements are unique). For large arrays with many unique values, this can use significant memory. However, for this specific problem, this is actually an acceptable solution since the problem constraints don't explicitly forbid it. The reservoir sampling approach becomes more interesting when we consider streaming data or when we can't store all indices.

Let's see the brute force code:

<div class="code-group">

```python
class Solution:
    def __init__(self, nums: List[int]):
        # Create a hash map to store indices for each value
        self.index_map = {}
        for i, num in enumerate(nums):
            if num not in self.index_map:
                self.index_map[num] = []
            self.index_map[num].append(i)

    def pick(self, target: int) -> int:
        # Get the list of indices for the target
        indices = self.index_map[target]
        # Return a random index from the list
        return random.choice(indices)
```

```javascript
class Solution {
  constructor(nums) {
    // Create a map to store indices for each value
    this.indexMap = new Map();
    for (let i = 0; i < nums.length; i++) {
      if (!this.indexMap.has(nums[i])) {
        this.indexMap.set(nums[i], []);
      }
      this.indexMap.get(nums[i]).push(i);
    }
  }

  pick(target) {
    // Get the array of indices for the target
    const indices = this.indexMap.get(target);
    // Return a random index from the array
    const randomIndex = Math.floor(Math.random() * indices.length);
    return indices[randomIndex];
  }
}
```

```java
class Solution {
    private Map<Integer, List<Integer>> indexMap;
    private Random rand;

    public Solution(int[] nums) {
        // Initialize the random number generator
        rand = new Random();
        // Create a hash map to store indices for each value
        indexMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            // If this value isn't in the map yet, add it with empty list
            indexMap.putIfAbsent(nums[i], new ArrayList<>());
            // Add the current index to the list for this value
            indexMap.get(nums[i]).add(i);
        }
    }

    public int pick(int target) {
        // Get the list of indices for the target
        List<Integer> indices = indexMap.get(target);
        // Return a random index from the list
        return indices.get(rand.nextInt(indices.size()));
    }
}
```

</div>

## Optimized Approach

The reservoir sampling approach offers a space-optimal solution. Instead of storing all indices upfront, we process the array during each `pick()` call, using only O(1) extra space.

**Key Insight**: When we need to select one item randomly from a stream of unknown length where each item should have equal probability, we can use reservoir sampling with reservoir size 1.

**Algorithm**:

1. Initialize `count = 0` to track how many occurrences of target we've seen
2. Initialize `result = 0` to store our current candidate index
3. Iterate through the array
4. For each index `i` where `nums[i] == target`:
   - Increment `count`
   - With probability `1/count`, update `result = i`
5. Return `result`

**Why this works**: For the k-th occurrence of the target, the probability it becomes the result is `1/k`. The probability it remains the result after seeing n total occurrences is the product of:

- Probability it was selected when first seen: `1/k`
- Probability it wasn't replaced by each subsequent occurrence: `(1 - 1/(k+1)) * (1 - 1/(k+2)) * ... * (1 - 1/n)`

This simplifies to `1/n` for all k, giving equal probability to all occurrences.

## Optimal Solution

Here's the complete reservoir sampling implementation:

<div class="code-group">

```python
import random
from typing import List

class Solution:
    def __init__(self, nums: List[int]):
        # Store the original array
        self.nums = nums

    def pick(self, target: int) -> int:
        count = 0  # Count of target occurrences seen so far
        result = 0  # Current candidate index

        # Iterate through the array
        for i, num in enumerate(self.nums):
            # Check if current element matches target
            if num == target:
                count += 1  # Found another occurrence
                # With probability 1/count, replace result with current index
                # random.randint(1, count) returns 1..count inclusive
                # It equals 1 with probability 1/count
                if random.randint(1, count) == 1:
                    result = i

        return result
```

```javascript
class Solution {
  constructor(nums) {
    // Store the original array
    this.nums = nums;
  }

  pick(target) {
    let count = 0; // Count of target occurrences seen so far
    let result = 0; // Current candidate index

    // Iterate through the array
    for (let i = 0; i < this.nums.length; i++) {
      // Check if current element matches target
      if (this.nums[i] === target) {
        count++; // Found another occurrence
        // With probability 1/count, replace result with current index
        // Math.random() returns [0, 1), so < 1/count with probability 1/count
        if (Math.random() * count < 1) {
          result = i;
        }
      }
    }

    return result;
  }
}
```

```java
import java.util.Random;

class Solution {
    private int[] nums;
    private Random rand;

    public Solution(int[] nums) {
        // Store the original array
        this.nums = nums;
        // Initialize random number generator
        this.rand = new Random();
    }

    public int pick(int target) {
        int count = 0;  // Count of target occurrences seen so far
        int result = 0; // Current candidate index

        // Iterate through the array
        for (int i = 0; i < nums.length; i++) {
            // Check if current element matches target
            if (nums[i] == target) {
                count++;  // Found another occurrence
                // With probability 1/count, replace result with current index
                // rand.nextInt(count) returns 0..count-1
                // It equals 0 with probability 1/count
                if (rand.nextInt(count) == 0) {
                    result = i;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- Constructor: O(1) for reservoir sampling, O(n) for hash map approach
- `pick()` method: O(n) for reservoir sampling (we scan the entire array each time), O(1) for hash map approach

**Space Complexity**:

- Reservoir sampling: O(1) extra space (only stores the array reference and a few variables)
- Hash map approach: O(n) in worst case (when all elements are unique and we store indices for each)

**Trade-off**: The hash map approach has better query time (O(1) vs O(n)) but worse space complexity. The reservoir sampling approach has optimal space but slower queries. The choice depends on whether you prioritize query speed or memory usage.

## Common Mistakes

1. **Not handling the first occurrence correctly**: Some implementations forget that for the first occurrence, we should always select it (probability = 1). The condition `rand.nextInt(count) == 0` works because when `count = 1`, `rand.nextInt(1)` always returns 0.

2. **Using the wrong probability calculation**: A common error is using `rand.nextInt(count + 1) == 0` or similar, which gives probability `1/(count+1)` instead of `1/count`. Test with a small example to verify your probabilities.

3. **Forgetting to increment count before the random check**: The count must be incremented before generating the random number, as the probability depends on the current count (including the current occurrence).

4. **Assuming the array won't change**: The problem doesn't specify if the array is immutable. In a real interview, you should ask about this. If the array can change, the hash map approach needs to handle updates.

## When You'll See This Pattern

Reservoir sampling is a fundamental technique for randomly selecting items from a stream of unknown length. You'll encounter it in:

1. **Linked List Random Node (Medium)**: Exactly the same pattern but applied to a linked list instead of an array. You need to return a random node with equal probability without knowing the length in advance.

2. **Random Pick with Weight (Medium)**: A variation where items have different probabilities. Instead of reservoir sampling, you typically use prefix sums and binary search.

3. **Database query sampling**: When you need to randomly sample rows from a large database table without loading all rows into memory.

4. **Stream processing systems**: When processing data streams (like Twitter feeds or sensor data) and you need to maintain a random sample of the stream.

## Key Takeaways

1. **Reservoir sampling** is the go-to technique for selecting k items randomly from a stream of unknown length where each item should have equal probability. The special case of k=1 (selecting one item) is what we used here.

2. **Space-time trade-off** is central to this problem: The hash map approach gives O(1) queries but O(n) space, while reservoir sampling gives O(n) queries but O(1) space. Always consider both approaches and discuss the trade-offs in an interview.

3. **Probability correctness** is crucial: When implementing reservoir sampling, carefully verify that your random selection gives exactly 1/k probability for the k-th item. Test with small examples to build confidence.

Related problems: [Linked List Random Node](/problem/linked-list-random-node), [Random Pick with Blacklist](/problem/random-pick-with-blacklist), [Random Pick with Weight](/problem/random-pick-with-weight)
