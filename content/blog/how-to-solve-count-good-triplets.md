---
title: "How to Solve Count Good Triplets — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Good Triplets. Easy difficulty, 85.5% acceptance rate. Topics: Array, Enumeration."
date: "2028-02-10"
category: "dsa-patterns"
tags: ["count-good-triplets", "array", "enumeration", "easy"]
---

# How to Solve Count Good Triplets

This problem asks us to count all triplets `(arr[i], arr[j], arr[k])` where `i < j < k` and the absolute differences between consecutive elements satisfy `|arr[i] - arr[j]| ≤ a` and `|arr[j] - arr[k]| ≤ b`. While the constraints seem straightforward, what makes this problem interesting is that it requires careful enumeration of all possible triplets while maintaining the index ordering constraint. Many candidates rush to check all combinations without properly handling the `i < j < k` requirement or misunderstand how the absolute difference conditions apply.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider `arr = [3, 0, 1, 1, 9, 7]` with `a = 5`, `b = 2`, `c = 3`.

We need to find all triplets `(i, j, k)` where:

1. `0 ≤ i < j < k < 6` (indices are strictly increasing)
2. `|arr[i] - arr[j]| ≤ 5` (first condition with `a`)
3. `|arr[j] - arr[k]| ≤ 2` (second condition with `b`)

Let's enumerate systematically:

- **i=0, j=1**: `arr[0]=3`, `arr[1]=0`, `|3-0|=3 ≤ 5` ✓
  - Check all `k > 1`:
    - k=2: `arr[2]=1`, `|0-1|=1 ≤ 2` ✓ → Good triplet (3,0,1)
    - k=3: `arr[3]=1`, `|0-1|=1 ≤ 2` ✓ → Good triplet (3,0,1)
    - k=4: `arr[4]=9`, `|0-9|=9 > 2` ✗
    - k=5: `arr[5]=7`, `|0-7|=7 > 2` ✗

- **i=0, j=2**: `arr[0]=3`, `arr[2]=1`, `|3-1|=2 ≤ 5` ✓
  - Check all `k > 2`:
    - k=3: `arr[3]=1`, `|1-1|=0 ≤ 2` ✓ → Good triplet (3,1,1)
    - k=4: `arr[4]=9`, `|1-9|=8 > 2` ✗
    - k=5: `arr[5]=7`, `|1-7|=6 > 2` ✗

- **i=0, j=3**: `arr[0]=3`, `arr[3]=1`, `|3-1|=2 ≤ 5` ✓
  - Check all `k > 3`:
    - k=4: `arr[4]=9`, `|1-9|=8 > 2` ✗
    - k=5: `arr[5]=7`, `|1-7|=6 > 2` ✗

- **i=0, j=4**: `arr[0]=3`, `arr[4]=9`, `|3-9|=6 > 5` ✗ (skip all k)

- **i=0, j=5**: `arr[0]=3`, `arr[5]=7`, `|3-7|=4 ≤ 5` ✓
  - No `k > 5` exists, so no triplets

- **i=1, j=2**: `arr[1]=0`, `arr[2]=1`, `|0-1|=1 ≤ 5` ✓
  - Check all `k > 2`:
    - k=3: `arr[3]=1`, `|1-1|=0 ≤ 2` ✓ → Good triplet (0,1,1)
    - k=4: `arr[4]=9`, `|1-9|=8 > 2` ✗
    - k=5: `arr[5]=7`, `|1-7|=6 > 2` ✗

Continue this process for all `i < j < k`. The final count is 4 good triplets: `(3,0,1)`, `(3,0,1)`, `(3,1,1)`, `(0,1,1)`.

Notice that we're systematically checking all possible index combinations while maintaining the ordering constraint. This visual walkthrough reveals the brute force approach: three nested loops.

## Brute Force Approach

The most straightforward solution is to use three nested loops to check every possible triplet `(i, j, k)` where `i < j < k`. For each triplet, we check if both conditions are satisfied, and if so, increment our count.

Why is this approach valid? Because we're exhaustively checking every possible combination of indices that satisfies `i < j < k`. The constraints `a`, `b`, and `c` are simply used to filter which triplets count as "good."

The time complexity is O(n³) where n is the length of the array, since we have three nested loops each iterating up to n times. For small arrays (n ≤ 100), this is acceptable, but for larger inputs it becomes inefficient.

