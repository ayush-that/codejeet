---
title: "How to Solve Restore IP Addresses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Restore IP Addresses. Medium difficulty, 55.3% acceptance rate. Topics: String, Backtracking."
date: "2027-03-01"
category: "dsa-patterns"
tags: ["restore-ip-addresses", "string", "backtracking", "medium"]
---

# How to Solve Restore IP Addresses

Restoring IP addresses from a string is a classic backtracking problem where we need to insert three dots into a numeric string to form exactly four valid integers between 0 and 255, with no leading zeros unless the integer is exactly "0". The challenge lies in exploring all possible placements of dots while respecting the constraints efficiently.

## Visual Walkthrough

Let's trace through the input `"25525511135"` step by step:

We need to place exactly three dots to create four segments. Each segment must be:

1. Between 0 and 255 inclusive
2. Cannot have leading zeros (except for "0" itself)

**Step 1:** Start with first segment. Try length 1: `"2"` (valid, 0-255, no leading zero issues)

- Remaining: `"5525511135"`, need 3 more segments

**Step 2:** Try second segment length 1: `"5"` (valid)

- Remaining: `"525511135"`, need 2 more segments

**Step 3:** Try third segment length 1: `"5"` (valid)

- Remaining: `"25511135"`, need 1 more segment

**Step 4:** Try fourth segment length 8: `"25511135"` (invalid, >255)

- Backtrack to step 3

**Step 3 (again):** Try third segment length 2: `"25"` (valid)

- Remaining: `"5511135"`, need 1 more segment

**Step 4:** Try fourth segment length 7: `"5511135"` (invalid, >255)

- Continue backtracking...

Eventually we find valid combinations like:

- `"255.255.11.135"` (2+3+2+3 length segments)
- `"255.255.111.35"` (2+3+3+2 length segments)

The key insight: we need to try all segment lengths (1-3) for each of the four segments, but prune invalid choices early.

## Brute Force Approach

A naive approach would be to try all possible placements of three dots in the string. For a string of length `n`, there are `C(n-1, 3)` ways to place three dots between characters (choosing 3 positions out of n-1 possible positions between characters). For each placement, we'd check if all four segments are valid.

This brute force approach would be O(n³) in the worst case (n=12, maximum length for valid IP). While this might seem acceptable for small n, it's inefficient because:

1. We generate many invalid combinations (segments > 3 digits, segments starting with '0' followed by more digits)
2. We don't prune early - we generate the full combination before checking validity

A better approach is to build segments incrementally and backtrack as soon as we encounter an invalid segment.

## Optimized Approach

The optimal solution uses **backtracking with pruning**:

1. **Recursive DFS**: We build the IP address segment by segment
2. **Early pruning**: If a segment is invalid, we stop exploring that path immediately
3. **Segment validation**: Check three conditions:
   - Segment length 1-3
   - No leading zeros (unless segment is exactly "0")
   - Numeric value ≤ 255
4. **Base case**: When we have 4 valid segments and have consumed all characters

Key optimizations:

- Maximum segment length is 3 (since 255 has 3 digits)
- Minimum remaining characters = (4 - segments_formed) (each segment needs at least 1 digit)
- Maximum remaining characters = 3 × (4 - segments_formed) (each segment can have up to 3 digits)

This reduces the search space dramatically compared to brute force.

## Optimal Solution

<div class="code-group">

```python
# Time: O(3^4) = O(1) since maximum depth is 4 and each node has max 3 children
# Space: O(1) for recursion stack (depth 4), O(n) for storing results
def restoreIpAddresses(s: str):
    """
    Restore all possible valid IP addresses from a string.

    Args:
        s: Input string containing only digits

    Returns:
        List of all possible valid IP addresses
    """
    result = []

    def backtrack(start, path):
        """
        Recursive backtracking function.

        Args:
            start: Current index in the string
            path: List of segments formed so far
        """
        # Base case: if we have 4 segments
        if len(path) == 4:
            # If we've consumed all characters, add to results
            if start == len(s):
                result.append(".".join(path))
            return

        # Try segment lengths of 1, 2, and 3
        for length in range(1, 4):
            # Check if we have enough characters left
            if start + length > len(s):
                break

            # Extract the segment
            segment = s[start:start + length]

            # Validate the segment
            # 1. Check for leading zeros (invalid unless segment is "0")
            if segment[0] == '0' and len(segment) > 1:
                continue
            # 2. Check if value is <= 255
            if int(segment) > 255:
                continue

            # Add valid segment to path and recurse
            path.append(segment)
            backtrack(start + length, path)
            path.pop()  # Backtrack

    backtrack(0, [])
    return result
```

