---
title: "Amazon vs DoorDash: Interview Question Comparison"
description: "Compare coding interview questions at Amazon and DoorDash — difficulty levels, topic focus, and preparation strategy."
date: "2028-12-12"
category: "tips"
tags: ["amazon", "doordash", "comparison"]
---

# Amazon vs DoorDash: Interview Question Comparison

If you're interviewing at both Amazon and DoorDash, you're facing two distinct beasts in the tech landscape. One is a retail and cloud behemoth with a famously vast, standardized question bank. The other is a logistics-focused platform with a smaller, more operationally-driven set of problems. Preparing for both simultaneously is less about doubling your workload and more about smartly mapping the overlapping terrain and then branching out to company-specific frontiers. The core insight? A solid foundation in arrays, strings, and hash tables will serve you tremendously for both, but your depth of study and peripheral topics will need to diverge.

## Question Volume and Difficulty: A Tale of Two Scales

The raw numbers tell a stark story. Amazon's tagged LeetCode questions number **1,938**, dwarfing DoorDash's **87**. This isn't just a difference in quantity; it signals a fundamental difference in interview philosophy and what you're up against.

**Amazon's** distribution (530 Easy, 1057 Medium, 351 Hard) reveals their process: it's a broad, well-trodden machine. With thousands of interviews conducted monthly, they have a massive, recycled question bank. Your odds of getting a completely novel, unseen problem are low if you've prepared extensively. However, the volume means you must prepare for _breadth_. You might see a classic like "Two Sum" or a complex DP problem; the spread is wide. The high Medium count is the key—this is the heart of their technical screen.

**DoorDash's** numbers (6 Easy, 51 Medium, 30 Hard) point to a more curated, intense experience. The near absence of Easy questions suggests they skip the warm-ups. The interview jumps quickly into substantive problem-solving. The high Hard-to-Total ratio (~34%) is significantly higher than Amazon's (~18%), indicating that for the questions they _do_ ask, they favor depth and complexity, often related to real-world logistics, scheduling, and state management. Their list is smaller because their problems are often more bespoke or deeply tied to their domain.

**Implication:** For Amazon, you run a marathon across a wide field. For DoorDash, you prepare for a series of deep, challenging sprints.

## Topic Overlap: Your Foundation for Both

Both companies heavily test **Array**, **String**, and **Hash Table** manipulations. This trio forms the absolute core of shared preparation. These are not just simple topics; they are the building blocks for most algorithms. At Amazon, a string question might be about parsing and transformation. At DoorDash, it might involve manipulating delivery addresses or time windows. The underlying skills—two-pointer techniques, sliding windows, character counting with hash maps—are identical.

The key divergence appears in their secondary focuses:

- **Amazon** heavily emphasizes **Dynamic Programming**. This is a staple for them, testing your ability to break down complex problems and optimize overlapping subproblems. It's a must-know area.
- **DoorDash** shows a distinct emphasis on **Depth-First Search** (and by extension, general graph traversal). This makes intuitive sense for a company mapping deliveries, routes, and dependencies between tasks. You should be equally comfortable with BFS, but DFS is explicitly called out.

Think of it this way: The shared core (Array, String, Hash Table) is your universal toolkit. For Amazon, you add a specialized DP wrench. For DoorDash, you add a graph traversal screwdriver.

## Preparation Priority Matrix

Maximize your return on study time by following this priority order:

