import Foundation
import HealthKit

class HealthKitManager: ObservableObject {
    static let shared = HealthKitManager()

    private let healthStore = HKHealthStore()
    @Published var isAuthorized = false

    private let mindfulType = HKObjectType.categoryType(forIdentifier: .mindfulSession)!

    private init() {
        checkAuthorizationStatus()
    }

    // MARK: - Authorization

    var isHealthKitAvailable: Bool {
        HKHealthStore.isHealthDataAvailable()
    }

    func requestAuthorization() {
        guard isHealthKitAvailable else {
            print("HealthKit is not available on this device")
            return
        }

        let typesToWrite: Set<HKSampleType> = [mindfulType]

        healthStore.requestAuthorization(toShare: typesToWrite, read: nil) { [weak self] success, error in
            DispatchQueue.main.async {
                if success {
                    self?.isAuthorized = true
                    print("HealthKit authorization granted")
                } else if let error = error {
                    print("HealthKit authorization failed: \(error.localizedDescription)")
                }
            }
        }
    }

    private func checkAuthorizationStatus() {
        guard isHealthKitAvailable else { return }

        let status = healthStore.authorizationStatus(for: mindfulType)
        DispatchQueue.main.async {
            self.isAuthorized = status == .sharingAuthorized
        }
    }

    // MARK: - Save Mindfulness Session

    func saveMindfulnessSession(startDate: Date, endDate: Date, completion: ((Bool, Error?) -> Void)? = nil) {
        guard isHealthKitAvailable else {
            completion?(false, nil)
            return
        }

        let mindfulSample = HKCategorySample(
            type: mindfulType,
            value: HKCategoryValue.notApplicable.rawValue,
            start: startDate,
            end: endDate
        )

        healthStore.save(mindfulSample) { success, error in
            DispatchQueue.main.async {
                if success {
                    print("Mindfulness session saved to HealthKit")
                } else if let error = error {
                    print("Failed to save mindfulness session: \(error.localizedDescription)")
                }
                completion?(success, error)
            }
        }
    }
}