## Optimal Solution

For this problem, the brute force approach is actually optimal given the constraints. The problem is classified as "Easy" and typically appears with small array sizes (n ≤ 100), making O(n³) acceptable. However, we can implement it cleanly with careful indexing.

<div class="code-group">

```python
# Time: O(n^3) | Space: O(1)
def countGoodTriplets(arr, a, b, c):
    """
    Counts all good triplets (i, j, k) where:
    1. 0 <= i < j < k < len(arr)
    2. |arr[i] - arr[j]| <= a
    3. |arr[j] - arr[k]| <= b
    4. |arr[i] - arr[k]| <= c

    Args:
        arr: List of integers
        a, b, c: Integer thresholds for absolute differences

    Returns:
        Integer count of good triplets
    """
    n = len(arr)
    count = 0

    # Iterate through all possible i indices (first element of triplet)
    for i in range(n - 2):  # Stop at n-2 to leave room for j and k
        # Iterate through all possible j indices (second element)
        # j must be greater than i
        for j in range(i + 1, n - 1):  # Stop at n-1 to leave room for k
            # Check first condition: |arr[i] - arr[j]| <= a
            # If this fails, we can skip checking all k for this (i, j) pair
            if abs(arr[i] - arr[j]) > a:
                continue

            # Iterate through all possible k indices (third element)
            # k must be greater than j
            for k in range(j + 1, n):
                # Check remaining conditions
                if abs(arr[j] - arr[k]) <= b and abs(arr[i] - arr[k]) <= c:
                    count += 1

    return count
```

```javascript
// Time: O(n^3) | Space: O(1)
/**
 * Counts all good triplets (i, j, k) where:
 * 1. 0 <= i < j < k < arr.length
 * 2. |arr[i] - arr[j]| <= a
 * 3. |arr[j] - arr[k]| <= b
 * 4. |arr[i] - arr[k]| <= c
 *
 * @param {number[]} arr - Array of integers
 * @param {number} a - Threshold for |arr[i] - arr[j]|
 * @param {number} b - Threshold for |arr[j] - arr[k]|
 * @param {number} c - Threshold for |arr[i] - arr[k]|
 * @return {number} Count of good triplets
 */
function countGoodTriplets(arr, a, b, c) {
  const n = arr.length;
  let count = 0;

  // Iterate through all possible i indices (first element of triplet)
  for (let i = 0; i < n - 2; i++) {
    // Iterate through all possible j indices (second element)
    // j must be greater than i
    for (let j = i + 1; j < n - 1; j++) {
      // Check first condition: |arr[i] - arr[j]| <= a
      // If this fails, skip checking all k for this (i, j) pair
      if (Math.abs(arr[i] - arr[j]) > a) {
        continue;
      }

      // Iterate through all possible k indices (third element)
      // k must be greater than j
      for (let k = j + 1; k < n; k++) {
        // Check remaining conditions
        if (Math.abs(arr[j] - arr[k]) <= b && Math.abs(arr[i] - arr[k]) <= c) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^3) | Space: O(1)
class Solution {
    /**
     * Counts all good triplets (i, j, k) where:
     * 1. 0 <= i < j < k < arr.length
     * 2. |arr[i] - arr[j]| <= a
     * 3. |arr[j] - arr[k]| <= b
     * 4. |arr[i] - arr[k]| <= c
     *
     * @param arr Array of integers
     * @param a Threshold for |arr[i] - arr[j]|
     * @param b Threshold for |arr[j] - arr[k]|
     * @param c Threshold for |arr[i] - arr[k]|
     * @return Count of good triplets
     */
    public int countGoodTriplets(int[] arr, int a, int b, int c) {
        int n = arr.length;
        int count = 0;

        // Iterate through all possible i indices (first element of triplet)
        for (int i = 0; i < n - 2; i++) {
            // Iterate through all possible j indices (second element)
            // j must be greater than i
            for (int j = i + 1; j < n - 1; j++) {
                // Check first condition: |arr[i] - arr[j]| <= a
                // If this fails, skip checking all k for this (i, j) pair
                if (Math.abs(arr[i] - arr[j]) > a) {
                    continue;
                }

                // Iterate through all possible k indices (third element)
                // k must be greater than j
                for (int k = j + 1; k < n; k++) {
                    // Check remaining conditions
                    if (Math.abs(arr[j] - arr[k]) <= b &&
                        Math.abs(arr[i] - arr[k]) <= c) {
                        count++;
                    }
                }
            }
        }

        return count;
    }
}
```

