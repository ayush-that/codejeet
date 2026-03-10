---
title: "How to Solve Two Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Two Sum. Easy difficulty, 57.1% acceptance rate. Topics: Array, Hash Table."
date: "2026-02-01"
category: "dsa-patterns"
tags: ["two-sum", "array", "hash-table", "easy"]
---

# How to Solve Two Sum

Two Sum is often the first problem candidates encounter in coding interviews. While simple in concept—find two numbers that add to a target—it introduces a critical pattern: using a hash map to trade space for time. The challenge isn't just solving it, but solving it efficiently and explaining your reasoning clearly.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Suppose we have `nums = [2, 7, 11, 15]` and `target = 9`.

**Step 1:** Start with the first number, 2. We need to find if `9 - 2 = 7` exists in the array. We haven't seen 7 yet, so we store 2 in our hash map with its index (0).

**Step 2:** Move to the second number, 7. We calculate `9 - 7 = 2`. Check our hash map—2 is present at index 0! This means we've found our pair: indices 0 and 1.

The key insight is that instead of checking every other number for each number (which would be O(n²)), we can remember what we've seen so far and check if the complement (target - current number) exists in our memory. This reduces the problem to a single pass through the array.

## Brute Force Approach

The most straightforward solution is to check every possible pair of numbers. For each element at index `i`, check every element at index `j` where `j > i` to see if they sum to the target.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def twoSum(nums, target):
    n = len(nums)
    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []  # According to problem, we'll never reach here
```

```javascript
// Time: O(n²) | Space: O(1)
function twoSum(nums, target) {
  const n = nums.length;
  // Check every possible pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return []; // According to problem, we'll never reach here
}
```

```java
// Time: O(n²) | Space: O(1)
public int[] twoSum(int[] nums, int target) {
    int n = nums.length;
    // Check every possible pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[]{}; // According to problem, we'll never reach here
}
```

</div>

**Why this isn't optimal:** With nested loops, we're doing approximately n²/2 comparisons. For an array of 10,000 elements, that's about 50 million operations—far too slow for most interview constraints. We need to reduce this to O(n).

## Optimal Solution

The optimal approach uses a hash map (dictionary in Python, object/Map in JavaScript, HashMap in Java) to store numbers we've seen along with their indices. For each number, we calculate its complement (target - current number) and check if we've already seen it.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def twoSum(nums, target):
    # Dictionary to store numbers we've seen: {number: index}
    seen = {}

    # Iterate through the array with both index and value
    for i, num in enumerate(nums):
        # Calculate what number we need to reach the target
        complement = target - num

        # Check if we've already seen the complement
        if complement in seen:
            # Found the pair! Return both indices
            return [seen[complement], i]

        # Store current number with its index for future checks
        seen[num] = i

    # According to problem constraints, we'll never reach here
    return []
```

```javascript
// Time: O(n) | Space: O(n)
function twoSum(nums, target) {
  // Map to store numbers we've seen: {number: index}
  const seen = new Map();

  // Iterate through the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    // Calculate what number we need to reach the target
    const complement = target - num;

    // Check if we've already seen the complement
    if (seen.has(complement)) {
      // Found the pair! Return both indices
      return [seen.get(complement), i];
    }

    // Store current number with its index for future checks
    seen.set(num, i);
  }

  // According to problem constraints, we'll never reach here
  return [];
}
```

```java
// Time: O(n) | Space: O(n)
public int[] twoSum(int[] nums, int target) {
    // HashMap to store numbers we've seen: {number: index}
    Map<Integer, Integer> seen = new HashMap<>();

    // Iterate through the array
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];
        // Calculate what number we need to reach the target
        int complement = target - num;

        // Check if we've already seen the complement
        if (seen.containsKey(complement)) {
            // Found the pair! Return both indices
            return new int[]{seen.get(complement), i};
        }

        // Store current number with its index for future checks
        seen.put(num, i);
    }

    // According to problem constraints, we'll never reach here
    return new int[]{};
}
```

</div>

**Why this works:** By storing each number as we encounter it, we can check in O(1) time whether its complement exists. This transforms an O(n²) problem into an O(n) solution.

## Complexity Analysis

**Time Complexity: O(n)**  
We iterate through the array exactly once. For each element, we perform two constant-time operations: checking if the complement exists in the hash map and adding the current element to the hash map. Hash map operations (insert and lookup) are O(1) on average.

**Space Complexity: O(n)**  
In the worst case, we might store almost every element in the hash map before finding the pair (if the solution is near the end of the array). The hash map stores up to n-1 elements, giving us O(n) space usage.

## Common Mistakes

1. **Returning the numbers instead of indices:** The problem asks for indices, not the actual numbers. Candidates sometimes return `[2, 7]` instead of `[0, 1]` for our example. Always double-check what the problem is asking for.

2. **Using the same element twice:** If the array is `[3, 2, 4]` with target 6, a naive implementation might return `[0, 0]` (using 3 twice). Our solution avoids this because we check for the complement _before_ adding the current element to the hash map. The complement must have been seen in a _previous_ iteration.

3. **Assuming the array is sorted:** The problem doesn't state the array is sorted, so don't assume it is. If you try to use a two-pointer approach (like in Two Sum II), it won't work unless you sort first—which would change the indices.

4. **Forgetting to handle duplicate values:** If the array contains duplicates like `[3, 3]` with target 6, our hash map approach correctly handles this because we only check for complements before adding the current element. The second 3 will find the first 3 in the hash map.

## When You'll See This Pattern

The "complement + hash map" pattern appears in many variations:

1. **Two Sum II - Input Array Is Sorted:** While this version can be solved with two pointers (O(1) space), the hash map approach still works. The pattern recognition is that you're still looking for two elements with a specific relationship.

2. **3Sum and 4Sum:** These problems extend the Two Sum concept. For 3Sum, you fix one element and then solve a Two Sum problem on the remaining elements. The core Two Sum logic becomes a building block for more complex problems.

3. **Subarray Sum Equals K:** While not exactly the same, this problem uses a similar "prefix sum + hash map" approach where you track cumulative sums and look for complements.

4. **Pairs with Specific Differences:** Variations where you need to find pairs with a specific difference (target = num1 - num2) use the same pattern—just adjust the complement calculation.

## Key Takeaways

1. **Trade space for time:** When you need to optimize a nested loop O(n²) solution, consider whether storing intermediate results in a hash map can reduce it to O(n). This is one of the most common optimization patterns in coding interviews.

2. **Look for complement relationships:** Any problem asking for two elements with a specific mathematical relationship (sum, difference, product, etc.) might be solvable with this pattern. The key is to determine what to store in the hash map and what to look up.

3. **Order matters for indices:** When the problem requires indices (not just values), you often need to process the array in order and store indices along with values. This prevents losing the original positions if you were to sort the array.

The Two Sum problem is foundational—mastering it means you've learned one of the most important patterns in algorithm design. Practice recognizing when to apply this "complement + hash map" approach, and you'll be well-prepared for many interview problems.

Related problems: [3Sum](/problem/3sum), [4Sum](/problem/4sum), [Two Sum II - Input Array Is Sorted](/problem/two-sum-ii-input-array-is-sorted)
