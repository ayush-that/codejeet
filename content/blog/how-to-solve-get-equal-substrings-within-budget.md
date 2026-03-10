---
title: "How to Solve Get Equal Substrings Within Budget — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Get Equal Substrings Within Budget. Medium difficulty, 59.5% acceptance rate. Topics: String, Binary Search, Sliding Window, Prefix Sum."
date: "2028-10-19"
category: "dsa-patterns"
tags: ["get-equal-substrings-within-budget", "string", "binary-search", "sliding-window", "medium"]
---

# How to Solve Get Equal Substrings Within Budget

You're given two equal-length strings `s` and `t`, and a budget `maxCost`. Changing each character `s[i]` to `t[i]` costs the absolute difference of their ASCII values. Your task is to find the **maximum length of a substring** in `s` that can be changed to match the corresponding substring in `t` without exceeding the budget. The tricky part is that you need to find the longest contiguous segment where the cumulative transformation cost stays within budget—this is essentially a **maximum window problem with a cost constraint**.

## Visual Walkthrough

Let's trace through an example:  
`s = "abcd"`, `t = "bcdf"`, `maxCost = 3`

First, calculate the cost array (absolute differences):

- `|a-b| = 1`
- `|b-c| = 1`
- `|c-d| = 1`
- `|d-f| = 2`

So costs = `[1, 1, 1, 2]`

We need to find the longest contiguous subarray where the sum ≤ 3.

**Step-by-step window expansion:**

1. Start with empty window: `[]`, sum = 0, maxLen = 0
2. Add cost[0]=1: `[1]`, sum=1 ≤ 3, maxLen=1
3. Add cost[1]=1: `[1,1]`, sum=2 ≤ 3, maxLen=2
4. Add cost[2]=1: `[1,1,1]`, sum=3 ≤ 3, maxLen=3
5. Try adding cost[3]=2: sum would be 5 > 3, so we must shrink from left
   - Remove cost[0]=1: window becomes `[1,1,2]`, sum=4 > 3
   - Remove cost[1]=1: window becomes `[1,2]`, sum=3 ≤ 3, maxLen=3
     (We keep maxLen=3 since window length is 2)

The answer is 3. We can change "abc" to "bcd" with cost 1+1+1=3.

## Brute Force Approach

The brute force solution checks every possible substring:

1. For each starting index `i` (0 to n-1)
2. For each ending index `j` (i to n-1)
3. Calculate the sum of costs from i to j
4. If sum ≤ maxCost, update max length

This requires O(n²) substring checks and O(n) sum calculations for each, giving O(n³) time. Even with prefix sums to calculate sums in O(1), we still have O(n²) time, which is too slow for n up to 10⁵.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def brute_force(s, t, maxCost):
    n = len(s)
    max_len = 0

    for i in range(n):
        current_cost = 0
        for j in range(i, n):
            # Calculate cost for position j
            cost = abs(ord(s[j]) - ord(t[j]))
            current_cost += cost

            # Check if within budget
            if current_cost <= maxCost:
                max_len = max(max_len, j - i + 1)
            else:
                # No point continuing with this starting index
                break

    return max_len
