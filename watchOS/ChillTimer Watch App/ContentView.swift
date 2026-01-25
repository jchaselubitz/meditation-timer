import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = TimerViewModel()
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Timer Screen (main screen)
            TimerView(viewModel: viewModel)
                .tag(0)

            // Settings Screen
            SettingsView(viewModel: viewModel)
                .tag(1)
        }
        .tabViewStyle(.page(indexDisplayMode: .automatic))
        .background(AppColors.background)
    }
}

#Preview {
    ContentView()
}
