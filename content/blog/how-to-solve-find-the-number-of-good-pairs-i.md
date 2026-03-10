---
title: "How to Solve Find the Number of Good Pairs I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Number of Good Pairs I. Easy difficulty, 86.3% acceptance rate. Topics: Array, Hash Table."
date: "2027-07-24"
category: "dsa-patterns"
tags: ["find-the-number-of-good-pairs-i", "array", "hash-table", "easy"]
---

## How to Solve Find the Number of Good Pairs I

This problem asks us to count all index pairs `(i, j)` where `nums1[i]` is divisible by `nums2[j] * k`. While the problem is straightforward, it's interesting because it tests your ability to recognize when brute force is acceptable versus when optimization is needed. The key insight is understanding the constraints: with `n` and `m` up to 1000, a brute force O(n×m) solution is perfectly acceptable, making this an "easy" problem. However, the thinking process behind recognizing this is what interviewers want to see.

### ## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
nums1 = [1, 2, 4, 12]
nums2 = [2, 4]
k = 2
```

We need to count pairs `(i, j)` where `nums1[i] % (nums2[j] * k) == 0`.

**Step-by-step check:**

1. `i=0, j=0`: `nums1[0]=1`, `nums2[0]*k=2*2=4`. Is 1 divisible by 4? No.
2. `i=0, j=1`: `nums1[0]=1`, `nums2[1]*k=4*2=8`. Is 1 divisible by 8? No.
3. `i=1, j=0`: `nums1[1]=2`, `nums2[0]*k=4`. Is 2 divisible by 4? No.
4. `i=1, j=1`: `nums1[1]=2`, `nums2[1]*k=8`. Is 2 divisible by 8? No.
5. `i=2, j=0`: `nums1[2]=4`, `nums2[0]*k=4`. Is 4 divisible by 4? **Yes** → count = 1
6. `i=2, j=1`: `nums1[2]=4`, `nums2[1]*k=8`. Is 4 divisible by 8? No.
7. `i=3, j=0`: `nums1[3]=12`, `nums2[0]*k=4`. Is 12 divisible by 4? **Yes** → count = 2
8. `i=3, j=1`: `nums1[3]=12`, `nums2[1]*k=8`. Is 12 divisible by 8? No.

**Result:** 2 good pairs.

This visual walkthrough shows we're simply checking every possible combination of elements from both arrays. With constraints up to 1000×1000 = 1,000,000 operations, this is feasible.

### ## Brute Force Approach

The most straightforward solution is to use two nested loops to check every possible `(i, j)` pair. For each pair, we check if `nums1[i]` is divisible by `nums2[j] * k`. If yes, we increment our counter.

**Why this works:** We're explicitly checking the condition for every possible pair, which guarantees we count all good pairs.

**Why it's acceptable here:** The problem constraints state `1 <= n, m <= 1000`, so at most 1,000,000 operations. In modern computing, this is perfectly fine (about 1 million operations executes in milliseconds).

**What if constraints were larger?** If `n` and `m` were up to 100,000, we'd need optimization. The harder version of this problem ("Count Array Pairs Divisible by K") has much larger constraints requiring mathematical optimization.

### ## Optimal Solution

For this specific problem with the given constraints, the brute force approach **is** the optimal solution. There's no need for hash tables or other optimizations because the problem size is small enough that O(n×m) is acceptable.

<div class="code-group">

```python
# Time: O(n * m) where n = len(nums1), m = len(nums2)
# Space: O(1) - only using a counter variable
def numberOfPairs(nums1, nums2, k):
    """
    Counts all pairs (i, j) where nums1[i] is divisible by nums2[j] * k.

    Args:
        nums1: List of integers
        nums2: List of integers
        k: Positive integer divisor

    Returns:
        Integer count of good pairs
    """
    count = 0  # Initialize counter for good pairs

    # Outer loop: iterate through all elements in nums1
    for i in range(len(nums1)):
        # Inner loop: iterate through all elements in nums2
        for j in range(len(nums2)):
            # Check if nums1[i] is divisible by (nums2[j] * k)
            # We check nums2[j] * k != 0 first (always true since k > 0 and nums2 elements are integers)
            if nums1[i] % (nums2[j] * k) == 0:
                count += 1  # Found a good pair

    return count
