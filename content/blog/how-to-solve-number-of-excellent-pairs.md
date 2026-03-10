---
title: "How to Solve Number of Excellent Pairs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Excellent Pairs. Hard difficulty, 49.0% acceptance rate. Topics: Array, Hash Table, Binary Search, Bit Manipulation."
date: "2029-12-24"
category: "dsa-patterns"
tags: ["number-of-excellent-pairs", "array", "hash-table", "binary-search", "hard"]
---

# How to Solve Number of Excellent Pairs

This problem asks us to count pairs of numbers from an array where the sum of their set bit counts (popcount) is at least `k`. The twist is that numbers can appear multiple times in the input, but each distinct number can only be used once per pair position. This makes it tricky because we need to handle duplicates correctly while efficiently computing bit counts and finding valid pairs.

**What makes this interesting:** The constraint `1 <= nums[i] <= 10^9` and array length up to `10^5` means we can't afford O(n²) comparisons. The key insight is transforming the problem from comparing numbers to comparing their bit counts, which are much smaller (at most 30 for numbers ≤ 10^9).

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3, 1]`, `k = 3`

**Step 1: Remove duplicates and count set bits**

- `1` (binary `1`) has 1 set bit
- `2` (binary `10`) has 1 set bit
- `3` (binary `11`) has 2 set bits

We keep unique numbers: `[1, 2, 3]` with their bit counts.

**Step 2: Sort bit counts for efficient pairing**
Bit counts: `[1, 1, 2]`

**Step 3: Find valid pairs using two pointers**
We need pairs where `bitCount[i] + bitCount[j] >= k` (k=3)

Start with `i=0, j=2` (last index):

- `bitCount[0] + bitCount[2] = 1 + 2 = 3 >= 3` ✓
- All pairs between `i=0` and `j=2` are valid because array is sorted:
  - `(0,2)` and `(1,2)` are valid (2 pairs)
- Move `j` down: `j=1`
- `bitCount[0] + bitCount[1] = 1 + 1 = 2 < 3` ✗
- Move `i` up: `i=1`
- `bitCount[1] + bitCount[1] = 1 + 1 = 2 < 3` ✗
- Done

**Step 4: Account for duplicates**
We found 2 valid unique-number pairs. But original array had duplicates:

- Number `1` appears twice
- Each appearance can form a pair with itself or other numbers

For pair `(1, 3)`: `1` appears 2 times, `3` appears 1 time → `2 * 1 = 2` actual pairs
For pair `(2, 3)`: `2` appears 1 time, `3` appears 1 time → `1 * 1 = 1` actual pair
Total: `2 + 1 = 3` excellent pairs

## Brute Force Approach

The brute force solution would check all possible pairs of numbers from the array:

1. For each index `i` from `0` to `n-1`
2. For each index `j` from `0` to `n-1`
3. Calculate `popcount(nums[i]) + popcount(nums[j])`
4. If sum ≥ `k`, count the pair

**Why this fails:**

- Time complexity: O(n²) where n ≤ 10^5 → up to 10^10 operations
- Even with optimizations, it's too slow
- Doesn't handle the "both numbers exist in array" constraint efficiently
- Duplicate pairs `(i,j)` and `(j,i)` are both counted (which is correct for this problem)

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW for constraints
# Time: O(n²) | Space: O(1)
def countExcellentPairsBrute(nums, k):
    n = len(nums)
    count = 0

    # Helper to count set bits
    def popcount(x):
        return bin(x).count('1')

    # Check all pairs
    for i in range(n):
        for j in range(n):
            if popcount(nums[i]) + popcount(nums[j]) >= k:
                count += 1

    return count
```

