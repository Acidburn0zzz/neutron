import path from "path";

export default {
    scheme: process.env.NEUTRON_SCHEME || "http",
    host: process.env.NEUTRON_HOST || "localhost",
    public_port: process.env.NEUTRON_PORT || 8080,
    private_port: process.env.PORT || process.env.NEUTRON_PORT || 8080,
    pid: process.env.NEUTRON_PID_FILE || null,
    storage: process.env.NEUTRON_STORAGE || "local",
    local: {
        directory: process.env.NEUTRON_STORAGE_LOCAL_DIRECTORY || path.join(__dirname, "..", "updates")
    },
    azure: {
        account: process.env.NEUTRON_STORAGE_AZURE_ACCOUNT || "account",
        key: process.env.NEUTRON_STORAGE_AZURE_KEY || "themagickey"
    },
    amazon: {
        key: process.env.NEUTRON_STORAGE_AMAZON_KEY || "themagickey",
        secret: process.env.NEUTRON_STORAGE_AMAZON_SECRET || "notsosecret",
        region: process.env.NEUTRON_STORAGE_AMAZON_REGION || "us-west-2"
    },
    github: {
        token: process.env.NEUTRON_STORAGE_GITHUB_TOKEN || "octoken",
        owner: process.env.NEUTRON_STORAGE_GITHUB_OWNER || "octocat",
        repositories: JSON.parse(process.env.NEUTRON_STORAGE_GITHUB_REPOSITORIES || "false") || []
    }
}
