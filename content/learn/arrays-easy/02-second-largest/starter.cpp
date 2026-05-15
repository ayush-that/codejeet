#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int secondLargest(const vector<int>& a) {
    // TODO: return the second largest *distinct* value, or -1 if it doesn't exist.
    return -1;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << secondLargest(a) << "\n";
    return 0;
}
