export * from './types'
export { TokenManager } from './utils/token-manager'

import { AuthService } from './services/auth.service'
import { UserService } from './services/user.service'
import { OnboardingService } from './services/onboarding.service'
import { UserOnboardingService } from './services/user-onboarding.service'

// Facade que expone todos los servicios
export class ApiService {
  // Authentication
  static login = AuthService.login.bind(AuthService)
  static register = AuthService.register.bind(AuthService)
  static logout = AuthService.logout.bind(AuthService)

  // Users
  static getUsers = UserService.getAll.bind(UserService)
  static createUser = UserService.create.bind(UserService)
  static updateUser = UserService.update.bind(UserService)
  static deleteUser = UserService.delete.bind(UserService)

  // Onboardings
  static getOnboardings = OnboardingService.getAll.bind(OnboardingService)
  static createOnboarding = OnboardingService.create.bind(OnboardingService)
  static updateOnboarding = OnboardingService.update.bind(OnboardingService)
  static deleteOnboarding = OnboardingService.delete.bind(OnboardingService)

  // User Onboardings
  static getUserOnboardings = UserOnboardingService.getUserOnboardings.bind(UserOnboardingService)
  static assignOnboarding = UserOnboardingService.assign.bind(UserOnboardingService)
  static updateUserOnboarding = UserOnboardingService.updateState.bind(UserOnboardingService)
  static unassignOnboarding = UserOnboardingService.unassign.bind(UserOnboardingService)
}