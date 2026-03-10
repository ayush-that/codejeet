---
title: "How to Solve String Transformation — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode String Transformation. Hard difficulty, 26.7% acceptance rate. Topics: Math, String, Dynamic Programming, String Matching."
date: "2026-07-31"
category: "dsa-patterns"
tags: ["string-transformation", "math", "string", "dynamic-programming", "hard"]
---

# How to Solve String Transformation

You're given two strings `s` and `t` of equal length `n`. You can transform `s` by repeatedly removing a suffix of length `l` (where `0 < l < n`) and moving it to the front. The challenge is to determine if you can transform `s` into `t` using these operations. What makes this problem tricky is that the operations create a circular shift pattern, but not all circular shifts are possible—only those where the shift amount is less than `n`. This constraint creates a mathematical pattern that requires careful analysis.

## Visual Walkthrough

Let's trace through a concrete example: `s = "abcd"`, `t = "cdab"`.

**Operation 1:** Remove suffix of length 2 ("cd") from "abcd", append to front → "cdab"
We've already transformed `s` to `t` in one operation!

Now let's try a more complex example: `s = "abcde"`, `t = "cdeab"`

**Operation 1:** Remove suffix of length 3 ("cde") from "abcde", append to front → "cdeab"
Again, we reach `t` in one operation.

The pattern emerges: each operation takes a suffix and moves it to the front. This is equivalent to rotating the string to the right by `l` positions. For example, rotating "abcd" right by 2 positions gives "cdab", which matches our first example.

But here's the catch: we can only rotate by amounts between 1 and `n-1`. We cannot rotate by 0 (no operation) or by `n` (which would give us back the original string). This means that if `s` and `t` are identical, we cannot transform `s` to `t` because we must perform at least one operation.

Let's test a case where transformation should fail: `s = "ab"`, `t = "ab"`

- We can only rotate by 1 (since `n=2`, `n-1=1`)
- Rotating "ab" right by 1 gives "ba"
- We cannot get back to "ab" without another operation
- But after the first operation, we have "ba", and rotating "ba" right by 1 gives "ab"
- Wait, that suggests we CAN transform "ab" to "ab" in 2 operations!

This reveals the real insight: we're not limited to one operation. We can perform multiple operations. The question becomes: can we reach `t` through any sequence of these suffix-to-front moves?

## Brute Force Approach

A naive approach would be to simulate all possible sequences of operations using BFS/DFS. At each step, we have `n-1` possible moves (choosing suffix length from 1 to `n-1`). After `k` operations, we'd have `(n-1)^k` possible strings to explore.

The brute force algorithm would:

1. Start with `s` in a queue
2. For each string in the queue, generate all `n-1` possible next strings
3. Check if any equals `t`
4. Continue until we find `t` or exhaust all possibilities

The problem? This grows exponentially! For `n=1000`, even exploring depth 2 gives ~1 million possibilities. The constraints (not specified but typical for such problems) would make this infeasible.

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
# Time: O((n-1)^k) where k is operations needed - exponential!
# Space: O((n-1)^k) for storing all generated strings

from collections import deque

def canTransformBruteForce(s: str, t: str) -> bool:
    if s == t:
        # Special case: identical strings need careful handling
        # We'll come back to this
        return False  # Temporary assumption

    n = len(s)
    visited = set()
    queue = deque([s])

    while queue:
        current = queue.popleft()

        # Try all possible suffix lengths
        for l in range(1, n):
            # Remove suffix of length l and move to front
            new_str = current[-l:] + current[:-l]

            if new_str == t:
                return True

            if new_str not in visited:
                visited.add(new_str)
                queue.append(new_str)

    return False
```

```javascript
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O((n-1)^k) where k is operations needed - exponential!
// Space: O((n-1)^k) for storing all generated strings

