import fs from "fs";
import path from "path";
import q from "q";
import LocalAppFinder from "./local/app";
import AmazonAppFinder from "./amazon/app";
import AzureAppFinder from "./azure/app";
import GithubAppFinder from "./github/app";

export default class AppFinder {
    constructor(config, serializer) {
        this.serializer = serializer;

        switch (config.storage) {
            case "local":
                this.finder = new LocalAppFinder(config.local.directory);
                break;

            case "amazon":
                this.finder = new AmazonAppFinder(config.amazon.key, config.amazon.secret, config.amazon.region);
                break;

            case "azure":
                this.finder = new AzureAppFinder(config.azure.account, config.azure.key);
                break;

            case "github":
                this.finder = new GithubAppFinder(config.github.token, config.github.owner, config.github.repositories);
                break;
        }
    }

    async app(name) {
        const app = await this.finder.app(name);

        if (app === null) {
            return null;
        }

        return this.serializer.unserialize(app);
    }

    async apps() {
        const apps = (await this.finder.apps()).filter(app => !!app);

        return apps.map(app => this.serializer.unserialize(app));
    }
}
