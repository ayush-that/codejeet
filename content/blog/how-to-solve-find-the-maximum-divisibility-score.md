---
title: "How to Solve Find the Maximum Divisibility Score — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Maximum Divisibility Score. Easy difficulty, 51.6% acceptance rate. Topics: Array."
date: "2028-10-29"
category: "dsa-patterns"
tags: ["find-the-maximum-divisibility-score", "array", "easy"]
---

# How to Solve Find the Maximum Divisibility Score

You’re given two arrays: `nums` (a list of numbers) and `divisors` (a list of potential divisors). For each divisor, you need to count how many numbers in `nums` it divides evenly. Your task is to return the divisor with the highest count—and if there’s a tie, return the smallest divisor. This problem is interesting because it’s straightforward conceptually, but requires careful handling of ties and edge cases like negative numbers or zero divisors.

## Visual Walkthrough

Let’s walk through an example to build intuition.

**Example:**  
`nums = [4, 7, 9, 16]`  
`divisors = [2, 4, 7, 8]`

We’ll calculate the divisibility score for each divisor:

1. **Divisor 2**
   - 4 ÷ 2 = 2 (remainder 0) ✅
   - 7 ÷ 2 = 3 remainder 1 ❌
   - 9 ÷ 2 = 4 remainder 1 ❌
   - 16 ÷ 2 = 8 (remainder 0) ✅  
     Score = 2

2. **Divisor 4**
   - 4 ÷ 4 = 1 ✅
   - 7 ÷ 4 = 1 remainder 3 ❌
   - 9 ÷ 4 = 2 remainder 1 ❌
   - 16 ÷ 4 = 4 ✅  
     Score = 2

3. **Divisor 7**
   - 4 ÷ 7 = 0 remainder 4 ❌
   - 7 ÷ 7 = 1 ✅
   - 9 ÷ 7 = 1 remainder 2 ❌
   - 16 ÷ 7 = 2 remainder 2 ❌  
     Score = 1

4. **Divisor 8**
   - 4 ÷ 8 = 0 remainder 4 ❌
   - 7 ÷ 8 = 0 remainder 7 ❌
   - 9 ÷ 8 = 1 remainder 1 ❌
   - 16 ÷ 8 = 2 ✅  
     Score = 1

Both divisors 2 and 4 have the maximum score of 2. According to the problem, when there’s a tie, we return the **smallest** divisor. So the answer is **2**.

This walkthrough shows the core logic: for each divisor, iterate through `nums`, count divisible elements, track the best score, and handle ties by choosing the smaller divisor.

## Brute Force Approach

The brute force solution directly implements the definition: for each divisor, loop through all numbers, count how many are divisible, and keep track of the best divisor seen so far.

Why is this considered brute force? Because we’re checking every divisor against every number without any optimization. For `n` numbers and `d` divisors, this results in `O(n * d)` operations.

While this is actually the optimal approach for this problem (since we must examine each pair to compute the score), some candidates might try to precompute divisors of each number or use mathematical shortcuts. However, those approaches don’t improve the worst-case complexity because in the worst case, every divisor could divide every number, requiring us to check all pairs anyway.

The key insight is that the brute force approach is already optimal for this problem—but we need to implement it carefully to handle edge cases and tie-breaking correctly.

## Optimal Solution

The optimal solution follows the brute force approach but with careful implementation. We:

1. Initialize variables to track the best divisor and highest score.
2. For each divisor, count how many numbers it divides.
3. Update the best divisor if we find a higher score, or if we find an equal score with a smaller divisor.
4. Return the best divisor.

<div class="code-group">

```python
# Time: O(n * d) where n = len(nums), d = len(divisors)
# Space: O(1) - only using a few variables
def maxDivScore(nums, divisors):
    # Initialize with the first divisor as the best candidate
    best_divisor = divisors[0]
    max_score = 0

    # Calculate initial score for the first divisor
    for num in nums:
        if num % best_divisor == 0:
            max_score += 1

    # Check remaining divisors
    for i in range(1, len(divisors)):
        divisor = divisors[i]
        current_score = 0

        # Count how many numbers this divisor divides
        for num in nums:
            if num % divisor == 0:
                current_score += 1

        # Update best divisor if:
        # 1. We found a higher score, OR
        # 2. Same score but smaller divisor (tie-breaking rule)
        if current_score > max_score or (current_score == max_score and divisor < best_divisor):
            max_score = current_score
            best_divisor = divisor

    return best_divisor
```

