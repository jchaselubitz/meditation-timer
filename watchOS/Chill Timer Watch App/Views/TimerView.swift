import SwiftUI
import WatchKit

struct TimerView: View {
    @ObservedObject var viewModel: TimerViewModel

    var body: some View {
        GeometryReader { geometry in
            let size = min(geometry.size.width, geometry.size.height)
            let buttonSize: CGFloat = 52

            ZStack {
                // Background
                AppColors.background
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    Spacer()
                        .frame(height: 8)

                    // Status text
                    Text(viewModel.statusText)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(AppColors.textMuted)
                        .textCase(.uppercase)
                        .tracking(1.5)

                    // Digital timer display
                    Text(viewModel.isOvertime ? "+\(viewModel.formattedTime)" : viewModel.formattedTime)
                        .font(.system(size: size * 0.30, weight: .light, design: .rounded))
                        .foregroundColor(viewModel.isOvertime ? AppColors.overtime : AppColors.text)
                        .monospacedDigit()
                        .contentTransition(.numericText())
                        .padding(.top, 4)

                    Spacer()

                    // Button row
                    HStack(spacing: 20) {
                        // Stop/Reset button
                        CircleButton(
                            icon: stopResetIcon,
                            size: buttonSize,
                            isEnabled: viewModel.timerState != .idle,
                            action: handleStopReset
                        )

                        // Play/Pause button
                        CircleButton(
                            icon: playPauseIcon,
                            size: buttonSize,
                            isPrimary: true,
                            action: handlePlayPause
                        )
                    }
                    .padding(.bottom, 12)
                }
            }
        }
    }

    // MARK: - Computed Properties
    private var stopResetIcon: String {
        switch viewModel.timerState {
        case .idle:
            return "stop.fill"
        case .running, .overtime:
            return "stop.fill"
        case .paused:
            return "arrow.counterclockwise"
        }
    }

    private var playPauseIcon: String {
        switch viewModel.timerState {
        case .idle, .paused:
            return "play.fill"
        case .running, .overtime:
            return "pause.fill"
        }
    }

    // MARK: - Actions
    private func handleStopReset() {
        WKInterfaceDevice.current().play(.click)

        switch viewModel.timerState {
        case .idle:
            // Already stopped, do nothing
            return
        case .running, .overtime:
            // Stop and save to HealthKit
            viewModel.stopTimer()
        case .paused:
            // Reset without saving
            viewModel.resetTimer()
        }
    }

    private func handlePlayPause() {
        WKInterfaceDevice.current().play(.click)

        switch viewModel.timerState {
        case .idle:
            viewModel.startTimer()
        case .running, .overtime:
            viewModel.pauseTimer()
        case .paused:
            viewModel.resumeTimer()
        }
    }
}

// MARK: - Circle Button Component
struct CircleButton: View {
    let icon: String
    let size: CGFloat
    var isPrimary: Bool = false
    var isEnabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: size * 0.38, weight: .semibold))
                .foregroundColor(AppColors.text)
                .frame(width: size, height: size)
                .background(backgroundColor)
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
        .disabled(!isEnabled)
        .opacity(isEnabled ? 1.0 : 0.4)
    }

    private var backgroundColor: Color {
        isPrimary ? AppColors.primary : AppColors.surface
    }
}

#Preview {
    TimerView(viewModel: TimerViewModel())
}
