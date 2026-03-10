---
title: "How to Solve Minimum Number of Operations to Convert Time — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Convert Time. Easy difficulty, 66.3% acceptance rate. Topics: String, Greedy."
date: "2028-06-07"
category: "dsa-patterns"
tags: ["minimum-number-of-operations-to-convert-time", "string", "greedy", "easy"]
---

# How to Solve Minimum Number of Operations to Convert Time

You're given two 24-hour time strings and need to find the minimum number of operations to convert one time to another, where each operation adds 1, 5, 15, or 60 minutes to the current time. What makes this problem interesting is that while it looks like a time calculation problem, it's actually a disguised **greedy coin change** problem where we need to make change for the time difference using specific denominations.

## Visual Walkthrough

Let's trace through an example: `current = "02:30"`, `correct = "04:35"`

**Step 1: Calculate the total time difference in minutes**

- Current time: 2 hours × 60 + 30 minutes = 150 minutes
- Correct time: 4 hours × 60 + 35 minutes = 275 minutes
- Difference: 275 - 150 = 125 minutes

**Step 2: Apply operations greedily from largest to smallest**
We have operation denominations: 60, 15, 5, 1 minutes

- **60-minute operations**: How many 60s fit in 125? 125 ÷ 60 = 2 remainder 5
  - Use 2 operations of 60 minutes each → 2 operations
  - Remaining: 125 - (2 × 60) = 5 minutes
- **15-minute operations**: How many 15s fit in 5? 5 ÷ 15 = 0 remainder 5
  - Use 0 operations of 15 minutes → 0 operations
  - Remaining: 5 minutes (unchanged)
- **5-minute operations**: How many 5s fit in 5? 5 ÷ 5 = 1 remainder 0
  - Use 1 operation of 5 minutes → 1 operation
  - Remaining: 5 - (1 × 5) = 0 minutes
- **1-minute operations**: Remaining is 0, so 0 operations

**Step 3: Total operations**
2 (60-min) + 0 (15-min) + 1 (5-min) + 0 (1-min) = **3 operations**

This greedy approach works perfectly because our denominations (60, 15, 5, 1) have a special property: each larger denomination is a multiple of the next smaller one. This means we can always take as many of the largest denomination as possible without affecting optimality.

## Brute Force Approach

A naive approach would be to try all possible combinations of operations. For a difference of `d` minutes, we could try:

- All combinations of 60-minute operations (0 to ⌊d/60⌋)
- For each, all combinations of 15-minute operations
- For each, all combinations of 5-minute operations
- Then fill the remainder with 1-minute operations

This would involve nested loops and exponential time complexity. For example, with d=125:

- 60-minute ops: 0, 1, or 2 possibilities
- For each, 15-minute ops: many possibilities
- For each, 5-minute ops: many possibilities

The time complexity would be roughly O(d³) in the worst case, which is completely unnecessary given the structure of our denominations.

## Optimal Solution

The optimal solution uses a **greedy algorithm** because our operation denominations (60, 15, 5, 1) form a **canonical coin system** where each coin is a multiple of the next smaller coin. In such systems, the greedy approach always yields the optimal solution.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Both time and space are constant because we only process a fixed number of operations
def convertTime(current: str, correct: str) -> int:
    # Step 1: Parse hours and minutes from both time strings
    current_hour, current_minute = map(int, current.split(':'))
    correct_hour, correct_minute = map(int, correct.split(':'))

    # Step 2: Convert both times to total minutes since midnight
    current_total = current_hour * 60 + current_minute
    correct_total = correct_hour * 60 + correct_minute

    # Step 3: Calculate the difference in minutes
    # We assume correct time is always later than or equal to current time
    # If correct time is earlier, it means it's on the next day
    # But based on problem constraints, correct is always >= current
    diff = correct_total - current_total

    # Step 4: Define the operation denominations in descending order
    # Using descending order ensures we take the largest possible operations first
    operations = [60, 15, 5, 1]

    # Step 5: Apply greedy algorithm
    count = 0
    for op in operations:
        # Integer division tells us how many of this operation we can use
        count += diff // op
        # Update remainder for next smaller operation
        diff %= op

    return count