```javascript
// BRUTE FORCE - TOO SLOW for constraints
// Time: O(n²) | Space: O(1)
function countExcellentPairsBrute(nums, k) {
  let count = 0;
  const n = nums.length;

  // Helper to count set bits
  function popcount(x) {
    return x.toString(2).split("1").length - 1;
  }

  // Check all pairs
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (popcount(nums[i]) + popcount(nums[j]) >= k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW for constraints
// Time: O(n²) | Space: O(1)
public long countExcellentPairsBrute(int[] nums, int k) {
    long count = 0;
    int n = nums.length;

    // Helper to count set bits
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (Integer.bitCount(nums[i]) + Integer.bitCount(nums[j]) >= k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to compare the actual numbers, only their bit counts. Since numbers can be large (up to 10^9) but their bit counts are small (≤ 30), we can:

1. **Deduplicate numbers**: Use a set to get unique numbers since `(num1, num2)` requires both numbers exist in the array, but we can use each occurrence separately.
2. **Count frequencies**: Track how many times each unique number appears.
3. **Compute bit counts**: For each unique number, calculate its popcount.
4. **Group by bit count**: Create a frequency array where `freq[b]` = total occurrences of numbers with exactly `b` set bits.
5. **Use prefix sums**: To efficiently count pairs where `bitCount1 + bitCount2 >= k`, we can use a two-pointer approach or prefix sums.

**Why this works:**

- After deduplication, we have at most `n` unique numbers, but their bit counts range only 0-30
- We can sort the bit counts and use two pointers to find valid pairs in O(m log m) where m ≤ n
- For each valid pair of bit counts `(b1, b2)`, the number of actual pairs is `freq[b1] * freq[b2]`
- If `b1 == b2`, we need to handle carefully: pairs can be `(x, x)` where x is the same number, but only if that number appears at least twice

## Optimal Solution

The optimal solution uses deduplication, bit count computation, frequency counting, and two pointers:

<div class="code-group">

```python
# Optimal Solution
# Time: O(n + m log m) where m is number of unique nums (≤ n)
# Space: O(n) for storing frequencies and bit counts
def countExcellentPairs(nums, k):
    # Step 1: Get unique numbers and their frequencies
    from collections import Counter
    freq = Counter(nums)  # number -> count

    # Step 2: Compute bit counts for each unique number
    bit_counts = []
    for num in freq:
        # Count set bits using built-in or manual method
        popcount = bin(num).count('1')
        bit_counts.append(popcount)

    # Step 3: Sort bit counts for two-pointer approach
    bit_counts.sort()
    n = len(bit_counts)

    # Step 4: Two pointers to count valid unique-bitcount pairs
    count = 0
    j = n - 1

    for i in range(n):
        # Move j left while sum >= k
        while j >= 0 and bit_counts[i] + bit_counts[j] >= k:
            j -= 1
        # All elements from j+1 to n-1 are valid partners for bit_counts[i]
        count += (n - 1 - j)

    # Step 5: Convert unique-bitcount pairs to actual number pairs
    # We need to account for frequencies of numbers with each bit count
    # Reorganize frequencies by bit count
    bitcount_freq = Counter()
    for num, cnt in freq.items():
        popcount = bin(num).count('1')
        bitcount_freq[popcount] += cnt

    # Step 6: Calculate total excellent pairs using frequencies
    total_pairs = 0
    bitcounts = list(bitcount_freq.keys())
    bitcounts.sort()
    m = len(bitcounts)

    # Use two pointers on the frequency-weighted bit counts
    j = m - 1
    for i in range(m):
        b1 = bitcounts[i]
        f1 = bitcount_freq[b1]

        # Find smallest j such that b1 + b2 >= k
        while j >= 0 and b1 + bitcounts[j] >= k:
            j -= 1

        # All bitcounts from j+1 to m-1 are valid partners
        for idx in range(j + 1, m):
            b2 = bitcounts[idx]
            f2 = bitcount_freq[b2]

            if b1 == b2:
                # Same bit count: can pair same number with itself
                # if it appears multiple times
                total_pairs += f1 * f2
            else:
                total_pairs += f1 * f2

    return total_pairs
