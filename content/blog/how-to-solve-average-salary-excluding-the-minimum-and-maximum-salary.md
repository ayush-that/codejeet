---
title: "How to Solve Average Salary Excluding the Minimum and Maximum Salary — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Average Salary Excluding the Minimum and Maximum Salary. Easy difficulty, 63.5% acceptance rate. Topics: Array, Sorting."
date: "2027-08-15"
category: "dsa-patterns"
tags: ["average-salary-excluding-the-minimum-and-maximum-salary", "array", "sorting", "easy"]
---

# How to Solve Average Salary Excluding the Minimum and Maximum Salary

This problem asks us to calculate the average salary from an array of unique integers, excluding both the minimum and maximum values. While conceptually straightforward, it's interesting because it tests your ability to handle edge cases efficiently without relying on sorting when it's unnecessary. The key insight is recognizing that we can find the min and max in a single pass while accumulating the total sum.

## Visual Walkthrough

Let's walk through an example: `salary = [4000, 3000, 1000, 2000]`

**Step 1: Identify min and max**

- Start with min = ∞ and max = -∞ (or use the first element)
- Check 4000: min = 4000, max = 4000
- Check 3000: min = 3000, max = 4000
- Check 1000: min = 1000, max = 4000
- Check 2000: min = 1000, max = 4000

**Step 2: Calculate total sum**

- Sum = 4000 + 3000 + 1000 + 2000 = 10000

**Step 3: Subtract min and max**

- Adjusted sum = 10000 - 1000 - 4000 = 5000

**Step 4: Calculate average**

- Number of elements considered = total elements - 2 = 4 - 2 = 2
- Average = 5000 / 2 = 2500

The result is 2500, which makes sense: we're averaging the middle two salaries (2000 and 3000).

## Brute Force Approach

A naive approach would be to sort the array first, then calculate the average of all elements except the first and last (after sorting). While this works, it's inefficient because sorting takes O(n log n) time when we only need O(n) time.

What a candidate might try:

1. Sort the array in ascending order
2. Slice the array to exclude first and last elements
3. Calculate the average of the remaining elements

The problem with this approach is the unnecessary O(n log n) time complexity. Sorting is overkill when we only need to find the minimum and maximum values, which can be done in a single O(n) pass.

## Optimal Solution

The optimal solution finds the minimum, maximum, and total sum in a single pass through the array. We then subtract the min and max from the total sum and divide by (n - 2), where n is the length of the array.

<div class="code-group">

```python
# Time: O(n) - single pass through the array
# Space: O(1) - only using constant extra space
def average(salary):
    # Initialize min_salary to a very large number
    # We use float('inf') so any salary will be smaller
    min_salary = float('inf')

    # Initialize max_salary to a very small number
    # We use float('-inf') so any salary will be larger
    max_salary = float('-inf')

    # Initialize total sum to 0
    total = 0

    # Iterate through each salary in the array
    for s in salary:
        # Update min_salary if current salary is smaller
        if s < min_salary:
            min_salary = s

        # Update max_salary if current salary is larger
        if s > max_salary:
            max_salary = s

        # Add current salary to running total
        total += s

    # Subtract min and max salaries from total
    # This excludes them from the sum
    total -= min_salary + max_salary

    # Calculate average: adjusted total divided by (n - 2)
    # We use float division to ensure decimal result
    # len(salary) - 2 because we excluded 2 salaries
    return total / (len(salary) - 2)
```

