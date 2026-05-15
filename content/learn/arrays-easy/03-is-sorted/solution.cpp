#include <iostream>
#include <vector>
using namespace std;

bool isSorted(const vector<int>& a) {
    for (size_t i = 1; i < a.size(); i++) {
        if (a[i - 1] > a[i]) return false;
    }
    return true;
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << (isSorted(a) ? "true" : "false") << "\n";
    return 0;
}
