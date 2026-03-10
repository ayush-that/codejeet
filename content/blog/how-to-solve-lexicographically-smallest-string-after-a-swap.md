---
title: "How to Solve Lexicographically Smallest String After a Swap — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest String After a Swap. Easy difficulty, 54.5% acceptance rate. Topics: String, Greedy."
date: "2028-06-02"
category: "dsa-patterns"
tags: ["lexicographically-smallest-string-after-a-swap", "string", "greedy", "easy"]
---

# How to Solve Lexicographically Smallest String After a Swap

You’re given a string of digits and allowed exactly one swap between two adjacent digits that share the same parity (both odd or both even). Your goal is to produce the lexicographically smallest possible string after making at most one such swap. This problem is interesting because it combines parity constraints with greedy decision-making—you need to find the single swap that yields the biggest improvement, but only if the digits are compatible.

## Visual Walkthrough

Let’s walk through an example: `s = "4321"`.

We want the lexicographically smallest string, which means we want smaller digits earlier in the string. We can only swap adjacent digits if they have the same parity.

**Step 1 – Understand parity groups:**

- Even digits: 4, 2
- Odd digits: 3, 1

**Step 2 – Look for improvement opportunities:**
We scan from left to right, looking for the first position where swapping with the next digit would make the string smaller. Remember, we can only swap if digits have the same parity.

Positions:

1. Compare `s[0]=4` and `s[1]=3`: 4 is even, 3 is odd → different parity → cannot swap.
2. Compare `s[1]=3` and `s[2]=2`: 3 is odd, 2 is even → different parity → cannot swap.
3. Compare `s[2]=2` and `s[3]=1`: 2 is even, 1 is odd → different parity → cannot swap.

Wait—no adjacent pair has the same parity! That means we cannot perform any swap. The answer remains `"4321"`.

Let’s try another example: `s = "5634"`.

**Step 1 – Parity:**

- Even digits: 6, 4
- Odd digits: 5, 3

**Step 2 – Scan for swaps:**

1. `s[0]=5` and `s[1]=6`: 5 (odd) vs 6 (even) → different parity → no swap.
2. `s[1]=6` and `s[2]=3`: 6 (even) vs 3 (odd) → different parity → no swap.
3. `s[2]=3` and `s[3]=4`: 3 (odd) vs 4 (even) → different parity → no swap.

Again, no valid swap. Output: `"5634"`.

One more: `s = "2476"`.

**Step 1 – Parity:**
All digits are even (2,4,7,6? Wait—7 is odd! Let’s check: 2(even), 4(even), 7(odd), 6(even)).

**Step 2 – Scan:**

1. `s[0]=2` and `s[1]=4`: both even → can swap. Would swapping help? `"4276"` vs `"2476"`. `4` > `2` at position 0, so swapping makes it larger → not beneficial.
2. `s[1]=4` and `s[2]=7`: 4(even) vs 7(odd) → different parity → no swap.
3. `s[2]=7` and `s[3]=6`: 7(odd) vs 6(even) → different parity → no swap.

No beneficial swap found. Output: `"2476"`.

Final example: `s = "8352"`.

**Step 1 – Parity:**
8(even), 3(odd), 5(odd), 2(even).

**Step 2 – Scan:**

1. `s[0]=8` and `s[1]=3`: different parity → no swap.
2. `s[1]=3` and `s[2]=5`: both odd → can swap. Compare: swapping gives `"8532"` vs original `"8352"`. At index 1, `5` > `3` → swapping makes it larger → not beneficial.
3. `s[2]=5` and `s[3]=2`: different parity → no swap.

No beneficial swap → output `"8352"`.

Wait—we’re missing something! The goal is lexicographically smallest. What if we look for the _first_ position where a swap would _improve_ the string? Let’s try `s = "2581"`.

**Parity:** 2(even), 5(odd), 8(even), 1(odd).

**Scan:**

1. `s[0]=2` and `s[1]=5`: different parity → no swap.
2. `s[1]=5` and `s[2]=8`: different parity → no swap.
3. `s[2]=8` and `s[3]=1`: different parity → no swap.

No valid swap → output `"2581"`. But is that really the smallest? What if we could swap non-adjacent? Not allowed. So correct.

