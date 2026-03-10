---
title: "How to Solve Minimum Operations to Make Binary Palindrome — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Binary Palindrome. Medium difficulty, 51.6% acceptance rate. Topics: Array, Two Pointers, Binary Search, Bit Manipulation."
date: "2030-01-27"
category: "dsa-patterns"
tags:
  [
    "minimum-operations-to-make-binary-palindrome",
    "array",
    "two-pointers",
    "binary-search",
    "medium",
  ]
---

# How to Solve Minimum Operations to Make Binary Palindrome

This problem asks us to transform each number in an array into a binary palindrome using the minimum total number of increment/decrement operations. A binary palindrome is a number whose binary representation reads the same forwards and backwards (ignoring leading zeros). The tricky part is that each number can be transformed independently, but we need to find the optimal binary palindrome target that minimizes the total operations across all numbers.

## Visual Walkthrough

Let's work through an example: `nums = [2, 5, 8]`

**Step 1: Understanding binary palindromes**

- 2 in binary is `10` → not a palindrome
- 5 in binary is `101` → palindrome!
- 8 in binary is `1000` → not a palindrome

**Step 2: Finding nearby binary palindromes**
For each number, we need to find the closest binary palindrome:

For `2` (binary `10`):

- Check 2 itself: `10` → not palindrome
- Check 1: `1` → palindrome (distance = 1)
- Check 3: `11` → palindrome (distance = 1)
- Closest palindrome is either 1 or 3 (distance = 1)

For `5` (binary `101`):

- 5 itself is already a palindrome → distance = 0

For `8` (binary `1000`):

- Check 8: `1000` → not palindrome
- Check 7: `111` → palindrome (distance = 1)
- Check 9: `1001` → palindrome (distance = 1)
- Closest palindrome is either 7 or 9 (distance = 1)

**Step 3: The challenge**
If we transform each number to its nearest palindrome independently:

- 2 → 1 or 3 (cost 1)
- 5 → 5 (cost 0)
- 8 → 7 or 9 (cost 1)
  Total cost = 2

But wait! What if we transform ALL numbers to the SAME binary palindrome?

- If we choose 7: costs are |2-7|=5, |5-7|=2, |8-7|=1 → total = 8
- If we choose 5: costs are |2-5|=3, |5-5|=0, |8-5|=3 → total = 6
- If we choose 3: costs are |2-3|=1, |5-3|=2, |8-3|=5 → total = 8

The independent approach gives us 2, but we need to check if there's a single palindrome that gives us less than 2...

**Step 4: The key insight**
We need to find the optimal single binary palindrome that minimizes total operations. But how do we find it efficiently without checking every possible number?

## Brute Force Approach

The brute force approach would be:

1. Find the maximum number in the array
2. Generate all binary palindromes up to some reasonable bound (say, max(nums) + max possible distance)
3. For each palindrome, calculate the total operations needed to transform all numbers to it
4. Return the minimum total

The problem with this approach:

- How do we determine the upper bound? We could use max(nums) + max(nums) as a safe bound
- Generating all palindromes up to that bound could be O(max(nums)) which is too slow when max(nums) is large
- For each palindrome, we need O(n) operations to calculate total distance
- Overall complexity: O(n × M) where M is the maximum value, which is infeasible for large values

## Optimized Approach

The key insight is that we don't need to check every possible number. Instead, for each number in the array, we only need to consider:

1. The nearest binary palindrome less than or equal to the number
2. The nearest binary palindrome greater than or equal to the number

Why? Because if we pick any other palindrome, we could always pick one of these two and get equal or better total cost for that particular number.

Here's the step-by-step reasoning:

1. **Generate binary palindromes efficiently**: We can generate palindromes by constructing them from their halves. For example:
   - Even-length palindromes: take a number, reverse it, and concatenate
   - Odd-length palindromes: take a number, reverse it (excluding last digit), and concatenate

2. **Find candidate palindromes**: For each number in nums, find the two nearest palindromes (one ≤ the number, one ≥ the number)