```

```javascript
// Time: O(n²) | Space: O(1)
function bruteForce(s, t, maxCost) {
  const n = s.length;
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    let currentCost = 0;
    for (let j = i; j < n; j++) {
      // Calculate cost for position j
      const cost = Math.abs(s.charCodeAt(j) - t.charCodeAt(j));
      currentCost += cost;

      // Check if within budget
      if (currentCost <= maxCost) {
        maxLen = Math.max(maxLen, j - i + 1);
      } else {
        // No point continuing with this starting index
        break;
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n²) | Space: O(1)
public int bruteForce(String s, String t, int maxCost) {
    int n = s.length();
    int maxLen = 0;

    for (int i = 0; i < n; i++) {
        int currentCost = 0;
        for (int j = i; j < n; j++) {
            // Calculate cost for position j
            int cost = Math.abs(s.charAt(j) - t.charAt(j));
            currentCost += cost;

            // Check if within budget
            if (currentCost <= maxCost) {
                maxLen = Math.max(maxLen, j - i + 1);
            } else {
                // No point continuing with this starting index
                break;
            }
        }
    }

    return maxLen;
}
```

</div>

## Optimized Approach

The key insight is recognizing this as a **sliding window problem**:

- We maintain a window [left, right] where the sum of costs ≤ maxCost
- As we expand the window to the right (increase `right`), we add the cost at `right`
- If the total cost exceeds maxCost, we shrink from the left (increase `left`) until we're back within budget
- At each valid window, we update our maximum length

This works because:

1. We're looking for the **longest** valid window, so we want to expand as much as possible
2. When we exceed the budget, shrinking from the left is optimal because any window starting earlier would also exceed the budget
3. The sliding window ensures we check all possible valid windows in O(n) time

Alternative approach: Binary search on answer length with prefix sums (O(n log n)), but sliding window is more efficient.

## Optimal Solution

Here's the O(n) sliding window solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def equalSubstring(s, t, maxCost):
    """
    Find the maximum length substring of s that can be changed to t
    with total cost <= maxCost.
    """
    n = len(s)
    left = 0          # Left pointer of sliding window
    current_cost = 0  # Total cost of current window
    max_len = 0       # Maximum valid window length found

    for right in range(n):
        # Calculate cost to change s[right] to t[right]
        cost = abs(ord(s[right]) - ord(t[right]))
        current_cost += cost

        # If current cost exceeds budget, shrink window from left
        while current_cost > maxCost:
            # Remove leftmost character's cost from window
            left_cost = abs(ord(s[left]) - ord(t[left]))
            current_cost -= left_cost
            left += 1

        # Update maximum length (window is now valid)
        # Window length = right - left + 1
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function equalSubstring(s, t, maxCost) {
  /**
   * Find the maximum length substring of s that can be changed to t
   * with total cost <= maxCost.
   */
  const n = s.length;
  let left = 0; // Left pointer of sliding window
  let currentCost = 0; // Total cost of current window
  let maxLen = 0; // Maximum valid window length found

  for (let right = 0; right < n; right++) {
    // Calculate cost to change s[right] to t[right]
    const cost = Math.abs(s.charCodeAt(right) - t.charCodeAt(right));
    currentCost += cost;

    // If current cost exceeds budget, shrink window from left
    while (currentCost > maxCost) {
      // Remove leftmost character's cost from window
      const leftCost = Math.abs(s.charCodeAt(left) - t.charCodeAt(left));
      currentCost -= leftCost;
      left++;
    }

    // Update maximum length (window is now valid)
    // Window length = right - left + 1
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
public int equalSubstring(String s, String t, int maxCost) {
    /**
     * Find the maximum length substring of s that can be changed to t
     * with total cost <= maxCost.
     */
    int n = s.length();
    int left = 0;          // Left pointer of sliding window
    int currentCost = 0;   // Total cost of current window
    int maxLen = 0;        // Maximum valid window length found

    for (int right = 0; right < n; right++) {
        // Calculate cost to change s[right] to t[right]
        int cost = Math.abs(s.charAt(right) - t.charAt(right));
        currentCost += cost;

        // If current cost exceeds budget, shrink window from left
        while (currentCost > maxCost) {
            // Remove leftmost character's cost from window
            int leftCost = Math.abs(s.charAt(left) - t.charAt(left));
            currentCost -= leftCost;
            left++;
        }

        // Update maximum length (window is now valid)
        // Window length = right - left + 1
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once with the `right` pointer (n iterations)
- Each character enters the window once and exits at most once, so the `left` pointer also moves at most n times
- The `while` loop doesn't make this O(n²) because each character is removed at most once

**Space Complexity: O(1)**

- We only use a few integer variables (left, right, current_cost, max_len)
- No additional data structures that scale with input size

## Common Mistakes

1. **Using if instead of while when shrinking the window**:  
   When current_cost > maxCost, you might need to remove multiple characters from the left, not just one. Using `if` would only remove one character, potentially leaving the window invalid.

2. **Forgetting to update max_len after shrinking**:  
   Some candidates update max_len before checking if the window is valid. You must ensure the window is valid (current_cost ≤ maxCost) before calculating its length.

3. **Incorrect window length calculation**:  
   The formula is `right - left + 1`, not `right - left`. When left and right point to the same character, the length should be 1.

4. **Precomputing costs array unnecessarily**:  
   While creating a costs array makes the code cleaner, it uses O(n) extra space. The optimal solution calculates costs on the fly to maintain O(1) space.

## When You'll See This Pattern

The sliding window pattern appears in problems where you need to find:

- Maximum/minimum length subarray satisfying a constraint
- Subarrays with sum/product within certain bounds
- Longest substring with at most K distinct characters

Related problems:

1. **Longest Substring Without Repeating Characters** (LeetCode 3) - Similar sliding window, but tracking character counts
2. **Minimum Size Subarray Sum** (LeetCode 209) - Finding minimum window with sum ≥ target (complementary to our maximum window problem)
3. **Fruit Into Baskets** (LeetCode 904) - Maximum window with at most 2 types of "fruits"
4. **Longest Nice Subarray** (mentioned in prompt) - Similar maximum window with bitwise constraints

## Key Takeaways

1. **Recognize maximum window problems**: When asked for "maximum length substring/subarray" with a constraint on sum/count, think sliding window.

2. **Shrink strategy matters**: Use `while` not `if` when you might need to remove multiple elements to satisfy the constraint.

3. **Update answer at the right time**: Always update your answer (max_len) after ensuring the window is valid, not before.

4. **O(n) is possible**: Don't settle for O(n²) brute force—if you can maintain a valid window as you expand, you can solve in linear time.

Related problems: [Longest Nice Subarray](/problem/longest-nice-subarray)