Actually, the key insight: we only need to find the _first_ position from the left where swapping with the next digit (if they have same parity) makes the string smaller. If we find it, we perform that single swap and return. If not, we return the original string.

Let’s test with a case where a swap helps: `s = "635"`.

**Parity:** 6(even), 3(odd), 5(odd).

**Scan:**

1. `s[0]=6` and `s[1]=3`: different parity → no swap.
2. `s[1]=3` and `s[2]=5`: both odd → can swap. Compare: `"653"` vs `"635"`. At index 1, `5` > `3` → swapping makes it larger → not beneficial.

No beneficial swap → output `"635"`. But wait, `"365"` is smaller! Can we get that? No, because 3 and 6 are not adjacent. So correct.

One where swap helps: `s = "527"`.

**Parity:** 5(odd), 2(even), 7(odd).

**Scan:**

1. `s[0]=5` and `s[1]=2`: different parity → no swap.
2. `s[1]=2` and `s[2]=7`: different parity → no swap.

No swap → `"527"`. But `"257"` is smaller—can’t get it because 5 and 2 aren’t same parity.

Now a working example: `s = "325"`.

**Parity:** 3(odd), 2(even), 5(odd).

**Scan:**

1. `s[0]=3` and `s[1]=2`: different parity → no swap.
2. `s[1]=2` and `s[2]=5`: different parity → no swap.

No swap → `"325"`. But `"235"` is smaller—can’t get it.

Let’s construct one that works: `s = "341"`.

**Parity:** 3(odd), 4(even), 1(odd).

**Scan:**

1. `s[0]=3` and `s[1]=4`: different parity → no swap.
2. `s[1]=4` and `s[2]=1`: different parity → no swap.

No swap.

Okay, let’s force a beneficial swap: `s = "43"`.

**Parity:** 4(even), 3(odd) → different parity → no swap.

`"52"`: 5(odd), 2(even) → no.

`"64"`: both even → can swap. `"46"` vs `"64"` → `"46"` is smaller! So we swap.

So algorithm: iterate through the string, for each index `i` from `0` to `n-2`, check if `s[i]` and `s[i+1]` have same parity AND `s[i] > s[i+1]`. If yes, swap them and return immediately (since we can only swap once, and the first such swap gives the biggest improvement). If no such pair found, return original string.

## Brute Force Approach

A brute force approach would be to generate all possible strings resulting from a single valid swap (adjacent & same parity), then compare them lexicographically to find the smallest. This involves:

1. Checking each adjacent pair for same parity.
2. Creating a new string by swapping them.
3. Keeping track of the minimum string found.

This is O(n²) if we compare strings directly, or O(n) if we compare character by character, but we’d still need to generate up to n-1 candidate strings. While this might be acceptable for small n, it’s inefficient because we can solve it with a single pass.

More importantly, the brute force misses the greedy insight: the _first_ beneficial swap from the left yields the optimal result. Without that, you’d unnecessarily check all swaps.

## Optimal Solution

The optimal solution uses a single pass through the string. We look for the first position where swapping adjacent same-parity digits would reduce the string lexicographically. Once found, we perform that swap and return. If no such position exists, we return the original string.

Why does this greedy approach work? Because we can only make one swap. To minimize the string lexicographically, we want to reduce the earliest possible digit. So scanning from left to right, the first time we find `s[i] > s[i+1]` with same parity, swapping them improves the string at the earliest position, which gives the globally smallest result.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the list conversion, or O(1) if we consider input immutable
def getSmallestString(s: str) -> str:
    # Convert string to list for easy swapping (strings are immutable in Python)
    s_list = list(s)
    n = len(s_list)

    # Iterate through the string from left to right
    for i in range(n - 1):
        # Check if current digit and next digit have the same parity
        # Two digits have same parity if both are even or both are odd
        # We can check by: (int(digit) % 2) == (int(next_digit) % 2)
        if (int(s_list[i]) % 2) == (int(s_list[i + 1]) % 2):
            # Check if swapping would make the string lexicographically smaller
            # That happens when the current digit is greater than the next digit
            if s_list[i] > s_list[i + 1]:
                # Perform the swap
                s_list[i], s_list[i + 1] = s_list[i + 1], s_list[i]
                # Return immediately since we can only swap once
                # and this is the first beneficial swap from the left
                return ''.join(s_list)

    # If no beneficial swap found, return original string
    return ''.join(s_list)
