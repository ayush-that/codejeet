---
title: "How to Solve Sort the Jumbled Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort the Jumbled Numbers. Medium difficulty, 60.0% acceptance rate. Topics: Array, Sorting."
date: "2026-08-21"
category: "dsa-patterns"
tags: ["sort-the-jumbled-numbers", "array", "sorting", "medium"]
---

# How to Solve Sort the Jumbled Numbers

This problem asks us to sort numbers based on their "mapped values" according to a digit-mapping rule. The tricky part is that we need to sort the original numbers based on their transformed values while preserving the original numbers in the sorted result. This requires careful handling of both the transformation process and the sorting logic.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
mapping = [8,9,4,0,2,1,3,5,7,6]
nums = [991,338,38]
```

**Step 1: Calculate mapped values**

For each number in `nums`, we need to transform it digit-by-digit:

- `991` → digits: 9, 9, 1 → mapped: 6, 6, 9 → new number: 669
- `338` → digits: 3, 3, 8 → mapped: 0, 0, 7 → new number: 007 (which is 7)
- `38` → digits: 3, 8 → mapped: 0, 7 → new number: 07 (which is 7)

**Step 2: Sort by mapped values**

Original numbers with their mapped values:

- `991` → 669
- `338` → 7
- `38` → 7

When two mapped values are equal (both 7), we need to preserve the original order (stable sort):

- `338` comes before `38` in original array

Sorted order by mapped values: `[338, 38, 991]`

**Step 3: Return sorted original numbers**

Result: `[338, 38, 991]`

The key insight is that we need to transform each number, sort based on the transformed values, but return the original numbers in that sorted order.

## Brute Force Approach

A naive approach would be:

1. Create a list of (mapped_value, original_value, original_index) tuples
2. Sort this list by mapped_value, then by original_index for ties
3. Extract just the original values from the sorted list

This approach works correctly but has some inefficiencies:

- We need to handle the transformation for each number, which requires converting integers to strings or extracting digits
- The sorting needs to consider both mapped values and original indices for stability

While this brute force approach is actually optimal in terms of time complexity (O(n log n) for sorting), the challenge is in implementing the transformation efficiently and handling edge cases properly. A truly naive implementation might try to sort by repeatedly comparing transformed values without storing them, which would be O(n² log n) due to repeated transformations.

## Optimized Approach

The optimal approach follows these steps:

1. **Transform each number efficiently**: Instead of converting to string and back, we can extract digits mathematically using modulo operations. This is more efficient and handles edge cases like 0 correctly.

2. **Store transformation with original number**: Create tuples of (transformed_value, original_value) or use a custom comparator that transforms on-the-fly during comparison.

3. **Sort with stable sort**: Use a stable sorting algorithm (like Timsort in Python) or explicitly include the original index to handle ties.

4. **Extract original numbers**: Return just the original numbers in the sorted order.

The key optimization is in the transformation function. For a number like 123:

- We extract digits from right to left: 3, 2, 1
- Apply mapping: mapping[3], mapping[2], mapping[1]
- Build the new number: new_num = new_num \* 10 + mapped_digit

Special case: When the original number is 0, we need to handle it separately since the while loop won't execute.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = average number of digits
# Space: O(n) for storing the transformed values
def sortJumbled(mapping, nums):
    """
    Sort numbers based on their mapped values according to the mapping rule.

    Args:
        mapping: List[int] - mapping from original digit to new digit
        nums: List[int] - original numbers to sort

    Returns:
        List[int] - original numbers sorted by their mapped values
    """

    def map_number(num):
        """
        Transform a number according to the mapping rule.

        Special handling for 0 since while loop won't execute for num = 0.
        """
        if num == 0:
            return mapping[0]

        mapped_value = 0
        place_value = 1  # Tracks the position of current digit (ones, tens, etc.)

        # Process each digit from right to left
        while num > 0:
            digit = num % 10          # Extract rightmost digit
            mapped_digit = mapping[digit]  # Apply mapping
            # Build the new number: add mapped digit at correct position
            mapped_value = mapped_digit * place_value + mapped_value
            place_value *= 10         # Move to next position
            num //= 10                # Remove processed digit

        return mapped_value

    # Create list of (mapped_value, original_value) pairs
    mapped_pairs = [(map_number(num), num) for num in nums]

    # Sort by mapped_value - Python's sort is stable by default
    mapped_pairs.sort(key=lambda x: x[0])

    # Extract and return only the original numbers in sorted order
    return [num for _, num in mapped_pairs]
```

