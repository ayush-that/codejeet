---
title: "How to Solve Divisible and Non-divisible Sums Difference — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Divisible and Non-divisible Sums Difference. Easy difficulty, 91.0% acceptance rate. Topics: Math."
date: "2027-12-07"
category: "dsa-patterns"
tags: ["divisible-and-non-divisible-sums-difference", "math", "easy"]
---

# How to Solve Divisible and Non-divisible Sums Difference

This problem asks us to calculate the difference between two sums: the sum of numbers from 1 to n that are NOT divisible by m, and the sum of numbers from 1 to n that ARE divisible by m. While the problem seems straightforward, the interesting part is recognizing that we can solve it efficiently using mathematical formulas rather than iterating through every number. The challenge lies in understanding how to compute these sums without brute force.

## Visual Walkthrough

Let's trace through an example with `n = 10` and `m = 3`:

**Step 1: Identify divisible numbers**
Numbers from 1 to 10 divisible by 3: 3, 6, 9
Sum of divisible numbers (num2): 3 + 6 + 9 = 18

**Step 2: Identify non-divisible numbers**
Numbers from 1 to 10 NOT divisible by 3: 1, 2, 4, 5, 7, 8, 10
Sum of non-divisible numbers (num1): 1 + 2 + 4 + 5 + 7 + 8 + 10 = 37

**Step 3: Calculate the difference**
num1 - num2 = 37 - 18 = 19

But here's the key insight: We don't actually need to calculate both sums separately. Notice that:

- Total sum of numbers from 1 to 10 = 1+2+3+4+5+6+7+8+9+10 = 55
- Sum of divisible numbers = 18
- Therefore, sum of non-divisible numbers = 55 - 18 = 37

So the difference becomes: (55 - 18) - 18 = 55 - 2×18 = 19

This means we only need to calculate:

1. The total sum from 1 to n (using the formula n×(n+1)/2)
2. The sum of numbers divisible by m from 1 to n

## Brute Force Approach

The most straightforward approach is to iterate through all numbers from 1 to n, check if each is divisible by m, and accumulate the sums:

1. Initialize `num1 = 0` (sum of non-divisible numbers)
2. Initialize `num2 = 0` (sum of divisible numbers)
3. For each `i` from 1 to n:
   - If `i % m == 0`: add `i` to `num2`
   - Else: add `i` to `num1`
4. Return `num1 - num2`

**Why this isn't optimal:**

- Time complexity is O(n), which works fine for small n
- But if n is very large (like 10^9), iterating through every number would be too slow
- The problem constraints don't specify n's maximum value, but in coding interviews, we should aim for the most efficient solution

## Optimal Solution

The optimal solution uses mathematical formulas to compute the sums in O(1) time:

1. **Total sum from 1 to n**: Use the formula `total = n × (n + 1) / 2`
2. **Sum of numbers divisible by m**:
   - Count how many numbers divisible by m exist: `count = n // m`
   - These numbers form an arithmetic sequence: m, 2m, 3m, ..., count×m
   - Sum of arithmetic sequence: `sumDivisible = m × count × (count + 1) / 2`
3. **Sum of non-divisible numbers**: `total - sumDivisible`
4. **Difference**: `(total - sumDivisible) - sumDivisible = total - 2 × sumDivisible`

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def differenceOfSums(self, n: int, m: int) -> int:
    # Step 1: Calculate total sum of numbers from 1 to n
    # Using formula: n * (n + 1) / 2
    total_sum = n * (n + 1) // 2

    # Step 2: Count how many numbers are divisible by m
    # Integer division gives us the count of multiples of m ≤ n
    count_divisible = n // m

    # Step 3: Calculate sum of numbers divisible by m
    # These numbers form an arithmetic sequence: m, 2m, 3m, ..., count_divisible * m
    # Sum = m * (1 + 2 + ... + count_divisible) = m * count_divisible * (count_divisible + 1) / 2
    sum_divisible = m * count_divisible * (count_divisible + 1) // 2

    # Step 4: Calculate the difference
    # num1 (sum of non-divisible) = total_sum - sum_divisible
    # num2 (sum of divisible) = sum_divisible
    # Difference = (total_sum - sum_divisible) - sum_divisible = total_sum - 2 * sum_divisible
    return total_sum - 2 * sum_divisible
