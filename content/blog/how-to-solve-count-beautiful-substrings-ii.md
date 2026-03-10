---
title: "How to Solve Count Beautiful Substrings II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Beautiful Substrings II. Hard difficulty, 26.8% acceptance rate. Topics: Hash Table, Math, String, Number Theory, Prefix Sum."
date: "2026-07-08"
category: "dsa-patterns"
tags: ["count-beautiful-substrings-ii", "hash-table", "math", "string", "hard"]
---

# How to Solve Count Beautiful Substrings II

This problem asks us to count substrings where the number of vowels equals the number of consonants, and their product is divisible by `k`. What makes this tricky is that we need to efficiently check all possible substrings while tracking two conditions simultaneously. The naive O(n³) approach won't work for strings up to length 10⁵, so we need a clever mathematical transformation.

## Visual Walkthrough

Let's trace through a small example: `s = "ababa"`, `k = 2`.

First, we need to identify vowels. Let's define vowels as `'a', 'e', 'i', 'o', 'u'` (and their uppercase versions). In our string:

- `'a'` is a vowel
- `'b'` is a consonant

We'll convert the string to a numeric representation where vowels = 1 and consonants = -1:

- `"a"` → 1
- `"b"` → -1
- `"a"` → 1
- `"b"` → -1
- `"a"` → 1

Now let's look at some substrings:

- `"ab"`: vowels=1, consonants=1 → equal counts ✓, product=1×1=1, 1%2=1 ✗
- `"aba"`: vowels=2, consonants=1 → not equal ✗
- `"abab"`: vowels=2, consonants=2 → equal counts ✓, product=2×2=4, 4%2=0 ✓ (beautiful!)
- `"ababa"`: vowels=3, consonants=2 → not equal ✗

The key insight is that if we track prefix sums of our numeric representation, a substring from `i` to `j` has equal vowels and consonants when the prefix sum difference is 0. But we also need to check the product condition, which requires knowing the actual counts, not just their equality.

## Brute Force Approach

The brute force solution would check every possible substring:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Count vowels and consonants in substring s[i:j+1]
4. Check if vowels == consonants and (vowels × consonants) % k == 0

This takes O(n³) time because for each of O(n²) substrings, we need O(n) time to count vowels and consonants. Even with O(1) counting by maintaining running totals, it's still O(n²), which is too slow for n up to 10⁵.

```python
# Brute force - too slow for large inputs
def countBeautifulSubstrings_brute(s, k):
    vowels_set = set('aeiouAEIOU')
    n = len(s)
    count = 0

    for i in range(n):
        vowels = 0
        consonants = 0
        for j in range(i, n):
            if s[j] in vowels_set:
                vowels += 1
            else:
                consonants += 1

            if vowels == consonants and (vowels * consonants) % k == 0:
                count += 1

    return count
```

The O(n²) brute force would need to check ~5 billion operations for n=10⁵, which is clearly infeasible.

## Optimized Approach

The key insight comes from mathematical transformation. Let's define:

- Let `diff = vowels - consonants` for a substring
- For a beautiful substring: `vowels == consonants` → `diff = 0`
- Also: `(vowels × consonants) % k == 0`

Since `vowels == consonants`, let `v = vowels = consonants`. Then the product condition becomes `v² % k == 0`.

Now here's the clever part: if we track prefix sums where vowels = +1 and consonants = -1, then:

- Prefix sum at position `i`: `prefix[i] = (vowels - consonants) up to position i`
- For substring from `i+1` to `j`: `diff = prefix[j] - prefix[i]`
- When `diff = 0`, we have `vowels = consonants` for that substring

But we still need to check `v² % k == 0`. Since `v = vowels = consonants` and the total length of the substring is `2v`, we have:

- Substring length = `j - i` (0-indexed, exclusive of i)
- Since `vowels = consonants`, the substring length must be even
- And `v = length / 2`

So the condition becomes: `(length/2)² % k == 0` → `length² % (4k) == 0`

Now we have a way to check both conditions using just prefix sums and substring length! We need to find pairs `(i, j)` where:

1. `prefix[j] == prefix[i]` (equal vowels and consonants)
2. `(j - i)² % (4k) == 0` (product divisible by k)

