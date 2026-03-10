---
title: "How to Solve Maximum Number of Balls in a Box — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Number of Balls in a Box. Easy difficulty, 74.7% acceptance rate. Topics: Hash Table, Math, Counting."
date: "2027-10-14"
category: "dsa-patterns"
tags: ["maximum-number-of-balls-in-a-box", "hash-table", "math", "counting", "easy"]
---

# How to Solve Maximum Number of Balls in a Box

You're given a range of numbered balls and need to place each ball in a box determined by the sum of its digits. The challenge is to find which box ends up with the most balls. While the problem seems straightforward, it requires careful handling of digit summation and efficient counting to avoid unnecessary computations.

## Visual Walkthrough

Let's trace through an example with `lowLimit = 1` and `highLimit = 10`:

**Step 1: Calculate box numbers for each ball**

- Ball 1 → sum of digits = 1 → Box 1
- Ball 2 → sum of digits = 2 → Box 2
- Ball 3 → sum of digits = 3 → Box 3
- Ball 4 → sum of digits = 4 → Box 4
- Ball 5 → sum of digits = 5 → Box 5
- Ball 6 → sum of digits = 6 → Box 6
- Ball 7 → sum of digits = 7 → Box 7
- Ball 8 → sum of digits = 8 → Box 8
- Ball 9 → sum of digits = 9 → Box 9
- Ball 10 → sum of digits = 1 + 0 = 1 → Box 1

**Step 2: Count balls in each box**

- Box 1: 2 balls (balls 1 and 10)
- Box 2: 1 ball
- Box 3: 1 ball
- Box 4: 1 ball
- Box 5: 1 ball
- Box 6: 1 ball
- Box 7: 1 ball
- Box 8: 1 ball
- Box 9: 1 ball

**Step 3: Find maximum**
The maximum number of balls in any box is 2, which occurs in Box 1.

## Brute Force Approach

The most straightforward approach is to iterate through every ball, calculate its digit sum, and track counts in a dictionary or array. While this is actually the optimal approach for this problem, let's consider what a truly naive candidate might try:

A naive approach would be to create boxes up to the maximum possible sum (which for `highLimit = 10^5` would be 9+9+9+9+9 = 45), then for each ball, iterate through all boxes to find matches. This would be O(n × max_sum) and is clearly inefficient.

The better "brute force" is simply to process each ball once, which is already optimal. However, some candidates might try to precompute all digit sums without realizing the constraints make this unnecessary.

## Optimal Solution

The optimal solution uses a hash map (dictionary) to count how many balls go into each box. For each ball number, we calculate the sum of its digits and increment the count for that box number. Finally, we find the maximum count in our hash map.

Key insights:

1. The maximum possible box number is small (for `highLimit ≤ 10^5`, max digit sum is 9+9+9+9+9 = 45)
2. We only need to track counts, not which balls are in which box
3. We can compute digit sums efficiently using modulo and division operations

<div class="code-group">

```python
# Time: O(n × d) where n = number of balls, d = number of digits in highLimit
# Space: O(1) since we only store up to 45 boxes
def countBalls(lowLimit: int, highLimit: int) -> int:
    # Dictionary to store count of balls in each box
    # Key: box number (sum of digits), Value: count of balls
    box_counts = {}

    # Iterate through each ball number
    for ball in range(lowLimit, highLimit + 1):
        box_number = 0
        current = ball

        # Calculate sum of digits for current ball
        while current > 0:
            # Add last digit to box_number
            box_number += current % 10
            # Remove last digit
            current //= 10

        # Update count for this box
        # Using get() with default value 0 to handle first occurrence
        box_counts[box_number] = box_counts.get(box_number, 0) + 1

    # Find the maximum count among all boxes
    # max() returns the maximum value in the dictionary values
    return max(box_counts.values())
```

```javascript
// Time: O(n × d) where n = number of balls, d = number of digits in highLimit
// Space: O(1) since we only store up to 45 boxes
function countBalls(lowLimit, highLimit) {
  // Object to store count of balls in each box
  // Key: box number (sum of digits), Value: count of balls
  const boxCounts = {};

  // Iterate through each ball number
  for (let ball = lowLimit; ball <= highLimit; ball++) {
    let boxNumber = 0;
    let current = ball;

    // Calculate sum of digits for current ball
    while (current > 0) {
      // Add last digit to boxNumber
      boxNumber += current % 10;
      // Remove last digit
      current = Math.floor(current / 10);
    }

    // Update count for this box
    // Using nullish coalescing to handle first occurrence
    boxCounts[boxNumber] = (boxCounts[boxNumber] || 0) + 1;
  }

  // Find the maximum count among all boxes
  // Math.max with spread operator on Object.values()
  return Math.max(...Object.values(boxCounts));
}
```

