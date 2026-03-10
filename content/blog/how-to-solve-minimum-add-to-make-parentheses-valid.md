---
title: "How to Solve Minimum Add to Make Parentheses Valid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Add to Make Parentheses Valid. Medium difficulty, 74.4% acceptance rate. Topics: String, Stack, Greedy."
date: "2027-01-24"
category: "dsa-patterns"
tags: ["minimum-add-to-make-parentheses-valid", "string", "stack", "greedy", "medium"]
---

# How to Solve Minimum Add to Make Parentheses Valid

This problem asks us to find the minimum number of parentheses we need to add to make a given string of parentheses valid. The tricky part is that we can only add parentheses — we can't remove or rearrange existing ones. This constraint forces us to think carefully about which parentheses are already properly matched and which ones need additional partners.

## Visual Walkthrough

Let's trace through the example `s = "())("` step by step:

1. **Start**: We'll track two values: `open_needed` (how many '(' we need to add) and `close_needed` (how many ')' we need to add)
2. **First char '('**: This is an opening parenthesis that needs a closing partner. We don't need to add anything yet, but we note that we have one unmatched '('.
3. **Second char ')'**: This closing parenthesis matches with the previous '(', so they cancel out. Now we have no unmatched parentheses.
4. **Third char ')'**: This is a closing parenthesis with no opening parenthesis to match it. We need to add one '(' somewhere before this to make it valid. So `open_needed = 1`.
5. **Fourth char '('**: This is an opening parenthesis that needs a closing partner. We'll track it as unmatched.

At the end, we have:

- `open_needed = 1` (for the unmatched ')')
- One unmatched '(' still pending

Since the unmatched '(' needs a closing parenthesis, we need to add one ')'. So total additions needed = `open_needed + unmatched_open_count = 1 + 1 = 2`.

The final valid string could be `"(())()"` where we added '(' at the beginning and ')' at the end.

## Brute Force Approach

A brute force approach would involve trying all possible insertion positions for parentheses and checking if the resulting string is valid. For a string of length n:

1. We could try adding 0, 1, 2, ... parentheses until we find a valid configuration
2. For each number k of parentheses to add, we'd need to consider all combinations of where to insert them and what type ( '(' or ')' ) to insert
3. For each candidate string, we'd need to validate it using a stack or counter approach

This approach is extremely inefficient. Even for small strings, the number of possibilities grows exponentially. For a string of length n, if we need to add k parentheses, we have:

- 2^k choices for the types of parentheses
- C(n+k, k) choices for insertion positions

This gives us O(2^k _ C(n+k, k)) possibilities to check, which is clearly infeasible. Even checking just k from 0 to n gives us O(2^n _ something) complexity.

## Optimized Approach

The key insight is that we don't need to actually construct the valid string — we just need to count how many parentheses are missing. We can solve this with a single pass through the string using a simple counter approach:

1. **Track balance**: Maintain a counter that represents the current balance of parentheses
   - Increment when we see '(' (needs a matching ')')
   - Decrement when we see ')' (could match with a previous '(')
2. **Handle negative balance**: If the balance goes negative, that means we have more ')' than '(' seen so far. These extra ')' need additional '(' to match them.
3. **Final unmatched '('**: At the end, any positive balance represents '(' that never found matching ')'. These need additional ')' to close them.

This greedy approach works because:

- Each ')' should match with the most recent unmatched '(' (LIFO principle, though we don't need an actual stack here)
- When we see a ')' with no preceding '(', we must add a '(' somewhere before it
- At the end, any remaining '(' need ')' after them

The algorithm in pseudocode:

```
balance = 0
additions = 0

for each char in s:
    if char == '(':
        balance++  // Needs a closing ')'
    else:  // char == ')'
        if balance > 0:
            balance--  // Matches with previous '('
        else:
            additions++  // No '(' to match, need to add one

// Any remaining '(' need closing ')'
additions += balance
return additions
```

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) as we only use a few integer variables
def minAddToMakeValid(s: str) -> int:
    """
    Returns the minimum number of parentheses needed to add to make s valid.

    The algorithm tracks two things:
    1. balance: current count of unmatched '('
    2. additions: number of '(' we need to add for unmatched ')'

    At the end, we add the remaining balance (unmatched '(') to additions.
    """
    balance = 0  # Count of unmatched '('
    additions = 0  # Number of '(' we need to add

    for char in s:
        if char == '(':
            # Opening parenthesis: needs a closing partner
            balance += 1
        else:  # char == ')'
            if balance > 0:
                # We have an unmatched '(' to pair with this ')'
                balance -= 1
            else:
                # No '(' to match this ')', so we need to add one
                additions += 1

    # Any remaining unmatched '(' need closing ')'
    # Each unmatched '(' requires one ')' to be added
    additions += balance

    return additions
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) as we only use a few variables
function minAddToMakeValid(s) {
  /**
   * Returns the minimum number of parentheses needed to add to make s valid.
   *
   * The algorithm tracks:
   * 1. balance: current count of unmatched '('
   * 2. additions: number of '(' we need to add for unmatched ')'
   *
   * At the end, we add the remaining balance (unmatched '(') to additions.
   */
  let balance = 0; // Count of unmatched '('
  let additions = 0; // Number of '(' we need to add

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "(") {
      // Opening parenthesis: needs a closing partner
      balance++;
    } else {
      // char === ')'
      if (balance > 0) {
        // We have an unmatched '(' to pair with this ')'
        balance--;
      } else {
        // No '(' to match this ')', so we need to add one
        additions++;
      }
    }
  }

  // Any remaining unmatched '(' need closing ')'
  // Each unmatched '(' requires one ')' to be added
  additions += balance;

  return additions;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) as we only use a few variables
