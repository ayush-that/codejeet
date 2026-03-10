---
title: "How to Crack Delhivery Coding Interviews in 2026"
description: "Complete guide to Delhivery coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2027-09-07"
category: "company-guide"
company: "delhivery"
tags: ["delhivery", "interview prep", "leetcode"]
---

Delhivery’s coding interviews are a unique blend of logistics logic and classic software engineering. As India’s largest integrated logistics services platform, their technical assessment isn't just about algorithms—it’s about finding engineers who can model real-world constraints efficiently. The process typically involves an initial online assessment (OA) followed by 2-3 technical rounds. The OA is often proctored and features a mix of coding, database, and problem-solving questions. What stands out is the final round, which frequently includes a **system design component focused on a logistics or e-commerce scenario**, even for mid-level roles. You’re not just solving abstract problems; you’re implicitly designing systems that can scale to handle millions of shipments.

## What Makes Delhivery Different

While FAANG interviews often prioritize algorithmic purity and theoretical computer science, Delhivery’s process is intensely **application-driven**. They care less about whether you can recite the proof for Dijkstra’s algorithm and more about whether you can adapt it to find the most cost-effective delivery route given variable fuel costs and hub delays. This practical bent shows up in three key ways:

1.  **Database & SQL are Non-Negotiable:** Unlike many product-based companies that might only test DB in system design, Delhivery frequently includes medium-difficulty SQL problems in their OAs and technical discussions. You’re expected to write efficient joins, window functions, and handle date-time logic because their core business runs on data about packages, routes, and ETAs.
2.  **Optimization is the Real Goal:** For their algorithmic questions, a brute-force solution that passes sample cases is rarely enough. Interviewers will push you to optimize for time _and_ space, often asking follow-ups like, “Can we do this in O(1) extra space?” or “How would this perform on a stream of incoming data?” They are looking for engineers who instinctively think about resource constraints.
3.  **Pseudocode is a Starting Point, Not the Finish Line:** You might be allowed to start with pseudocode to explain your logic, but you will be asked to translate it into fully executable, clean code. Syntax matters. Handling edge cases (empty inputs, large numbers, single-element arrays) is explicitly evaluated.

## By the Numbers

Based on recent patterns, a standard 60-75 minute coding round breaks down roughly as follows:

- **1 Easy Problem (25% weight):** A warm-up, often on strings or arrays, to check basic coding fluency. Example: A string parsing problem related to tracking IDs.
- **2 Medium Problems (50% weight):** The core of the interview. These test your grasp of core data structures and algorithms. Expect problems on arrays (sorting, two-pointers) and recursion/backtracking.
- **1 Hard Problem (25% weight):** This is the differentiator. It’s usually a complex DP, graph, or advanced recursion problem that models a non-trivial logistics constraint.

This breakdown means your preparation cannot be surface-level. Solving 100 easy problems won't help. You need depth in mediums and exposure to hards. Specific problem patterns known to appear include variations of:

