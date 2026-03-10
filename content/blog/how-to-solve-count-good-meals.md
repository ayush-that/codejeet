---
title: "How to Solve Count Good Meals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Good Meals. Medium difficulty, 32.6% acceptance rate. Topics: Array, Hash Table."
date: "2028-06-26"
category: "dsa-patterns"
tags: ["count-good-meals", "array", "hash-table", "medium"]
---

# How to Solve Count Good Meals

This problem asks us to count pairs of different food items whose deliciousness values sum to a power of two. While it looks like a variation of Two Sum, there's a twist: instead of one target, we need to check against multiple possible targets (all powers of two up to a maximum). The challenge is doing this efficiently when the array can have up to 100,000 elements.

## Visual Walkthrough

Let's trace through an example: `deliciousness = [1, 3, 5, 7, 9]`

We need to find pairs that sum to powers of two: 1, 2, 4, 8, 16, 32, etc.

**Step 1:** Initialize a hash map to track counts of numbers we've seen so far.

**Step 2:** Process each number in order:

- For `1`: Check powers of two ≥ 1 (since we need positive sums):
  - Target 2: Need (2-1) = 1. Haven't seen 1 yet? Actually we're processing 1 now, but we check against previously seen numbers. Count = 0.
  - Target 4: Need 3. Haven't seen 3 yet. Count = 0.
  - Target 8: Need 7. Haven't seen 7 yet. Count = 0.
  - Target 16: Need 15. Not in array. Count = 0.
    Add `1` to hash map: `{1: 1}`

- For `3`: Check powers:
  - Target 4: Need 1. We've seen 1 once. Add 1 pair: (1,3)
  - Target 8: Need 5. Haven't seen 5 yet.
  - Target 16: Need 13. Not in array.
    Add `3` to hash map: `{1: 1, 3: 1}`

- For `5`: Check powers:
  - Target 8: Need 3. We've seen 3 once. Add 1 pair: (3,5)
  - Target 16: Need 11. Not in array.
    Add `5` to hash map: `{1: 1, 3: 1, 5: 1}`

- For `7`: Check powers:
  - Target 8: Need 1. We've seen 1 once. Add 1 pair: (1,7)
  - Target 16: Need 9. Haven't seen 9 yet.
    Add `7` to hash map: `{1: 1, 3: 1, 5: 1, 7: 1}`

- For `9`: Check powers:
  - Target 8: Need -1 (not valid since all deliciousness > 0)
  - Target 16: Need 7. We've seen 7 once. Add 1 pair: (7,9)
    Add `9` to hash map

**Total pairs:** (1,3), (3,5), (1,7), (7,9) = 4 good meals

## Brute Force Approach

The most straightforward solution is to check every possible pair:

1. Generate all powers of two up to `2 * max(deliciousness)` (since the maximum sum of two items is twice the maximum value)
2. For each power of two, check all pairs (i, j) where i < j
3. Count pairs where `deliciousness[i] + deliciousness[j] == power`

<div class="code-group">

```python
# Time: O(n² * log(max_val)) | Space: O(1)
def countPairs_brute(deliciousness):
    MOD = 10**9 + 7
    n = len(deliciousness)
    max_val = max(deliciousness) if deliciousness else 0

    # Generate powers of two up to 2*max_val
    powers = []
    power = 1
    while power <= 2 * max_val:
        powers.append(power)
        power <<= 1  # Multiply by 2

    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            total = deliciousness[i] + deliciousness[j]
            # Check if total is a power of two
            if total in powers:
                count = (count + 1) % MOD

    return count
```

```javascript
// Time: O(n² * log(max_val)) | Space: O(1)
function countPairsBrute(deliciousness) {
  const MOD = 1e9 + 7;
  const n = deliciousness.length;
  const maxVal = deliciousness.length > 0 ? Math.max(...deliciousness) : 0;

  // Generate powers of two up to 2*maxVal
  const powers = new Set();
  let power = 1;
  while (power <= 2 * maxVal) {
    powers.add(power);
    power <<= 1; // Multiply by 2
  }

  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const total = deliciousness[i] + deliciousness[j];
      if (powers.has(total)) {
        count = (count + 1) % MOD;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n² * log(max_val)) | Space: O(1)
public int countPairsBrute(int[] deliciousness) {
    final int MOD = 1_000_000_007;
    int n = deliciousness.length;
    int maxVal = 0;
    for (int val : deliciousness) {
        maxVal = Math.max(maxVal, val);
    }

    // Generate powers of two up to 2*maxVal
    Set<Integer> powers = new HashSet<>();
    int power = 1;
    while (power <= 2 * maxVal) {
        powers.add(power);
        power <<= 1;  // Multiply by 2
    }

    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int total = deliciousness[i] + deliciousness[j];
            if (powers.contains(total)) {
                count = (count + 1) % MOD;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 100,000, O(n²) is far too slow (that's 10 billion operations). We need something closer to O(n log n).

## Optimized Approach

The key insight is that this is essentially **multiple Two Sum problems** bundled together. For each number, instead of checking all other numbers, we can check if the complement (power_of_two - current_number) exists among previously seen numbers.

**Step-by-step reasoning:**

1. We need to check against all powers of two, but there are only about 22 relevant ones (from 2⁰ to 2²¹ since 2²¹ ≈ 2 million > 2 × max deliciousness).
2. For each number, for each power of two, check if (power - current) exists in our hash map.
3. Use a hash map to store counts of numbers we've seen so far.
4. Add the count of complements to our total result.
5. Update the hash map with the current number.

This reduces the complexity from O(n²) to O(n log max_val), where log max_val is about 22.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log max_val) | Space: O(n)
# where max_val is the maximum deliciousness value
def countPairs(deliciousness):
    MOD = 10**9 + 7

    # Find maximum value to determine how many powers of two we need
    max_val = max(deliciousness) if deliciousness else 0
    max_sum = 2 * max_val  # Maximum possible sum of two items

    # Dictionary to store frequency of numbers we've seen
    freq = {}

    count = 0

    for num in deliciousness:
        # Check all powers of two from 1 to max_sum
        # (we start from 1 since deliciousness values are positive)
        power = 1
        while power <= max_sum:
            complement = power - num

            # If complement exists in our frequency map, add its count
            if complement in freq:
                count = (count + freq[complement]) % MOD

            # Move to next power of two
            power <<= 1  # Equivalent to power *= 2

        # Add current number to frequency map
        freq[num] = freq.get(num, 0) + 1

    return count
```

