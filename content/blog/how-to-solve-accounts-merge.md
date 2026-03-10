---
title: "How to Solve Accounts Merge — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Accounts Merge. Medium difficulty, 60.9% acceptance rate. Topics: Array, Hash Table, String, Depth-First Search, Breadth-First Search."
date: "2027-03-03"
category: "dsa-patterns"
tags: ["accounts-merge", "array", "hash-table", "string", "medium"]
---

# How to Solve Accounts Merge

You're given a list of accounts where each account has a name followed by email addresses. Two accounts belong to the same person if they share at least one email address. Your task is to merge all accounts that belong to the same person and return them sorted with unique emails.

What makes this problem interesting is that it's fundamentally about finding connected components in a graph, but the connections aren't explicitly given. You need to build the graph from the email relationships and then traverse it to find which accounts should be merged together.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
accounts = [
    ["John", "john1@mail.com", "john2@mail.com"],
    ["John", "john3@mail.com", "john1@mail.com"],
    ["Mary", "mary@mail.com"],
    ["John", "john4@mail.com", "john5@mail.com"],
    ["John", "john5@mail.com", "john6@mail.com"]
]
```

**Step-by-step reasoning:**

1. **First account:** John with emails john1@mail.com and john2@mail.com
   - These two emails are connected (belong to the same person)

2. **Second account:** John with emails john3@mail.com and john1@mail.com
   - john1@mail.com connects this account to the first account
   - So all emails from both accounts belong to the same John

3. **Third account:** Mary with email mary@mail.com
   - No connection to any John emails, so this stays separate

4. **Fourth account:** John with emails john4@mail.com and john5@mail.com
   - No connection to previous John emails yet

5. **Fifth account:** John with emails john5@mail.com and john6@mail.com
   - john5@mail.com connects this to the fourth account
   - So john4@mail.com, john5@mail.com, and john6@mail.com belong together

**Final merged accounts:**

```
[
    ["John", "john1@mail.com", "john2@mail.com", "john3@mail.com"],
    ["Mary", "mary@mail.com"],
    ["John", "john4@mail.com", "john5@mail.com", "john6@mail.com"]
]
```

Notice we have two different Johns because they don't share any emails. The name alone doesn't determine if accounts belong to the same person.

## Brute Force Approach

A naive approach would be to compare every pair of accounts to check if they share any emails. For each pair that shares an email, merge them. Repeat this process until no more merges are possible.

**Why this fails:**

1. **Time complexity is terrible:** O(n² × m²) where n is number of accounts and m is average emails per account. For each pair of accounts (n²), we need to check all email pairs (m²).
2. **Merging is inefficient:** After finding two accounts to merge, you need to update all other accounts that might be connected through the newly merged account.
3. **Handling transitive connections is messy:** If A connects to B, and B connects to C, then A, B, and C should all be merged. The brute force approach would need multiple passes to catch these transitive relationships.

The key insight is that this is a **graph connectivity problem**. Each email is a node, and emails from the same account are connected edges. Accounts that share emails are connected components in this graph.

## Optimized Approach

The optimal solution uses **Union-Find (Disjoint Set Union)** or **DFS** to find connected components. Here's the step-by-step reasoning:

1. **Build an email-to-account mapping:** For each email, track which account(s) it appears in. This helps us find connections between accounts.

2. **Build a graph of email connections:** For each account, connect all emails in that account together. If an account has emails [A, B, C], then A is connected to B, B to C, and A to C (transitively).

3. **Find connected components:** Use DFS or Union-Find to find all emails that are connected to each other. Each connected component represents one person.

4. **Reconstruct the merged accounts:** For each connected component, get the name from any account in that component (they should all have the same name), sort the emails, and add the name at the beginning.

**Why Union-Find works well:**

- It efficiently handles merging sets as we discover connections
- The amortized time complexity is nearly O(1) for union and find operations
- It naturally handles transitive relationships (if A connects to B and B to C, then A, B, and C end up in the same set)

## Optimal Solution

Here's the complete solution using Union-Find:

<div class="code-group">

```python
# Time: O(n * m * α(n)) where n is number of accounts, m is average emails per account
# Space: O(n * m) for storing all emails and Union-Find structures
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression: make parent of x point to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree under larger tree
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