```

```javascript
// Time: O(n) | Space: O(n) for the array conversion
function getSmallestString(s) {
  // Convert string to array for swapping (strings are immutable in JavaScript)
  const arr = s.split("");
  const n = arr.length;

  // Iterate from left to right
  for (let i = 0; i < n - 1; i++) {
    // Check parity: both even or both odd
    const currentParity = parseInt(arr[i]) % 2;
    const nextParity = parseInt(arr[i + 1]) % 2;

    if (currentParity === nextParity) {
      // Check if swapping would improve lexicographic order
      if (arr[i] > arr[i + 1]) {
        // Perform the swap
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        // Return immediately after first beneficial swap
        return arr.join("");
      }
    }
  }

  // No beneficial swap found
  return arr.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the char array
class Solution {
    public String getSmallestString(String s) {
        // Convert to char array for swapping
        char[] arr = s.toCharArray();
        int n = arr.length;

        // Scan from left to right
        for (int i = 0; i < n - 1; i++) {
            // Check if digits have same parity
            int currentDigit = arr[i] - '0';
            int nextDigit = arr[i + 1] - '0';

            if ((currentDigit % 2) == (nextDigit % 2)) {
                // Check if swapping would make string smaller
                if (arr[i] > arr[i + 1]) {
                    // Perform the swap
                    char temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    // Return immediately after first beneficial swap
                    return new String(arr);
                }
            }
        }

        // No beneficial swap found
        return new String(arr);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the string. We make a single pass through the string, checking each adjacent pair once. In the worst case, we check all n-1 pairs without finding a swap, or we find one and return early. Either way, it’s linear.

**Space Complexity:** O(n) in all languages because we convert the immutable string to a mutable array (list in Python, array in JavaScript, char array in Java) to perform the swap. If the language allowed in-place string modification, it would be O(1), but strings are typically immutable. Some might argue it’s O(1) extra space since the input is already O(n) storage, but technically we create a new array of size n.

## Common Mistakes

1. **Swapping without checking parity first:** Candidates might find the first position where `s[i] > s[i+1]` and swap immediately, forgetting the parity constraint. Always check `(int(s[i]) % 2) == (int(s[i+1]) % 2)` before considering a swap.

2. **Not returning after the first swap:** The problem says “at most once,” so after we find the first beneficial swap, we should return immediately. Continuing to scan could lead to multiple swaps or incorrect results.

3. **Comparing digits as characters without converting to integers for parity check:** Digits are characters, so `'5' % 2` doesn’t work directly—you need to convert to integer first: `int('5') % 2`. In Java/JavaScript, use `digit - '0'` or `parseInt(digit)`.

4. **Off-by-one in loop bounds:** When checking `s[i]` and `s[i+1]`, the loop should go up to `n-2` (i.e., `i < n-1`). Going to `n-1` would cause an index error when accessing `s[i+1]`.

## When You’ll See This Pattern

This problem uses a **greedy scan with early termination** pattern. You scan from left to right, apply a local optimization (first beneficial swap), and stop. This pattern appears in:

1. **Remove Duplicate Letters (LeetCode 316)** – While more complex, it also involves scanning and making greedy choices to minimize lexicographic order.
2. **Smallest Subsequence of Distinct Characters (LeetCode 1081)** – Same as above.
3. **Best Time to Buy and Sell Stock (LeetCode 121)** – You scan once, keeping track of the minimum price seen so far, which is a similar single-pass greedy approach.

The core idea: when you’re allowed one modification to optimize ordering, often the optimal approach is to find the _first_ opportunity to improve things from the left.

## Key Takeaways

- **Greedy from left works for single-swap minimization:** When you can only make one swap to minimize lexicographic order, the optimal strategy is to find the first position from the left where swapping adjacent elements improves the order (subject to any constraints).
- **Always verify constraints before swapping:** In this case, parity is an extra filter. In other problems, it might be index bounds, value ranges, or other conditions.
- **Early termination is crucial:** Once you make the swap, return immediately. Don’t continue scanning—you’re only allowed one operation.

Related problems: [Lexicographically Smallest String After Applying Operations](/problem/lexicographically-smallest-string-after-applying-operations)