```javascript
// Time: O(n log max_val) | Space: O(n)
// where max_val is the maximum deliciousness value
function countPairs(deliciousness) {
  const MOD = 1e9 + 7;

  // Find maximum value to determine how many powers of two we need
  const maxVal = deliciousness.length > 0 ? Math.max(...deliciousness) : 0;
  const maxSum = 2 * maxVal; // Maximum possible sum of two items

  // Map to store frequency of numbers we've seen
  const freq = new Map();

  let count = 0;

  for (const num of deliciousness) {
    // Check all powers of two from 1 to maxSum
    // (we start from 1 since deliciousness values are positive)
    let power = 1;
    while (power <= maxSum) {
      const complement = power - num;

      // If complement exists in our frequency map, add its count
      if (freq.has(complement)) {
        count = (count + freq.get(complement)) % MOD;
      }

      // Move to next power of two
      power <<= 1; // Equivalent to power *= 2
    }

    // Add current number to frequency map
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  return count;
}
```

```java
// Time: O(n log max_val) | Space: O(n)
// where max_val is the maximum deliciousness value
public int countPairs(int[] deliciousness) {
    final int MOD = 1_000_000_007;

    // Find maximum value to determine how many powers of two we need
    int maxVal = 0;
    for (int val : deliciousness) {
        maxVal = Math.max(maxVal, val);
    }
    int maxSum = 2 * maxVal;  // Maximum possible sum of two items

    // Map to store frequency of numbers we've seen
    Map<Integer, Integer> freq = new HashMap<>();

    int count = 0;

    for (int num : deliciousness) {
        // Check all powers of two from 1 to maxSum
        // (we start from 1 since deliciousness values are positive)
        int power = 1;
        while (power <= maxSum) {
            int complement = power - num;

            // If complement exists in our frequency map, add its count
            if (freq.containsKey(complement)) {
                count = (count + freq.get(complement)) % MOD;
            }

            // Move to next power of two
            power <<= 1;  // Equivalent to power *= 2
        }

        // Add current number to frequency map
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log max_val)

- We iterate through each of the n elements once
- For each element, we check at most log₂(max_sum) powers of two, where max_sum = 2 × max(deliciousness)
- Since max(deliciousness) ≤ 2²⁰, we check at most 22 powers per element
- Total: O(22n) ≈ O(n)

**Space Complexity:** O(n)

- We store a hash map with at most n entries (one for each unique deliciousness value)
- In the worst case where all values are distinct, we store n entries

## Common Mistakes

1. **Forgetting to use modulo operation early and often:** The result can be huge (up to n²/2 pairs), so we need to apply modulo after each addition, not just at the end. Integer overflow is a real concern.

2. **Checking powers of two inefficiently:** Some candidates generate all powers of two up to 2²¹ in advance (which is fine), but others check `if (sum & (sum-1)) == 0` for each pair, which is O(1) but only works if you're checking a specific sum, not looking for complements.

3. **Not handling duplicate values correctly:** When we have duplicates like `[2, 2, 2]`, there are multiple valid pairs. Our hash map with frequency counts handles this correctly by adding the frequency count, not just 1.

4. **Incorrect power range:** Some candidates check powers from 1 to max_val instead of 2×max_val. Remember, two items can sum to more than max_val (e.g., `[1000000, 1000000]` sums to 2,000,000).

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Two Sum with hash map:** Like in Two Sum (LeetCode #1), we use a hash map to find complements in O(1) time instead of O(n).

2. **Multiple target values:** Similar to problems where you need to check against multiple conditions. Other examples:
   - **4Sum** (LeetCode #18): Find all quadruplets that sum to target
   - **Count Number of Pairs With Absolute Difference K** (LeetCode #2006): Count pairs with difference equal to k
   - **Max Number of K-Sum Pairs** (LeetCode #1679): Similar to Two Sum but counts all pairs

The core technique is: when you need to find pairs satisfying a condition, consider storing seen elements in a hash map and checking for complements.

## Key Takeaways

1. **Transform pair-finding problems into complement lookup:** Instead of checking all pairs O(n²), check if the complement of the current element exists among previously seen elements O(1).

2. **Precompute or iterate through possible targets:** When you have multiple target values (like powers of two), either precompute them or iterate through them systematically. There are usually few enough to make this efficient.

3. **Use frequency counts for duplicates:** When elements can repeat and order matters (i ≠ j), store frequencies in your hash map, not just presence/absence.

Related problems: [Two Sum](/problem/two-sum), [Max Number of K-Sum Pairs](/problem/max-number-of-k-sum-pairs), [Find All Possible Recipes from Given Supplies](/problem/find-all-possible-recipes-from-given-supplies)
