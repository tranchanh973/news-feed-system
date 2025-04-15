import { WebSocketServer } from "ws";
import { NextApiRequest, NextApiResponse } from "next";

// Khởi tạo WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (res.socket && !(res.socket as any).server.wss) {
      console.log("Initializing WebSocket server...");
      (res.socket as any).server.wss = wss;

      (res.socket as any).server.on(
        "upgrade",
        (
          request: import("http").IncomingMessage,
          socket: import("net").Socket,
          head: Buffer
        ) => {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
          });
        }
      );
    }
    res.status(200).send("WebSocket server is running");
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser để hỗ trợ WebSocket
  },
};