def accountsMerge(accounts):
    """
    Merge accounts based on shared email addresses.

    Args:
        accounts: List of lists where each inner list has name followed by emails

    Returns:
        List of merged accounts with sorted unique emails
    """
    # Step 1: Create mapping from email to index (for Union-Find)
    email_to_id = {}
    email_to_name = {}

    # Assign unique ID to each email
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            if email not in email_to_id:
                email_id = len(email_to_id)
                email_to_id[email] = email_id
                email_to_name[email] = name

    # Step 2: Initialize Union-Find for all emails
    uf = UnionFind(len(email_to_id))

    # Step 3: Union all emails within the same account
    for account in accounts:
        # Get the first email in this account
        first_email = account[1]
        first_id = email_to_id[first_email]

        # Union this email with all other emails in the same account
        for email in account[2:]:
            email_id = email_to_id[email]
            uf.union(first_id, email_id)

    # Step 4: Group emails by their root parent
    root_to_emails = {}
    for email, email_id in email_to_id.items():
        root = uf.find(email_id)
        if root not in root_to_emails:
            root_to_emails[root] = []
        root_to_emails[root].append(email)

    # Step 5: Build the result
    result = []
    for emails in root_to_emails.values():
        # Sort emails and get name from first email
        emails.sort()
        name = email_to_name[emails[0]]
        result.append([name] + emails)

    return result
```

```javascript
// Time: O(n * m * α(n)) where n is number of accounts, m is average emails per account
// Space: O(n * m) for storing all emails and Union-Find structures
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(0);

    // Initialize each element as its own parent
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }

  find(x) {
    // Path compression: make parent point to root
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank: attach smaller tree under larger tree
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }
}

function accountsMerge(accounts) {
  /**
   * Merge accounts based on shared email addresses.
   *
   * @param {string[][]} accounts - Array of accounts where each account has name followed by emails
   * @return {string[][]} Merged accounts with sorted unique emails
   */

  // Step 1: Create mapping from email to index (for Union-Find)
  const emailToId = new Map();
  const emailToName = new Map();
  let id = 0;

  // Assign unique ID to each email
  for (const account of accounts) {
    const name = account[0];
    for (let i = 1; i < account.length; i++) {
      const email = account[i];
      if (!emailToId.has(email)) {
        emailToId.set(email, id++);
        emailToName.set(email, name);
      }
    }
  }

  // Step 2: Initialize Union-Find for all emails
  const uf = new UnionFind(emailToId.size);

  // Step 3: Union all emails within the same account
  for (const account of accounts) {
    // Get the first email in this account
    const firstEmail = account[1];
    const firstId = emailToId.get(firstEmail);

    // Union this email with all other emails in the same account
    for (let i = 2; i < account.length; i++) {
      const email = account[i];
      const emailId = emailToId.get(email);
      uf.union(firstId, emailId);
    }
  }

  // Step 4: Group emails by their root parent
  const rootToEmails = new Map();
  for (const [email, emailId] of emailToId) {
    const root = uf.find(emailId);
    if (!rootToEmails.has(root)) {
      rootToEmails.set(root, []);
    }
    rootToEmails.get(root).push(email);
  }

  // Step 5: Build the result
  const result = [];
  for (const emails of rootToEmails.values()) {
    // Sort emails and get name from first email
    emails.sort();
    const name = emailToName.get(emails[0]);
    result.push([name, ...emails]);
  }

  return result;
}
```

```java
// Time: O(n * m * α(n)) where n is number of accounts, m is average emails per account
// Space: O(n * m) for storing all emails and Union-Find structures
import java.util.*;

class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];

        // Initialize each element as its own parent
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression: make parent point to root
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank: attach smaller tree under larger tree
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}

class Solution {
    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        /**
         * Merge accounts based on shared email addresses.
         *
         * @param accounts List of accounts where each account has name followed by emails
         * @return Merged accounts with sorted unique emails
         */

        // Step 1: Create mapping from email to index (for Union-Find)
        Map<String, Integer> emailToId = new HashMap<>();
        Map<String, String> emailToName = new HashMap<>();
        int id = 0;

        // Assign unique ID to each email
        for (List<String> account : accounts) {
            String name = account.get(0);
            for (int i = 1; i < account.size(); i++) {
                String email = account.get(i);
                if (!emailToId.containsKey(email)) {
                    emailToId.put(email, id++);
                    emailToName.put(email, name);
                }
            }
        }

