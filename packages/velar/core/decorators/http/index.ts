import { HTTP_METHOD_KEY, PARAMS_META_KEY, PATH_KEY } from "../../constants";
import { HandlerParamType, HttpMethod } from "../../enums";

function getRouteDecorator(httpMethod: HttpMethod, path: string) {
	return function (target: any, key: string) {
		Reflect.defineMetadata(HTTP_METHOD_KEY, httpMethod, target, key);
		Reflect.defineMetadata(PATH_KEY, path, target, key);
	};
}

export function Get(path: string) {
	return getRouteDecorator(HttpMethod.GET, path);
}

export function Post(path: string) {
	return getRouteDecorator(HttpMethod.POST, path);
}

function getHandlerParamDecorator(type: HandlerParamType, key: string) {
	return function (target: any, methodName: string, index: number) {
		const paramsMeta =
			Reflect.getMetadata(PARAMS_META_KEY, target, methodName) ?? {};
		paramsMeta[index] = { key, type };
		Reflect.defineMetadata(PARAMS_META_KEY, paramsMeta, target, methodName);
	};
}

export function Param(key?: string) {
	return getHandlerParamDecorator(HandlerParamType.ROUTE_PARAM, key);
}

export function Body(key?: string) {
	return getHandlerParamDecorator(HandlerParamType.BODY, key);
}
