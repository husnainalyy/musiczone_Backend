import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovie(req, res) {
    try {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
        const limited = data.results.slice(0, 5);
        res.json({ success: true, content: limited });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getNowPlayingMovies(req, res) {
    try {
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/movie/now_playing");
        res.json({ success: true, content: data.results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getMovieTrailer(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);

        // Filter for official trailers
        const trailers = data.results.filter(video =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
        );

        if (trailers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No official trailer found for this movie"
            });
        }

        // Get the first official trailer
        res.json({ success: true, trailer: trailers[0] });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getMovieDetails(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.status(200).json({ success: true, content: data });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getSimilarMovies(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getRecommendationMovies(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`);
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getMoviesByCategory(req, res) {
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
