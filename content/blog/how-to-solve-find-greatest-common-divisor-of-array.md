---
title: "How to Solve Find Greatest Common Divisor of Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Greatest Common Divisor of Array. Easy difficulty, 79.7% acceptance rate. Topics: Array, Math, Number Theory."
date: "2028-06-05"
category: "dsa-patterns"
tags: ["find-greatest-common-divisor-of-array", "array", "math", "number-theory", "easy"]
---

## How to Solve Find Greatest Common Divisor of Array

This problem asks us to find the greatest common divisor (GCD) of the smallest and largest numbers in an array. While it appears straightforward, it tests your understanding of number theory fundamentals and your ability to implement the Euclidean algorithm efficiently. The interesting part is recognizing that you don't need to compute GCDs for all pairs—just for the two extreme values in the array.

## Visual Walkthrough

Let's trace through an example: `nums = [6, 9, 15, 21]`

**Step 1: Find the smallest and largest numbers**

- Smallest: 6
- Largest: 21

**Step 2: Apply the Euclidean algorithm to find GCD(6, 21)**
The Euclidean algorithm states that GCD(a, b) = GCD(b, a mod b)

1. Start with a = 21, b = 6
2. Compute 21 mod 6 = 3 (since 21 ÷ 6 = 3 remainder 3)
3. Now find GCD(6, 3)
4. Compute 6 mod 3 = 0
5. When the remainder is 0, the divisor (3) is the GCD

**Step 3: Verify**

- 6 ÷ 3 = 2 (exact division)
- 21 ÷ 3 = 7 (exact division)
- No number larger than 3 divides both 6 and 21

Thus, the answer is 3.

## Brute Force Approach

A naive approach would be to:

1. Find the smallest and largest numbers in the array
2. Start from the smaller number and count down to 1
3. Check if both numbers are divisible by each candidate
4. Return the first (largest) candidate that divides both

<div class="code-group">

```python
# Time: O(min(a, b)) | Space: O(1)
def findGCD(nums):
    # Step 1: Find min and max
    min_num = min(nums)
    max_num = max(nums)

    # Step 2: Check divisors from min_num down to 1
    for divisor in range(min_num, 0, -1):
        if min_num % divisor == 0 and max_num % divisor == 0:
            return divisor

    return 1  # Always at least 1 divides everything
```

```javascript
// Time: O(min(a, b)) | Space: O(1)
function findGCD(nums) {
  // Step 1: Find min and max
  const minNum = Math.min(...nums);
  const maxNum = Math.max(...nums);

  // Step 2: Check divisors from minNum down to 1
  for (let divisor = minNum; divisor >= 1; divisor--) {
    if (minNum % divisor === 0 && maxNum % divisor === 0) {
      return divisor;
    }
  }

  return 1; // Always at least 1 divides everything
}
```

```java
// Time: O(min(a, b)) | Space: O(1)
public int findGCD(int[] nums) {
    // Step 1: Find min and max
    int minNum = Integer.MAX_VALUE;
    int maxNum = Integer.MIN_VALUE;

    for (int num : nums) {
        minNum = Math.min(minNum, num);
        maxNum = Math.max(maxNum, num);
    }

    // Step 2: Check divisors from minNum down to 1
    for (int divisor = minNum; divisor >= 1; divisor--) {
        if (minNum % divisor == 0 && maxNum % divisor == 0) {
            return divisor;
        }
    }

    return 1;  // Always at least 1 divides everything
}
```

</div>

**Why this is inefficient:**
The brute force approach takes O(min(a, b)) time, which could be up to O(10^9) if the numbers are large. The Euclidean algorithm reduces this to O(log(min(a, b))), making it exponentially faster for large inputs.

## Optimal Solution

The optimal solution uses the Euclidean algorithm, which is based on the mathematical property:
GCD(a, b) = GCD(b, a mod b)

We can implement this recursively or iteratively. The iterative approach is preferred in interviews because it avoids stack overflow concerns and is more space-efficient.

<div class="code-group">

```python
# Time: O(log(min(a, b))) | Space: O(1)
def findGCD(nums):
    # Step 1: Find the smallest and largest numbers in the array
    # We need these two values to compute their GCD
    min_num = min(nums)
    max_num = max(nums)

    # Step 2: Use Euclidean algorithm to find GCD
    # Keep reducing the problem until remainder is 0
    while min_num > 0:
        # Store current min_num before modifying it
        temp = min_num
        # Update min_num to be the remainder of max_num divided by min_num
        min_num = max_num % min_num
        # Update max_num to be the previous min_num
        max_num = temp

    # When min_num becomes 0, max_num contains the GCD
    return max_num
```