3. **Collect all candidates**: Gather all these candidate palindromes into a set

4. **Evaluate candidates**: For each candidate palindrome, calculate the total operations needed to transform all numbers to it

5. **Find minimum**: Return the minimum total operations

The optimization comes from the fact that we only need to check O(n) candidate palindromes instead of O(M) where M could be very large.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n × logM) where M is the maximum value in nums
# Space: O(n) for storing candidate palindromes
def minOperations(nums):
    """
    Returns the minimum total operations to make all numbers binary palindromes.
    Each operation increments or decrements a number by 1.
    """

    def is_palindrome(x):
        """Check if a number is a binary palindrome."""
        # Convert to binary string without '0b' prefix
        binary = bin(x)[2:]
        # Check if it reads the same forwards and backwards
        return binary == binary[::-1]

    def nearest_palindromes(x):
        """Find the nearest binary palindromes ≤ x and ≥ x."""
        # Start with x itself
        lower = x
        while lower >= 0 and not is_palindrome(lower):
            lower -= 1

        # Find the next palindrome ≥ x
        higher = x
        while not is_palindrome(higher):
            higher += 1

        return lower, higher

    # Edge case: empty array
    if not nums:
        return 0

    # Step 1: Collect all candidate palindromes
    candidates = set()

    for num in nums:
        # Get the nearest palindromes for this number
        lower, higher = nearest_palindromes(num)
        candidates.add(lower)
        candidates.add(higher)

    # Step 2: Calculate total operations for each candidate
    min_operations = float('inf')

    for candidate in candidates:
        total_ops = 0
        # Sum the absolute differences between each number and the candidate
        for num in nums:
            total_ops += abs(num - candidate)

        # Update minimum if this candidate gives fewer operations
        if total_ops < min_operations:
            min_operations = total_ops

    return min_operations
```

```javascript
// Time: O(n × logM) where M is the maximum value in nums
// Space: O(n) for storing candidate palindromes
function minOperations(nums) {
  /**
   * Returns the minimum total operations to make all numbers binary palindromes.
   * Each operation increments or decrements a number by 1.
   */

  function isPalindrome(x) {
    // Convert to binary string
    const binary = x.toString(2);
    // Check if it reads the same forwards and backwards
    return binary === binary.split("").reverse().join("");
  }

  function nearestPalindromes(x) {
    // Find the nearest binary palindrome ≤ x
    let lower = x;
    while (lower >= 0 && !isPalindrome(lower)) {
      lower--;
    }

    // Find the nearest binary palindrome ≥ x
    let higher = x;
    while (!isPalindrome(higher)) {
      higher++;
    }

    return [lower, higher];
  }

  // Edge case: empty array
  if (nums.length === 0) {
    return 0;
  }

  // Step 1: Collect all candidate palindromes
  const candidates = new Set();

  for (const num of nums) {
    const [lower, higher] = nearestPalindromes(num);
    candidates.add(lower);
    candidates.add(higher);
  }

  // Step 2: Calculate total operations for each candidate
  let minOperations = Infinity;

  for (const candidate of candidates) {
    let totalOps = 0;
    // Sum the absolute differences between each number and the candidate
    for (const num of nums) {
      totalOps += Math.abs(num - candidate);
    }

    // Update minimum if this candidate gives fewer operations
    if (totalOps < minOperations) {
      minOperations = totalOps;
    }
  }

  return minOperations;
}
```

```java
// Time: O(n × logM) where M is the maximum value in nums
// Space: O(n) for storing candidate palindromes
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int minOperations(int[] nums) {
        /**
         * Returns the minimum total operations to make all numbers binary palindromes.
         * Each operation increments or decrements a number by 1.
         */

        // Helper function to check if a number is a binary palindrome
        private boolean isPalindrome(int x) {
            // Convert to binary string
            String binary = Integer.toBinaryString(x);
            // Check if it reads the same forwards and backwards
            return binary.equals(new StringBuilder(binary).reverse().toString());
        }

        // Helper function to find nearest palindromes
        private int[] nearestPalindromes(int x) {
            // Find the nearest binary palindrome ≤ x
            int lower = x;
            while (lower >= 0 && !isPalindrome(lower)) {
                lower--;
            }

            // Find the nearest binary palindrome ≥ x
            int higher = x;
            while (!isPalindrome(higher)) {
                higher++;
            }

            return new int[]{lower, higher};
        }

        // Edge case: empty array
        if (nums.length == 0) {
            return 0;
        }

        // Step 1: Collect all candidate palindromes
        Set<Integer> candidates = new HashSet<>();

        for (int num : nums) {
            int[] nearest = nearestPalindromes(num);
            candidates.add(nearest[0]);
            candidates.add(nearest[1]);
        }

        // Step 2: Calculate total operations for each candidate
        int minOperations = Integer.MAX_VALUE;

        for (int candidate : candidates) {
            int totalOps = 0;
            // Sum the absolute differences between each number and the candidate
            for (int num : nums) {
                totalOps += Math.abs(num - candidate);
            }

            // Update minimum if this candidate gives fewer operations
            if (totalOps < minOperations) {
                minOperations = totalOps;
            }
        }

        return minOperations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × logM)**

