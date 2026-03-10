---
title: "How to Solve Number of Employees Who Met the Target — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Employees Who Met the Target. Easy difficulty, 87.8% acceptance rate. Topics: Array."
date: "2028-06-07"
category: "dsa-patterns"
tags: ["number-of-employees-who-met-the-target", "array", "easy"]
---

# How to Solve Number of Employees Who Met the Target

This problem asks us to count how many employees have worked at least a given target number of hours. While conceptually simple, it's a classic filtering problem that tests your ability to work with arrays and understand comparison logic. The "trick" is recognizing that we need to count elements meeting a condition, not find specific values or indices.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `hours = [0, 1, 2, 3, 4]`
- `target = 2`

We need to count employees who worked **at least** 2 hours. "At least" means `hours[i] >= target`.

Step-by-step:

1. Employee 0: 0 hours → 0 >= 2? **No** (count = 0)
2. Employee 1: 1 hour → 1 >= 2? **No** (count = 0)
3. Employee 2: 2 hours → 2 >= 2? **Yes** (count = 1)
4. Employee 3: 3 hours → 3 >= 2? **Yes** (count = 2)
5. Employee 4: 4 hours → 4 >= 2? **Yes** (count = 3)

Final answer: 3 employees met the target.

Notice that we're simply iterating through the array and counting elements that satisfy the condition. There's no need to sort or use complex data structures.

## Brute Force Approach

The most straightforward approach is exactly what we did in the visual walkthrough: iterate through each element and count how many satisfy `hours[i] >= target`. This is actually the optimal solution for this problem since we must examine every element at least once to determine if it meets the condition.

However, let's consider what a truly naive candidate might try:

- Sorting the array first (O(n log n)) then counting
- Creating a frequency map (O(n) space) then summing frequencies
- Using nested loops (O(n²)) for no reason

These approaches are overcomplicated. The simplest solution—linear scan with counting—is already optimal because any solution must check all `n` elements, giving us a lower bound of Ω(n) time complexity.

## Optimal Solution

We'll implement a single-pass linear scan through the array. For each hour value, we check if it meets or exceeds the target, incrementing our counter when it does.

<div class="code-group">

```python
# Time: O(n) - We examine each element once
# Space: O(1) - We only use a constant amount of extra space
def numberOfEmployeesWhoMetTarget(hours, target):
    """
    Counts how many employees worked at least target hours.

    Args:
        hours: List of hours worked by each employee
        target: Minimum hours required

    Returns:
        Count of employees who met or exceeded the target
    """
    count = 0  # Initialize counter to track employees meeting target

    # Iterate through each employee's hours
    for hour in hours:
        # Check if this employee worked at least target hours
        if hour >= target:
            count += 1  # Increment counter if condition is met

    return count  # Return final count
```

```javascript
// Time: O(n) - We examine each element once
// Space: O(1) - We only use a constant amount of extra space
function numberOfEmployeesWhoMetTarget(hours, target) {
  /**
   * Counts how many employees worked at least target hours.
   *
   * @param {number[]} hours - Array of hours worked by each employee
   * @param {number} target - Minimum hours required
   * @return {number} Count of employees who met or exceeded the target
   */
  let count = 0; // Initialize counter to track employees meeting target

  // Iterate through each employee's hours
  for (let hour of hours) {
    // Check if this employee worked at least target hours
    if (hour >= target) {
      count++; // Increment counter if condition is met
    }
  }

  return count; // Return final count
}
```

```java
// Time: O(n) - We examine each element once
// Space: O(1) - We only use a constant amount of extra space
class Solution {
    public int numberOfEmployeesWhoMetTarget(int[] hours, int target) {
        /**
         * Counts how many employees worked at least target hours.
         *
         * @param hours Array of hours worked by each employee
         * @param target Minimum hours required
         * @return Count of employees who met or exceeded the target
         */
        int count = 0;  // Initialize counter to track employees meeting target

        // Iterate through each employee's hours
        for (int hour : hours) {
            // Check if this employee worked at least target hours
            if (hour >= target) {
                count++;  // Increment counter if condition is met
            }
        }

        return count;  // Return final count
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, examining each of the `n` elements exactly once
- Each iteration performs a constant-time comparison and possibly a constant-time increment
- No nested loops or recursive calls, so time grows linearly with input size

**Space Complexity: O(1)**

- We only use a single integer variable (`count`) to track our result
- No additional data structures that grow with input size
- The input arrays are provided and don't count toward our space usage

## Common Mistakes

1. **Using the wrong comparison operator**: Candidates sometimes use `>` instead of `>=`. Remember "at least" means "greater than or equal to," not just "greater than." An employee who worked exactly the target hours has met the requirement.

2. **Forgetting to initialize the counter**: Always initialize your counter variable to 0. In some languages, uninitialized variables contain garbage values that can produce incorrect results.

3. **Overcomplicating the solution**: Some candidates try to sort the array first or use binary search, thinking it might be faster. However, sorting takes O(n log n) time, which is worse than our O(n) linear scan. Since we need to check every element anyway, sorting doesn't help.

4. **Off-by-one errors with indices**: When using index-based loops (like `for i in range(len(hours))`), ensure you're accessing `hours[i]` not `hours[i-1]` or `hours[i+1]`. Using for-each loops (as in our solution) avoids this issue entirely.

## When You'll See This Pattern

This "count elements meeting a condition" pattern appears frequently in coding problems:

1. **Count Primes (LeetCode 204)**: Count how many numbers less than n are prime. While more complex (needs primality testing), it follows the same pattern of iterating and counting based on a condition.

2. **Find Numbers with Even Number of Digits (LeetCode 1295)**: Count how many numbers in an array have an even number of digits. Same pattern: iterate and count when condition is met.

3. **Minimum Operations to Exceed Threshold Value I (LeetCode 3065)**: This is essentially the same problem with different wording—count elements greater than or equal to a threshold.

The core pattern is: **Given a collection, count how many elements satisfy property P.** The solution is always O(n) time since you must examine each element at least once to check property P.

## Key Takeaways

1. **Simple problems often have simple solutions**: Don't overthink easy problems. If the problem asks "count how many X satisfy Y," a linear scan with a counter is usually the right approach.

2. **Understand comparison requirements precisely**: "At least," "more than," "less than," and "at most" have specific mathematical meanings. Double-check which operator (`>`, `>=`, `<`, `<=`) matches the problem statement.

3. **Linear time is optimal for counting problems**: When you need to examine each element to determine if it should be counted, O(n) is the best you can do. Any solution claiming to be faster (like O(log n)) is likely incorrect for this type of problem.

Related problems: [Minimum Operations to Exceed Threshold Value I](/problem/minimum-operations-to-exceed-threshold-value-i)