1.  **Overlap Core (Study First - Highest ROI):**
    - **Topics:** Array, String, Hash Table.
    - **Skills:** Two-pointers, Sliding Window, Prefix Sum, Hashing for lookups and counts.
    - **Sample Problems Useful for Both:**
      - **Two Sum (#1):** The quintessential hash map problem.
      - **Longest Substring Without Repeating Characters (#3):** Classic sliding window/hash map.
      - **Merge Intervals (#56):** Extremely common pattern for both companies (scheduling meetings, merging delivery time windows).

2.  **Amazon-Only Priority:**
    - **Topic:** Dynamic Programming.
    - **Focus:** Start with 1D DP (Climbing Stairs #70, Coin Change #322), then move to 2D DP (Longest Common Subsequence #1143, Edit Distance #72). Don't neglect DP on strings.

3.  **DoorDash-Only Priority:**
    - **Topic:** Depth-First Search / Graph Traversal.
    - **Focus:** Graph representation, cycle detection, topological sort (Course Schedule #207), and DFS on matrices (Number of Islands #200). Problems involving trees are also fair game.

## Interview Format Differences

**Amazon** follows the highly structured "Loop." You'll typically have 3-4 60-minute back-to-back interviews in one day (virtual or on-site). Each session is divided roughly into:

- **5-10 mins:** Brief intro and behavioral question(s) based on their Leadership Principles.
- **40-45 mins:** One or two coding problems on a shared editor. The interviewer has a rubric.
- **5-10 mins:** Your questions for them.
  The behavioral component is **critical** and weighted as heavily as the coding. For SDE II and above, one round will be a **System Design** interview (e.g., design a parking lot, a notification system).

**DoorDash**'s process is generally leaner but intense. After a recruiter screen, you can expect:

- **Technical Phone Screen:** 45-60 minutes, often one meaty Medium/Hard problem.
- **Virtual On-Site:** 3-4 rounds of 45-60 minutes each. These rounds are almost purely technical and problem-solving focused, with less rigid time devoted to behavioral questions (though culture fit is assessed throughout). Problems are more likely to be multi-part, building in complexity. For senior roles, a **System Design** round focusing on scalable, real-time systems (e.g., design DoorDash's dispatch system) is standard.

## Specific Problem Recommendations for Dual Preparation

Here are 3-5 problems that efficiently build skills applicable to both companies:

1.  **Merge Intervals (#56):** This pattern is ubiquitous. Amazon might use it for optimizing server usage; DoorDash for consolidating delivery windows. It teaches sorting and managing ranges—a fundamental skill.
2.  **LRU Cache (#146):** A perfect blend of design and algorithm. It tests your understanding of hash tables and linked lists. Amazon loves it for system fundamentals; DoorDash might relate it to caching delivery data.
3.  **Word Break (#139):** A fantastic bridge problem. It can be solved with DFS/backtracking (relevant to DoorDash's graph focus) but has a more optimal Dynamic Programming solution (relevant to Amazon's DP focus). Studying both approaches is a huge win.
4.  **Number of Islands (#200):** The canonical DFS/BFS on a matrix problem. Essential for DoorDash's stated focus, but also a very common Amazon question. It's a must-know graph traversal technique.
5.  **Longest Palindromic Substring (#5):** Excellent for practicing 2D array manipulation and expanding from a center point. It touches strings, arrays, and has a DP solution, hitting multiple core and Amazon-specific areas.

<div class="code-group">

```python
# Example: Two-Pointer approach for Longest Palindromic Substring (#5)
# Time: O(n^2) | Space: O(1)
class Solution:
    def longestPalindrome(self, s: str) -> str:
        def expand_around_center(left: int, right: int) -> str:
            # Expand outwards while the substring is a palindrome
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            # Return the palindrome found (note: left, right are one step beyond)
            return s[left + 1:right]

        longest = ""
        for i in range(len(s)):
            # Check for odd-length palindromes (single character center)
            odd_pal = expand_around_center(i, i)
            # Check for even-length palindromes (two character center)
            even_pal = expand_around_center(i, i + 1)

            # Update the longest palindrome found
            if len(odd_pal) > len(longest):
                longest = odd_pal
            if len(even_pal) > len(longest):
                longest = even_pal
        return longest
```

```javascript
// Time: O(n^2) | Space: O(1)
function longestPalindrome(s) {
  const expandAroundCenter = (left, right) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return s.substring(left + 1, right);
  };

  let longest = "";
  for (let i = 0; i < s.length; i++) {
    const oddPal = expandAroundCenter(i, i);
    const evenPal = expandAroundCenter(i, i + 1);

    if (oddPal.length > longest.length) longest = oddPal;
    if (evenPal.length > longest.length) longest = evenPal;
  }
  return longest;
}
```

```java
// Time: O(n^2) | Space: O(1)
public class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";

        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);     // odd length
            int len2 = expandAroundCenter(s, i, i + 1); // even length
            int len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }

    private int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1; // length of the palindrome
    }
}
```

</div>

## Which to Prepare for First?

The strategic choice depends on your interview timeline, but here's the logic: **Prepare for DoorDash first.**

Why? DoorDash's focused, harder problem set will force you to build deep problem-solving skills and mastery in graph algorithms. This creates a high ceiling of competency. Once you have that depth, transitioning to Amazon's preparation is largely about _broadening_ your knowledge—practicing a wider variety of problems, especially Dynamic Programming, and integrating the extensive behavioral preparation around Leadership Principles. It's easier to go from deep, focused practice to broad practice than the other way around. If you only prepare broadly for Amazon, you might be caught off guard by the depth and domain-specific nuance of a DoorDash Hard problem.

Start with the shared core, then dive into DoorDash's graph/DFS focus and complex problem-solving. Finally, widen your scope to Amazon's DP and larger question bank while drilling behavioral stories. This path builds the most robust and transferable skill set.

For further company-specific details, visit the CodeJeet pages for [Amazon](/company/amazon) and [DoorDash](/company/doordash).
