---
title: "How to Solve Neighboring Bitwise XOR — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Neighboring Bitwise XOR. Medium difficulty, 79.8% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-07-05"
category: "dsa-patterns"
tags: ["neighboring-bitwise-xor", "array", "bit-manipulation", "medium"]
---

# How to Solve Neighboring Bitwise XOR

You're given a derived array where each element is the XOR of adjacent elements from an unknown binary array. Your task is to determine if such a binary array exists. The tricky part is that the array is circular—the last element XORs with the first. This constraint makes the problem interesting because you can't just solve it linearly; you need to ensure consistency around the circular boundary.

## Visual Walkthrough

Let's trace through a concrete example: `derived = [1, 1, 0]`

We need to find if there exists a binary array `original = [a, b, c]` where:

1. `derived[0] = a ⊕ b = 1`
2. `derived[1] = b ⊕ c = 1`
3. `derived[2] = c ⊕ a = 0`

Let's try to solve this systematically:

**Step 1: Choose a starting value**
Since we're dealing with binary values (0 or 1), let's test what happens if we assume `a = 0`:

- From equation 1: `0 ⊕ b = 1` → `b = 1` (since 0⊕1=1)
- From equation 2: `1 ⊕ c = 1` → `c = 0` (since 1⊕0=1)
- From equation 3: `0 ⊕ 0 = 0` → matches `derived[2] = 0` ✓

The equations are consistent! But wait—what if we had chosen `a = 1` instead?

**Step 2: Test the alternative**
Assume `a = 1`:

- `1 ⊕ b = 1` → `b = 0`
- `0 ⊕ c = 1` → `c = 1`
- `1 ⊕ 1 = 0` → matches `derived[2] = 0` ✓

Both starting values work! This suggests that if a solution exists for one starting value, it will also exist for the other. The key insight is that we only need to check one starting value and verify the circular consistency.

## Brute Force Approach

A naive approach would be to try all possible binary arrays of length `n`. Since each element can be 0 or 1, there are `2^n` possibilities. For each candidate `original` array, we would:

1. Compute the derived array from it
2. Compare with the given derived array
3. Return true if any match

This approach has exponential time complexity `O(n * 2^n)`, which is completely impractical for `n` up to `10^5` (typical constraints). Even for `n = 20`, we'd need to check over 1 million possibilities.

The brute force fails because it doesn't leverage the mathematical structure of the problem. XOR operations have special properties that allow us to solve this much more efficiently.

## Optimized Approach

The key insight comes from understanding XOR properties and the circular constraint:

1. **XOR is its own inverse**: `a ⊕ b = c` implies `b = a ⊕ c`
2. **The circular constraint creates a dependency chain**: Once we choose the first element of `original`, all other elements are determined by the derived array
3. **Consistency check**: The last computed element must satisfy the final XOR equation with the first element

Here's the step-by-step reasoning:

