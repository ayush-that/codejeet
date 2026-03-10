---
title: "How to Solve N-Repeated Element in Size 2N Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode N-Repeated Element in Size 2N Array. Easy difficulty, 79.8% acceptance rate. Topics: Array, Hash Table."
date: "2027-06-02"
category: "dsa-patterns"
tags: ["n-repeated-element-in-size-2n-array", "array", "hash-table", "easy"]
---

# How to Solve N-Repeated Element in Size 2N Array

You're given an array of size 2N where there are N+1 unique values. N of these values appear exactly once, and one value appears exactly N times. Your task is to find that repeated element. What makes this problem interesting is that the constraints give us multiple ways to solve it efficiently, but also some subtle traps if we don't read the problem carefully.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 3, 3]` where `n = 2` (since array length is 4 = 2 × 2).

**Step-by-step reasoning:**

- The array has 4 elements (2N where N=2)
- There are 3 unique values (N+1 = 3): 1, 2, and 3
- Two values appear exactly once: 1 and 2
- One value appears N=2 times: 3

If we look at the distribution:

- Value 1: appears 1 time
- Value 2: appears 1 time
- Value 3: appears 2 times

The element repeated N times is 3. Notice that because the repeated element appears N times in an array of size 2N, it occupies exactly half the array! This means if we check any two consecutive elements in a sorted version of the array, there's a high probability they'll be the repeated element.

## Brute Force Approach

The most straightforward approach would be to count occurrences of each element until we find one that appears N times:

1. For each element in the array
2. Count how many times it appears by scanning the entire array
3. If count equals N, return that element

This approach has O(n²) time complexity because for each of the 2N elements, we scan all 2N elements. For an array of size 1000, that's 1,000,000 operations - far too slow.

Even a slightly better brute force would be to sort the array first (O(n log n)), then scan to find the element that appears N times consecutively. While this is acceptable for many cases, we can do better with O(n) time and minimal space.

## Optimal Solution

The key insight is that the repeated element appears N times in an array of size 2N. This means it occupies exactly half the positions! With this knowledge, we have several efficient approaches:

**Approach 1: Hash Table/Set (Most Intuitive)**
Since we're looking for a duplicate, we can use a set to track seen elements. The first element we encounter that's already in the set must be our answer (because all other elements appear exactly once).

**Approach 2: Mathematical (If We Knew the Sum)**
If we knew the sum of all unique elements, we could calculate: `repeated_element = (sum(nums) - sum(unique_elements)) / (N-1)`. But finding unique elements requires extra work.

**Approach 3: Neighbor Check (Clever Optimization)**
Because the repeated element appears so frequently (half the array), if we check elements at distance 1, 2, or 3 apart, we're guaranteed to find two equal elements. This gives us O(1) space!

Let's implement the most robust solutions:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) - Hash Set approach
def repeatedNTimes(nums):
    """
    Find the element that appears N times in a 2N-sized array.
    Uses a hash set to track seen elements - the first duplicate we find
    must be our answer since all other elements appear exactly once.
    """
    seen = set()

    for num in nums:
        # If we've seen this number before, it must be our answer
        if num in seen:
            return num
        # Otherwise, add it to our set of seen numbers
        seen.add(num)

    # According to problem constraints, we should always find a duplicate
    # This return is just for safety
    return -1

# Time: O(n) | Space: O(1) - Neighbor check approach (optimal space)
def repeatedNTimes_optimal_space(nums):
    """
    Find the element that appears N times using constant space.
    Since the repeated element occupies half the array, checking
    elements at distances 1, 2, or 3 apart guarantees we'll find it.
    """
    n = len(nums)

    # Check adjacent elements (distance 1)
    for i in range(n - 1):
        if nums[i] == nums[i + 1]:
            return nums[i]

    # Check elements at distance 2
    for i in range(n - 2):
        if nums[i] == nums[i + 2]:
            return nums[i]

    # Check elements at distance 3
    for i in range(n - 3):
        if nums[i] == nums[i + 3]:
            return nums[i]

    # For the last possible case where repeated element is at ends
    # Example: [1, 2, 3, 1] where 1 is repeated
    return nums[0] if nums[0] == nums[-1] else nums[-1]
```

```javascript
// Time: O(n) | Space: O(n) - Hash Set approach
function repeatedNTimes(nums) {
  /**
   * Find the element that appears N times in a 2N-sized array.
   * Uses a Set to track seen elements - the first duplicate we find
   * must be our answer since all other elements appear exactly once.
   */
  const seen = new Set();

  for (const num of nums) {
    // If we've seen this number before, it must be our answer
    if (seen.has(num)) {
      return num;
    }
    // Otherwise, add it to our set of seen numbers
    seen.add(num);
  }

  // According to problem constraints, we should always find a duplicate
  // This return is just for safety
  return -1;
}

// Time: O(n) | Space: O(1) - Neighbor check approach (optimal space)
function repeatedNTimesOptimalSpace(nums) {
  /**
   * Find the element that appears N times using constant space.
   * Since the repeated element occupies half the array, checking
   * elements at distances 1, 2, or 3 apart guarantees we'll find it.
   */
  const n = nums.length;

  // Check adjacent elements (distance 1)
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      return nums[i];
    }
  }

  // Check elements at distance 2
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] === nums[i + 2]) {
      return nums[i];
    }
  }

  // Check elements at distance 3
  for (let i = 0; i < n - 3; i++) {
    if (nums[i] === nums[i + 3]) {
      return nums[i];
    }
  }

  // For the last possible case where repeated element is at ends
  // Example: [1, 2, 3, 1] where 1 is repeated
  return nums[0] === nums[n - 1] ? nums[0] : nums[n - 1];
}
```

