#include <iostream>
#include <vector>
using namespace std;

bool isSorted(const vector<int>& a) {
    // TODO: return true iff a is non-decreasing.
    return false;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << (isSorted(a) ? "true" : "false") << "\n";
    return 0;
}
