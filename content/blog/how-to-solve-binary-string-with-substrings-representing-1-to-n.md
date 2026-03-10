---
title: "How to Solve Binary String With Substrings Representing 1 To N — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary String With Substrings Representing 1 To N. Medium difficulty, 58.4% acceptance rate. Topics: Hash Table, String, Bit Manipulation, Sliding Window."
date: "2028-08-14"
category: "dsa-patterns"
tags:
  [
    "binary-string-with-substrings-representing-1-to-n",
    "hash-table",
    "string",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve "Binary String With Substrings Representing 1 To N"

This problem asks: given a binary string `s` and an integer `n`, check whether every integer from 1 to `n` has its binary representation appear as a contiguous substring within `s`. The challenge is that checking all numbers from 1 to `n` individually could be extremely inefficient when `n` is large (up to 10⁹), but the length of `s` is limited (up to 1000). This creates an interesting tension: we can't actually generate all binary strings for 1 to `n`, but we can leverage the fact that `s` has limited length to bound our search.

## Visual Walkthrough

Let's trace through an example: `s = "0110"`, `n = 3`.

We need to check if binary representations of 1, 2, and 3 all appear as substrings in `"0110"`:

1. **Binary representations:**
   - 1 → `"1"`
   - 2 → `"10"`
   - 3 → `"11"`

2. **Check each in `s`:**
   - `"1"` appears at indices 1 and 2: `"0[1]10"` and `"01[1]0"` ✓
   - `"10"` appears at indices 1-2: `"0[10]10"` ✓
   - `"11"` appears at indices 1-2: `"0[11]0"` ✓

All three are present, so the answer is `true`.

Now consider `s = "0110"`, `n = 4`:

- 4 → `"100"`
- `"100"` does NOT appear in `"0110"` (the substring `"100"` is not found)
- Answer is `false`

The key insight: we don't need to check every number from 1 to `n`. Since `s` has limited length, there's a limit to how long a binary substring it can contain. If a number requires more bits than the length of `s`, it can't possibly be a substring.

## Brute Force Approach

The most straightforward approach is to iterate `i` from 1 to `n`, convert each `i` to its binary string (without leading zeros), and check if that binary string exists in `s` using Python's `in` operator or similar string search.

**Why this fails:**
When `n` is up to 10⁹, iterating through all numbers is impossible within time limits. Even with efficient substring checking (O(L) per check where L is string length), we'd have O(n × L) operations, which is far too slow.

However, there's an even more fundamental issue: generating binary strings for numbers up to 10⁹ would create strings with up to 30 bits, but checking if a 30-bit string exists in a 1000-character string is actually reasonable. The real problem is the iteration count, not the individual checks.

## Optimized Approach

The critical observation is that **we only need to check numbers whose binary representation length is ≤ len(s)**. Why? Because a substring cannot be longer than the string itself.

But we can do even better with a **reverse search**: instead of generating numbers and checking if they're in `s`, we can:

1. Extract all unique substrings from `s`
2. Convert those substrings to their integer values
3. Check if all numbers from 1 to `n` are covered

However, extracting all substrings of `s` would be O(len(s)²), which for `s` length up to 1000 means up to ~500,000 substrings. That's manageable, but we can optimize further.

**Key insight:** We only need to check numbers up to a certain bound. Actually, we can think in reverse: for each possible starting position in `s`, we can generate numbers by extending to the right, but stop when the number exceeds `n`. Since `s` length is limited to 1000, this gives us an efficient approach.

The optimal approach uses a **sliding window with early stopping**:

1. Initialize a set to track found numbers
2. For each starting index `i` in `s`:
   - Initialize `num = 0`
   - For each ending index `j` from `i` to min(len(s)-1, i+30) (since 2³⁰ > 10⁹):
     - Build the number bit by bit: `num = (num << 1) | int(s[j])`
     - If `1 ≤ num ≤ n`, add to found set
     - If `num > n`, break (further extensions will only make num larger)
3. Check if found set size equals `n`

**Why this works:**

- We only generate numbers that actually appear in `s`
- We stop early when `num > n` because adding more bits (shifting left) only increases the value
- The inner loop runs at most 30 times per starting position because numbers beyond 30 bits exceed 10⁹

## Optimal Solution

<div class="code-group">

```python
# Time: O(min(n, m * log n) * m) where m = len(s)
# Space: O(min(n, m²)) for the found set
def queryString(s: str, n: int) -> bool:
    """
    Check if all integers from 1 to n have their binary representations
    as substrings in s.

    Approach: For each starting position in s, build numbers by extending
    to the right. Stop when number exceeds n (since adding bits only increases value).
    """
    found = set()  # Track numbers we've found in s

    m = len(s)
    # Iterate through all possible starting positions
    for i in range(m):
        num = 0
        # Extend substring to the right, but limit to 30 bits
        # because 2^30 > 10^9 (max n)
        for j in range(i, min(m, i + 30)):
            # Build number bit by bit: shift left and add current bit
            num = (num << 1) | (ord(s[j]) - ord('0'))

            # Only care about numbers in range [1, n]
            if 1 <= num <= n:
                found.add(num)

            # Early stopping: if num already exceeds n, further bits
            # will only make it larger (since we're shifting left)
            if num > n:
                break

    # Check if we found all numbers from 1 to n
    return len(found) == n
```

```javascript
// Time: O(min(n, m * log n) * m) where m = s.length
// Space: O(min(n, m²)) for the found set
function queryString(s, n) {
  /**
   * Check if all integers from 1 to n have their binary representations
   * as substrings in s.
   *
   * Approach: For each starting position in s, build numbers by extending
   * to the right. Stop when number exceeds n (since adding bits only increases value).
   */
  const found = new Set(); // Track numbers we've found in s

  const m = s.length;
  // Iterate through all possible starting positions
  for (let i = 0; i < m; i++) {
    let num = 0;
    // Extend substring to the right, but limit to 30 bits
    // because 2^30 > 10^9 (max n)
    for (let j = i; j < Math.min(m, i + 30); j++) {
      // Build number bit by bit: shift left and add current bit
      num = (num << 1) | (s.charCodeAt(j) - "0".charCodeAt(0));

      // Only care about numbers in range [1, n]
      if (num >= 1 && num <= n) {
        found.add(num);
      }

      // Early stopping: if num already exceeds n, further bits
      // will only make it larger (since we're shifting left)
      if (num > n) {
        break;
      }
    }
  }

  // Check if we found all numbers from 1 to n
  return found.size === n;
}
```

```java
// Time: O(min(n, m * log n) * m) where m = s.length()
// Space: O(min(n, m²)) for the found set
class Solution {
    public boolean queryString(String s, int n) {
        /**
         * Check if all integers from 1 to n have their binary representations
         * as substrings in s.
         *
         * Approach: For each starting position in s, build numbers by extending
         * to the right. Stop when number exceeds n (since adding bits only increases value).
         */
        Set<Integer> found = new HashSet<>();  // Track numbers we've found in s

        int m = s.length();
        // Iterate through all possible starting positions
        for (int i = 0; i < m; i++) {
            int num = 0;
            // Extend substring to the right, but limit to 30 bits
            // because 2^30 > 10^9 (max n)
            for (int j = i; j < Math.min(m, i + 30); j++) {
                // Build number bit by bit: shift left and add current bit
                num = (num << 1) | (s.charAt(j) - '0');

                // Only care about numbers in range [1, n]
                if (num >= 1 && num <= n) {
                    found.add(num);
                }

                // Early stopping: if num already exceeds n, further bits
                // will only make it larger (since we're shifting left)
                if (num > n) {
                    break;
                }
            }
        }

        // Check if we found all numbers from 1 to n
        return found.size() == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m²) in the worst case, but practically O(m × min(log n, m))

- Outer loop runs `m` times (where `m = len(s)`)
- Inner loop runs at most `min(30, m)` times because:
  - We limit to 30 bits since 2³⁰ > 10⁹ (max `n`)
  - We also stop early when `num > n`
- Each iteration does O(1) bit operations and set operations
- In worst case (when `n` is very large), we check up to `m` bits per starting position

**Space Complexity:** O(min(n, m²))

- We store found numbers in a set
- At most, we could find all substrings of `s`, which is O(m²)
- But we also can't have more than `n` numbers
- So actual bound is min(n, m²)

## Common Mistakes

1. **Checking all numbers from 1 to n directly:** This is the most tempting mistake. When `n = 10⁹`, iterating through all numbers is impossible. Always consider the constraints: `s` length ≤ 1000 suggests we should think in terms of substrings of `s`, not all numbers up to `n`.

2. **Forgetting to stop early when num > n:** Once the current number exceeds `n`, adding more bits (by shifting left) will only make it larger. Failing to break here wastes time. Remember: `(num << 1) | bit ≥ num << 1 ≥ 2 × num`, so it grows exponentially.

3. **Incorrect bit manipulation:** When building the number, use `(num << 1) | bit`, not `num + bit` or `num * 2 + bit`. While mathematically equivalent, bit operations are clearer for this problem. Also ensure you convert char to int correctly: `ord(s[j]) - ord('0')` in Python, `s.charAt(j) - '0'` in Java.

4. **Not limiting inner loop to ~30 iterations:** Since `n ≤ 10⁹`, numbers need at most ⌊log₂(10⁹)⌋ + 1 ≈ 30 bits. Checking beyond 30 bits per starting position is wasted work. This optimization reduces the constant factor significantly.

## When You'll See This Pattern

This problem combines **substring enumeration** with **early stopping based on value constraints**. You'll see similar patterns in:

1. **Maximum Product Subarray (LeetCode 152):** While different in goal, it also involves iterating through subarrays with early insights about how values change as you extend.

2. **Subarray Sum Equals K (LeetCode 560):** This uses prefix sums to efficiently check subarrays, similar to how we build numbers incrementally here.

3. **Count Number of Nice Subarrays (LeetCode 1248):** Another substring/subarray problem where you need to count valid sequences meeting certain criteria, often optimized with sliding windows or two pointers.

The core technique of **building values incrementally while maintaining bounds** appears in many substring problems where the value has monotonic properties (like binary numbers increasing when you add bits).

## Key Takeaways

1. **When n is large but input string is small, think in terms of substrings, not all numbers:** The limited length of `s` (1000) is a hint that we should generate candidates from `s`, not from the range 1 to `n`.

2. **Early stopping based on value monotonicity is powerful:** If extending a substring always increases (or decreases) some value, you can stop early. Here, adding bits always increases the binary number, so once we exceed `n`, we can stop.

3. **Bit manipulation is cleaner for binary string problems:** Using shift and OR operations clearly communicates you're building binary numbers, and it's more efficient than string concatenation and conversion.

[Practice this problem on CodeJeet](/problem/binary-string-with-substrings-representing-1-to-n)
