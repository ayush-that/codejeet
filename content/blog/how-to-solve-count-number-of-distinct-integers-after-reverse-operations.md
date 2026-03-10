---
title: "How to Solve Count Number of Distinct Integers After Reverse Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Distinct Integers After Reverse Operations. Medium difficulty, 81.3% acceptance rate. Topics: Array, Hash Table, Math, Counting."
date: "2027-06-27"
category: "dsa-patterns"
tags:
  [
    "count-number-of-distinct-integers-after-reverse-operations",
    "array",
    "hash-table",
    "math",
    "medium",
  ]
---

# How to Solve Count Number of Distinct Integers After Reverse Operations

This problem asks us to take each integer in an array, reverse its digits, and append the reversed number to the array. After processing all original numbers, we need to count how many distinct integers exist in the final array. What makes this problem interesting is that while the operation seems straightforward, the key insight is recognizing that we don't actually need to build the final array—we just need to track which numbers we've seen.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 13, 10, 12, 31]`

**Step 1:** Start with the original array: `[1, 13, 10, 12, 31]`

**Step 2:** Process each original number:

- `1` → reversed is `1` → add to end: array becomes `[1, 13, 10, 12, 31, 1]`
- `13` → reversed is `31` → add to end: array becomes `[1, 13, 10, 12, 31, 1, 31]`
- `10` → reversed is `1` (leading zeros are dropped) → add to end: array becomes `[1, 13, 10, 12, 31, 1, 31, 1]`
- `12` → reversed is `21` → add to end: array becomes `[1, 13, 10, 12, 31, 1, 31, 1, 21]`
- `31` → reversed is `13` → add to end: array becomes `[1, 13, 10, 12, 31, 1, 31, 1, 21, 13]`

**Step 3:** Count distinct integers in final array: `{1, 13, 10, 12, 31, 21}` → 6 distinct numbers

Notice that we only need to process the original numbers (positions 0-4 in the starting array), not the newly added ones. Also, we don't actually need to build the full array—we just need to track which numbers we've seen.

## Brute Force Approach

A naive approach would be to literally follow the problem description:

1. Create a copy of the original array
2. For each number in the original array (not including newly added ones):
   - Reverse its digits
   - Append the reversed number to the array
3. Use a set to collect all numbers in the final array
4. Return the size of the set

While this approach works logically, it's inefficient because:

- We're building an array that grows as we process it
- We need to be careful about only processing original numbers
- The reversal operation might be done multiple times on the same number if we're not careful

The main issue isn't time complexity (which would still be O(n) for reasonable inputs), but rather that it's more complex than necessary and could lead to implementation errors.

## Optimized Approach

The key insight is that we don't need to actually build the final array. We only need to know which numbers exist in it. Since we're adding the reverse of each original number, we can:

1. Start with a set containing all original numbers
2. For each original number, compute its reverse and add it to the same set
3. The set will automatically handle duplicates
4. Return the size of the set

This approach is optimal because:

- We process each original number exactly once
- The set ensures we only count distinct values
- We avoid building unnecessary data structures
- The reversal operation is straightforward

The reversal can be done mathematically without converting to strings:

- While the number > 0:
  - Get the last digit: `digit = num % 10`
  - Build the reversed number: `reversed = reversed * 10 + digit`
  - Remove the last digit: `num = num // 10`
- This approach automatically handles leading zeros (they disappear)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = average number of digits
# Space: O(n) for the set storing distinct numbers
def countDistinctIntegers(nums):
    """
    Count distinct integers after adding the reverse of each number.

    Approach:
    1. Use a set to track all numbers we've seen
    2. Add all original numbers to the set
    3. For each original number, compute its reverse and add to set
    4. Return the size of the set
    """
    # Step 1: Initialize a set with all original numbers
    # This handles duplicates in the original array
    distinct_nums = set(nums)

    # Step 2: Process each original number
    for num in nums:
        # Compute the reverse using mathematical operations
        reversed_num = 0
        temp = num

        # Extract digits one by one from the end
        while temp > 0:
            # Get the last digit
            digit = temp % 10
            # Add it to the reversed number
            reversed_num = reversed_num * 10 + digit
            # Remove the last digit
            temp //= 10

        # Step 3: Add the reversed number to our set
        # The set will ignore it if already present
        distinct_nums.add(reversed_num)

    # Step 4: Return the count of distinct numbers
    return len(distinct_nums)
