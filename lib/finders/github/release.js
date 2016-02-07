import assert from "assert";
import request from "request-promise";
import App from "../../models/app";

export default class GithubReleaseFinder {
    constructor(token, owner, repositories) {
        this.token = token;
        this.owner = owner;
        this.repositories = repositories;
    }

    async release(app, name) {
        assert(app instanceof App, "app is not an instance of App");

        if (this.repositories.indexOf(app.name) === -1) {
            return null;
        }

        try {
            const releases = await this.releases(app);

            return releases.find(release => release.name === name) || null;
        } catch (e) {
            return null
        }
    }

    async releases(app) {
        assert(app instanceof App, "app is not an instance of App");

        if (this.repositories.indexOf(app.name) === -1) {
            return null;
        }

        const options = {
            uri: `https://api.github.com/repos/${this.owner}/${app.name}/releases`,
            headers: {
                Authorization: `token ${this.token}`,
                "User-Agent": "neutron"
            },
            json: true
        };

        try {
            const releases = await request(options);

            return releases.map(release => ({
                name: release.tag_name,
                notes: release.body,
                date: release.published_at
            }))
        } catch (e) {
            return [];
        }
    }
}
