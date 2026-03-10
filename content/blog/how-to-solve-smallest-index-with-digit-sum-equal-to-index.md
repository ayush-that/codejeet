---
title: "How to Solve Smallest Index With Digit Sum Equal to Index — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Index With Digit Sum Equal to Index. Easy difficulty, 80.1% acceptance rate. Topics: Array, Math."
date: "2028-06-27"
category: "dsa-patterns"
tags: ["smallest-index-with-digit-sum-equal-to-index", "array", "math", "easy"]
---

# How to Solve Smallest Index With Digit Sum Equal to Index

This problem asks us to find the smallest index `i` where the sum of digits of `nums[i]` equals `i` itself. While conceptually straightforward, it tests your ability to work with digit manipulation and array traversal simultaneously. The challenge lies in correctly implementing the digit sum calculation while handling edge cases like negative numbers (though constraints typically ensure non-negative integers) and the "smallest index" requirement.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [4, 3, 2, 1]`:

**Index 0**: `nums[0] = 4`, digit sum = 4. Since 4 ≠ 0, continue.
**Index 1**: `nums[1] = 3`, digit sum = 3. Since 3 ≠ 1, continue.
**Index 2**: `nums[2] = 2`, digit sum = 2. Since 2 = 2, we found a match! Return index 2.

Now consider `nums = [1, 2, 3, 4, 5]`:

**Index 0**: `nums[0] = 1`, digit sum = 1. 1 ≠ 0.
**Index 1**: `nums[1] = 2`, digit sum = 2. 2 = 1? No, 2 ≠ 1.
**Index 2**: `nums[2] = 3`, digit sum = 3. 3 = 2? No.
**Index 3**: `nums[3] = 4`, digit sum = 4. 4 = 3? No.
**Index 4**: `nums[4] = 5`, digit sum = 5. 5 = 4? No.
No matches found, return -1.

The key insight: we need to iterate through the array, calculate each element's digit sum, and compare it to the current index. The first match is our answer.

## Brute Force Approach

The brute force approach is exactly what we described in the visual walkthrough: iterate through the array, and for each element, calculate its digit sum by repeatedly extracting digits using modulo and division operations. Compare the digit sum with the index, and return the first match.

While this approach is actually optimal for this problem (we must examine each element in the worst case), some candidates might try to precompute digit sums for all possible numbers or use complex data structures. These overcomplications are unnecessary since the problem constraints are small enough for simple linear traversal.

The only "brute force" aspect here is that we're checking every element until we find a match or reach the end. Since we need the smallest index, we can't skip any elements, making this approach optimal.

## Optimal Solution

The optimal solution follows the brute force logic but implements it efficiently. We iterate through the array with index `i`, calculate the digit sum of `nums[i]`, and compare. The digit sum calculation deserves attention: we need to handle each digit correctly, even for numbers like 0.

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = average number of digits
# Space: O(1) - only using constant extra space
def smallestEqual(nums):
    # Iterate through the array with both index and value
    for i in range(len(nums)):
        num = nums[i]
        digit_sum = 0

        # Calculate digit sum: handle 0 separately since while loop won't execute for 0
        if num == 0:
            digit_sum = 0
        else:
            # Extract digits using modulo and integer division
            temp = num
            while temp > 0:
                # Get last digit and add to sum
                digit_sum += temp % 10
                # Remove last digit
                temp //= 10

        # Check if digit sum equals current index
        if digit_sum == i:
            return i  # Found smallest index, return immediately

    # If we finish the loop without finding a match
    return -1
```

```javascript
// Time: O(n * d) where n = nums.length, d = average number of digits
// Space: O(1) - only using constant extra space
function smallestEqual(nums) {
  // Iterate through the array with index
  for (let i = 0; i < nums.length; i++) {
    let num = nums[i];
    let digitSum = 0;

    // Calculate digit sum: handle 0 separately
    if (num === 0) {
      digitSum = 0;
    } else {
      // Extract digits using modulo and Math.floor
      let temp = num;
      while (temp > 0) {
        // Get last digit and add to sum
        digitSum += temp % 10;
        // Remove last digit
        temp = Math.floor(temp / 10);
      }
    }

    // Check if digit sum equals current index
    if (digitSum === i) {
      return i; // Found smallest index, return immediately
    }
  }

  // If we finish the loop without finding a match
  return -1;
}
```

```java
// Time: O(n * d) where n = nums.length, d = average number of digits
// Space: O(1) - only using constant extra space
public int smallestEqual(int[] nums) {
    // Iterate through the array with index
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];
        int digitSum = 0;

        // Calculate digit sum: handle 0 separately
        if (num == 0) {
            digitSum = 0;
        } else {
            // Extract digits using modulo and integer division
            int temp = num;
            while (temp > 0) {
                // Get last digit and add to sum
                digitSum += temp % 10;
                // Remove last digit
                temp /= 10;
            }
        }

        // Check if digit sum equals current index
        if (digitSum == i) {
            return i;  // Found smallest index, return immediately
        }
    }

    // If we finish the loop without finding a match
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × d), where n is the length of the array and d is the average number of digits in each number. In the worst case, we examine every element and calculate its digit sum. Since numbers in typical constraints have at most 10 digits (for 32-bit integers), this is effectively O(n).

**Space Complexity**: O(1). We only use a few variables for the current number, digit sum, and loop counter. No additional data structures scale with input size.

## Common Mistakes

1. **Not handling zero correctly**: When calculating digit sum, a naive while loop like `while num > 0:` will skip `num = 0`, incorrectly leaving digit sum uninitialized or at its previous value. Always handle 0 as a special case or use a do-while loop.

2. **Modifying the original array**: Some candidates modify `nums[i]` during digit sum calculation (using it as the `temp` variable). This destroys the original data. Always copy the value to a temporary variable before processing.

3. **Continuing after finding a match**: The problem asks for the _smallest_ index. Once you find a match, you should return immediately. Continuing to check other indices wastes time and could return a larger index if there are multiple matches.

4. **Incorrect digit extraction for negative numbers**: While constraints typically ensure non-negative integers, it's good practice to handle or at least consider negative cases. The digit sum of a negative number isn't well-defined, so you might need to take absolute value or return a default.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Array traversal with index comparison**: Similar to problems like "Find Pivot Index" (LeetCode 724) where you compare array values with their indices or accumulated sums.

2. **Digit manipulation**: The digit sum calculation appears in many problems:
   - "Add Digits" (LeetCode 258): Repeated digit sum until single digit
   - "Happy Number" (LeetCode 202): Digit squares in a cycle detection context
   - "Self Dividing Numbers" (LeetCode 728): Checking divisibility by digits

The combination teaches you to break problems into subproblems: first solve the digit sum, then integrate it into the larger traversal logic.

## Key Takeaways

1. **Decompose compound problems**: When a problem has multiple requirements (digit sum + index comparison), solve each part separately first, then combine them. This makes debugging easier.

2. **Early return for optimization**: When searching for the "first" or "smallest" match, return immediately upon finding it. This optimizes the average case without changing worst-case complexity.

3. **Handle edge cases in digit operations**: Always test your digit manipulation logic with 0, single-digit numbers, and large numbers to ensure correctness.

[Practice this problem on CodeJeet](/problem/smallest-index-with-digit-sum-equal-to-index)
