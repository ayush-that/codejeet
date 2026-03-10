---
title: "How to Solve Lexicographically Smallest String After Substring Operation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest String After Substring Operation. Medium difficulty, 34.5% acceptance rate. Topics: String, Greedy."
date: "2029-02-01"
category: "dsa-patterns"
tags: ["lexicographically-smallest-string-after-substring-operation", "string", "greedy", "medium"]
---

# How to Solve Lexicographically Smallest String After Substring Operation

You're given a string of lowercase letters and can perform one operation: choose any non-empty substring and replace every character with its preceding letter in the alphabet ('b'→'a', 'a'→'z'). Your goal is to perform exactly one such operation to make the resulting string lexicographically smallest. What makes this problem interesting is that while the operation seems simple, finding the optimal substring requires careful reasoning about lexicographic ordering and the special behavior when 'a' becomes 'z'.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "acb"`.

**Step 1: Understanding the operation**

- For any character except 'a': move backward in alphabet ('b'→'a', 'c'→'b', etc.)
- For 'a': wrap around to 'z'

**Step 2: Lexicographic ordering basics**
A string is lexicographically smaller than another if at the first position where they differ, its character comes earlier in the alphabet. So to minimize a string, we want:

1. The earliest possible character in the first position
2. If first positions are equal, the earliest possible in the second position, and so on

**Step 3: Trying different substrings on "acb"**

- If we choose substring starting at index 0: "acb" → "zcb" (worse: 'z' > 'a')
- If we choose substring starting at index 1: "acb" → "abb" (better: 'a' same, 'b' < 'c')
- If we choose substring starting at index 2: "acb" → "aca" (better: 'a' same, 'c' same, 'a' < 'b')
- If we choose substring [1,2]: "acb" → "aaa" (best: 'a' same, 'a' < 'c')

Wait, we can choose any substring, not just single characters! Let's systematically check:

1. Substring "a": "acb" → "zcb" ❌
2. Substring "c": "acb" → "abb" ✅ (better than original)
3. Substring "b": "acb" → "aca" ✅ (better than original)
4. Substring "ac": "acb" → "zbb" ❌
5. Substring "cb": "acb" → "aza" ❌ (wraps 'a' to 'z')
6. Substring "acb": "acb" → "zba" ❌

But we missed the best one: substring "c" gives "abb", substring "b" gives "aca". Which is smaller? Compare "abb" vs "aca":

- Position 0: both 'a' ✓
- Position 1: 'b' vs 'c' → 'b' wins! So "abb" < "aca"

Actually, let's check substring "cb": "acb" → "aza". Compare "aza" vs "abb":

- Position 0: both 'a' ✓
- Position 1: 'z' vs 'b' → 'b' wins! So "abb" is still better.

What about substring starting at 'c' and including 'b'? That's "cb" which we already checked.

**Key insight**: The optimal strategy is to find the first non-'a' character and apply the operation starting from there until we either:

1. Reach the end of string, OR
2. Encounter another 'a' (which would become 'z' and make the string worse)

For "acb": first non-'a' is at index 1 ('c'). Apply operation from index 1 onward:

- 'c'→'b', 'b'→'a' → result: "aba" (even better than "abb"!)

Wait, that's substring starting at index 1, length 2. Let's check: "acb" with substring "cb" → "aza" (not "aba"). I made an error.

Actually, the operation applies to ALL characters in the substring equally. If we choose substring starting at index 1 (just 'c'), we get "abb". If we choose substring starting at index 1, length 2 ("cb"), we get "aza". So we need to decide when to stop.

**Correct insight**: Start at the first non-'a' and continue while characters are not 'a'. Stop when we hit 'a' because 'a'→'z' would make the string worse lexicographically.

For "acb": first non-'a' at index 1 ('c'), next char 'b' (not 'a'), continue. End of string reached. So apply operation to substring [1,2] → "aza".

But "aza" vs "abb": compare lexicographically:

- Position 0: both 'a' ✓
- Position 1: 'z' vs 'b' → 'b' wins! So "abb" < "aza"

So we should actually stop earlier! The real rule: continue only while the character is not 'a' AND changing it improves the string. Since 'b'→'a' improves, but 'c'→'b' also improves... Actually both improve. So why does "abb" beat "aza"?

Because when we change 'b' to 'a', that's good. But when we include 'b' in the substring, the 'b' becomes 'a', giving us "aba"... Wait no, if substring is "cb", both change: 'c'→'b', 'b'→'a' → "aba" not "aza". I'm confusing myself.

