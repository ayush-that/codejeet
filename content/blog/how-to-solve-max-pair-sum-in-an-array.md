---
title: "How to Solve Max Pair Sum in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Max Pair Sum in an Array. Easy difficulty, 60.4% acceptance rate. Topics: Array, Hash Table."
date: "2028-04-26"
category: "dsa-patterns"
tags: ["max-pair-sum-in-an-array", "array", "hash-table", "easy"]
---

# How to Solve Max Pair Sum in an Array

This problem asks us to find the maximum sum of any two numbers in an array where both numbers share the same largest digit. For example, in the number 2373, the digits are 2, 3, and 7, with 7 being the largest. The challenge is efficiently grouping numbers by their maximum digit while tracking the largest values in each group to compute the maximum possible pair sum.

## Visual Walkthrough

Let's trace through an example: `nums = [51, 71, 17, 24, 42]`

**Step 1: Find the maximum digit for each number**

- 51 → digits: 5 and 1 → max digit = 5
- 71 → digits: 7 and 1 → max digit = 7
- 17 → digits: 1 and 7 → max digit = 7
- 24 → digits: 2 and 4 → max digit = 4
- 42 → digits: 4 and 2 → max digit = 4

**Step 2: Group numbers by their maximum digit**

- Max digit 5: [51]
- Max digit 7: [71, 17]
- Max digit 4: [24, 42]

**Step 3: For groups with at least 2 numbers, find the two largest values**

- Group 7: largest numbers are 71 and 17 → sum = 88
- Group 4: largest numbers are 42 and 24 → sum = 66

**Step 4: Return the maximum sum among all groups**

- Compare 88 and 66 → maximum is 88

The key insight is that we only need to track the two largest numbers for each max digit, since we're looking for the maximum pair sum within each group.

## Brute Force Approach

A naive approach would check every possible pair (i, j) where i < j:

1. For each pair, extract the maximum digit from both numbers
2. If the maximum digits are equal, calculate their sum
3. Track the maximum sum encountered

This approach has O(n²) time complexity since we check all n(n-1)/2 pairs, and for each pair we need to extract digits (which takes O(d) time where d is the number of digits). For an array of size 10⁵, this would be far too slow (roughly 10¹⁰ operations).

The brute force fails because it redundantly recomputes maximum digits and checks pairs that can't possibly yield the maximum sum. We can optimize by first grouping numbers by their maximum digit.

## Optimal Solution

The optimal approach uses a hash map to group numbers by their maximum digit while tracking only the two largest numbers in each group. Here's why this works:

1. **Grouping by max digit**: Numbers can only form valid pairs with others sharing the same maximum digit
2. **Tracking top two values**: For the maximum pair sum within a group, we only need the two largest numbers in that group
3. **Single pass**: We can compute the maximum digit and update our tracking in one pass through the array

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = max digits in any number
# Space: O(1) since we store at most 10 groups (digits 0-9)
def maxSum(nums):
    # Dictionary to store the two largest numbers for each max digit (0-9)
    # Each key will map to [largest, second_largest]
    max_digit_groups = {}

    for num in nums:
        # Find the maximum digit in the current number
        max_digit = 0
        temp = num
        while temp > 0:
            digit = temp % 10  # Extract last digit
            max_digit = max(max_digit, digit)
            temp //= 10  # Remove last digit

        # Handle the case when num is 0 (max digit is 0)
        if num == 0:
            max_digit = 0

        # Update the two largest numbers for this max digit
        if max_digit not in max_digit_groups:
            # First number with this max digit
            max_digit_groups[max_digit] = [num, float('-inf')]
        else:
            # We have at least one number with this max digit
            largest, second_largest = max_digit_groups[max_digit]

            if num > largest:
                # New largest, old largest becomes second largest
                max_digit_groups[max_digit] = [num, largest]
            elif num > second_largest:
                # New second largest
                max_digit_groups[max_digit][1] = num

    # Find the maximum pair sum across all groups
    max_sum = -1

    for largest, second_largest in max_digit_groups.values():
        # We need at least two numbers in the group to form a pair
        if second_largest != float('-inf'):
            pair_sum = largest + second_largest
            max_sum = max(max_sum, pair_sum)

    return max_sum