```javascript
// Time: O(n * d) where n = nums.length, d = divisors.length
// Space: O(1) - only using a few variables
function maxDivScore(nums, divisors) {
  // Initialize with the first divisor as the best candidate
  let bestDivisor = divisors[0];
  let maxScore = 0;

  // Calculate initial score for the first divisor
  for (let num of nums) {
    if (num % bestDivisor === 0) {
      maxScore++;
    }
  }

  // Check remaining divisors
  for (let i = 1; i < divisors.length; i++) {
    const divisor = divisors[i];
    let currentScore = 0;

    // Count how many numbers this divisor divides
    for (let num of nums) {
      if (num % divisor === 0) {
        currentScore++;
      }
    }

    // Update best divisor if:
    // 1. We found a higher score, OR
    // 2. Same score but smaller divisor (tie-breaking rule)
    if (currentScore > maxScore || (currentScore === maxScore && divisor < bestDivisor)) {
      maxScore = currentScore;
      bestDivisor = divisor;
    }
  }

  return bestDivisor;
}
```

```java
// Time: O(n * d) where n = nums.length, d = divisors.length
// Space: O(1) - only using a few variables
public int maxDivScore(int[] nums, int[] divisors) {
    // Initialize with the first divisor as the best candidate
    int bestDivisor = divisors[0];
    int maxScore = 0;

    // Calculate initial score for the first divisor
    for (int num : nums) {
        if (num % bestDivisor == 0) {
            maxScore++;
        }
    }

    // Check remaining divisors
    for (int i = 1; i < divisors.length; i++) {
        int divisor = divisors[i];
        int currentScore = 0;

        // Count how many numbers this divisor divides
        for (int num : nums) {
            if (num % divisor == 0) {
                currentScore++;
            }
        }

        // Update best divisor if:
        // 1. We found a higher score, OR
        // 2. Same score but smaller divisor (tie-breaking rule)
        if (currentScore > maxScore ||
            (currentScore == maxScore && divisor < bestDivisor)) {
            maxScore = currentScore;
            bestDivisor = divisor;
        }
    }

    return bestDivisor;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × d) where n is the length of `nums` and d is the length of `divisors`.

- We iterate through each divisor (d iterations)
- For each divisor, we iterate through all numbers (n iterations)
- Each divisibility check (modulo operation) is O(1)
- Total operations = d × n × O(1) = O(n × d)

**Space Complexity:** O(1)

- We only use a few variables (`best_divisor`, `max_score`, `current_score`, loop counters)
- No additional data structures that grow with input size

This is the optimal time complexity because in the worst case, we must check every divisor against every number to compute the scores accurately.

## Common Mistakes

1. **Forgetting to handle negative numbers correctly**  
   The modulo operator works correctly with negative numbers in most languages (e.g., `-4 % 2 == 0`), but some candidates might add unnecessary absolute value operations or incorrect checks.

2. **Incorrect tie-breaking logic**  
   The problem specifies: "If multiple integers have the maximum score, return the minimum of them." A common mistake is returning the first divisor with the maximum score instead of the smallest one. Always compare divisors when scores are equal.

3. **Not initializing properly**  
   Some candidates initialize `max_score = 0` and `best_divisor = 0`, but 0 might not be in the divisors array. Always initialize with actual values from the input.

4. **Optimization attempts that break correctness**  
   Trying to sort divisors or nums to break early from loops can lead to incorrect results. For example, sorting divisors and returning the first with maximum score might not give the smallest divisor if they're not processed in ascending order.

## When You'll See This Pattern

This problem uses the **nested iteration with counting** pattern, which appears in many array problems:

1. **Count Items Matching a Rule (LeetCode 1773)** - Similar nested iteration to count items that match certain conditions.
2. **Find Numbers with Even Number of Digits (LeetCode 1295)** - Iterate through array, count based on a property.
3. **Binary Prefix Divisible By 5 (LeetCode 1018)** - While not identical, it involves iterating and checking divisibility properties.

The core pattern is: for each element in one collection, check all elements in another collection and accumulate counts. This pattern is fundamental for problems involving pairwise comparisons or property checking.

## Key Takeaways

1. **Sometimes brute force is optimal** - When you must examine all pairs, O(n²) or O(n×m) might be the best you can do. Don't waste time looking for nonexistent optimizations.
2. **Read tie-breaking rules carefully** - Many problems have specific rules for ties (smallest, largest, lexicographically first, etc.). Implement these precisely.
3. **Test with edge cases** - Always test with: empty arrays (though constraints say non-empty), negative numbers, zeros, and duplicate values.

Related problems: [Binary Prefix Divisible By 5](/problem/binary-prefix-divisible-by-5)
