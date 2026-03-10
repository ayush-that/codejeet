---
title: "How to Solve   Count Symmetric Integers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode   Count Symmetric Integers. Easy difficulty, 83.1% acceptance rate. Topics: Math, Enumeration."
date: "2026-02-07"
category: "dsa-patterns"
tags: ["count-symmetric-integers", "math", "enumeration", "easy"]
---

# How to Solve "Count Symmetric Integers"

This problem asks us to count how many integers between `low` and `high` (inclusive) are "symmetric" — meaning they have an even number of digits, and the sum of the first half of digits equals the sum of the second half. The tricky part is efficiently checking each number while handling the digit-sum comparison correctly. It's interesting because it combines digit manipulation with range iteration, testing your ability to break down numbers into their components.

## Visual Walkthrough

Let's trace through an example with `low = 1200` and `high = 1230`:

1. **1200**: Digits are [1,2,0,0] (4 digits, even). First half sum = 1+2 = 3. Second half sum = 0+0 = 0. Not symmetric.
2. **1201**: [1,2,0,1]. First half: 1+2=3. Second half: 0+1=1. Not symmetric.
3. **1202**: [1,2,0,2]. First half: 3. Second half: 2. Not symmetric.
4. **1203**: [1,2,0,3]. First half: 3. Second half: 3. **Symmetric!** Count = 1.
5. **1204**: [1,2,0,4]. First half: 3. Second half: 4. Not symmetric.
6. Continue checking up to 1230...

Notice that numbers with odd digit counts (like 123 with 3 digits) are automatically excluded. The key insight is that for each number, we need to:

1. Count its digits
2. If digit count is odd, skip
3. Split digits into two halves
4. Compare sums

## Brute Force Approach

The most straightforward approach is to iterate through every integer from `low` to `high`, convert each to a string, check if it has an even number of digits, then calculate digit sums for both halves.

While this approach is conceptually simple, it's actually optimal for this problem since the constraints are reasonable (`1 <= low <= high <= 10^4`). However, let's consider what a truly naive approach might miss:

A candidate might try to pre-compute all symmetric numbers up to some limit, but that's unnecessary. They might also try mathematical formulas to skip numbers, but given the small range, simple iteration is fine.

The brute force approach would have O(n × d) time complexity where n is the range size and d is the average number of digits. For this problem's constraints, that's perfectly acceptable.

## Optimal Solution

Since the constraints are small (up to 10^4), we can simply iterate through all numbers and check each one. The optimal approach is essentially the brute force approach with careful implementation.

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * d) where n = high-low+1, d = average digits
# Space: O(d) for storing digit strings
def countSymmetricIntegers(low: int, high: int) -> int:
    count = 0

    # Iterate through every number in the range
    for num in range(low, high + 1):
        # Convert number to string to easily access digits
        num_str = str(num)
        length = len(num_str)

        # Numbers with odd number of digits cannot be symmetric
        if length % 2 != 0:
            continue

        # Calculate midpoint to split the number into two halves
        mid = length // 2

        # Calculate sum of first half digits
        first_sum = 0
        for i in range(mid):
            first_sum += int(num_str[i])

        # Calculate sum of second half digits
        second_sum = 0
        for i in range(mid, length):
            second_sum += int(num_str[i])

        # Check if sums are equal
        if first_sum == second_sum:
            count += 1

    return count