```javascript
// Time: O(3^4) = O(1) since maximum depth is 4 and each node has max 3 children
// Space: O(1) for recursion stack (depth 4), O(n) for storing results
function restoreIpAddresses(s) {
  const result = [];

  /**
   * Recursive backtracking function.
   * @param {number} start - Current index in the string
   * @param {string[]} path - Array of segments formed so far
   */
  function backtrack(start, path) {
    // Base case: if we have 4 segments
    if (path.length === 4) {
      // If we've consumed all characters, add to results
      if (start === s.length) {
        result.push(path.join("."));
      }
      return;
    }

    // Try segment lengths of 1, 2, and 3
    for (let length = 1; length <= 3; length++) {
      // Check if we have enough characters left
      if (start + length > s.length) {
        break;
      }

      // Extract the segment
      const segment = s.substring(start, start + length);

      // Validate the segment
      // 1. Check for leading zeros (invalid unless segment is "0")
      if (segment[0] === "0" && segment.length > 1) {
        continue;
      }
      // 2. Check if value is <= 255
      if (parseInt(segment) > 255) {
        continue;
      }

      // Add valid segment to path and recurse
      path.push(segment);
      backtrack(start + length, path);
      path.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return result;
}
```

```java
// Time: O(3^4) = O(1) since maximum depth is 4 and each node has max 3 children
// Space: O(1) for recursion stack (depth 4), O(n) for storing results
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<String> restoreIpAddresses(String s) {
        List<String> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), result);
        return result;
    }

    /**
     * Recursive backtracking function.
     * @param s The input string
     * @param start Current index in the string
     * @param path List of segments formed so far
     * @param result List to store valid IP addresses
     */
    private void backtrack(String s, int start, List<String> path, List<String> result) {
        // Base case: if we have 4 segments
        if (path.size() == 4) {
            // If we've consumed all characters, add to results
            if (start == s.length()) {
                result.add(String.join(".", path));
            }
            return;
        }

        // Try segment lengths of 1, 2, and 3
        for (int length = 1; length <= 3; length++) {
            // Check if we have enough characters left
            if (start + length > s.length()) {
                break;
            }

            // Extract the segment
            String segment = s.substring(start, start + length);

            // Validate the segment
            // 1. Check for leading zeros (invalid unless segment is "0")
            if (segment.charAt(0) == '0' && segment.length() > 1) {
                continue;
            }
            // 2. Check if value is <= 255
            if (Integer.parseInt(segment) > 255) {
                continue;
            }

            // Add valid segment to path and recurse
            path.add(segment);
            backtrack(s, start + length, path, result);
            path.remove(path.size() - 1);  // Backtrack
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(3⁴) = O(1) in practice

- The recursion tree has maximum depth of 4 (for 4 segments)
- At each level, we try at most 3 segment lengths (1, 2, or 3 digits)
- However, we prune invalid paths early, so actual runtime is much less than 3⁴
- For string length n, the complexity is technically O(1) since n ≤ 12 for valid IPs

**Space Complexity**: O(n) for storing results

- Recursion stack depth is O(1) since maximum depth is 4
- We store all valid IP addresses in the result list
- Each valid IP address has O(n) characters where n ≤ 12

## Common Mistakes

1. **Not handling leading zeros correctly**: The most common mistake is allowing segments like "01" or "001". Remember: a segment can only be "0" or a number without leading zeros.

2. **Forgetting to check segment value ≤ 255**: Candidates sometimes only check the length but forget that "256" is invalid even though it has 3 digits.

3. **Not consuming all characters**: When you reach 4 segments, you must verify that `start == len(s)`. Otherwise, you might generate IPs that don't use all digits.

4. **Incorrect bounds checking**: When trying segment length `length`, check `start + length > len(s)` not `≥`. Also, remember that string indices are 0-based.

5. **Not pruning early enough**: Some candidates generate all combinations first, then filter. This is inefficient. Always validate segments as you build them.

## When You'll See This Pattern

This backtracking with pruning pattern appears in many combinatorial problems:

1. **Palindrome Partitioning (LeetCode 131)**: Similar structure - partition a string into valid palindromes instead of valid IP segments.

2. **Generate Parentheses (LeetCode 22)**: Another backtracking problem where you build valid combinations incrementally with constraints.

3. **Letter Combinations of a Phone Number (LeetCode 17)**: Backtracking through possible combinations with a fixed depth.

4. **Combination Sum (LeetCode 39)**: Backtracking to find combinations that sum to a target, with pruning based on the current sum.

The common theme: you're building a solution incrementally, have constraints to satisfy at each step, and need to explore all valid combinations.

## Key Takeaways

1. **Backtracking with pruning** is ideal for combinatorial problems where you need to explore all valid configurations. Build incrementally and abandon invalid paths early.

2. **Segment validation** should happen as early as possible. Check constraints at each step rather than at the end.

3. **Fixed-depth recursion** often has manageable complexity. When the recursion depth is limited (like 4 segments here), the exponential factor is bounded.

4. **Edge cases matter**: Leading zeros, maximum values, and consuming all input are common pitfalls that separate working from broken solutions.

Related problems: [IP to CIDR](/problem/ip-to-cidr)