```

```javascript
// Time: O(n * d) where n = nums.length, d = average number of digits
// Space: O(n) for the set storing distinct numbers
function countDistinctIntegers(nums) {
  /**
   * Count distinct integers after adding the reverse of each number.
   *
   * Approach:
   * 1. Use a Set to track all numbers we've seen
   * 2. Add all original numbers to the Set
   * 3. For each original number, compute its reverse and add to Set
   * 4. Return the size of the Set
   */

  // Step 1: Initialize a Set with all original numbers
  // This handles duplicates in the original array
  const distinctNums = new Set(nums);

  // Step 2: Process each original number
  for (let num of nums) {
    // Compute the reverse using mathematical operations
    let reversedNum = 0;
    let temp = num;

    // Extract digits one by one from the end
    while (temp > 0) {
      // Get the last digit
      const digit = temp % 10;
      // Add it to the reversed number
      reversedNum = reversedNum * 10 + digit;
      // Remove the last digit
      temp = Math.floor(temp / 10);
    }

    // Step 3: Add the reversed number to our Set
    // The Set will ignore it if already present
    distinctNums.add(reversedNum);
  }

  // Step 4: Return the count of distinct numbers
  return distinctNums.size;
}
```

```java
// Time: O(n * d) where n = nums.length, d = average number of digits
// Space: O(n) for the set storing distinct numbers
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int countDistinctIntegers(int[] nums) {
        /**
         * Count distinct integers after adding the reverse of each number.
         *
         * Approach:
         * 1. Use a HashSet to track all numbers we've seen
         * 2. Add all original numbers to the HashSet
         * 3. For each original number, compute its reverse and add to HashSet
         * 4. Return the size of the HashSet
         */

        // Step 1: Initialize a HashSet with all original numbers
        // This handles duplicates in the original array
        Set<Integer> distinctNums = new HashSet<>();
        for (int num : nums) {
            distinctNums.add(num);
        }

        // Step 2: Process each original number
        for (int num : nums) {
            // Compute the reverse using mathematical operations
            int reversedNum = 0;
            int temp = num;

            // Extract digits one by one from the end
            while (temp > 0) {
                // Get the last digit
                int digit = temp % 10;
                // Add it to the reversed number
                reversedNum = reversedNum * 10 + digit;
                // Remove the last digit
                temp /= 10;
            }

            // Step 3: Add the reversed number to our HashSet
            // The HashSet will ignore it if already present
            distinctNums.add(reversedNum);
        }

        // Step 4: Return the count of distinct numbers
        return distinctNums.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d)

- `n` is the number of elements in the input array
- `d` is the average number of digits in each number
- We process each of the `n` original numbers once
- For each number, we reverse its digits, which takes O(d) time
- In practice, since integers have at most 10 digits (for 32-bit integers), this is effectively O(n)

**Space Complexity:** O(n)

- We use a set to store distinct numbers
- In the worst case, all original numbers and their reverses are distinct, giving us 2n elements
- This simplifies to O(n) space

## Common Mistakes

1. **Processing newly added numbers**: The biggest mistake is to process numbers as they're added to the array. Remember: you only process the original numbers. If you use a for-loop that goes through the growing array, you'll get an infinite loop or incorrect results.

2. **Not handling leading zeros correctly**: When reversing 10, you should get 1, not 01 or 10. The mathematical approach (using modulo and division) automatically handles this because leading zeros don't exist in integer representation.

3. **Forgetting about duplicates in the original array**: The original array might contain duplicates. Using a set from the beginning handles this automatically. If you try to count without a set first, you might overcount.

4. **Using string reversal unnecessarily**: While converting to string, reversing, and converting back works, it's less efficient than the mathematical approach and requires handling leading zeros explicitly.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Set for tracking uniqueness**: Problems where you need to count or track distinct elements often use sets. Similar problems: "Contains Duplicate" (LeetCode 217), "Intersection of Two Arrays" (LeetCode 349).

2. **Digit manipulation**: The reversal operation is a classic digit manipulation problem. Similar problems: "Reverse Integer" (LeetCode 7), "Palindrome Number" (LeetCode 9).

3. **Operation on original elements only**: Problems where you apply an operation to original elements but not newly created ones. This pattern appears in problems like "Apply Operations to an Array" (LeetCode 2460).

## Key Takeaways

1. **When asked about distinct elements, think "set" immediately**: Sets automatically handle duplicates and provide O(1) lookups/insertions.

2. **Digit manipulation is often cleaner with math than strings**: Using modulo and division avoids string conversion overhead and handles edge cases like leading zeros naturally.

3. **Read the problem carefully about what to process**: The distinction between "original elements" and "all elements" is crucial here. Many array manipulation problems have similar nuances.

Related problems: [Reverse Integer](/problem/reverse-integer)
