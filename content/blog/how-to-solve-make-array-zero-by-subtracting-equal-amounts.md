---
title: "How to Solve Make Array Zero by Subtracting Equal Amounts — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Make Array Zero by Subtracting Equal Amounts. Easy difficulty, 73.7% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-04-26"
category: "dsa-patterns"
tags: ["make-array-zero-by-subtracting-equal-amounts", "array", "hash-table", "greedy", "easy"]
---

# How to Solve Make Array Zero by Subtracting Equal Amounts

This problem asks us to find the minimum number of operations needed to reduce all elements in an array to zero, where each operation involves subtracting the smallest non-zero element from all positive elements. What makes this problem interesting is that it appears more complex than it actually is—the optimal solution requires recognizing a simple pattern rather than simulating the operations directly.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 5, 0, 3, 5]`.

**Step 1:** Find the smallest non-zero element: `1`

- Subtract `1` from all positive elements: `[0, 4, 0, 2, 4]`
- Operations: 1

**Step 2:** Find the smallest non-zero element: `2`

- Subtract `2` from all positive elements: `[0, 2, 0, 0, 2]`
- Operations: 2

**Step 3:** Find the smallest non-zero element: `2`

- Subtract `2` from all positive elements: `[0, 0, 0, 0, 0]`
- Operations: 3

Total operations: 3

Now let's look at what we actually subtracted: `1`, `2`, and `2`. Notice that these are just the **unique positive values** in the original array! The original array had unique positive values `[1, 3, 5]`, and we performed 3 operations.

Let's verify with another example: `nums = [0, 0, 0, 2, 2, 3, 3, 5]`

- Unique positive values: `[2, 3, 5]` → 3 operations
- Step 1: Subtract `2` → `[0, 0, 0, 0, 0, 1, 1, 3]`
- Step 2: Subtract `1` → `[0, 0, 0, 0, 0, 0, 0, 2]`
- Step 3: Subtract `2` → `[0, 0, 0, 0, 0, 0, 0, 0]`

Indeed, 3 operations. The pattern emerges: **the minimum number of operations equals the count of unique positive numbers in the array.**

## Brute Force Approach

A naive approach would be to simulate the process exactly as described:

1. While there are positive elements in the array:
   - Find the smallest positive element
   - Subtract it from all positive elements
   - Increment operation count

This approach has several problems:

- Time complexity: O(n²) in the worst case (consider `[1000, 999, 998, ..., 1]`)
- We're doing unnecessary work by actually modifying the array
- The solution becomes obvious once we recognize the pattern, making simulation wasteful

Here's what the brute force might look like:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def minimumOperations(nums):
    operations = 0

    while True:
        # Find the smallest positive element
        min_pos = float('inf')
        for num in nums:
            if num > 0 and num < min_pos:
                min_pos = num

        # If no positive elements found, we're done
        if min_pos == float('inf'):
            break

        # Subtract min_pos from all positive elements
        for i in range(len(nums)):
            if nums[i] > 0:
                nums[i] -= min_pos

        operations += 1

    return operations
```

```javascript
// Time: O(n²) | Space: O(1)
function minimumOperations(nums) {
  let operations = 0;

  while (true) {
    // Find the smallest positive element
    let minPos = Infinity;
    for (let num of nums) {
      if (num > 0 && num < minPos) {
        minPos = num;
      }
    }

    // If no positive elements found, we're done
    if (minPos === Infinity) {
      break;
    }

    // Subtract minPos from all positive elements
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > 0) {
        nums[i] -= minPos;
      }
    }

    operations++;
  }

  return operations;
}
```

```java
// Time: O(n²) | Space: O(1)
public int minimumOperations(int[] nums) {
    int operations = 0;

    while (true) {
        // Find the smallest positive element
        int minPos = Integer.MAX_VALUE;
        for (int num : nums) {
            if (num > 0 && num < minPos) {
                minPos = num;
            }
        }

        // If no positive elements found, we're done
        if (minPos == Integer.MAX_VALUE) {
            break;
        }

        // Subtract minPos from all positive elements
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] > 0) {
                nums[i] -= minPos;
            }
        }

        operations++;
    }

    return operations;
}
```

</div>

