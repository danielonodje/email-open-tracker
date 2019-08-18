declare module 'require-environment-variables' {
	interface RequireEnvironmentVariables {
		(envVariables: string[]): void;
	}

	var requireEnv: RequireEnvironmentVariables;

	export default requireEnv;
}
