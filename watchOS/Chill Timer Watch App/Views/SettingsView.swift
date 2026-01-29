import SwiftUI
import WatchKit

struct SettingsView: View {
    @ObservedObject var viewModel: TimerViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                // Duration Section
                VStack(spacing: 8) {
                    Text("DURATION")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(AppColors.textMuted)
                        .tracking(2)

                    // Duration display with +/- buttons
                    HStack(spacing: 12) {
                        Button(action: decrementDuration) {
                            Image(systemName: "minus.circle.fill")
                                .font(.system(size: 28))
                                .foregroundColor(AppColors.waterLight)
                        }
                        .buttonStyle(.plain)

                        VStack(spacing: 0) {
                            Text("\(viewModel.durationMinutes)")
                                .font(.system(size: 36, weight: .light))
                                .foregroundColor(AppColors.text)
                                .monospacedDigit()
                            Text("min")
                                .font(.system(size: 11))
                                .foregroundColor(AppColors.textMuted)
                        }
                        .frame(minWidth: 60)

                        Button(action: incrementDuration) {
                            Image(systemName: "plus.circle.fill")
                                .font(.system(size: 28))
                                .foregroundColor(AppColors.waterLight)
                        }
                        .buttonStyle(.plain)
                    }

                    // Preset buttons
                    PresetButtonsView(
                        presets: viewModel.presetDurations,
                        selected: viewModel.durationMinutes,
                        onSelect: { viewModel.durationMinutes = $0 }
                    )
                }
                .padding(.vertical, 12)
                .padding(.horizontal, 8)
                .background(AppColors.surface)
                .cornerRadius(12)

                // Volume Section
                VStack(spacing: 8) {
                    Text("GONG VOLUME")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(AppColors.textMuted)
                        .tracking(2)

                    HStack(spacing: 8) {
                        Image(systemName: "speaker.fill")
                            .font(.system(size: 12))
                            .foregroundColor(AppColors.textDark)

                        VolumeSliderView(volume: $viewModel.gongVolume)

                        Image(systemName: "speaker.wave.3.fill")
                            .font(.system(size: 12))
                            .foregroundColor(AppColors.textDark)
                    }

                    Text("\(Int(viewModel.gongVolume * 100))%")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(AppColors.accent)
                }
                .padding(.vertical, 12)
                .padding(.horizontal, 8)
                .background(AppColors.surface)
                .cornerRadius(12)

                // Haptic Only Section
                VStack(spacing: 8) {
                    Toggle(isOn: $viewModel.hapticOnly) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Silent Mode")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(AppColors.text)
                            Text("Gentle vibrations only")
                                .font(.system(size: 10))
                                .foregroundColor(AppColors.textMuted)
                        }
                    }
                    .tint(AppColors.accent)
                    .onChange(of: viewModel.hapticOnly) { _, _ in
                        WKInterfaceDevice.current().play(.click)
                    }
                }
                .padding(.vertical, 12)
                .padding(.horizontal, 8)
                .background(AppColors.surface)
                .cornerRadius(12)

                // Info text
                Text("Swipe right to return to timer")
                    .font(.system(size: 10))
                    .foregroundColor(AppColors.textDark)
                    .padding(.top, 4)
            }
            .padding(.horizontal, 4)
            .padding(.top, 8)
        }
        .background(AppColors.background.ignoresSafeArea())
    }

    // MARK: - Actions
    private func incrementDuration() {
        viewModel.durationMinutes = min(180, viewModel.durationMinutes + 1)
        WKInterfaceDevice.current().play(.click)
    }

    private func decrementDuration() {
        viewModel.durationMinutes = max(1, viewModel.durationMinutes - 1)
        WKInterfaceDevice.current().play(.click)
    }
}

// MARK: - Preset Buttons
struct PresetButtonsView: View {
    let presets: [Int]
    let selected: Int
    let onSelect: (Int) -> Void

    // Show fewer presets on small watch screens
    private var displayedPresets: [Int] {
        // Show 5, 10, 15, 30, 60 on watch for space
        return [5, 10, 15, 30, 60]
    }

    var body: some View {
        HStack(spacing: 4) {
            ForEach(displayedPresets, id: \.self) { preset in
                Button(action: {
                    onSelect(preset)
                    WKInterfaceDevice.current().play(.click)
                }) {
                    Text("\(preset)")
                        .font(.system(size: 11, weight: preset == selected ? .semibold : .regular))
                        .foregroundColor(preset == selected ? AppColors.text : AppColors.textMuted)
                        .frame(minWidth: 28, minHeight: 24)
                }
                .buttonStyle(.plain)
                .background(
                    preset == selected ?
                    AppColors.primary :
                    AppColors.surfaceLight
                )
                .cornerRadius(12)
            }
        }
    }
}

// MARK: - Volume Slider
struct VolumeSliderView: View {
    @Binding var volume: Double

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Track background
                Capsule()
                    .fill(AppColors.surfaceLight)
                    .frame(height: 6)

                // Active track
                Capsule()
                    .fill(AppColors.accent)
                    .frame(width: geometry.size.width * volume, height: 6)

                // Thumb
                Circle()
                    .fill(AppColors.sunsetEnd)
                    .frame(width: 14, height: 14)
                    .offset(x: (geometry.size.width - 14) * volume)
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        let newVolume = value.location.x / geometry.size.width
                        volume = min(1, max(0, newVolume))
                    }
                    .onEnded { _ in
                        WKInterfaceDevice.current().play(.click)
                    }
            )
        }
        .frame(height: 20)
    }
}

#Preview {
    SettingsView(viewModel: TimerViewModel())
}
