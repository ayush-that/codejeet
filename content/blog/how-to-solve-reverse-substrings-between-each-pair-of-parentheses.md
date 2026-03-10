---
title: "How to Solve Reverse Substrings Between Each Pair of Parentheses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reverse Substrings Between Each Pair of Parentheses. Medium difficulty, 71.9% acceptance rate. Topics: String, Stack."
date: "2028-05-24"
category: "dsa-patterns"
tags: ["reverse-substrings-between-each-pair-of-parentheses", "string", "stack", "medium"]
---

# How to Solve Reverse Substrings Between Each Pair of Parentheses

This problem asks us to reverse substrings inside matching parentheses, working from innermost to outermost, and finally remove all brackets. What makes it tricky is the nested structure — we can't just reverse everything between '(' and ')' because parentheses can be nested, and we need to handle them in the correct order.

## Visual Walkthrough

Let's trace through `s = "(u(love)i)"` step by step:

1. Initial string: `(u(love)i)`
2. Find innermost parentheses: `(love)` → reverse to get `evol`
3. String becomes: `(uevoli)`
4. Now reverse the remaining substring: `uevoli` → reverse to get `iloveu`
5. Final result: `iloveu`

Another example with deeper nesting: `s = "(ed(et(oc))el)"`

1. Initial: `(ed(et(oc))el)`
2. Innermost: `(oc)` → `co`
3. String: `(ed(etco)el)`
4. Next innermost: `(etco)` → `octe`
5. String: `(edocteel)`
6. Outermost: `(edocteel)` → `leetcode`
7. Final: `leetcode`

The pattern is clear: we need to process parentheses from inside out, which naturally suggests a stack-based approach.

## Brute Force Approach

A naive approach would be to repeatedly scan the string, find the innermost parentheses, reverse the substring between them, and repeat until no parentheses remain:

1. While there are '(' in the string:
   - Find the last '(' (to get innermost)
   - Find the matching ')'
   - Reverse substring between them
   - Remove the parentheses
2. Return the string

This approach has several problems:

- Finding matching parentheses requires scanning
- Each reversal is O(k) where k is substring length
- Removing parentheses requires string reconstruction
- Worst case: O(n²) time for deeply nested strings

While this would work for small inputs, it's inefficient for the constraints typically found in coding interviews.

## Optimized Approach

The key insight is that we need to process parentheses from innermost to outermost, which is exactly what a **stack** does naturally with its LIFO (Last-In, First-Out) property.

Here's the step-by-step reasoning:

1. **Stack for tracking indices**: We can use a stack to store indices of '(' characters. When we encounter a ')', we know we've found a matching pair with the most recent '(' (which is on top of the stack).

2. **Processing from inside out**: Because we push '(' indices as we encounter them and pop when we find ')', we automatically process innermost parentheses first — the last '(' pushed will be the first one matched with a ')'.

3. **Efficient reversal**: Instead of repeatedly building new strings, we can work with a list of characters (mutable) and reverse slices in-place when we find matching parentheses.

4. **Final assembly**: After processing all parentheses, we simply join the characters that aren't parentheses.

The algorithm:

- Convert string to list for mutability
- Initialize empty stack
- Iterate through characters with index:
  - If '(': push index to stack
  - If ')': pop index from stack (matching '('), reverse substring between them
  - Otherwise: continue
- Build result string from non-parenthesis characters

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) worst case | Space: O(n)
# Note: While each reversal is O(k), in worst-case nested scenario
# we reverse progressively larger substrings, leading to O(n^2)
def reverseParentheses(s: str) -> str:
    # Convert string to list for in-place modifications
    chars = list(s)

    # Stack to store indices of '(' characters
    stack = []

    # Iterate through each character with its index
    for i, char in enumerate(chars):
        if char == '(':
            # Push index of '(' to stack
            stack.append(i)
        elif char == ')':
            # Found matching ')', get matching '(' index
            start = stack.pop()
            # Reverse the substring between start+1 and i-1
            # We add 1 to start to exclude the '(' itself
            # We use i as end because slicing excludes the end index
            chars[start+1:i] = chars[start+1:i][::-1]

    # Build result string from non-parenthesis characters
    result = []
    for char in chars:
        if char not in '()':
            result.append(char)

    return ''.join(result)
