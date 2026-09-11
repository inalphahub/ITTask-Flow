"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const dataFile = path.join(__dirname, "taskflow-accounts.json");

function readAccounts() {
    try {
        return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch (error) {
        return [];
    }
}

function writeAccounts(accounts) {
    fs.writeFileSync(dataFile, JSON.stringify(accounts, null, 2));
}

function isManagerRole(role) {
    return ["administrator", "manager", "project manager", "program manager", "programme manager"]
        .includes(String(role || "").trim().toLowerCase());
}

function send(response, status, payload) {
    response.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    });
    response.end(JSON.stringify(payload));
}

function serveFile(request, response) {
    const requestedPath = decodeURIComponent(request.url.split("?")[0]);
    const relativePath = requestedPath === "/" ? "index.html" : requestedPath.replace(/^\/+/, "");
    const filePath = path.resolve(__dirname, relativePath);
    if (!filePath.startsWith(path.resolve(__dirname) + path.sep)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(error.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain" });
            response.end(error.code === "ENOENT" ? "Not found" : "Unable to read file");
            return;
        }
        const extension = path.extname(filePath).toLowerCase();
        const contentTypes = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".svg": "image/svg+xml",
            ".json": "application/json; charset=utf-8"
        };
        response.writeHead(200, { "Content-Type": contentTypes[extension] || "application/octet-stream" });
        response.end(content);
    });
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";
        request.on("data", chunk => { body += chunk; });
        request.on("end", () => {
            try { resolve(JSON.parse(body || "{}")); } catch (error) { reject(error); }
        });
        request.on("error", reject);
    });
}

const server = http.createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
        send(response, 204, {});
        return;
    }

    if (request.method === "GET") {
        serveFile(request, response);
        return;
    }

    if (request.method !== "POST" || !["/api/register", "/api/login"].includes(request.url)) {
        send(response, 404, { message: "Endpoint not found." });
        return;
    }

    try {
        const body = await readBody(request);
        const email = String(body.email || "").trim().toLowerCase();
        const accounts = readAccounts();

        if (!email || !String(body.password || "")) {
            send(response, 400, { message: "Email and password are required." });
            return;
        }

        if (request.url === "/api/login") {
            const account = accounts.find(item => String(item.email || "").toLowerCase() === email);
            if (!account || account.password !== body.password) {
                send(response, 401, { message: "The email or password is incorrect." });
                return;
            }
            send(response, 200, { account: { ...account, accountType: isManagerRole(account.role) ? "manager" : "employee" } });
            return;
        }

        const account = { ...body, email, accountType: isManagerRole(body.role) ? "manager" : "employee" };
        const existingIndex = accounts.findIndex(item => String(item.email || "").toLowerCase() === email);
        if (existingIndex >= 0) accounts[existingIndex] = account;
        else accounts.push(account);
        writeAccounts(accounts);
        send(response, 201, { account });
    } catch (error) {
        send(response, 400, { message: "Invalid request." });
    }
});

server.listen(port, "0.0.0.0", () => {
    console.log(`TaskFlow auth API running at http://127.0.0.1:${port}`);
});
