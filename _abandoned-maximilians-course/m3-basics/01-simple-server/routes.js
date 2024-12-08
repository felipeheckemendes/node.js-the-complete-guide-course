const fs = require("fs");

function requestHandler(req, res) {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter message</title></head>");
    res.write(
      '<body><form action ="/message" method="POST"><input type="text" name="message"><button type="submit">Send</Button></input></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      }); // Here you should not use the writeFileSunc, because it would block the code execution
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Hello</title></head>");
  res.write("<body><h1>Hello!!!</h1></body>");
  res.write("</html>");
  return res.end();
}

module.exports = requestHandler;
("");