function canTransformBruteForce(s, t) {
  if (s === t) {
    // Special case: identical strings need careful handling
    return false; // Temporary assumption
  }

  const n = s.length;
  const visited = new Set();
  const queue = [s];

  while (queue.length > 0) {
    const current = queue.shift();

    // Try all possible suffix lengths
    for (let l = 1; l < n; l++) {
      // Remove suffix of length l and move to front
      const newStr = current.slice(-l) + current.slice(0, -l);

      if (newStr === t) {
        return true;
      }

      if (!visited.has(newStr)) {
        visited.add(newStr);
        queue.push(newStr);
      }
    }
  }

  return false;
}
```

```java
// BRUTE FORCE - TOO SLOW FOR LARGE INPUTS
// Time: O((n-1)^k) where k is operations needed - exponential!
// Space: O((n-1)^k) for storing all generated strings

import java.util.*;

public class Solution {
    public boolean canTransformBruteForce(String s, String t) {
        if (s.equals(t)) {
            // Special case: identical strings need careful handling
            return false; // Temporary assumption
        }

        int n = s.length();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.offer(s);

        while (!queue.isEmpty()) {
            String current = queue.poll();

            // Try all possible suffix lengths
            for (int l = 1; l < n; l++) {
                // Remove suffix of length l and move to front
                String newStr = current.substring(n - l) +
                               current.substring(0, n - l);

                if (newStr.equals(t)) {
                    return true;
                }

                if (!visited.contains(newStr)) {
                    visited.add(newStr);
                    queue.offer(newStr);
                }
            }
        }

        return false;
    }
}
```

</div>

## Optimized Approach

The key insight comes from recognizing that each operation is a right rotation by some amount `l`. After `k` operations with rotation amounts `l₁, l₂, ..., lₖ`, the total rotation is `(l₁ + l₂ + ... + lₖ) mod n`.

However, there's a crucial constraint: each `lᵢ` must satisfy `0 < lᵢ < n`. We cannot rotate by 0 or by `n`.

Let `total_rotation = (l₁ + l₂ + ... + lₖ) mod n`. Then `s` rotated right by `total_rotation` should equal `t`.

But wait—if we can achieve any rotation amount, then the answer would simply be "is `t` a rotation of `s`?" That's too simple, and it's wrong because we have constraints on individual rotation amounts.

Let's think about what rotation amounts we can achieve. Consider:

- Single operation: can rotate by any amount from 1 to n-1
- Two operations: can rotate by (l₁ + l₂) mod n where 1 ≤ l₁, l₂ ≤ n-1

The critical observation: **We can achieve any rotation amount except 0, provided n > 1.**

Why? Let's prove it:

1. If we want rotation amount r (where 1 ≤ r ≤ n-1), we can achieve it with one operation: choose l = r
2. If we want rotation amount 0, we need (l₁ + l₂ + ... + lₖ) mod n = 0
3. But each lᵢ is between 1 and n-1, so their sum is at least k
4. We can achieve 0 mod n if the sum is a multiple of n
5. For example, with n=3: l₁=1, l₂=2 gives sum=3 which is 0 mod 3
6. So we CAN achieve rotation amount 0 with multiple operations!

This means:

- If s == t (rotation amount 0), we need to check if we can achieve rotation amount 0
- If s ≠ t, we need to check if t is a rotation of s (any rotation amount)

But there's another twist: what if n=1? Then we cannot perform any operation (since 0 < l < n has no solution). So if n=1, s can only transform to t if s == t.

Also, what if n=2? Let's check:

- Possible l values: only l=1
- Single operation: rotate by 1
- Two operations: rotate by (1+1) mod 2 = 0
- So we can achieve both rotation amounts 0 and 1!

This leads to our final conditions:

1. If n=1: return s == t
2. If s == t: return true if we can achieve rotation amount 0 (which requires n>1 and some sequence of operations)
3. If s ≠ t: return true if t is a rotation of s

But how do we check if we can achieve rotation amount 0 when s == t? We need to determine if there exists a sequence of operations (each rotating by 1 to n-1) whose total rotation is a multiple of n.

Mathematically, we're asking: can we find integers l₁, l₂, ..., lₖ (each between 1 and n-1) such that (l₁ + l₂ + ... + lₖ) mod n = 0?

This is equivalent to asking: can we form a multiple of n using numbers from 1 to n-1?

The answer is YES if n > 1, because:

- If n is even: we can use n/2 + n/2 = n (if n/2 is integer, i.e., n is even)
- If n is odd: we can use 1 + (n-1) = n
- Actually, for any n > 1: we can use 1 + 1 + ... + 1 (n times) = n

So when s == t and n > 1, we CAN achieve rotation amount 0!

But wait—there's a subtlety. What if all characters in s are the same? Like s = "aaa", t = "aaa"? Then any rotation gives the same string, so we can definitely transform s to t.

Actually, the character composition matters! If all characters are the same, then s is already equal to all its rotations. So the transformation is always possible if s == t.

But what if s has distinct characters? Then different rotations produce different strings. We need to be careful.

Let's think about this systematically. When s == t:

- If all characters are the same: always possible
- If not all characters are the same: we need to check if we can achieve rotation amount 0 without ever hitting s along the way (except at the end)

Actually, the problem statement doesn't forbid intermediate strings from being equal to s. It only asks if we can reach t. So if s == t, we need to determine if there's a sequence of operations that starts at s, goes through some other strings, and returns to s.

This is getting complex. Let me reconsider...

Actually, I've overcomplicated it. The key realization is: **If n > 1 and s is not composed of identical characters, then we can always transform s to any of its rotations, including itself (with enough operations).**

Why? Because the set of reachable strings from s is exactly all rotations of s. And we can reach any rotation, including the original s (rotation by 0), by an appropriate sequence of operations.

Proof sketch: The operations form a group on the set of rotations of s. Since we can rotate by any amount 1..n-1, and gcd(1,2,...,n-1) = 1 for n>1, we can generate all rotations.

Thus, the final algorithm is surprisingly simple:

1. If n = 1: return s == t
2. If all characters of s are the same: return s == t (actually, return true if t has the same repeated character)
3. Otherwise: check if t is a rotation of s

## Optimal Solution

Now let's implement the optimal solution based on our reasoning:

<div class="code-group">

```python
# OPTIMAL SOLUTION
# Time: O(n) - we need to check all characters and potentially check rotations
# Space: O(n) - for the concatenated string in rotation check