```

```javascript
// Time: O(n * d) where n = high-low+1, d = average digits
// Space: O(d) for storing digit strings
function countSymmetricIntegers(low, high) {
  let count = 0;

  // Iterate through every number in the range
  for (let num = low; num <= high; num++) {
    // Convert number to string to easily access digits
    const numStr = num.toString();
    const length = numStr.length;

    // Numbers with odd number of digits cannot be symmetric
    if (length % 2 !== 0) {
      continue;
    }

    // Calculate midpoint to split the number into two halves
    const mid = Math.floor(length / 2);

    // Calculate sum of first half digits
    let firstSum = 0;
    for (let i = 0; i < mid; i++) {
      firstSum += parseInt(numStr[i], 10);
    }

    // Calculate sum of second half digits
    let secondSum = 0;
    for (let i = mid; i < length; i++) {
      secondSum += parseInt(numStr[i], 10);
    }

    // Check if sums are equal
    if (firstSum === secondSum) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n * d) where n = high-low+1, d = average digits
// Space: O(d) for storing digit strings
class Solution {
    public int countSymmetricIntegers(int low, int high) {
        int count = 0;

        // Iterate through every number in the range
        for (int num = low; num <= high; num++) {
            // Convert number to string to easily access digits
            String numStr = Integer.toString(num);
            int length = numStr.length();

            // Numbers with odd number of digits cannot be symmetric
            if (length % 2 != 0) {
                continue;
            }

            // Calculate midpoint to split the number into two halves
            int mid = length / 2;

            // Calculate sum of first half digits
            int firstSum = 0;
            for (int i = 0; i < mid; i++) {
                firstSum += numStr.charAt(i) - '0';
            }

            // Calculate sum of second half digits
            int secondSum = 0;
            for (int i = mid; i < length; i++) {
                secondSum += numStr.charAt(i) - '0';
            }

            // Check if sums are equal
            if (firstSum == secondSum) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d) where n = high - low + 1 (the number of integers in the range) and d is the average number of digits per number. In the worst case with high = 10^4, we have about 10,000 numbers with up to 5 digits each, resulting in about 50,000 operations — very efficient.

**Space Complexity:** O(d) where d is the maximum number of digits in any number. We store the string representation of each number temporarily while processing it. This is minimal since we process one number at a time.

## Common Mistakes

1. **Forgetting to exclude odd-digit numbers**: The problem states "Numbers with an odd number of digits are never symmetric." Candidates often check all numbers without this filter, counting numbers like 123 (3 digits) incorrectly.

2. **Incorrect midpoint calculation**: Using `length / 2` without integer division in languages like Java or Python 2 can cause issues. Always use integer division or `Math.floor()`.

3. **Off-by-one errors in loops**: When splitting the string into halves, ensure the first loop goes from 0 to mid-1 and the second from mid to length-1. A common mistake is using `range(mid)` vs `range(mid, length)` incorrectly.

4. **Inefficient digit extraction**: Some candidates extract digits using mathematical operations (`num % 10`, `num // 10`) which works but is more error-prone than string conversion for this problem. The string approach is clearer and less prone to off-by-one errors.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Digit manipulation**: Breaking numbers into their constituent digits is common in problems like:
   - [Palindrome Number](/problem/palindrome-number) - Check if a number reads the same forwards and backwards
   - [Sum of Digits in Base K](/problem/sum-of-digits-in-base-k) - Calculate digit sums in different bases
   - [Add Digits](/problem/add-digits) - Repeatedly sum digits until single digit

2. **Range iteration with filtering**: Processing all numbers in a range and applying a condition appears in:
   - [Self Dividing Numbers](/problem/self-dividing-numbers) - Check each number in range for divisibility by its digits
   - [Count Primes](/problem/count-primes) - Count primes in a range (though with more advanced sieving)

3. **Symmetric/balanced structure checking**: The concept of comparing two halves appears in:
   - [Valid Palindrome](/problem/valid-palindrome) - Compare characters from both ends
   - [Palindrome Linked List](/problem/palindrome-linked-list) - Compare first and second halves of a list

## Key Takeaways

1. **When constraints are small, simple iteration is often optimal**: Don't overcomplicate solutions when brute force is efficient enough. For this problem, checking up to 10,000 numbers is trivial.

2. **String conversion simplifies digit manipulation**: While mathematical digit extraction (`% 10`, `// 10`) is more efficient in theory, string conversion makes the code clearer and less error-prone for interview settings.

3. **Always read problem constraints carefully**: The definition of "symmetric" here is specific (even digits only, sum equality). Missing any part of the definition leads to incorrect solutions.

Related problems: [Palindrome Number](/problem/palindrome-number), [Sum of Digits in Base K](/problem/sum-of-digits-in-base-k)