</div>

**Key implementation details:**

1. **Loop bounds**: The outer loop `i` goes from `0` to `n-2` (inclusive) to leave room for `j` and `k`. Similarly, `j` goes from `i+1` to `n-1`, and `k` goes from `j+1` to `n-1`.
2. **Early termination**: We check `|arr[i] - arr[j]| ≤ a` before entering the innermost loop. If this fails, we skip all `k` values for that `(i, j)` pair, saving unnecessary computations.
3. **Absolute value**: We use `abs()` function to compute absolute differences, which handles negative values correctly.

## Complexity Analysis

**Time Complexity: O(n³)**

- We have three nested loops: `i` iterates up to `n` times, `j` iterates up to `n` times for each `i`, and `k` iterates up to `n` times for each `(i, j)` pair.
- In the worst case, this gives us n × n × n = n³ operations.
- The early termination when `|arr[i] - arr[j]| > a` helps in practice but doesn't change the worst-case complexity.

**Space Complexity: O(1)**

- We only use a constant amount of extra space: variables for `n`, `count`, and loop indices.
- The input array is not modified, and we don't create any additional data structures.

## Common Mistakes

1. **Incorrect loop bounds causing index out of range errors**:
   - Mistake: Using `for i in range(n)` for all loops, then accessing `arr[j]` and `arr[k]` without ensuring `j < n` and `k < n`.
   - Solution: Carefully set loop bounds: `i` from `0` to `n-2`, `j` from `i+1` to `n-1`, `k` from `j+1` to `n`.

2. **Forgetting the third condition involving `c`**:
   - Mistake: Only checking `|arr[i] - arr[j]| ≤ a` and `|arr[j] - arr[k]| ≤ b`, but missing `|arr[i] - arr[k]| ≤ c`.
   - Solution: Read the problem statement carefully. All three conditions must be satisfied.

3. **Not maintaining strict index ordering**:
   - Mistake: Checking all combinations of three indices without ensuring `i < j < k`, potentially counting the same triplet multiple times or in wrong order.
   - Solution: Use nested loops with increasing start indices as shown in the solution.

4. **Using the wrong absolute difference**:
   - Mistake: Checking `|arr[i] - arr[k]| ≤ b` instead of `|arr[j] - arr[k]| ≤ b`.
   - Solution: Pay attention to which indices are being compared in each condition.

## When You'll See This Pattern

This problem exemplifies **complete enumeration** or **brute force search** over combinations. You'll encounter similar patterns in:

1. **Count Special Quadruplets (Easy)**: Count quadruplets `(a, b, c, d)` where `a < b < c < d` and `nums[a] + nums[b] + nums[c] == nums[d]`. This requires four nested loops to check all combinations.

2. **Number of Unequal Triplets in Array (Easy)**: Count triplets `(i, j, k)` where `i < j < k` and `nums[i] != nums[j]`, `nums[i] != nums[k]`, `nums[j] != nums[k]`. Again, three nested loops check all combinations.

3. **3Sum (Medium)**: While more sophisticated solutions exist, a brute force approach would use three nested loops to find all triplets summing to zero. The optimization comes from sorting and using two pointers.

The key insight is that when the input size is small (typically n ≤ 100), O(n³) solutions are acceptable, and the straightforward approach is often the best one.

## Key Takeaways

1. **Complete enumeration is valid for small constraints**: When n is small (≤ 100), O(n³) solutions with three nested loops are acceptable in coding interviews. Don't overcomplicate simple problems.

2. **Pay attention to index ordering constraints**: Problems that require `i < j < k` naturally lead to nested loops where each inner loop starts from `current_index + 1`.

3. **Early termination can optimize brute force**: Even within a brute force solution, you can add checks to skip unnecessary iterations (like checking `|arr[i] - arr[j]| ≤ a` before the innermost loop).

4. **Read all conditions carefully**: It's easy to miss one of multiple conditions in the problem statement. Methodically check each condition for every candidate solution.

Related problems: [Count Special Quadruplets](/problem/count-special-quadruplets), [Number of Unequal Triplets in Array](/problem/number-of-unequal-triplets-in-array)
