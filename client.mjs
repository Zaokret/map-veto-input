import ipc from "node-ipc";
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const id = process.argv[2];

const server = 'server';

ipc.config.silent = true;
ipc.config.id = id;
ipc.config.retry = 0;

let paused = true;

ipc.connectTo(server, function () {
  ipc.of[server].on("connect", function () {
    // ipc.log(`## connected to ${server} ##`, ipc.config.delay);
    ipc.of[server].emit("app.message", {
      id: ipc.config.id,
      message: { type: "connected" }
    })
  });
  ipc.of[server].on("disconnect", function () {
    // ipc.log(`disconnected from ${server}`);
  });
  ipc.of[server].on("app.message", function (data) {
    // console.log(`got a message from ${server} : `, data);
    switch(data.message.type) {
      case 'prompt': {
        if(!paused) {
          rl.question('', (answer) => {
            ipc.of[server].emit("app.message", {
                id: ipc.config.id,
                message: { type: 'input', input: answer },
          });
        })
      }
      } break;
      case 'pause': {
        paused = true;
      }break
      case 'start': {
        paused = false;
      }break;
      case 'info': {
        console.log(data.message)
      } break;
      case 'end': {
        rl.question("Press enter to exit...", () => {
          process.exit();
        })
      } break;
    }
  });
});
