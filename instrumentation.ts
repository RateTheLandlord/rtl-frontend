import { validateRuntimeEnvironment } from '@/lib/env'

export function register() {
	validateRuntimeEnvironment()
}
