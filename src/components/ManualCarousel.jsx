import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';

export default function ManualCarousel({ mediaType, timeWindow }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchRef = useRef(null);

    const API_KEY = "4c2b98d248efaa8035b951b8303b65e7";
    const BASE_URL = "https://api.themoviedb.org/3";

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint;
                if (timeWindow === 'week') {
                    endpoint = '/trending/' + mediaType + '/week';
                } else if (timeWindow === 'year') {
                    endpoint = `/${mediaType}/popular`;
                } else {
                    endpoint = `/${mediaType}/top_rated`;
                }

                const response = await axios.get(`${BASE_URL}${endpoint}`, {
                    params: {
                        api_key: API_KEY,
                        language: 'es-ES'
                    }
                });

                setItems(response.data.results.slice(0, 5));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mediaType, timeWindow]);

    const handleAddToList = async (item) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            const authToken = localStorage.getItem("authToken");
            const endpoint = mediaType === 'movie' ? 'movies' : 'series';
            const query = mediaType === 'movie' ? item.title : item.name;

            await axios.post(
                `http://localhost:5005/api/${endpoint}/search`,
                { query },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
        } catch (error) {
            console.error('Error adding to list:', error);
        }
    };


    if (loading) {
        return <div className="loading loading-spinner loading-lg"></div>;
    }

    return (
        <div className="relative">
            <div className="carousel w-full h-[70vh]">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        id={`slide${index + 1}`}
                        className="carousel-item relative w-full"
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                            alt={item.title || item.name}
                            className="w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                {item.title || item.name}
                            </h2>
                            <p className="text-white text-lg mb-4">
                                {item.overview}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="text-white text-sm">
                                    Valoración: {item.vote_average} ⭐
                                </div>
                                <button
                                    onClick={() => handleAddToList(item)}
                                    className="btn btn-primary"
                                >
                                    Añadir a mi lista
                                </button>
                            </div>
                        </div>
                        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                            <a
                                href={`#slide${index === 0 ? items.length : index}`}
                                className="btn btn-circle"
                            >
                                ❮
                            </a>
                            <a
                                href={`#slide${index === items.length - 1 ? 1 : index + 2}`}
                                className="btn btn-circle"
                            >
                                ❯
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}