```javascript
// Time: O(log(min(a, b))) | Space: O(1)
function findGCD(nums) {
  // Step 1: Find the smallest and largest numbers in the array
  // We need these two values to compute their GCD
  let minNum = Math.min(...nums);
  let maxNum = Math.max(...nums);

  // Step 2: Use Euclidean algorithm to find GCD
  // Keep reducing the problem until remainder is 0
  while (minNum > 0) {
    // Store current minNum before modifying it
    const temp = minNum;
    // Update minNum to be the remainder of maxNum divided by minNum
    minNum = maxNum % minNum;
    // Update maxNum to be the previous minNum
    maxNum = temp;
  }

  // When minNum becomes 0, maxNum contains the GCD
  return maxNum;
}
```

```java
// Time: O(log(min(a, b))) | Space: O(1)
public int findGCD(int[] nums) {
    // Step 1: Find the smallest and largest numbers in the array
    // We need these two values to compute their GCD
    int minNum = Integer.MAX_VALUE;
    int maxNum = Integer.MIN_VALUE;

    for (int num : nums) {
        minNum = Math.min(minNum, num);
        maxNum = Math.max(maxNum, num);
    }

    // Step 2: Use Euclidean algorithm to find GCD
    // Keep reducing the problem until remainder is 0
    while (minNum > 0) {
        // Store current minNum before modifying it
        int temp = minNum;
        // Update minNum to be the remainder of maxNum divided by minNum
        minNum = maxNum % minNum;
        // Update maxNum to be the previous minNum
        maxNum = temp;
    }

    // When minNum becomes 0, maxNum contains the GCD
    return maxNum;
}
```

</div>

**Why the Euclidean algorithm works:**
The key insight is that any divisor of both `a` and `b` must also divide `a - b`. When we take `a mod b`, we're essentially subtracting `b` multiple times from `a`. This reduces the numbers quickly—each step reduces the larger number by at least half in the worst case.

## Complexity Analysis

**Time Complexity: O(log(min(a, b)))**

- Finding min and max takes O(n) where n is the array length
- The Euclidean algorithm takes O(log(min(a, b))) iterations
- Since n can be up to 50 and numbers up to 1000, the Euclidean algorithm dominates
- Each iteration of the while loop reduces the problem size significantly

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures are needed
- The iterative approach avoids recursion stack

## Common Mistakes

1. **Forgetting to handle the case where min_num becomes 0**
   - If you don't check `while (min_num > 0)`, you'll get division by zero
   - The Euclidean algorithm terminates when the remainder is 0

2. **Swapping min and max incorrectly**
   - The algorithm requires `max_num % min_num`, not `min_num % max_num`
   - If you reverse them, you'll get incorrect results or infinite loops

3. **Not understanding why we only need min and max**
   - Some candidates try to compute GCD for all pairs
   - Remember: GCD(a, b, c) = GCD(GCD(a, b), c)
   - The GCD of all numbers equals the GCD of the extremes

4. **Using integer division instead of modulo**
   - `max_num / min_num` gives quotient, not remainder
   - You need `max_num % min_num` for the Euclidean algorithm

## When You'll See This Pattern

The Euclidean algorithm pattern appears in problems involving:

- Number theory and divisibility
- Reducing fractions to simplest form
- Problems where you need to find common divisors or multiples

**Related problems:**

1. **Greatest Common Divisor of Strings (Easy)** - Uses the same GCD concept but applied to strings. If a string can be formed by repeating a pattern, the pattern length divides the string length.
2. **Number of Different Subsequences GCDs (Hard)** - Builds on GCD concepts for subsequences of an array.
3. **Three Divisors (Easy)** - Tests understanding of divisors and number properties.

## Key Takeaways

1. **The Euclidean algorithm is the standard way to compute GCD** - It's efficient (O(log n)) and easy to implement iteratively.
2. **GCD has the property GCD(a, b, c) = GCD(GCD(a, b), c)** - This means you can compute GCD incrementally and only need the extreme values.
3. **Always test with edge cases** - Try arrays with duplicate values, arrays where min = max, and arrays with 1 as the smallest number.

**Remember:** When you see "greatest common divisor" in a problem description, your first thought should be the Euclidean algorithm. It's one of those fundamental algorithms that every software engineer should know by heart.

Related problems: [Greatest Common Divisor of Strings](/problem/greatest-common-divisor-of-strings), [Number of Different Subsequences GCDs](/problem/number-of-different-subsequences-gcds), [Three Divisors](/problem/three-divisors)
