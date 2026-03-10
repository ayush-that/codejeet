---
title: "How to Solve Minimum Swaps to Sort by Digit Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Swaps to Sort by Digit Sum. Medium difficulty, 50.4% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2029-07-29"
category: "dsa-patterns"
tags: ["minimum-swaps-to-sort-by-digit-sum", "array", "hash-table", "sorting", "medium"]
---

## How to Solve Minimum Swaps to Sort by Digit Sum

You're given an array of distinct positive integers that needs to be sorted by digit sum, with ties broken by the original number's value. The challenge is to find the minimum number of swaps needed to achieve this sorted arrangement. What makes this problem interesting is that we're not just counting inversions in the original array—we need to transform the array into a specific target order based on digit sums, then calculate the swaps needed to get there.

## Visual Walkthrough

Let's trace through `nums = [23, 17, 45, 36]`:

**Step 1: Calculate digit sums**

- 23 → 2 + 3 = 5
- 17 → 1 + 7 = 8
- 45 → 4 + 5 = 9
- 36 → 3 + 6 = 9

**Step 2: Determine target sorted order**
We sort by digit sum first, then by the number itself if sums are equal:

- 23 (sum 5) comes first
- 17 (sum 8) comes next
- Now we have two numbers with sum 9: 36 and 45. Since 36 < 45, 36 comes before 45.
  Target order: `[23, 17, 36, 45]`

**Step 3: Map current positions to target positions**
Current array: `[23, 17, 45, 36]`
Target array: `[23, 17, 36, 45]`
We need to swap 45 and 36 to match the target.

**Step 4: Count swaps using cycle detection**
Think of this as a graph problem: each element needs to move to its correct position. We have a cycle:

- Position 0 has 23, which should be at position 0 ✓ (self-loop)
- Position 1 has 17, which should be at position 1 ✓ (self-loop)
- Position 2 has 45, which should be at position 3
- Position 3 has 36, which should be at position 2

This forms one cycle of length 2. Minimum swaps = (cycle length - 1) = 1 swap.

## Brute Force Approach

A naive approach would be to actually perform swaps to sort the array while counting them. You could:

1. Calculate digit sums for all numbers
2. Create the target sorted array
3. For each position, find where the correct element is in the current array and swap it to the current position

The problem with this approach is it requires O(n²) time in the worst case. For each of n positions, you might need to scan through n elements to find the correct one. With n up to 10⁵ (typical for medium problems), this would be far too slow.

```python
# Brute force - too slow for large inputs
def minSwapsBrute(nums):
    # Calculate digit sums
    def digit_sum(x):
        return sum(int(d) for d in str(x))

    # Create target sorted array
    target = sorted(nums, key=lambda x: (digit_sum(x), x))

    swaps = 0
    arr = nums[:]  # Work on a copy

    for i in range(len(arr)):
        # If current element is not in correct position
        if arr[i] != target[i]:
            # Find where target[i] is in current array
            for j in range(i + 1, len(arr)):
                if arr[j] == target[i]:
                    # Swap it to position i
                    arr[i], arr[j] = arr[j], arr[i]
                    swaps += 1
                    break

    return swaps
```

## Optimized Approach

The key insight is recognizing this as a **minimum swaps to sort** problem. When you know exactly where each element should end up, the minimum number of swaps equals the total number of elements minus the number of cycles in the permutation graph.

Here's the step-by-step reasoning:

1. **Calculate digit sums** for each number
2. **Create target order** by sorting numbers based on (digit_sum, number)
3. **Map each number to its target position** using a hash table
4. **Build the permutation graph**: For index i, what position should the element at i move to?
5. **Detect cycles** in this permutation
6. **Calculate swaps**: For each cycle of length k, we need k-1 swaps. Sum these across all cycles.

Why does this work? Each swap can fix at most two elements' positions. In a cycle of k elements, the optimal strategy is to make k-1 swaps by fixing one element at a time. This is a well-known result in permutation group theory.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minSwaps(nums):
    """
    Calculate minimum swaps to sort array by digit sum,
    with ties broken by the number itself.
    """

    # Helper function to calculate digit sum
    def digit_sum(num):
        total = 0
        while num > 0:
            total += num % 10  # Add last digit
            num //= 10         # Remove last digit
        return total

    # Step 1: Create target sorted array
    # Sort by (digit_sum, number) to handle ties correctly
    target = sorted(nums, key=lambda x: (digit_sum(x), x))

    # Step 2: Map each number to its target position
    # Using dictionary for O(1) lookups
    position_map = {}
    for i, num in enumerate(target):
        position_map[num] = i

    # Step 3: Track visited elements to find cycles
    visited = [False] * len(nums)
    swaps = 0

    # Step 4: Process each position
    for i in range(len(nums)):
        # Skip if already visited or already in correct position
        if visited[i] or position_map[nums[i]] == i:
            visited[i] = True
            continue

        # Step 5: Follow the cycle starting at position i
        cycle_length = 0
        j = i

        # Traverse the entire cycle
        while not visited[j]:
            visited[j] = True
            # Move to the position where current element should go
            j = position_map[nums[j]]
            cycle_length += 1

        # Step 6: Add swaps needed for this cycle
        # For a cycle of length k, we need k-1 swaps
        if cycle_length > 0:
            swaps += (cycle_length - 1)

    return swaps
