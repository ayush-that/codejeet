---
title: "How to Solve Apply Bitwise Operations to Make Strings Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Apply Bitwise Operations to Make Strings Equal. Medium difficulty, 42.6% acceptance rate. Topics: String, Bit Manipulation."
date: "2029-09-28"
category: "dsa-patterns"
tags: ["apply-bitwise-operations-to-make-strings-equal", "string", "bit-manipulation", "medium"]
---

# How to Solve "Apply Bitwise Operations to Make Strings Equal"

This problem asks whether we can transform a binary string `s` into another binary string `target` using a specific bitwise operation. The operation lets us pick two different indices `i` and `j`, then simultaneously set `s[i] = s[i] OR s[j]` and `s[j] = s[i] OR s[j]`. The key insight is that this operation effectively spreads `'1'` bits but never creates new ones from scratch. This makes the problem a clever test of understanding how information flows through bitwise operations.

## Visual Walkthrough

Let's trace through an example: `s = "0010"`, `target = "0111"`.

**Step 1: Understanding the operation**
When we pick indices `i` and `j`, both positions become the OR of their original values. Since we're dealing with binary digits:

- `0 OR 0 = 0`
- `0 OR 1 = 1`
- `1 OR 0 = 1`
- `1 OR 1 = 1`

The operation makes both positions equal to the maximum of the two original values. If either position has a `'1'`, both become `'1'` after the operation.

**Step 2: Initial state**
`s = "0 0 1 0"` (positions 0,1,2,3)
`target = "0 1 1 1"`

**Step 3: Can we transform?**
Notice that `s` has only one `'1'` at position 2, while `target` has three `'1'`s. The operation can spread `'1'`s from existing ones to other positions, but it cannot create a `'1'` from two `'0'`s. Therefore, if `s` has no `'1'`s at all, we can only reach `target` if `target` also has no `'1'`s.

**Step 4: Applying operations**

1. Use the `'1'` at position 2 to spread to position 1: Operate on (2,1)
   - Before: s[2]='1', s[1]='0'
   - After: s[2]='1', s[1]='1' → `s = "0 1 1 0"`
2. Use the `'1'` at position 2 to spread to position 3: Operate on (2,3)
   - Before: s[2]='1', s[3]='0'
   - After: s[2]='1', s[3]='1' → `s = "0 1 1 1"`

We've matched the target! The transformation was possible because `s` had at least one `'1'` to spread around.

**Counterexample**: `s = "0000"`, `target = "0101"`
Here `s` has no `'1'`s, so we can never create any `'1'`s. The target has `'1'`s, so transformation is impossible.

## Brute Force Approach

A naive approach would try to simulate all possible sequences of operations. For a string of length `n`, there are `C(n, 2)` possible index pairs to choose from for each operation. Since we can do any number of operations, the search space is infinite! Even if we limit the number of operations, the state space grows exponentially.

We could try BFS over all possible string states, but with `2^n` possible binary strings and many possible transitions between them, this becomes infeasible for even moderate `n`.

The brute force fails because it doesn't recognize the fundamental property: **the operation preserves the presence of at least one '1' in the string**. Once we understand this, we realize the problem reduces to checking a simple condition rather than searching through operation sequences.

## Optimized Approach

The key insight comes from analyzing what the operation actually does:

1. **Operation analysis**: When we apply the operation to indices `i` and `j`:
   - If either `s[i]` or `s[j]` is `'1'`, both become `'1'`
   - If both are `'0'`, both remain `'0'`

2. **Critical observation**: The operation cannot create a `'1'` from two `'0'`s. A `'1'` can only come from an existing `'1'`.

3. **Implication**: If `s` contains at least one `'1'`, we can spread it to any position that needs to be `'1'` in the target. We simply pair a position with a `'1'` with any position that needs to become `'1'`.

4. **Special case**: If `s` has no `'1'`s, then every position must remain `'0'`. Therefore, we can only reach `target` if `target` also has no `'1'`s.

5. **Edge case**: What if `s` has a `'1'` but `target` has no `'1'`s? Can we remove all `'1'`s? No! Once a position becomes `'1'`, it can never become `'0'` again because `1 OR anything = 1`. So if `s` has any `'1'` and `target` has no `'1'`s, transformation is impossible.

Thus, the solution reduces to checking these two conditions:

- If `s` contains a `'1'`, then `target` must also contain at least one `'1'`
- If `s` contains no `'1'`s, then `target` must also contain no `'1'`s

Wait, that's actually the same condition! Both cases require that `s` and `target` have the same "has at least one '1'" status.

## Optimal Solution

