---
title: "How to Solve Find the Closest Palindrome — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Closest Palindrome. Hard difficulty, 31.8% acceptance rate. Topics: Math, String."
date: "2026-11-19"
category: "dsa-patterns"
tags: ["find-the-closest-palindrome", "math", "string", "hard"]
---

# How to Solve "Find the Closest Palindrome"

This problem asks us to find the nearest palindrome number to a given integer `n`, excluding `n` itself. If two palindromes are equally close, we return the smaller one. What makes this problem tricky is that brute force checking numbers one by one is far too slow—`n` can be up to 10^18 digits long. Instead, we need a mathematical approach that constructs candidate palindromes directly from the input.

## Visual Walkthrough

Let's trace through an example: `n = "12345"`. Our goal is to find the closest palindrome to 12345.

**Step 1: Understand the structure of palindromes near 12345**

- The number has 5 digits (odd length)
- The first half is "123", the middle digit is "4", and the second half is "54" (which should mirror "123" in a palindrome)
- A palindrome based on this structure would have the first half mirrored around the middle

**Step 2: Generate candidate palindromes**
We'll generate three main candidates:

1. **Mirror the first half**: Take "123" and mirror it → "12321"
2. **Increment the first half**: "124" → "12421"
3. **Decrement the first half**: "122" → "12221"

**Step 3: Handle edge cases**
We also need to consider:

- **Boundary cases**: When the first half is at boundaries (like 100, 999)
- **Different lengths**: Sometimes the closest palindrome has fewer or more digits
- **Tie-breaking**: When two candidates are equally close, choose the smaller

**Step 4: Compare candidates**

- 12345 - 12321 = 24
- 12421 - 12345 = 76
- 12221 - 12345 = |-124| = 124
- The closest is 12321 (difference 24)

This approach shows we don't need to check every number—just a few strategically chosen candidates.

## Brute Force Approach

A naive solution would be to start from `n` and check numbers in both directions until finding a palindrome:

1. Convert `n` to an integer
2. Check `n-1`, `n+1`, `n-2`, `n+2`, etc.
3. For each number, check if it's a palindrome by converting to string and comparing with its reverse
4. Return the first palindrome found

**Why this fails:**

- For `n = 10^18`, we might need to check millions of numbers
- Each palindrome check takes O(d) time where d is the number of digits
- Worst-case time complexity is O(n × d), which is completely infeasible
- Even for moderate inputs like `n = 100000`, we'd need to check thousands of numbers

The brute force approach shows why we need a smarter method—we can't afford to iterate through numbers one by one.

## Optimized Approach

The key insight is that **the closest palindrome will be formed by manipulating the first half of the number**. Here's the reasoning:

1. **Palindrome structure**: A palindrome mirrors its first half. For example, "12321" has first half "123" mirrored.
2. **Three main candidates**:
   - **Mirror the first half**: Create a palindrome by taking the first half and mirroring it
   - **Increment the first half**: Add 1 to the first half, then mirror
   - **Decrement the first half**: Subtract 1 from the first half, then mirror
3. **Boundary cases**: When the first half is at boundaries (like 100 or 999), the closest palindrome might have a different number of digits:
   - For "1000", decrementing gives "999" (one fewer digit)
   - For "999", incrementing gives "1001" (one more digit)
4. **Tie-breaking**: When two candidates are equally close, choose the smaller one

**Why this works:**

