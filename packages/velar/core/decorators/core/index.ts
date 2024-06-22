import { CONTROLLER_PREFIX_KEY } from "../../constants";
import { ClassType } from "../../types";

export function Controller(prefix?: string) {
	return function (target: ClassType) {
		Reflect.defineMetadata(CONTROLLER_PREFIX_KEY, prefix ?? "", target);
	};
}

export function Injectable() {
	return function (_: ClassType) {};
}
