---
title: "How to Solve Minimum Cost to Make Array Equalindromic — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Make Array Equalindromic. Medium difficulty, 23.3% acceptance rate. Topics: Array, Math, Binary Search, Greedy, Sorting."
date: "2030-02-05"
category: "dsa-patterns"
tags: ["minimum-cost-to-make-array-equalindromic", "array", "math", "binary-search", "medium"]
---

# How to Solve Minimum Cost to Make Array Equalindromic

This problem asks us to transform an array of integers so that all elements become **palindromic numbers** (numbers that read the same forwards and backwards) while minimizing the total cost, where the cost of changing a number is the absolute difference between its original and new value. The tricky part is that we need to find the optimal palindromic target value that minimizes the sum of absolute differences across all array elements.

## Visual Walkthrough

Let's work through a small example: `nums = [1, 2, 3, 4, 5]`

**Step 1: Understanding the problem**
We need to choose a palindromic number `p` such that the sum of `|nums[i] - p|` for all `i` is minimized. Palindromic numbers in the relevant range include: 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, etc.

**Step 2: Trying different palindromic targets**

- If we choose `p = 3` (palindromic): cost = |1-3| + |2-3| + |3-3| + |4-3| + |5-3| = 2 + 1 + 0 + 1 + 2 = 6
- If we choose `p = 4` (palindromic): cost = |1-4| + |2-4| + |3-4| + |4-4| + |5-4| = 3 + 2 + 1 + 0 + 1 = 7
- If we choose `p = 2` (palindromic): cost = |1-2| + |2-2| + |3-2| + |4-2| + |5-2| = 1 + 0 + 1 + 2 + 3 = 7
- If we choose `p = 5` (palindromic): cost = |1-5| + |2-5| + |3-5| + |4-5| + |5-5| = 4 + 3 + 2 + 1 + 0 = 10

**Step 3: Key observation**
Notice that `p = 3` gives the minimum cost of 6. Interestingly, if we ignore the palindromic constraint, the optimal target for minimizing sum of absolute differences is the **median** of the sorted array (which is 3 here). This suggests we should look for palindromic numbers near the median.

**Step 4: Finding nearby palindromes**
For our sorted array `[1, 2, 3, 4, 5]`, the median is 3 (which happens to be palindromic). But what if the median isn't palindromic? Let's try `nums = [1, 6, 8, 10, 12]`:

- Sorted median is 8 (palindromic): cost = 7 + 2 + 0 + 2 + 4 = 15
- Nearby palindrome 9: cost = 8 + 3 + 1 + 1 + 3 = 16
- Nearby palindrome 7: cost = 6 + 1 + 1 + 3 + 5 = 16
- Nearby palindrome 11: cost = 10 + 5 + 3 + 1 + 1 = 20

The insight: we only need to check palindromic numbers near the median.

## Brute Force Approach

A naive approach would be:

1. Generate all palindromic numbers within the possible range (from min(nums) to max(nums), plus some buffer)
2. For each palindromic number, calculate the total cost by summing absolute differences
3. Return the minimum cost found

The problem with this approach is efficiency. If the array values range from 1 to 10^9, there could be thousands of palindromic numbers to check, and for each one, we need O(n) operations to compute the cost. For n up to 10^5, this becomes O(n × number_of_palindromes), which is too slow.

Even worse, a candidate might try to check every possible integer in the range, which for values up to 10^9 is completely infeasible.

## Optimized Approach

The key insights for an optimized solution:

1. **Median property**: For minimizing sum of absolute differences (without the palindromic constraint), the optimal target is the median of the sorted array. This is a known mathematical property.

2. **Search space reduction**: We don't need to check all palindromic numbers, only those near the median. Specifically, we should:
   - Sort the array
   - Find the median (or medians for even-length arrays)
   - Generate palindromic numbers near these median values
   - Check only these candidate palindromes

3. **Efficient palindrome generation**: We can generate palindromes by:
   - Taking a number and creating its palindrome by mirroring digits
   - Checking numbers slightly above and below our target

4. **Why this works**: The cost function `f(p) = Σ|nums[i] - p|` is convex (V-shaped) with its minimum at the median. When we add the palindromic constraint, we're essentially evaluating this convex function at discrete palindromic points. The minimum will be at the palindromic number closest to the unconstrained optimum (the median).

## Optimal Solution

The algorithm:

1. Sort the array to easily compute median
2. Find candidate palindromic numbers near the median
3. For each candidate, compute the total cost
4. Return the minimum cost

<div class="code-group">

