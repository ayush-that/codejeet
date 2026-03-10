---
title: "How to Solve Bulls and Cows — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Bulls and Cows. Medium difficulty, 52.2% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-06-16"
category: "dsa-patterns"
tags: ["bulls-and-cows", "hash-table", "string", "counting", "medium"]
---

# How to Solve Bulls and Cows

Bulls and Cows is a classic guessing game where you need to compare a secret number with a guess, counting exact matches (bulls) and correct digits in wrong positions (cows). The challenge lies in accurately counting cows without double-counting digits that are already bulls. This problem tests your ability to handle frequency counting and careful matching logic.

## Visual Walkthrough

Let's trace through an example step by step:

**Secret:** "1123"  
**Guess:** "0111"

**Step 1: Count bulls (exact matches)**

- Compare position 0: '1' vs '0' → no match
- Compare position 1: '1' vs '1' → BULL! (bulls = 1)
- Compare position 2: '2' vs '1' → no match
- Compare position 3: '3' vs '1' → no match

We have 1 bull. Now we need to count cows.

**Step 2: Prepare to count cows**
We need to count digits that exist in both strings but aren't in the right positions. However, we must be careful: a digit in the secret can only match with one digit in the guess, and vice versa.

Let's count frequencies of digits that aren't bulls:

Secret (excluding bulls): '1', '2', '3' (we skip the '1' at position 1 since it's a bull)  
Guess (excluding bulls): '0', '1', '1' (we skip the '1' at position 1 since it's a bull)

**Step 3: Count cows**
For each digit 0-9:

- Digit '0': secret has 0, guess has 1 → min(0, 1) = 0 cows
- Digit '1': secret has 2 total, but 1 was a bull, so 1 remaining. Guess has 3 total, but 1 was a bull, so 2 remaining → min(1, 2) = 1 cow
- Digit '2': secret has 1, guess has 0 → min(1, 0) = 0 cows
- Digit '3': secret has 1, guess has 0 → min(1, 0) = 0 cows

Total cows = 1

**Result:** "1A1B" (1 bull, 1 cow)

## Brute Force Approach

A naive approach might try to compare each digit in the guess with each digit in the secret, but this leads to double-counting issues. For example:

```python
# Problematic brute force approach
def getHint(secret, guess):
    bulls = 0
    cows = 0

    for i in range(len(secret)):
        if secret[i] == guess[i]:
            bulls += 1

    # This is wrong - it double counts!
    for i in range(len(secret)):
        for j in range(len(guess)):
            if i != j and secret[i] == guess[j]:
                cows += 1

    return f"{bulls}A{cows}B"
```

This approach fails because:

1. It counts the same digit multiple times (if secret has "11" and guess has "12", it would count 2 cows instead of 1)
2. It doesn't exclude digits that were already counted as bulls
3. It has O(n²) time complexity, which is inefficient

The key insight is that we need to track frequencies of digits and ensure we don't double-count.

## Optimized Approach

The optimal solution uses two passes and frequency counting:

**First pass:** Count bulls by comparing digits at the same positions. When we find a bull, we need to remember that this digit is "used up" and shouldn't be counted as a cow later.

**Second pass:** Count cows by comparing frequencies. For each digit 0-9:

1. Count how many times it appears in the secret (excluding bulls)
2. Count how many times it appears in the guess (excluding bulls)
3. The cows for that digit = min(secret_count, guess_count)

Why min()? Because if secret has two '1's and guess has three '1's, only two can match (one might already be a bull, and we can't match more than exist).

**Key insight:** We can count bulls and build frequency arrays in a single pass, then compute cows in a second pass over the digits 0-9 (which is constant time since there are only 10 digits).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the strings
# Space: O(1) since we use fixed-size arrays of length 10
def getHint(secret, guess):
    # Initialize arrays to count frequencies of digits 0-9
    # We'll use these to count digits that aren't bulls
    secret_count = [0] * 10
    guess_count = [0] * 10

    bulls = 0

    # First pass: count bulls and build frequency arrays
    for i in range(len(secret)):
        s_digit = ord(secret[i]) - ord('0')  # Convert char to int
        g_digit = ord(guess[i]) - ord('0')   # Convert char to int

        if s_digit == g_digit:
            # Exact match at same position - this is a bull
            bulls += 1
        else:
            # Not a bull, so count these digits for potential cows
            secret_count[s_digit] += 1
            guess_count[g_digit] += 1

    # Second pass: count cows by comparing frequencies
    cows = 0
    for i in range(10):
        # For each digit, cows = min(count in secret, count in guess)
        # This works because a digit can only match as many times as it appears
        cows += min(secret_count[i], guess_count[i])

    return f"{bulls}A{cows}B"
```

```javascript
// Time: O(n) where n is the length of the strings
// Space: O(1) since we use fixed-size arrays of length 10
function getHint(secret, guess) {
  // Initialize arrays to count frequencies of digits 0-9
  // We'll use these to count digits that aren't bulls
  const secretCount = new Array(10).fill(0);
  const guessCount = new Array(10).fill(0);

  let bulls = 0;

  // First pass: count bulls and build frequency arrays
  for (let i = 0; i < secret.length; i++) {
    const sDigit = secret.charCodeAt(i) - "0".charCodeAt(0);
    const gDigit = guess.charCodeAt(i) - "0".charCodeAt(0);

    if (sDigit === gDigit) {
      // Exact match at same position - this is a bull
      bulls++;
    } else {
      // Not a bull, so count these digits for potential cows
      secretCount[sDigit]++;
      guessCount[gDigit]++;
    }
  }

  // Second pass: count cows by comparing frequencies
  let cows = 0;
  for (let i = 0; i < 10; i++) {
    // For each digit, cows = min(count in secret, count in guess)
    // This works because a digit can only match as many times as it appears
    cows += Math.min(secretCount[i], guessCount[i]);
  }

  return `${bulls}A${cows}B`;
}
```

```java
// Time: O(n) where n is the length of the strings
// Space: O(1) since we use fixed-size arrays of length 10
public String getHint(String secret, String guess) {
    // Initialize arrays to count frequencies of digits 0-9
    // We'll use these to count digits that aren't bulls
    int[] secretCount = new int[10];
    int[] guessCount = new int[10];

    int bulls = 0;

    // First pass: count bulls and build frequency arrays
    for (int i = 0; i < secret.length(); i++) {
        char sChar = secret.charAt(i);
        char gChar = guess.charAt(i);

        if (sChar == gChar) {
            // Exact match at same position - this is a bull
            bulls++;
        } else {
            // Not a bull, so count these digits for potential cows
            // Convert char to int by subtracting '0'
            secretCount[sChar - '0']++;
            guessCount[gChar - '0']++;
        }
    }

    // Second pass: count cows by comparing frequencies
    int cows = 0;
    for (int i = 0; i < 10; i++) {
        // For each digit, cows = min(count in secret, count in guess)
        // This works because a digit can only match as many times as it appears
        cows += Math.min(secretCount[i], guessCount[i]);
    }

    return bulls + "A" + cows + "B";
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the strings. We make two passes: one through the strings (O(n)) and one through the 10 digits (O(10) = O(1)). The dominant term is O(n).

**Space Complexity:** O(1) because we use fixed-size arrays of length 10 to count digit frequencies. This doesn't grow with input size. Even if we consider the output string, it's O(1) since it has fixed format (e.g., "1A1B").

## Common Mistakes

1. **Double-counting cows:** The most common mistake is counting the same digit multiple times. For example, with secret="11" and guess="12", some solutions might count 2 cows instead of 1. The fix is to use frequency counting with `min(secret_count, guess_count)`.

2. **Counting bulls as cows:** Forgetting to exclude bulls when counting cows. If a digit is already a bull, it shouldn't be available for cow matching. Our solution handles this by only adding non-bull digits to the frequency arrays.

3. **Assuming single-digit numbers:** The problem allows multi-digit numbers, so your solution must handle strings of any length (up to the constraints). Don't convert to integers - work with strings directly.

4. **Incorrect digit conversion:** When converting char digits to integers, use `ord(char) - ord('0')` in Python or `char - '0'` in Java/JavaScript. Don't use `int(char)` without handling the character aspect properly.

## When You'll See This Pattern

The frequency counting pattern with `min(count1, count2)` appears in many string and counting problems:

1. **Find Common Characters (LeetCode 1002):** Find characters common to all strings in an array. Solution uses frequency counting and takes the minimum count across all strings for each character.

2. **Ransom Note (LeetCode 383):** Determine if a ransom note can be constructed from a magazine. Count character frequencies in both and ensure magazine has at least as many of each character as the note.

3. **Valid Anagram (LeetCode 242):** Check if two strings are anagrams. Count character frequencies and compare if they're equal.

The core pattern is: when you need to match elements between two collections with possible duplicates, count frequencies and use `min(freq1, freq2)` to find the maximum possible matches without double-counting.

## Key Takeaways

1. **Frequency counting solves duplicate matching problems:** When you need to match elements between collections with duplicates, count frequencies and use `min()` to find how many can match without double-counting.

2. **Two-pass approach separates concerns:** First pass identifies exact matches (bulls), second pass handles partial matches (cows). This keeps the logic clean and avoids complex conditional checks.

3. **Fixed character sets mean O(1) space:** When working with a limited set of possible characters (like digits 0-9), you can use fixed-size arrays instead of hash maps, which is more efficient and demonstrates awareness of constraints.

Related problems: [Make Number of Distinct Characters Equal](/problem/make-number-of-distinct-characters-equal)
