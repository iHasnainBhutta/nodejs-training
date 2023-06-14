require("dotenv").config();
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.writeHead(204, { "Content-Type": "image/x-icon" });
    res.end();
    return;
  }

  if (req.url === "/index.html") {
    const pathname = req.url;
    fs.readFile(pathname.substring(1), "utf8", function (err, data) {
      if (err) {
        res.end("<h1>404 Not Found</h1>");
        console.log(err);
        res.writeHead(404, { "Content-Type": "text/html" });
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data.toString());
        res.end();
      }
    });
  }
  if (req.url === "/about.html") {
    const pathname = req.url;
    fs.readFile(pathname.substring(1), "utf8", function (err, data) {
      if (err) {
        res.end("<h1>404 Not Found</h1>");
        console.log(err);
        res.writeHead(404, { "Content-Type": "text/html" });
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data.toString());
        res.end();
      }
    });
  }
  if (req.url === "/skills.html") {
    const pathname = req.url;
    const readableStream = fs.createReadStream(pathname.substring(1), "utf-8");

    readableStream.on("data", (chunk) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(chunk);
      console.log(chunk);
      res.end();
    });
    readableStream.on("error", (error) => {
      console.error("An error occurred:", error);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>");
    });
  }
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
