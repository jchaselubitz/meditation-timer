import SwiftUI

// Brand colors extracted from app logo
// Sunset gradient: coral -> orange -> golden yellow
// Water: light blue -> deep blue

struct AppColors {
    // Sunset gradient colors
    static let sunsetStart = Color(hex: "#FF5F45")    // Coral red-orange
    static let sunsetMid = Color(hex: "#FF8C42")      // Warm orange
    static let sunsetEnd = Color(hex: "#FFB347")      // Golden yellow
    static let sunsetGlow = Color(hex: "#FFECD2")     // Light glow at horizon

    // Water/wave colors
    static let waterLight = Color(hex: "#6BB3D9")     // Light blue
    static let waterMid = Color(hex: "#4A90D9")       // Medium blue
    static let waterDeep = Color(hex: "#2E5A88")      // Deep blue
    static let waterDark = Color(hex: "#1A3A5C")      // Darkest blue

    // App colors
    static let background = Color(hex: "#151515")     // Deep dark gray
    static let surface = Color(hex: "#2A2A2A")        // Dark gray
    static let surfaceLight = Color(hex: "#404040")   // Medium gray

    static let primary = Color(hex: "#FF6B4A")        // Main coral/orange
    static let primaryLight = Color(hex: "#FF8C42")   // Lighter orange
    static let primaryMuted = Color(hex: "#FF6B4A").opacity(0.4)

    static let secondary = Color(hex: "#4A90D9")      // Water blue

    static let text = Color.white
    static let textMuted = Color(hex: "#A8C5D9")      // Muted blue-white
    static let textDark = Color(hex: "#6B8BA3")       // Darker muted text

    static let accent = Color(hex: "#FFB347")         // Golden yellow
    static let overtime = Color(hex: "#FF5F45")       // Coral for overtime
}

struct AppGradients {
    static let sunset = LinearGradient(
        colors: [AppColors.sunsetStart, AppColors.sunsetMid, AppColors.sunsetEnd],
        startPoint: .top,
        endPoint: .bottom
    )

    static let sunsetSimple = LinearGradient(
        colors: [AppColors.primary, AppColors.sunsetEnd],
        startPoint: .top,
        endPoint: .bottom
    )

    static let water = LinearGradient(
        colors: [AppColors.waterLight, AppColors.waterMid, AppColors.waterDeep],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let waterDeep = LinearGradient(
        colors: [AppColors.waterMid, AppColors.waterDeep, AppColors.waterDark],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let timerActive = LinearGradient(
        colors: [AppColors.sunsetStart, AppColors.sunsetMid],
        startPoint: .top,
        endPoint: .bottom
    )

    static let timerOvertime = LinearGradient(
        colors: [AppColors.sunsetStart, Color(hex: "#FF3D2E")],
        startPoint: .top,
        endPoint: .bottom
    )
}

// Color extension for hex support
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