- `n` is the length of the nums array
- `M` is the maximum value in nums
- For each of the `n` numbers, we search for nearest palindromes. In the worst case, we might need to check O(logM) numbers to find a palindrome (since palindromes become more frequent as numbers get larger, and the distance between consecutive palindromes is roughly O(logM)).
- We then evaluate O(2n) = O(n) candidates, each requiring O(n) operations to calculate total distance.
- Total: O(n × logM + n²) = O(n × logM) when logM < n, or O(n²) when n is very small.

**Space Complexity: O(n)**

- We store up to 2n candidate palindromes in a set
- Other variables use constant space

## Common Mistakes

1. **Not handling negative numbers**: The problem doesn't specify that numbers are non-negative, but binary representation typically assumes non-negative integers. In practice, you should clarify with the interviewer. Our solution assumes non-negative by checking `lower >= 0`.

2. **Infinite loops when searching for palindromes**: Always ensure your palindrome search has a termination condition. For the lower bound search, we stop at 0. For the upper bound, we're guaranteed to eventually find a palindrome.

3. **Checking too many candidates**: Some candidates try to check every number between min(nums) and max(nums), which is O(M) and too slow for large M. The insight to only check nearest palindromes for each number is crucial.

4. **Forgetting that 0 is a binary palindrome**: 0 in binary is "0", which is a palindrome. This is important when numbers are small.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Nearest neighbor search**: Similar to "Closest Binary Search Tree Value" (LeetCode 270) where you find the closest value in a BST to a target.

2. **Palindrome generation**: Similar to "Find the Closest Palindrome" (LeetCode 564) where you find the nearest palindrome for a given number.

3. **Optimization across multiple points**: Similar to "Best Meeting Point" (LeetCode 296) where you find the point that minimizes total Manhattan distance to all points. In that problem, the optimal point is the median; here, we need to check candidate points.

The core technique of considering only "interesting" candidates (nearest palindromes for each point) rather than all possible values is a common optimization strategy in computational geometry and optimization problems.

## Key Takeaways

1. **When minimizing sum of distances, consider only candidate points near each input point**: Instead of checking all possible targets, identify the set of "relevant" candidates. For each input, the optimal target will be one of the nearest "special" points (in this case, binary palindromes).

2. **Binary palindromes can be found by incremental search**: While there are more efficient ways to generate palindromes (by constructing them from halves), the simple incremental approach works well for interview settings and is easier to implement correctly.

3. **Always clarify edge cases**: Are numbers non-negative? What about empty array? Can numbers be transformed to the same palindrome? Asking these questions shows thoroughness.

[Practice this problem on CodeJeet](/problem/minimum-operations-to-make-binary-palindrome)