Let me recalculate properly:

- Original: "a c b"
- Substring "c": only change 'c'→'b' → "a b b"
- Substring "cb": change both 'c'→'b' AND 'b'→'a' → "a b a"

Compare "abb" vs "aba":

- Position 0: both 'a' ✓
- Position 1: both 'b' ✓
- Position 2: 'b' vs 'a' → 'a' wins! So "aba" < "abb"

So "aba" is even better! And it comes from changing the longest possible substring starting from first non-'a' until we either hit end of string or hit 'a' (which we don't have here).

Final answer for "acb" should be "aba".

## Brute Force Approach

A brute force solution would try every possible substring (O(n²) substrings) and for each one, create the transformed string (O(n) time), then compare to find the lexicographically smallest. This would be O(n³) time overall, which is far too slow for constraints where n can be up to 10⁵.

Even if optimized to O(n²) by reusing computations, it's still too slow. The key observation we need is that we don't need to check all substrings.

**What a naive candidate might try**: They might think to simply change all characters to 'a' where possible, or always choose the entire string. But changing 'a' to 'z' makes the string worse, so we need to be selective.

## Optimized Approach

The key insight comes from understanding lexicographic ordering:

1. **First differing position dominates**: To minimize a string, we care most about the earliest position. So we want to make the first character as small as possible.
2. **The operation's effect**:
   - For any character except 'a': it becomes smaller (better)
   - For 'a': it becomes 'z' (much worse)
3. **Optimal strategy**:
   - Find the first non-'a' character in the string
   - Start applying the operation from that position
   - Continue applying it to subsequent characters until we either:
     a) Reach the end of the string, OR
     b) Encounter an 'a' (which would become 'z' and ruin our progress)

Why stop at 'a'? Because changing 'a' to 'z' makes that position worse, and since it's after our starting position, it affects the comparison. Even though we improved earlier positions, introducing a 'z' at a later position could make the string larger than if we stopped earlier.

**Edge case**: What if the entire string is 'a's? Then any operation will make it worse (first 'a' becomes 'z'). So we should change the last character only (smallest possible damage), making it "aa...az" with 'z' at the end.

**Step-by-step reasoning**:

1. Convert string to list of characters (strings are immutable in most languages)
2. Find the first index where character ≠ 'a'
3. If no such index exists (all 'a's), change the last character to 'z'
4. Otherwise, starting from that index, change each character to its predecessor until:
   - We reach end of string, OR
   - We encounter 'a' (stop before changing it)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the character list
def getSmallestString(s: str) -> str:
    """
    Returns the lexicographically smallest string after performing
    exactly one substring operation.

    Strategy:
    1. Find first non-'a' character (if any)
    2. If all characters are 'a', we must still perform an operation:
       change the last 'a' to 'z' (minimal damage)
    3. Otherwise, starting from first non-'a', change each character
       to its predecessor until we hit another 'a' or end of string
    """
    # Convert to list since strings are immutable in Python
    chars = list(s)
    n = len(chars)

    # Find first non-'a' character
    start = 0
    while start < n and chars[start] == 'a':
        start += 1

    # Case 1: Entire string is 'a's
    if start == n:
        # Change last character from 'a' to 'z'
        chars[-1] = 'z'
        return ''.join(chars)

    # Case 2: Found non-'a', apply operation from start position
    i = start
    while i < n and chars[i] != 'a':
        # Replace current character with its predecessor
        # 'a' would become 'z', but we stop before reaching 'a'
        # Using ord() and chr() for character arithmetic
        chars[i] = chr(ord(chars[i]) - 1)
        i += 1

    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(n) for the character array
