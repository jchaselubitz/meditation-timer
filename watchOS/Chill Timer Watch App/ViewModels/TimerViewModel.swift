import SwiftUI
import WatchKit
import Combine

enum TimerState: String {
    case idle
    case running
    case overtime
    case paused
}

class TimerViewModel: NSObject, ObservableObject, WKExtendedRuntimeSessionDelegate {
    // MARK: - Published Properties
    @Published var timerState: TimerState = .idle
    @Published var elapsedSeconds: Int = 0
    @Published var targetSeconds: Int = 0
    @Published var overtimeSeconds: Int = 0

    // Settings
    @Published var durationMinutes: Int = 10 {
        didSet {
            saveDuration()
        }
    }
    @Published var gongVolume: Double = 0.7 {
        didSet {
            saveVolume()
        }
    }
    @Published var hapticOnly: Bool = false {
        didSet {
            saveHapticOnly()
        }
    }

    // MARK: - Private Properties
    private var timer: Timer?
    private var startTime: Date?
    private var sessionStartTime: Date?  // Track when the meditation session began
    private var accumulatedSeconds: Int = 0
    private var gongPlayed: Bool = false
    private let healthKitManager = HealthKitManager.shared
    private var extendedRuntimeSession: WKExtendedRuntimeSession?

    // UserDefaults keys
    private let durationKey = "meditation_duration"
    private let volumeKey = "meditation_volume"
    private let hapticOnlyKey = "meditation_haptic_only"

    // Preset durations
    let presetDurations = [5, 10, 15, 20, 30, 45, 60]

    // MARK: - Computed Properties
    var formattedTime: String {
        let seconds: Int
        if timerState == .overtime || (timerState == .paused && elapsedSeconds >= targetSeconds) {
            seconds = overtimeSeconds
        } else if timerState == .idle {
            seconds = targetSeconds
        } else {
            seconds = max(0, targetSeconds - elapsedSeconds)
        }

        let mins = seconds / 60
        let secs = seconds % 60
        return String(format: "%02d:%02d", mins, secs)
    }

    var isOvertime: Bool {
        timerState == .overtime || (timerState == .paused && targetSeconds > 0 && elapsedSeconds >= targetSeconds)
    }

    var progress: Double {
        guard targetSeconds > 0 else { return 0 }
        if timerState == .idle { return 0 }
        return min(1.0, Double(elapsedSeconds) / Double(targetSeconds))
    }

    var statusText: String {
        switch timerState {
        case .idle:
            return "Meditate for \(durationMinutes) min"
        case .running:
            return "Time remaining"
        case .overtime:
            return "Overtime"
        case .paused:
            return "Paused"
        }
    }

    // MARK: - Initialization
    override init() {
        super.init()
        loadSettings()
        healthKitManager.requestAuthorization()
    }

    // MARK: - Settings Persistence
    private func loadSettings() {
        let defaults = UserDefaults.standard
        if let savedDuration = defaults.object(forKey: durationKey) as? Int {
            durationMinutes = savedDuration
        }
        if let savedVolume = defaults.object(forKey: volumeKey) as? Double {
            gongVolume = savedVolume
        }
        hapticOnly = defaults.bool(forKey: hapticOnlyKey)
    }

    private func saveDuration() {
        UserDefaults.standard.set(durationMinutes, forKey: durationKey)
    }

    private func saveVolume() {
        UserDefaults.standard.set(gongVolume, forKey: volumeKey)
    }

    private func saveHapticOnly() {
        UserDefaults.standard.set(hapticOnly, forKey: hapticOnlyKey)
    }

    // MARK: - Timer Controls
    func startTimer() {
        let target = durationMinutes * 60
        targetSeconds = target
        elapsedSeconds = 0
        overtimeSeconds = 0
        timerState = .running
        startTime = Date()
        sessionStartTime = Date()  // Track session start for HealthKit
        accumulatedSeconds = 0
        gongPlayed = false

        startExtendedRuntimeSession()
        startInterval()

        // Haptic feedback for starting
        playHaptic(.start)
    }

    func stopTimer() {
        stopInterval()
        endExtendedRuntimeSession()

        let totalElapsed = getTotalElapsedSeconds()
        elapsedSeconds = totalElapsed

        if totalElapsed > targetSeconds {
            overtimeSeconds = totalElapsed - targetSeconds
        }

        // Save mindfulness session to HealthKit
        if let sessionStart = sessionStartTime, totalElapsed > 0 {
            let sessionEnd = Date()
            healthKitManager.saveMindfulnessSession(startDate: sessionStart, endDate: sessionEnd)
        }

        timerState = .idle
        startTime = nil
        sessionStartTime = nil

        // Haptic feedback for stopping
        playHaptic(.stop)
    }