```python
# Time: O(n log n + k * n) where k is small constant (~10-20 palindromes checked)
# Space: O(1) excluding input storage
def minimumCost(nums):
    n = len(nums)

    # Step 1: Sort the array to find median
    nums.sort()

    # Step 2: Find the median (for odd n) or two middle values (for even n)
    # For minimizing sum of absolute differences, any value between the two middle
    # values works, but we need palindromic numbers
    if n % 2 == 1:
        # Odd length: single median
        medians = [nums[n // 2]]
    else:
        # Even length: any value between the two middle values minimizes cost
        # We'll check both middle values and values between them
        medians = [nums[n // 2 - 1], nums[n // 2]]

    # Helper function to check if a number is palindrome
    def is_palindrome(x):
        s = str(x)
        return s == s[::-1]

    # Helper function to generate nearby palindromes
    def generate_nearby_palindromes(x):
        candidates = set()

        # Check the number itself if it's palindrome
        if is_palindrome(x):
            candidates.add(x)

        # Generate palindromes by mirroring digits
        # For numbers near x, we create palindromes from numbers around x
        for delta in [-1, 0, 1]:
            base = x + delta
            if base < 0:
                continue

            # Create palindrome by mirroring digits
            s = str(base)
            # Odd length palindrome: mirror excluding last digit
            odd_pal = int(s + s[-2::-1])
            # Even length palindrome: mirror all digits
            even_pal = int(s + s[::-1])

            candidates.add(odd_pal)
            candidates.add(even_pal)

        return candidates

    # Step 3: Generate candidate palindromes near medians
    candidates = set()
    for median in medians:
        candidates.update(generate_nearby_palindromes(median))

    # Also check a few more candidates around the median range
    # to handle cases where optimal palindrome is slightly further
    for i in range(max(0, n // 2 - 2), min(n, n // 2 + 3)):
        candidates.update(generate_nearby_palindromes(nums[i]))

    # Step 4: Compute cost for each candidate and find minimum
    min_cost = float('inf')
    for candidate in candidates:
        # Calculate total cost for this candidate
        cost = 0
        for num in nums:
            cost += abs(num - candidate)
        min_cost = min(min_cost, cost)

    return min_cost
```

```javascript
// Time: O(n log n + k * n) where k is small constant
// Space: O(1) excluding input storage
function minimumCost(nums) {
  const n = nums.length;

  // Step 1: Sort the array
  nums.sort((a, b) => a - b);

  // Step 2: Find median(s)
  const medians = [];
  if (n % 2 === 1) {
    // Odd length: single median
    medians.push(nums[Math.floor(n / 2)]);
  } else {
    // Even length: check both middle values
    medians.push(nums[n / 2 - 1], nums[n / 2]);
  }

  // Helper function to check if a number is palindrome
  function isPalindrome(x) {
    const s = x.toString();
    return s === s.split("").reverse().join("");
  }

  // Helper function to generate nearby palindromes
  function generateNearbyPalindromes(x) {
    const candidates = new Set();

    // Check the number itself
    if (isPalindrome(x)) {
      candidates.add(x);
    }

    // Generate palindromes from numbers around x
    for (let delta of [-1, 0, 1]) {
      let base = x + delta;
      if (base < 0) continue;

      const s = base.toString();
      // Odd length palindrome
      const oddPal = parseInt(s + s.slice(0, -1).split("").reverse().join(""));
      // Even length palindrome
      const evenPal = parseInt(s + s.split("").reverse().join(""));

      candidates.add(oddPal);
      candidates.add(evenPal);
    }

    return candidates;
  }

  // Step 3: Generate candidate palindromes
  const candidates = new Set();
  for (let median of medians) {
    const nearby = generateNearbyPalindromes(median);
    nearby.forEach((p) => candidates.add(p));
  }

  // Check a few more values around the median region
  const start = Math.max(0, Math.floor(n / 2) - 2);
  const end = Math.min(n, Math.floor(n / 2) + 3);
  for (let i = start; i < end; i++) {
    const nearby = generateNearbyPalindromes(nums[i]);
    nearby.forEach((p) => candidates.add(p));
  }

  // Step 4: Compute minimum cost
  let minCost = Infinity;
  for (let candidate of candidates) {
    let cost = 0;
    for (let num of nums) {
      cost += Math.abs(num - candidate);
    }
    minCost = Math.min(minCost, cost);
  }

  return minCost;
}
```

