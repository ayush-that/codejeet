---
title: "How to Solve Count Substrings That Satisfy K-Constraint I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Substrings That Satisfy K-Constraint I. Easy difficulty, 78.8% acceptance rate. Topics: String, Sliding Window."
date: "2028-05-22"
category: "dsa-patterns"
tags: ["count-substrings-that-satisfy-k-constraint-i", "string", "sliding-window", "easy"]
---

# How to Solve Count Substrings That Satisfy K-Constraint I

This problem asks us to count all substrings of a binary string where either the count of `0`s is ≤ k OR the count of `1`s is ≤ k. What makes this interesting is that we need to efficiently count valid substrings without checking all O(n²) possibilities individually. The "either/or" condition means a substring is valid if it's not dominated by too many of either character.

## Visual Walkthrough

Let's trace through `s = "101"`, `k = 1`:

**Step 1:** Consider all substrings:

- `"1"`: 1 zero, 1 one → both ≤ 1 ✓
- `"0"`: 1 zero, 0 ones → both ≤ 1 ✓
- `"10"`: 1 zero, 1 one → both ≤ 1 ✓
- `"01"`: 1 zero, 1 one → both ≤ 1 ✓
- `"101"`: 1 zero, 2 ones → zeros ≤ 1 but ones = 2 > 1 ✗

Total valid substrings: 4

**Step 2:** Let's think systematically. For each starting position `i`, we can find the longest valid substring ending at each position `j`. But there's a better approach: count ALL substrings (n\*(n+1)/2) and subtract the invalid ones.

**Step 3:** What makes a substring invalid? It must have BOTH: zeros > k AND ones > k. So if k=1, invalid substrings need at least 2 zeros AND at least 2 ones.

**Step 4:** For `s = "101"`, k=1:

- Total substrings: 3\*4/2 = 6
- Invalid substrings: only `"101"` (2 ones, 1 zero → doesn't have 2 zeros, so not invalid)
  Wait, `"101"` has 2 ones > 1, but only 1 zero ≤ 1. Since it satisfies "zeros ≤ k", it's actually VALID by the "either/or" condition!

**Step 5:** Let's correct: A substring is valid if EITHER condition holds. So it's invalid only if BOTH conditions fail: zeros > k AND ones > k.

For `s = "10101"`, k=1:

- `"1010"`: 2 zeros, 2 ones → both > 1 → INVALID
- `"0101"`: 2 zeros, 2 ones → both > 1 → INVALID

**Step 6:** The insight: Instead of counting valid substrings directly, count total substrings and subtract truly invalid ones (where both counts exceed k).

## Brute Force Approach

The brute force checks all O(n²) substrings:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def brute_force(s, k):
    n = len(s)
    count = 0

    # Check all substrings
    for i in range(n):
        for j in range(i, n):
            zeros = 0
            ones = 0

            # Count characters in substring s[i:j+1]
            for idx in range(i, j + 1):
                if s[idx] == '0':
                    zeros += 1
                else:
                    ones += 1

            # Check if substring satisfies k-constraint
            if zeros <= k or ones <= k:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(s, k) {
  const n = s.length;
  let count = 0;

  // Check all substrings
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let zeros = 0;
      let ones = 0;

      // Count characters in substring s[i:j+1]
      for (let idx = i; idx <= j; idx++) {
        if (s[idx] === "0") {
          zeros++;
        } else {
          ones++;
        }
      }

      // Check if substring satisfies k-constraint
      if (zeros <= k || ones <= k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int bruteForce(String s, int k) {
    int n = s.length();
    int count = 0;

    // Check all substrings
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int zeros = 0;
            int ones = 0;

            // Count characters in substring s[i:j+1]
            for (int idx = i; idx <= j; idx++) {
                if (s.charAt(idx) == '0') {
                    zeros++;
                } else {
                    ones++;
                }
            }

            // Check if substring satisfies k-constraint
            if (zeros <= k || ones <= k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why it's too slow:** O(n³) time complexity. For n=1000, that's ~10⁹ operations. We need O(n) or O(n log n).

## Optimal Solution

The key insight: A substring is **invalid** if it has >k zeros AND >k ones. We can count total substrings and subtract invalid ones.

Better approach: For each position `i`, find how many substrings starting at `i` are valid. Use a sliding window that expands while the substring remains valid. When it becomes invalid, all shorter substrings from `i` are still valid.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countKConstraintSubstrings(s, k):
    """
    Counts substrings where either zeros <= k or ones <= k.

    Approach: For each starting position i, find the longest valid
    substring ending at position j. All substrings from i to j, i to j-1,
    ..., i to i are valid. So we add (j - i + 1) to count.

    We maintain two pointers: left (start) and right (end).
    Expand right while substring is valid. When invalid, move left forward.
    """
    n = len(s)
    count = 0

    # We'll do two passes: one counting substrings valid by zeros condition,
    # another by ones condition, then use inclusion-exclusion
    # But there's a simpler way: count substrings where BOTH zeros > k AND ones > k,
    # then subtract from total

    # Actually, let's implement the sliding window approach directly
    def count_substrings_with_condition(is_zero_condition):
        """
        Count substrings where count of (is_zero_condition ? '0' : '1') <= k
        """
        left = 0
        result = 0
        char_count = 0  # Count of the character we're checking

        for right in range(n):
            # Add current character to count if it matches our condition
            if (is_zero_condition and s[right] == '0') or \
               (not is_zero_condition and s[right] == '1'):
                char_count += 1

            # Shrink window from left while condition is violated
            while char_count > k:
                if (is_zero_condition and s[left] == '0') or \
                   (not is_zero_condition and s[left] == '1'):
                    char_count -= 1
                left += 1

            # All substrings ending at 'right' and starting from 'left' to 'right'
            # satisfy the condition
            result += (right - left + 1)

        return result

    # Count substrings satisfying zeros <= k
    count_zeros = count_substrings_with_condition(True)
    # Count substrings satisfying ones <= k
    count_ones = count_substrings_with_condition(False)

    # Total substrings (n * (n + 1) / 2)
    total_substrings = n * (n + 1) // 2

    # By inclusion-exclusion: |A ∪ B| = |A| + |B| - |A ∩ B|
    # But |A ∩ B| = substrings where BOTH zeros <= k AND ones <= k
    # = total_substrings - substrings where zeros > k OR ones > k
    # Actually simpler: count substrings where BOTH zeros > k AND ones > k
    # Then valid = total - invalid

    # Count invalid substrings (both zeros > k AND ones > k)
    # Use sliding window for this condition
    left = 0
    zeros_count = 0
    ones_count = 0
    invalid_count = 0

    for right in range(n):
        # Update counts
        if s[right] == '0':
            zeros_count += 1
        else:
            ones_count += 1

        # Shrink while both counts > k
        while zeros_count > k and ones_count > k:
            if s[left] == '0':
                zeros_count -= 1
            else:
                ones_count -= 1
            left += 1

        # All substrings ending at right with start < left are invalid
        # Because when we move left forward, we exclude substrings that become valid
        # Actually, we need to count substrings where BOTH conditions fail
        # Let's count valid directly instead

    # Actually, let's use a cleaner approach: count valid substrings directly
    # by finding for each left, the maximum right where substring is valid

    return count_zeros + count_ones - total_substrings + count_invalid_ones

# Simpler implementation:
def countKConstraintSubstrings(s, k):
    n = len(s)
    total = n * (n + 1) // 2

    # Count invalid substrings (both zeros > k AND ones > k)
    left = 0
    zeros = 0
    ones = 0
    invalid = 0

    for right in range(n):
        # Add current character
        if s[right] == '0':
            zeros += 1
        else:
            ones += 1

        # While substring has both zeros > k AND ones > k
        while zeros > k and ones > k:
            # Remove leftmost character
            if s[left] == '0':
                zeros -= 1
            else:
                ones -= 1
            left += 1

        # All substrings ending at 'right' that start before 'left' are invalid
        # Because they would have both zeros > k and ones > k
        invalid += left

    # Valid = total - invalid
    return total - invalid
```

```javascript
// Time: O(n) | Space: O(1)
function countKConstraintSubstrings(s, k) {
  const n = s.length;
  // Total number of substrings in a string of length n
  const totalSubstrings = (n * (n + 1)) / 2;

  let left = 0;
  let zeros = 0;
  let ones = 0;
  let invalidCount = 0;

  // Expand window with right pointer
  for (let right = 0; right < n; right++) {
    // Update count for current character
    if (s[right] === "0") {
      zeros++;
    } else {
      ones++;
    }

    // Shrink window from left while current substring
    // has BOTH zeros > k AND ones > k
    while (zeros > k && ones > k) {
      // Remove leftmost character from window
      if (s[left] === "0") {
        zeros--;
      } else {
        ones--;
      }
      left++;
    }

    // All substrings ending at 'right' that start before 'left'
    // are invalid (they have both zeros > k and ones > k)
    // Why? Because when we moved 'left' forward, we made the window valid.
    // Any substring starting before 'left' would still be invalid.
    invalidCount += left;
  }

  // Valid substrings = total - invalid
  return totalSubstrings - invalidCount;
}
```

```java
// Time: O(n) | Space: O(1)
public int countKConstraintSubstrings(String s, int k) {
    int n = s.length();
    // Total number of substrings: n * (n + 1) / 2
    long totalSubstrings = (long) n * (n + 1) / 2;

    int left = 0;
    int zeros = 0;
    int ones = 0;
    long invalidCount = 0;

    // Expand the window with right pointer
    for (int right = 0; right < n; right++) {
        // Update count for current character
        if (s.charAt(right) == '0') {
            zeros++;
        } else {
            ones++;
        }

        // Shrink window from left while current substring
        // violates both conditions (zeros > k AND ones > k)
        while (zeros > k && ones > k) {
            // Remove leftmost character from window
            if (s.charAt(left) == '0') {
                zeros--;
            } else {
                ones--;
            }
            left++;
        }

        // All substrings ending at 'right' that start before 'left'
        // are invalid because they would have both zeros > k and ones > k
        invalidCount += left;
    }

    // Valid substrings = total - invalid
    return (int) (totalSubstrings - invalidCount);
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string with the `right` pointer
- Each character is added to the window once and removed at most once
- The `while` loop doesn't make it O(n²) because `left` only moves forward

**Space Complexity:** O(1)

- We only use a few integer variables (`left`, `zeros`, `ones`, `invalidCount`)
- No additional data structures scale with input size

## Common Mistakes

1. **Double-counting valid substrings**: When using inclusion-exclusion (counting zeros-valid + ones-valid), candidates forget to subtract the intersection. Our solution avoids this by counting invalid substrings instead.

2. **Incorrect window shrinking condition**: Shrinking when `zeros > k OR ones > k` is wrong. We must shrink only when `zeros > k AND ones > k` because a substring is valid if EITHER condition holds.

3. **Off-by-one in counting invalid substrings**: When we shrink to `[left, right]` being valid, all substrings ending at `right` that start before `left` are invalid. Adding `left` (not `left+1`) is correct because starts from 0 to `left-1` are invalid.

4. **Integer overflow for large n**: For n=10⁵, total substrings ≈ 5×10⁹, which fits in 32-bit signed int? Actually 5×10⁹ > 2³¹-1, so use 64-bit integers (long in Java, normal int in Python handles big integers).

## When You'll See This Pattern

This sliding window pattern appears in problems about counting subarrays/substrings with constraints:

1. **Count Number of Nice Subarrays** (LeetCode 1248): Count subarrays with exactly k odd numbers. Similar sliding window but counts exact matches.

2. **Binary Subarrays With Sum** (LeetCode 930): Count subarrays with sum equal to goal. Uses similar prefix sum or sliding window techniques.

3. **Subarrays with K Different Integers** (LeetCode 992): Count subarrays with exactly K distinct integers. Uses "at most K" minus "at most K-1" trick.

The core pattern: When you need to count subarrays satisfying a condition, often you can count "at most X" and use sliding window, then adjust for exact counts if needed.

## Key Takeaways

1. **"Either/or" conditions often mean "not (A and B)"**: Instead of counting valid directly, count total and subtract invalid (where both conditions fail).

2. **Sliding window for "at most" constraints**: When counting subarrays with "at most K" of something, sliding window gives O(n) time.

3. **Fixed right, count valid starts**: For each ending position `right`, find the earliest `left` where `[left, right]` is valid. Then all starts from `left` to `right` give valid substrings ending at `right`.

[Practice this problem on CodeJeet](/problem/count-substrings-that-satisfy-k-constraint-i)
