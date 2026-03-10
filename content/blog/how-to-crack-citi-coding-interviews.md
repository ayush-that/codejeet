---
title: "How to Crack Citi Coding Interviews in 2026"
description: "Complete guide to Citi coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2027-12-06"
category: "company-guide"
company: "citi"
tags: ["citi", "interview prep", "leetcode"]
---

# How to Crack Citi Coding Interviews in 2026

Citi's technical interview process for software engineering roles is a structured, multi-stage evaluation designed to assess both your foundational coding skills and your ability to apply them to financial technology contexts. The process typically begins with an online assessment (OA), featuring 2-3 coding problems to be solved within 60-90 minutes. Successful candidates then proceed to a final round, which is often a series of 2-3 back-to-back virtual interviews (45-60 minutes each). These final rounds are almost exclusively coding-focused, with a heavy emphasis on problem-solving, clean code, and clear communication. What makes Citi's process unique is its practical bent: while the problems are standard LeetCode-style, interviewers often probe for how you'd adapt a solution for real-world data constraints or integrate it into a larger system, even if a full system design round isn't always on the docket. You're expected to write fully executable, syntactically correct code, not pseudocode.

## What Makes Citi Different

Citi's interview style sits at an interesting intersection. It's less algorithmically intense than FAANG companies—you're unlikely to face a parade of "Hard" dynamic programming problems—but it's more applied and implementation-focused than some other non-tech giants. The key differentiators are:

1.  **Emphasis on Correctness and Readability Over Extreme Optimization:** While optimal Big O is still required, interviewers heavily favor clean, well-structured, and bug-free code over clever one-liners or the absolute fastest theoretical runtime. They want to see code that would be maintainable in a production codebase.
2.  **The "FinTech Lens":** Problems, especially those involving arrays, hash tables, and math, often have a subtle financial flavor. You might be calculating profit, validating transaction sequences, or aggregating data. The core algorithm is standard, but framing your solution with this context in mind shows business awareness.
3.  **Integrated Discussion:** Expect follow-up questions that bridge coding and design. After solving "Merge Intervals (#56)", you might be asked, "How would you persist this merged schedule to a database?" or "What if this function was called 1000 times per second?" This tests your ability to think beyond the isolated function.

## By the Numbers

An analysis of recent Citi coding interviews reveals a very approachable difficulty profile:

- **Easy:** 67% (2 out of 3 questions)
- **Medium:** 33% (1 out of 3 questions)
- **Hard:** 0%

This breakdown is crucial for your strategy. It means **consistency is king**. Failing an "Easy" problem is often a fatal error. Your primary goal is to flawlessly solve the two "Easy" problems, which are frequently from Array and Hash Table topics. The single "Medium" problem is your chance to shine and is commonly drawn from Dynamic Programming or Stack patterns.

Specific LeetCode problems known to appear or be highly relevant include:

