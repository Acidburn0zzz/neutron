import q from "q";
import request from "request-promise";

export default class GithubAppFinder {
    constructor(token, owner, repositories) {
        this.token = token;
        this.owner = owner;
        this.repositories = repositories;
    }

    async app(name) {
        if (typeof name === "object") {
            if (this.repositories.indexOf(name.name) === -1) {
                return null;
            }

            return name;
        }

        if (this.repositories.indexOf(name) === -1) {
            return null;
        }

        const options = {
            uri: `https://api.github.com/repos/${this.owner}/${name}`,
            headers: {
                Authorization: `token ${this.token}`,
                "User-Agent": "neutron"
            },
            json: true
        };

        try {
            const repository = await request(options);

            return { name: repository.name };
        } catch (e) {
            return null;
        }
    }

    async apps() {
        const options = {
            uri: `https://api.github.com/users/${this.owner}/repos`,
            headers: {
                Authorization: `token ${this.token}`,
                "User-Agent": "neutron"
            },
            json: true
        };

        try {
            const repositories = await request(options);

            return q.all(repositories.map(async repository => await this.app(repository))).then(apps => apps.filter(app => !!app));
        } catch (e) {
            return [];
        }
    }
}
