---
title: "Goldman Sachs vs eBay: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and eBay — difficulty levels, topic focus, and preparation strategy."
date: "2028-03-01"
category: "tips"
tags: ["goldman-sachs", "ebay", "comparison"]
---

# Goldman Sachs vs eBay: Interview Question Comparison

Preparing for technical interviews requires understanding what each company prioritizes. Goldman Sachs and eBay both test core data structures and algorithms, but their approach differs significantly in volume, difficulty, and focus. This comparison analyzes their question banks to help you strategize your preparation.

## Question Volume and Difficulty

Goldman Sachs presents a much larger and more challenging problem set. With 270 questions categorized as Easy (51), Medium (171), and Hard (48), the sheer volume indicates a broad and deep assessment. The high proportion of Medium and Hard questions (over 80% combined) suggests interviews will test not just implementation but optimization and complex problem-solving under constraints.

eBay's question bank is more focused, with 60 total questions: Easy (12), Medium (38), and Hard (10). While still challenging, the distribution is more typical, with Medium questions constituting the majority. The smaller volume implies a more targeted interview, potentially focusing on a candidate's ability to cleanly solve common problems rather than tackle a wide array of complex edge cases.

**Key Takeaway:** Goldman Sachs preparation is a marathon requiring endurance across many difficult problems. eBay preparation is a sprint focused on mastering a core set of concepts to a high standard.

## Topic Overlap

Both companies heavily emphasize **Array**, **String**, and **Hash Table** problems. These form the foundation of their interviews. Mastery here is non-negotiable for either company.

The critical difference is the fourth topic: **Dynamic Programming (DP)** for Goldman Sachs versus **Sorting** for eBay.

Goldman Sachs's inclusion of DP as a top category signals an expectation to handle advanced optimization problems, often involving recursion, memoization, or tabulation. eBay's focus on Sorting suggests a greater emphasis on foundational algorithm knowledge, data manipulation, and efficiency in organizing data.

A question highlighting this difference might be:

<div class="code-group">

```python
# Goldman Sachs-style: Dynamic Programming (Climbing Stairs)
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```javascript
// eBay-style: Sorting & Array Manipulation (Merge Intervals)
function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}
```

```java
// Illustrating both: DP for GS, Sorting for eBay
public class Comparison {
    // Goldman Sachs DP example
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1; dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }

    // eBay Sorting example
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);
        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            int[] curr = intervals[i];
            if (curr[0] <= last[1]) {
                last[1] = Math.max(last[1], curr[1]);
            } else {
                merged.add(curr);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}
```

</div>

## Which to Prepare for First

Prepare for **eBay first**. Its focused question bank on core topics (Array, String, Hash Table, Sorting) builds the essential foundation required for any technical interview, including Goldman Sachs. Achieving fluency here will make you proficient in a high percentage of common interview questions. You can reach a strong baseline level of readiness more quickly.

Then, transition to **Goldman Sachs** preparation. This involves scaling up your practice volume and diving deep into Dynamic Programming and other advanced patterns. The skills built for eBay will directly apply to many of Goldman's problems, allowing you to concentrate your additional effort on conquering the Hard problems and DP-specific patterns that are Goldman's differentiator.

In summary, use eBay's focused scope to build your core competency efficiently. Use Goldman Sachs's extensive and difficult bank to stress-test and expand that competency to an elite level.

For further details, explore the specific question lists: [Goldman Sachs](/company/goldman-sachs) and [eBay](/company/ebay).