def canTransform(s: str, t: str) -> bool:
    n = len(s)

    # Case 1: Strings must be of equal length
    if n != len(t):
        return False

    # Case 2: If length is 1, only possible if strings are identical
    # (no operations allowed since 0 < l < n has no solution for n=1)
    if n == 1:
        return s == t

    # Case 3: Check if all characters in s are the same
    all_same = all(c == s[0] for c in s)

    if all_same:
        # If s has all same characters, t must also have all same characters
        # and that character must match s[0]
        return all(c == s[0] for c in t)

    # Case 4: General case - check if t is a rotation of s
    # Concatenate s with itself and check if t appears as substring
    # This handles all rotation amounts including 0
    return len(s) == len(t) and t in (s + s)
```

```javascript
// OPTIMAL SOLUTION
// Time: O(n) - we need to check all characters and potentially check rotations
// Space: O(n) - for the concatenated string in rotation check

function canTransform(s, t) {
  const n = s.length;

  // Case 1: Strings must be of equal length
  if (n !== t.length) {
    return false;
  }

  // Case 2: If length is 1, only possible if strings are identical
  // (no operations allowed since 0 < l < n has no solution for n=1)
  if (n === 1) {
    return s === t;
  }

  // Case 3: Check if all characters in s are the same
  const allSame = s.split("").every((c) => c === s[0]);

  if (allSame) {
    // If s has all same characters, t must also have all same characters
    // and that character must match s[0]
    return t.split("").every((c) => c === s[0]);
  }

  // Case 4: General case - check if t is a rotation of s
  // Concatenate s with itself and check if t appears as substring
  // This handles all rotation amounts including 0
  return s.length === t.length && (s + s).includes(t);
}
```

```java
// OPTIMAL SOLUTION
// Time: O(n) - we need to check all characters and potentially check rotations
// Space: O(n) - for the concatenated string in rotation check

