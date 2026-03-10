---
title: "How to Solve Maximize Active Section with Trade I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximize Active Section with Trade I. Medium difficulty, 31.2% acceptance rate. Topics: String, Enumeration."
date: "2026-02-28"
category: "dsa-patterns"
tags: ["maximize-active-section-with-trade-i", "string", "enumeration", "medium"]
---

# How to Solve Maximize Active Section with Trade I

This problem asks us to maximize the number of consecutive '1's in a binary string by performing at most one "trade" — converting a contiguous block of '1's to '0's and then converting a contiguous block of '0's of the same length to '1's. The tricky part is that we're not just swapping sections, but rather we can strategically sacrifice some existing '1's to potentially gain more '1's elsewhere, with the constraint that the sections we convert must be contiguous and of equal length.

## Visual Walkthrough

Let's trace through an example: `s = "110111011"`

**Initial state:** We have several groups of '1's:

- Group 1: positions 0-1 (length 2)
- Group 2: positions 3-5 (length 3)
- Group 3: positions 7-8 (length 2)

**Our goal:** Find a trade that gives us the longest possible contiguous block of '1's.

**Consider trading the first group (length 2):**

- Convert positions 0-1 to '0': `"001111011"`
- Convert any contiguous block of 2 '0's to '1's
- Best option: Convert positions 0-1 back to '1's (no gain) OR convert positions 6-7 to '1's
- If we convert positions 6-7: `"111111111"` → 9 consecutive '1's!

**Consider trading the second group (length 3):**

- Convert positions 3-5 to '0': `"110000011"`
- Convert any contiguous block of 3 '0's to '1's
- Options: positions 2-4 or 3-5 or 4-6
- Best: Convert positions 2-4: `"111100011"` → 4 consecutive '1's

**Consider trading the third group (length 2):**

- Convert positions 7-8 to '0': `"110111000"`
- Convert any contiguous block of 2 '0's to '1's
- Options: positions 6-7 or 7-8
- Best: Convert positions 6-7: `"110111110"` → 3 consecutive '1's

**Best result:** Trading the first group gives us 9 consecutive '1's.

The key insight is that we need to consider trading each group of '1's and find the best resulting contiguous '1's sequence.

## Brute Force Approach

A naive approach would be:

1. For each possible contiguous block of '1's to trade (convert to '0')
2. For each possible contiguous block of '0's of the same length to convert to '1's
3. Apply the trade and count the longest consecutive '1's
4. Track the maximum

This approach has O(n³) time complexity because:

- O(n) possible starting positions for the '1' block
- O(n) possible lengths for that block
- O(n) possible positions for the '0' block of the same length
- O(n) to count consecutive '1's after each trade

For n up to 10⁵, this is clearly infeasible. We need a smarter approach that avoids explicitly trying every possible trade.

## Optimized Approach

The key insight is that we don't need to actually perform each trade to calculate the result. Instead, we can:

1. **Identify all groups of consecutive '1's** and their lengths/positions
2. **For each group of '1's we might trade**, calculate the maximum contiguous '1's we could get by:
   - Removing that group (converting it to '0's)
   - Adding a new group of '1's of the same length somewhere else
   - The new group must be placed in a contiguous block of '0's

The optimal placement for the new '1's is either:

- **Adjacent to existing '1' groups** to merge them into a longer sequence
- **Within a long enough gap of '0's** to create a new isolated group

We need to consider three main cases for each group we trade:

1. **Middle groups**: Can we connect groups on both sides by placing the new '1's in the gap?
2. **Edge groups**: Can we extend an adjacent group by placing new '1's next to it?
3. **Isolated placement**: Can we create a new group in a long enough '0' sequence?

The challenge is efficiently checking these conditions without O(n²) nested loops.

## Optimal Solution

We can solve this in O(n) time using prefix sums and careful case analysis:

1. Precompute prefix sums of '1's to quickly calculate the length of '1' groups
2. Identify all groups of consecutive '1's and their positions
3. For each group, calculate the best possible result if we trade it:
   - Case 1: The group has '1' groups on both sides, and the gap between them is exactly the group's length
   - Case 2: The group has a '1' group on one side, and there are enough '0's beyond it
   - Case 3: There exists a gap of '0's long enough anywhere in the string