class Solution {
    public int minAddToMakeValid(String s) {
        /**
         * Returns the minimum number of parentheses needed to add to make s valid.
         *
         * The algorithm tracks:
         * 1. balance: current count of unmatched '('
         * 2. additions: number of '(' we need to add for unmatched ')'
         *
         * At the end, we add the remaining balance (unmatched '(') to additions.
         */
        int balance = 0;  // Count of unmatched '('
        int additions = 0;  // Number of '(' we need to add

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == '(') {
                // Opening parenthesis: needs a closing partner
                balance++;
            } else {  // c == ')'
                if (balance > 0) {
                    // We have an unmatched '(' to pair with this ')'
                    balance--;
                } else {
                    // No '(' to match this ')', so we need to add one
                    additions++;
                }
            }
        }

        // Any remaining unmatched '(' need closing ')'
        // Each unmatched '(' requires one ')' to be added
        additions += balance;

        return additions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length n
- Each character is processed exactly once with O(1) operations (comparisons and integer arithmetic)

**Space Complexity: O(1)**

- We only use a constant amount of extra space: two integer variables (`balance` and `additions`)
- No data structures that grow with input size are used

## Common Mistakes

1. **Using a stack unnecessarily**: Many candidates immediately reach for a stack when they see parentheses problems. While a stack would work (push '(' and pop when seeing ')', counting mismatches), it uses O(n) space. The counter approach is more efficient for this specific problem.

2. **Forgetting to handle both types of mismatches**: Some candidates only count when they see ')' with no matching '(', forgetting that at the end, any remaining '(' also need closing parentheses. Always remember: both `))((` and `((()))` have issues — the first needs '(' added, the second needs ')' added.

3. **Incorrectly resetting counters**: When the balance goes negative, some candidates reset it to 0 and increment additions, which is correct. But they might forget that negative balance represents a specific problem (needing '(') that's different from positive balance at the end (needing ')').

4. **Overcomplicating with DP or recursion**: Since the problem asks for minimum "additions" (not changes or deletions), a greedy approach works perfectly. Some candidates try dynamic programming or recursion, which is unnecessary and more complex.

## When You'll See This Pattern

This parentheses balancing pattern appears in many coding problems:

1. **Valid Parentheses (LeetCode #20)**: The classic stack-based validation problem. This problem is simpler because we only have one type of parentheses and we're counting mismatches rather than validating.

2. **Minimum Remove to Make Valid Parentheses (LeetCode #1249)**: Similar concept but with removal instead of addition. The two-pointer approach used there is related to our counter approach here.

3. **Minimum Number of Swaps to Make the String Balanced (LeetCode #1963)**: A variation where you can swap adjacent characters instead of adding new ones. The counting logic is very similar — you still track imbalances.

4. **Longest Valid Parentheses (LeetCode #32)**: More complex but uses similar balancing concepts with stacks or counters to find valid subsequences.

The core pattern is using a counter or stack to track the "balance" or "nesting depth" of parentheses (or other paired symbols). When the balance goes negative or remains positive at the end, you have mismatches to fix.

## Key Takeaways

1. **For single-type parentheses problems, a counter is often sufficient**: You don't always need a stack. If you only have '(' and ')', you can track the net balance with a simple integer.

2. **Separate the two types of mismatches**: Unmatched ')' cause immediate problems (negative balance) while unmatched '(' cause problems at the end (positive balance). Handle them separately in your logic.

3. **Greedy works for minimum additions**: Since we can add parentheses anywhere, the optimal strategy is to fix problems as we encounter them — add '(' when we see unmatched ')', and add ')' at the end for any remaining '('.

Related problems: [Minimum Number of Swaps to Make the String Balanced](/problem/minimum-number-of-swaps-to-make-the-string-balanced)
