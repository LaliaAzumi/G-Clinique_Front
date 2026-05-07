type NotificationHandler = (message: string) => void;

const WS_URL = "ws://localhost:9090/ws-notif";

const buildFrame = (command: string, headers: Record<string, string> = {}, body = "") => {
  const headerLines = Object.entries(headers).map(([key, value]) => `${key}:${value}`);
  return `${command}\n${headerLines.join("\n")}\n\n${body}\0`;
};

const parseMessageBody = (frame: string) => {
  const [, body = ""] = frame.split("\n\n");
  return body.replace(/\0/g, "").trim();
};

export const connectNotifications = (
  user: { id?: number; role?: string } | null,
  onNotification: NotificationHandler
) => {
  if (!user?.id) return () => {};

  let closedByClient = false;
  let reconnectTimer: number | undefined;
  let heartbeatTimer: number | undefined;
  let socket: WebSocket | null = null;

  const connect = () => {
    socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      socket?.send(buildFrame("CONNECT", {
        "accept-version": "1.2",
        "heart-beat": "10000,10000",
      }));
    };

    socket.onmessage = (event) => {
      const data = String(event.data);

      if (data.startsWith("CONNECTED")) {
        socket?.send(buildFrame("SUBSCRIBE", {
          id: "user-notifications",
          destination: `/topic/notifications-${user.id}`,
        }));

        if (user.role === "SECRETAIRE") {
          socket?.send(buildFrame("SUBSCRIBE", {
            id: "secretary-notifications",
            destination: "/topic/notifications-secretaires",
          }));
        }

        heartbeatTimer = window.setInterval(() => socket?.send("\n"), 10000);
        return;
      }

      if (data.startsWith("MESSAGE")) {
        const message = parseMessageBody(data);
        if (message) onNotification(message);
      }
    };

    socket.onclose = () => {
      if (heartbeatTimer) window.clearInterval(heartbeatTimer);
      if (!closedByClient) {
        reconnectTimer = window.setTimeout(connect, 3000);
      }
    };
  };

  connect();

  return () => {
    closedByClient = true;
    if (reconnectTimer) window.clearTimeout(reconnectTimer);
    if (heartbeatTimer) window.clearInterval(heartbeatTimer);
    socket?.close();
  };
};
