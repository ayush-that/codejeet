---
title: "How to Solve Find the Substring With Maximum Cost — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Substring With Maximum Cost. Medium difficulty, 57.8% acceptance rate. Topics: Array, Hash Table, String, Dynamic Programming."
date: "2029-04-05"
category: "dsa-patterns"
tags: ["find-the-substring-with-maximum-cost", "array", "hash-table", "string", "medium"]
---

## How to Solve "Find the Substring With Maximum Cost"

This problem asks us to find the maximum sum substring in a string `s`, where each character's value is defined by a mapping from `chars` to `vals`. The twist is that characters not in `chars` have a default value equal to their ASCII code. This is essentially a **maximum subarray sum** problem (Kadane's algorithm) disguised with character value mapping. The tricky part is recognizing the transformation from characters to numerical values and applying the classic algorithm correctly.

---

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
s = "abc"
chars = "ab"
vals = [3, -5]
```

**Step 1: Build character value mapping**

- 'a' → 3
- 'b' → -5
- 'c' → ASCII('c') = 99 (since 'c' not in `chars`)

**Step 2: Convert string to value array**
`[3, -5, 99]`

**Step 3: Apply Kadane's algorithm**

- Initialize `current_max = 0`, `global_max = 0`
- Index 0: `current_max = max(0, 0 + 3) = 3`, `global_max = max(0, 3) = 3`
- Index 1: `current_max = max(0, 3 + (-5)) = 0`, `global_max = max(3, 0) = 3`
- Index 2: `current_max = max(0, 0 + 99) = 99`, `global_max = max(3, 99) = 99`

**Result:** 99 (from substring "c")

The key insight: we're finding the maximum sum of consecutive values, where we can choose an empty substring (cost 0) if all values are negative.

---

## Brute Force Approach

A naive solution would check every possible substring:

1. Generate all substrings of `s` (O(n²) substrings)
2. For each substring, sum the values of its characters (O(n) per substring)
3. Track the maximum sum encountered

This results in O(n³) time complexity, which is far too slow for constraints where `s.length` can be up to 5000.

**Why it fails:**

- Checking all substrings is O(n²)
- Summing each substring from scratch is O(n)
- Total O(n³) is impractical for n=5000 (125 billion operations)

Even with prefix sums to reduce substring sum calculation to O(1), we'd still have O(n²) time, which might be borderline for n=5000 (25 million operations).

---

## Optimized Approach

The optimal solution uses **Kadane's algorithm**, which solves maximum subarray sum in O(n) time.

**Key insight:** After mapping each character to its value, this becomes exactly the "Maximum Subarray" problem (LeetCode #53).

**Step-by-step reasoning:**

1. **Map characters to values:** Create a dictionary/hashmap for O(1) lookup of characters in `chars`. For characters not in the map, use ASCII value.
2. **Apply Kadane's algorithm:**
   - Track `current_max` = maximum sum ending at current position
   - Track `global_max` = maximum sum seen so far
   - For each value `v` in the value array:
     - `current_max = max(0, current_max + v)` (reset to 0 if negative)
     - `global_max = max(global_max, current_max)`
3. **Why it works:** Kadane's algorithm efficiently finds the maximum sum contiguous subarray by considering whether to extend the current subarray or start fresh at each position.

**Special consideration:** The empty substring has cost 0, which is handled by resetting `current_max` to 0 when it becomes negative.

---

## Optimal Solution

Here's the complete implementation in three languages:

<div class="code-group">

```python
# Time: O(n) where n = len(s)
# Space: O(1) extra space (excluding the mapping dictionary)
def maximumCostSubstring(s: str, chars: str, vals: list[int]) -> int:
    # Step 1: Build character value mapping
    char_to_val = {}
    for char, val in zip(chars, vals):
        char_to_val[char] = val

    # Step 2: Initialize variables for Kadane's algorithm
    current_max = 0  # Maximum sum ending at current position
    global_max = 0   # Maximum sum seen so far

    # Step 3: Process each character in s
    for char in s:
        # Get value for current character
        if char in char_to_val:
            value = char_to_val[char]
        else:
            value = ord(char) - ord('a') + 1  # ASCII value: 'a'=1, 'b'=2, etc.

        # Kadane's algorithm update
        # If adding this value makes current_max negative, reset to 0
        # (equivalent to starting a new substring)
        current_max = max(0, current_max + value)

        # Update global maximum if current_max is larger
        global_max = max(global_max, current_max)

    return global_max