```java
// Time: O(n log n + k * n) where k is small constant
// Space: O(1) excluding input storage
import java.util.*;

class Solution {
    public long minimumCost(int[] nums) {
        int n = nums.length;

        // Step 1: Sort the array
        int[] sorted = nums.clone();
        Arrays.sort(sorted);

        // Step 2: Find median(s)
        List<Integer> medians = new ArrayList<>();
        if (n % 2 == 1) {
            // Odd length: single median
            medians.add(sorted[n / 2]);
        } else {
            // Even length: both middle values
            medians.add(sorted[n / 2 - 1]);
            medians.add(sorted[n / 2]);
        }

        // Step 3: Generate candidate palindromes
        Set<Long> candidates = new HashSet<>();
        for (int median : medians) {
            candidates.addAll(generateNearbyPalindromes(median));
        }

        // Check a few more values around median region
        int start = Math.max(0, n / 2 - 2);
        int end = Math.min(n, n / 2 + 3);
        for (int i = start; i < end; i++) {
            candidates.addAll(generateNearbyPalindromes(sorted[i]));
        }

        // Step 4: Compute minimum cost
        long minCost = Long.MAX_VALUE;
        for (long candidate : candidates) {
            long cost = 0;
            for (int num : nums) {
                cost += Math.abs(num - candidate);
            }
            minCost = Math.min(minCost, cost);
        }

        return minCost;
    }

    // Helper function to check if a number is palindrome
    private boolean isPalindrome(long x) {
        String s = Long.toString(x);
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    // Helper function to generate nearby palindromes
    private Set<Long> generateNearbyPalindromes(int x) {
        Set<Long> candidates = new HashSet<>();

        // Check the number itself
        if (isPalindrome(x)) {
            candidates.add((long)x);
        }

        // Generate palindromes from numbers around x
        for (int delta = -1; delta <= 1; delta++) {
            long base = x + delta;
            if (base < 0) continue;

            String s = Long.toString(base);
            // Odd length palindrome
            String oddStr = s + new StringBuilder(s.substring(0, s.length() - 1)).reverse().toString();
            // Even length palindrome
            String evenStr = s + new StringBuilder(s).reverse().toString();

            try {
                candidates.add(Long.parseLong(oddStr));
                candidates.add(Long.parseLong(evenStr));
            } catch (NumberFormatException e) {
                // Handle potential overflow, skip this candidate
            }
        }

        return candidates;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + k × n)**

- `O(n log n)` for sorting the array
- `O(k × n)` where k is the number of candidate palindromes we check (typically 10-20)
- The dominant term is `O(n log n)` for reasonable n values

**Space Complexity: O(1)** (excluding input storage)

- We use only a constant amount of extra space for variables and the candidate set
- The candidate set size is bounded by a constant (typically < 100)

**Why this is efficient:**

1. Sorting gives us O(n log n) which is acceptable for n ≤ 10^5
2. We only check a constant number of candidates (not proportional to n or the value range)
3. Each candidate evaluation is O(n), making total O(k × n) which is effectively O(n) since k is constant

## Common Mistakes

1. **Checking too many palindromes**: Some candidates generate all palindromes in the range [min(nums), max(nums)], which can be thousands or millions. Remember: we only need palindromes near the median.

2. **Forgetting to sort**: The median property only applies to sorted arrays. If you try to find the median of an unsorted array without sorting, you'll get incorrect results.

3. **Integer overflow**: When generating large palindromes (especially for large inputs), the mirrored number might exceed 64-bit integer limits. Always use appropriate data types (long in Java, no issue in Python).

4. **Missing edge cases**:
   - Single element array: should return 0 (already equal to itself)
   - All elements already palindromic: should find the optimal palindromic target among them
   - Negative numbers: while constraints say nums[i] ≥ 1, robust code should handle potential negatives

5. **Incorrect median calculation for even-length arrays**: For minimizing sum of absolute differences with no constraints, any value between the two middle values works. But with the palindromic constraint, we need to check actual palindromic numbers, so we should check both middle values and values between them.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Median for minimizing absolute differences**: Problems like "Minimum Moves to Equal Array Elements II" (LeetCode 462) use the exact same median property without the palindromic constraint.

2. **Constrained optimization**: When you have an optimization problem (minimize cost) with a constraint (must be palindromic), a common approach is to solve the unconstrained problem first, then find the best feasible solution near the unconstrained optimum.

3. **Search space reduction**: Instead of searching through all possibilities, identify properties that let you search only a small subset. This appears in problems like "K Closest Points to Origin" where you don't need to sort all points, just find the k smallest.

**Related problems:**

- **Minimum Moves to Equal Array Elements II** (LeetCode 462): Same median concept without palindromic constraint
- **Minimum Cost to Make Array Equal** (LeetCode 2448): Similar cost minimization with different constraints
- **Find K Closest Elements** (LeetCode 658): Finding elements near a target value

## Key Takeaways

1. **The median minimizes sum of absolute deviations**: This is a fundamental mathematical property worth memorizing. When you need to minimize Σ|xi - t|, the optimal t is the median.

2. **Constraints often require local search around unconstrained optimum**: When adding constraints to an optimization problem, first solve the unconstrained version, then look for feasible solutions near that optimum.

3. **Problem decomposition is key**: Break complex problems into simpler subproblems: (1) understand the unconstrained version, (2) understand the constraint (palindromic numbers), (3) combine insights to find efficient solution.

Related problems: [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii), [Minimum Cost to Make Array Equal](/problem/minimum-cost-to-make-array-equal)
