---
title: "How to Solve Find Kth Bit in Nth Binary String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Kth Bit in Nth Binary String. Medium difficulty, 70.2% acceptance rate. Topics: String, Recursion, Simulation."
date: "2026-05-17"
category: "dsa-patterns"
tags: ["find-kth-bit-in-nth-binary-string", "string", "recursion", "simulation", "medium"]
---

# How to Solve Find Kth Bit in Nth Binary String

This problem asks us to find the k-th bit in the n-th binary string defined by a recursive construction rule. The tricky part is that the strings grow exponentially (length = 2ⁿ - 1), so we can't actually build them for large n. We need a smarter approach that finds the bit without constructing the entire string.

## Visual Walkthrough

Let's trace through the construction for n=4 to understand the pattern:

**S₁ = "0"** (length = 1)

**S₂ = S₁ + "1" + reverse(invert(S₁))**

- S₁ = "0"
- invert("0") = "1"
- reverse("1") = "1"
- S₂ = "0" + "1" + "1" = "011" (length = 3)

**S₃ = S₂ + "1" + reverse(invert(S₂))**

- S₂ = "011"
- invert("011") = "100"
- reverse("100") = "001"
- S₃ = "011" + "1" + "001" = "0111001" (length = 7)

**S₄ = S₃ + "1" + reverse(invert(S₃))**

- S₃ = "0111001"
- invert("0111001") = "1000110"
- reverse("1000110") = "0110001"
- S₄ = "0111001" + "1" + "0110001" = "011100110110001" (length = 15)

Now let's say we want the 9th bit (k=9) in S₄:

- S₄ = "0 1 1 1 0 0 1 1 0 1 1 0 0 0 1"
- Positions: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
- The 9th bit is "0"

Notice the structure: each string has three parts:

1. Left part = previous string (Sₙ₋₁)
2. Middle = always "1"
3. Right part = reverse(invert(Sₙ₋₁))

The length of Sₙ is 2ⁿ - 1, and the middle is always at position 2ⁿ⁻¹.

## Brute Force Approach

The most straightforward approach is to actually build the strings according to the rules:

1. Start with S₁ = "0"
2. For i from 2 to n:
   - Compute invert(Sᵢ₋₁) by flipping each bit
   - Reverse the inverted string
   - Concatenate: Sᵢ = Sᵢ₋₁ + "1" + reversed_inverted
3. Return the k-th character of Sₙ

<div class="code-group">

```python
# Time: O(2ⁿ) | Space: O(2ⁿ)
def findKthBit_brute(n, k):
    # Start with the base case
    s = "0"

    # Build up to Sₙ
    for i in range(2, n + 1):
        # Invert the current string (0→1, 1→0)
        inverted = ''.join('1' if c == '0' else '0' for c in s)
        # Reverse the inverted string
        reversed_inverted = inverted[::-1]
        # Build the next string
        s = s + "1" + reversed_inverted

    # Return the k-th bit (1-indexed)
    return s[k - 1]
```

```javascript
// Time: O(2ⁿ) | Space: O(2ⁿ)
function findKthBitBrute(n, k) {
  // Start with the base case
  let s = "0";

  // Build up to Sₙ
  for (let i = 2; i <= n; i++) {
    // Invert the current string (0→1, 1→0)
    let inverted = "";
    for (let c of s) {
      inverted += c === "0" ? "1" : "0";
    }
    // Reverse the inverted string
    let reversedInverted = inverted.split("").reverse().join("");
    // Build the next string
    s = s + "1" + reversedInverted;
  }

  // Return the k-th bit (1-indexed)
  return s[k - 1];
}
```

```java
// Time: O(2ⁿ) | Space: O(2ⁿ)
public char findKthBitBrute(int n, int k) {
    // Start with the base case
    StringBuilder s = new StringBuilder("0");

    // Build up to Sₙ
    for (int i = 2; i <= n; i++) {
        // Invert the current string (0→1, 1→0)
        StringBuilder inverted = new StringBuilder();
        for (int j = 0; j < s.length(); j++) {
            inverted.append(s.charAt(j) == '0' ? '1' : '0');
        }
        // Reverse the inverted string
        StringBuilder reversedInverted = inverted.reverse();
        // Build the next string
        s.append("1").append(reversedInverted);
    }

    // Return the k-th bit (1-indexed)
    return s.charAt(k - 1);
}
```