public class Solution {
    public boolean canTransform(String s, String t) {
        int n = s.length();

        // Case 1: Strings must be of equal length
        if (n != t.length()) {
            return false;
        }

        // Case 2: If length is 1, only possible if strings are identical
        // (no operations allowed since 0 < l < n has no solution for n=1)
        if (n == 1) {
            return s.equals(t);
        }

        // Case 3: Check if all characters in s are the same
        boolean allSame = true;
        for (int i = 1; i < n; i++) {
            if (s.charAt(i) != s.charAt(0)) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            // If s has all same characters, t must also have all same characters
            // and that character must match s.charAt(0)
            for (int i = 0; i < n; i++) {
                if (t.charAt(i) != s.charAt(0)) {
                    return false;
                }
            }
            return true;
        }

        // Case 4: General case - check if t is a rotation of s
        // Concatenate s with itself and check if t appears as substring
        // This handles all rotation amounts including 0
        String doubled = s + s;
        return doubled.contains(t);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Checking if all characters are the same: O(n)
- Checking if t is a rotation of s by using `t in (s + s)`: O(n) with efficient string search algorithms (like KMP, though most language implementations use optimized algorithms)
- All other operations are O(1) or O(n)

**Space Complexity: O(n)**

- We create `s + s` which requires O(2n) = O(n) space
- The all-same check can be done in O(1) extra space by iterating through the strings
- In practice, some language optimizations might use less space for substring search

## Common Mistakes

1. **Assuming identical strings are always transformable**: When `s == t`, beginners often return `true` immediately. But for `n=1`, no operations are possible, so `s` cannot transform to anything else (including itself via operations). For `n>1`, it's transformable, but this requires careful reasoning.

2. **Overlooking the all-same characters edge case**: If all characters in `s` are identical (e.g., "aaaa"), then ALL rotations produce the same string. The condition `t in (s + s)` would always return true for any `t` of the right length with the right character, but we need to verify `t` actually contains only that character.

3. **Incorrect rotation check**: Some candidates try to check rotations by actually rotating and comparing, which is O(n²) if done naively. The efficient way is to check if `t` is a substring of `s + s`.

4. **Missing the n=1 special case**: The operation requires `0 < l < n`. For `n=1`, there are NO valid `l` values, so no operations can be performed. This means `s` can only equal `t`, not transform to it through operations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **String Rotation Problems**: Similar to LeetCode 796 "Rotate String", which asks if one string is a rotation of another. The optimal solution there is also checking if `t` is a substring of `s + s`.

2. **Modular Arithmetic in Operations**: Problems where operations have a modulo effect appear frequently, like LeetCode 396 "Rotate Function" or problems about circular buffers.

3. **Group Theory Applications**: The operations form a mathematical group. Problems about reachable states through repeated operations often have group-theoretic solutions, like LeetCode 365 "Water and Jug Problem".

The key insight is recognizing that repeated applications of an operation often lead to a cyclic pattern or group structure that can be analyzed mathematically rather than through simulation.

## Key Takeaways

1. **Look for mathematical structure**: When operations can be applied repeatedly, they often form a group or have modular arithmetic properties. Instead of simulating, look for invariants and reachability conditions.

2. **Handle edge cases systematically**: Special cases like `n=1` or identical characters need careful handling. Always test with smallest possible inputs and uniform data.

3. **String rotation ≡ substring check**: Checking if one string is a rotation of another is efficiently done by checking if it's a substring of the doubled string. This O(n) approach beats O(n²) rotation simulation.

[Practice this problem on CodeJeet](/problem/string-transformation)