```java
// Time: O(n × d) where n = number of balls, d = number of digits in highLimit
// Space: O(1) since we only store up to 45 boxes
public int countBalls(int lowLimit, int highLimit) {
    // Array to store count of balls in each box
    // Maximum possible sum of digits for numbers up to 100,000 is 45
    int[] boxCounts = new int[46]; // 0-45 inclusive

    // Iterate through each ball number
    for (int ball = lowLimit; ball <= highLimit; ball++) {
        int boxNumber = 0;
        int current = ball;

        // Calculate sum of digits for current ball
        while (current > 0) {
            // Add last digit to boxNumber
            boxNumber += current % 10;
            // Remove last digit
            current /= 10;
        }

        // Update count for this box
        boxCounts[boxNumber]++;
    }

    // Find the maximum count among all boxes
    int maxCount = 0;
    for (int count : boxCounts) {
        if (count > maxCount) {
            maxCount = count;
        }
    }

    return maxCount;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d) where:

- `n` = `highLimit - lowLimit + 1` (number of balls)
- `d` = number of digits in `highLimit` (maximum 6 for the given constraints)

For each ball, we calculate the sum of its digits, which takes O(d) time. Since `d` is at most 6 (for numbers up to 100,000), this is effectively O(n) in practice.

**Space Complexity:** O(1) or O(max_digit_sum)

- The Python/JavaScript solutions use a hash map that stores at most 46 entries (for digit sums 0-45)
- The Java solution uses a fixed-size array of 46 elements
- In all cases, the space used is constant regardless of input size

## Common Mistakes

1. **Inclusive/Exclusive Range Error:** Forgetting that `highLimit` is inclusive. Using `range(lowLimit, highLimit)` in Python or `ball < highLimit` in loops will miss the last ball. Always use `highLimit + 1` in the loop condition.

2. **Incorrect Digit Sum Calculation:** Not handling numbers with multiple digits correctly. Some candidates try to convert to string and sum characters, which works but is slower. Others might use `//` (floor division) incorrectly in languages without integer division.

3. **Memory Inefficiency:** Creating a hash map with keys for every ball number instead of just box numbers. While this works, it's unnecessary memory usage since we only care about counts per box, not which specific balls are in each box.

4. **Missing Edge Cases:** Not considering that `lowLimit` could equal `highLimit`, or that numbers could be single-digit. The solution should handle all cases from 1 to 100,000.

## When You'll See This Pattern

This problem combines digit manipulation with frequency counting, a pattern that appears in several LeetCode problems:

1. **Happy Number (LeetCode 202):** Also involves repeatedly calculating the sum of squares of digits until reaching a cycle or 1. The digit sum calculation is identical.

2. **Add Digits (LeetCode 258):** Requires finding the digital root (repeated sum of digits until single digit). The core digit extraction logic is the same.

3. **Self Dividing Numbers (LeetCode 728):** Involves checking each digit of a number for a specific property, using similar digit extraction techniques.

4. **Find the Number of Distinct Colors Among the Balls (LeetCode 3160):** Similar frequency counting pattern but with dynamic updates as balls are added/removed.

## Key Takeaways

1. **Digit Manipulation Pattern:** When a problem involves working with individual digits of numbers, use modulo (`% 10`) to extract the last digit and integer division (`// 10` or `/ 10`) to remove it. This is more efficient than string conversion.

2. **Frequency Counting with Bounded Keys:** When counting frequencies where the key space is small and bounded (like digit sums 0-45), consider using an array instead of a hash map for better performance and simpler code.

3. **Constraint Analysis:** Always check constraints to identify optimization opportunities. Here, the maximum digit sum of 45 tells us we need at most 46 counters, making space complexity constant.

Related problems: [Find the Number of Distinct Colors Among the Balls](/problem/find-the-number-of-distinct-colors-among-the-balls)
