---
title: "How to Solve Sum of Unique Elements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Unique Elements. Easy difficulty, 79.8% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-04-25"
category: "dsa-patterns"
tags: ["sum-of-unique-elements", "array", "hash-table", "counting", "easy"]
---

# How to Solve Sum of Unique Elements

This problem asks us to find the sum of elements that appear exactly once in an array. While conceptually straightforward, it's an excellent introduction to frequency counting—a fundamental pattern for solving many array problems efficiently. The challenge lies in identifying which elements are unique without excessive computation.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 3, 2, 4, 1]`:

**Step 1:** Count how many times each number appears:

- 1 appears 2 times
- 2 appears 2 times
- 3 appears 1 time
- 4 appears 1 time

**Step 2:** Identify which numbers appear exactly once:

- 3 appears once ✓
- 4 appears once ✓
- 1 appears twice ✗
- 2 appears twice ✗

**Step 3:** Sum the unique elements:

- 3 + 4 = 7

The key insight is that we need to know the frequency of each element before we can determine which ones are unique. This naturally leads us to use a frequency counter (hash map) to track how many times we've seen each number.

## Brute Force Approach

A naive approach would be to check each element against every other element to see if it appears more than once:

1. For each element in the array
2. Check if it appears anywhere else in the array
3. If it doesn't appear elsewhere, add it to the sum

This approach has O(n²) time complexity because for each of n elements, we potentially scan through n-1 other elements. For an array of 1000 elements, that's about 1,000,000 operations—far too slow for practical use.

The brute force fails because it repeatedly checks the same elements against each other without remembering what we've already seen. We need a way to remember element frequencies efficiently.

## Optimal Solution

The optimal solution uses a hash map (dictionary in Python, object/Map in JavaScript, HashMap in Java) to count frequencies in O(n) time, then sums elements with frequency 1.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We iterate through nums twice: once to count, once to sum
# We store up to n unique elements in the frequency map
def sumOfUnique(nums):
    # Step 1: Create frequency counter
    # We'll count how many times each number appears
    freq = {}

    # Step 2: Count frequencies
    # For each number in nums, increment its count
    for num in nums:
        # Get current count or 0 if not seen yet, then add 1
        freq[num] = freq.get(num, 0) + 1

    # Step 3: Sum unique elements
    # Initialize sum to 0
    total = 0

    # Check each number and its frequency
    for num, count in freq.items():
        # If count is exactly 1, add to sum
        if count == 1:
            total += num

    return total
```

```javascript
// Time: O(n) | Space: O(n)
// We iterate through nums twice: once to count, once to sum
// We store up to n unique elements in the frequency map
function sumOfUnique(nums) {
  // Step 1: Create frequency counter
  // We'll count how many times each number appears
  const freq = new Map();

  // Step 2: Count frequencies
  // For each number in nums, increment its count
  for (const num of nums) {
    // Get current count or 0 if not seen yet, then add 1
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 3: Sum unique elements
  // Initialize sum to 0
  let total = 0;

  // Check each number and its frequency
  for (const [num, count] of freq) {
    // If count is exactly 1, add to sum
    if (count === 1) {
      total += num;
    }
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n)
// We iterate through nums twice: once to count, once to sum
// We store up to n unique elements in the frequency map
public int sumOfUnique(int[] nums) {
    // Step 1: Create frequency counter
    // We'll count how many times each number appears
    Map<Integer, Integer> freq = new HashMap<>();

    // Step 2: Count frequencies
    // For each number in nums, increment its count
    for (int num : nums) {
        // Get current count or 0 if not seen yet, then add 1
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Step 3: Sum unique elements
    // Initialize sum to 0
    int total = 0;

    // Check each number and its frequency
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        // If count is exactly 1, add to sum
        if (entry.getValue() == 1) {
            total += entry.getKey();
        }
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to count frequencies (O(n)), and one to sum unique elements (O(k) where k ≤ n is the number of unique elements).
- In the worst case where all elements are unique, k = n, so the second pass is also O(n).
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store a frequency map that could contain up to n entries if all elements are unique.
- In the worst case, we need O(n) space to store n key-value pairs.

## Common Mistakes

1. **Counting frequencies incorrectly**: Forgetting to handle the case when a number hasn't been seen before. Always use `getOrDefault`, `freq.get(num, 0)`, or similar methods to initialize counts properly.

2. **Confusing "unique" with "distinct"**: Unique means "appears exactly once," not "appears at least once." Some candidates sum all distinct elements instead of elements that appear only once.

3. **Inefficient data structures**: Using arrays for frequency counting when the number range is unknown or large. Hash maps handle arbitrary integer ranges efficiently, while arrays would need to know the maximum value in advance.

4. **Not handling empty arrays**: While the problem doesn't specify edge cases, always consider that an empty array should return 0. Our solution handles this correctly since the loop won't execute and total remains 0.

## When You'll See This Pattern

Frequency counting with hash maps is one of the most common patterns in coding interviews. You'll see it in:

1. **Two Sum (LeetCode #1)**: While Two Sum uses a hash map to store complements, it's the same core idea of using a hash structure for O(1) lookups to avoid O(n²) comparisons.

2. **First Unique Character in a String (LeetCode #387)**: This problem asks for the first character that appears exactly once—almost identical to finding unique elements, but with characters instead of numbers.

3. **Majority Element (LeetCode #169)**: Requires finding an element that appears more than n/2 times, which naturally uses frequency counting as one approach.

The pattern to recognize: when you need to track "how many times" something appears, or when you need O(1) lookups to avoid nested loops, reach for a hash map.

## Key Takeaways

- **Frequency counting transforms O(n²) problems into O(n)**: By remembering what we've seen, we avoid comparing every element with every other element.

- **Hash maps are the go-to for arbitrary value ranges**: When you don't know the range of values in advance, or when the range is large but sparse, hash maps provide efficient O(1) average-case operations.

- **"Unique" means frequency = 1**: In interview problems, always clarify definitions. "Unique" often means "appears exactly once," while "distinct" means "appears at least once."

[Practice this problem on CodeJeet](/problem/sum-of-unique-elements)