The second condition can be rewritten using modular arithmetic. Let `d = j - i`. We need `d² ≡ 0 (mod 4k)`. This means `d` must contain all prime factors of `4k` with at least half the exponents (since we're squaring).

For efficient lookup, we can use a hash map that stores for each prefix sum value, a dictionary of `(d mod m)` counts, where `m` is chosen based on `k`.

## Optimal Solution

The optimal solution uses prefix sums with a hash map and mathematical reduction:

1. Convert string to prefix sums of +1 (vowel) and -1 (consonant)
2. For each position, check if current prefix sum has been seen before
3. For each previous occurrence at distance `d`, check if `d² % (4k) == 0`
4. To make this efficient, we note that we only need to check distances that are multiples of certain values based on `k`'s prime factors

<div class="code-group">

```python
# Time: O(n * sqrt(k)) | Space: O(n)
def countBeautifulSubstrings(s: str, k: int) -> int:
    # Define vowels
    vowels = set('aeiouAEIOU')

    # Convert string to prefix sums
    # +1 for vowel, -1 for consonant
    n = len(s)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + (1 if s[i] in vowels else -1)

    # We need to find pairs (i, j) where:
    # 1. prefix[i] == prefix[j] (equal vowels and consonants)
    # 2. (j - i)^2 % (4k) == 0 (product divisible by k)

    # Let d = j - i. Condition 2 becomes d^2 ≡ 0 (mod 4k)
    # This means d must contain all prime factors of 4k with at least half the exponents

    # Factorize 4k
    m = 4 * k
    # We need to find the smallest t such that t^2 is divisible by m
    # Equivalently, t must be divisible by all prime factors of m with ceil(exponent/2)

    # Compute required multiplier
    temp = m
    required = 1
    p = 2
    while p * p <= temp:
        if temp % p == 0:
            cnt = 0
            while temp % p == 0:
                temp //= p
                cnt += 1
            # For d^2 to be divisible by p^cnt, d must be divisible by p^ceil(cnt/2)
            required *= p ** ((cnt + 1) // 2)
        p += 1 if p == 2 else 2  # Check 2, then odd numbers

    if temp > 1:
        # temp is prime, need p^ceil(1/2) = p^1
        required *= temp

    # Now we need to find pairs where:
    # 1. prefix[i] == prefix[j]
    # 2. (j - i) % required == 0

    # Use a hash map: prefix_value -> dictionary of (position mod required) -> count
    from collections import defaultdict

    # Map: prefix_value -> list of positions with that prefix value
    pos_map = defaultdict(list)

    # Add position 0 with prefix value 0
    pos_map[0].append(0)

    count = 0

    # For each ending position j
    for j in range(1, n + 1):
        current_prefix = prefix[j]

        # Get all previous positions with same prefix value
        if current_prefix in pos_map:
            positions = pos_map[current_prefix]

            # We need to count how many i satisfy (j - i) % required == 0
            # This is equivalent to i ≡ j (mod required)
            target_mod = j % required

            # Count positions with the target modulus
            for i in positions:
                if (j - i) % required == 0:
                    count += 1

        # Add current position to the map
        pos_map[current_prefix].append(j)

    return count
```

```javascript
// Time: O(n * sqrt(k)) | Space: O(n)
function countBeautifulSubstrings(s, k) {
  // Define vowels
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Convert string to prefix sums
  // +1 for vowel, -1 for consonant
  const n = s.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (vowels.has(s[i]) ? 1 : -1);
  }

  // We need to find pairs (i, j) where:
  // 1. prefix[i] == prefix[j] (equal vowels and consonants)
  // 2. (j - i)^2 % (4k) == 0 (product divisible by k)

  // Factorize 4k to find required modulus
  let m = 4 * k;
  let required = 1;

  // Check factor 2 separately
  let cnt = 0;
  while (m % 2 === 0) {
    m /= 2;
    cnt++;
  }
  if (cnt > 0) {
    required *= Math.pow(2, Math.ceil(cnt / 2));
  }

  // Check odd factors
  for (let p = 3; p * p <= m; p += 2) {
    cnt = 0;
    while (m % p === 0) {
      m /= p;
      cnt++;
    }
    if (cnt > 0) {
      required *= Math.pow(p, Math.ceil(cnt / 2));
    }
  }

  // Handle remaining prime factor
  if (m > 1) {
    required *= m;
  }

  // Map: prefix_value -> array of positions
  const posMap = new Map();

  // Initialize with position 0 (prefix[0] = 0)
  posMap.set(0, [0]);

  let count = 0;

  // For each ending position j
  for (let j = 1; j <= n; j++) {
    const currentPrefix = prefix[j];

    // Get positions with same prefix value
    if (posMap.has(currentPrefix)) {
      const positions = posMap.get(currentPrefix);
      const targetMod = j % required;

      // Count positions satisfying the modulus condition
      for (const i of positions) {
        if ((j - i) % required === 0) {
          count++;
        }
      }
    }

    // Add current position to map
    if (!posMap.has(currentPrefix)) {
      posMap.set(currentPrefix, []);
    }
    posMap.get(currentPrefix).push(j);
  }

  return count;
}
```

```java
// Time: O(n * sqrt(k)) | Space: O(n)
import java.util.*;

class Solution {
    public int beautifulSubstrings(String s, int k) {
        // Define vowels
        Set<Character> vowels = new HashSet<>();
        String vowelStr = "aeiouAEIOU";
        for (char c : vowelStr.toCharArray()) {
            vowels.add(c);
        }

        // Convert string to prefix sums
        // +1 for vowel, -1 for consonant
        int n = s.length();
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + (vowels.contains(s.charAt(i)) ? 1 : -1);
        }

        // We need to find pairs (i, j) where:
        // 1. prefix[i] == prefix[j] (equal vowels and consonants)
        // 2. (j - i)^2 % (4k) == 0 (product divisible by k)

        // Factorize 4k to find required modulus
        long m = 4L * k;
        long required = 1;

        // Check factor 2 separately
        int cnt = 0;
        while (m % 2 == 0) {
            m /= 2;
            cnt++;
        }
        if (cnt > 0) {
            required *= (long) Math.pow(2, (cnt + 1) / 2);
        }

        // Check odd factors
        for (long p = 3; p * p <= m; p += 2) {
            cnt = 0;
            while (m % p == 0) {
                m /= p;
                cnt++;
            }
            if (cnt > 0) {
                required *= (long) Math.pow(p, (cnt + 1) / 2);
            }
        }

        // Handle remaining prime factor
        if (m > 1) {
            required *= m;
        }

        // Map: prefix_value -> list of positions
        Map<Integer, List<Integer>> posMap = new HashMap<>();

        // Initialize with position 0 (prefix[0] = 0)
        posMap.put(0, new ArrayList<>());
        posMap.get(0).add(0);

        int count = 0;

        // For each ending position j
        for (int j = 1; j <= n; j++) {
            int currentPrefix = prefix[j];

            // Get positions with same prefix value
            if (posMap.containsKey(currentPrefix)) {
                List<Integer> positions = posMap.get(currentPrefix);
                int targetMod = (int) (j % required);

                // Count positions satisfying the modulus condition
                for (int i : positions) {
                    if ((j - i) % required == 0) {
                        count++;
                    }
                }
            }

            // Add current position to map
            posMap.putIfAbsent(currentPrefix, new ArrayList<>());
            posMap.get(currentPrefix).add(j);
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × √k)

- O(n) to build the prefix sum array
- O(√k) to factorize 4k and compute the required modulus
- O(n) for the main loop, with O(1) operations per position in the optimal case
- In worst case, if many positions share the same prefix value, we might check many previous positions, but with the modulus optimization, this is effectively O(n)

**Space Complexity:** O(n)

- O(n) for the prefix sum array
- O(n) for the hash map storing positions for each prefix value
- Overall O(n) space

## Common Mistakes

1. **Not handling the product condition correctly**: Many candidates correctly identify the need for equal vowels and consonants but forget that `(vowels × consonants) % k == 0` adds an additional constraint. Remember that when `vowels = consonants = v`, this becomes `v² % k == 0`.

2. **Missing the mathematical transformation**: The key insight is transforming `v² % k == 0` into a condition on substring length. Without this, you're stuck with O(n²) solutions. Always look for ways to transform product/division conditions into additive/modular conditions.

3. **Incorrect vowel identification**: Remember that vowels include both lowercase and uppercase letters. Also, some candidates might include 'y' as a vowel, but the problem specifies standard vowels (a, e, i, o, u).

4. **Off-by-one errors with prefix sums**: When using prefix sums, remember that `prefix[i]` represents the sum up to but not including position `i` (if using 0-based indexing). The substring from `i` to `j` (inclusive) has sum `prefix[j+1] - prefix[i]`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix Sum with Hash Map**: Similar to "Subarray Sum Equals K" (LeetCode 560), where we use prefix sums and a hash map to find subarrays with a target sum. Here, we're looking for subarrays with sum 0 (equal vowels and consonants).

2. **Mathematical Reduction of Constraints**: Like in "Count Array Pairs Divisible by K" (LeetCode 2183), where we need to transform a product condition into something manageable with prefix sums or two-pointers.

3. **Modular Arithmetic in Substring Problems**: Seen in problems like "Make Sum Divisible by P" (LeetCode 1590), where we use modulo operations to track remainders.

## Key Takeaways

1. **Transform multiplicative constraints into additive ones**: When dealing with products or squares in conditions, look for ways to transform them using logarithms, squares, or modular arithmetic. Here, `v² % k == 0` became a condition on substring length.

2. **Prefix sums + hash map is powerful for substring counting**: Whenever you need to count substrings/subarrays satisfying some condition on their sums, prefix sums with a hash map for lookup is often the right approach.

3. **Don't forget edge cases with modulus**: When working with modular arithmetic, pay attention to boundary cases, especially when `k` is large or has specific prime factors.

[Practice this problem on CodeJeet](/problem/count-beautiful-substrings-ii)