        // Step 2: Initialize Union-Find for all emails
        UnionFind uf = new UnionFind(emailToId.size());

        // Step 3: Union all emails within the same account
        for (List<String> account : accounts) {
            // Get the first email in this account
            String firstEmail = account.get(1);
            int firstId = emailToId.get(firstEmail);

            // Union this email with all other emails in the same account
            for (int i = 2; i < account.size(); i++) {
                String email = account.get(i);
                int emailId = emailToId.get(email);
                uf.union(firstId, emailId);
            }
        }

        // Step 4: Group emails by their root parent
        Map<Integer, List<String>> rootToEmails = new HashMap<>();
        for (String email : emailToId.keySet()) {
            int emailId = emailToId.get(email);
            int root = uf.find(emailId);

            rootToEmails.putIfAbsent(root, new ArrayList<>());
            rootToEmails.get(root).add(email);
        }

        // Step 5: Build the result
        List<List<String>> result = new ArrayList<>();
        for (List<String> emails : rootToEmails.values()) {
            // Sort emails and get name from first email
            Collections.sort(emails);
            String name = emailToName.get(emails.get(0));

            List<String> mergedAccount = new ArrayList<>();
            mergedAccount.add(name);
            mergedAccount.addAll(emails);

            result.add(mergedAccount);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m × α(n))**

- `n` = number of accounts
- `m` = average number of emails per account
- `α(n)` = inverse Ackermann function (very slow growing, effectively constant)

**Breakdown:**

1. Building email mappings: O(n × m)
2. Union operations within each account: O(n × m × α(n))
3. Finding roots for all emails: O(n × m × α(n))
4. Sorting emails in each component: O(k log k) where k is total emails

**Space Complexity: O(n × m)**

- Storing all emails in mappings: O(n × m)
- Union-Find data structures: O(n × m)
- Result storage: O(n × m)

## Common Mistakes

1. **Assuming same name means same person:** This is the most common mistake. Remember that two people can have the same name but different email accounts. Only shared emails indicate the same person.

2. **Not handling transitive connections:** If A shares with B, and B shares with C, then A, B, and C should all be merged. A naive approach might only merge A with B and B with C separately, missing the A-C connection.

3. **Forgetting to sort emails:** The problem requires emails to be sorted in ascending order. Always remember to sort the emails before adding them to the result.

4. **Not using path compression or union by rank:** Without these optimizations, Union-Find can degrade to O(n) per operation instead of O(α(n)). Always implement both optimizations.

5. **Incorrectly handling duplicate emails within an account:** The same email might appear multiple times in the same account. Make sure to handle duplicates by using sets or checking before adding.

## When You'll See This Pattern

The core pattern here is **finding connected components in an implicit graph**. You'll see this pattern in problems where:

1. **Elements have relationships that need to be grouped:** Like "Redundant Connection" where you need to find which edge creates a cycle in a graph.

2. **Transitive relationships matter:** Like "Sentence Similarity II" where if A is similar to B and B is similar to C, then A is similar to C.

3. **You need to merge sets based on shared properties:** Any problem where you start with individual elements and need to merge them into groups based on some relationship.

**Related problems:**

- **Redundant Connection:** Uses Union-Find to detect cycles in a graph
- **Sentence Similarity II:** Uses Union-Find to handle transitive similarity relationships
- **Number of Provinces:** Another connected components problem using Union-Find or DFS

## Key Takeaways

1. **Recognize connected components problems:** When you need to group elements based on relationships (especially transitive relationships), think about graph connectivity and Union-Find.

2. **Build the graph implicitly:** Sometimes the graph isn't given directly. You need to create nodes from your data and connect them based on the problem's rules.

3. **Union-Find is your friend for merging sets:** When you need to repeatedly merge sets and check if elements are in the same set, Union-Find with path compression and union by rank is optimal.

4. **Always validate with edge cases:** Test with same names but different people, single email accounts, accounts with many emails, and accounts that create long chains of connections.

Related problems: [Redundant Connection](/problem/redundant-connection), [Sentence Similarity](/problem/sentence-similarity), [Sentence Similarity II](/problem/sentence-similarity-ii)