function getSmallestString(s) {
  /**
   * Returns the lexicographically smallest string after performing
   * exactly one substring operation.
   *
   * Strategy:
   * 1. Find first non-'a' character (if any)
   * 2. If all characters are 'a', change the last 'a' to 'z'
   * 3. Otherwise, from first non-'a' onward, decrement each character
   *    until hitting 'a' or end of string
   */

  // Convert string to array for mutability
  const chars = s.split("");
  const n = chars.length;

  // Find first non-'a' character
  let start = 0;
  while (start < n && chars[start] === "a") {
    start++;
  }

  // Case 1: All characters are 'a'
  if (start === n) {
    // Change last 'a' to 'z' (minimal negative impact)
    chars[n - 1] = "z";
    return chars.join("");
  }

  // Case 2: Apply operation from first non-'a' onward
  let i = start;
  while (i < n && chars[i] !== "a") {
    // Decrement character: 'b'->'a', 'c'->'b', etc.
    // charCodeAt gives ASCII, 'a' is 97, 'b' is 98, etc.
    const newCharCode = chars[i].charCodeAt(0) - 1;
    chars[i] = String.fromCharCode(newCharCode);
    i++;
  }

  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the character array
class Solution {
    public String getSmallestString(String s) {
        /**
         * Returns the lexicographically smallest string after performing
         * exactly one substring operation.
         *
         * Strategy:
         * 1. Find first non-'a' character
         * 2. If none found (all 'a's), change last char to 'z'
         * 3. Otherwise, decrement each char from first non-'a'
         *    until hitting 'a' or end of string
         */

        // Convert to char array for mutability
        char[] chars = s.toCharArray();
        int n = chars.length;

        // Find first non-'a' character
        int start = 0;
        while (start < n && chars[start] == 'a') {
            start++;
        }

        // Case 1: Entire string is 'a's
        if (start == n) {
            // Change last character to 'z' (must perform at least one operation)
            chars[n - 1] = 'z';
            return new String(chars);
        }

        // Case 2: Apply operation from first non-'a' onward
        int i = start;
        while (i < n && chars[i] != 'a') {
            // Decrement character by 1 in ASCII
            // 'a' is 97, 'b' is 98, so 'b' - 1 = 'a'
            chars[i] = (char)(chars[i] - 1);
            i++;
        }

        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string at most:
  1. First pass to find the first non-'a' character (O(n) worst case)
  2. Second pass to apply the operation from that position (O(n) worst case)
- In practice, these might overlap or be shorter, but worst case is linear.

**Space Complexity: O(n)**

- We need to convert the string to a mutable character array/list
- In Python/JavaScript/Java, strings are immutable, so we need O(n) space
- Could be O(1) additional space if we could modify in place, but string immutability prevents this

## Common Mistakes

1. **Changing 'a' to 'z' unintentionally**: The most common error is continuing the operation past a non-'a' character and hitting an 'a', which becomes 'z' and makes the string worse. Always stop when you encounter 'a'.

2. **Handling all-'a' strings incorrectly**: When the string is all 'a's, any operation makes it worse. The optimal is to minimize damage by changing only the last character to 'z', making it "aa...az". Some candidates return the original string or change the first character.

3. **Not understanding lexicographic order**: Some think they should change as many characters as possible, but lexicographic order cares most about the earliest differing position. Changing a later position from 'a' to 'z' can undo gains from earlier improvements.

4. **Off-by-one errors with indices**: When finding the first non-'a', ensure you handle the case where no such character exists (start == n). Also, be careful with string bounds when applying the operation.

## When You'll See This Pattern

This problem uses a **greedy approach with early stopping** based on a worsening condition. Similar patterns appear in:

1. **Shifting Letters (LeetCode 848)**: Also involves character shifting operations, though with different constraints. Both require understanding modular arithmetic with characters.

2. **Lexicographically Smallest String After Applying Operations (LeetCode 1625)**: More complex version with multiple operation types, but same core idea of finding optimal transformation for lexicographic ordering.

3. **Maximum Subarray (LeetCode 53)**: While different domain, uses similar "continue while beneficial, stop when detrimental" greedy logic.

4. **Monotonic stack problems**: The "continue while condition holds, stop when it breaks" pattern appears in many monotonic stack problems where you process elements until a condition fails.

## Key Takeaways

1. **Lexicographic optimization prioritizes early positions**: When minimizing a string lexicographically, focus on making the earliest possible character as small as possible. Improvements at later positions only matter if earlier positions are equal.

2. **Greedy with stopping condition**: Many string transformation problems have optimal solutions where you apply an operation continuously until a stopping condition (like encountering 'a' in this case). Look for problems where local improvements can be chained.

3. **Special cases matter**: Always check edge cases like all-'a' strings, single character strings, and strings beginning/ending with 'a'. These often require special handling.

4. **Character arithmetic is cleaner with ASCII**: Using `ord()`/`chr()` in Python or `charCodeAt()`/`fromCharCode()` in JavaScript is cleaner than maintaining a mapping of character to predecessor.

Related problems: [Shifting Letters](/problem/shifting-letters), [Lexicographically Smallest String After Applying Operations](/problem/lexicographically-smallest-string-after-applying-operations), [Lexicographically Smallest String After Operations With Constraint](/problem/lexicographically-smallest-string-after-operations-with-constraint)
