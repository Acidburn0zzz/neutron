import q from "q";
import pkgcloud from "pkgcloud";

export default class AzureAppFinder {
    constructor(account, key) {
        this.client = pkgcloud.storage.createClient({
            provider: "azure",
            storageAccount: account,
            storageAccessKey: key
        });
    }

    async app(name) {
        if (typeof name === "object") {
            return name;
        }

        try {
            await q.ninvoke(this.client, "getContainer", name);

            return { name };
        } catch (e) {
            return null;
        }
    }

    async apps() {
        try {
            const containers = await q.ninvoke(this.client, "getContainers");

            return q.all(containers.map(async container => await this.app(container))).then(apps => apps.filter(app => !!app));
        } catch (e) {
            return [];
        }
    }
}