- **Merge Intervals (#56):** For consolidating delivery windows or overlapping service routes.
- **Two Sum (#1) & its variants:** For matching orders or resources.
- **Database: Second Highest Salary (#176) or Department Top Three Salaries (#185):** For analytical queries on shipment or performance data.

## Top Topics to Focus On

**1. Array & String Manipulation**

- **Why Delhivery Favors It:** The fundamental data for any shipment—tracking numbers, PIN codes, hub lists—are arrays and strings. Efficient manipulation is critical for parsing, validating, and transforming this data at scale.
- **Key Pattern: Two-Pointer Technique.** This is indispensable for in-place operations, finding pairs, or working with sorted data, all common in route optimization.

<div class="code-group">

```python
# Problem: Remove Duplicates from Sorted Array (LeetCode #26)
# Time: O(n) | Space: O(1)
def removeDuplicates(nums):
    """
    Uses the two-pointer technique to overwrite duplicates in-place.
    `i` is the slow-runner, marking the position of the last unique element.
    `j` is the fast-runner, scanning ahead.
    """
    if not nums:
        return 0

    i = 0  # Pointer for the position of the last unique element
    for j in range(1, len(nums)):  # Pointer scanning the array
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]  # Overwrite the next position with the new unique element
    return i + 1  # Length of the subarray containing unique elements

# Example: nums = [1,1,2,2,3,4,4] -> function modifies nums to [1,2,3,4,...] and returns 4.
```

```javascript
// Problem: Remove Duplicates from Sorted Array (LeetCode #26)
// Time: O(n) | Space: O(1)
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let i = 0; // Pointer for the position of the last unique element
  for (let j = 1; j < nums.length; j++) {
    // Pointer scanning the array
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j]; // Overwrite the next position with the new unique element
    }
  }
  return i + 1; // Length of the subarray containing unique elements
}
// Example: nums = [1,1,2,2,3,4,4] -> function modifies nums to [1,2,3,4,...] and returns 4.
```

```java
// Problem: Remove Duplicates from Sorted Array (LeetCode #26)
// Time: O(n) | Space: O(1)
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;

    int i = 0; // Pointer for the position of the last unique element
    for (int j = 1; j < nums.length; j++) { // Pointer scanning the array
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j]; // Overwrite the next position with the new unique element
        }
    }
    return i + 1; // Length of the subarray containing unique elements
}
// Example: nums = [1,1,2,2,3,4,4] -> function modifies nums to [1,2,3,4,...] and returns 4.
```

</div>

**2. Database (SQL)**

- **Why Delhivery Favors It:** Their business is data-rich. Interviewers test your ability to extract insights from relational schemas representing shipments, hubs, and customer data. You must be comfortable with aggregation, filtering, and joining.
- **Key Pattern: Window Functions & Complex Joins.** These are used for ranking, running totals, and comparing rows within groups—essential for reports like "top-performing hubs" or "late shipments per route."

**3. Recursion & Backtracking**

- **Why Delhivery Favors It:** Many logistics problems involve exploring a set of choices (e.g., assigning packages to routes, sequencing delivery stops) where recursion provides a natural model. It tests your ability to think in terms of states and transitions.
- **Key Pattern: Decision Space Traversal.** Framing the problem as a series of choices and exploring all valid paths is crucial.

<div class="code-group">

```python
# Problem: Subsets (LeetCode #78)
# Time: O(n * 2^n) | Space: O(n) for recursion call stack (excluding output)
def subsets(nums):
    """
    Classic backtracking. At each index, we have a choice: include the element or skip it.
    We explore both choices recursively to generate all possible subsets.
    """
    result = []

    def backtrack(start, current_subset):
        # Append a copy of the current path to the result
        result.append(list(current_subset))

        # Explore further elements to add to the subset
        for i in range(start, len(nums)):
            current_subset.append(nums[i])  # Choose: include nums[i]
            backtrack(i + 1, current_subset) # Explore with this choice
            current_subset.pop()             # Unchoose: backtrack

    backtrack(0, [])
    return result

# Example: nums = [1,2,3] -> result = [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

```javascript
// Problem: Subsets (LeetCode #78)
// Time: O(n * 2^n) | Space: O(n) for recursion call stack (excluding output)
function subsets(nums) {
  const result = [];

  function backtrack(start, currentSubset) {
    // Push a copy of the current path to the result
    result.push([...currentSubset]);

    // Explore further elements to add to the subset
    for (let i = start; i < nums.length; i++) {
      currentSubset.push(nums[i]); // Choose: include nums[i]
      backtrack(i + 1, currentSubset); // Explore with this choice
      currentSubset.pop(); // Unchoose: backtrack
    }
  }

  backtrack(0, []);
  return result;
}
// Example: nums = [1,2,3] -> result = [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

```java
// Problem: Subsets (LeetCode #78)
// Time: O(n * 2^n) | Space: O(n) for recursion call stack (excluding output)
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    // Add a copy of the current path to the result
    result.add(new ArrayList<>(current));

    // Explore further elements to add to the subset
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]); // Choose: include nums[i]
        backtrack(nums, i + 1, current, result); // Explore with this choice
        current.remove(current.size() - 1); // Unchoose: backtrack
    }
}
// Example: nums = [1,2,3] -> result = [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

</div>

**4. Math & Dynamic Programming**

- **Why Delhivery Favors It:** Math underpins optimization—calculating costs, probabilities of delay, or combinatorial ways to load a truck. DP is the tool to solve these optimization problems with overlapping subproblems (e.g., minimizing delivery cost across multiple legs).
- **Key Pattern: State Transition & Memoization.** Defining the state (e.g., `dp[i][j]` = min cost to reach hub `i` with `j` packages) and the recurrence relation is the core skill.

<div class="code-group">

```python
# Problem: Coin Change (LeetCode #322) - A classic DP optimization problem.
# Time: O(amount * n) | Space: O(amount)
def coinChange(coins, amount):
    """
    DP array `dp` where dp[i] = min number of coins to make amount `i`.
    We initialize dp[0] = 0 and the rest to infinity.
    For each amount from 1 to target, we try every coin.
    """
    # Initialize DP array with a value larger than any possible answer (amount+1)
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

    # For each amount from 1 to the target
    for a in range(1, amount + 1):
        # Try using each coin
        for coin in coins:
            if coin <= a:  # Coin can be used for this amount
                # Transition: dp[current_amount] = 1 + dp[current_amount - coin_value]
                dp[a] = min(dp[a], 1 + dp[a - coin])

    # If dp[amount] is still the initial large value, it's impossible
    return dp[amount] if dp[amount] != amount + 1 else -1

# Example: coins = [1,2,5], amount = 11 -> returns 3 (5+5+1)
```

```javascript
// Problem: Coin Change (LeetCode #322) - A classic DP optimization problem.
// Time: O(amount * n) | Space: O(amount)
function coinChange(coins, amount) {
  // Initialize DP array with a value larger than any possible answer (amount+1)
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0; // Base case: 0 coins needed for amount 0

  // For each amount from 1 to the target
  for (let a = 1; a <= amount; a++) {
    // Try using each coin
    for (const coin of coins) {
      if (coin <= a) {
        // Coin can be used for this amount
        // Transition: dp[current_amount] = 1 + dp[current_amount - coin_value]
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }

  // If dp[amount] is still the initial large value, it's impossible
  return dp[amount] !== amount + 1 ? dp[amount] : -1;
}
// Example: coins = [1,2,5], amount = 11 -> returns 3 (5+5+1)
```

```java
// Problem: Coin Change (LeetCode #322) - A classic DP optimization problem.
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // Initialize DP array with a value larger than any possible answer (amount+1)
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0; // Base case: 0 coins needed for amount 0

    // For each amount from 1 to the target
    for (int a = 1; a <= amount; a++) {
        // Try using each coin
        for (int coin : coins) {
            if (coin <= a) { // Coin can be used for this amount
                // Transition: dp[current_amount] = 1 + dp[current_amount - coin_value]
                dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
            }
        }
    }

    // If dp[amount] is still the initial large value, it's impossible
    return dp[amount] != amount + 1 ? dp[amount] : -1;
}
// Example: coins = [1,2,5], amount = 11 -> returns 3 (5+5+1)
```

</div>

## Preparation Strategy

**6-Week Plan (Assume 15-20 hours/week)**

- **Weeks 1-2: Foundation & Core Topics**
  - **Goal:** Achieve fluency in Arrays, Strings, and Recursion.
  - **Action:** Solve 40-50 problems. Focus on patterns: Two-Pointers, Sliding Window, Binary Search for arrays; Backtracking for recursion. Complete all Easy and Medium problems for these topics on CodeJeet's Delhivery list.
- **Week 3: Database & Math**
  - **Goal:** Become proficient in SQL and number theory/combinatorics basics.
  - **Action:** Solve 20-25 SQL problems (focus on joins, aggregation, window functions). Solve 15-20 Math/DP problems, starting with classic DP (Fibonacci, Coin Change, Knapsack).
- **Week 4: Advanced Patterns & Integration**
  - **Goal:** Tackle Hard problems and combine concepts.
  - **Action:** Solve 15-20 problems, focusing on Hard Array/DP/Graph problems from the Delhivery list. Practice explaining your thought process out loud.
- **Week 5: Mock Interviews & Weakness Attack**
  - **Goal:** Simulate real interview conditions.
  - **Action:** Do 4-5 timed mock interviews (mix of Delhivery-specific and general). Revisit all previously incorrect problems.
- **Week 6: Final Review & System Design Prep**
  - **Goal:** Polish and prepare for the system design round.
  - **Action:** Review key problem solutions and complexity analyses. Study 1-2 logistics-adjacent system design topics (e.g., Design a Courier Tracking System, Design an E-commerce Order Fulfillment System).

## Common Mistakes

1.  **Ignoring SQL Prep:** Candidates focus solely on DSA and walk into a surprise SQL question. **Fix:** Dedicate at least one full week to SQL. Practice on platforms that support a real database environment.
2.  **Stopping at a Brute-Force Solution:** Delhivery interviewers expect optimization. If you present an O(n²) solution first, immediately say, "This is a brute-force approach. I think we can optimize it using a hash map to achieve O(n)." **Fix:** Always verbalize the complexity of your first solution and state your intent to optimize.
3.  **Neglecting Edge Cases in Logistics Context:** Forgetting that an array of delivery PIN codes could be empty, or that a distance could be zero, is a red flag. **Fix:** After writing your algorithm, explicitly walk through edge cases: empty input, single element, large values, duplicates, and sorted/unsorted states.
4.  **Under-Communicating the "Why":** Silently coding a DP solution without explaining the state definition and transition will lose you points. **Fix:** Narrate your problem-solving. "I define `dp[i]` as the minimum cost to reach hub `i`. It can be derived from the minimum of `dp[i - distance] + cost` for all previous hubs within range."

## Key Tips

1.  **Start with a Concrete Example:** When given a problem like "optimize delivery routes," immediately frame it with a small, concrete example (e.g., 3 hubs, specific distances). Solve it manually, then generalize your steps into an algorithm. This shows structured thinking.
2.  **Practice Writing SQL on a Plain Text Editor:** You won't have auto-complete in the interview. Get used to writing correct `JOIN`, `GROUP BY`, and `OVER(PARTITION BY...)` syntax from memory.
3.  **For Recursion, Draw the Tree:** If you get stuck on a backtracking problem, ask the interviewer, "Can I draw the decision tree?" Visualizing the recursive calls makes it easier to debug and explain the state space.
4.  **Ask Clarifying Questions About Constraints:** Before coding, always ask: "What is the expected size of the input?" or "Can the tracking ID string contain non-alphanumeric characters?" This demonstrates professional thoroughness.
5.  **Connect Your Solution to Their Business:** In your closing questions or summary, you might note, "This two-pointer approach would be efficient for merging sorted lists of daily shipments from different hubs." It shows you think about application.

Mastering Delhivery's interview is about combining algorithmic rigor with practical, scalable thinking. Focus on depth in their preferred topics, communicate your process clearly, and always drive toward the optimal solution.

[Browse all Delhivery questions on CodeJeet](/company/delhivery)