4. Also consider the case where we don't trade at all (keep original max)

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximizeActiveSections(s: str) -> int:
    n = len(s)

    # Step 1: Precompute prefix sums of '1's
    # prefix[i] = number of '1's in s[0:i]
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + (1 if s[i] == '1' else 0)

    # Helper function to get number of '1's in range [l, r)
    def ones_in_range(l, r):
        return prefix[r] - prefix[l]

    # Step 2: Find all groups of consecutive '1's
    groups = []
    i = 0
    while i < n:
        if s[i] == '1':
            start = i
            while i < n and s[i] == '1':
                i += 1
            groups.append((start, i - 1))  # (start_index, end_index)
        else:
            i += 1

    # If no '1's at all, best we can do is 0
    if not groups:
        return 0

    # Step 3: Calculate the maximum without any trade
    max_without_trade = max(end - start + 1 for start, end in groups)

    # Step 4: For each group, calculate best result if we trade it
    best = max_without_trade
    m = len(groups)

    for idx, (start, end) in enumerate(groups):
        group_len = end - start + 1

        # Case 1: Group has groups on both sides and gap between them equals group_len
        if idx > 0 and idx < m - 1:
            prev_end = groups[idx - 1][1]
            next_start = groups[idx + 1][0]
            gap = next_start - prev_end - 1  # Number of '0's between groups

            if gap == group_len:
                # We can connect the two adjacent groups by placing our new '1's in the gap
                total_len = (prev_end - groups[idx - 1][0] + 1) + group_len + (groups[idx + 1][1] - next_start + 1)
                best = max(best, total_len)

        # Case 2: Group has a group on left side and enough '0's beyond it
        if idx > 0:
            prev_start, prev_end = groups[idx - 1]
            prev_len = prev_end - prev_start + 1

            # Check if there are enough '0's immediately after prev_end
            zeros_after = 0
            pos = prev_end + 1
            while pos < n and s[pos] == '0':
                zeros_after += 1
                pos += 1

            if zeros_after >= group_len:
                best = max(best, prev_len + group_len)

            # Also check if there are enough '0's immediately before prev_start
            zeros_before = 0
            pos = prev_start - 1
            while pos >= 0 and s[pos] == '0':
                zeros_before += 1
                pos -= 1

            if zeros_before >= group_len:
                best = max(best, prev_len + group_len)

        # Case 3: Group has a group on right side and enough '0's before it
        if idx < m - 1:
            next_start, next_end = groups[idx + 1]
            next_len = next_end - next_start + 1

            # Check if there are enough '0's immediately before next_start
            zeros_before = 0
            pos = next_start - 1
            while pos >= 0 and s[pos] == '0':
                zeros_before += 1
                pos -= 1

            if zeros_before >= group_len:
                best = max(best, next_len + group_len)

            # Also check if there are enough '0's immediately after next_end
            zeros_after = 0
            pos = next_end + 1
            while pos < n and s[pos] == '0':
                zeros_after += 1
                pos += 1

            if zeros_after >= group_len:
                best = max(best, next_len + group_len)

        # Case 4: There exists any gap of '0's long enough for this group
        # We can scan for the longest sequence of '0's
        max_zeros = 0
        i = 0
        while i < n:
            if s[i] == '0':
                zero_start = i
                while i < n and s[i] == '0':
                    i += 1
                max_zeros = max(max_zeros, i - zero_start)
            else:
                i += 1

        if max_zeros >= group_len:
            best = max(best, group_len)

    return best