    func pauseTimer() {
        guard timerState == .running || timerState == .overtime else { return }

        let totalElapsed = getTotalElapsedSeconds()
        accumulatedSeconds = totalElapsed
        elapsedSeconds = totalElapsed

        if totalElapsed > targetSeconds {
            overtimeSeconds = totalElapsed - targetSeconds
        }

        stopInterval()
        startTime = nil
        timerState = .paused

        // Haptic feedback for pausing
        playHaptic(.click)
    }

    func resumeTimer() {
        guard timerState == .paused, targetSeconds > 0 else { return }

        startTime = Date()

        let currentElapsed = accumulatedSeconds

        if currentElapsed >= targetSeconds {
            timerState = .overtime
        } else {
            timerState = .running
        }

        startInterval()

        // Haptic feedback for resuming
        playHaptic(.click)
    }

    func resetTimer() {
        stopInterval()
        endExtendedRuntimeSession()
        timerState = .idle
        elapsedSeconds = 0
        overtimeSeconds = 0
        targetSeconds = 0
        startTime = nil
        sessionStartTime = nil  // Don't save session on reset
        accumulatedSeconds = 0
        gongPlayed = false

        // Haptic feedback for reset
        playHaptic(.retry)
    }

    // MARK: - Private Methods
    private func startInterval() {
        stopInterval()
        tick()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.tick()
        }
    }

    private func stopInterval() {
        timer?.invalidate()
        timer = nil
    }

    private func tick() {
        let totalElapsed = getTotalElapsedSeconds()
        elapsedSeconds = totalElapsed

        if totalElapsed >= targetSeconds && !gongPlayed {
            gongPlayed = true
            // Play soothing haptic pattern for timer completion
            // This provides a gentle awakening when in silent mode
            playSoothingCompletionHaptic()
            timerState = .overtime
        }

        if totalElapsed > targetSeconds {
            overtimeSeconds = totalElapsed - targetSeconds
        } else {
            overtimeSeconds = 0
        }
    }

    private func getTotalElapsedSeconds() -> Int {
        guard let start = startTime else {
            return accumulatedSeconds
        }

        let runElapsed = Int(Date().timeIntervalSince(start))
        return accumulatedSeconds + max(0, runElapsed)
    }

    private func playHaptic(_ type: WKHapticType) {
        WKInterfaceDevice.current().play(type)
    }

    /// Plays a soothing multi-pulse haptic pattern for meditation completion.
    /// Creates a gentle "wave" sensation: soft pulse → pause → gentle rise → pause → soft pulse
    /// This provides a calming awakening rather than a jarring single vibration.
    private func playSoothingCompletionHaptic() {
        let device = WKInterfaceDevice.current()

        // First gentle pulse - soft success feeling
        device.play(.success)

        // Sequence of gentle haptics with pauses to create a wave-like pattern
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            device.play(.directionUp)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            device.play(.success)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
            device.play(.directionUp)
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) {
            device.play(.success)
        }
    }

    // MARK: - Extended Runtime Session
    private func startExtendedRuntimeSession() {
        // End any existing session before starting a new one
        endExtendedRuntimeSession()

        let session = WKExtendedRuntimeSession()
        session.delegate = self
        session.start()
        extendedRuntimeSession = session
    }

    private func endExtendedRuntimeSession() {
        guard let session = extendedRuntimeSession else { return }
        if session.state == .running || session.state == .scheduled {
            session.invalidate()
        }
        extendedRuntimeSession = nil
    }

    // MARK: - WKExtendedRuntimeSessionDelegate
    func extendedRuntimeSession(_ extendedRuntimeSession: WKExtendedRuntimeSession, didInvalidateWith reason: WKExtendedRuntimeSessionInvalidationReason, error: Error?) {
        // Session was invalidated (expired or error)
        // The timer will continue running but won't fire in background anymore
        self.extendedRuntimeSession = nil
    }

    func extendedRuntimeSessionDidStart(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        // Session started successfully - timer will now run in background
    }

    func extendedRuntimeSessionWillExpire(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        // Session is about to expire - play completion haptic if timer is still running
        if timerState == .running || timerState == .overtime {
            playSoothingCompletionHaptic()
        }
    }
}
