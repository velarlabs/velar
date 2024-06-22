import { CONTROLLERS_KEY, PROVIDERS_KEY } from "../../constants";
import { ClassType } from "../../types";

export function Module({
	providers,
	controllers,
}: {
	providers: ClassType[];
	controllers: ClassType[];
}) {
	return function (target: ClassType) {
		Reflect.defineMetadata(PROVIDERS_KEY, providers, target);
		Reflect.defineMetadata(CONTROLLERS_KEY, controllers, target);
	};
}
