const http = require("http");

function routes(req, res) {
  url = req.url;
  method = req.method;
  //   console.log(url);

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html><body>");
    res.write("<head><title>Create username</title></head>");
    res.write(
      "<h1>Hello, in order to create a new user, please type username below:<h1>"
    );
    res.write('<form action="/create-user" method="POST">');
    res.write(
      '<input type = "text" name="chosen-username" ><button type="submit">Create new user</button></input>'
    );
    res.write("</form>");
    res.write("</body></html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html><body>");
    res.write("<head><title>List of users</title></head>");
    res.write("<h1>This is the list of users:</h1>");
    res.write("<ul>");
    res.write("<li>Aragorn</li>");
    res.write("<li>Frodo</li>");
    res.write("<li>Gandalf</li>");
    res.write("</ul>");
    res.write("</body></html>");
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const content = parsedBody.split("=")[1];
      console.log(content);
    });
  }
}

server = http.createServer(routes);

server.listen(3000);