</div>

**Why this fails:** The length of Sₙ is 2ⁿ - 1, which grows exponentially. For n=20, the string would have over 1 million characters. For n=30, over 1 billion characters! This approach quickly becomes impossible both in time and memory.

## Optimized Approach

The key insight is that we don't need to build the entire string. We can use **recursion** to directly compute the k-th bit:

1. **Base case:** When n=1, S₁ = "0", so return "0"
2. **Find the middle:** The middle of Sₙ is at position mid = 2ⁿ⁻¹
3. **Three cases:**
   - If k = mid: Return "1" (the middle is always "1")
   - If k < mid: The bit is in the left part (Sₙ₋₁), so recursively find the k-th bit in Sₙ₋₁
   - If k > mid: The bit is in the right part, which is reverse(invert(Sₙ₋₁))
     - Let's find which position in Sₙ₋₁ this corresponds to
     - Since the right part is the reverse of invert(Sₙ₋₁), position k in Sₙ corresponds to position (2ⁿ - k) in invert(Sₙ₋₁)
     - But we need the position in Sₙ₋₁, not invert(Sₙ₋₁)
     - Actually, position k in Sₙ corresponds to position (mid\*2 - k) in the right part
     - And since the right part is reverse(invert(Sₙ₋₁)), we need to recursively find the bit at position (mid\*2 - k) in Sₙ₋₁, then invert it

Let's work through our example with n=4, k=9:

- mid = 2⁴⁻¹ = 8
- k=9 > mid=8, so we're in the right part
- Position in right part = mid\*2 - k = 16 - 9 = 7
- So we need the 7th bit of reverse(invert(S₃))
- But reverse(invert(S₃))[7] = invert(S₃)[1] (because it's reversed)
- And invert(S₃)[1] = opposite of S₃[1]
- So we recursively find S₃[1] and invert it

This recursive approach has O(n) time complexity since we make at most n recursive calls, each reducing n by 1.

## Optimal Solution

Here's the recursive solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for recursion stack
def findKthBit(n, k):
    """
    Returns the k-th bit (1-indexed) in the n-th binary string.
    Uses recursion to avoid building the entire string.
    """
    # Base case: S₁ = "0"
    if n == 1:
        return '0'

    # Calculate the middle position (2ⁿ⁻¹)
    # Using bit shifting: 1 << (n-1) = 2ⁿ⁻¹
    mid = 1 << (n - 1)  # Equivalent to 2**(n-1)

    # Case 1: k is exactly at the middle
    if k == mid:
        # The middle character is always '1'
        return '1'

    # Case 2: k is in the left half (Sₙ₋₁)
    if k < mid:
        # The left half is exactly Sₙ₋₁
        # So we recursively find the k-th bit in Sₙ₋₁
        return findKthBit(n - 1, k)

    # Case 3: k is in the right half (reverse(invert(Sₙ₋₁)))
    # The right half is the mirror image of the inverted left half
    # Position k in Sₙ corresponds to position (mid*2 - k) in the right half
    # And since it's reversed, we need the bit from Sₙ₋₁ at that position, inverted
    mirrored_pos = mid * 2 - k

    # Get the bit from Sₙ₋₁ at the mirrored position
    bit_from_left = findKthBit(n - 1, mirrored_pos)

    # Invert the bit (0→1, 1→0)
    return '1' if bit_from_left == '0' else '0'
```

```javascript
// Time: O(n) | Space: O(n) for recursion stack
function findKthBit(n, k) {
  /**
   * Returns the k-th bit (1-indexed) in the n-th binary string.
   * Uses recursion to avoid building the entire string.
   */
  // Base case: S₁ = "0"
  if (n === 1) {
    return "0";
  }

  // Calculate the middle position (2ⁿ⁻¹)
  // Using bit shifting: 1 << (n-1) = 2ⁿ⁻¹
  const mid = 1 << (n - 1); // Equivalent to 2**(n-1)

  // Case 1: k is exactly at the middle
  if (k === mid) {
    // The middle character is always '1'
    return "1";
  }

  // Case 2: k is in the left half (Sₙ₋₁)
  if (k < mid) {
    // The left half is exactly Sₙ₋₁
    // So we recursively find the k-th bit in Sₙ₋₁
    return findKthBit(n - 1, k);
  }

  // Case 3: k is in the right half (reverse(invert(Sₙ₋₁)))
  // The right half is the mirror image of the inverted left half
  // Position k in Sₙ corresponds to position (mid*2 - k) in the right half
  // And since it's reversed, we need the bit from Sₙ₋₁ at that position, inverted
  const mirroredPos = mid * 2 - k;

  // Get the bit from Sₙ₋₁ at the mirrored position
  const bitFromLeft = findKthBit(n - 1, mirroredPos);

  // Invert the bit (0→1, 1→0)
  return bitFromLeft === "0" ? "1" : "0";
}
```

```java
// Time: O(n) | Space: O(n) for recursion stack
class Solution {
    public char findKthBit(int n, int k) {
        /**
         * Returns the k-th bit (1-indexed) in the n-th binary string.
         * Uses recursion to avoid building the entire string.
         */
        // Base case: S₁ = "0"
        if (n == 1) {
            return '0';
        }

        // Calculate the middle position (2ⁿ⁻¹)
        // Using bit shifting: 1 << (n-1) = 2ⁿ⁻¹
        int mid = 1 << (n - 1);  // Equivalent to Math.pow(2, n-1)

        // Case 1: k is exactly at the middle
        if (k == mid) {
            // The middle character is always '1'
            return '1';
        }

        // Case 2: k is in the left half (Sₙ₋₁)
        if (k < mid) {
            // The left half is exactly Sₙ₋₁
            // So we recursively find the k-th bit in Sₙ₋₁
            return findKthBit(n - 1, k);
        }

        // Case 3: k is in the right half (reverse(invert(Sₙ₋₁)))
        // The right half is the mirror image of the inverted left half
        // Position k in Sₙ corresponds to position (mid*2 - k) in the right half
        // And since it's reversed, we need the bit from Sₙ₋₁ at that position, inverted
        int mirroredPos = mid * 2 - k;

        // Get the bit from Sₙ₋₁ at the mirrored position
        char bitFromLeft = findKthBit(n - 1, mirroredPos);

        // Invert the bit (0→1, 1→0)
        return bitFromLeft == '0' ? '1' : '0';
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each recursive call reduces n by 1
- We make at most n recursive calls
- Each call does constant work (comparisons, arithmetic)

**Space Complexity: O(n)**

- The recursion stack can go n levels deep
- No additional data structures are used beyond the call stack

This is a massive improvement over the O(2ⁿ) brute force approach!

## Common Mistakes

1. **Off-by-one errors with k indexing:** The problem uses 1-indexed positions, but many programmers think in 0-indexed terms. Always check: when n=1, S₁ has only 1 character at position 1, which is "0".

2. **Incorrect middle calculation:** The middle is at position 2ⁿ⁻¹, not 2ⁿ/2 or (length+1)/2. Using bit shifting (`1 << (n-1)`) is efficient and avoids floating-point issues.

3. **Wrong mirrored position calculation:** When k > mid, the mirrored position in Sₙ₋₁ is `mid*2 - k`, not `length - k + 1`. This accounts for the fact that the right part is the reverse of invert(Sₙ₋₁).

4. **Forgetting to invert the bit in the right half:** In case 3, after finding the bit from Sₙ₋₁, you must invert it (0→1, 1→0) because the right half is invert(Sₙ₋₁).

## When You'll See This Pattern

This recursive divide-and-conquer pattern appears in problems where:

1. The data has a recursive structure
2. The size grows exponentially
3. You need to query specific positions without building the entire structure

Similar LeetCode problems:

1. **779. K-th Symbol in Grammar** - Almost identical pattern: binary tree construction where each row is derived from the previous.
2. **1545. Find Kth Bit in Nth Binary String** - This is the exact problem!
3. **119. Pascal's Triangle II** - While not identical, it uses similar recursive thinking to compute specific values without building the entire triangle.

## Key Takeaways

1. **Recognize recursive patterns:** When a problem defines something recursively and the size grows exponentially, look for a recursive solution that avoids building the entire structure.

2. **Divide and conquer:** Break the problem into smaller subproblems based on the recursive definition. Identify the base case and how to reduce the problem size at each step.

3. **Leverage mathematical properties:** Understanding that the middle is always at 2ⁿ⁻¹ and that the right half is the mirror image of the inverted left half is key to the efficient solution.

[Practice this problem on CodeJeet](/problem/find-kth-bit-in-nth-binary-string)