```

```javascript
// Time: O(n * m) where n = nums1.length, m = nums2.length
// Space: O(1) - only using a counter variable
function numberOfPairs(nums1, nums2, k) {
  /**
   * Counts all pairs (i, j) where nums1[i] is divisible by nums2[j] * k.
   *
   * @param {number[]} nums1 - First array of integers
   * @param {number[]} nums2 - Second array of integers
   * @param {number} k - Positive integer divisor
   * @return {number} Count of good pairs
   */
  let count = 0; // Initialize counter for good pairs

  // Outer loop: iterate through all elements in nums1
  for (let i = 0; i < nums1.length; i++) {
    // Inner loop: iterate through all elements in nums2
    for (let j = 0; j < nums2.length; j++) {
      // Check if nums1[i] is divisible by (nums2[j] * k)
      // Note: nums2[j] * k will never be 0 since k > 0
      if (nums1[i] % (nums2[j] * k) === 0) {
        count++; // Found a good pair
      }
    }
  }

  return count;
}
```

```java
// Time: O(n * m) where n = nums1.length, m = nums2.length
// Space: O(1) - only using a counter variable
class Solution {
    public int numberOfPairs(int[] nums1, int[] nums2, int k) {
        /**
         * Counts all pairs (i, j) where nums1[i] is divisible by nums2[j] * k.
         *
         * @param nums1 First array of integers
         * @param nums2 Second array of integers
         * @param k Positive integer divisor
         * @return Count of good pairs
         */
        int count = 0;  // Initialize counter for good pairs

        // Outer loop: iterate through all elements in nums1
        for (int i = 0; i < nums1.length; i++) {
            // Inner loop: iterate through all elements in nums2
            for (int j = 0; j < nums2.length; j++) {
                // Check if nums1[i] is divisible by (nums2[j] * k)
                // We multiply nums2[j] by k first, then check divisibility
                // Note: nums2[j] * k will never be 0 since k > 0
                if (nums1[i] % (nums2[j] * k) == 0) {
                    count++;  // Found a good pair
                }
            }
        }

        return count;
    }
}
```

</div>

### ## Complexity Analysis

**Time Complexity:** O(n × m)

- We have two nested loops: the outer loop runs `n` times (length of `nums1`), and the inner loop runs `m` times (length of `nums2`) for each iteration of the outer loop.
- Inside the inner loop, we perform a constant-time modulo operation.
- Total operations: n × m, which is O(n × m).

**Space Complexity:** O(1)

- We only use a single integer variable `count` to track the number of good pairs.
- No additional data structures are created that scale with input size.

**Why this is optimal for the constraints:** With n, m ≤ 1000, n × m ≤ 1,000,000 operations. In programming contests and interviews, 1 million operations is considered acceptable (typically executes in < 0.1 seconds in modern languages).

### ## Common Mistakes

1. **Integer overflow when multiplying:** In languages like Java, if `nums2[j]` is large (close to Integer.MAX_VALUE), multiplying by `k` could cause overflow. However, the problem constraints keep numbers small enough that this isn't an issue. In a real interview, it's good to mention this potential issue.

2. **Checking divisibility by zero:** While `k` is guaranteed positive, `nums2[j]` could be 0. If `nums2[j] = 0`, then `nums2[j] * k = 0`, and division by zero would occur. However, the problem states all numbers are integers but doesn't explicitly forbid zero. In practice, most test cases avoid this, but robust code would check: `if divisor != 0 and num % divisor == 0`.

3. **Misunderstanding the pair definition:** Some candidates might think `(i, j)` means `nums1[i]` and `nums2[j]` must be divisible by `k`, rather than `nums1[i]` being divisible by `nums2[j] * k`. Read the problem statement carefully: "`nums1[i]` is divisible by `nums2[j] * k`".

4. **Trying to over-optimize:** Since this is an "Easy" problem with small constraints, candidates sometimes waste time trying to implement hash table optimizations that aren't needed. Recognize when brute force is acceptable by checking constraints first.

### ## When You'll See This Pattern

This problem uses the **nested loop pair checking** pattern, which appears in many array problems:

1. **Two Sum** (Easy): Find two numbers that add up to a target. While the optimal solution uses a hash table, the brute force uses nested loops to check all pairs.

2. **Count Pairs Whose Sum is Less Than Target** (Easy): Very similar structure - nested loops to check all pairs against a condition.

3. **Count Good Triplets** (Easy): Extends the pattern to three nested loops for triple checking.

4. **Count Array Pairs Divisible by K** (Hard): The harder version of this problem where constraints are much larger (up to 100,000 elements), requiring mathematical optimization using divisors and frequency counting.

The key insight is: when checking relationships between all pairs of elements from two arrays (or within one array), and constraints are small (≤ 1000 elements), nested loops are often the simplest and most readable solution.

### ## Key Takeaways

1. **Constraints dictate approach:** Always check problem constraints first. When n and m are ≤ 1000, O(n×m) = 1,000,000 operations is acceptable. If they were ≤ 100,000, you'd need optimization.

2. **Brute force can be optimal:** For "Easy" problems with small input sizes, the straightforward solution is often the intended one. Don't overcomplicate simple problems.

3. **Pair checking pattern:** When a problem asks you to count or find pairs satisfying a condition between two arrays (or within one array), nested loops are your first thought. Only optimize if constraints force you to.

4. **Read carefully:** The condition is `nums1[i] % (nums2[j] * k) == 0`, not `(nums1[i] * nums2[j]) % k == 0`. Small wording differences change the entire solution.

Related problems: [Count Array Pairs Divisible by K](/problem/count-array-pairs-divisible-by-k)