- **Two Sum (#1)** and its variants (Hash Table)
- **Best Time to Buy and Sell Stock (#121)** (Array/Math)
- **Merge Intervals (#56)** (Array)
- **Valid Parentheses (#20)** (Stack)
- **Climbing Stairs (#70)** (Dynamic Programming)

## Top Topics to Focus On

**Array (30% frequency):** Arrays are the fundamental data structure for representing ordered data like time-series prices, transaction logs, or portfolio holdings. Citi favors problems that require in-place manipulation, sliding windows, or prefix/suffix calculations, as these mimic real-time data processing.

**Dynamic Programming (25% frequency):** DP appears as the "Medium" problem to distinguish candidates. It tests systematic thinking and optimization—key skills for risk modeling or optimizing transaction paths. Focus on 1D DP patterns (like Fibonacci-style or knapSack-lite problems) rather than complex 2D grids.

<div class="code-group">

```python
# LeetCode #70. Climbing Stairs - A classic Citi-relevant 1D DP problem.
# Time: O(n) | Space: O(1) - Optimized space using only two variables.
def climbStairs(n: int) -> int:
    """
    Returns the number of distinct ways to climb to the top of a staircase
    of n steps, taking 1 or 2 steps at a time.
    """
    if n <= 2:
        return n
    # dp_i_minus_1 represents ways for i-1, dp_i_minus_2 for i-2
    dp_i_minus_2, dp_i_minus_1 = 1, 2  # Base cases for n=1 and n=2

    for i in range(3, n + 1):
        # Current ways = ways from previous step + ways from two steps back
        current = dp_i_minus_1 + dp_i_minus_2
        # Shift variables for next iteration
        dp_i_minus_2, dp_i_minus_1 = dp_i_minus_1, current

    return dp_i_minus_1
```

```javascript
// LeetCode #70. Climbing Stairs - A classic Citi-relevant 1D DP problem.
// Time: O(n) | Space: O(1) - Optimized space using only two variables.
function climbStairs(n) {
  /**
   * Returns the number of distinct ways to climb to the top of a staircase
   * of n steps, taking 1 or 2 steps at a time.
   */
  if (n <= 2) return n;
  // dpIMinus2 represents ways for i-2, dpIMinus1 for i-1
  let dpIMinus2 = 1,
    dpIMinus1 = 2; // Base cases for n=1 and n=2

  for (let i = 3; i <= n; i++) {
    // Current ways = ways from previous step + ways from two steps back
    const current = dpIMinus1 + dpIMinus2;
    // Shift variables for next iteration
    dpIMinus2 = dpIMinus1;
    dpIMinus1 = current;
  }
  return dpIMinus1;
}
```

```java
// LeetCode #70. Climbing Stairs - A classic Citi-relevant 1D DP problem.
// Time: O(n) | Space: O(1) - Optimized space using only two variables.
public int climbStairs(int n) {
    /**
     * Returns the number of distinct ways to climb to the top of a staircase
     * of n steps, taking 1 or 2 steps at a time.
     */
    if (n <= 2) return n;
    // dpIMinus2 represents ways for i-2, dpIMinus1 for i-1
    int dpIMinus2 = 1, dpIMinus1 = 2; // Base cases for n=1 and n=2

    for (int i = 3; i <= n; i++) {
        // Current ways = ways from previous step + ways from two steps back
        int current = dpIMinus1 + dpIMinus2;
        // Shift variables for next iteration
        dpIMinus2 = dpIMinus1;
        dpIMinus1 = current;
    }
    return dpIMinus1;
}
```

</div>

**Hash Table (20% frequency):** Ubiquitous for O(1) lookups, hash tables are essential for problems involving frequency counting, deduplication, or memoization—common in fraud detection or caching scenarios. Be prepared to use them as a supporting data structure in array or string problems.

**Math (15% frequency):** Math problems test logical reasoning and often involve modulo arithmetic, properties of numbers, or simple calculations. These can be "Easy" problems that trip you up if you don't handle edge cases (like overflow or division by zero) cleanly.

**Stack (10% frequency):** Stacks are perfect for parsing, validation, and "next greater element" problems. In a FinTech context, think of validating a sequence of operations (e.g., parentheses in a financial formula) or calculating spans of stock prices.

<div class="code-group">

```python
# LeetCode #20. Valid Parentheses - A fundamental stack problem.
# Time: O(n) | Space: O(n) for the stack in the worst case.
def isValid(s: str) -> bool:
    """
    Returns true if the input string's brackets are correctly closed in order.
    """
    bracket_map = {')': '(', '}': '{', ']': '['}
    stack = []

    for char in s:
        # If it's a closing bracket
        if char in bracket_map:
            # Pop the top element or use a dummy if stack is empty
            top_element = stack.pop() if stack else '#'
            # Check if it matches the mapping
            if bracket_map[char] != top_element:
                return False
        else:
            # It's an opening bracket, push to stack
            stack.append(char)

    # Valid if stack is empty (all brackets matched)
    return not stack
```

```javascript
// LeetCode #20. Valid Parentheses - A fundamental stack problem.
// Time: O(n) | Space: O(n) for the stack in the worst case.
function isValid(s) {
  /**
   * Returns true if the input string's brackets are correctly closed in order.
   */
  const bracketMap = { ")": "(", "}": "{", "]": "[" };
  const stack = [];

  for (const char of s) {
    // If it's a closing bracket
    if (bracketMap.hasOwnProperty(char)) {
      // Pop the top element or use a dummy if stack is empty
      const topElement = stack.length ? stack.pop() : "#";
      // Check if it matches the mapping
      if (bracketMap[char] !== topElement) {
        return false;
      }
    } else {
      // It's an opening bracket, push to stack
      stack.push(char);
    }
  }
  // Valid if stack is empty (all brackets matched)
  return stack.length === 0;
}
```

```java
// LeetCode #20. Valid Parentheses - A fundamental stack problem.
// Time: O(n) | Space: O(n) for the stack in the worst case.
public boolean isValid(String s) {
    /**
     * Returns true if the input string's brackets are correctly closed in order.
     */
    HashMap<Character, Character> bracketMap = new HashMap<>();
    bracketMap.put(')', '(');
    bracketMap.put('}', '{');
    bracketMap.put(']', '[');

    Stack<Character> stack = new Stack<>();

    for (char ch : s.toCharArray()) {
        // If it's a closing bracket
        if (bracketMap.containsKey(ch)) {
            // Pop the top element or use a dummy if stack is empty
            char topElement = stack.empty() ? '#' : stack.pop();
            // Check if it matches the mapping
            if (topElement != bracketMap.get(ch)) {
                return false;
            }
        } else {
            // It's an opening bracket, push to stack
            stack.push(ch);
        }
    }
    // Valid if stack is empty (all brackets matched)
    return stack.isEmpty();
}
```

</div>

## Preparation Strategy (6-Week Plan)

- **Weeks 1-2: Foundation & Patterns.** Solve 60 problems (30 Easy, 30 Medium). Focus 70% of your time on **Array** and **Hash Table**. Master the Two Sum pattern, sliding window, and prefix sums. For each problem, write clean, commented code in your primary language.
- **Week 3: Core Medium Topics.** Solve 25 problems (all Medium). Deep dive into **Dynamic Programming** (15 problems) and **Stack** (10 problems). For DP, start with Climbing Stairs, House Robber, and Coin Change. Understand both the brute force recursion and the optimized DP solution.
- **Week 4: Integration & Math.** Solve 20 problems (10 Easy, 10 Medium). Focus on **Math** problems and mixed-topic problems (e.g., an array problem that requires a hash table). Begin doing 2-problem sets in 60 minutes to simulate the OA.
- **Week 5: Mock Interviews & Citi-Specifics.** Conduct 4-5 mock interviews (use platforms like Pramp or a friend). Request problems from the top topics. Actively practice the "FinTech Lens": after solving, ask yourself, "How would this apply to processing trades?"
- **Week 6: Polish & Review.** Re-solve 15-20 of your previously marked "tricky" problems. No new problems. Focus on speed, flawless syntax, and articulating your thought process out loud. Review system design fundamentals (e.g., caching, DB basics) for integrated discussion questions.

## Common Mistakes

1.  **Over-Engineering the Easy Problem:** Candidates often waste precious OA time trying to find a "fancy" O(n) solution for an O(n log n) Easy problem that would pass all test cases. **Fix:** For your first pass, implement the straightforward, correct solution. Optimize only if you have time and can do it confidently.
2.  **Ignoring Input Validation and Edge Cases:** In the rush to implement the core logic, candidates forget to check for empty input, null values, or large numbers. **Fix:** Make "Edge Case Check" a deliberate step in your process. Verbally state these checks to the interviewer before you start coding.
3.  **Silent Struggle:** Unlike some tech companies, Citi interviewers may not proactively give hints if you go quiet for 5 minutes. **Fix:** Narrate your thinking constantly, even if you're stuck. Say, "I'm considering a hash map approach for lookups, but I'm concerned about the space complexity. Let me think about the constraints..."
4.  **Sloppy Code Presentation:** Writing messy, unindented code without clear variable names. **Fix:** Treat the editor like a shared document. Use consistent indentation, write descriptive variable names (`profit` not `p`), and leave brief comments for complex logic.

## Key Tips

1.  **Master the "Two Sum" Archetype:** Be able to derive and code the hash map solution for Two Sum (#1) in under 2 minutes, blindfolded. Its variants (e.g., Two Sum II - Input Array Is Sorted, Two Sum IV - Input is a BST) are extremely common.
2.  **Practice the 1-Minute Verbal Run-Through:** Before coding, force yourself to spend 60 seconds explaining your entire plan: data structures, algorithm steps, time/space complexity, and key edge cases. This prevents mid-code pivots.
3.  **Always Have a Brute Force Ready:** For the Medium DP problem, explicitly state the brute force recursive solution first. Then, identify the overlapping subproblems and explain how you'd memoize or tabulate. This demonstrates a structured problem-solving approach.
4.  **Prepare One "Financial" Example:** Have a short, relevant story ready about a past project or university work that involved data processing, optimization, or validation. If the conversation turns behavioral or system-oriented, you can weave this in naturally.
5.  **Test with Simple Cases:** After coding, don't just say "I'm done." Manually walk through a simple test case (e.g., `n=3` for Climbing Stairs) with your code, showing the intermediate values. This catches off-by-one errors and impresses the interviewer with your thoroughness.

<div class="code-group">

```python
# LeetCode #121. Best Time to Buy and Sell Stock - The quintessential Citi array problem.
# Time: O(n) | Space: O(1) - One pass tracking minimum price and max profit.
def maxProfit(prices: list[int]) -> int:
    """
    Returns the maximum profit from one buy and one sell transaction.
    """
    if not prices:
        return 0

    min_price_so_far = float('inf')
    max_profit = 0

    for price in prices:
        # Update the lowest price we've seen so far
        min_price_so_far = min(min_price_so_far, price)
        # Calculate profit if we sold at current price
        potential_profit = price - min_price_so_far
        # Update the maximum profit found
        max_profit = max(max_profit, potential_profit)

    return max_profit
```

```javascript
// LeetCode #121. Best Time to Buy and Sell Stock - The quintessential Citi array problem.
// Time: O(n) | Space: O(1) - One pass tracking minimum price and max profit.
function maxProfit(prices) {
  /**
   * Returns the maximum profit from one buy and one sell transaction.
   */
  if (prices.length === 0) return 0;

  let minPriceSoFar = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    // Update the lowest price we've seen so far
    minPriceSoFar = Math.min(minPriceSoFar, price);
    // Calculate profit if we sold at current price
    const potentialProfit = price - minPriceSoFar;
    // Update the maximum profit found
    maxProfit = Math.max(maxProfit, potentialProfit);
  }

  return maxProfit;
}
```

```java
// LeetCode #121. Best Time to Buy and Sell Stock - The quintessential Citi array problem.
// Time: O(n) | Space: O(1) - One pass tracking minimum price and max profit.
public int maxProfit(int[] prices) {
    /**
     * Returns the maximum profit from one buy and one sell transaction.
     */
    if (prices.length == 0) return 0;

    int minPriceSoFar = Integer.MAX_VALUE;
    int maxProfit = 0;

    for (int price : prices) {
        // Update the lowest price we've seen so far
        minPriceSoFar = Math.min(minPriceSoFar, price);
        // Calculate profit if we sold at current price
        int potentialProfit = price - minPriceSoFar;
        // Update the maximum profit found
        maxProfit = Math.max(maxProfit, potentialProfit);
    }

    return maxProfit;
}
```

</div>

Citi's coding interview is a test of disciplined fundamentals, not algorithmic wizardry. By focusing on the high-frequency topics, prioritizing clean and correct code, and practicing integrated thinking, you can confidently demonstrate the skills they value. Now, go put this plan into action.

[Browse all Citi questions on CodeJeet](/company/citi)
