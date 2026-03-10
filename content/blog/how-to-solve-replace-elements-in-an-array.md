---
title: "How to Solve Replace Elements in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Replace Elements in an Array. Medium difficulty, 59.6% acceptance rate. Topics: Array, Hash Table, Simulation."
date: "2028-08-29"
category: "dsa-patterns"
tags: ["replace-elements-in-an-array", "array", "hash-table", "simulation", "medium"]
---

# How to Solve Replace Elements in an Array

This problem asks us to efficiently replace elements in an array based on a sequence of operations. While it sounds straightforward, the challenge comes from needing to perform replacements quickly when the array values are distinct and we need to find where each old value is located. A naive approach would be too slow for large inputs, making this an excellent exercise in using hash maps for O(1) lookups.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums = [1, 3, 5, 7]
operations = [[3, 8], [5, 2], [1, 4]]
```

**Step-by-step process:**

1. **Initial state:** nums = [1, 3, 5, 7]
   - We need a way to quickly find where each value is located

2. **Operation 1:** Replace 3 with 8
   - Find position of 3: it's at index 1
   - Update nums[1] = 8
   - nums becomes [1, 8, 5, 7]
   - Update our tracking: 3 is gone, 8 is now at index 1

3. **Operation 2:** Replace 5 with 2
   - Find position of 5: it's at index 2
   - Update nums[2] = 2
   - nums becomes [1, 8, 2, 7]
   - Update tracking: 5 is gone, 2 is now at index 2

4. **Operation 3:** Replace 1 with 4
   - Find position of 1: it's at index 0
   - Update nums[0] = 4
   - nums becomes [4, 8, 2, 7]
   - Update tracking: 1 is gone, 4 is now at index 0

**Final result:** [4, 8, 2, 7]

The key insight: we need a data structure that lets us find the index of any value in O(1) time, since scanning the array for each operation would be too slow.

## Brute Force Approach

The most straightforward approach is to scan the array for each operation:

For each operation `[oldVal, newVal]`:

1. Search through the entire array to find the index where `nums[i] == oldVal`
2. Replace `nums[i]` with `newVal`

**Why this is inefficient:**

- Each search takes O(n) time where n is the array length
- With m operations, this becomes O(m × n) time complexity
- For large inputs (n, m up to 10^5), this could mean 10^10 operations, which is far too slow

**Brute force code (Python):**

```python
def replaceElements(nums, operations):
    for old_val, new_val in operations:
        # Linear search for old_val
        for i in range(len(nums)):
            if nums[i] == old_val:
                nums[i] = new_val
                break  # Found it, move to next operation
    return nums
```

This approach works correctly but fails performance tests with large inputs because of the nested loops.

## Optimized Approach

The key insight is that we need O(1) lookups to find where each value is located. Since all values in `nums` are **distinct**, we can use a hash map (dictionary) to map each value to its current index.

**Step-by-step reasoning:**

1. **Build initial mapping:** Create a dictionary where keys are the values in `nums` and values are their indices.
   - Example: For `[1, 3, 5, 7]`, we get `{1: 0, 3: 1, 5: 2, 7: 3}`

2. **Process each operation:**
   - Look up the index of `oldVal` in the dictionary: `idx = mapping[oldVal]`
   - Update the array at that index: `nums[idx] = newVal`
   - Update the dictionary:
     - Remove the old entry: `del mapping[oldVal]`
     - Add the new entry: `mapping[newVal] = idx`

3. **Why this works:**
   - Dictionary lookups are O(1) on average
   - Each operation becomes O(1) instead of O(n)
   - The dictionary always reflects the current state of the array

**Edge cases to consider:**

- Empty array or no operations
- Operations that reference values not in the array (guaranteed not to happen per problem constraints)
- Multiple operations on the same value (handled correctly since we update the mapping each time)

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums), m = len(operations)
# Space: O(n) for the value-to-index mapping
def replaceElements(nums, operations):
    """
    Replace elements in nums according to operations using O(1) lookups.

    Args:
        nums: List of distinct integers
        operations: List of [old_value, new_value] pairs

    Returns:
        Modified nums array
    """
    # Step 1: Create mapping from value to its index
    # Since all values are distinct, we can use a dictionary
    value_to_index = {}
    for i, num in enumerate(nums):
        value_to_index[num] = i

    # Step 2: Process each operation
    for old_val, new_val in operations:
        # Find the index where old_val is currently located
        idx = value_to_index[old_val]

        # Update the array at that position
        nums[idx] = new_val

        # Update the mapping:
        # 1. Remove the old value (it's no longer in the array)
        # 2. Add the new value at the same index
        del value_to_index[old_val]
        value_to_index[new_val] = idx

    return nums
```

