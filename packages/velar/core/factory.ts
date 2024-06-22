import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "reflect-metadata";
import {
	CONTROLLERS_KEY,
	CONTROLLER_PREFIX_KEY,
	DESIGN_PARAM_TYPES,
	HTTP_METHOD_KEY,
	PARAMS_META_KEY,
	PATH_KEY,
	PROVIDERS_KEY,
} from "./constants";
import { HandlerParamType } from "./enums";
import { ClassType } from "./types";

class VelarFactory {
	create(module: ClassType) {
		const app = express();
		app.use(bodyParser.json());

		const providerInstances = new Map();

		function instantiateProvider(Cls: ClassType) {
			if (providerInstances.has(Cls)) return providerInstances.get(Cls);

			const deps = Reflect.getMetadata(DESIGN_PARAM_TYPES, Cls) ?? [];
			const params = deps.map(instantiateProvider);

			const instance = new Cls(...params);

			providerInstances.set(Cls, instance);

			return instance;
		}

		Reflect.getMetadata(PROVIDERS_KEY, module).forEach(instantiateProvider);

		Reflect.getMetadata(CONTROLLERS_KEY, module).forEach(
			(ControllerCls: ClassType) => {
				const params = Reflect.getMetadata(
					DESIGN_PARAM_TYPES,
					ControllerCls
				).map((ProviderCls: ClassType) => {
					if (!providerInstances.has(ProviderCls))
						throw new Error(
							`You forgot to add ${ProviderCls.name} to the providers array of the module`
						);
					return providerInstances.get(ProviderCls);
				});
				const controller = new ControllerCls(...params);

				let prefix = Reflect.getMetadata(CONTROLLER_PREFIX_KEY, ControllerCls);
				if (prefix && !prefix.startsWith("/")) prefix = `/${prefix}`;

				Reflect.ownKeys(ControllerCls.prototype)
					.filter((property: any) => {
						return Reflect.hasOwnMetadata(
							HTTP_METHOD_KEY,
							ControllerCls.prototype,
							property
						);
					})
					.forEach((method: any) => {
						const paramsMeta =
							Reflect.getMetadata(
								PARAMS_META_KEY,
								ControllerCls.prototype,
								method
							) ?? {};

						const httpMethod = Reflect.getMetadata(
							HTTP_METHOD_KEY,
							controller,
							method
						);

						const path = Reflect.getMetadata(PATH_KEY, controller, method);
						const fullPath = `${prefix}${path}`;

						app[httpMethod](fullPath, async (req: Request, res: Response) => {
							const params = Reflect.getMetadata(
								DESIGN_PARAM_TYPES,
								ControllerCls.prototype,
								method
							).map((_: any, index: number) => {
								const paramMeta = paramsMeta[index];

								if (!paramMeta) return undefined;

								const dataToPass = {
									[HandlerParamType.BODY]: req.body,
									[HandlerParamType.ROUTE_PARAM]: req.params,
								}[paramMeta.type];

								if (paramMeta.key) return dataToPass[paramMeta.key];
								return dataToPass;
							});
							res.send(await controller[method](...params));
						});
					});
			}
		);
		return app;
	}
}

export const Velar = new VelarFactory();