```

```javascript
// Time: O(n) where n = s.length
// Space: O(1) extra space (excluding the mapping object)
function maximumCostSubstring(s, chars, vals) {
  // Step 1: Build character value mapping
  const charToVal = {};
  for (let i = 0; i < chars.length; i++) {
    charToVal[chars[i]] = vals[i];
  }

  // Step 2: Initialize variables for Kadane's algorithm
  let currentMax = 0; // Maximum sum ending at current position
  let globalMax = 0; // Maximum sum seen so far

  // Step 3: Process each character in s
  for (let i = 0; i < s.length; i++) {
    // Get value for current character
    let value;
    if (charToVal.hasOwnProperty(s[i])) {
      value = charToVal[s[i]];
    } else {
      // ASCII value: 'a' = 1, 'b' = 2, etc.
      value = s.charCodeAt(i) - "a".charCodeAt(0) + 1;
    }

    // Kadane's algorithm update
    // If adding this value makes currentMax negative, reset to 0
    // (equivalent to starting a new substring)
    currentMax = Math.max(0, currentMax + value);

    // Update global maximum if currentMax is larger
    globalMax = Math.max(globalMax, currentMax);
  }

  return globalMax;
}
```

```java
// Time: O(n) where n = s.length()
// Space: O(1) extra space (excluding the mapping HashMap)
class Solution {
    public int maximumCostSubstring(String s, String chars, int[] vals) {
        // Step 1: Build character value mapping
        Map<Character, Integer> charToVal = new HashMap<>();
        for (int i = 0; i < chars.length(); i++) {
            charToVal.put(chars.charAt(i), vals[i]);
        }

        // Step 2: Initialize variables for Kadane's algorithm
        int currentMax = 0;  // Maximum sum ending at current position
        int globalMax = 0;   // Maximum sum seen so far

        // Step 3: Process each character in s
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            int value;

            // Get value for current character
            if (charToVal.containsKey(c)) {
                value = charToVal.get(c);
            } else {
                // ASCII value: 'a' = 1, 'b' = 2, etc.
                value = c - 'a' + 1;
            }

            // Kadane's algorithm update
            // If adding this value makes currentMax negative, reset to 0
            // (equivalent to starting a new substring)
            currentMax = Math.max(0, currentMax + value);

            // Update global maximum if currentMax is larger
            globalMax = Math.max(globalMax, currentMax);
        }

        return globalMax;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- Building the character-to-value map: O(m) where m = len(chars)
- Processing each character in s: O(n) where n = len(s)
- Since m ≤ 26 (distinct lowercase letters), O(m + n) = O(n)

**Space Complexity: O(1) extra space**

- The mapping dictionary uses O(26) = O(1) space
- Variables `current_max` and `global_max` use O(1) space
- No additional data structures scale with input size

---

## Common Mistakes

1. **Forgetting the empty substring case:** The problem states empty string has cost 0. If all values are negative, the answer should be 0, not the least negative value. This is handled by resetting `current_max` to 0 when it becomes negative.

2. **Incorrect ASCII value calculation:** The problem says characters not in `chars` have value equal to their ASCII code. However, the examples show 'a'=1, 'b'=2, etc., not actual ASCII values (which would be 'a'=97). Use `ord(char) - ord('a') + 1` for correct mapping.

3. **Using O(n²) approach:** Some candidates try to check all substrings with prefix sums, which is O(n²). While this might pass for small n, it's inefficient and shows lack of recognition of the Kadane's algorithm pattern.

4. **Not handling distinct characters in `chars`:** The problem states `chars` has distinct characters, so we don't need to worry about duplicate mappings. But if we didn't notice this, we might incorrectly handle duplicates.

---

## When You'll See This Pattern

This pattern appears whenever you need to find:

1. **Maximum sum contiguous subarray** (LeetCode #53 - Maximum Subarray)
2. **Maximum product contiguous subarray** (LeetCode #152 - Maximum Product Subarray)
3. **Longest turbulent subarray** (LeetCode #978 - Longest Turbulent Subarray)
4. **Best time to buy and sell stock** (LeetCode #121 - Best Time to Buy and Sell Stock)

The core idea is maintaining a running value that represents the "best ending at current position" and updating a global best. This dynamic programming approach avoids recomputing from scratch for each starting position.

---

## Key Takeaways

1. **Recognize transformations:** Many problems are classic algorithms in disguise. Here, mapping characters to values transforms a string problem into a maximum subarray sum problem.

2. **Kadane's algorithm is your friend:** Whenever you need maximum/minimum sum of a contiguous subarray, think Kadane's algorithm with O(n) time complexity.

3. **Empty subarray consideration:** Always check if empty subarray is allowed (sum = 0). In Kadane's algorithm, this is handled by resetting to 0 when current sum becomes negative.

---

Related problems: [Maximum Subarray](/problem/maximum-subarray)