```

```javascript
// Optimal Solution
// Time: O(n + m log m) where m is number of unique nums (≤ n)
// Space: O(n) for storing frequencies and bit counts
function countExcellentPairs(nums, k) {
  // Step 1: Get unique numbers and their frequencies
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Compute bit counts for each unique number
  const bitCounts = [];
  for (const [num] of freq) {
    // Count set bits using Brian Kernighan's algorithm
    let popcount = 0;
    let x = num;
    while (x > 0) {
      x &= x - 1;
      popcount++;
    }
    bitCounts.push(popcount);
  }

  // Step 3: Sort bit counts for two-pointer approach
  bitCounts.sort((a, b) => a - b);
  const n = bitCounts.length;

  // Step 4: Two pointers to count valid unique-bitcount pairs
  let count = 0;
  let j = n - 1;

  for (let i = 0; i < n; i++) {
    // Move j left while sum >= k
    while (j >= 0 && bitCounts[i] + bitCounts[j] >= k) {
      j--;
    }
    // All elements from j+1 to n-1 are valid partners for bitCounts[i]
    count += n - 1 - j;
  }

  // Step 5: Convert unique-bitcount pairs to actual number pairs
  // Reorganize frequencies by bit count
  const bitcountFreq = new Map();
  for (const [num, cnt] of freq) {
    // Count set bits
    let popcount = 0;
    let x = num;
    while (x > 0) {
      x &= x - 1;
      popcount++;
    }

    bitcountFreq.set(popcount, (bitcountFreq.get(popcount) || 0) + cnt);
  }

  // Step 6: Calculate total excellent pairs using frequencies
  let totalPairs = 0;
  const bitcounts = Array.from(bitcountFreq.keys()).sort((a, b) => a - b);
  const m = bitcounts.length;

  // Use two pointers on the frequency-weighted bit counts
  j = m - 1;
  for (let i = 0; i < m; i++) {
    const b1 = bitcounts[i];
    const f1 = bitcountFreq.get(b1);

    // Find smallest j such that b1 + b2 >= k
    while (j >= 0 && b1 + bitcounts[j] >= k) {
      j--;
    }

    // All bitcounts from j+1 to m-1 are valid partners
    for (let idx = j + 1; idx < m; idx++) {
      const b2 = bitcounts[idx];
      const f2 = bitcountFreq.get(b2);

      if (b1 === b2) {
        // Same bit count: can pair same number with itself
        totalPairs += f1 * f2;
      } else {
        totalPairs += f1 * f2;
      }
    }
  }

  return totalPairs;
}
```

```java
// Optimal Solution
// Time: O(n + m log m) where m is number of unique nums (≤ n)
// Space: O(n) for storing frequencies and bit counts
public long countExcellentPairs(int[] nums, int k) {
    // Step 1: Get unique numbers and their frequencies
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Step 2: Compute bit counts for each unique number
    List<Integer> bitCounts = new ArrayList<>();
    for (int num : freq.keySet()) {
        bitCounts.add(Integer.bitCount(num));
    }

    // Step 3: Sort bit counts for two-pointer approach
    Collections.sort(bitCounts);
    int n = bitCounts.size();

    // Step 4: Two pointers to count valid unique-bitcount pairs
    long count = 0;
    int j = n - 1;

    for (int i = 0; i < n; i++) {
        // Move j left while sum >= k
        while (j >= 0 && bitCounts.get(i) + bitCounts.get(j) >= k) {
            j--;
        }
        // All elements from j+1 to n-1 are valid partners for bitCounts[i]
        count += (n - 1 - j);
    }

    // Step 5: Convert unique-bitcount pairs to actual number pairs
    // Reorganize frequencies by bit count
    Map<Integer, Integer> bitcountFreq = new HashMap<>();
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        int num = entry.getKey();
        int cnt = entry.getValue();
        int popcount = Integer.bitCount(num);

        bitcountFreq.put(popcount, bitcountFreq.getOrDefault(popcount, 0) + cnt);
    }

    // Step 6: Calculate total excellent pairs using frequencies
    long totalPairs = 0;
    List<Integer> bitcounts = new ArrayList<>(bitcountFreq.keySet());
    Collections.sort(bitcounts);
    int m = bitcounts.size();

    // Use two pointers on the frequency-weighted bit counts
    j = m - 1;
    for (int i = 0; i < m; i++) {
        int b1 = bitcounts.get(i);
        int f1 = bitcountFreq.get(b1);

        // Find smallest j such that b1 + b2 >= k
        while (j >= 0 && b1 + bitcounts.get(j) >= k) {
            j--;
        }

        // All bitcounts from j+1 to m-1 are valid partners
        for (int idx = j + 1; idx < m; idx++) {
            int b2 = bitcounts.get(idx);
            int f2 = bitcountFreq.get(b2);

            if (b1 == b2) {
                // Same bit count: can pair same number with itself
                totalPairs += (long) f1 * f2;
            } else {
                totalPairs += (long) f1 * f2;
            }
        }
    }

    return totalPairs;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m log m)**

- `O(n)` to count frequencies and compute bit counts for unique numbers
- `O(m log m)` to sort the bit counts, where m ≤ n is number of unique numbers
- `O(m)` for the two-pointer pass
- In worst case (all numbers unique), m = n, so O(n log n)

**Space Complexity: O(n)**

- `O(n)` to store frequency map of unique numbers
- `O(m)` to store bit counts and frequency by bit count
- In worst case, O(n) total space

## Common Mistakes

1. **Not handling duplicates correctly**: Forgetting that `(num1, num2)` requires both numbers to exist in the array, but the same number can be used in both positions if it appears multiple times. Solution: Count frequencies and multiply them when counting pairs.

2. **O(n²) brute force**: Trying to check all pairs directly. With n up to 10^5, this is impossible. Solution: Recognize that bit counts are small (0-30) and work with those instead.

3. **Incorrect bit count calculation**: Using slow methods like converting to binary string for large numbers. Solution: Use efficient methods like `Integer.bitCount()` in Java, `bin(x).count('1')` in Python, or Brian Kernighan's algorithm.

4. **Off-by-one in two-pointer logic**: When counting pairs where `bitCount[i] + bitCount[j] >= k`, it's easy to miscount. Solution: Carefully trace through examples and validate with small test cases.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting + two pointers**: Similar to [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) but with frequencies. The two-pointer technique on sorted data is classic for "sum meets condition" problems.

2. **Bit manipulation with constraints**: Problems like [Counting Bits](https://leetcode.com/problems/counting-bits/) teach you to think about bit counts efficiently. When you see "set bits" or "popcount" in a problem, think about the small range of possible values.

3. **Transforming the problem**: Like in [Group Anagrams](https://leetcode.com/problems/group-anagrams/), where we transform strings to a canonical form, here we transform numbers to their bit counts to make the problem tractable.

## Key Takeaways

1. **When dealing with large value ranges but small derived properties** (like bit counts ≤ 30), transform the problem to work with the derived property instead of the original values.

2. **The two-pointer technique on sorted data** is extremely powerful for counting pairs that satisfy a sum condition. Remember: sort first, then use pointers from both ends.

3. **Always consider duplicates carefully** in counting problems. Use frequency maps and multiply counts when combining elements from different groups.

Related problems: [Two Sum](/problem/two-sum), [Two Sum II](/problems/two-sum-ii-input-array-is-sorted), [Counting Bits](/problems/counting-bits)