```

```javascript
// Time: O(n) | Space: O(n)
function maximizeActiveSections(s) {
  const n = s.length;

  // Step 1: Precompute prefix sums of '1's
  // prefix[i] = number of '1's in s[0:i]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (s[i] === "1" ? 1 : 0);
  }

  // Helper function to get number of '1's in range [l, r)
  const onesInRange = (l, r) => prefix[r] - prefix[l];

  // Step 2: Find all groups of consecutive '1's
  const groups = [];
  let i = 0;
  while (i < n) {
    if (s[i] === "1") {
      const start = i;
      while (i < n && s[i] === "1") {
        i++;
      }
      groups.push([start, i - 1]); // [start_index, end_index]
    } else {
      i++;
    }
  }

  // If no '1's at all, best we can do is 0
  if (groups.length === 0) {
    return 0;
  }

  // Step 3: Calculate the maximum without any trade
  let maxWithoutTrade = 0;
  for (const [start, end] of groups) {
    maxWithoutTrade = Math.max(maxWithoutTrade, end - start + 1);
  }

  // Step 4: For each group, calculate best result if we trade it
  let best = maxWithoutTrade;
  const m = groups.length;

  for (let idx = 0; idx < m; idx++) {
    const [start, end] = groups[idx];
    const groupLen = end - start + 1;

    // Case 1: Group has groups on both sides and gap between them equals groupLen
    if (idx > 0 && idx < m - 1) {
      const prevEnd = groups[idx - 1][1];
      const nextStart = groups[idx + 1][0];
      const gap = nextStart - prevEnd - 1; // Number of '0's between groups

      if (gap === groupLen) {
        // We can connect the two adjacent groups by placing our new '1's in the gap
        const prevLen = groups[idx - 1][1] - groups[idx - 1][0] + 1;
        const nextLen = groups[idx + 1][1] - groups[idx + 1][0] + 1;
        const totalLen = prevLen + groupLen + nextLen;
        best = Math.max(best, totalLen);
      }
    }

    // Case 2: Group has a group on left side and enough '0's beyond it
    if (idx > 0) {
      const [prevStart, prevEnd] = groups[idx - 1];
      const prevLen = prevEnd - prevStart + 1;

      // Check if there are enough '0's immediately after prevEnd
      let zerosAfter = 0;
      let pos = prevEnd + 1;
      while (pos < n && s[pos] === "0") {
        zerosAfter++;
        pos++;
      }

      if (zerosAfter >= groupLen) {
        best = Math.max(best, prevLen + groupLen);
      }

      // Also check if there are enough '0's immediately before prevStart
      let zerosBefore = 0;
      pos = prevStart - 1;
      while (pos >= 0 && s[pos] === "0") {
        zerosBefore++;
        pos--;
      }

      if (zerosBefore >= groupLen) {
        best = Math.max(best, prevLen + groupLen);
      }
    }

    // Case 3: Group has a group on right side and enough '0's before it
    if (idx < m - 1) {
      const [nextStart, nextEnd] = groups[idx + 1];
      const nextLen = nextEnd - nextStart + 1;

      // Check if there are enough '0's immediately before nextStart
      let zerosBefore = 0;
      let pos = nextStart - 1;
      while (pos >= 0 && s[pos] === "0") {
        zerosBefore++;
        pos--;
      }

      if (zerosBefore >= groupLen) {
        best = Math.max(best, nextLen + groupLen);
      }

      // Also check if there are enough '0's immediately after nextEnd
      let zerosAfter = 0;
      pos = nextEnd + 1;
      while (pos < n && s[pos] === "0") {
        zerosAfter++;
        pos++;
      }

      if (zerosAfter >= groupLen) {
        best = Math.max(best, nextLen + groupLen);
      }
    }

    // Case 4: There exists any gap of '0's long enough for this group
    // We can scan for the longest sequence of '0's
    let maxZeros = 0;
    i = 0;
    while (i < n) {
      if (s[i] === "0") {
        const zeroStart = i;
        while (i < n && s[i] === "0") {
          i++;
        }
        maxZeros = Math.max(maxZeros, i - zeroStart);
      } else {
        i++;
      }
    }

    if (maxZeros >= groupLen) {
      best = Math.max(best, groupLen);
    }
  }

  return best;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maximizeActiveSections(String s) {
        int n = s.length();

        // Step 1: Precompute prefix sums of '1's
        // prefix[i] = number of '1's in s[0:i]
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + (s.charAt(i) == '1' ? 1 : 0);
        }

        // Helper function to get number of '1's in range [l, r)
        // Not directly used in all solutions but useful for general approach

        // Step 2: Find all groups of consecutive '1's
        List<int[]> groups = new ArrayList<>();
        int i = 0;
        while (i < n) {
            if (s.charAt(i) == '1') {
                int start = i;
                while (i < n && s.charAt(i) == '1') {
                    i++;
                }
                groups.add(new int[]{start, i - 1});  // [start_index, end_index]
            } else {
                i++;
            }
        }

        // If no '1's at all, best we can do is 0
        if (groups.isEmpty()) {
            return 0;
        }

        // Step 3: Calculate the maximum without any trade
        int maxWithoutTrade = 0;
        for (int[] group : groups) {
            maxWithoutTrade = Math.max(maxWithoutTrade, group[1] - group[0] + 1);
        }

        // Step 4: For each group, calculate best result if we trade it
        int best = maxWithoutTrade;
        int m = groups.size();

        for (int idx = 0; idx < m; idx++) {
            int[] group = groups.get(idx);
            int start = group[0];
            int end = group[1];
            int groupLen = end - start + 1;

            // Case 1: Group has groups on both sides and gap between them equals groupLen
            if (idx > 0 && idx < m - 1) {
                int prevEnd = groups.get(idx - 1)[1];
                int nextStart = groups.get(idx + 1)[0];
                int gap = nextStart - prevEnd - 1;  // Number of '0's between groups

                if (gap == groupLen) {
                    // We can connect the two adjacent groups by placing our new '1's in the gap
                    int prevLen = groups.get(idx - 1)[1] - groups.get(idx - 1)[0] + 1;
                    int nextLen = groups.get(idx + 1)[1] - groups.get(idx + 1)[0] + 1;
                    int totalLen = prevLen + groupLen + nextLen;
                    best = Math.max(best, totalLen);
                }
            }

            // Case 2: Group has a group on left side and enough '0's beyond it
            if (idx > 0) {
                int[] prevGroup = groups.get(idx - 1);
                int prevStart = prevGroup[0];
                int prevEnd = prevGroup[1];
                int prevLen = prevEnd - prevStart + 1;

                // Check if there are enough '0's immediately after prevEnd
                int zerosAfter = 0;
                int pos = prevEnd + 1;
                while (pos < n && s.charAt(pos) == '0') {
                    zerosAfter++;
                    pos++;
                }

                if (zerosAfter >= groupLen) {
                    best = Math.max(best, prevLen + groupLen);
                }

                // Also check if there are enough '0's immediately before prevStart
                int zerosBefore = 0;
                pos = prevStart - 1;
                while (pos >= 0 && s.charAt(pos) == '0') {
                    zerosBefore++;
                    pos--;
                }

                if (zerosBefore >= groupLen) {
                    best = Math.max(best, prevLen + groupLen);
                }
            }

            // Case 3: Group has a group on right side and enough '0's before it
            if (idx < m - 1) {
                int[] nextGroup = groups.get(idx + 1);
                int nextStart = nextGroup[0];
                int nextEnd = nextGroup[1];
                int nextLen = nextEnd - nextStart + 1;

                // Check if there are enough '0's immediately before nextStart
                int zerosBefore = 0;
                int pos = nextStart - 1;
                while (pos >= 0 && s.charAt(pos) == '0') {
                    zerosBefore++;
                    pos--;
                }

                if (zerosBefore >= groupLen) {
                    best = Math.max(best, nextLen + groupLen);
                }

                // Also check if there are enough '0's immediately after nextEnd
                int zerosAfter = 0;
                pos = nextEnd + 1;
                while (pos < n && s.charAt(pos) == '0') {
                    zerosAfter++;
                    pos++;
                }

                if (zerosAfter >= groupLen) {
                    best = Math.max(best, nextLen + groupLen);
                }
            }

            // Case 4: There exists any gap of '0's long enough for this group
            // We can scan for the longest sequence of '0's
            int maxZeros = 0;
            i = 0;
            while (i < n) {
                if (s.charAt(i) == '0') {
                    int zeroStart = i;
                    while (i < n && s.charAt(i) == '0') {
                        i++;
                    }
                    maxZeros = Math.max(maxZeros, i - zeroStart);
                } else {
                    i++;
                }
            }

            if (maxZeros >= groupLen) {
                best = Math.max(best, groupLen);
            }
        }

        return best;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass to compute prefix sums: O(n)
