import SwiftUI
import WatchKit

struct TimerView: View {
    @ObservedObject var viewModel: TimerViewModel

    private let tickCount = 60

    var body: some View {
        GeometryReader { geometry in
            let size = min(geometry.size.width, geometry.size.height)
            let timerSize = size * 0.88

            ZStack {
                // Background
                AppColors.background
                    .ignoresSafeArea()

                // Timer Circle - tap to start/pause
                ZStack {
                    // Glow effect
                    Circle()
                        .fill(viewModel.isOvertime ? AppColors.overtime.opacity(0.3) : AppColors.primaryMuted)
                        .frame(width: timerSize + 8, height: timerSize + 8)
                        .blur(radius: 4)

                    // Main timer circle with gradient
                    Circle()
                        .fill(gradientForState)
                        .frame(width: timerSize, height: timerSize)
                        .overlay(
                            // Wave overlay at bottom
                            WaveOverlay(size: timerSize)
                                .clipShape(Circle())
                        )

                    // Tick marks
                    TickMarks(
                        count: tickCount,
                        progress: viewModel.progress,
                        isOvertime: viewModel.isOvertime,
                        size: timerSize
                    )

                    // Timer text and action indicator
                    VStack(spacing: 2) {
                        Text(viewModel.statusText)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(AppColors.text.opacity(0.8))
                            .textCase(.uppercase)
                            .tracking(1)

                        Text(viewModel.isOvertime ? "+\(viewModel.formattedTime)" : viewModel.formattedTime)
                            .font(.system(size: size * 0.20, weight: .ultraLight))
                            .foregroundColor(AppColors.text)
                            .monospacedDigit()
                            .shadow(color: .black.opacity(0.3), radius: 2, y: 1)

                        // Action icon indicator (play/pause only)
                        Image(systemName: actionIcon)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(AppColors.text.opacity(0.9))
                            .padding(.top, 2)
                    }
                }
                .onTapGesture {
                    handleTimerTap()
                }

                // Bottom corner buttons (only when timer is active)
                if viewModel.timerState != .idle {
                    VStack {
                        Spacer()
                        HStack {
                            // Reset button (bottom left)
                            Button(action: {
                                WKInterfaceDevice.current().play(.click)
                                viewModel.resetTimer()
                            }) {
                                Image(systemName: "arrow.counterclockwise")
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(AppColors.text.opacity(0.9))
                            }
                            .buttonStyle(.plain)
                            .frame(width: 32, height: 32)
                            .background(AppColors.surface.opacity(0.8))
                            .clipShape(Circle())

                            Spacer()

                            // Stop button (bottom right) - saves to HealthKit
                            Button(action: {
                                WKInterfaceDevice.current().play(.click)
                                viewModel.stopTimer()
                            }) {
                                Image(systemName: "stop.fill")
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(AppColors.text.opacity(0.9))
                            }
                            .buttonStyle(.plain)
                            .frame(width: 32, height: 32)
                            .background(AppColors.surface.opacity(0.8))
                            .clipShape(Circle())
                        }
                        .padding(.horizontal, 8)
                        .padding(.bottom, 4)
                    }
                }
            }
        }
    }

    // MARK: - Computed Properties
    private var gradientForState: LinearGradient {
        if viewModel.isOvertime {
            return AppGradients.timerOvertime
        } else if viewModel.timerState == .running {
            return AppGradients.timerActive
        } else if viewModel.timerState == .paused {
            return AppGradients.sunsetSimple
        } else {
            return AppGradients.sunsetSimple
        }
    }

    private var actionIcon: String {
        switch viewModel.timerState {
        case .idle:
            return "play.fill"
        case .running, .overtime:
            return "pause.fill"
        case .paused:
            return "play.fill"
        }
    }

    // MARK: - Actions
    private func handleTimerTap() {
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

// MARK: - Tick Marks Component
struct TickMarks: View {
    let count: Int
    let progress: Double
    let isOvertime: Bool
    let size: CGFloat

    var body: some View {
        ZStack {
            ForEach(0..<count, id: \.self) { index in
                let angle = Double(index) * (360.0 / Double(count)) - 90
                let radians = angle * .pi / 180
                let radius = size / 2 - 10
                let x = cos(radians) * radius
                let y = sin(radians) * radius

                let tickProgress = Double(index) / Double(count)
                let isActive = tickProgress < progress

                let isMajorTick = index % 5 == 0

                Rectangle()
                    .fill(tickColor(isActive: isActive))
                    .frame(width: isMajorTick ? 3 : 2, height: isMajorTick ? 8 : 5)
                    .opacity(isActive ? 0.95 : 0.4)
                    .rotationEffect(.degrees(angle + 90))
                    .offset(x: x, y: y)
            }
        }
    }

    private func tickColor(isActive: Bool) -> Color {
        if isActive && isOvertime {
            return AppColors.overtime
        } else if isActive {
            return AppColors.text
        } else {
            return AppColors.textDark
        }
    }
}

// MARK: - Wave Overlay Component
struct WaveOverlay: View {
    let size: CGFloat

    var body: some View {
        GeometryReader { geometry in
            VStack {
                Spacer()
                AppGradients.waterDeep
                    .frame(height: size * 0.40)
                    .clipShape(
                        WaveShape()
                    )
            }
        }
    }
}

// MARK: - Wave Shape
struct WaveShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()

        let startX = rect.minX
        let startY = rect.minY + rect.height * 0.3

        path.move(to: CGPoint(x: startX, y: startY))

        // Create wave curve at top
        path.addQuadCurve(
            to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.15),
            control: CGPoint(x: rect.midX, y: rect.minY)
        )

        // Complete the rectangle
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()

        return path
    }
}

#Preview {
    TimerView(viewModel: TimerViewModel())
}