```javascript
// Time: O(n) - single pass through the array
// Space: O(1) - only using constant extra space
function average(salary) {
  // Initialize minSalary to the largest possible number
  // Using Infinity ensures any salary will be smaller
  let minSalary = Infinity;

  // Initialize maxSalary to the smallest possible number
  // Using -Infinity ensures any salary will be larger
  let maxSalary = -Infinity;

  // Initialize total sum to 0
  let total = 0;

  // Iterate through each salary in the array
  for (let s of salary) {
    // Update minSalary if current salary is smaller
    if (s < minSalary) {
      minSalary = s;
    }

    // Update maxSalary if current salary is larger
    if (s > maxSalary) {
      maxSalary = s;
    }

    // Add current salary to running total
    total += s;
  }

  // Subtract min and max salaries from total
  // This excludes them from the sum
  total -= minSalary + maxSalary;

  // Calculate average: adjusted total divided by (n - 2)
  // We need to ensure floating point division
  // salary.length - 2 because we excluded 2 salaries
  return total / (salary.length - 2);
}
```

```java
// Time: O(n) - single pass through the array
// Space: O(1) - only using constant extra space
public double average(int[] salary) {
    // Initialize minSalary to the maximum possible integer value
    // This ensures any salary will be smaller
    int minSalary = Integer.MAX_VALUE;

    // Initialize maxSalary to the minimum possible integer value
    // This ensures any salary will be larger
    int maxSalary = Integer.MIN_VALUE;

    // Initialize total sum to 0
    int total = 0;

    // Iterate through each salary in the array
    for (int s : salary) {
        // Update minSalary if current salary is smaller
        if (s < minSalary) {
            minSalary = s;
        }

        // Update maxSalary if current salary is larger
        if (s > maxSalary) {
            maxSalary = s;
        }

        // Add current salary to running total
        total += s;
    }

    // Subtract min and max salaries from total
    // This excludes them from the sum
    total -= minSalary + maxSalary;

    // Calculate average: adjusted total divided by (n - 2)
    // We cast to double to ensure floating point division
    // salary.length - 2 because we excluded 2 salaries
    return (double) total / (salary.length - 2);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length n
- Each iteration performs constant-time operations (comparisons and addition)
- This is optimal since we must examine each element at least once

**Space Complexity: O(1)**

- We only use a fixed number of variables (min, max, total, loop counter)
- No additional data structures are created
- The space used does not grow with input size

## Common Mistakes

1. **Forgetting to handle the case with only 2 salaries**: While the problem guarantees at least 3 salaries (since we need to exclude min and max and still have salaries left), some candidates might not consider what happens if n = 2. In that case, dividing by (n - 2) would mean dividing by 0.

2. **Using integer division instead of float division**: In languages like Java and JavaScript, dividing two integers gives an integer result. You need to cast to float/double to get the correct decimal average.

3. **Initializing min/max incorrectly**: Starting min with 0 or max with 0 can cause issues if all salaries are negative or positive. Always initialize min to the largest possible value and max to the smallest possible value.

4. **Sorting unnecessarily**: While sorting works, it's inefficient (O(n log n) vs O(n)). Interviewers expect you to recognize that sorting is overkill when you only need min and max.

## When You'll See This Pattern

This pattern of finding min/max while accumulating a sum in a single pass appears in many problems:

1. **Maximum Subarray (LeetCode 53)**: While different in goal, it uses a similar single-pass accumulation technique with tracking of optimal values.

2. **Best Time to Buy and Sell Stock (LeetCode 121)**: You track the minimum price seen so far while calculating maximum profit, similar to tracking min while calculating something else.

3. **Find Minimum and Maximum in Array**: Any problem requiring both min and max values from an array can use this efficient single-pass approach instead of sorting.

The core technique is the "single pass with tracking" pattern, where you maintain running values (min, max, sum, count, etc.) as you iterate through data once.

## Key Takeaways

1. **Don't sort when you only need extremes**: If a problem only requires finding minimum, maximum, or both, you can do it in O(n) time without sorting's O(n log n) overhead.

2. **Single-pass accumulation is powerful**: Many problems can be solved by making one pass through the data while maintaining running totals or tracking optimal values.

3. **Initialize tracking variables carefully**: When tracking min/max, initialize min to the largest possible value and max to the smallest possible value to ensure correct updates on the first iteration.

[Practice this problem on CodeJeet](/problem/average-salary-excluding-the-minimum-and-maximum-salary)