```javascript
// Time: O(n * d) where n = nums.length, d = average number of digits
// Space: O(n) for storing the transformed values
function sortJumbled(mapping, nums) {
  /**
   * Transform a number according to the mapping rule.
   *
   * @param {number} num - The original number to transform
   * @returns {number} - The mapped value
   */
  const mapNumber = (num) => {
    // Special case: num is 0
    if (num === 0) {
      return mapping[0];
    }

    let mappedValue = 0;
    let placeValue = 1; // Tracks position (ones, tens, hundreds...)

    // Process each digit from right to left
    while (num > 0) {
      const digit = num % 10; // Extract rightmost digit
      const mappedDigit = mapping[digit]; // Apply mapping
      // Build new number: add mapped digit at correct position
      mappedValue = mappedDigit * placeValue + mappedValue;
      placeValue *= 10; // Move to next position
      num = Math.floor(num / 10); // Remove processed digit
    }

    return mappedValue;
  };

  // Create array of objects with mapped value and original number
  const mappedPairs = nums.map((num) => ({
    mapped: mapNumber(num),
    original: num,
  }));

  // Sort by mapped value - JavaScript sort is stable in modern environments
  mappedPairs.sort((a, b) => a.mapped - b.mapped);

  // Extract and return only the original numbers in sorted order
  return mappedPairs.map((pair) => pair.original);
}
```

```java
// Time: O(n * d) where n = nums.length, d = average number of digits
// Space: O(n) for storing the transformed values
import java.util.*;

class Solution {
    public int[] sortJumbled(int[] mapping, int[] nums) {
        /**
         * Transform a number according to the mapping rule.
         *
         * @param num - The original number to transform
         * @return The mapped value
         */
        private int mapNumber(int num) {
            // Special case: num is 0
            if (num == 0) {
                return mapping[0];
            }

            int mappedValue = 0;
            int placeValue = 1; // Tracks position (ones, tens, hundreds...)

            // Process each digit from right to left
            while (num > 0) {
                int digit = num % 10;           // Extract rightmost digit
                int mappedDigit = mapping[digit]; // Apply mapping
                // Build new number: add mapped digit at correct position
                mappedValue = mappedDigit * placeValue + mappedValue;
                placeValue *= 10;               // Move to next position
                num /= 10;                      // Remove processed digit
            }

            return mappedValue;
        }

        // Create list of pairs (mapped value, original value)
        List<Pair> pairs = new ArrayList<>();
        for (int i = 0; i < nums.length; i++) {
            pairs.add(new Pair(mapNumber(nums[i]), nums[i], i));
        }

        // Sort by mapped value, then by original index for stability
        Collections.sort(pairs, (a, b) -> {
            if (a.mapped != b.mapped) {
                return Integer.compare(a.mapped, b.mapped);
            }
            return Integer.compare(a.index, b.index);
        });

        // Extract original numbers in sorted order
        int[] result = new int[nums.length];
        for (int i = 0; i < pairs.size(); i++) {
            result[i] = pairs.get(i).original;
        }

        return result;
    }

    // Helper class to store mapped value, original value, and original index
    class Pair {
        int mapped;
        int original;
        int index;

        Pair(int mapped, int original, int index) {
            this.mapped = mapped;
            this.original = original;
            this.index = index;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × d)**

- `n` is the number of elements in `nums`
- `d` is the average number of digits in the numbers
- We process each number once: O(n)
- For each number, we process each digit: O(d) per number
- Sorting takes O(n log n) comparisons
- Total: O(n × d + n log n)

**Space Complexity: O(n)**

- We store the mapped pairs: O(n)
- The sorting algorithm may use additional O(n) space
- No other significant space usage

The digit processing (O(n × d)) typically dominates for reasonable input sizes since d is usually small (≤ 10 for 32-bit integers).

## Common Mistakes

1. **Not handling the number 0 correctly**: When num = 0, the while loop `while (num > 0)` won't execute, so you need special handling to return `mapping[0]`.

2. **Building the mapped number in wrong order**: When extracting digits with `num % 10`, you get digits from right to left. If you build the new number by simple concatenation or addition without place value tracking, you'll reverse the digits. The solution uses `placeValue` to correctly position each digit.

3. **Forgetting about stable sort requirement**: When two numbers have the same mapped value, they should maintain their original relative order. Some sorting algorithms aren't stable by default, so you may need to include the original index in the sort key.

4. **Inefficient digit extraction**: Converting to string and back is cleaner but slightly less efficient than mathematical extraction. More importantly, it can lead to issues with leading zeros in the mapped values.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Custom Sorting with Transformation**: Similar to problems where you sort based on a computed property:
   - [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) - Sort by character frequency
   - [Largest Number](https://leetcode.com/problems/largest-number/) - Sort numbers based on string concatenation results

2. **Digit Manipulation**: Problems that require processing individual digits:
   - [Happy Number](https://leetcode.com/problems/happy-number/) - Extract and square digits
   - [Add Digits](https://leetcode.com/problems/add-digits/) - Repeated digit summation

3. **Mapping/Transformation Problems**:
   - [Map Sum Pairs](https://leetcode.com/problems/map-sum-pairs/) - Mentioned in the problem as similar, involves prefix matching with values

## Key Takeaways

1. **Custom comparators often need auxiliary data**: When sorting based on computed values, store the computed values alongside the originals rather than recomputing during each comparison.

2. **Mathematical digit extraction is efficient and precise**: Using modulo and division operations is often better than string conversion for digit manipulation problems.

3. **Always test edge cases**: Zero, single-digit numbers, numbers with leading zeros after mapping, and equal mapped values are all important test cases.

4. **Understand your language's sort stability**: Know whether your sorting function is stable (preserves order of equal elements) or if you need to explicitly handle ties.

Related problems: [Map Sum Pairs](/problem/map-sum-pairs)
