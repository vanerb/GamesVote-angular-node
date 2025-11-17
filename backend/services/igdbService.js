const axios = require("axios");

class IgdbService {
    constructor() {
        this.clientId = process.env.IGDB_CLIENT_ID;
        this.clientSecret = process.env.IGDB_CLIENT_SECRET;
        this.accessToken = null;
        this.tokenExpiresAt = 0;
        this.baseUrl = "https://api.igdb.com/v4";
    }

    async init() {
        await this.refreshAccessToken();
    }

    async refreshAccessToken() {
        if (!this.clientId || !this.clientSecret) {
            throw new Error("Faltan credenciales de IGDB en variables de entorno");
        }

        try {
            const res = await axios.post(
                "https://id.twitch.tv/oauth2/token",
                null,
                {
                    params: {
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                        grant_type: "client_credentials",
                    },
                }
            );

            this.accessToken = res.data.access_token;
            this.tokenExpiresAt = Date.now() + res.data.expires_in * 1000 - 60000;
            console.log("Nuevo token IGDB generado");
        } catch (err) {
            console.error("Error obteniendo token IGDB:", err.response?.data || err.message);
            throw new Error("No se pudo generar token IGDB");
        }
    }

    async makeRequest(endpoint, query) {
        if (!this.accessToken || Date.now() >= this.tokenExpiresAt) {
            await this.refreshAccessToken();
        }

        try {
            const response = await axios.post(
                `${this.baseUrl}/${endpoint}`,
                query,
                {
                    headers: {
                        "Client-ID": this.clientId,
                        "Authorization": `Bearer ${this.accessToken}`,
                        "Accept": "application/json",
                        "Content-Type": "text/plain",
                    },
                }
            );

            return response.data;
        } catch (err) {
            console.error("IGDB Error response:", err.response?.data);
            console.error("IGDB Error status:", err.response?.status);
            throw new Error(err.response?.data || "Error en IGDB API");
        }
    }

    async getGames(search = "", filters = {}, limit = 10, offset = 0) {
        const whereClauses = [];

        // 1️⃣ Buscar por texto
        const searchQuery = search.trim() ? `search "${search}";` : "";

        // 2️⃣ Filtrar por géneros (solo si hay elementos)
        if (Array.isArray(filters.genres) && filters.genres.length > 0) {
            whereClauses.push(`genres = (${filters.genres.join(",")})`);
        }

        // 3️⃣ Filtrar por plataformas (solo si hay elementos)
        if (Array.isArray(filters.platforms) && filters.platforms.length > 0) {
            whereClauses.push(`platforms = (${filters.platforms.join(",")})`);
        }

        // 4️⃣ Filtrar por rating (0-10 convertido a 0-100)
        if (filters.minRating != null && !isNaN(filters.minRating)) {
            const min = Math.min(Math.max(filters.minRating * 10, 0), 100); // aseguramos rango 0-100
            whereClauses.push(`rating >= ${min}`);
        }
        if (filters.maxRating != null && !isNaN(filters.maxRating)) {
            const max = Math.min(Math.max(filters.maxRating * 10, 0), 100);
            whereClauses.push(`rating <= ${max}`);
        }

        // 5️⃣ Filtrar por año
        if (filters.year != null && !isNaN(filters.year)) {
            const from = Math.floor(new Date(filters.year, 0, 1).getTime() / 1000);
            const to = Math.floor(new Date(filters.year, 11, 31).getTime() / 1000);
            whereClauses.push(`first_release_date >= ${from} & first_release_date <= ${to}`);
        }

        // 6️⃣ Construir WHERE solo si hay filtros
        const whereQuery = whereClauses.length ? `where ${whereClauses.join(" & ")};` : "";

        // 7️⃣ Campos a traer
        const fields = `
        fields name, first_release_date, rating, cover.url, platforms.name, summary,
        genres.name, screenshots.url, storyline, videos.video_id,
        involved_companies.company.name;
    `;

        // 8️⃣ Orden dinámico
        let sortQuery = "";
        if (!search) {
            // Solo ordenamos si no hay búsqueda
            if (filters.sortBy) {
                const order = filters.sortOrder === "asc" ? "asc" : "desc";
                sortQuery = `sort ${filters.sortBy} ${order};`;
            } else {
                sortQuery = `sort first_release_date desc;`;
            }
        }

        // 9️⃣ Query final
        const query = `
        ${searchQuery}
        ${fields}
        ${whereQuery}
        ${sortQuery}
        limit ${limit};
        offset ${offset};
    `;

        console.log("IGDB QUERY:", query); // Para debug

        return this.makeRequest("games", query);
    }





    async getGameById(id) {
        const query = `fields name,first_release_date,rating,cover.url,platforms.name,summary,genres.name,screenshots.url,storyline,videos.video_id,involved_companies.company.name; where id = ${id};`;
        return this.makeRequest("games", query);
    }


    async getPlatforms(){
        const query = `fields id,name; limit 120; offset 0;`;
        return this.makeRequest("genres", query);
    }
}

module.exports = IgdbService;