```javascript
// Time: O(n + m) where n = nums.length, m = operations.length
// Space: O(n) for the value-to-index mapping
function replaceElements(nums, operations) {
  /**
   * Replace elements in nums according to operations using O(1) lookups.
   *
   * @param {number[]} nums - Array of distinct integers
   * @param {number[][]} operations - Array of [old_value, new_value] pairs
   * @return {number[]} Modified nums array
   */

  // Step 1: Create mapping from value to its index
  // Since all values are distinct, we can use a Map
  const valueToIndex = new Map();
  for (let i = 0; i < nums.length; i++) {
    valueToIndex.set(nums[i], i);
  }

  // Step 2: Process each operation
  for (const [oldVal, newVal] of operations) {
    // Find the index where oldVal is currently located
    const idx = valueToIndex.get(oldVal);

    // Update the array at that position
    nums[idx] = newVal;

    // Update the mapping:
    // 1. Remove the old value (it's no longer in the array)
    // 2. Add the new value at the same index
    valueToIndex.delete(oldVal);
    valueToIndex.set(newVal, idx);
  }

  return nums;
}
```

```java
// Time: O(n + m) where n = nums.length, m = operations.length
// Space: O(n) for the value-to-index mapping
class Solution {
    public int[] replaceElements(int[] nums, int[][] operations) {
        /**
         * Replace elements in nums according to operations using O(1) lookups.
         *
         * @param nums Array of distinct integers
         * @param operations Array of [old_value, new_value] pairs
         * @return Modified nums array
         */

        // Step 1: Create mapping from value to its index
        // Since all values are distinct, we can use a HashMap
        Map<Integer, Integer> valueToIndex = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            valueToIndex.put(nums[i], i);
        }

        // Step 2: Process each operation
        for (int[] op : operations) {
            int oldVal = op[0];
            int newVal = op[1];

            // Find the index where oldVal is currently located
            int idx = valueToIndex.get(oldVal);

            // Update the array at that position
            nums[idx] = newVal;

            // Update the mapping:
            // 1. Remove the old value (it's no longer in the array)
            // 2. Add the new value at the same index
            valueToIndex.remove(oldVal);
            valueToIndex.put(newVal, idx);
        }

        return nums;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the initial hash map: O(n) where n is the length of `nums`
- Processing m operations: O(m) since each operation involves O(1) dictionary operations
- Total: O(n + m), which is linear in the total input size

**Space Complexity: O(n)**

- The hash map stores one entry for each element in `nums`
- In the worst case, we store all n values in the map
- The operations array is not counted as extra space since it's part of the input

This is optimal because we must at least look at each element in `nums` and each operation once.

## Common Mistakes

1. **Using linear search for each operation:** This is the most common mistake. Candidates often implement the brute force solution without considering the performance implications. Always ask yourself: "What if n and m are both 10^5?"

2. **Forgetting to update the mapping after replacement:** Some candidates create the initial mapping but forget to update it when values change. This causes later operations to look up old indices that are no longer valid.

3. **Assuming values stay in their original positions:** The problem doesn't guarantee that operations maintain any order. After multiple replacements, a value could be anywhere in the array.

4. **Using an array instead of a hash map for the mapping:** Since values can be large and sparse, an array indexed by value would waste enormous space. A hash map uses space proportional to the number of distinct values actually present.

**How to avoid these mistakes:**

- Always consider the constraints before coding
- Test with small examples and trace through the logic
- Verify that your data structures stay consistent after each operation

## When You'll See This Pattern

This "value-to-index mapping" pattern appears in many problems where you need to efficiently find or update elements:

1. **Two Sum (Easy)** - Uses a hash map to store values and their indices for O(1) lookups when searching for complements.

2. **Find All Numbers Disappeared in an Array (Easy)** - While not identical, it uses array indices to track which values have been seen, similar to how we use indices to track positions.

3. **Insert Delete GetRandom O(1) (Medium)** - Maintains both a list and a hash map to support O(1) insert, delete, and random access. The hash map stores value-to-index mappings just like our solution.

4. **Sorting or reordering problems** - Any problem that requires tracking where elements move during operations can benefit from this pattern.

The core idea is: when you need to find elements quickly and the values are distinct, a hash map from value to position is often the right tool.

## Key Takeaways

1. **Hash maps enable O(1) lookups:** When you need to find elements by value (not just by index), a hash map is usually the most efficient approach. This transforms O(n) searches into O(1) operations.

2. **Maintain consistency between data structures:** When you have multiple representations of the same data (like an array and a hash map), ensure they stay synchronized after every modification.

3. **Read constraints carefully:** The fact that values are **distinct** is crucial here. If values could repeat, we'd need a more complex solution (like a hash map from value to set of indices).

4. **Think about operations, not just initial state:** The challenge isn't processing the initial array—it's handling a sequence of changes efficiently. Always consider how your solution scales with the number of operations.

Related problems: [Find All Numbers Disappeared in an Array](/problem/find-all-numbers-disappeared-in-an-array), [Maximum Number of Integers to Choose From a Range I](/problem/maximum-number-of-integers-to-choose-from-a-range-i), [Maximum Number of Integers to Choose From a Range II](/problem/maximum-number-of-integers-to-choose-from-a-range-ii)