```

```javascript
// Time: O(1) | Space: O(1)
// Constant time because we iterate through a fixed array of 4 operations
var convertTime = function (current, correct) {
  // Step 1: Parse hours and minutes from both time strings
  const [currentHour, currentMinute] = current.split(":").map(Number);
  const [correctHour, correctMinute] = correct.split(":").map(Number);

  // Step 2: Convert both times to total minutes since midnight
  const currentTotal = currentHour * 60 + currentMinute;
  const correctTotal = correctHour * 60 + correctMinute;

  // Step 3: Calculate the difference in minutes
  // The problem guarantees correct time is not earlier than current time
  let diff = correctTotal - currentTotal;

  // Step 4: Define operation denominations in descending order
  const operations = [60, 15, 5, 1];

  // Step 5: Apply greedy algorithm
  let count = 0;
  for (const op of operations) {
    // Add the maximum number of this operation we can use
    count += Math.floor(diff / op);
    // Update the remainder for the next operation
    diff %= op;
  }

  return count;
};
```

```java
// Time: O(1) | Space: O(1)
// Constant complexity as we only process 4 fixed denominations
class Solution {
    public int convertTime(String current, String correct) {
        // Step 1: Parse hours and minutes from both time strings
        String[] currentParts = current.split(":");
        String[] correctParts = correct.split(":");

        int currentHour = Integer.parseInt(currentParts[0]);
        int currentMinute = Integer.parseInt(currentParts[1]);
        int correctHour = Integer.parseInt(correctParts[0]);
        int correctMinute = Integer.parseInt(correctParts[1]);

        // Step 2: Convert both times to total minutes since midnight
        int currentTotal = currentHour * 60 + currentMinute;
        int correctTotal = correctHour * 60 + correctMinute;

        // Step 3: Calculate the difference in minutes
        // Problem states correct is always >= current
        int diff = correctTotal - currentTotal;

        // Step 4: Define operation denominations in descending order
        int[] operations = {60, 15, 5, 1};

        // Step 5: Apply greedy algorithm
        int count = 0;
        for (int op : operations) {
            // Use as many of this operation as possible
            count += diff / op;
            // Update remainder for next smaller operation
            diff %= op;
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- Parsing the time strings takes O(1) time since they have fixed length (5 characters)
- Converting to minutes involves simple arithmetic operations: O(1)
- The greedy loop iterates exactly 4 times (once for each operation denomination): O(1)
- All operations are constant time regardless of input size

**Space Complexity: O(1)**

- We only use a fixed number of variables to store hours, minutes, differences, and counts
- The operations array has fixed size 4
- No additional data structures that grow with input size

## Common Mistakes

1. **Assuming correct time is always later on the same day**: While the problem constraints guarantee `correct >= current`, some candidates might forget that times wrap around at midnight. However, since the problem states `correct` represents a time not earlier than `current`, we don't need to handle the wrap-around case.

2. **Using ascending order instead of descending**: Trying operations from smallest to largest (1, 5, 15, 60) would give incorrect results. For example, with 125 minutes difference:
   - 1-minute ops: 125 operations (wrong!)
   - Instead of the optimal 3 operations (60+60+5)
   - Always process denominations in descending order for greedy coin change

3. **Forgetting to update the remainder**: After counting how many of a denomination we can use, we must update the remaining difference using modulo (`%`) operation, not subtraction. Using subtraction in a loop would be inefficient:

   ```python
   # WRONG: Inefficient and harder to read
   while diff >= op:
       diff -= op
       count += 1

   # CORRECT: Efficient one-step calculation
   count += diff // op
   diff %= op
   ```

4. **Not handling string parsing correctly**: Forgetting to convert strings to integers or incorrectly splitting the time string. Remember:
   - `"02:30".split(":")` gives `["02", "30"]`
   - Need to convert to integers for arithmetic: `int("02")` or `parseInt("02")`

## When You'll See This Pattern

This problem uses the **greedy coin change** pattern, which appears when:

1. You need to make change using specific denominations
2. The denominations form a canonical system (each coin is a multiple of the next smaller one)
3. You want to minimize the number of coins/operations

**Related problems:**

- **Coin Change (Medium)**: The classic dynamic programming version where denominations don't necessarily form a canonical system, so greedy doesn't always work and you need DP.
- **Design an ATM Machine (Medium)**: Similar to coin change but with additional constraints on available bills and need to handle multiple withdrawals.
- **Count Days Spent Together (Easy)**: Also involves time calculations but focuses on date overlaps rather than greedy optimization.

## Key Takeaways

1. **Recognize disguised problems**: This looks like a time problem but is actually a coin change problem. Always look for the underlying pattern - here it's "minimize operations with fixed increments."

2. **Greedy works with canonical systems**: When denominations are multiples of each other (like 60, 15, 5, 1 where 60÷15=4, 15÷5=3, 5÷1=5), greedy from largest to smallest is optimal. If denominations don't have this property (like standard US coins: 25, 10, 5, 1 where 25÷10=2.5), you need dynamic programming.

3. **Time calculations are common**: Converting HH:MM to minutes since midnight is a useful pattern for many time-related problems. Remember: `total_minutes = hours × 60 + minutes`.

Related problems: [Coin Change](/problem/coin-change), [Design an ATM Machine](/problem/design-an-atm-machine), [Count Days Spent Together](/problem/count-days-spent-together)