```java
// Time: O(n) | Space: O(n) - Hash Set approach
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int repeatedNTimes(int[] nums) {
        /**
         * Find the element that appears N times in a 2N-sized array.
         * Uses a HashSet to track seen elements - the first duplicate we find
         * must be our answer since all other elements appear exactly once.
         */
        Set<Integer> seen = new HashSet<>();

        for (int num : nums) {
            // If we've seen this number before, it must be our answer
            if (seen.contains(num)) {
                return num;
            }
            // Otherwise, add it to our set of seen numbers
            seen.add(num);
        }

        // According to problem constraints, we should always find a duplicate
        // This return is just for safety
        return -1;
    }
}

// Time: O(n) | Space: O(1) - Neighbor check approach (optimal space)
class SolutionOptimalSpace {
    public int repeatedNTimes(int[] nums) {
        /**
         * Find the element that appears N times using constant space.
         * Since the repeated element occupies half the array, checking
         * elements at distances 1, 2, or 3 apart guarantees we'll find it.
         */
        int n = nums.length;

        // Check adjacent elements (distance 1)
        for (int i = 0; i < n - 1; i++) {
            if (nums[i] == nums[i + 1]) {
                return nums[i];
            }
        }

        // Check elements at distance 2
        for (int i = 0; i < n - 2; i++) {
            if (nums[i] == nums[i + 2]) {
                return nums[i];
            }
        }

        // Check elements at distance 3
        for (int i = 0; i < n - 3; i++) {
            if (nums[i] == nums[i + 3]) {
                return nums[i];
            }
        }

        // For the last possible case where repeated element is at ends
        // Example: [1, 2, 3, 1] where 1 is repeated
        return nums[0] == nums[n - 1] ? nums[0] : nums[n - 1];
    }
}
```

</div>

## Complexity Analysis

**Hash Set Approach:**

- **Time Complexity:** O(n) where n is the length of the array (2N). We iterate through the array once, and set operations (add and contains) are O(1) on average.
- **Space Complexity:** O(n) in the worst case where we store almost all elements before finding the duplicate. In practice, we'll find the duplicate quickly, so average space is O(1), but worst-case is O(n).

**Neighbor Check Approach:**

- **Time Complexity:** O(n) where n is the length of the array. In the worst case, we check all three distances, which is 3n comparisons = O(n).
- **Space Complexity:** O(1) since we only use a few variables for indices and comparisons.

**Why the neighbor check works:** In an array of size 2N where one element appears N times, that element must appear at least twice within any window of 4 consecutive elements (pigeonhole principle). Therefore, checking distances 1, 2, and 3 will always find it.

## Common Mistakes

1. **Forgetting the problem constraints:** Some candidates try to find the element that appears "more than once" rather than exactly N times. While the first duplicate found will indeed be the element that appears N times (due to the constraints), it's important to understand why this works.

2. **Off-by-one errors in neighbor check:** When implementing the constant-space solution, it's easy to write `i < n` instead of `i < n - 1` (for distance 1 check), which would cause an `IndexOutOfBounds` exception when accessing `nums[i + 1]`.

3. **Overcomplicating with sorting:** While sorting works (O(n log n) time), it's not optimal. Some candidates sort then look for the longest consecutive run, but this misses the point that we can solve in O(n) time.

4. **Not handling edge cases in neighbor check:** The pattern [x, a, b, x] where x is the repeated element at positions 0 and 3 requires checking distance 3. Some implementations only check distances 1 and 2 and fail on this case.

## When You'll See This Pattern

This problem teaches the **"frequent element detection"** pattern, which appears in many forms:

1. **Majority Element (LeetCode 169):** Find the element that appears more than n/2 times. The Boyer-Moore Voting Algorithm used there is similar in spirit to our neighbor check approach.

2. **Find the Duplicate Number (LeetCode 287):** Given an array of n+1 integers where each integer is between 1 and n, find the duplicate. This uses Floyd's Tortoise and Hare algorithm, another pattern for duplicate detection.

3. **Single Number (LeetCode 136):** Find the element that appears exactly once while all others appear twice. The XOR solution for that problem is another clever bit manipulation approach to frequency problems.

The key insight across these problems is that **constraints on element frequencies allow for optimized solutions beyond simple counting**.

## Key Takeaways

1. **Constraints are clues:** The specific constraints (2N size, N+1 unique elements, one element appears N times) aren't arbitrary - they enable optimized solutions. Always look for what the constraints allow you to assume.

2. **Frequency problems often have multiple approaches:** You can usually solve with hashing (general but uses extra space), sorting (simpler but O(n log n)), or mathematical/clever approaches (optimal but problem-specific).

3. **The pigeonhole principle is powerful:** When one element occupies half the array, it must appear close to itself. This kind of reasoning (about distributions and spacing) helps solve many array problems.

4. **Interview strategy:** Start with the simplest working solution (hash set), then optimize if asked. Explain why the optimization works based on the constraints.

[Practice this problem on CodeJeet](/problem/n-repeated-element-in-size-2n-array)