- We make another pass to identify all groups of '1's: O(n)
- For each group (at most O(n) groups), we check conditions by scanning adjacent sections: O(1) amortized per group since total scans across all groups is O(n)
- Final scan for longest '0's sequence: O(n)
- Total: O(n)

**Space Complexity: O(n)**

- We store prefix sums array of size n+1: O(n)
- We store groups list, which in worst case has O(n) entries (alternating '1's and '0's): O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting to consider not trading at all**: The optimal solution might be to keep the string as-is. Always compare with the original maximum.

2. **Only checking adjacent groups**: Some candidates only check if they can merge two adjacent groups by trading the middle group. They forget cases where trading an edge group and placing it next to another group can create a longer sequence.

3. **Incorrect gap calculation**: When checking if a gap of '0's has exactly the right length, remember that the gap between groups at indices i and i+1 is `groups[i+1].start - groups[i].end - 1`, not `groups[i+1].start - groups[i].end`.

4. **Overlooking isolated placements**: Even if a group can't be placed to merge with other groups, it might create a new isolated group if there's a long enough sequence of '0's anywhere in the string.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Sliding window with constraints**: Similar to problems where you can modify a limited number of elements to create the longest valid sequence.
   - Related: [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/) - Can flip at most k '0's to '1's
   - Related: [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) - Can replace k characters

2. **Grouping consecutive elements**: The technique of identifying and processing groups of consecutive identical elements appears in many string/array problems.
   - Related: [String Compression](https://leetcode.com/problems/string-compression/) - Group and compress consecutive characters
   - Related: [Partition Labels](https://leetcode.com/problems/partition-labels/) - Group characters based on their last occurrences

3. **Trade-off optimization**: Problems where you sacrifice something to gain something else, with the goal of maximizing the final result.
   - Related: [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) - Sacrifice money now to gain more later

## Key Takeaways

1. **When dealing with "at most k operations" problems**, consider each operation independently and calculate its potential benefit without actually performing it.

2. **Grouping consecutive elements** is often more efficient than processing each element individually when you care about contiguous sequences.

3. **For optimization problems with constraints**, enumerate all meaningful cases rather than trying to find a single unified formula. Sometimes brute force thinking applied smartly leads to the optimal solution.

[Practice this problem on CodeJeet](/problem/maximize-active-section-with-trade-i)
