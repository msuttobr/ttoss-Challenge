import { io } from "socket.io-client";
import { baseApi, port } from "./apiClient";

const socket = io(`${baseApi}:${port}`, {
    transports: ['websocket']
});

export default socket