---
title: "How to Solve Compare Version Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Compare Version Numbers. Medium difficulty, 46.1% acceptance rate. Topics: Two Pointers, String."
date: "2027-01-21"
category: "dsa-patterns"
tags: ["compare-version-numbers", "two-pointers", "string", "medium"]
---

# How to Solve Compare Version Numbers

Comparing version numbers seems straightforward until you encounter edge cases like leading zeros, different revision counts, and large version strings. The core challenge is parsing and comparing integer revisions while handling mismatched lengths intelligently. This problem tests your ability to work with string parsing, edge cases, and clean comparisons.

## Visual Walkthrough

Let's trace through comparing `version1 = "1.01.2"` and `version2 = "1.001.2.0"`:

1. **Split by dots**: We get revisions `["1", "01", "2"]` and `["1", "001", "2", "0"]`
2. **Compare revision by revision**:
   - Revision 1: `"1"` vs `"1"` → both equal (1 = 1)
   - Revision 2: `"01"` vs `"001"` → both equal (1 = 1) after ignoring leading zeros
   - Revision 3: `"2"` vs `"2"` → both equal (2 = 2)
   - Revision 4: `""` vs `"0"` → treat missing as 0, so 0 = 0
3. **Result**: All revisions equal → return 0

Now let's try `version1 = "1.2"` and `version2 = "1.10"`:

- Revision 1: `"1"` vs `"1"` → equal
- Revision 2: `"2"` vs `"10"` → 2 < 10 → return -1

The key insight: we need to compare revisions as integers, handle leading zeros, and treat missing revisions as 0.

## Brute Force Approach

A naive approach would be to:

1. Split both version strings by `.` into arrays
2. Convert each revision string to integer (handling leading zeros automatically)
3. Pad the shorter array with zeros to match lengths
4. Compare element by element

While this approach works, it has inefficiencies:

- Converting all revisions upfront uses O(n+m) space
- Padding creates unnecessary zero elements
- We process all revisions even if we could return early

However, the real issue isn't performance but implementation complexity. Many candidates struggle with:

- Handling different numbers of revisions
- Converting strings to integers while ignoring leading zeros
- Deciding when to stop comparing

Let's see what this might look like:

<div class="code-group">

```python
def compareVersion(version1: str, version2: str) -> int:
    # Split and convert all revisions upfront
    v1_parts = version1.split('.')
    v2_parts = version2.split('.')

    # Convert all to integers
    v1_ints = [int(part) for part in v1_parts]
    v2_ints = [int(part) for part in v2_parts]

    # Pad with zeros to match lengths
    max_len = max(len(v1_ints), len(v2_ints))
    v1_ints += [0] * (max_len - len(v1_ints))
    v2_ints += [0] * (max_len - len(v2_ints))

    # Compare element by element
    for i in range(max_len):
        if v1_ints[i] < v2_ints[i]:
            return -1
        elif v1_ints[i] > v2_ints[i]:
            return 1

    return 0
```

```javascript
function compareVersion(version1, version2) {
  // Split and convert all revisions upfront
  const v1Parts = version1.split(".");
  const v2Parts = version2.split(".");

  // Convert all to integers
  const v1Ints = v1Parts.map((part) => parseInt(part, 10));
  const v2Ints = v2Parts.map((part) => parseInt(part, 10));

  // Pad with zeros to match lengths
  const maxLen = Math.max(v1Ints.length, v2Ints.length);
  while (v1Ints.length < maxLen) v1Ints.push(0);
  while (v2Ints.length < maxLen) v2Ints.push(0);

  // Compare element by element
  for (let i = 0; i < maxLen; i++) {
    if (v1Ints[i] < v2Ints[i]) return -1;
    if (v1Ints[i] > v2Ints[i]) return 1;
  }

  return 0;
}
```