```

```javascript
// Time: O(n log n) | Space: O(n)
function minSwaps(nums) {
  // Helper function to calculate digit sum
  const digitSum = (num) => {
    let sum = 0;
    while (num > 0) {
      sum += num % 10; // Add last digit
      num = Math.floor(num / 10); // Remove last digit
    }
    return sum;
  };

  // Step 1: Create target sorted array
  // Sort by digit sum first, then by number for ties
  const target = [...nums].sort((a, b) => {
    const sumA = digitSum(a);
    const sumB = digitSum(b);
    if (sumA !== sumB) {
      return sumA - sumB;
    }
    return a - b; // Tie-breaker: smaller number first
  });

  // Step 2: Map each number to its target position
  const positionMap = new Map();
  for (let i = 0; i < target.length; i++) {
    positionMap.set(target[i], i);
  }

  // Step 3: Track visited elements
  const visited = new Array(nums.length).fill(false);
  let swaps = 0;

  // Step 4: Process each position
  for (let i = 0; i < nums.length; i++) {
    // Skip if already visited or in correct position
    if (visited[i] || positionMap.get(nums[i]) === i) {
      visited[i] = true;
      continue;
    }

    // Step 5: Follow the cycle starting at i
    let cycleLength = 0;
    let j = i;

    while (!visited[j]) {
      visited[j] = true;
      // Move to where current element should be
      j = positionMap.get(nums[j]);
      cycleLength++;
    }

    // Step 6: Add swaps for this cycle
    // Cycle of length k needs k-1 swaps
    if (cycleLength > 0) {
      swaps += cycleLength - 1;
    }
  }

  return swaps;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int minSwaps(int[] nums) {
        // Helper function to calculate digit sum
        int digitSum(int num) {
            int sum = 0;
            while (num > 0) {
                sum += num % 10;  // Add last digit
                num /= 10;        // Remove last digit
            }
            return sum;
        }

        // Step 1: Create target sorted array
        // Convert to Integer array for custom sorting
        Integer[] target = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) {
            target[i] = nums[i];
        }

        // Sort by digit sum, then by number for ties
        Arrays.sort(target, (a, b) -> {
            int sumA = digitSum(a);
            int sumB = digitSum(b);
            if (sumA != sumB) {
                return sumA - sumB;
            }
            return a - b;  // Tie-breaker
        });

        // Step 2: Map each number to its target position
        Map<Integer, Integer> positionMap = new HashMap<>();
        for (int i = 0; i < target.length; i++) {
            positionMap.put(target[i], i);
        }

        // Step 3: Track visited elements
        boolean[] visited = new boolean[nums.length];
        int swaps = 0;

        // Step 4: Process each position
        for (int i = 0; i < nums.length; i++) {
            // Skip if already visited or in correct position
            if (visited[i] || positionMap.get(nums[i]) == i) {
                visited[i] = true;
                continue;
            }

            // Step 5: Follow the cycle starting at i
            int cycleLength = 0;
            int j = i;

            while (!visited[j]) {
                visited[j] = true;
                // Move to where current element should be
                j = positionMap.get(nums[j]);
                cycleLength++;
            }

            // Step 6: Add swaps for this cycle
            // Cycle of length k needs k-1 swaps
            if (cycleLength > 0) {
                swaps += (cycleLength - 1);
            }
        }

        return swaps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating digit sums: O(n × d) where d is max digits (but d ≤ 10 for 32-bit ints, so effectively O(n))
- Sorting to create target array: O(n log n) dominates
- Building position map: O(n)
- Cycle detection: O(n) since each element is visited once
- Overall: O(n log n) due to sorting

**Space Complexity: O(n)**

- Target array: O(n)
- Position map: O(n)
- Visited array: O(n)
- Total: O(n) auxiliary space

## Common Mistakes

1. **Forgetting to handle tie-breakers correctly**: When two numbers have the same digit sum, the smaller number should come first. Missing this leads to incorrect target ordering.

2. **Using string conversion for digit sum in a loop**: While `sum(int(d) for d in str(num))` works, it's slower than mathematical extraction. For large inputs, this can matter.

3. **Incorrect cycle swap calculation**: Some candidates think a cycle of length k needs k swaps instead of k-1. Remember: a 2-element cycle needs 1 swap, a 3-element cycle needs 2 swaps, etc.

4. **Not using a position map**: Trying to find target positions by scanning the target array for each element results in O(n²) time. The hash map is essential for O(1) lookups.

## When You'll See This Pattern

This "minimum swaps to sort" pattern appears in several permutation-related problems:

1. **Minimum Swaps to Make Arrays Identical** (LeetCode 801) - Similar cycle detection approach for aligning two arrays.

2. **Minimum Number of Operations to Make Array Continuous** (LeetCode 2009) - Involves finding optimal positioning through swapping-like operations.

3. **Minimum Swaps to Group All 1's Together** (LeetCode 1151) - Different constraint but uses similar sliding window + counting techniques.

The core technique of mapping elements to target positions and counting cycles in the permutation graph is reusable whenever you need to minimize swaps to achieve a specific ordering.

## Key Takeaways

1. **Minimum swaps to achieve a target order = sum of (cycle_length - 1) for all cycles** in the permutation from current to target positions.

2. **Always use a hash map** to store target positions for O(1) lookups when you need to know where each element should end up.

3. **Break complex sorting criteria into key functions** - here we used (digit_sum, number) as a composite key. This pattern works for any multi-criteria sorting.

Remember: When the problem asks for "minimum swaps" and you know exactly where each element should go, think cycle detection in permutations.

[Practice this problem on CodeJeet](/problem/minimum-swaps-to-sort-by-digit-sum)
