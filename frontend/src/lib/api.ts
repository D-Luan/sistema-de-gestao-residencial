import axios from "axios";

// Instância centralizada para facilitar a manutenção da URL base e headers globais.
export const api = axios.create({
    baseURL: "https://localhost:7278/api",
    headers: {
        "Content-Type": "application/json",
    },
});