```java
public int compareVersion(String version1, String version2) {
    // Split and convert all revisions upfront
    String[] v1Parts = version1.split("\\.");
    String[] v2Parts = version2.split("\\.");

    // Convert all to integers
    int[] v1Ints = new int[v1Parts.length];
    int[] v2Ints = new int[v2Parts.length];

    for (int i = 0; i < v1Parts.length; i++) {
        v1Ints[i] = Integer.parseInt(v1Parts[i]);
    }
    for (int i = 0; i < v2Parts.length; i++) {
        v2Ints[i] = Integer.parseInt(v2Parts[i]);
    }

    // Compare element by element, treating missing as 0
    int maxLen = Math.max(v1Ints.length, v2Ints.length);
    for (int i = 0; i < maxLen; i++) {
        int num1 = i < v1Ints.length ? v1Ints[i] : 0;
        int num2 = i < v2Ints.length ? v2Ints[i] : 0;

        if (num1 < num2) return -1;
        if (num1 > num2) return 1;
    }

    return 0;
}
```

</div>

This brute force works but uses extra space for all integer conversions. We can optimize this.

## Optimized Approach

The key insight is that we don't need to:

1. Convert all revisions upfront
2. Pad arrays with zeros
3. Store all integer conversions

Instead, we can:

1. Use two pointers to traverse both strings simultaneously
2. Extract one revision at a time from each version
3. Convert that revision to integer on the fly
4. Compare immediately and return if different
5. Treat missing revisions as 0

This gives us O(1) extra space (excluding input storage) and allows early termination.

Think of it like this: we're comparing revisions left to right. At each step:

- Extract the next revision from each version (until we hit a dot or end of string)
- Convert to integer (which automatically handles leading zeros)
- Compare: if different, return result
- If equal, move to next revision
- If one version has no more revisions, treat its current revision as 0

## Optimal Solution

Here's the optimal solution using two pointers for O(1) extra space:

<div class="code-group">

```python
def compareVersion(version1: str, version2: str) -> int:
    """
    Compare two version strings.

    Approach: Two pointers to traverse both strings simultaneously,
    extracting and comparing one revision at a time.

    Time Complexity: O(max(n, m)) where n and m are lengths of version strings
    Space Complexity: O(1) extra space (excluding input storage)
    """
    i, j = 0, 0  # Pointers for version1 and version2
    n1, n2 = len(version1), len(version2)

    while i < n1 or j < n2:
        # Extract next revision from version1
        num1 = 0
        while i < n1 and version1[i] != '.':
            # Build integer digit by digit
            num1 = num1 * 10 + int(version1[i])
            i += 1

        # Extract next revision from version2
        num2 = 0
        while j < n2 and version2[j] != '.':
            # Build integer digit by digit
            num2 = num2 * 10 + int(version2[j])
            j += 1

        # Compare the two revisions
        if num1 < num2:
            return -1
        elif num1 > num2:
            return 1

        # Move past the dot (if present) for next iteration
        i += 1
        j += 1

    # All revisions are equal
    return 0
```

```javascript
function compareVersion(version1, version2) {
  /**
   * Compare two version strings.
   *
   * Approach: Two pointers to traverse both strings simultaneously,
   * extracting and comparing one revision at a time.
   *
   * Time Complexity: O(max(n, m)) where n and m are lengths of version strings
   * Space Complexity: O(1) extra space (excluding input storage)
   */
  let i = 0,
    j = 0; // Pointers for version1 and version2
  const n1 = version1.length,
    n2 = version2.length;

  while (i < n1 || j < n2) {
    // Extract next revision from version1
    let num1 = 0;
    while (i < n1 && version1[i] !== ".") {
      // Build integer digit by digit
      num1 = num1 * 10 + parseInt(version1[i], 10);
      i++;
    }

    // Extract next revision from version2
    let num2 = 0;
    while (j < n2 && version2[j] !== ".") {
      // Build integer digit by digit
      num2 = num2 * 10 + parseInt(version2[j], 10);
      j++;
    }

    // Compare the two revisions
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;

    // Move past the dot (if present) for next iteration
    i++;
    j++;
  }

  // All revisions are equal
  return 0;
}
```

