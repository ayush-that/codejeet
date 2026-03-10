---
title: "How to Solve Find Valid Pair of Adjacent Digits in String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Valid Pair of Adjacent Digits in String. Easy difficulty, 60.6% acceptance rate. Topics: Hash Table, String, Counting."
date: "2028-09-05"
category: "dsa-patterns"
tags: ["find-valid-pair-of-adjacent-digits-in-string", "hash-table", "string", "counting", "easy"]
---

## How to Solve "Find Valid Pair of Adjacent Digits in String"

You're given a string of digits and need to find the first adjacent pair where: (1) the digits are different, and (2) each digit appears exactly as many times as its numeric value. The challenge is efficiently checking both conditions without repeatedly scanning the string.

**What makes this interesting:** You need to track frequencies while checking adjacent pairs. A naive approach would repeatedly count occurrences, but the optimal solution uses a single frequency pass to enable O(1) lookups.

---

## Visual Walkthrough

Let's trace through `s = "224331"`:

**Step 1: Count frequencies**

- Digit '2' appears 2 times ✓ (value 2 matches count 2)
- Digit '4' appears 1 time ✗ (value 4 ≠ count 1)
- Digit '3' appears 2 times ✗ (value 3 ≠ count 2)
- Digit '1' appears 1 time ✓ (value 1 matches count 1)

**Step 2: Check adjacent pairs**

1. Positions 0-1: "22" → digits equal ✗ (first condition fails)
2. Positions 1-2: "24" → digits different ✓, check counts:
   - '2' appears 2 times, value=2 ✓
   - '4' appears 1 time, value=4 ✗ → invalid pair
3. Positions 2-3: "43" → digits different ✓, check counts:
   - '4' appears 1 time, value=4 ✗ → invalid pair
4. Positions 3-4: "33" → digits equal ✗
5. Positions 4-5: "31" → digits different ✓, check counts:
   - '3' appears 2 times, value=3 ✗ → invalid pair

No valid pair exists → return `""`.

---

## Brute Force Approach

A naive solution would check each adjacent pair and, for each pair, scan the entire string to count occurrences of both digits:

1. For each index `i` from `0` to `n-2`:
   - If `s[i] != s[i+1]`:
     - Count occurrences of `s[i]` in entire string
     - Count occurrences of `s[i+1]` in entire string
     - Check if count matches digit value for both

**Why this fails:** Counting for each pair requires O(n) time, making overall complexity O(n²). For strings of length 10⁵, this becomes 10¹⁰ operations — far too slow.

---

## Optimal Solution

The key insight: **Precompute all digit frequencies first**. Then checking any pair becomes O(1) lookup.

**Algorithm:**

1. Count frequency of each digit (0-9) in the string
2. Iterate through adjacent pairs:
   - Skip if digits are equal
   - Check if `freq[digit] == int(digit)` for both digits
3. Return first valid pair found

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed 10-element array
def findValidPair(s: str) -> str:
    # Step 1: Count frequency of each digit (0-9)
    freq = [0] * 10  # Index represents digit, value is count
    for char in s:
        digit = int(char)  # Convert char to integer
        freq[digit] += 1

    # Step 2: Check each adjacent pair
    for i in range(len(s) - 1):
        first_digit = int(s[i])
        second_digit = int(s[i+1])

        # Condition 1: Digits must be different
        if first_digit == second_digit:
            continue

        # Condition 2: Each digit's count must equal its value
        if freq[first_digit] == first_digit and freq[second_digit] == second_digit:
            return s[i] + s[i+1]  # Return the pair as string

    # No valid pair found
    return ""