This brute force approach works but is inefficient. We can do much better by recognizing the pattern we observed in the visual walkthrough.

## Optimal Solution

The key insight is that each operation removes one or more unique values from the array. When we subtract the smallest positive value, we eliminate that value completely (it becomes 0), and reduce other values. The next smallest positive value that appears will require another operation, and so on. Therefore, the number of operations equals the number of distinct positive values in the array.

We can implement this efficiently using a set to track unique positive values:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumOperations(nums):
    # Use a set to store unique positive numbers
    unique_positives = set()

    # Iterate through each number in the array
    for num in nums:
        # Only add positive numbers to the set
        if num > 0:
            unique_positives.add(num)

    # The number of operations equals the number of unique positive values
    return len(unique_positives)
```

```javascript
// Time: O(n) | Space: O(n)
function minimumOperations(nums) {
  // Use a Set to store unique positive numbers
  const uniquePositives = new Set();

  // Iterate through each number in the array
  for (const num of nums) {
    // Only add positive numbers to the set
    if (num > 0) {
      uniquePositives.add(num);
    }
  }

  // The number of operations equals the number of unique positive values
  return uniquePositives.size;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumOperations(int[] nums) {
    // Use a HashSet to store unique positive numbers
    Set<Integer> uniquePositives = new HashSet<>();

    // Iterate through each number in the array
    for (int num : nums) {
        // Only add positive numbers to the set
        if (num > 0) {
            uniquePositives.add(num);
        }
    }

    // The number of operations equals the number of unique positive values
    return uniquePositives.size();
}
```

</div>

We can make the solution even more concise by using set comprehension (in Python) or filtering:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumOperations(nums):
    # One-liner: create a set of positive numbers and return its size
    return len({num for num in nums if num > 0})
```

```javascript
// Time: O(n) | Space: O(n)
function minimumOperations(nums) {
  // Create a Set from filtered positive numbers
  return new Set(nums.filter((num) => num > 0)).size;
}
```

```java
// Time: O(n) | Space: O(n)
public int minimumOperations(int[] nums) {
    // Use Java Streams to filter and collect to a Set
    return (int) Arrays.stream(nums)
                      .filter(num -> num > 0)
                      .distinct()
                      .count();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once to collect unique positive values
- Set operations (add/contains) are O(1) on average

**Space Complexity:** O(n)

- In the worst case, all elements are unique positive values, so we store all n elements in the set
- In the best case (all zeros), we use O(1) space

## Common Mistakes

1. **Simulating the operations directly**: This leads to O(n²) time complexity. Candidates might get stuck implementing the exact process described in the problem instead of looking for patterns.

2. **Forgetting to handle zeros**: The problem says "subtract from every positive element," so zeros should be ignored. Some candidates might incorrectly include zeros in their calculations.

3. **Using sorting unnecessarily**: While sorting would work (count unique positive values in sorted array), it's O(n log n) which is less optimal than O(n) with a hash set.

4. **Confusing "minimum number of operations" with "minimum value to subtract"**: The question asks for the _number_ of operations, not the values to subtract in each operation.

## When You'll See This Pattern

This problem teaches the important skill of **recognizing when simulation is unnecessary**. Many problems appear to require step-by-step simulation, but actually have mathematical or pattern-based solutions.

Similar problems include:

1. **Contains Duplicate (Easy)**: Also uses hash sets to track unique values, though for a different purpose (checking for duplicates rather than counting unique positives).

2. **Minimum Operations to Make the Array Increasing (Easy)**: Another problem where the optimal solution involves recognizing patterns rather than simulating operations.

3. **Assign Cookies (Easy)**: Uses sorting and greedy approach to match elements optimally without simulating every possible combination.

## Key Takeaways

1. **Look for patterns before implementing**: When a problem describes a process, try to understand what the process actually accomplishes mathematically. Often there's a simpler way to compute the result without simulating each step.

2. **Hash sets are efficient for tracking uniqueness**: When you need to track unique elements (especially with O(1) lookups), sets are usually the right tool.

3. **Read the problem carefully**: The distinction between "positive" and "non-negative" matters here. Zeros don't count toward the operation count.

Related problems: [Contains Duplicate](/problem/contains-duplicate)
