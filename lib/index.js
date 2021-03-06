import "babel-polyfill";
import Koa from "koa";
import logger from "koa-logger";
import json from "koa-json";
import Router from "koa-router";
import fs from "fs";
import config from "./config";
import AppFinder from "./finders/app";
import AppSerializer from "./serializers/app";
import ReleaseFinder from "./finders/release";
import ReleaseSerializer from "./serializers/release";
import UrlGenerator from "./utils/urlGenerator";
import AppController from "./controllers/app";
import ReleaseController from "./controllers/release";
import UpdateController from "./controllers/update";
import ReleaseDownloader from "./downloaders/release";

const app = new Koa();
const router = new Router();
const apps = new Router();
const releases = new Router();
const urlGenerator = new UrlGenerator(`${config.scheme}://${config.host}:${config.public_port}`, router);
const appFinder = new AppFinder(config, new AppSerializer());
const releaseFinder = new ReleaseFinder(config, new ReleaseSerializer());
const downloader = new ReleaseDownloader(config);
const appController = new AppController(appFinder, releaseFinder, urlGenerator, downloader);
const releaseController = new ReleaseController(appFinder, releaseFinder, urlGenerator);
const updateController = new UpdateController(appFinder, releaseFinder, urlGenerator, downloader);

releases
    .get("api-v1-releases", "/", function *() {
        yield releaseController.listAction(this, this.params.app);
    })
    .get("api-v1-release", "/:version", function *() {
        yield releaseController.showAction(this, this.params.app, this.params.version);
    })
    .get("api-v1-release-download", "/:version/download", function *() {
        yield updateController.downloadReleaseAction(this, this.params.app, this.params.version);
    })
;

apps
    .get("api-v1-apps", "/", function *() {
        yield appController.listAction(this);
    })
    .get("api-v1-app", "/:app", function *() {
        yield appController.showAction(this, this.params.app);
    })
    .get("api-v1-app-update", "/:app/update/:version", function *() {
        yield updateController.nextAction(this, this.params.app, this.params.version);
    })
    .use("/:app/releases", releases.routes(), releases.allowedMethods())
;

router
    .get("api-v1", "/v1", function *() {
        this.body = { apps: "/apps" };
    })
    .use("/v1/apps", apps.routes(), apps.allowedMethods())
;

app
    .use(logger())
    .use(json())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(config.private_port)
;

if (config.pid) {
    fs.writeFile(config.pid, process.pid);
}

process.on("SIGTERM", () => process.exit(0));