# Example usage:
# print(findValidPair("224331"))  # Returns ""
# print(findValidPair("3133"))    # Returns "13"
```

```javascript
// Time: O(n) | Space: O(1) - fixed 10-element array
function findValidPair(s) {
  // Step 1: Count frequency of each digit (0-9)
  const freq = new Array(10).fill(0);
  for (let char of s) {
    const digit = parseInt(char); // Convert char to integer
    freq[digit]++;
  }

  // Step 2: Check each adjacent pair
  for (let i = 0; i < s.length - 1; i++) {
    const firstDigit = parseInt(s[i]);
    const secondDigit = parseInt(s[i + 1]);

    // Condition 1: Digits must be different
    if (firstDigit === secondDigit) {
      continue;
    }

    // Condition 2: Each digit's count must equal its value
    if (freq[firstDigit] === firstDigit && freq[secondDigit] === secondDigit) {
      return s[i] + s[i + 1]; // Return the pair as string
    }
  }

  // No valid pair found
  return "";
}

// Example usage:
// console.log(findValidPair("224331"));  // Returns ""
// console.log(findValidPair("3133"));    // Returns "13"
```

```java
// Time: O(n) | Space: O(1) - fixed 10-element array
public class Solution {
    public String findValidPair(String s) {
        // Step 1: Count frequency of each digit (0-9)
        int[] freq = new int[10];
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            int digit = c - '0';  // Convert char to integer
            freq[digit]++;
        }

        // Step 2: Check each adjacent pair
        for (int i = 0; i < s.length() - 1; i++) {
            int firstDigit = s.charAt(i) - '0';
            int secondDigit = s.charAt(i + 1) - '0';

            // Condition 1: Digits must be different
            if (firstDigit == secondDigit) {
                continue;
            }

            // Condition 2: Each digit's count must equal its value
            if (freq[firstDigit] == firstDigit && freq[secondDigit] == secondDigit) {
                // Return the pair as string
                return String.valueOf(s.charAt(i)) + s.charAt(i + 1);
            }
        }

        // No valid pair found
        return "";
    }
}

// Example usage:
// Solution sol = new Solution();
// System.out.println(sol.findValidPair("224331"));  // Returns ""
// System.out.println(sol.findValidPair("3133"));    // Returns "13"
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- First pass to count frequencies: O(n)
- Second pass to check adjacent pairs: O(n)
- Total: O(2n) = O(n)

**Space Complexity: O(1)**

- The frequency array has fixed size 10 (for digits 0-9)
- No additional space grows with input size

---

## Common Mistakes

1. **Forgetting to check "digits different" first**: Some candidates check the frequency condition first, wasting computation on invalid pairs. Always check the cheaper condition first.

2. **Off-by-one in loop bounds**: When checking `s[i]` and `s[i+1]`, the loop should run `i < len(s)-1`, not `i < len(s)`. Accessing `s[i+1]` with `i = len(s)-1` causes index error.

3. **Incorrect frequency comparison**: Comparing `freq[digit] == digit` works because digit values are 0-9. Don't compare `freq[digit] == char` or forget to convert char to int.

4. **Returning too early**: The problem asks for the **first** valid pair. Some candidates collect all pairs then return the first — unnecessary work. Return immediately when found.

---

## When You'll See This Pattern

This problem combines **frequency counting** with **adjacent element checking** — a common pattern in string/array problems:

1. **Majority Element (LeetCode 169)**: Find element appearing > n/2 times. Uses frequency counting but with Boyer-Moore optimization.

2. **Contains Duplicate (LeetCode 217)**: Check if any value appears at least twice. Uses hash set for O(1) lookups.

3. **First Unique Character in String (LeetCode 387)**: Count frequencies first, then scan to find first char with count = 1.

**Pattern recognition**: When you need to check properties based on frequency while scanning, precompute frequencies first.

---

## Key Takeaways

1. **Precomputation is powerful**: When you need to repeatedly check some property (like frequency), compute it once upfront rather than recalculating.

2. **Check cheap conditions first**: Always test simple conditions (like equality) before expensive ones (like frequency validation).

3. **Fixed-size arrays beat hash maps for small ranges**: When keys are limited (digits 0-9), arrays are faster and simpler than hash maps.

---

Related problems: [Majority Element](/problem/majority-element), [Contains Duplicate](/problem/contains-duplicate)