- The closest palindrome must be very close to the original number
- Changing digits in the second half of a palindrome requires changing the first half too (to maintain the palindrome property)
- Therefore, the closest palindromes will be those formed by minimal changes to the first half

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(d) where d is the number of digits in n | Space: O(d)
def nearestPalindromic(n: str) -> str:
    # Convert n to integer for calculations
    num = int(n)
    length = len(n)

    # Edge case: single digit numbers
    if num <= 10:
        return str(num - 1)
    if num == 11:
        return "9"

    # Generate candidate palindromes
    candidates = set()

    # Get the first half of the number
    half = int(n[:(length + 1) // 2])

    # Candidate 1: Mirror the first half
    # For odd length, we exclude the middle digit when mirroring
    mirror = str(half)
    if length % 2 == 0:
        # Even length: mirror entire half
        candidate = mirror + mirror[::-1]
    else:
        # Odd length: mirror first half excluding middle digit
        candidate = mirror + mirror[-2::-1]
    candidates.add(candidate)

    # Candidate 2: Increment first half and mirror
    incremented_half = str(half + 1)
    if len(incremented_half) == len(str(half)):
        # Same number of digits after increment
        if length % 2 == 0:
            candidate = incremented_half + incremented_half[::-1]
        else:
            candidate = incremented_half + incremented_half[-2::-1]
    else:
        # Increment caused carry-over (e.g., 99 -> 100)
        if length % 2 == 0:
            # For even length, new number has one more digit
            candidate = incremented_half + incremented_half[-2::-1]
        else:
            # For odd length, middle digit disappears
            candidate = incremented_half + incremented_half[::-1]
    candidates.add(candidate)

    # Candidate 3: Decrement first half and mirror
    decremented_half = str(half - 1)
    if decremented_half != "0" and len(decremented_half) == len(str(half)):
        # Same number of digits after decrement
        if length % 2 == 0:
            candidate = decremented_half + decremented_half[::-1]
        else:
            candidate = decremented_half + decremented_half[-2::-1]
    else:
        # Decrement caused underflow (e.g., 100 -> 99)
        # Result will have all 9's with one fewer digit
        candidate = "9" * (length - 1)
    candidates.add(candidate)

    # Special candidates: numbers with all 9's (one fewer digit)
    # and 10...01 (one more digit)
    candidates.add("9" * (length - 1))  # e.g., 999 for n=1000
    candidates.add("1" + "0" * (length - 1) + "1")  # e.g., 1001 for n=999

    # Remove the original number if it's in candidates
    candidates.discard(n)

    # Find the closest palindrome
    min_diff = float('inf')
    result = ""

    for cand in candidates:
        cand_num = int(cand)
        diff = abs(cand_num - num)

        # Update if this candidate is closer
        if diff < min_diff:
            min_diff = diff
            result = cand
        # Tie-breaking: if equally close, choose smaller
        elif diff == min_diff and cand_num < int(result):
            result = cand

    return result
```

```javascript
// Time: O(d) where d is the number of digits in n | Space: O(d)
function nearestPalindromic(n) {
  const num = parseInt(n);
  const length = n.length;

  // Edge cases for small numbers
  if (num <= 10) return (num - 1).toString();
  if (num === 11) return "9";

  const candidates = new Set();

  // Get the first half of the number
  const half = parseInt(n.substring(0, Math.floor((length + 1) / 2)));

  // Helper function to create palindrome from half
  const createPalindrome = (halfStr, isEvenLength) => {
    if (isEvenLength) {
      return halfStr + halfStr.split("").reverse().join("");
    } else {
      return halfStr + halfStr.slice(0, -1).split("").reverse().join("");
    }
  };

  // Candidate 1: Mirror the first half
  const halfStr = half.toString();
  candidates.add(createPalindrome(halfStr, length % 2 === 0));

  // Candidate 2: Increment first half and mirror
  const incrementedHalf = (half + 1).toString();
  if (incrementedHalf.length === halfStr.length) {
    candidates.add(createPalindrome(incrementedHalf, length % 2 === 0));
  } else {
    // Handle carry-over
    if (length % 2 === 0) {
      candidates.add(incrementedHalf + incrementedHalf.slice(0, -1).split("").reverse().join(""));
    } else {
      candidates.add(incrementedHalf + incrementedHalf.split("").reverse().join(""));
    }
  }

  // Candidate 3: Decrement first half and mirror
  const decrementedHalf = (half - 1).toString();
  if (decrementedHalf !== "0" && decrementedHalf.length === halfStr.length) {
    candidates.add(createPalindrome(decrementedHalf, length % 2 === 0));
  } else {
    // Handle underflow - all 9's with one fewer digit
    candidates.add("9".repeat(length - 1));
  }

  // Special boundary candidates
  candidates.add("9".repeat(length - 1)); // e.g., 999 for n=1000
  candidates.add("1" + "0".repeat(length - 1) + "1"); // e.g., 1001 for n=999

  // Remove the original number
  candidates.delete(n);

  // Find the closest palindrome
  let minDiff = Infinity;
  let result = "";

  for (const cand of candidates) {
    const candNum = parseInt(cand);
    const diff = Math.abs(candNum - num);

    if (diff < minDiff) {
      minDiff = diff;
      result = cand;
    } else if (diff === minDiff && candNum < parseInt(result)) {
      // Tie-breaking: choose smaller number
      result = cand;
    }
  }

  return result;
}
```

```java
// Time: O(d) where d is the number of digits in n | Space: O(d)
class Solution {
    public String nearestPalindromic(String n) {
        long num = Long.parseLong(n);
        int length = n.length();

        // Edge cases for small numbers
        if (num <= 10) return String.valueOf(num - 1);
        if (num == 11) return "9";

        Set<Long> candidates = new HashSet<>();

        // Get the first half of the number
        long half = Long.parseLong(n.substring(0, (length + 1) / 2));

        // Generate three main candidates
        generateCandidates(candidates, half, length);

        // Add boundary candidates
        // All 9's with one fewer digit (e.g., 999 for n=1000)
        candidates.add((long) Math.pow(10, length - 1) - 1);
        // 10...01 with one more digit (e.g., 1001 for n=999)
        candidates.add((long) Math.pow(10, length) + 1);

        // Remove the original number
        candidates.remove(num);

        // Find the closest palindrome
        long minDiff = Long.MAX_VALUE;
        long result = 0;

        for (long cand : candidates) {
            long diff = Math.abs(cand - num);

            if (diff < minDiff) {
                minDiff = diff;
                result = cand;
            } else if (diff == minDiff && cand < result) {
                // Tie-breaking: choose smaller number
                result = cand;
            }
        }

        return String.valueOf(result);
    }

    private void generateCandidates(Set<Long> candidates, long half, int length) {
        // Helper function to create palindrome from half
        long[] variations = {half - 1, half, half + 1};

        for (long h : variations) {
            if (h <= 0) continue;

            String halfStr = String.valueOf(h);
            StringBuilder sb = new StringBuilder(halfStr);

            // Create the mirrored part
            String mirrored;
            if (length % 2 == 0) {
                // Even length: mirror entire half
                mirrored = new StringBuilder(halfStr).reverse().toString();
            } else {
                // Odd length: mirror first half excluding middle digit
                mirrored = new StringBuilder(halfStr.substring(0, halfStr.length() - 1))
                          .reverse().toString();
            }

            sb.append(mirrored);
            String candidateStr = sb.toString();

            // Handle cases where length might change
            if (candidateStr.length() == length) {
                candidates.add(Long.parseLong(candidateStr));
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)**

- `d` is the number of digits in `n`
- We generate a constant number of candidates (5-7)
- Each candidate construction involves string manipulation of O(d) length
- Comparing candidates also takes O(d) time for string to integer conversion

**Space Complexity: O(d)**

- We store a constant number of candidate strings, each of length O(d)
- The string manipulations create temporary strings of length O(d)
- The set of candidates stores a constant number of strings

The efficiency comes from generating only a handful of candidates instead of checking numbers sequentially.

## Common Mistakes

1. **Forgetting boundary cases**: When the first half is at boundaries like 100 or 999, the closest palindrome might have a different number of digits. For example, for `n = "1000"`, the closest palindrome is `"999"` (3 digits), not `"1001"` (4 digits).

2. **Incorrect tie-breaking**: The problem specifies that when two palindromes are equally close, we should return the smaller one. Candidates often forget to implement this or implement it incorrectly by comparing strings instead of numbers.

3. **Handling odd vs even lengths incorrectly**: The mirroring process differs for odd and even length numbers. For odd length, we exclude the middle digit when creating the mirrored part. Mixing these up leads to incorrect candidates.

4. **Not removing the original number**: If the input `n` is already a palindrome, we need to exclude it from consideration. Failing to do this returns the input itself, violating the "not including itself" requirement.

## When You'll See This Pattern

This problem uses the **candidate generation** pattern combined with **mathematical construction**. You'll see similar approaches in:

1. **"Next Palindrome Using Same Digits"** - Also requires constructing palindromes by manipulating halves, but with the additional constraint of using the same digits.

2. **"Find Palindrome With Fixed Length"** - Involves generating palindromes of a specific length, often by constructing from the first half.

3. **"Find the Count of Good Integers"** - While more complex, it involves palindrome properties and systematic counting.

The core technique is recognizing that many problems involving palindromes can be solved by working with halves rather than the entire number, since palindromes have symmetric structure.

## Key Takeaways

1. **Palindromes are about symmetry**: When dealing with palindrome problems, always think in terms of the first half. The second half is determined by the first half.

2. **Generate candidates, don't search**: For optimization problems, it's often more efficient to generate a few likely candidates than to search through many possibilities.

3. **Boundary cases matter**: Special attention is needed at numerical boundaries (powers of 10, all 9's) where the number of digits changes.

Related problems: [Find Palindrome With Fixed Length](/problem/find-palindrome-with-fixed-length), [Next Palindrome Using Same Digits](/problem/next-palindrome-using-same-digits), [Find the Count of Good Integers](/problem/find-the-count-of-good-integers)
