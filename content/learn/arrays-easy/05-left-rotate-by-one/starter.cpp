#include <iostream>
#include <vector>
using namespace std;

void leftRotateByOne(vector<int>& a) {
    // TODO: rotate a left by one position in place.
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    leftRotateByOne(a);
    for (int i = 0; i < n; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n";
    return 0;
}