```

```javascript
// Time: O(n * d) where n = nums.length, d = max digits in any number
// Space: O(1) since we store at most 10 groups (digits 0-9)
function maxSum(nums) {
  // Map to store the two largest numbers for each max digit (0-9)
  // Each key maps to [largest, secondLargest]
  const maxDigitGroups = new Map();

  for (const num of nums) {
    // Find the maximum digit in the current number
    let maxDigit = 0;
    let temp = num;

    while (temp > 0) {
      const digit = temp % 10; // Extract last digit
      maxDigit = Math.max(maxDigit, digit);
      temp = Math.floor(temp / 10); // Remove last digit
    }

    // Handle the case when num is 0 (max digit is 0)
    if (num === 0) {
      maxDigit = 0;
    }

    // Update the two largest numbers for this max digit
    if (!maxDigitGroups.has(maxDigit)) {
      // First number with this max digit
      maxDigitGroups.set(maxDigit, [num, -Infinity]);
    } else {
      const [largest, secondLargest] = maxDigitGroups.get(maxDigit);

      if (num > largest) {
        // New largest, old largest becomes second largest
        maxDigitGroups.set(maxDigit, [num, largest]);
      } else if (num > secondLargest) {
        // New second largest
        const group = maxDigitGroups.get(maxDigit);
        group[1] = num;
        maxDigitGroups.set(maxDigit, group);
      }
    }
  }

  // Find the maximum pair sum across all groups
  let maxSum = -1;

  for (const [largest, secondLargest] of maxDigitGroups.values()) {
    // We need at least two numbers in the group to form a pair
    if (secondLargest !== -Infinity) {
      const pairSum = largest + secondLargest;
      maxSum = Math.max(maxSum, pairSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(n * d) where n = nums.length, d = max digits in any number
// Space: O(1) since we store at most 10 groups (digits 0-9)
public int maxSum(int[] nums) {
    // Array to store the two largest numbers for each max digit (0-9)
    // groups[i][0] = largest number with max digit i
    // groups[i][1] = second largest number with max digit i
    int[][] groups = new int[10][2];

    // Initialize all groups with -1 (indicating no numbers yet)
    for (int i = 0; i < 10; i++) {
        groups[i][0] = -1;
        groups[i][1] = -1;
    }

    for (int num : nums) {
        // Find the maximum digit in the current number
        int maxDigit = 0;
        int temp = num;

        while (temp > 0) {
            int digit = temp % 10;  // Extract last digit
            maxDigit = Math.max(maxDigit, digit);
            temp /= 10;  // Remove last digit
        }

        // Handle the case when num is 0 (max digit is 0)
        if (num == 0) {
            maxDigit = 0;
        }

        // Update the two largest numbers for this max digit
        if (groups[maxDigit][0] == -1) {
            // First number with this max digit
            groups[maxDigit][0] = num;
        } else if (num > groups[maxDigit][0]) {
            // New largest, old largest becomes second largest
            groups[maxDigit][1] = groups[maxDigit][0];
            groups[maxDigit][0] = num;
        } else if (num > groups[maxDigit][1]) {
            // New second largest
            groups[maxDigit][1] = num;
        }
    }

    // Find the maximum pair sum across all groups
    int maxSum = -1;

    for (int i = 0; i < 10; i++) {
        // We need at least two numbers in the group to form a pair
        if (groups[i][0] != -1 && groups[i][1] != -1) {
            int pairSum = groups[i][0] + groups[i][1];
            maxSum = Math.max(maxSum, pairSum);
        }
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × d)**

- We iterate through all n numbers in the array once
- For each number, we extract its digits, which takes O(d) time where d is the number of digits in that number
- Since numbers in the problem constraints can have up to 8 digits (10⁸), d ≤ 8
- In practice, this is effectively O(n) since d is bounded by a constant

**Space Complexity: O(1)**

- We store at most 10 groups (one for each digit 0-9)
- Each group stores exactly 2 integers
- This constant space doesn't grow with input size

## Common Mistakes

1. **Forgetting to handle single-digit numbers and zero**: When a number is 0 or has only one digit, the digit extraction loop might not run. Always handle num == 0 as a special case, or ensure your loop handles single-digit numbers correctly.

2. **Not tracking the two largest numbers efficiently**: Some candidates store all numbers in each group then sort, which takes O(k log k) time per group. We only need the top two values, which can be maintained in O(1) time per number.

3. **Incorrect digit extraction for negative numbers**: The problem states the array contains integers, but based on examples and constraints, they appear to be non-negative. However, if negatives were possible, we'd need to use `abs()` before extracting digits.

4. **Returning -1 incorrectly**: The problem asks to return -1 if no such pair exists. Make sure you initialize your result to -1 and only update it when you find a valid pair. Don't return 0 as the default, since 0 could be a valid pair sum.

## When You'll See This Pattern

This problem combines two common patterns:

1. **Grouping by a computed property**: Similar to "Group Anagrams" (LeetCode 49) where strings are grouped by their sorted version, or "Find Original Array From Doubled Array" (LeetCode 2007) where numbers are grouped by their value/2 relationship.

2. **Tracking top K elements in a stream**: Like "Kth Largest Element in a Stream" (LeetCode 703) but with K=2 and multiple independent streams (one per group). The technique of maintaining only the largest two values instead of storing all values is crucial for efficiency.

3. **Digit manipulation problems**: Problems like "Maximum Swap" (LeetCode 670) or "Next Greater Element III" (LeetCode 556) also require extracting and analyzing digits of numbers.

## Key Takeaways

1. **Group before you compute**: When you need to find optimal pairs within groups sharing a property, first group elements by that property rather than checking all possible pairs.

2. **Maintain only what you need**: For finding the maximum pair sum in each group, you only need the two largest numbers, not all numbers in the group. This reduces both time and space complexity.

3. **Digit extraction is O(d)**: Remember that extracting digits from a number n takes O(log₁₀ n) time, which for practical constraints (n ≤ 10⁸) means at most 8 iterations.

[Practice this problem on CodeJeet](/problem/max-pair-sum-in-an-array)