```java
public int compareVersion(String version1, String version2) {
    /**
     * Compare two version strings.
     *
     * Approach: Two pointers to traverse both strings simultaneously,
     * extracting and comparing one revision at a time.
     *
     * Time Complexity: O(max(n, m)) where n and m are lengths of version strings
     * Space Complexity: O(1) extra space (excluding input storage)
     */
    int i = 0, j = 0;  // Pointers for version1 and version2
    int n1 = version1.length(), n2 = version2.length();

    while (i < n1 || j < n2) {
        // Extract next revision from version1
        int num1 = 0;
        while (i < n1 && version1.charAt(i) != '.') {
            // Build integer digit by digit
            num1 = num1 * 10 + (version1.charAt(i) - '0');
            i++;
        }

        // Extract next revision from version2
        int num2 = 0;
        while (j < n2 && version2.charAt(j) != '.') {
            // Build integer digit by digit
            num2 = num2 * 10 + (version2.charAt(j) - '0');
            j++;
        }

        // Compare the two revisions
        if (num1 < num2) return -1;
        if (num1 > num2) return 1;

        // Move past the dot (if present) for next iteration
        i++;
        j++;
    }

    // All revisions are equal
    return 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(max(n, m))**

- We traverse each string at most once
- Each character is processed exactly once
- The while loops continue until we've processed all characters in both strings

**Space Complexity: O(1) extra space**

- We only use a few integer variables (i, j, num1, num2)
- No additional data structures are created
- The input strings are not modified

Note: If we consider the input storage, it's O(n + m), but in algorithm analysis, we typically only count extra space beyond the input.

## Common Mistakes

1. **Not handling different numbers of revisions**: Forgetting that `"1.0"` should equal `"1"`. Always treat missing revisions as 0.
   - Fix: Use `while i < n1 or j < n2` instead of `and` to continue until both are exhausted.

2. **String to integer conversion errors**: Using `int()` on empty strings or not handling leading zeros properly.
   - Fix: Build integers digit by digit as shown, which automatically handles leading zeros.

3. **Incorrect comparison logic**: Comparing revisions as strings instead of integers (e.g., `"2"` vs `"10"` as strings gives wrong result).
   - Fix: Always convert to integer before comparing.

4. **Forgetting to move past the dot**: Getting stuck in infinite loop after processing a revision.
   - Fix: Increment pointers after each revision to skip the dot separator.

5. **Off-by-one with pointer increments**: Incrementing pointers inside the digit extraction loop but not after it.
   - Fix: The pattern is: extract digits until dot/end, then increment once more to skip the dot.

## When You'll See This Pattern

This two-pointer approach for parsing and comparing segmented strings appears in several problems:

1. **String to Integer (atoi)** (LeetCode 8): Similar digit-by-digit integer building with overflow handling.
2. **Add Strings** (LeetCode 415): Adding two numbers represented as strings, digit by digit.
3. **Add Binary** (LeetCode 67): Similar concept with binary strings.
4. **Multiply Strings** (LeetCode 43): More complex but uses similar digit-by-digit processing.

The core pattern is: when you need to process formatted data (dots, commas, etc.) and compare/combine values, consider using two pointers to traverse and process segments on the fly rather than splitting everything upfront.

## Key Takeaways

1. **Parse as you go**: When comparing formatted strings, you often don't need to split everything upfront. Process segments incrementally to save space and enable early returns.

2. **Digit-by-digit conversion**: Building integers from strings digit by digit (`num = num * 10 + digit`) is cleaner than using library functions and gives you more control.

3. **Handle asymmetry gracefully**: When comparing sequences of different lengths, define clear rules for missing elements (treat as 0, infinity, etc.) and implement them consistently.

4. **Two pointers for parallel processing**: When you need to compare or combine two sequences element by element, two pointers (or indices) is often the cleanest approach.

Remember: Interviewers love this problem because it looks simple but has subtle edge cases. Always test with: equal versions, different lengths, leading zeros, and large numbers.

[Practice this problem on CodeJeet](/problem/compare-version-numbers)