```

```javascript
// Time: O(1) | Space: O(1)
function differenceOfSums(n, m) {
  // Step 1: Calculate total sum of numbers from 1 to n
  // Using formula: n * (n + 1) / 2
  const totalSum = (n * (n + 1)) / 2;

  // Step 2: Count how many numbers are divisible by m
  // Math.floor gives us the count of multiples of m ≤ n
  const countDivisible = Math.floor(n / m);

  // Step 3: Calculate sum of numbers divisible by m
  // These numbers form an arithmetic sequence: m, 2m, 3m, ..., countDivisible * m
  // Sum = m * (1 + 2 + ... + countDivisible) = m * countDivisible * (countDivisible + 1) / 2
  const sumDivisible = (m * countDivisible * (countDivisible + 1)) / 2;

  // Step 4: Calculate the difference
  // num1 (sum of non-divisible) = totalSum - sumDivisible
  // num2 (sum of divisible) = sumDivisible
  // Difference = (totalSum - sumDivisible) - sumDivisible = totalSum - 2 * sumDivisible
  return totalSum - 2 * sumDivisible;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int differenceOfSums(int n, int m) {
        // Step 1: Calculate total sum of numbers from 1 to n
        // Using formula: n * (n + 1) / 2
        int totalSum = n * (n + 1) / 2;

        // Step 2: Count how many numbers are divisible by m
        // Integer division gives us the count of multiples of m ≤ n
        int countDivisible = n / m;

        // Step 3: Calculate sum of numbers divisible by m
        // These numbers form an arithmetic sequence: m, 2m, 3m, ..., countDivisible * m
        // Sum = m * (1 + 2 + ... + countDivisible) = m * countDivisible * (countDivisible + 1) / 2
        int sumDivisible = m * countDivisible * (countDivisible + 1) / 2;

        // Step 4: Calculate the difference
        // num1 (sum of non-divisible) = totalSum - sumDivisible
        // num2 (sum of divisible) = sumDivisible
        // Difference = (totalSum - sumDivisible) - sumDivisible = totalSum - 2 * sumDivisible
        return totalSum - 2 * sumDivisible;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- All operations are constant time: arithmetic operations and integer division
- No loops or recursion, regardless of input size

**Space Complexity: O(1)**

- We only use a few variables to store intermediate results
- Memory usage doesn't grow with input size

## Common Mistakes

1. **Using integer division incorrectly**: When calculating `countDivisible = n // m`, remember this gives the floor division. Some candidates might try to calculate it differently and get off-by-one errors.

2. **Forgetting integer overflow**: In languages like Java, when n is large (close to 10^9), `n * (n + 1)` can overflow even for 32-bit integers. The problem constraints keep n ≤ 1000, but in interviews, it's good to mention using `long` for intermediate calculations if n could be larger.

3. **Calculating both sums separately**: Some candidates calculate num1 by iterating through non-divisible numbers and num2 by iterating through divisible numbers. This is O(n) time and misses the optimization of using the total sum formula.

4. **Incorrect arithmetic sequence formula**: When calculating the sum of divisible numbers, remember it's `m × count × (count + 1) / 2`, not `count × (count + 1) / 2`. The factor of m is crucial because we're summing m, 2m, 3m, etc.

## When You'll See This Pattern

This problem combines two fundamental mathematical patterns:

1. **Sum of arithmetic sequences**: The formula `n × (n + 1) / 2` appears in many problems:
   - [Missing Number](https://leetcode.com/problems/missing-number/): Find the missing number in 0..n by comparing expected sum vs actual sum
   - [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/): Precompute prefix sums for O(1) range queries

2. **Counting multiples and using divisibility**: Problems involving divisibility often use `n // m` to count multiples:
   - [Fizz Buzz](https://leetcode.com/problems/fizz-buzz/): Check divisibility by 3 and 5
   - [Count Integers With Even Digit Sum](https://leetcode.com/problems/count-integers-with-even-digit-sum/): Similar counting logic

The key insight is recognizing when you can replace iteration with mathematical formulas, especially when dealing with ranges or sequences.

## Key Takeaways

1. **Look for mathematical optimizations**: When a problem involves sums over ranges or sequences, consider if there's a known formula that can replace iteration. The sum of 1 to n and sum of arithmetic sequences are two of the most common.

2. **Think about complements**: Instead of calculating two related quantities separately, see if one can be derived from the other. Here, the sum of non-divisible numbers is just the total sum minus the sum of divisible numbers.

3. **Divisibility counting trick**: To count how many numbers from 1 to n are divisible by m, use integer division `n // m`. This is much faster than checking each number individually.

[Practice this problem on CodeJeet](/problem/divisible-and-non-divisible-sums-difference)