The solution is surprisingly simple: check if both strings have at least one `'1'` or both have no `'1'`s. We can do this by checking if `'1' in s` equals `'1' in target`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def makeStringsEqual(s: str, target: str) -> bool:
    """
    Check if we can transform s into target using the given operation.

    The operation makes both chosen positions equal to the OR of their values.
    Key insight: We can spread '1's from existing ones, but cannot create
    a '1' from two '0's. Also, once a position becomes '1', it stays '1'.

    Therefore, transformation is possible iff:
    (s contains at least one '1') == (target contains at least one '1')
    """
    # Check if '1' exists in s
    has_one_in_s = '1' in s
    # Check if '1' exists in target
    has_one_in_target = '1' in target

    # Transformation is possible only when both strings have the same
    # "contains at least one '1'" status
    return has_one_in_s == has_one_in_target
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if we can transform s into target using the given operation.
 *
 * The operation makes both chosen positions equal to the OR of their values.
 * Key insight: We can spread '1's from existing ones, but cannot create
 * a '1' from two '0's. Also, once a position becomes '1', it stays '1'.
 *
 * Therefore, transformation is possible iff:
 * (s contains at least one '1') == (target contains at least one '1')
 */
function makeStringsEqual(s, target) {
  // Check if '1' exists in s
  const hasOneInS = s.includes("1");
  // Check if '1' exists in target
  const hasOneInTarget = target.includes("1");

  // Transformation is possible only when both strings have the same
  // "contains at least one '1'" status
  return hasOneInS === hasOneInTarget;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if we can transform s into target using the given operation.
     *
     * The operation makes both chosen positions equal to the OR of their values.
     * Key insight: We can spread '1's from existing ones, but cannot create
     * a '1' from two '0's. Also, once a position becomes '1', it stays '1'.
     *
     * Therefore, transformation is possible iff:
     * (s contains at least one '1') == (target contains at least one '1')
     */
    public boolean makeStringsEqual(String s, String target) {
        // Check if '1' exists in s
        boolean hasOneInS = s.contains("1");
        // Check if '1' exists in target
        boolean hasOneInTarget = target.contains("1");

        // Transformation is possible only when both strings have the same
        // "contains at least one '1'" status
        return hasOneInS == hasOneInTarget;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n), where n is the length of the strings. We need to scan each string once to check for the presence of `'1'`. In practice, most language's `contains` or `includes` methods will short-circuit when they find the first `'1'`, so the actual time might be less than O(n) in many cases.

**Space Complexity**: O(1). We only use a constant amount of extra space to store the boolean flags.

## Common Mistakes

1. **Overcomplicating with simulation**: Many candidates try to actually simulate the transformation process, which leads to complex, inefficient code. Remember that interview problems often have simple solutions once you find the right insight.

2. **Missing the "no '1's in either" case**: Some candidates correctly handle the case where both strings have `'1'`s but forget that `"0000"` can transform to `"0000"`. The condition is symmetric: transformation works when both have the same "has at least one '1'" status.

3. **Incorrectly thinking we can remove '1's**: The operation always produces `1` if either input is `1`, so once a position becomes `'1'`, it can never become `'0'` again. This means if `s` has any `'1'` and `target` has no `'1'`s, transformation is impossible.

4. **Not considering the operation's symmetry**: The operation affects both indices simultaneously and symmetrically. Some candidates mistakenly think they can apply different operations to the two indices, which is not allowed.

## When You'll See This Pattern

This problem teaches **invariant analysis**—looking for properties that remain unchanged throughout all operations. Similar patterns appear in:

1. **Minimum One Bit Operations to Make Integers Zero (LeetCode 1611)**: Also involves bit manipulation with specific allowed operations, requiring you to find invariants or patterns in the transformation.

2. **Bulb Switcher (LeetCode 319)**: While not exactly the same, it involves understanding how operations affect binary states and finding patterns rather than simulating.

3. **Minimum Operations to Make the Array Increasing (LeetCode 1827)**: Requires understanding what transformations are possible given constraints on operations.

The core technique is to step back from simulating operations and instead ask: "What properties must be true for a transformation to be possible? What can never change no matter what operations I perform?"

## Key Takeaways

1. **Look for invariants**: When a problem allows repeated operations, ask what properties remain unchanged. These invariants often provide the key to a simple solution.

2. **Analyze operations carefully**: Break down what each operation actually does in terms of information flow. Can it create something from nothing? Can it destroy something? Understanding these limits is crucial.

3. **Bitwise operations often have simple global properties**: Problems involving OR, AND, XOR operations on binary strings often reduce to checking simple conditions about the presence or count of 1s, rather than requiring complex simulations.

Related problems: [Minimum One Bit Operations to Make Integers Zero](/problem/minimum-one-bit-operations-to-make-integers-zero)