**Step 1: Choose a starting value**
Pick `original[0] = 0` (we could also choose 1—it doesn't matter which).

**Step 2: Reconstruct the array**
For `i` from `0` to `n-2`:

- We know `derived[i] = original[i] ⊕ original[i+1]`
- Therefore `original[i+1] = original[i] ⊕ derived[i]`

This lets us compute the entire array sequentially.

**Step 3: Verify circular consistency**
The final equation is: `derived[n-1] = original[n-1] ⊕ original[0]`
We check if our reconstructed array satisfies this. If it does, a valid original array exists.

**Why this works**: The XOR relationships form a linear system. Choosing the first value determines all others. The only question is whether the circular constraint holds with our choice.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def doesValidArrayExist(derived):
    """
    Determine if there exists a binary array 'original' such that:
    - For i = 0 to n-2: derived[i] = original[i] ⊕ original[i+1]
    - For i = n-1: derived[n-1] = original[n-1] ⊕ original[0]

    Approach: Choose original[0] = 0, reconstruct the array,
    then verify the circular constraint.
    """
    n = len(derived)

    # Start with original[0] = 0
    current = 0

    # Reconstruct the array from index 1 to n-1
    for i in range(n - 1):
        # original[i+1] = original[i] ⊕ derived[i]
        current = current ^ derived[i]

    # Verify the circular constraint:
    # derived[n-1] should equal original[n-1] ⊕ original[0]
    # original[0] was 0, so we need: derived[n-1] == current ⊕ 0
    return derived[n - 1] == (current ^ 0)

# Alternative implementation that's more explicit:
def doesValidArrayExistAlt(derived):
    n = len(derived)
    # Try both possibilities for original[0]
    for start in [0, 1]:
        original = [0] * n
        original[0] = start

        # Reconstruct the rest of the array
        for i in range(n - 1):
            original[i + 1] = original[i] ^ derived[i]

        # Check circular constraint
        if (original[n - 1] ^ original[0]) == derived[n - 1]:
            return True

    return False
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Determine if there exists a binary array 'original' such that:
 * - For i = 0 to n-2: derived[i] = original[i] ^ original[i+1]
 * - For i = n-1: derived[n-1] = original[n-1] ^ original[0]
 *
 * Approach: Choose original[0] = 0, reconstruct the array,
 * then verify the circular constraint.
 */
function doesValidArrayExist(derived) {
  const n = derived.length;

  // Start with original[0] = 0
  let current = 0;

  // Reconstruct the array from index 1 to n-1
  for (let i = 0; i < n - 1; i++) {
    // original[i+1] = original[i] ^ derived[i]
    current = current ^ derived[i];
  }

  // Verify the circular constraint:
  // derived[n-1] should equal original[n-1] ^ original[0]
  // original[0] was 0, so we need: derived[n-1] == current ^ 0
  return derived[n - 1] === (current ^ 0);
}

// Alternative implementation that's more explicit:
function doesValidArrayExistAlt(derived) {
  const n = derived.length;

  // Try both possibilities for original[0]
  for (const start of [0, 1]) {
    const original = new Array(n);
    original[0] = start;

    // Reconstruct the rest of the array
    for (let i = 0; i < n - 1; i++) {
      original[i + 1] = original[i] ^ derived[i];
    }

    // Check circular constraint
    if ((original[n - 1] ^ original[0]) === derived[n - 1]) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Determine if there exists a binary array 'original' such that:
     * - For i = 0 to n-2: derived[i] = original[i] ^ original[i+1]
     * - For i = n-1: derived[n-1] = original[n-1] ^ original[0]
     *
     * Approach: Choose original[0] = 0, reconstruct the array,
     * then verify the circular constraint.
     */
    public boolean doesValidArrayExist(int[] derived) {
        int n = derived.length;

        // Start with original[0] = 0
        int current = 0;

        // Reconstruct the array from index 1 to n-1
        for (int i = 0; i < n - 1; i++) {
            // original[i+1] = original[i] ^ derived[i]
            current = current ^ derived[i];
        }

        // Verify the circular constraint:
        // derived[n-1] should equal original[n-1] ^ original[0]
        // original[0] was 0, so we need: derived[n-1] == current ^ 0
        return derived[n - 1] == (current ^ 0);
    }

    // Alternative implementation that's more explicit:
    public boolean doesValidArrayExistAlt(int[] derived) {
        int n = derived.length;

        // Try both possibilities for original[0]
        for (int start = 0; start <= 1; start++) {
            int[] original = new int[n];
            original[0] = start;

            // Reconstruct the rest of the array
            for (int i = 0; i < n - 1; i++) {
                original[i + 1] = original[i] ^ derived[i];
            }

            // Check circular constraint
            if ((original[n - 1] ^ original[0]) == derived[n - 1]) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n)`

- We make a single pass through the array to reconstruct the original array
- Each iteration performs a constant-time XOR operation
- The circular constraint check is also constant time

**Space Complexity**: `O(1)` for the optimal solution

- We only store the current value being computed
- Even if we store the entire reconstructed array (alternative approach), we could optimize it to `O(1)` by only keeping track of the last value

## Common Mistakes

1. **Forgetting the circular constraint**: Candidates sometimes only check the linear relationships and forget that `derived[n-1] = original[n-1] ⊕ original[0]`. This is the most common mistake—always remember to verify the wrap-around condition.

2. **Incorrect XOR reconstruction**: The formula is `original[i+1] = original[i] ⊕ derived[i]`, not `original[i+1] = derived[i] ⊕ derived[i+1]`. Mixing up which values to XOR is easy when you're under pressure.

3. **Handling empty or single-element arrays**: For `n = 1`, the condition becomes `derived[0] = original[0] ⊕ original[0] = 0`. So the only valid derived array for length 1 is `[0]`. Always test edge cases!

4. **Overcomplicating with bit manipulation tricks**: Some candidates try to use fancy bit operations when simple sequential reconstruction works. Keep it simple—the straightforward approach is both correct and efficient.

## When You'll See This Pattern

This problem teaches **constraint propagation with XOR operations**, which appears in several contexts:

1. **Bitwise OR of Adjacent Elements (Easy)**: Similar structure but with OR instead of XOR. The reconstruction logic changes slightly, but the constraint propagation idea remains.

2. **Decode XORed Array (Easy)**: Given `encoded[i] = arr[i] ⊕ arr[i+1]` and the first element, reconstruct the array. This is essentially the non-circular version of our problem.

3. **Find Original Array From Doubled Array (Medium)**: While not using XOR, it shares the pattern of reconstructing an original array from transformed data with constraints.

The core pattern is: when you have a sequence of transformations where each output depends on adjacent inputs, you can often reconstruct the input by fixing one value and propagating constraints.

## Key Takeaways

1. **XOR constraints are deterministic**: Given `a ⊕ b = c` and knowing either `a` or `b`, you can uniquely determine the other. This allows sequential reconstruction of arrays.

2. **Circular constraints require verification**: When dealing with circular arrays, always check that the last computed relationship matches the given constraint. One starting value is enough to test—if it works for one, it works for both (or neither).

3. **Simple is often optimal**: Don't overthink bit manipulation problems. The straightforward approach of choosing a starting value and propagating constraints is usually both correct and efficient.

Related problems: [Bitwise OR of Adjacent Elements](/problem/bitwise-or-of-adjacent-elements)
