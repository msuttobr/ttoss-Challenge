import { io } from "socket.io-client";

const baseApi = import.meta.env.VITE_BASE_API;
const port = import.meta.env.VITE_PORT;

const socket = io(`${baseApi}:${port}`, {
    transports: ['websocket']
});

export default socket