```

```javascript
// Time: O(n^2) worst case | Space: O(n)
function reverseParentheses(s) {
  // Convert string to array for mutability
  const chars = s.split("");

  // Stack to store indices of '(' characters
  const stack = [];

  // Iterate through each character with its index
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "(") {
      // Push index of '(' to stack
      stack.push(i);
    } else if (chars[i] === ")") {
      // Found matching ')', get matching '(' index
      const start = stack.pop();
      // Reverse the substring between start+1 and i-1
      // We need to extract, reverse, and replace
      const reversed = chars.slice(start + 1, i).reverse();

      // Replace the original slice with reversed version
      // We use splice to modify array in place
      chars.splice(start + 1, i - start - 1, ...reversed);
    }
  }

  // Build result string from non-parenthesis characters
  const result = [];
  for (const char of chars) {
    if (char !== "(" && char !== ")") {
      result.push(char);
    }
  }

  return result.join("");
}
```

```java
// Time: O(n^2) worst case | Space: O(n)
public String reverseParentheses(String s) {
    // Convert string to mutable list of characters
    List<Character> chars = new ArrayList<>();
    for (char c : s.toCharArray()) {
        chars.add(c);
    }

    // Stack to store indices of '(' characters
    Stack<Integer> stack = new Stack<>();

    // Iterate through each character with its index
    for (int i = 0; i < chars.size(); i++) {
        if (chars.get(i) == '(') {
            // Push index of '(' to stack
            stack.push(i);
        } else if (chars.get(i) == ')') {
            // Found matching ')', get matching '(' index
            int start = stack.pop();

            // Reverse the substring between start+1 and i-1
            int left = start + 1;
            int right = i - 1;

            while (left < right) {
                // Swap characters at left and right indices
                char temp = chars.get(left);
                chars.set(left, chars.get(right));
                chars.set(right, temp);
                left++;
                right--;
            }
        }
    }

    // Build result string from non-parenthesis characters
    StringBuilder result = new StringBuilder();
    for (char c : chars) {
        if (c != '(' && c != ')') {
            result.append(c);
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²) in worst case**

- We iterate through the string once: O(n)
- Each time we find a ')', we reverse a substring: O(k) where k is substring length
- In worst-case nested scenario (like `(((...)))`), we reverse substrings of increasing size: 1 + 3 + 5 + ... + n ≈ O(n²)
- Average case is better, but we must consider worst case for interview analysis

**Space Complexity: O(n)**

- We store the character list: O(n)
- Stack stores at most n/2 indices: O(n)
- Result string: O(n)
- Total: O(n)

There's actually an O(n) time solution using a "jump" technique where you precompute matching parentheses and traverse in reverse direction when hitting ')', but the stack approach is more intuitive and acceptable in most interviews.

## Common Mistakes

1. **Not handling nested parentheses correctly**: Candidates sometimes reverse everything between the first '(' and last ')', which fails for nested cases. Remember: process from inside out.

2. **Forgetting to exclude parentheses from final result**: After reversing, you must filter out '(' and ')' characters. A common error is to include them in the final string.

3. **Off-by-one errors in slicing**: When reversing `chars[start+1:i]`, note that:
   - `start+1` excludes the '('
   - `i` as end index excludes the ')'
   - Python slicing is exclusive of the end index, but other languages may need adjustment

4. **Using string concatenation instead of list**: Repeated string concatenation in a loop is O(n²) due to string immutability. Always convert to list/array first for in-place modifications.

## When You'll See This Pattern

This stack-based approach for matching nested structures appears in many problems:

1. **Valid Parentheses (LeetCode #20)**: Similar stack usage for matching brackets, but simpler since no reversal needed.

2. **Decode String (LeetCode #394)**: Uses stack to handle nested encoded strings like "3[a2[c]]" → "accaccacc".

3. **Basic Calculator (LeetCode #224)**: Stack helps manage parentheses and operator precedence in expression evaluation.

The pattern: **When you need to process nested structures from inside out, think stack.** The stack's LIFO property naturally handles the "innermost first" requirement.

## Key Takeaways

- **Stack is ideal for nested structures**: When you see parentheses, brackets, or any nested pattern requiring inside-out processing, stack should be your first thought.

- **Convert strings to mutable structures**: For problems requiring multiple modifications, convert strings to lists/arrays to avoid O(n²) string concatenation overhead.

- **Test with multiple levels of nesting**: Always test your solution with deeply nested cases to ensure you're processing in the correct order.

[Practice this problem on CodeJeet](/problem/reverse-substrings-between-each-pair-of-parentheses)
